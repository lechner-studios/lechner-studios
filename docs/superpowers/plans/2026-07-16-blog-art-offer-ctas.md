# Blog Art + Offer CTAs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every blog post (the 19 published and every future auto-generated one) a deterministic brand-art hero plus a matched offer CTA, without hand-editing a single existing post.

**Architecture:** Offer identity moves to `src/lib/offers.mjs`, a plain ESM module importable by both bare `node` (`scripts/blog/lint.mjs`) and Next (`.tsx`), with a `.d.mts` sibling for types. Art geometry lives in a pure `src/lib/post-art.mjs` so it is testable with `node:test`; `PostArt.tsx` is a thin SVG renderer over it. An optional `offer:` key in `topics.yaml` flows through `pickTopic` into frontmatter, and `blog.ts` defaults it to `website-check`, which retrofits the existing posts for free.

**Tech Stack:** Next.js (App Router, RSC), TypeScript, `gray-matter`, `js-yaml`, `node:test` (built-in runner, no vitest/jest), Playwright for e2e.

**Spec:** `docs/superpowers/specs/2026-07-16-blog-images-offer-cta-design.md`

---

## Context the implementer needs

**This repo has no test runner dependency.** No vitest, no jest, no React testing library. The three existing tests use Node's built-in `node:test` + `node:assert/strict` in plain `.mjs`. Do not install a test framework. Do not write `.test.ts`. Do not write React render tests.

Run tests with:
```
node --test "scripts/blog/*.test.mjs" "src/lib/*.test.mjs"
```
(14 tests pass today from `scripts/blog/` alone: emit 1, lint 6, topics 7.)

**Why `offers.mjs` and not `offers.ts`:** `scripts/blog/lint.mjs` runs under bare `node`, which cannot import TypeScript. A `.ts` file could never be the shared source. `tsconfig.json` already has `allowJs: true`.

**Why `.d.mts` and not `.d.ts`:** TypeScript pairs `foo.mjs` with `foo.d.mts`. A `.d.ts` sibling would be ignored and every import would silently be `any`. This was verified with `npx tsc --noEmit` before this plan was written.

**Layer-0 guard:** `.git/hooks/pre-commit` scans for currency/PII and reads `.layer0-allow`. Any file containing a `€` literal must be listed there or the commit is blocked. Task 2 moves the entry rather than adding one.

**Type-check with:** `npx tsc --noEmit`. The repo has pre-existing unrelated changes in the working tree (Sentry setup); ignore errors that are not in files you touched.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/lib/offers.mjs` | Create | Offer identity: key, absolute werk href, title, price, accent. After this, the only file in the repo carrying a `€`. |
| `src/lib/offers.d.mts` | Create | Types for the `.tsx` consumers. |
| `src/lib/offers.test.mjs` | Create | Runtime-shape guards for the above. |
| `src/lib/post-art.mjs` | Create | Pure geometry: `artSpec(slug, category)` returns plain data. |
| `src/lib/post-art.d.mts` | Create | Types for `PostArt.tsx`. |
| `src/lib/post-art.test.mjs` | Create | Determinism + no-hex guards. |
| `src/components/PostArt.tsx` | Create | Thin SVG renderer over `artSpec`. No geometry logic. |
| `src/components/BlogOfferCta.tsx` | Create | One offer card, rendered after the article body. |
| `src/components/HomeOffers.tsx` | Modify | Drop local `OFFERS`, import `OFFER_ORDER`. Behaviour unchanged. |
| `src/lib/blog.ts` | Modify | `BlogMeta.offer`, defaulted. Extract shared `toMeta`. |
| `src/app/(site)/[locale]/blog/page.tsx` | Modify | Render `<PostArt variant="tile">` per row. |
| `src/app/(site)/[locale]/blog/[slug]/page.tsx` | Modify | Render `<PostArt variant="hero">` + `<BlogOfferCta>`. |
| `src/i18n/dictionaries.ts` | Modify | Add `blogOffer` block (en + de). No prices. |
| `scripts/blog/emit.mjs` | Modify | `offer` in `FIELD_ORDER`; skip undefined keys. |
| `scripts/blog/lint.mjs` | Modify | Validate `offer` via `isOfferKey`. |
| `scripts/blog/generate.mjs` | Modify | Pass `picked.offer` into frontmatter. |
| `content/blog/topics.yaml` | Modify | Document `offer:`; set `direktbucher` on the pension topic. |
| `.layer0-allow` | Modify | Move entry from `HomeOffers.tsx` to `src/lib/offers.mjs`; drop two stale entries for files #118 deleted. |
| `package.json` | Modify | Add the missing `test` script. |

---

### Task 1: Offer identity module

**Files:**
- Create: `src/lib/offers.mjs`
- Create: `src/lib/offers.d.mts`
- Test: `src/lib/offers.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add the `test` script to `package.json`**

In the `"scripts"` block, after `"lint": "eslint",` add:

```json
"test": "node --test \"scripts/blog/*.test.mjs\" \"src/lib/*.test.mjs\"",
```

- [ ] **Step 2: Write the failing test**

