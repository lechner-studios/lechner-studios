# Blog Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A twice-weekly GitHub Actions job that generates one bilingual (de+en) SEO blog post matching the site's existing post format, runs scope/honesty + build guardrails, and opens a PR for the owner to merge.

**Architecture:** A small set of focused ESM modules under `scripts/blog/` (topic picker → Claude writer → emitter → lint), wired by `scripts/blog/generate.mjs`, invoked by `.github/workflows/blog-generate.yml`. Topics come from a steerable `content/blog/topics.yaml`; dedup is by slug against existing `content/blog/*.md`. Nothing auto-publishes — the workflow opens a PR.

**Tech Stack:** Node ESM (`.mjs`, repo is `type: commonjs` so use `.mjs`), `@anthropic-ai/sdk` + `gray-matter` (already deps), `js-yaml` (add), Node's built-in `node:test` runner (no new test dep), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-06-19-blog-automation-design.md`

**Working dir:** repo root `C:/Users/blaqu/dev/lechner-studios`, branch `feat/blog-automation`. Prefix bash with `cd /c/Users/blaqu/dev/lechner-studios &&`. Run unit tests with `node --test scripts/blog/`.

---

## File map
- **Create** `content/blog/topics.yaml` — seed keyword universe per pillar (owner-steerable). (Task 1)
- **Create** `scripts/blog/topics.mjs` — `loadTopics`, `existingSlugs`, `pickTopic` (dedup + pillar balance). (Task 2)
- **Create** `scripts/blog/lint.mjs` — `lintPost` (scope/honesty + structure checks). (Task 3)
- **Create** `scripts/blog/emit.mjs` — `emitPost` (write both `.md` via gray-matter). (Task 4)
- **Create** `scripts/blog/writer.mjs` — `writePost` (Claude call → bilingual frontmatter+body). (Task 5)
- **Create** `scripts/blog/generate.mjs` — orchestrator (`--dry-run` supported). (Task 6)
- **Create** `.github/workflows/blog-generate.yml` — cron 2×/week + dispatch → PR. (Task 7)
- **Modify** `package.json` — add `js-yaml` dep + `"blog:generate"` script. (Task 1)
- **Tests:** `scripts/blog/{topics,lint,emit}.test.mjs` (node:test).

---

## Task 1: Add js-yaml + topics seed + npm script

**Files:** Modify `package.json`; Create `content/blog/topics.yaml`.

- [ ] **Step 1: Install js-yaml.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && npm install js-yaml@^4.1.0
```
Expected: adds `js-yaml` to `dependencies`.

- [ ] **Step 2: Add the npm script.** In `package.json` `"scripts"`, add:
```json
    "blog:generate": "node scripts/blog/generate.mjs"
```

- [ ] **Step 3: Create the topics seed** `content/blog/topics.yaml` (slugs MUST NOT collide with existing posts: `automation-for-small-businesses`, `custom-website-vs-website-builder`, `getting-found-locally`, `how-long-a-website-takes`, `what-a-website-costs`, `when-a-custom-web-app-is-worth-it`, `why-slow-websites-lose-customers`):
```yaml
# Seed keyword universe for auto-generated blog posts. Owner-steerable:
# add entries to keep the generator fed; each becomes one bilingual post.
# pillar keys map to the service pages: webdesign / apps-automation / seo.
# slug = the canonical URL slug (kebab-case, unique); keyword = primary SEO target.
webdesign:
  - slug: website-without-page-builder
    keyword: "Website ohne Baukasten"
    intent: "why a hand-coded site beats a builder for an independent business"
  - slug: responsive-website-tirol
    keyword: "responsive Website"
    intent: "what responsive really means and why it's non-negotiable"
  - slug: website-relaunch-when-worth-it
    keyword: "Website Relaunch"
    intent: "signs it's time to rebuild vs patch an existing site"
apps-automation:
  - slug: automate-appointment-reminders
    keyword: "Terminerinnerungen automatisieren"
    intent: "cutting no-shows with automated reminders, honestly scoped"
  - slug: connect-your-business-tools
    keyword: "Tools verbinden Automatisierung"
    intent: "stitching existing tools together instead of new software"
