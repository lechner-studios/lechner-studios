# Design — Service-page redesign (webdesign / apps-automation / seo)

**Date:** 2026-06-18
**Repo:** `lechner-studios` (the umbrella brand site)
**Status:** Design — awaiting owner review before implementation plan.
**Source:** Brand-site audit P1-1 (`docs/audits/2026-06-18-brand-site-audit.md`) — the three service pages are "undifferentiated text-walls… reads as a Word doc, not a studio that commands authority." This is the single biggest "why isn't this good enough" driver.

## Goal

Turn the three service pages from a single stacked-paragraph column into a **hybrid showcase** with rhythm, a real artifact, and a tangible "what's included" — bringing them up to the pension page's editorial quality, **without fabricating proof** a young studio doesn't have. All three share one component (`ServiceDetail`), so the redesign is concentrated there and driven per-service by the dictionary.

## What exists today

`src/components/ServiceDetail.tsx` renders all three pages (`/webdesign`, `/apps-automation`, `/seo` each call `<ServiceDetail serviceKey="web|apps|seo" />`). Current structure, one 820px centered column:
overline → big italic headline → intro → `sections[]` (each `{h, p}`, stacked, 48px gap) → italic `proof` quote (left-border) → outlined CTA → related links.

Dict shape (per service, in `src/i18n/dictionaries.ts`, DE + EN):
`serviceDetail[key] = { overline, headline, intro, sections: [{h, p}], proof, ctaLabel, slug, metaTitle, metaDescription }`.

The three page files (`src/app/(site)/[locale]/{webdesign,apps-automation,seo}/page.tsx`) **do not change** — they already render `<ServiceDetail>`.

## Approach — one data-driven hybrid template (Direction "C", owner-approved)

`ServiceDetail` becomes a **flexible** renderer: the dict decides which slots a page uses, so the same template scales from **image-forward** (web) to **structured** (apps/seo). A slot renders only when its data is present.

### Template structure (top → bottom)

1. **Hero.** Overline + the existing big italic-serif headline + intro + outlined CTA. If the service has a `heroArtifact` (image) → two-column hero with the artifact in the first viewport (web). If not → text-only hero (apps/seo). Headline/intro typography unchanged.
2. **Method blocks** — `sections[]` (the existing `{h, p}`). Each section may carry an optional `artifact` (image). When present, blocks render as **alternating** image↔prose (left/right by index); when absent, they render as clean stacked text. So web alternates with demo shots; apps/seo stack as prose.
3. **How it works** — optional `steps[]`: 2–4 numbered, labeled stages in a simple grid (NO connector-timeline; the audit/`feedback_no_generic_gradients` family of tells). Used by apps (and optionally seo); omitted on web.
4. **What's included / we build / we implement** — `included: string[]`: a borderless grid of **checkmark + label** items (see Visual rules). Heading text is per-service (`includedLabel`).
5. **Artifact / proof:**
   - **web** → `proofArtifact`: a row of the four self-hosted demo screenshots (`public/proof/*.webp`) + the existing italic `proof` quote anchored to "→ See the work" (links `/work`).
   - **seo** → `schemaArtifact`: a small dark code block showing the **real** JSON-LD types live on `pension-website-tirol` (Service / AggregateOffer / FAQPage / BreadcrumbList) + a "rich-result-eligible · live on our own pages" line. No metrics.
   - **apps** → none. Capability-only: no artifact, **no self-deprecating disclaimer** — the section is simply absent.
6. **CTA + related links** — unchanged from today (outlined CTA → `/start`; related-service + "see the work" links).

### Dict additions (per service, DE + EN, all optional except `included`)

```
heroArtifact?:  { src: string; alt: string; caption?: string }      // web only
sections[]:     existing {h, p} gains optional  artifact?: { src; alt; caption? }
steps?:         { n: string; label: string }[]                       // apps (+ optional seo)
included:        string[]                                            // all three
includedLabel:   string        // "What's included" / "What we build" / "What we implement"
schemaArtifact?: { lines: string[]; note: string }                   // seo only
proofArtifact?:  { images: { src; alt }[]; workLabel: string }       // web only
```
The existing `proof` italic quote is kept on all three. Authored honestly per the proof matrix below.

## Per-service content plan (the proof matrix — owner-confirmed)

| Page | Hero | Method blocks | How it works | Included | Artifact / proof |
|------|------|---------------|--------------|----------|------------------|
| **web** | image-forward (demo screenshot) | alternating w/ demo shots | — | Hand-coded · Self-hosted · DSGVO by construction · WCAG AA · Responsive · Brand built in | demo proof row + "→ See the work" |
| **apps** | text-only | stacked prose | 3 steps (map → build → it runs, you review) | Custom web apps · Workflow automation · Content pipelines · Internal tools | none (capability-only) |
| **seo** | text-only | stacked prose | optional | Semantic HTML · JSON-LD schema · Sitemap/robots · Internal linking | real JSON-LD code block (no metrics) |

