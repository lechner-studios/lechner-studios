# Design — Blog automation (2 SEO posts/week)

**Date:** 2026-06-19
**Repo:** `lechner-studios` (the brand site)
**Status:** Design — awaiting owner review before implementation plan.
**Why:** The owner wants a sustainable cadence of **2 SEO-optimized, bilingual blog posts per week**. The site is live, so blog content now compounds for SEO. Hand-writing 2/week isn't sustainable; this automates generation while keeping a human merge gate.

## Goal

A scheduled routine that, twice a week, generates one **bilingual (de + en) SEO blog post** that matches the site's existing post DNA, runs scope/honesty + build checks, and **opens a PR** for the owner to review and merge. Merge → Vercel auto-deploys (sitemap + JSON-LD update automatically). No new repo, no new runtime, no auto-publish.

## Decisions (owner-approved)
- **Topic source = hybrid:** a seed keyword universe per pillar + the generator picks an uncovered keyword and dedupes (steerable by editing the seed).
- **Review gate = PR, owner merges** (never auto-publish).
- **Build standalone** — do NOT reuse the ACC pipeline (it's video/social-first; ~50% rewrite to adapt). Only the idea of a Claude client + config-driven prompts carries over.

## Existing blog plumbing (reused as-is — no changes)
- Posts: `content/blog/<slug>.<locale>.md`, parsed by `src/lib/blog.ts` (gray-matter). Frontmatter = 7 fields: `title`, `description` (meta, 50–160 chars), `excerpt` (60–100), `date` (YYYY-MM-DD), `category` (one of "Web & Design" / "Apps & Automation" / "SEO & Growth"), `keywords` (5–7). `slug`/`locale` derive from the filename.
- Bilingual pair: identical slug, `.en.md` + `.de.md`.
- Render + SEO are automatic: `[locale]/blog/[slug]/page.tsx` injects a `BlogPosting` JSON-LD; `src/app/sitemap.ts` auto-includes every slug at build. So publishing = drop both files + merge → redeploy.
- Established post structure: intro → `##` H2 sections → a concrete example → a closing CTA with internal links to the matching pillar page (`/{locale}/webdesign|apps-automation|seo`) **and** `/{locale}/contact`, full-path markdown links.
- 7 existing posts span the 3 pillars (the generator must dedupe against these).

## Architecture

A **GitHub Actions cron** in this repo runs a **Node/TS generator** (same stack as the site; `.github/workflows/main-health.yml` already proves GHA works here). Flow per run:

```
cron (2×/week) → node scripts/blog/generate.mjs
  1. load topics.yaml + existing posts (slugs + keywords)
  2. pick the next uncovered, on-pillar keyword (rotate pillars for balance)
  3. Claude → bilingual post (en + de): frontmatter + body
  4. write content/blog/<slug>.en.md + .de.md
  5. guardrails: scope/honesty lint + frontmatter/link/locale checks + `npm run build`
  6. open a PR (branch blog/auto/<slug>) summarizing topic·keyword·pillar
→ owner reviews + merges → Vercel auto-deploys
```

## Components

### 1. `content/blog/topics.yaml` (seed keyword universe)
Per-pillar lists of target keywords/angles (de-AT + en intent). Example shape:
```yaml
webdesign:
  - keyword: "Website Ladezeit verbessern"
    intent: "why speed matters + what we do technically"
apps-automation: [ ... ]
seo: [ ... ]
```
The owner steers by editing this file. The generator never invents off-pillar topics; it only selects from here (expanding angle/title within the keyword).

### 2. `scripts/blog/generate.mjs` (the generator)
A focused Node script (ESM, uses `@anthropic-ai/sdk` + `gray-matter` already in the repo, or add the SDK). Sub-units, each one responsibility:
- **topic-picker:** reads `topics.yaml` + existing `content/blog/*.md` (via `lib/blog` helpers or direct `fs`); returns the next keyword whose slug isn't already present, rotating Web→Apps→SEO across runs (track last pillar via the most recent post's category, or a tiny state file). Returns `{ pillar, keyword, intent, slug }` (slug = kebab of an LLM-proposed title, dedup-checked).
- **writer:** one Claude call (model: `claude-opus-4-8` or `claude-sonnet-4-6` — pick in plan) with a **system prompt** encoding: the 7-field frontmatter contract; the intro→H2→example→CTA structure; required internal links (pillar page + /contact, correct locale paths); **de-AT Sie-Form** for the German variant as a real localization; and the **scope-safety rules** (no binding prices/quotes, no "Garantie"/"guarantee", brand only as part-of-a-build, SEO framed as technical not Unternehmensberatung, zero fabricated metrics/rankings). Returns structured JSON for BOTH locales: `{ en: {frontmatter, body}, de: {frontmatter, body} }`. Use the SDK's structured/JSON output so parsing is reliable.
- **emitter:** writes `content/blog/<slug>.en.md` + `.de.md` (gray-matter `stringify`), date = today (passed in via env — note: `new Date()` is unavailable in some sandboxes but fine in GHA Node).