seo:
  - slug: technical-seo-checklist
    keyword: "technisches SEO"
    intent: "the technical foundations that let search engines understand a site"
  - slug: structured-data-local-business
    keyword: "strukturierte Daten lokale Unternehmen"
    intent: "what schema.org markup does for a local business listing"
```

- [ ] **Step 4: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add package.json package-lock.json content/blog/topics.yaml && git commit -m "feat(blog): add js-yaml + topics seed + blog:generate script"
```

---

## Task 2: Topic picker (dedup + pillar balance)

**Files:** Create `scripts/blog/topics.mjs`, `scripts/blog/topics.test.mjs`.

- [ ] **Step 1: Write the failing test** `scripts/blog/topics.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickTopic } from "./topics.mjs";

const TOPICS = {
  webdesign: [{ slug: "a", keyword: "k-a", intent: "i" }, { slug: "b", keyword: "k-b", intent: "i" }],
  "apps-automation": [{ slug: "c", keyword: "k-c", intent: "i" }],
  seo: [{ slug: "d", keyword: "k-d", intent: "i" }],
};

test("skips slugs already published", () => {
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(["a"]), pillarCounts: { webdesign: 1, "apps-automation": 0, seo: 0 } });
  assert.notEqual(t.slug, "a");
});

test("prefers the pillar with the fewest published posts", () => {
  // apps-automation + seo both 0; webdesign 3 → must NOT pick webdesign
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(), pillarCounts: { webdesign: 3, "apps-automation": 0, seo: 0 } });
  assert.ok(["apps-automation", "seo"].includes(t.pillar));
});

test("returns null when every topic is covered", () => {
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(["a", "b", "c", "d"]), pillarCounts: {} });
  assert.equal(t, null);
});

test("carries pillar + page path", () => {
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(["a", "b", "d"]), pillarCounts: { webdesign: 2, "apps-automation": 0, seo: 1 } });
  assert.equal(t.slug, "c");
  assert.equal(t.pillar, "apps-automation");
});
```

- [ ] **Step 2: Run it to verify it fails.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --test scripts/blog/topics.test.mjs`
Expected: FAIL ("Cannot find module './topics.mjs'").

- [ ] **Step 3: Implement** `scripts/blog/topics.mjs`:
```js
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";

const PILLARS = ["webdesign", "apps-automation", "seo"];
// pillar key → service-page path segment (same here) and the dict category label.
export const PILLAR_CATEGORY = {
  webdesign: "Web & Design",
  "apps-automation": "Apps & Automation",
  seo: "SEO & Growth",
};

export function loadTopics(yamlPath) {
  const raw = fs.readFileSync(yamlPath, "utf8");
  const data = yaml.load(raw) || {};
  // normalise: ensure every pillar key exists as an array
  const out = {};
  for (const p of PILLARS) out[p] = Array.isArray(data[p]) ? data[p] : [];
  return out;
}

// Existing published slugs + per-pillar counts, read straight from content/blog.
export function readPublished(blogDir) {
  let files = [];
  try { files = fs.readdirSync(blogDir); } catch { files = []; }
  const slugs = new Set();
  const pillarCounts = { webdesign: 0, "apps-automation": 0, seo: 0 };
  for (const f of files) {
    if (!f.endsWith(".en.md")) continue; // count each post once (via its en file)
    const slug = f.slice(0, -".en.md".length);
    slugs.add(slug);
    try {
      const { data } = matter(fs.readFileSync(path.join(blogDir, f), "utf8"));
      const cat = String(data.category ?? "");
      const pillar = Object.keys(PILLAR_CATEGORY).find((k) => PILLAR_CATEGORY[k] === cat);
      if (pillar) pillarCounts[pillar] += 1;
    } catch { /* ignore unreadable */ }
  }
  return { slugs, pillarCounts };
}