Create `src/lib/offers.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { OFFERS, OFFER_ORDER, DEFAULT_OFFER, isOfferKey } from "./offers.mjs";

test("isOfferKey accepts exactly the keys in OFFERS", () => {
  for (const k of Object.keys(OFFERS)) assert.equal(isOfferKey(k), true, `${k} should be valid`);
  assert.equal(isOfferKey("websitecheck"), false);
  assert.equal(isOfferKey("website_check"), false);
  assert.equal(isOfferKey(""), false);
  assert.equal(isOfferKey(undefined), false);
  assert.equal(isOfferKey(null), false);
  assert.equal(isOfferKey(42), false);
  // Object.hasOwn, not `in` — inherited keys must not pass.
  assert.equal(isOfferKey("toString"), false);
  assert.equal(isOfferKey("constructor"), false);
});

test("every OFFERS entry has its own key as .key", () => {
  for (const [k, o] of Object.entries(OFFERS)) assert.equal(o.key, k);
});

test("OFFER_ORDER contains every OFFERS key exactly once", () => {
  const ordered = OFFER_ORDER.map((o) => o.key).sort();
  assert.deepEqual(ordered, Object.keys(OFFERS).sort());
});

test("OFFER_ORDER starts with website-check, matching HomeOffers' dict order", () => {
  assert.equal(OFFER_ORDER[0].key, "website-check");
  assert.equal(OFFER_ORDER[1].key, "direktbucher");
});

test("DEFAULT_OFFER is a valid key", () => {
  assert.equal(isOfferKey(DEFAULT_OFFER), true);
});

test("every offer has de/en prices, an absolute werk href, and an accent", () => {
  for (const o of Object.values(OFFERS)) {
    assert.ok(o.price.de.length > 0, `${o.key} missing de price`);
    assert.ok(o.price.en.length > 0, `${o.key} missing en price`);
    // #118 moved these offers to the werk storefront. The href is absolute and
    // callers must not locale-prefix it; a relative path would only 301-hop.
    assert.ok(o.href.startsWith("https://werk.lechner-studios.at/"), `${o.key} href must be an absolute werk URL`);
    assert.match(o.accent, /^#[0-9a-f]{6}$/i, `${o.key} accent must be a hex colour`);
  }
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test "src/lib/*.test.mjs"`
Expected: FAIL with `Cannot find module ... offers.mjs`

- [ ] **Step 4: Write the implementation**

Create `src/lib/offers.mjs`. Price strings are copied verbatim from the current `HomeOffers.tsx` array so the homepage renders byte-identically:

```js
// Single source of truth for the two productized offers: key, href, title, price.
//
// This is .mjs, not .ts, on purpose: scripts/blog/lint.mjs runs under bare node
// and cannot import TypeScript. Both Next (.tsx) and the blog generator import
// this same file. Types live in the sibling offers.d.mts (TS pairs .mjs with
// .d.mts, not .d.ts).
//
// The € amounts here are intentional public marketing figures and are exempted
// in .layer0-allow. Keeping them in this one module — and out of the shared copy
// dictionary — is what lets the Layer-0 currency scan stay active over all other
// site copy.
export const OFFERS = {
  "website-check": {
    key: "website-check",
    href: "https://werk.lechner-studios.at/website-check",
    title: "Website-Check",
    price: { de: "€290", en: "€290" },
    accent: "#254268",
  },
  "direktbucher": {
    key: "direktbucher",
    href: "https://werk.lechner-studios.at/pension-website-tirol",
    title: "Direktbucher",
    price: { de: "ab €3.900", en: "from €3,900" },
    accent: "#5E8263",
  },
};

// Display order for the homepage band. HomeOffers maps this positionally onto
// dict.homeOffers.items, so the order here must stay (check, then direkt).
export const OFFER_ORDER = [OFFERS["website-check"], OFFERS["direktbucher"]];

// Posts without an explicit `offer:` in topics.yaml fall back to this. It is the
// low-commitment entry offer, which suits nearly every topic.
export const DEFAULT_OFFER = "website-check";

// Object.hasOwn, not `in`: "toString" must not validate as an offer key.
export function isOfferKey(v) {
  return typeof v === "string" && Object.hasOwn(OFFERS, v);
}
```

- [ ] **Step 5: Write the type declarations**

Create `src/lib/offers.d.mts`:

```ts
export type OfferKey = "website-check" | "direktbucher";

export type Offer = {
  key: OfferKey;
  /** ABSOLUTE werk storefront URL. Never locale-prefixed. */
  href: string;
  /** Brand name. Never translated. */
  title: string;
  price: { de: string; en: string };
  /** Per-offer brand hex for the card's inset top edge. */
  accent: string;
};

export declare const OFFERS: Record<OfferKey, Offer>;
export declare const OFFER_ORDER: Offer[];
export declare const DEFAULT_OFFER: OfferKey;
export declare function isOfferKey(v: unknown): v is OfferKey;
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 20 tests total (14 existing + 6 new), 0 fail

- [ ] **Step 7: Commit**

The pre-commit hook will BLOCK this commit, because `offers.mjs` contains `€` and is not yet in `.layer0-allow`. That is expected and it is the hook working correctly. Do not use `--no-verify`. Task 2 adds the allow entry, so commit Tasks 1 and 2 together at the end of Task 2.

Stage the work now and move on:

```bash
git add package.json src/lib/offers.mjs src/lib/offers.d.mts src/lib/offers.test.mjs
```

---

### Task 2: Point HomeOffers at the shared module, move the Layer-0 entry

**Files:**
- Modify: `src/components/HomeOffers.tsx:8-17`
- Modify: `.layer0-allow`

- [ ] **Step 1: Replace the local OFFERS array with an import**

In `src/components/HomeOffers.tsx`, delete the comment block and array at lines 8 to 17 (everything from `// Hrefs, brand titles and prices live here` through the `];` that closes `OFFERS`), and add to the imports at the top:

