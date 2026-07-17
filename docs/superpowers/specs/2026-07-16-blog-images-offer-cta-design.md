# Design — Blog art + offer CTAs

**Date:** 2026-07-16
**Repo:** `lechner-studios` (the brand site)
**Status:** Design — awaiting owner review before implementation plan.
**Why:** The blog posts are text-only. Every post closes with links to its pillar page and `/contact`, but none of them points at a productized offer. The blog is the top-of-funnel surface, and it currently hands readers to a generic contact form rather than to Website-Check (€290) or Direktbucher (from €3,900).

## Goal

Every blog post, the ten already published and every future auto-generated one, gets:

1. **Generated brand art**: a deterministic, on-brand hero band on the post and a small tile on the index.
2. **A matched offer CTA**: one card at the end of the post pointing at the offer that fits the topic.

Both must survive auto-generation. Retrofitting the ten existing posts by hand is a non-goal, because post #11 would silently lose the feature.

## Decisions (owner-approved)

- **Art = generated brand art**, not stock, not AI-per-post, not a curated library. Deterministic inline SVG derived from the slug, drawn in the Alpine palette. Zero licensing, zero per-post cost, no third-party fetch (which satisfies the DSGVO self-hosting rule by construction), and it scales with auto-generation.
- **Placement = post hero + small index tile.** The index tile stays small: a 72px square floated left of each row's text, inside the existing 40px-padded hairline row. `/blog` is an editorial hairline list rather than a card grid, and it must still read as one. The hero is a band at the full 880px column width, roughly 180px tall, sitting between the H1 and the prose.
- **Offer mapping = per-topic `offer:` key in `topics.yaml`, defaulting to `website-check`.** Pillar-based mapping was rejected. `direct-booking-website-pension`, the one topic that most obviously wants Direktbucher, is filed under the `webdesign` pillar, so the pillar cannot distinguish it.
- **Prices move to `src/lib/offers.mjs`** (plus a sibling `offers.d.mts` for types) as a single source of truth, shared by `HomeOffers.tsx`, the new CTA, and `lint.mjs`. This shrinks the Layer-0 exempted surface rather than growing it.

  It is `.mjs` rather than `.ts` for a hard reason: `scripts/blog/lint.mjs` runs under bare `node`, which cannot import a TypeScript module. A `.ts` file could not be the shared source. `tsconfig.json` already sets `allowJs: true`, and the sibling `offers.d.mts` gives the `.tsx` consumers their types.

## Existing plumbing (reused as-is)

- Posts: `content/blog/<slug>.<locale>.md`, parsed by `src/lib/blog.ts` (gray-matter). `slug` and `locale` derive from the filename.
- `scripts/blog/`: `topics.mjs` (seed + pick) feeds `writer.mjs` (Claude), then `lint.mjs` (guardrails), then `emit.mjs` (write files). `generate.mjs` orchestrates and finishes with `npm run build`.
- Palette is CSS-variable driven: `--accent` `#254268` / `--accent-2` `#4A6A4E` (light), `#8FA8C5` / `#8FB89A` (dark).
- `.layer0-allow` exempts the files that intentionally carry public prices, keeping the pre-commit currency/PII scan active everywhere else.

## Two properties that keep this small

**`pickTopic` already spreads the topic entry.** `topics.mjs:55` returns `{ pillar, category, ...topic }`, so an `offer:` key added to a `topics.yaml` entry reaches `picked.offer` with no change to `topics.mjs`.

**The palette is variable-driven.** SVG drawn with `var(--accent)` adapts to dark mode with no second codepath and no theme prop.

## Architecture

