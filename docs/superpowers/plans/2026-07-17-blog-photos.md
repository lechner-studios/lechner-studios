# Blog Photos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Replace the generated SVG tiles (which render as placeholder identicons) with real, self-hosted Pexels photos, per post, with a light cool tonal treatment and photographer attribution.

**Supersedes:** the `PostArt` half of `2026-07-16-blog-images-offer-cta-design.md`. The offer-CTA half of that work stands unchanged.

**Owner-approved (2026-07-17):** auto-fetch at generation time; Pexels only; light cool tonal treatment; credit line; backfill all 19; results reviewed in a PR before merge.

---

## Hard constraints (verified, not assumed)

- **DSGVO A4 — zero third-party runtime requests.** Images are downloaded at generation/backfill time and committed to `public/blog/`. The browser never calls Pexels. This is why we download rather than hotlink.
- **Unsplash is unusable here.** Its API guidelines make hotlinking mandatory and prohibit rehosting (verified against help.unsplash.com, 2026-07-17). That collides with A4. **Pexels only.**
- **Pexels attribution is required.** Show a photographer credit and a Pexels link wherever the image is prominently displayed. We render a credit line under the hero on each post page.
- **Key is dev/CI-side only.** `PEXELS_API_KEY` lives in `.env.local` (gitignored) locally, and must be added as a GitHub Actions secret for `blog-generate.yml` before the next auto-generation run (follow-up, not this plan).

## Verified Pexels response shape

`GET https://api.pexels.com/v1/search?query=<q>&orientation=landscape&per_page=15`, header `Authorization: <key>`. Each `photos[]` entry:
`{ id, photographer, photographer_url, url (pexels page), alt, avg_color, width, height, src: { original, large2x, large, medium, small, portrait, landscape, tiny } }`.
Download `src.large` (already compressed, ~940px wide). Rate limit 25000/month.

## Query strategy (the relevance crux)

Literal keywords ("website cost") return generic laptop-and-coins stock — the exact "looks like everyone else" failure. Instead:

- **Per-category theme query**, owner-steerable, cool/architectural/Alpine and deliberately NOT literal:
  ```
  CATEGORY_IMAGE_QUERIES = {
    "Web & Design":       "minimalist modern architecture interior",
    "Apps & Automation":  "abstract geometric architecture lines",
    "SEO & Growth":       "alpine mountain landscape mist",
    "Brand & Identity":   "minimal design studio still life",
  }
  // fallback for an unknown category: "minimal architecture"
  ```
- **Deterministic variety within a theme:** fetch `per_page=15`, pick index `hash(slug) % results.length`. Different posts in one category get different but cohesive photos; the same slug always picks the same photo (stable across rebuilds).
- **Per-post override:** an optional `imageQuery:` in `topics.yaml` beats the category theme, mirroring the `offer:` key. Existing published posts have no topics entry, so they use the category theme via their frontmatter `category`.

These themes are a first pass. The PR review is the quality gate — the owner swaps any weak pick.

## File structure

| File | Status | Responsibility |
|---|---|---|
| `scripts/blog/images.mjs` | Create | Shared, bare-node: query derivation, deterministic pick, fetch+download. |
| `scripts/blog/images.test.mjs` | Create | Query derivation + pick determinism (no network). |
| `scripts/blog/backfill-images.mjs` | Create | One-off: fetch+commit images for the 19 existing posts, write frontmatter. |
| `src/lib/blog.ts` | Modify | `BlogMeta` gains `image`, `imageAlt`, `imageCredit`, `imageCreditUrl`, `imagePexelsUrl` (all optional). |
| `scripts/blog/emit.mjs` | Modify | Add the 5 image fields to `FIELD_ORDER` (after `offer`). |
| `scripts/blog/lint.mjs` | Modify | If `image` present, must start with `/blog/`. |
| `scripts/blog/generate.mjs` | Modify | After writing a post, fetch its photo and add image fields to both locales' frontmatter. |
| `content/blog/topics.yaml` | Modify | Document optional `imageQuery:`. |
| `src/components/PostImage.tsx` | Create | Renders the self-hosted photo (hero + tile) with cool tonal treatment; hero shows credit. |
| `src/app/(site)/[locale]/blog/page.tsx` | Modify | Swap `PostArt` tile → `PostImage` tile. |
| `src/app/(site)/[locale]/blog/[slug]/page.tsx` | Modify | Swap `PostArt` hero → `PostImage` hero + credit. |
| `src/lib/post-art.mjs` `.d.mts` `.test.mjs`, `src/components/PostArt.tsx` | Delete | The SVG art the photos replace. |
| `.gitignore` | No change | Verified: a real file in `public/blog/` commits (`git status` → `?? public/blog/…`). Note: `git check-ignore public/blog/` on the *directory* falsely reports ignored — a CRLF-`.gitignore` red herring; test with an actual file, never the directory path. |