```tsx
import { OFFER_ORDER } from "../lib/offers.mjs";
```

The remaining import block should read:

```tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";
import { OFFER_ORDER } from "../lib/offers.mjs";

// Offer hrefs/titles/prices live in src/lib/offers.mjs (shared with the blog
// generator and BlogOfferCta), not in the shared dictionary, so the Layer-0
// PII/currency guard stays active over all site copy. OFFER_ORDER is ordered to
// mirror dict.homeOffers.items (check, then direkt).
export default function HomeOffers() {
```

- [ ] **Step 2: Update the one usage**

At the line reading `const meta = OFFERS[i];` inside `d.items.map(...)`, change it to:

```tsx
const meta = OFFER_ORDER[i];
```

Nothing else in the file changes. `meta.href`, `meta.title` and `meta.price[locale]` all keep working, because `OFFER_ORDER` entries have the same shape as the old array's entries.

- [ ] **Step 3: Move the Layer-0 allow entry**

In `.layer0-allow`, find the final block:

```
# Homepage offer band surfaces the two productized entry offers with their
# public fixed prices (Website-Check + Direktbucher). Same rationale as above:
# prices are intentional public marketing figures, isolated to this one
# component (not the shared copy dictionary).
src/components/HomeOffers.tsx
```

Replace it entirely with:

```
# Single source of truth for the two productized entry offers (Website-Check +
# Direktbucher) and their public fixed prices. Imported by HomeOffers, by
# BlogOfferCta, and by the blog generator's linter. Same rationale as above:
# prices are intentional public marketing figures, isolated to this one module
# (not the shared copy dictionary), so the Layer-0 currency/PII scan stays
# active over all other site copy. HomeOffers.tsx no longer needs an exemption
# because the amounts have left it.
src/lib/offers.mjs
```

- [ ] **Step 4: Verify the homepage still type-checks**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `HomeOffers.tsx` or `offers`. If `OFFER_ORDER[i]` reports an error, the `.d.mts` is not resolving; confirm the file is named `offers.d.mts` and not `offers.d.ts`.

- [ ] **Step 5: Verify the guard now permits the commit and still guards elsewhere**

Run: `npm test`
Expected: PASS, 20 tests

- [ ] **Step 6: Commit Tasks 1 and 2 together**

```bash
git add package.json src/lib/offers.mjs src/lib/offers.d.mts src/lib/offers.test.mjs src/components/HomeOffers.tsx .layer0-allow
git commit -m "refactor: single source of truth for offer prices in src/lib/offers.mjs

Extracts the offer href/title/price data out of HomeOffers.tsx into a
plain-ESM module that bare node can also import, so the blog linter and
the upcoming BlogOfferCta share one definition.

.mjs rather than .ts because scripts/blog/lint.mjs runs under bare node.
Types in the .d.mts sibling (TS pairs .mjs with .d.mts, not .d.ts).

The Layer-0 exemption moves from HomeOffers.tsx to offers.mjs rather than
being added alongside it, so the exempted surface shrinks from two files
to one. HomeOffers behaviour is unchanged.

Also adds the missing test script; the repo had node:test files but no
way to run them."
```

If the hook still blocks, the `.layer0-allow` path does not match. Check for a typo and fix it rather than bypassing the hook.

---

### Task 3: Pure art geometry

**Files:**
- Create: `src/lib/post-art.mjs`
- Create: `src/lib/post-art.d.mts`
- Test: `src/lib/post-art.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `src/lib/post-art.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { artSpec, FAMILIES } from "./post-art.mjs";

const CATS = ["Web & Design", "Apps & Automation", "SEO & Growth"];

test("is deterministic: the same slug and category give deep-equal output", () => {
  const a = artSpec("what-a-website-costs", "Web & Design");
  const b = artSpec("what-a-website-costs", "Web & Design");
  assert.deepEqual(a, b);
});

test("different slugs give different output", () => {
  const a = artSpec("what-a-website-costs", "Web & Design");
  const b = artSpec("technical-seo-checklist", "Web & Design");
  assert.notDeepEqual(a, b);
});

test("category selects the family, so posts in a pillar look related", () => {
  for (const cat of CATS) {
    const a = artSpec("slug-one", cat);
    const b = artSpec("slug-two", cat);
    assert.equal(a.family, b.family);
    assert.equal(a.family, FAMILIES[cat]);
  }
});

test("an unknown category falls back to a valid family rather than throwing", () => {
  const spec = artSpec("some-slug", "Not A Real Category");
  assert.ok(Object.values(FAMILIES).includes(spec.family));
});

test("always emits at least one shape", () => {
  for (const cat of CATS) {
    for (const slug of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
      assert.ok(artSpec(slug, cat).shapes.length > 0, `${slug}/${cat} produced no shapes`);
    }
  }
});

