# Blog Index Restructure + JSON-LD Box

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Turn `/blog` from a flat list into a scannable knowledge hub (reading time + category filter), and give the structured-data post a copy-pasteable JSON-LD template that a local business can genuinely use.

**Owner-approved (2026-07-18):** index restructure + JSON-LD box now; interactive calculators deferred (they need an MDX/widget build the current plain-markdown renderer can't support).

**Depends on:** the crafted-graphic integration landing first — it edits `blog/page.tsx` and every post's frontmatter. Do not run these concurrently.

---

## Constraints discovered before writing this

**The JSON-LD must render as a fenced code block, never as a live `<script type="application/ld+json">`.** The template describes a *fictional example business*. Emitting it as real structured data on a Lechner Studios page would be fabricated markup pointing at a company that does not exist — a Google guidelines violation and an honesty failure. Displayed as code, it is a teaching artifact. The post body already renders through `ReactMarkdown` + `remarkGfm`, so a fenced block is inert text. That is the correct and safe path.

**No `priceRange` in the template.** The natural Austrian value `"€€"` trips the Layer-0 pre-commit scan, which greps `[€£¥]` with no digit required, so the commit would be blocked. (The blog's own `lint.mjs` would NOT catch it — its pattern needs a € adjacent to a digit — so the failure would surface confusingly at commit time.) `priceRange` is optional; it is omitted and the prose says why. Do not add it back.

**Reading time is derived, never stored.** Computing it from the body at render keeps it honest when a post is edited, and avoids another frontmatter field the writer could get wrong.

---

## Task S1: Reading time

**Files:** `src/lib/blog.ts` (or a small `src/lib/reading-time.mjs`), both blog pages, `src/i18n/dictionaries.ts`.

- [ ] Add a pure `readingTime(body)` helper: word count / 200 wpm, rounded up, minimum 1. Put it in `src/lib/reading-time.mjs` with a `.d.mts` sibling (the repo's established `.mjs` + `.d.mts` pattern — never `.d.ts`, which TypeScript silently ignores for `.mjs`).
- [ ] Tests in `src/lib/reading-time.test.mjs`:
  - empty body → 1 (never 0)
  - ~200 words → 1
  - ~450 words → 3
  - markdown syntax (`##`, `[text](url)`, backticks) is not counted as extra words
  - identical body → identical result (pure)
- [ ] `getAllPosts` must expose it. The index currently reads only frontmatter via `readMetaForFile`, which does NOT parse the body — check this. If the body isn't available there, read `content` in `readMetaForFile` and compute, or add a `minutes` field to `BlogMeta`. **Verify before assuming.**
- [ ] Render next to the date on BOTH the index rows and the article header: `16. Juli 2026 · 4 Min. Lesezeit` (de) / `16 July 2026 · 4 min read` (en). Add `dict.blog.readingTime` as a template string with a `{n}` token per locale; do not concatenate English words in the de path.

## Task S2: Category filter chips

**Files:** `src/app/(site)/[locale]/blog/page.tsx`, a new `src/components/BlogFilter.tsx`, dictionaries.

The index page is a server component; filtering needs a client component.

- [ ] `BlogFilter.tsx` (`"use client"`): renders `[Alle] [Web & Design] [Apps & Automation] [SEO & Growth] [Brand & Identity]` as chips, holds the active category in state, and filters the rendered list.
- [ ] Cleanest split: keep data fetching on the server, pass the already-built post list into the client component, and let it filter in memory. Do NOT fetch on the client.
- [ ] Chips must be real `<button>` elements with `aria-pressed`, a visible focus ring, and a hit area of at least 44px (the a11y floor). Category counts in each chip (`Web & Design 5`) help scanning.
- [ ] Derive the category list from the posts actually present, not a hardcoded array — a fifth pillar must not silently vanish from the filter the way the 4th pillar vanished from the old art map.
- [ ] The chips are a progressive enhancement: with JS disabled the full list must still render. Verify the server output contains all 19 posts before any filtering.
- [ ] Keep the editorial hairline list intact. Chips sit above the list, mono/uppercase, in the existing type language. This must not become a card grid.

## Task S3: The copy-pasteable JSON-LD box

**Files:** `content/blog/structured-data-local-business.en.md` and `.de.md` (body only — do not touch frontmatter).

Insert a section with the template below plus the surrounding guidance. Write the German version in de-AT, Sie-Form; the English version is a real localization, not a literal translation.

The template (both locales use the same code block; only the prose around it differs):

````
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Musterbetrieb GmbH",
  "url": "https://www.musterbetrieb.at",
  "image": "https://www.musterbetrieb.at/bilder/betrieb.jpg",
  "logo": "https://www.musterbetrieb.at/bilder/logo.svg",
  "telephone": "+43 512 123456",
  "email": "office@musterbetrieb.at",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstraße 1",
    "postalCode": "6020",
    "addressLocality": "Innsbruck",
    "addressRegion": "Tirol",
    "addressCountry": "AT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.2692,
    "longitude": 11.4041
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Tirol"
  },
  "sameAs": [
    "https://www.facebook.com/musterbetrieb",
    "https://www.instagram.com/musterbetrieb"
  ]
}
```
````

Guidance that must accompany it (this is the information gain — the template alone is commodity):

- **Use the most specific type that fits.** `LocalBusiness` works, but `Restaurant`, `HairSalon`, `HomeAndConstructionBusiness` or `Electrician` tell search engines more. The full list is on schema.org.
- **Every value must match what a visitor can actually see on the page.** Schema that contradicts the visible content is worse than none.
- **`addressCountry` takes the ISO code `AT`,** not "Österreich".
- **Use your real coordinates.** Right-click your location in a map service and copy them; invented coordinates put you on the wrong street.
- **Kleinunternehmer: leave `vatID` out entirely** rather than inventing one. An absent optional field is fine; a wrong one is not.
- **Where it goes:** inside `<head>` as `<script type="application/ld+json">…</script>`.
- **Validate before you trust it:** Google's Rich Results Test and validator.schema.org. Structured data that fails validation does nothing.
- Note `priceRange` is deliberately absent — it is optional, and a placeholder is worse than an omission.

- [ ] Confirm the post's existing closing links to the pillar page and `/contact` survive (they are lint-enforced).
- [ ] Confirm `npm test` still passes — `lint.mjs` runs over post bodies, and a large JSON block must not trip the metric/percent or price rules. **Run the linter against the edited post specifically.**

## Verification

- `npm test` green (existing + the new reading-time tests)
- `npx tsc --noEmit` clean, `npm run lint` no new errors, `npm run build` prerenders all 38 blog pages
- The rendered structured-data post shows the JSON as a code block, and the page contains **no** `<script type="application/ld+json">` carrying `Musterbetrieb` (only the real `BlogPosting` schema the page already emits)
- `/blog` shows reading time on every row; chips filter without a page load; the list still renders fully with JS off
- Render `/de/blog` and `/en/blog` and confirm the editorial character survives