// Choose the pillar with the fewest published posts that still has an uncovered
// topic; within it, the first uncovered topic. Deterministic, no state file.
export function pickTopic({ topics, existingSlugs, pillarCounts }) {
  const candidates = PILLARS
    .map((pillar) => {
      const next = (topics[pillar] || []).find((t) => !existingSlugs.has(t.slug));
      return next ? { pillar, count: pillarCounts[pillar] ?? 0, topic: next } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.count - b.count);
  if (candidates.length === 0) return null;
  const { pillar, topic } = candidates[0];
  return { pillar, category: PILLAR_CATEGORY[pillar], ...topic };
}
```

- [ ] **Step 4: Run tests to verify they pass.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --test scripts/blog/topics.test.mjs`
Expected: PASS (4/4).

- [ ] **Step 5: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add scripts/blog/topics.mjs scripts/blog/topics.test.mjs && git commit -m "feat(blog): topic picker with dedup + pillar balance"
```

---

## Task 3: Scope/honesty + structure lint

**Files:** Create `scripts/blog/lint.mjs`, `scripts/blog/lint.test.mjs`.

- [ ] **Step 1: Write the failing test** `scripts/blog/lint.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { lintPost } from "./lint.mjs";

const goodFm = {
  title: "Title here that is reasonable",
  description: "A meta description that is comfortably between fifty and a hundred and sixty characters long for SEO purposes here.",
  excerpt: "A short teaser that sits in the sixty to a hundred character window nicely.",
  date: "2026-06-19",
  category: "SEO & Growth",
  keywords: ["a", "b", "c", "d", "e"],
};
const goodBody = "Intro paragraph.\n\n## A section\n\nText. See [how we do SEO](/en/seo) or [get in touch](/en/contact).";

test("clean post passes", () => {
  assert.deepEqual(lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" }), []);
});

test("flags a price", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " It costs €3.900.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /price/i.test(x)));
});

test("flags a guarantee", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " We guarantee results.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /guarantee/i.test(x)));
});

test("flags a percent/metric claim", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " Traffic grew 40% in a month.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /metric|percent/i.test(x)));
});