test("fills are CSS variables only, never hardcoded hex", () => {
  for (const cat of CATS) {
    for (const s of artSpec("what-a-website-costs", cat).shapes) {
      assert.match(s.fill, /^var\(--[a-z0-9-]+\)$/, `bad fill: ${s.fill}`);
      assert.doesNotMatch(s.fill, /#[0-9a-f]{3,6}/i);
    }
  }
});

test("shape opacity stays in a subtle range", () => {
  for (const s of artSpec("connect-your-business-tools", "Apps & Automation").shapes) {
    assert.ok(s.opacity >= 0.15 && s.opacity <= 0.9, `opacity out of range: ${s.opacity}`);
  }
});

test("shapes stay inside the 100x100 viewBox", () => {
  for (const cat of CATS) {
    for (const s of artSpec("getting-found-locally", cat).shapes) {
      if (s.kind === "rect") {
        assert.ok(s.x >= 0 && s.y >= 0 && s.x + s.w <= 100 && s.y + s.h <= 100, `rect escapes: ${JSON.stringify(s)}`);
      } else {
        assert.ok(s.x - s.r >= -1 && s.x + s.r <= 101, `circle escapes: ${JSON.stringify(s)}`);
      }
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "src/lib/post-art.test.mjs"`
Expected: FAIL with `Cannot find module ... post-art.mjs`

- [ ] **Step 3: Write the implementation**

Create `src/lib/post-art.mjs`:

```js
// Pure geometry for the blog's generated brand art. No JSX here on purpose:
// this repo has node:test but no React test runner, so keeping the logic pure
// is what makes the determinism guarantee testable. PostArt.tsx is a thin
// renderer over artSpec().
//
// Everything is deterministic from the slug. No Math.random(), no Date — the
// art has to be byte-stable across static builds.

// Pillar category → geometry family. Posts in the same pillar look related.
export const FAMILIES = {
  "Web & Design": "grid",
  "Apps & Automation": "nodes",
  "SEO & Growth": "strata",
};

const FALLBACK_FAMILY = "grid";

// Fills are CSS variable names, never hex, so light/dark comes free from the
// existing palette (--accent #254268 light / #8FA8C5 dark, etc).
const FILLS = ["var(--accent)", "var(--accent-2)", "var(--border)"];

// FNV-1a. Small, stable, dependency-free.
export function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

// Mulberry32. Deterministic sequence from a seed.
function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickFill(rand) {
  return FILLS[Math.floor(rand() * FILLS.length)];
}

function opacity(rand) {
  // 0.15 to 0.9 — subtle enough to sit under an editorial headline.
  return Math.round((0.15 + rand() * 0.75) * 100) / 100;
}

function buildGrid(rand) {
  const shapes = [];
  const cell = 20;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (rand() < 0.55) continue;
      shapes.push({ kind: "rect", x: i * cell, y: j * cell, w: cell, h: cell, fill: pickFill(rand), opacity: opacity(rand) });
    }
  }
  return shapes;
}

function buildNodes(rand) {
  const shapes = [];
  const n = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < n; i++) {
    const r = Math.round((3 + rand() * 7) * 10) / 10;
    shapes.push({
      kind: "circle",
      x: Math.round((r + rand() * (100 - 2 * r)) * 10) / 10,
      y: Math.round((r + rand() * (100 - 2 * r)) * 10) / 10,
      r,
      fill: pickFill(rand),
      opacity: opacity(rand),
    });
  }
  return shapes;
}

function buildStrata(rand) {
  const shapes = [];
  let y = 0;
  while (y < 100) {
    const h = Math.round((6 + rand() * 14) * 10) / 10;
    shapes.push({ kind: "rect", x: 0, y, w: 100, h: Math.min(h, 100 - y), fill: pickFill(rand), opacity: opacity(rand) });
    y += h;
  }
  return shapes;
}

const BUILDERS = { grid: buildGrid, nodes: buildNodes, strata: buildStrata };

/**
 * Stable art description for a post. Same slug always yields the same spec.
 * Returns { family, seed, shapes } where each shape is plain data an SVG
 * renderer can map 1:1 onto <rect> / <circle>.
 */
export function artSpec(slug, category) {
  const family = FAMILIES[category] ?? FALLBACK_FAMILY;
  const seed = hash(slug);
  const rand = rng(seed);
  let shapes = BUILDERS[family](rand);
  // buildGrid can skip every cell on an unlucky seed. Never return nothing.
  if (shapes.length === 0) {
    shapes = [{ kind: "rect", x: 0, y: 40, w: 100, h: 20, fill: FILLS[0], opacity: 0.3 }];
  }
  return { family, seed, shapes };
}
```

- [ ] **Step 4: Write the type declarations**

Create `src/lib/post-art.d.mts`:

```ts
export type ArtFamily = "grid" | "nodes" | "strata";

export type ArtShape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string; opacity: number }
  | { kind: "circle"; x: number; y: number; r: number; fill: string; opacity: number };

export type ArtSpec = { family: ArtFamily; seed: number; shapes: ArtShape[] };

export declare const FAMILIES: Record<string, ArtFamily>;
export declare function hash(str: string): number;
export declare function artSpec(slug: string, category: string): ArtSpec;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 28 tests total, 0 fail

- [ ] **Step 6: Commit**

```bash
git add src/lib/post-art.mjs src/lib/post-art.d.mts src/lib/post-art.test.mjs
git commit -m "feat: deterministic brand-art geometry for blog posts

artSpec(slug, category) returns stable plain data seeded by an FNV-1a
hash of the slug. No Math.random and no Date, so static builds are
byte-stable and the behaviour is testable with node:test.

Category picks one of three geometry families, so posts in a pillar look
related. Fills are CSS variable names rather than hex, so dark mode needs
no second codepath.

Pure module with no JSX, because there is no React test runner here."
```

---

### Task 4: PostArt renderer, wired into both blog surfaces

**Files:**
- Create: `src/components/PostArt.tsx`
- Modify: `src/app/(site)/[locale]/blog/[slug]/page.tsx`
- Modify: `src/app/(site)/[locale]/blog/page.tsx`

- [ ] **Step 1: Create the renderer**

Create `src/components/PostArt.tsx`. It is a server component (no `"use client"`), holds no geometry logic, and maps `artSpec` output onto SVG elements:

```tsx
import React from "react";
import { artSpec } from "../lib/post-art.mjs";

// Decorative brand art. Geometry lives in src/lib/post-art.mjs (pure + tested);
// this file only turns that data into SVG.
export default function PostArt({
  slug,
  category,
  variant,
}: {
  slug: string;
  category: string;
  variant: "hero" | "tile";
}) {
  const { shapes } = artSpec(slug, category);
  const isHero = variant === "hero";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      // Decorative: it carries nothing the headline doesn't, so it is hidden
      // from assistive tech rather than given invented alt text.
      aria-hidden="true"
      role="presentation"
      focusable="false"
      style={{
        display: "block",
        width: isHero ? "100%" : "72px",
        height: isHero ? "180px" : "72px",
        flexShrink: 0,
        borderRadius: "4px",
        border: "1px solid var(--border)",
        background: "var(--bg-alt)",
      }}
    >
      {shapes.map((s, i) =>
        s.kind === "circle" ? (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.fill} opacity={s.opacity} />
        ) : (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill} opacity={s.opacity} />
        ),
      )}
    </svg>
  );
}
```

- [ ] **Step 2: Add the hero to the article page**

In `src/app/(site)/[locale]/blog/[slug]/page.tsx`, add the import:

```tsx
import PostArt from "../../../../../components/PostArt";
```

Then, between the closing `</h1>` and the `<div className="blog-prose">`, insert:

```tsx
            <div style={{ marginBottom: "56px" }}>
              <PostArt slug={slug} category={meta.category} variant="hero" />
            </div>
```

The `<h1>` currently has `marginBottom: "56px"`. Change it to `marginBottom: "40px"` so the hero does not sit too far from the title.

- [ ] **Step 3: Add the tile to the index page**

In `src/app/(site)/[locale]/blog/page.tsx`, add the import:

```tsx
import PostArt from "../../../../components/PostArt";
```

The row `<Link>` currently has `style={{ display: "block", padding: "40px 0", ... }}`. Change `display: "block"` to a flex row so the tile sits left of the text:

```tsx
                      style={{
                        display: "flex",
                        gap: "24px",
                        alignItems: "flex-start",
                        padding: "40px 0",
                        textDecoration: "none",
                        color: "inherit",
                      }}
```

Immediately inside that `<Link>`, before the existing category/date `<div>`, insert the tile and wrap the existing text content in a growing div:

```tsx
                      <PostArt slug={post.slug} category={post.category} variant="tile" />
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
```

and close that `<div>` after the `readMore` `<span>`, before `</Link>`.

- [ ] **Step 4: Verify it type-checks and builds**

Run: `npx tsc --noEmit`
Expected: no errors in `PostArt.tsx` or either blog page

Run: `npm run build`
Expected: build succeeds; `/en/blog` and `/de/blog` and every `/[locale]/blog/[slug]` prerender

- [ ] **Step 5: Look at it**

Run: `npm run dev`, open `http://localhost:3000/en/blog` and one post.

This is a judgement step, not a mechanical one. The index must still read as an editorial hairline list rather than a card grid. If the tile fights the layout, shrink it or reduce shape opacity in `post-art.mjs` before proceeding. Check dark mode too; the fills are palette variables, so it should follow automatically.

- [ ] **Step 6: Commit**

```bash
git add src/components/PostArt.tsx "src/app/(site)/[locale]/blog/page.tsx" "src/app/(site)/[locale]/blog/[slug]/page.tsx"
git commit -m "feat: render generated brand art on blog index and posts

Thin SVG renderer over the tested artSpec geometry. Hero band on the
article page, 72px tile on the index rows. Decorative, so aria-hidden
with no invented alt text.

Index rows become a flex row to seat the tile; the hairline editorial
list is otherwise untouched."
```

---

### Task 5: `offer` on BlogMeta, defaulted

**Files:**
- Modify: `src/lib/blog.ts`

- [ ] **Step 1: Add the field and collapse the duplicated meta construction**

`readMetaForFile` and `getPost` currently build near-identical `BlogMeta` objects. Adding a field to both doubles the drift risk, so extract a shared builder.

Replace the whole of `src/lib/blog.ts` from the `BlogMeta` type through `getPost` with:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_OFFER, isOfferKey } from "./offers.mjs";
import type { OfferKey } from "./offers.mjs";