### 3. Guardrails (in the generator, fail the run if violated)
- **scope/honesty lint:** reject if body/frontmatter contains a price pattern (`€`/`EUR` + digits), "Garantie"/"guarantee", standalone-branding claims, or `\d+%`/ranking-result claims. (Allowlist the pillar's own neutral terms.)
- **structure checks:** both locales present + slug-matched; all 7 frontmatter fields non-empty; `keywords` length 5–7; at least the pillar-page link + the /contact link present in each locale's body; slug not already in `content/blog/`.
- **build check:** `npm run build` must pass (proves the post renders + sitemap regenerates).
If any check fails → exit non-zero (the GHA run fails loudly, no PR).

### 4. `.github/workflows/blog-generate.yml`
- `on.schedule`: two crons/week (e.g. `min hr * * 1` and `* * 4` — Mon & Thu morning UTC). Plus `workflow_dispatch` for manual runs.
- Steps: checkout → setup-node → `npm ci` → `node scripts/blog/generate.mjs` → create branch + commit the two `.md` files → open PR via `gh pr create` (or `peter-evans/create-pull-request`).
- Secrets: `ANTHROPIC_API_KEY` (repo secret); PRs via the default `GITHUB_TOKEN` (needs `contents: write` + `pull-requests: write` permissions).
- 1 bilingual post per run → 2 PRs/week (small reviewable units).

## Error handling
- Generation/parse error, lint failure, build failure, or no-uncovered-topic-left → run exits non-zero; GHA marks it failed (owner gets the standard Actions failure notification). No partial/broken PR.
- "Topics exhausted" is a soft, expected signal to refill `topics.yaml` — the failure message says so explicitly.

## Out of scope
- Auto-merge / auto-publish (owner reviews every post).
- Autonomous keyword discovery / research APIs (Exa etc.) — the seed list is the source.
- Reusing/!modifying ACC; any video/social output.
- Images per post, analytics, A/B of titles, programmatic-SEO at scale.

## Testing / verification
- **Unit-ish:** topic-picker dedupes correctly against a fixture of existing slugs; rotates pillars; the lint flags a planted price/percent/Garantie and passes a clean post; the emitter produces gray-matter that `lib/blog` re-parses to the same fields.
- **Dry run:** `node scripts/blog/generate.mjs --dry-run` writes to a temp dir + prints the post, runs the lint, does NOT open a PR — used to eyeball quality before enabling the cron.
- **End-to-end:** trigger the workflow via `workflow_dispatch`; confirm it opens a PR with two slug-matched files, the build passes, and the post renders at `/{locale}/blog/<slug>` on the PR's Vercel preview (owner eyeballs both locales).
- **Guardrail:** a fixture post containing "€3.900" / "garantiert" / "+40%" must fail the lint.

## Self-review
- **Placeholders:** model choice (`opus-4-8` vs `sonnet-4-6`) and the exact cron minutes are deliberately left to the plan (bounded knobs, not gaps); the initial `topics.yaml` seed content is owner/first-pass input, structure is specified.
- **Consistency:** reuses the existing 7-field frontmatter + `lib/blog` + sitemap/JSON-LD untouched; PR-gate matches the owner's "review everything" stance and the scope-safety rules from `feedback_services_copy_gewerbe_scope`.
- **Scope:** one focused feature (generate → PR), single plan. Topic content + model tuning are config, not code churn.
- **Ambiguity:** "2/week" = two runs, one bilingual post each (not one run of two). "SEO-optimized" = keyword-targeted frontmatter + internal-linked structure + JSON-LD (already automatic), not paid tooling.