test("flags missing internal links", () => {
  const v = lintPost({ frontmatter: goodFm, body: "Intro.\n\n## H\n\nNo links here at all.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /link/i.test(x)));
});

test("flags incomplete frontmatter", () => {
  const v = lintPost({ frontmatter: { ...goodFm, keywords: ["only", "three", "kw"] }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /keywords/i.test(x)));
});
```

- [ ] **Step 2: Run it to verify it fails.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --test scripts/blog/lint.test.mjs`
Expected: FAIL ("Cannot find module './lint.mjs'").

- [ ] **Step 3: Implement** `scripts/blog/lint.mjs`:
```js
// Returns an array of human-readable violation strings; [] means clean.
// Catches the Gewerbe-scope / honesty risks the owner cares about, plus the
// structural contract the blog renderer + sitemap rely on.
export function lintPost({ frontmatter: fm, body, pillarPath, locale }) {
  const v = [];
  const text = `${fm.title} ${fm.description} ${fm.excerpt} ${body}`;

  // --- scope / honesty ---
  if (/(?:€|eur)\s?\d|\d\s?(?:€|eur)\b/i.test(text)) v.push("price: contains a € / EUR amount (no binding prices in posts)");
  if (/\bgarant|\bguarantee/i.test(text)) v.push("guarantee: contains a guarantee claim");
  if (/\d{1,3}\s?%/.test(text)) v.push("metric/percent: contains a % figure (no fabricated metrics)");
  if (/\b(ranking|platz)\s?(?:#?1|eins|one)\b/i.test(text)) v.push("metric: implies a ranking result");
  if (/\b(stand-?alone|eigenständig)[^.]{0,30}(brand|marke)/i.test(text)) v.push("scope: implies standalone branding (offer brand only as part of a build)");

  // --- structure / contract ---
  for (const f of ["title", "description", "excerpt", "date", "category"]) {
    if (!fm[f] || String(fm[f]).trim() === "") v.push(`frontmatter: '${f}' is empty`);
  }
  if (!Array.isArray(fm.keywords) || fm.keywords.length < 5 || fm.keywords.length > 7) {
    v.push("keywords: must be 5–7 entries");
  }
  if (fm.description && (fm.description.length < 50 || fm.description.length > 160)) {
    v.push("description: must be 50–160 chars");
  }
  if (!body.includes(`/${locale}/${pillarPath}`)) v.push(`link: body must link to /${locale}/${pillarPath}`);
  if (!body.includes(`/${locale}/contact`)) v.push(`link: body must link to /${locale}/contact`);
  if (!/^##\s/m.test(body)) v.push("structure: body needs at least one ## section");

  return v;
}
```

- [ ] **Step 4: Run tests to verify they pass.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --test scripts/blog/lint.test.mjs`
Expected: PASS (6/6).

- [ ] **Step 5: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add scripts/blog/lint.mjs scripts/blog/lint.test.mjs && git commit -m "feat(blog): scope/honesty + structure lint"
```

---

## Task 4: Emitter (write both .md files)

**Files:** Create `scripts/blog/emit.mjs`, `scripts/blog/emit.test.mjs`.

- [ ] **Step 1: Write the failing test** `scripts/blog/emit.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import { emitPost } from "./emit.mjs";

test("writes slug.en.md + slug.de.md that re-parse to the same fields", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-06-19", category: "SEO & Growth", keywords: ["a", "b", "c", "d", "e"] };
  emitPost("my-slug", { en: { frontmatter: fm, body: "Body EN" }, de: { frontmatter: { ...fm, title: "T-de" }, body: "Body DE" } }, dir);
  const en = matter(fs.readFileSync(path.join(dir, "my-slug.en.md"), "utf8"));
  const de = matter(fs.readFileSync(path.join(dir, "my-slug.de.md"), "utf8"));
  assert.equal(en.data.title, "T");
  assert.equal(en.content.trim(), "Body EN");
  assert.equal(de.data.title, "T-de");
  assert.deepEqual(en.data.keywords, ["a", "b", "c", "d", "e"]);
});
```

- [ ] **Step 2: Run it to verify it fails.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --test scripts/blog/emit.test.mjs`
Expected: FAIL ("Cannot find module './emit.mjs'").

- [ ] **Step 3: Implement** `scripts/blog/emit.mjs`:
```js
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const FIELD_ORDER = ["title", "description", "excerpt", "date", "category", "keywords"];

function writeOne(dir, slug, locale, { frontmatter, body }) {
  // Order fields to match existing posts (gray-matter stringify preserves insertion order).
  const ordered = {};
  for (const k of FIELD_ORDER) ordered[k] = frontmatter[k];
  const file = matter.stringify(`${body}\n`, ordered);
  fs.writeFileSync(path.join(dir, `${slug}.${locale}.md`), file, "utf8");
}

// Writes both locale files. Returns the two paths.
export function emitPost(slug, { en, de }, blogDir) {
  fs.mkdirSync(blogDir, { recursive: true });
  writeOne(blogDir, slug, "en", en);
  writeOne(blogDir, slug, "de", de);
  return [path.join(blogDir, `${slug}.en.md`), path.join(blogDir, `${slug}.de.md`)];
}
```

- [ ] **Step 4: Run tests to verify they pass.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --test scripts/blog/emit.test.mjs`
Expected: PASS (1/1).

- [ ] **Step 5: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add scripts/blog/emit.mjs scripts/blog/emit.test.mjs && git commit -m "feat(blog): emitter writes bilingual .md files"
```

---

## Task 5: Writer (Claude → bilingual post)

**Files:** Create `scripts/blog/writer.mjs`. (No unit test — it calls the live API; covered by the dry-run in Task 8.)

- [ ] **Step 1: Implement** `scripts/blog/writer.mjs`:
```js
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6"; // matches src/app/api/chat/route.ts; swap to claude-opus-4-8 for max prose quality

function systemPrompt({ pillar, category, keyword, intent, slug, date, pillarPath }) {
  return `You write SEO blog posts for Lechner Studios — a solo-founded, AI-native digital studio in Wattens, Tirol, serving SMBs across DACH. Output ONE article in BOTH English and Austrian German (de-AT, Sie-Form).

TOPIC: pillar="${category}", primary keyword="${keyword}", angle="${intent}", canonical slug="${slug}".

Match these existing-post rules EXACTLY:
- Voice: written, professional-but-warm, honest, no hype/buzzwords. ~600–900 words per locale.
- Structure: a short intro paragraph (no heading), then 3–5 "## " H2 sections, including at least one with a concrete example, then a closing paragraph that ends with TWO markdown internal links — to the pillar page and to contact — using FULL locale paths.
  - English links: [text](/en/${pillarPath}) and [text](/en/contact)
  - German links: [text](/de/${pillarPath}) and [text](/de/contact)
- de-AT is a real localization (Sie-Form, Austrian spelling), NOT a literal translation of the English.

HARD scope/honesty rules (a post breaking these is rejected):
- NO prices, € amounts, or binding quotes. NO "guarantee"/"Garantie". NO %/metrics/ranking-result claims. NO fabricated testimonials.
- Brand/identity only ever "as part of a build" — never a standalone offering. SEO framed as TECHNICAL work, never business/marketing consulting (Unternehmensberatung).

Return ONLY a single JSON object, no prose around it, shaped exactly:
{
  "en": { "title": "...", "description": "50–160 char meta", "excerpt": "60–100 char teaser", "keywords": ["5 to 7 keywords"], "body": "markdown body (no frontmatter, no H1)" },
  "de": { "title": "...", "description": "...", "excerpt": "...", "keywords": ["..."], "body": "..." }
}
Set date for both to "${date}" is NOT needed (added later). Keep slugs/links exactly as specified.`;
}

function extractJson(text) {
  // Tolerate ```json fences or leading prose.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(raw);
}

function toEntry(part, category, date) {
  return {
    frontmatter: {
      title: String(part.title),
      description: String(part.description),
      excerpt: String(part.excerpt),
      date,
      category,
      keywords: (part.keywords || []).map(String),
    },
    body: String(part.body).trim(),
  };
}

// Calls Claude once (one retry on parse failure) and returns { en, de } entries
// ready for the linter + emitter.
export async function writePost({ pillar, category, keyword, intent, slug, date, pillarPath, apiKey }) {
  const client = new Anthropic({ apiKey });
  const sys = systemPrompt({ pillar, category, keyword, intent, slug, date, pillarPath });
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: sys,
      messages: [{ role: "user", content: `Write the post for "${keyword}". Return only the JSON object.` }],
    });
    const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    try {
      const obj = extractJson(text);
      return { en: toEntry(obj.en, category, date), de: toEntry(obj.de, category, date) };
    } catch (e) {
      if (attempt === 1) throw new Error(`writer: could not parse JSON after 2 tries: ${e.message}`);
    }
  }
}
```
NOTE: `pillarPath` is the URL segment (`webdesign` / `apps-automation` / `seo`) — same as the pillar key, so pass `pillar` as `pillarPath`.

- [ ] **Step 2: Syntax check.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --check scripts/blog/writer.mjs && echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add scripts/blog/writer.mjs && git commit -m "feat(blog): Claude writer (bilingual post + scope rules in prompt)"
```