export type BlogMeta = {
  slug: string;
  locale: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  category: string;
  keywords: string[];
  /** Which productized offer this post's CTA points at. */
  offer: OfferKey;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Filenames look like "<slug>.<locale>.md". This derives the slug for a given
// locale, returning null when the file isn't an article for that locale.
function slugForLocale(filename: string, locale: string): string | null {
  const suffix = `.${locale}.md`;
  if (!filename.endsWith(suffix)) return null;
  return filename.slice(0, -suffix.length);
}

// Single builder for both read paths, so a new frontmatter field only has to be
// added in one place.
function toMeta(data: Record<string, unknown>, slug: string, locale: string): BlogMeta {
  return {
    slug,
    locale,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    // Posts published before offers existed carry no `offer` key. Defaulting
    // here is what retrofits them with no file edits.
    offer: isOfferKey(data.offer) ? data.offer : DEFAULT_OFFER,
  };
}

function readMetaForFile(filename: string, locale: string, slug: string): BlogMeta | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data } = matter(raw);
  return toMeta(data, slug, locale);
}

export function getAllPosts(locale: string): BlogMeta[] {
  let files: string[];
  try {
    files = fs.readdirSync(BLOG_DIR);
  } catch {
    return [];
  }

  const posts: BlogMeta[] = [];
  for (const filename of files) {
    const slug = slugForLocale(filename, locale);
    if (!slug) continue;
    const meta = readMetaForFile(filename, locale, slug);
    if (meta) posts.push(meta);
  }

  // Newest first.
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(
  locale: string,
  slug: string,
): { meta: BlogMeta; content: string } | null {
  const filename = `${slug}.${locale}.md`;
  const filePath = path.join(BLOG_DIR, filename);
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  return { meta: toMeta(data, slug, locale), content };
}

export function getAllSlugs(locale: string): string[] {
  return getAllPosts(locale).map((p) => p.slug);
}
```

Note `isOfferKey(data.offer)` narrows `unknown` to `OfferKey` via the type predicate in `offers.d.mts`, so no cast is needed.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors in `blog.ts`

Run: `npm run build`
Expected: succeeds. All 10 existing posts now carry `offer: "website-check"` at runtime despite no file having an `offer` key.

- [ ] **Step 3: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat: BlogMeta.offer, defaulted to website-check

Posts published before offers existed have no offer key, so defaulting
in toMeta retrofits all ten with no file edits.

Also collapses the duplicated meta construction in readMetaForFile and
getPost into one toMeta builder, so the next frontmatter field only has
to be added once."
```

---

### Task 6: Emit `offer` into frontmatter

**Files:**
- Modify: `scripts/blog/emit.mjs:5,10`
- Test: `scripts/blog/emit.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/blog/emit.test.mjs`:

```js
test("writes the offer key when present", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-16", category: "Web & Design", keywords: ["a", "b", "c", "d", "e"], offer: "direktbucher" };
  emitPost("with-offer", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  const en = matter(fs.readFileSync(path.join(dir, "with-offer.en.md"), "utf8"));
  assert.equal(en.data.offer, "direktbucher");
});

test("omits the offer key entirely when absent, rather than writing undefined", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-16", category: "Web & Design", keywords: ["a", "b", "c", "d", "e"] };
  emitPost("no-offer", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  const raw = fs.readFileSync(path.join(dir, "no-offer.en.md"), "utf8");
  assert.doesNotMatch(raw, /offer/, "an absent offer must not appear in the file at all");
  const en = matter(raw);
  assert.equal("offer" in en.data, false);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test "scripts/blog/emit.test.mjs"`
Expected: FAIL. The first fails because `offer` is not in `FIELD_ORDER`. The second fails because the current loop writes `offer: undefined`.

- [ ] **Step 3: Fix `emit.mjs`**

In `scripts/blog/emit.mjs`, change line 5:

```js
const FIELD_ORDER = ["title", "description", "excerpt", "date", "category", "keywords", "offer"];
```

and change the loop in `writeOne` (line 10) from:

```js
  for (const k of FIELD_ORDER) ordered[k] = frontmatter[k];
```

to:

```js
  // Only assign keys that are actually present. Assigning an absent optional
  // field (offer) would serialize it as an empty/undefined YAML key.
  for (const k of FIELD_ORDER) {
    if (frontmatter[k] !== undefined) ordered[k] = frontmatter[k];
  }
```

`offer` goes last so the field order of existing posts is untouched.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 30 tests, 0 fail

- [ ] **Step 5: Commit**

```bash
git add scripts/blog/emit.mjs scripts/blog/emit.test.mjs
git commit -m "feat: emit optional offer key into post frontmatter

FIELD_ORDER gains offer, last, so existing posts' field order is
untouched.

Also fixes a latent bug: the loop assigned every FIELD_ORDER key
unconditionally, so an absent optional field would serialize as
undefined. Now only defined keys are written."
```

---

### Task 7: Lint the offer key

**Files:**
- Modify: `scripts/blog/lint.mjs`
- Test: `scripts/blog/lint.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/blog/lint.test.mjs`. That file already has module-level fixtures named `goodFm` and `goodBody`; reuse them rather than writing new ones. Note `goodBody` links to `/en/seo`, so `pillarPath` must be `"seo"` for these to pass:

```js
test("accepts a valid offer key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, offer: "direktbucher" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("accepts an absent offer key", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("rejects an unknown offer key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, offer: "websitecheck" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /offer/i.test(x)));
});
```

- [ ] **Step 2: Run tests to verify the unknown-key case fails**

Run: `node --test "scripts/blog/lint.test.mjs"`
Expected: FAIL on "rejects an unknown offer key"; the other two pass vacuously.

- [ ] **Step 3: Add the rule**

In `scripts/blog/lint.mjs`, add the import at the top:

```js
import { isOfferKey } from "../../src/lib/offers.mjs";
```

and in the `// --- structure / contract ---` block, after the keywords check, add:

```js
  // `offer` is optional (blog.ts defaults it), but a typo must not ship — a bad
  // key renders no CTA at all, silently.
  if (fm.offer !== undefined && !isOfferKey(fm.offer)) {
    v.push(`offer: '${fm.offer}' is not a known offer key`);
  }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 33 tests, 0 fail

This step also proves the cross-runtime import works: a bare-node script has just imported the same module Next imports.

- [ ] **Step 5: Commit**

```bash
git add scripts/blog/lint.mjs scripts/blog/lint.test.mjs
git commit -m "feat: reject unknown offer keys at generation time

lint.mjs imports isOfferKey from src/lib/offers.mjs, so the validator and
the renderer cannot disagree about which keys exist. A typo in
topics.yaml would otherwise ship a post whose CTA renders nothing."
```

---

### Task 8: Thread `offer` through the generator

**Files:**
- Modify: `scripts/blog/generate.mjs`
- Modify: `content/blog/topics.yaml`

- [ ] **Step 1: Pass the picked offer into both locales**

In `scripts/blog/generate.mjs`, after the `writePost(...)` call and before the lint calls, insert:

```js
  // `offer` is owner data from topics.yaml, never model output — the writer is
  // deliberately not told about offers, so its "NO prices" rule stays true.
  if (picked.offer !== undefined) {
    post.en.frontmatter.offer = picked.offer;
    post.de.frontmatter.offer = picked.offer;
  }
```

No change to `topics.mjs` is needed: `pickTopic` already returns `{ pillar, category, ...topic }`, so `picked.offer` is populated straight from the yaml entry.

- [ ] **Step 2: Document the key and set the pension topic**

In `content/blog/topics.yaml`, extend the header comment:

```yaml
# Seed keyword universe for auto-generated blog posts. Owner-steerable:
# add entries to keep the generator fed; each becomes one bilingual post.
# pillar keys map to the service pages: webdesign / apps-automation / seo.
# slug = the canonical URL slug (kebab-case, unique); keyword = primary SEO target.
# offer = OPTIONAL. Which productized offer the post's CTA points at.
#   Valid keys live in src/lib/offers.mjs: website-check | direktbucher.
#   Omit it and the post falls back to website-check, the entry offer, which
#   suits nearly every topic. Set direktbucher on pension/tourism topics.
```

Then on the `direct-booking-website-pension` entry, add the key:

```yaml
  - slug: direct-booking-website-pension
    keyword: "Direktbuchung Website"
    intent: "..."          # leave the existing intent text as-is
    offer: direktbucher
```

Scan the rest of the file for other pension, tourism, or holiday-let topics and set `offer: direktbucher` on those too. Leave everything else without an `offer` key.

- [ ] **Step 3: Verify end to end without calling the API**

Run: `npm test`
Expected: PASS, 33 tests

Run: `node -e "import('./scripts/blog/topics.mjs').then(async m => { const t = m.loadTopics('content/blog/topics.yaml'); const p = m.pickTopic({ topics: t, existingSlugs: new Set(), pillarCounts: { webdesign: 0, 'apps-automation': 0, seo: 0 } }); console.log(JSON.stringify(p, null, 2)); })"`
Expected: prints a picked topic object. Confirm that when the pension topic is the one picked, it carries `"offer": "direktbucher"`. This proves the spread works without spending an API call.

- [ ] **Step 4: Commit**

```bash
git add scripts/blog/generate.mjs content/blog/topics.yaml
git commit -m "feat: thread the topics.yaml offer key into post frontmatter

pickTopic already spread the topic entry, so no change to topics.mjs was
needed. Sets direktbucher on the pension topic, which the pillar alone
could never have selected since it is filed under webdesign."
```

---

### Task 9: The offer CTA

**Files:**
- Create: `src/components/BlogOfferCta.tsx`
- Modify: `src/i18n/dictionaries.ts`
- Modify: `src/app/(site)/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Add the copy to both dictionaries**

In `src/i18n/dictionaries.ts`, add a `blogOffer` block to the **en** dictionary, directly after its `blog: { ... }` block.

Unlike `homeOffers`, this is keyed by offer key rather than positional, so it cannot drift out of order:

```ts
    blogOffer: {
      overline: "NEXT STEP",
      items: {
        "website-check": {
          desc: "A focused audit of your existing site: technical SEO, speed, accessibility and DSGVO. Written report plus a call, and the fee is credited toward a project.",
          cta: "Book a Website-Check",
        },
        "direktbucher": {
          desc: "Complete direct-booking websites for guesthouses and holiday lets in Tirol. Live in two weeks, with the portal commission back in your pocket.",
          cta: "See Direktbucher",
        },
      },
    },
```

And the matching **de** block, after the de `blog: { ... }`:

```ts
    blogOffer: {
      overline: "NÄCHSTER SCHRITT",
      items: {
        "website-check": {
          desc: "Eine fokussierte Analyse Ihrer bestehenden Website: technisches SEO, Tempo, Barrierefreiheit und DSGVO. Schriftlicher Bericht plus Gespräch, und die Gebühr wird auf ein Projekt angerechnet.",
          cta: "Website-Check buchen",
        },
        "direktbucher": {
          desc: "Komplette Direktbuchungs-Websites für Pensionen und Ferienwohnungen in Tirol. Live in zwei Wochen, mit der Portal-Provision zurück in Ihrer Tasche.",
          cta: "Direktbucher ansehen",
        },
      },
    },
```

No prices here. They stay in `offers.mjs`, which is what keeps the Layer-0 guard active over the dictionary.

- [ ] **Step 2: Create the component**

Create `src/components/BlogOfferCta.tsx`:

```tsx
"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Overline from "./Overline";
import { OFFERS } from "../lib/offers.mjs";
import type { OfferKey } from "../lib/offers.mjs";

// Renders the matched offer at the end of an article. Prices come from
// offers.mjs, never from the dictionary — see .layer0-allow.
export default function BlogOfferCta({ offer }: { offer: OfferKey }) {
  const { dict, locale } = useLanguage();
  const d = dict.blogOffer;
  const item = d.items[offer];
  const meta = OFFERS[offer];
  // meta.href is an absolute werk URL (#118). Used as-is, no locale prefix.

  return (
    <aside style={{ marginTop: "80px", paddingTop: "48px", borderTop: "1px solid var(--border)" }}>
      <Overline marginBottom="1.5rem">{d.overline}</Overline>
      <Link
        href={meta.href}
        style={{
          display: "block",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "32px 28px",
          background: "var(--bg-alt)",
          textDecoration: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text)" }}>
            {meta.title}
          </h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "var(--text)", whiteSpace: "nowrap" }}>
            {meta.price[locale]}
          </span>
        </div>
        <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "24px" }}>
          {item.desc}
        </p>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
          {item.cta} →
        </span>
      </Link>
    </aside>
  );
}
```

- [ ] **Step 3: Render it after the article body**

In `src/app/(site)/[locale]/blog/[slug]/page.tsx`, add the import:

```tsx
import BlogOfferCta from "../../../../../components/BlogOfferCta";
```

and immediately after the closing `</div>` of `<div className="blog-prose">`, before `</article>`:

```tsx
            <BlogOfferCta offer={meta.offer} />
```

The existing prose links to the pillar page and `/contact` stay. They are enforced by `lint.mjs` and they are good internal linking. This card is additive.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors. If `d.items[offer]` errors, the de and en `blogOffer` blocks have different shapes; make them match.

Run: `npm run build`
Expected: succeeds, all posts prerender

Run: `npm run dev` and open a post in both locales. Confirm the card shows the right price, the link goes to `/en/website-check`, and it does not clash with the closing prose links.

- [ ] **Step 5: Commit**

```bash
git add src/components/BlogOfferCta.tsx src/i18n/dictionaries.ts "src/app/(site)/[locale]/blog/[slug]/page.tsx"
git commit -m "feat: matched offer CTA at the end of every blog post

Every post now points at a productized offer rather than only at the
pillar page and the contact form. The card is additive; the lint-enforced
prose links stay.

Copy is keyed by offer key in the dictionary rather than positional, so
unlike homeOffers it cannot drift out of order. Prices stay in
offers.mjs, out of the dictionary, so the Layer-0 guard keeps covering
all site copy."
```

---

### Task 10: Full verification

**Files:** none

- [ ] **Step 1: Whole suite**

Run: `npm test`
Expected: 33 tests, 33 pass, 0 fail

- [ ] **Step 2: Types**

Run: `npx tsc --noEmit`
Expected: no errors in any file this plan touched

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: clean

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: succeeds. Every `/[locale]/blog/[slug]` prerenders for both locales.

- [ ] **Step 5: Prove the retrofit with no file edits**

Run: `git status --short content/blog/`
Expected: only `topics.yaml` modified. **No `.md` file may appear.** If one does, someone hand-edited a post and the defaulting is not doing its job.

Run: `node -e "import('./src/lib/blog.ts')"` will not work (TypeScript). Instead confirm visually: open `/en/blog/what-a-website-costs` in `npm run dev` and check the CTA shows Website-Check at €290, despite that file having no `offer` key.

- [ ] **Step 6: Confirm the Layer-0 guard still bites**

The guard must still block prices elsewhere. Verify the allowlist did not over-broaden:

```bash
grep -rn "€" src/ --include="*.tsx" --include="*.ts"
```
Expected: no output. `offers.mjs` is excluded by the `--include` filters, so any hit means a `€` leaked into a `.ts`/`.tsx` file and must be moved into `offers.mjs`.

- [ ] **Step 7: Optional e2e**

Add to the existing `tests/e2e/`:

```ts
test("a blog post renders decorative art and an offer CTA", async ({ page }) => {
  await page.goto("/en/blog/what-a-website-costs");
  await expect(page.locator('svg[aria-hidden="true"]').first()).toBeVisible();
  await expect(page.locator('a[href="/en/website-check"]')).toBeVisible();
});
```

Run: `npm run test:e2e`

---

## Self-review notes

**Spec coverage:** every component in the spec maps to a task. `offers.mjs`/`d.mts` (T1), `HomeOffers` + `.layer0-allow` (T2), `post-art.mjs` (T3), `PostArt.tsx` + both pages (T4), `blog.ts` (T5), `emit.mjs` (T6), `lint.mjs` (T7), `generate.mjs` + `topics.yaml` (T8), `BlogOfferCta` + dict (T9). The spec's testing section maps to T1/T3/T6/T7 plus T10's build and e2e.

**Naming consistency:** `artSpec`, `isOfferKey`, `OFFER_ORDER`, `DEFAULT_OFFER`, `OFFERS`, `toMeta` are used identically in every task that references them.

**Known deviation from the spec:** the spec's `Offer` type has `key`, `href`, `title`, `price`. The implementation adds nothing to that. The spec's `post-art` shape list did not include `opacity`; it is added here (and tested for range) because flat full-strength accent blocks would be too loud under an editorial headline.

**Deliberate ordering:** Task 1 cannot be committed alone, because its `€` literal is blocked by the pre-commit hook until Task 2 moves the allow entry. This is called out in T1 Step 7 rather than worked around with `--no-verify`.