**Honesty rules (binding):** no fabricated metrics or rankings; **Maya is NOT used** on apps until a real client-facing agent ships (then apps gets its showcase); no "no case study" disclaimer text; web reuses existing self-hosted images only. SEO copy stays "correct from day one / rankings follow the work," never a results claim (re-confirms the audit's A2 fix).

## Visual rules

- **"Included" items are borderless** — a checkmark glyph + label, no chip box (a bordered empty square read as an interactive checkbox; owner rejected it). Checkmark = a thin inline-SVG check (`M4 12.5l5 5L20 6.5`, stroke-linecap round), matching the brand's line-icon style.
- **Checkmark color = the service's pillar (Säulen) color**, per the home pillar grid mapping (`Services.tsx`): **web = Stone, apps = Sky, seo = Lake**. BUT Stone (`#D6CDBE`) and Sky (`#8FA8C5`) are too light to be legible as a mark on the cream page bg, and Lake (`#254268`) is invisible in dark mode. So each service page sets a `--svc-accent` CSS custom property with **light + dark values** derived from its pillar family but chosen to read clearly in both modes (graphical-mark legibility ≥3:1, ideally AA):
  - web (Stone family): light = a deep stone/bronze (e.g. `#7A6A4E`), dark = `var(--color-pillar-stone)` `#D6CDBE`
  - apps (Sky family): light = a deep sky/slate (e.g. `#3E5F86`), dark = `var(--color-pillar-sky)` `#8FA8C5`
  - seo (Lake family): light = `var(--color-pillar-lake)` `#254268`, dark = `#8FA8C5`
  - Exact light-mode hexes are finalized against the contrast check during implementation; the constraint (legible in both modes, pillar-family hue) is the spec. `--svc-accent` also tints the page overline for per-service cohesion. The CTA stays the canonical `--accent` outline (site-wide consistency) — only the checkmarks + overline pick up the pillar color.
- **Brand-canon:** Cormorant / General Sans / Italiana / IBM Plex Mono; Alpine palette; token-driven CSS; **no generic gradients / template tells** (no pastel icon-tile grid, no numbered-step+connector, no 3D-tilt mockups). The demo screenshots are shown in plain bordered frames, not tilted device mockups.
- **WCAG AA in BOTH light and dark mode** — text, the per-service accent marks, the seo code block, and any text-over-image. (The audit's dark-mode contrast lesson.)
- **Reveal** wrappers for the rhythm (the hardened version from PR #67 — visible-by-default fallback).

## Components / files

- **Rewrite** `src/components/ServiceDetail.tsx` into the hybrid renderer (conditional slots; keep it one focused component — extract small sub-pieces only if it grows unwieldy, e.g. an `IncludedGrid` / `MethodBlock`).
- **Extend** `src/i18n/dictionaries.ts` — the three `serviceDetail` sub-objects (DE + EN) with the new fields + honest copy.
- **CSS** — new token-driven rules in `src/app/globals.css` (hero two-col, method alternating, steps grid, included grid, schema code block, the `--svc-accent` per-service vars). Mobile collapses to one column (reuse `lc-stack-2col` pattern).
- **Images** — web reuses `public/proof/{pension,gasthof,skischule,tischlerei}.webp`. If the method blocks want 1–2 more distinct demo shots, the owner can drop them in later (the slot falls back to an existing image meanwhile) — no new heavy assets required to ship.
- The three page files are **unchanged**.

## Out of scope

- The P2 audit sweep (pricing §6 note, stone/gold text-token stragglers, /start vs /contact).
- The Brand & Identity 4th pillar (no page).
- Any Maya / client-agent work (separate track — `project_virtual_office_tirol`).
- Bringing the site out of maintenance (owner's call once the punch-list is done).

## Testing / verification

- `npx tsc --noEmit` + `npm run build` clean.
- **Render every service page** desktop (~1280) + mobile (~390), in **light AND dark** mode: hero (image-forward for web, text for apps/seo), alternating method rhythm, steps grid, borderless checkmarks in the right per-service pillar color and legible in both modes, seo code block, web proof row. No text-walls remain.
- **AA contrast** on: body text, the `--svc-accent` overline + checkmarks (both modes), the seo dark code block, CTA, and any text over the demo images.
- **Honesty pass:** no metrics anywhere; no Maya on apps; no disclaimer text; SEO copy is capability not results; images all self-hosted (zero third-party — the site's A4 guarantee holds).
- Brand-canon spot-check: fonts, palette, no generic gradients/tells.

## Self-review

- **Placeholders:** none — the only deferred specifics are (a) the exact light-mode `--svc-accent` hexes (constraint defined: pillar-family hue, ≥3:1 both modes — finalized against the contrast check), and (b) optional extra demo shots (graceful fallback to existing webp). Both are bounded, not gaps.
- **Consistency:** one data-driven template; slots render only when data present, so apps/seo can't look "empty-but-styled"; CTA + related kept; brand-canon + AA + honesty rules applied throughout; reuses the hardened Reveal and existing self-hosted images.
- **Scope:** one component rewrite + dict additions for three services. Single implementation plan.
- **Ambiguity resolved:** "match checks to Säulenfarbe" = per-service pillar hue via `--svc-accent`, with AA-legible light/dark variants (Stone/Sky too light on cream, Lake invisible on dark → mapped). Apps "capability-only" = artifact slot omitted, no disclaimer. "No fabricated case study" was a mockup note, never page copy.