```
topics.yaml (offer: optional, owner-steerable)
  └─ pickTopic → picked.offer ──────────────┐
                                            │  (never reaches the writer)
writer.mjs (Claude) → body + frontmatter    │
  └─ lint.mjs ── validates offer key ───────┤
      └─ emit.mjs ── offer → frontmatter ───┘
          └─ content/blog/<slug>.<locale>.md
              └─ blog.ts ── offer ?? "website-check" → BlogMeta
                  ├─ blog/page.tsx      → <PostArt> tile
                  └─ blog/[slug]/page.tsx → <PostArt> hero + <BlogOfferCta>
                                              └─ lib/offers.mjs (price, href, title)

lib/offers.mjs  ← imported by BOTH lint.mjs (bare node) and *.tsx (Next).
                  This is why it is .mjs, not .ts.
lib/post-art.mjs ← pure geometry; PostArt.tsx is a thin renderer over it.
```

The writer is deliberately not told about offers. `offer` is owner data from `topics.yaml` rather than model output, so `writer.mjs:18` ("NO prices, € amounts") stays true and `lint.mjs:9`'s € ban keeps protecting the post body. The price never enters the markdown. A component renders it.

## Components

### `src/lib/offers.mjs` + `src/lib/offers.d.mts` (new)

Single source of truth for offer identity, importable from both runtimes.

`offers.mjs` (plain ESM, no types, runs under bare node):

```js
export const OFFERS = {
  "website-check": { key: "website-check", href: "/website-check", title: "Website-Check", price: { de: "€290", en: "€290" } },
  "direktbucher":  { key: "direktbucher",  href: "/pension-website-tirol", title: "Direktbucher", price: { de: "ab €3.900", en: "from €3,900" } },
};
export const OFFER_ORDER = [OFFERS["website-check"], OFFERS["direktbucher"]]; // HomeOffers' existing order
export const DEFAULT_OFFER = "website-check";
export function isOfferKey(v) { return typeof v === "string" && Object.hasOwn(OFFERS, v); }
```

`offers.d.mts` (types for the `.tsx` consumers):

```ts
export type OfferKey = "website-check" | "direktbucher";
export type Offer = {
  key: OfferKey;
  href: string;                 // locale-less; callers prefix /${locale}
  title: string;                // brand name, not translated
  price: { de: string; en: string };
};
export const OFFERS: Record<OfferKey, Offer>;
export const OFFER_ORDER: Offer[];
export const DEFAULT_OFFER: OfferKey;
export function isOfferKey(v: unknown): v is OfferKey;
```

`isOfferKey` is what `lint.mjs` imports, so the validator and the renderer can never disagree about which keys exist. That sharing is only possible because the module is `.mjs`.

Price strings are copied verbatim from the current `HomeOffers.tsx` array so the homepage renders identically.

### `src/components/HomeOffers.tsx` (modified, minimally)

Deletes its local `OFFERS` array and imports `OFFER_ORDER` instead. Behaviour is unchanged. It keeps mapping `dict.homeOffers.items[i]` to `OFFER_ORDER[i]` positionally, exactly as today.

That positional coupling is fragile, and the file's own header comment at line 11 flags it ("Ordered to mirror dict.homeOffers.items"). Fixing it means restructuring `dict.homeOffers.items` into a keyed shape, which is out of scope here. Noted, not fixed.

Once the `€` literals leave this file, its `.layer0-allow` entry is removed and replaced by one for `src/lib/offers.mjs`. Net effect: the exempted surface shrinks from two files to one, instead of growing to four.

### `src/lib/post-art.mjs` + `src/lib/post-art.d.mts` (new)

The art's geometry as a pure function, separated from JSX so it is testable with the tooling this repo already has (`node:test`). There is no React test runner here, so a `.tsx` render test is not an option without adding a whole test stack.

```js
// artSpec("what-a-website-costs", "Web & Design") → stable plain data
export function artSpec(slug, category) // → { family, seed, shapes: [{ kind, x, y, r?, w?, h?, rot?, fill }] }
```

- **Deterministic**: a small string hash of `slug` seeds the geometry. No `Math.random()`, no `Date`. The same slug always yields the same spec, which keeps SSG output stable across builds and makes the behaviour testable.
- **Family by category**: the category selects one of three geometry families, so all "Web & Design" posts look related while each post stays individual. A visual system rather than ten unrelated pictures.
- `fill` values are CSS variable names (`"var(--accent)"`), never hex.