---

## Task 6: Orchestrator `generate.mjs`

**Files:** Create `scripts/blog/generate.mjs`.

- [ ] **Step 1: Implement** `scripts/blog/generate.mjs`:
```js
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { loadTopics, readPublished, pickTopic } from "./topics.mjs";
import { writePost } from "./writer.mjs";
import { emitPost } from "./emit.mjs";
import { lintPost } from "./lint.mjs";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const TOPICS_PATH = path.join(BLOG_DIR, "topics.yaml");
const dryRun = process.argv.includes("--dry-run");

function isoToday() {
  // GHA Node has Date; pass via env for sandboxes that block Date.
  return process.env.POST_DATE || new Date().toISOString().slice(0, 10);
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const topics = loadTopics(TOPICS_PATH);
  const { slugs, pillarCounts } = readPublished(BLOG_DIR);
  const picked = pickTopic({ topics, existingSlugs: slugs, pillarCounts });
  if (!picked) {
    console.error("No uncovered topics left — refill content/blog/topics.yaml.");
    process.exit(2);
  }
  const date = isoToday();
  console.log(`Generating: [${picked.pillar}] ${picked.slug} — "${picked.keyword}"`);

  const post = await writePost({ ...picked, pillarPath: picked.pillar, date, apiKey });

  // Lint both locales before writing anything into content/.
  const enViol = lintPost({ frontmatter: post.en.frontmatter, body: post.en.body, pillarPath: picked.pillar, locale: "en" });
  const deViol = lintPost({ frontmatter: post.de.frontmatter, body: post.de.body, pillarPath: picked.pillar, locale: "de" });
  const violations = [...enViol.map((x) => `[en] ${x}`), ...deViol.map((x) => `[de] ${x}`)];
  if (violations.length) {
    console.error("Lint failed:\n" + violations.join("\n"));
    process.exit(3);
  }

  const outDir = dryRun ? fs.mkdtempSync(path.join(os.tmpdir(), "blog-dry-")) : BLOG_DIR;
  const files = emitPost(picked.slug, post, outDir);
  console.log("Wrote:\n" + files.join("\n"));

  if (dryRun) {
    console.log("\n--- DRY RUN: en post ---\n" + fs.readFileSync(files[0], "utf8"));
    return;
  }

  // Build check — proves the post renders + sitemap regenerates.
  console.log("Running build check…");
  execSync("npm run build", { cwd: ROOT, stdio: "inherit" });

  // Emit outputs for the workflow (branch name + PR title/body) via GITHUB_OUTPUT.
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    fs.appendFileSync(out, `slug=${picked.slug}\n`);
    fs.appendFileSync(out, `pillar=${picked.category}\n`);
    fs.appendFileSync(out, `keyword=${picked.keyword}\n`);
  }
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
```