Frontmatter fields written per post:
```
image: /blog/<slug>.jpg
imageAlt: "<pexels alt>"
imageCredit: "<photographer>"
imageCreditUrl: "<photographer_url>"
imagePexelsUrl: "<pexels photo page url>"
```

## Treatment (light, cool)

`PostImage` renders `<img>` with `object-fit: cover`, plus a light tonal treatment so photos sit with the cool palette rather than fighting it:
- `filter: saturate(0.82) contrast(1.02)`
- a low-opacity cool overlay: a sibling absolutely-positioned layer, `background: var(--accent)`, `opacity: 0.10`, `mix-blend-mode: multiply`, `pointer-events: none`.
Keep it subtle (A1 forbids gimmicky template tells; this is a wash, not a duotone). Rounded 4px, `1px solid var(--border)`, matching the old tile.

## Attribution render

Under the hero only (the tile is a 72px thumbnail; its credit lives on the post page it links to):
```
Foto: <a href={imageCreditUrl}>{imageCredit}</a> · <a href={imagePexelsUrl}>Pexels</a>
```
Mono, `--text-faint`, ~0.7rem, `target="_blank" rel="noopener"`. Both en and de use "Foto:" (acceptable de-AT; en readers understand it, and it keeps one code path — or use "Photo:" for en if trivial).

---

### Task P1: Shared image module

**Files:** Create `scripts/blog/images.mjs`, `scripts/blog/images.test.mjs`.

- [ ] **Step 1 — failing tests** (`images.test.mjs`, `node:test`, no network):

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { queryFor, pickIndex, CATEGORY_IMAGE_QUERIES } from "./images.mjs";

test("queryFor uses the per-post override when present", () => {
  assert.equal(queryFor({ category: "Web & Design", imageQuery: "custom thing" }), "custom thing");
});
test("queryFor falls back to the category theme", () => {
  assert.equal(queryFor({ category: "SEO & Growth" }), CATEGORY_IMAGE_QUERIES["SEO & Growth"]);
});
test("queryFor falls back again for an unknown category", () => {
  assert.equal(queryFor({ category: "Nope" }), "minimal architecture");
});
test("pickIndex is deterministic and in range", () => {
  assert.equal(pickIndex("what-a-website-costs", 15), pickIndex("what-a-website-costs", 15));
  for (const n of [1, 3, 15]) {
    const i = pickIndex("some-slug", n);
    assert.ok(i >= 0 && i < n, `${i} out of range for ${n}`);
  }
});
test("pickIndex differs across slugs (usually)", () => {
  const a = pickIndex("slug-alpha", 15), b = pickIndex("slug-bravo", 15);
  assert.equal(typeof a, "number"); assert.equal(typeof b, "number");
});
test("different categories map to different queries", () => {
  const qs = Object.values(CATEGORY_IMAGE_QUERIES);
  assert.equal(new Set(qs).size, qs.length);
});
```

- [ ] **Step 2** — run, watch fail.

- [ ] **Step 3 — implement `images.mjs`:**

```js
// Shared, bare-node (imported by generate.mjs and backfill-images.mjs).
// Pexels only: Unsplash mandates hotlinking, which breaks DSGVO A4. We download
// and commit; the browser never calls Pexels.

export const CATEGORY_IMAGE_QUERIES = {
  "Web & Design": "minimalist modern architecture interior",
  "Apps & Automation": "abstract geometric architecture lines",
  "SEO & Growth": "alpine mountain landscape mist",
  "Brand & Identity": "minimal design studio still life",
};
const FALLBACK_QUERY = "minimal architecture";

// Per-post override (topics.yaml imageQuery) beats the category theme.
export function queryFor(post) {
  if (post.imageQuery && String(post.imageQuery).trim()) return String(post.imageQuery).trim();
  return CATEGORY_IMAGE_QUERIES[post.category] ?? FALLBACK_QUERY;
}

// FNV-1a, same family as the (removed) art hash. Deterministic pick so a slug
// always resolves to the same photo across rebuilds.
function hash(str) {
  let h = 0x811c_9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x0100_0193) >>> 0; }
  return h >>> 0;
}
export function pickIndex(slug, count) {
  if (count <= 0) return 0;
  return hash(slug) % count;
}