### `src/components/PostArt.tsx` (new)

```ts
export default function PostArt({
  slug,
  category,
  variant,          // "hero" | "tile"
}: { slug: string; category: string; variant: "hero" | "tile" }): JSX.Element
```

A thin renderer. Calls `artSpec(slug, category)` and maps each shape to an SVG element. `variant` sets only the viewBox and CSS size (hero: full column width, ~180px tall; tile: 72px square). It holds no geometry logic of its own, so the tested pure function carries the determinism guarantee.

- **Themed by variables only**: fills come through from `artSpec` as `var(--accent)`, `var(--accent-2)`, `var(--border)`, `var(--bg-alt)`. No hardcoded hex, so dark mode is free.
- **Decorative**: `aria-hidden="true"` and `role="presentation"`. It carries no information the headline doesn't, so it takes no alt text. That is the right call for a screen reader and consistent with the care already shown by the skip-link and `dict.a11y`.
- No files, no `/public` writes, no build step. Inline SVG in the server-rendered HTML.

### `src/components/BlogOfferCta.tsx` (new)

```ts
export default function BlogOfferCta({ offer }: { offer: OfferKey }): JSX.Element
```

Renders one card after the article body: mono overline, offer title, price, one-line description, arrow CTA. Visually a sibling of the `HomeOffers` card (same border, radius, and hover language) so the site reads as one system.

Copy (label, description, CTA text) comes from a new `dict.blogOffer` block. Prices do not, matching how `homeOffers` keeps amounts out of the shared dictionary to preserve the Layer-0 guard over all site copy.

### `src/lib/blog.ts` (modified)

- `BlogMeta` gains `offer: OfferKey`.
- `offer: data.offer ?? DEFAULT_OFFER`. This defaulting is what retrofits the ten existing posts with zero file edits. None of them is a pension topic, so `website-check` is correct for all ten.
- `readMetaForFile` and `getPost` currently build near-identical meta objects. Adding a field to both duplicates the drift risk, so extract a shared `toMeta(data, slug, locale)` and have both call it. Targeted cleanup, justified by this change.

### `scripts/blog/emit.mjs` (modified)

- `FIELD_ORDER` gains `"offer"`, placed last so existing posts' field order is untouched.
- **Skip undefined keys.** The current loop assigns unconditionally:
  ```js
  for (const k of FIELD_ORDER) ordered[k] = frontmatter[k];
  ```
  With an absent `offer` this sets `ordered.offer = undefined`, which serializes badly. Guard it, and only assign when the value is defined. Without this fix, every post lacking an explicit offer emits a malformed frontmatter key.

### `scripts/blog/lint.mjs` (modified)

Imports `isOfferKey` from `../../src/lib/offers.mjs`. One rule: `offer` may be absent, but if present it must satisfy `isOfferKey`. This catches a typo in `topics.yaml` (`offer: websitecheck`) at generation time, rather than shipping a post whose CTA silently renders nothing.

### `scripts/blog/generate.mjs` (modified)

Passes `picked.offer` into both locales' frontmatter before linting. One line each for `en` and `de`.

### `content/blog/topics.yaml` (modified)

`offer:` documented in the header comment as optional, defaulting to `website-check`. Set `offer: direktbucher` on `direct-booking-website-pension` and any other pension or tourism topics.

## Data flow — the retrofit story

No existing `.md` file is edited. The ten published posts have no `offer` key, so `blog.ts` defaults them to `website-check`, and `PostArt` derives their art from slugs that already exist. The retrofit is a consequence of the defaults rather than a migration step.

## Testing

The repo has no vitest, no jest, and no React testing library. The three existing tests use Node's built-in runner (`node:test` + `node:assert/strict`) in plain `.mjs`, and all 11 pass today via:

```
node --test "scripts/blog/*.test.mjs"
```

There is no `test` npm script, and `blog-generate.yml` does not run these tests. This design adds tests, so it also adds the script:

```json
"test": "node --test \"scripts/blog/*.test.mjs\" \"src/lib/*.test.mjs\""
```

Everything below uses that existing tooling. Nothing new is installed.

- `scripts/blog/lint.test.mjs`: a valid offer key passes; an unknown key is rejected; an absent key is allowed.
- `scripts/blog/emit.test.mjs`: `offer` is written when present; no `offer` key is emitted when absent (the undefined guard above); field order is stable.
- `src/lib/offers.test.mjs`: `isOfferKey` accepts exactly the keys in `OFFERS` and rejects near-misses; `OFFER_ORDER` contains every key in `OFFERS` exactly once; `DEFAULT_OFFER` is a valid key.
- `src/lib/post-art.test.mjs`: `artSpec` is deterministic (same slug twice gives deep-equal output); different slugs give different output; the same category gives the same `family`; no `fill` value matches `/#[0-9a-f]{3,6}/i`.

`PostArt.tsx` and `BlogOfferCta.tsx` have no unit tests, because testing them would mean adding a React test stack that this repo has deliberately done without. They are thin renderers over tested pure functions, and they are covered by:

- `npm run build`, which `generate.mjs` already runs, exercising `generateStaticParams` across every post in both locales. A post that fails to render fails the generation run.
- `tsc` via the build, which type-checks the `offers.d.mts` contract at every call site.
- An optional Playwright case in the existing `tests/e2e/`, asserting a post page renders one `svg[aria-hidden="true"]` and one link to `/en/website-check`.

## Out of scope

- **`og:image`.** The art is inline SVG, and social cards need a rasterized file at a URL. Different machinery, separate job. `generateMetadata`'s `openGraph` block is untouched.
- **Folding `WebsiteCheck.tsx` and `WebsiteCheckJsonLd.tsx` into `lib/offers.mjs`.** They carry a price and a schema.org `priceCurrency`, so consolidating them is a larger refactor with its own JSON-LD risk.
- **Fixing the `HomeOffers` positional index coupling.** Needs a dictionary restructure.
- **Re-generating or hand-editing existing posts.** The defaults cover them.
- **Prose-quality guardrails in the generator.** Tracked separately; see the note below.

## Related, tracked separately

The published posts average 11 em dashes each (121 across 11 English posts), which reads as machine-written at a glance. `writer.mjs` never constrains punctuation or cadence, and `lint.mjs` never checks. That is a content-quality problem in the same two files this design touches, but it is a distinct concern from art and CTAs, and it deserves its own spec rather than being smuggled into this one.

## Risks

| Risk | Mitigation |
|---|---|
| Generated art looks cheap and undercuts a deliberately editorial design | Three category families in the brand palette, small index tile, hero band constrained to the 880px column. Render and eyeball before merging. The design bar here is the existing index, which is good. |
| `.layer0-allow` edit is wrong, so pre-commit blocks or the guard silently weakens | The allow entry moves `HomeOffers.tsx` to `src/lib/offers.mjs` in the same commit. Verify by committing; the hook is the test. |
| `offers.d.mts` and `offers.mjs` drift apart, since nothing type-checks the `.mjs` against its own declaration | `offers.test.mjs` asserts the runtime shape (every `OFFERS` key present in `OFFER_ORDER`, `DEFAULT_OFFER` valid). `tsc` catches the consumer side. Accepted residual risk of the `.mjs` + `.d.mts` pattern, and the price of sharing one module between node and Next. |
| `emit.mjs` undefined-key bug ships | Covered by an explicit `emit.test.mjs` case. |
| SVG bloats every post's HTML | Geometry is a handful of shapes rather than a traced image. Keep it under roughly 2KB inline. It costs one fewer network round-trip than an `<img>` would. |