- [ ] **Step 2: Syntax check.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --check scripts/blog/generate.mjs && echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add scripts/blog/generate.mjs && git commit -m "feat(blog): generate orchestrator (pick→write→lint→emit→build, --dry-run)"
```

---

## Task 7: GitHub Actions workflow

**Files:** Create `.github/workflows/blog-generate.yml`.

- [ ] **Step 1: Implement** `.github/workflows/blog-generate.yml`:
```yaml
name: blog-generate
on:
  schedule:
    - cron: "23 6 * * 1"   # Mon 06:23 UTC
    - cron: "23 6 * * 4"   # Thu 06:23 UTC
  workflow_dispatch: {}

permissions:
  contents: write
  pull-requests: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: Generate post
        id: gen
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/blog/generate.mjs
      - name: Open PR
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          set -e
          SLUG="${{ steps.gen.outputs.slug }}"
          BRANCH="blog/auto/${SLUG}"
          git config user.name "lechner-studios-bot"
          git config user.email "bot@users.noreply.github.com"
          git checkout -b "$BRANCH"
          git add content/blog/"${SLUG}".en.md content/blog/"${SLUG}".de.md
          git commit -m "blog: ${{ steps.gen.outputs.keyword }} (${{ steps.gen.outputs.pillar }})"
          git push -u origin "$BRANCH"
          gh pr create --base main --head "$BRANCH" \
            --title "blog: ${{ steps.gen.outputs.keyword }} (${{ steps.gen.outputs.pillar }})" \
            --body "Auto-generated post. Pillar: ${{ steps.gen.outputs.pillar }} · keyword: \`${{ steps.gen.outputs.keyword }}\` · slug: \`${SLUG}\`. Review both locales (de/en) on the Vercel preview, then merge."
```
NOTE: `npm run build` inside the generator needs the same env the normal build needs. If the build requires extra env vars (e.g. Supabase/Anthropic public keys) and fails in CI, set them as Actions secrets/vars in this job, or split the build-check out of the generator into a separate workflow step that uses the repo's standard build env. Confirm by reading `.github/workflows/main-health.yml` (the existing build job) and mirroring its env.

- [ ] **Step 2: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add .github/workflows/blog-generate.yml && git commit -m "ci(blog): twice-weekly cron → generate → open PR"
```