// Live: search Pexels, pick a photo, download src.large to disk. Returns the
// frontmatter image fields, or null if nothing usable was found.
export async function fetchPhoto({ post, slug, apiKey, outDir, fetchImpl = fetch }) {
  const query = queryFor(post);
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=15`;
  const res = await fetchImpl(url, { headers: { Authorization: apiKey } });
  if (!res.ok) throw new Error(`pexels search ${res.status} for "${query}"`);
  const data = await res.json();
  const photos = (data.photos || []).filter((p) => p.src?.large);
  if (photos.length === 0) return null;
  const photo = photos[pickIndex(slug, photos.length)];

  const imgRes = await fetchImpl(photo.src.large);
  if (!imgRes.ok) throw new Error(`pexels image download ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const fs = await import("node:fs");
  const path = await import("node:path");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${slug}.jpg`), buf);

  return {
    image: `/blog/${slug}.jpg`,
    imageAlt: String(photo.alt || query),
    imageCredit: String(photo.photographer || "Pexels"),
    imageCreditUrl: String(photo.photographer_url || photo.url || "https://www.pexels.com"),
    imagePexelsUrl: String(photo.url || "https://www.pexels.com"),
  };
}
```

- [ ] **Step 4** — `npm test` green (adds 6). **Step 5** — commit.

### Task P2: Frontmatter plumbing (blog.ts, emit, lint)

- [ ] `BlogMeta` gains the 5 optional fields; `toMeta` reads them (`typeof x === "string" ? x : undefined`).
- [ ] `emit.mjs` `FIELD_ORDER` appends `"image","imageAlt","imageCredit","imageCreditUrl","imagePexelsUrl"` after `offer`. The undefined-skip guard already added covers absence.
- [ ] `lint.mjs`: `if (fm.image !== undefined && !String(fm.image).startsWith("/blog/")) v.push("image: must be a /blog/ path")`.
- [ ] Tests: extend `emit.test.mjs` (image field round-trips; absent → omitted) and `lint.test.mjs` (bad image path rejected; absent allowed). `npm test` green. Commit.

### Task P3: Generator wiring + topics doc

- [ ] `generate.mjs`: after the offer block, if `process.env.PEXELS_API_KEY` is set, `await fetchPhoto({ post: picked, slug: picked.slug, apiKey, outDir: path.join(ROOT,"public","blog") })` and assign the returned fields to both `post.en.frontmatter` and `post.de.frontmatter`. On throw/null, `console.warn` and continue (a post without a photo is still valid). Same image for both locales (keyed by slug).
- [ ] `topics.yaml`: document optional `imageQuery:` in the header comment.
- [ ] Verify with a dry-run path that does not spend the daily generation (the module tests cover logic; do not call the live API in CI tests). Commit.

### Task P4: Render + remove SVG

- [ ] Create `PostImage.tsx` (server component): props `{ image, alt, credit, creditUrl, pexelsUrl, variant }`. Renders a positioned wrapper (radius 4, `1px solid var(--border)`, `overflow:hidden`), the `<img src={image} alt={alt}>` at `object-fit:cover` `width:100%` `height:100%` with `filter: saturate(0.82) contrast(1.02)`, and the cool overlay layer. Hero: full width, height 200px. Tile: 72×72. If `!image`, render a plain `var(--bg-alt)` block of the same box (graceful fallback, NOT an identicon).
- [ ] Credit line is rendered by the PAGE under the hero (so the tile stays clean), using `imageCredit/imageCreditUrl/imagePexelsUrl`. Only when `image` present.
- [ ] `blog/[slug]/page.tsx`: replace `<PostArt … variant="hero">` with `<PostImage … variant="hero">` + the credit line beneath.
- [ ] `blog/page.tsx`: replace `<PostArt … variant="tile">` with `<PostImage … variant="tile">`.
- [ ] Delete `post-art.mjs`, `post-art.d.mts`, `post-art.test.mjs`, `PostArt.tsx`.
- [ ] `npm test` (drops the 8 art tests — expected), `tsc`, `lint`, `build` all green. Commit.

### Task P5: Backfill the 19 (orchestrator runs, not a subagent)

- [ ] `backfill-images.mjs`: for each `content/blog/*.en.md`, read frontmatter; if it already has `image`, skip; else derive `{ category, imageQuery? }`, `fetchPhoto`, and rewrite BOTH `.en.md` and `.de.md` frontmatter via gray-matter (preserve field order using emit's `FIELD_ORDER`). Log each pick (slug → photographer → pexels url) for review.
- [ ] Run locally with `node --env-file=.env.local scripts/blog/backfill-images.mjs`. Inspect the 19 picks and the committed jpgs before committing. This step makes live API calls and commits binaries — the orchestrator runs and eyeballs it, then renders `/en/blog` to confirm.

## Verification (end)

- `npm test` green (art tests removed, image tests added).
- `npm run build` prerenders all 38 blog pages.
- Every post page shows a photo + credit; `/blog` shows photo tiles; no identicons remain.
- `grep -rl "images.pexels.com" .next/server/app/*/blog` → **no runtime hotlinks** (all `src` are `/blog/*.jpg`).
- `public/blog/` is committed, not gitignored.
- Render `/en/blog` and one post in the browser; confirm photos, treatment, credit, and that the index still reads as an editorial list.