---

## Task 8: Verify end-to-end

**Files:** none.

- [ ] **Step 1: Unit tests all green.**
Run: `cd /c/Users/blaqu/dev/lechner-studios && node --test scripts/blog/`
Expected: all tests PASS (topics 4, lint 6, emit 1).

- [ ] **Step 2: Dry run (real API).** With `ANTHROPIC_API_KEY` set in the env:
```bash
cd /c/Users/blaqu/dev/lechner-studios && ANTHROPIC_API_KEY=*** node scripts/blog/generate.mjs --dry-run
```
Expected: prints a picked topic + the generated en post; the lint passed (no exit 3); files written to a temp dir; NO content/blog change, NO build, NO PR. Eyeball the prose quality + that both internal links + 5–7 keywords are present. If quality is weak, adjust the `systemPrompt` in `writer.mjs` and re-run.

- [ ] **Step 3: Lint negative check.** Confirm the guardrail bites: temporarily append `It costs €3.900 and we guarantee +40% traffic.` to the writer's user message (or hand-craft a post) and re-run dry — expect exit 3 with the price/guarantee/percent violations. Revert.

- [ ] **Step 4: Confirm the build-check env.** Read `.github/workflows/main-health.yml` and confirm what env `npm run build` needs; ensure `blog-generate.yml`'s generate step has the same (add Actions secrets/vars if missing) so the in-generator build check passes in CI.

- [ ] **Step 5: Owner action + live test (document in PR).** Owner adds the `ANTHROPIC_API_KEY` repo secret (Settings → Secrets → Actions). Then trigger once via `workflow_dispatch` (Actions tab → blog-generate → Run). Expected: a PR `blog/auto/<slug>` with two slug-matched files, build green, post renders at `/{locale}/blog/<slug>` on the PR's Vercel preview (owner eyeballs both locales), then merge → auto-deploy.

- [ ] **Step 6: Ship.** Push the branch and open the PR for this feature:
```bash
cd /c/Users/blaqu/dev/lechner-studios && git push -u origin feat/blog-automation
```
Then `gh pr create` → main, titled `feat(blog): twice-weekly bilingual SEO post automation (→ PR)`, body summarizing the design + the owner action (add `ANTHROPIC_API_KEY` secret) + that it never auto-publishes.

---

## Self-review
- **Spec coverage:** topics.yaml + hybrid pick → Task 1–2; scope/honesty + structure lint → Task 3; emitter (bilingual gray-matter) → Task 4; Claude writer w/ post-DNA + scope rules + de-AT → Task 5; orchestrator (pick→write→lint→emit→build, dry-run) → Task 6; GHA cron 2×/week → PR, never auto-publish → Task 7; secrets + dry-run + e2e + topics-exhausted signal → Tasks 6–8. ✓
- **Placeholders:** none — complete code for every module + tests; the one deliberately-deferred item is the build-check CI env (Task 7 NOTE + Task 8 Step 4 give the exact resolution: mirror `main-health.yml`), and `topics.yaml` content is owner-steerable seed data (structure fully specified). ✓
- **Type/name consistency:** `pickTopic`→`{pillar,category,slug,keyword,intent}`; `writePost({...,pillarPath,date,apiKey})`→`{en,de}` each `{frontmatter,body}`; `lintPost({frontmatter,body,pillarPath,locale})`→`string[]`; `emitPost(slug,{en,de},dir)`. Used consistently across Tasks 2/3/4/5/6. `pillarPath` = the pillar key (= URL segment); generator passes `pillarPath: picked.pillar`. ✓
- **Risks flagged:** (a) the in-generator `npm run build` may need extra CI env — Task 7 NOTE + Task 8 Step 4 resolve it (mirror main-health). (b) LLM JSON parse — handled with fenced/brace extraction + one retry. (c) `new Date()` sandbox-blocked — `POST_DATE` env override; GHA Node is fine.
