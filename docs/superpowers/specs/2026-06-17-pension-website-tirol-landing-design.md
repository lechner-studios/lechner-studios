# Design — "Pension Website Tirol" SEO Landing

**Date:** 2026-06-17
**Repo:** `lechner-studios` (live, indexed authority domain)
**Status:** Design — awaiting owner review before implementation plan.
**Wedge:** The inbound entry point for the Direktbucher offer ([[project-direktbucher-offer]]). The Pension demo is already live at `https://demos.lechner-studios.at/pension`; this landing is what ranks and converts traffic into inquiries.

---

## Goal

A keyword-optimised, conversion-focused landing at `lechner-studios.at/[locale]/pension-website-tirol` that (a) ranks for Pension/FeWo website searches in Tirol, (b) communicates the Direktbucher value (own website → direct bookings → less OTA commission), (c) proves it with the live demo, and (d) drives a qualified inquiry. Inbound only (no cold outreach — legal).

## Decisions (owner-confirmed)
- **Home:** new route on `lechner-studios.at` (highest authority; agent-buildable end-to-end).
- **Slug:** `pension-website-tirol` (shared across locales — routing uses one folder per segment). **DE keyword-optimised**; EN content/meta target English keywords ("Tyrol guesthouse / holiday-apartment website").
- **Bilingual:** DE + EN (site convention); DE is the primary SEO target.
- **Structure:** complete (hero → value → live proof → offer → FAQ → CTA).

## Non-goals (YAGNI / honesty)
- **No fabricated metrics** (e.g. "+40% speed") and **no testimonials** — none exist yet. Proof = the live demo + capability, framed honestly.
- No full multi-step typeform questionnaire (only a light 1-question qualifier here).
- No performance-comparison slider yet (needs real Lighthouse data — see Notes).
- No sub-brand (Vistera/VOT) landings — paused/on-hold; would re-create the over-claim gap.

---

## Architecture

- **Route:** `src/app/(site)/[locale]/pension-website-tirol/page.tsx` — mirrors the existing service-page pattern (`webdesign/page.tsx`): `generateMetadata` via `pageMetadata(locale, "/pension-website-tirol", title, description)`; async page; `notFound()` on bad locale; `LanguageProvider` + `Nav` + `Footer`.
- **Copy:** a new `pensionLanding` section in `src/i18n/dictionaries.ts` (DE + EN, lockstep) — keeps copy out of the component, consistent with the codebase.
- **Component:** `src/components/PensionLanding.tsx` (client, `useLanguage()`, `Reveal`, brand CSS vars) holding the section markup. One focused file.
- **Sitemap:** add `/pension-website-tirol` to `src/app/(site)/[locale]/sitemap.ts` routes.
- **Structured data:** a small `PensionLandingJsonLd` server component (or inline `<script type="application/ld+json">`) emitting **Service**, **FAQPage**, and **BreadcrumbList** JSON-LD.

## Sections (complete structure + folded feedback)

1. **Hero** — DE keyword headline (e.g. "Website für Ihre Pension in Tirol — die direkt bucht"), subline (less OTA-Provision, live in 2 Wochen), primary CTA → the qualifier (section 6).
2. **Pain → value (Provisionsrechner framing)** — "Sie zahlen Buchungsportalen ~15 % Provision; eine eigene Direktbuchungs-Website holt das zurück." Links to the live demo's Provisionsrechner.
3. **Live proof** — showcase + prominent link/button to the **real demo** `https://demos.lechner-studios.at/pension`, framed honestly ("ein Beispiel, das wir gebaut haben" — matches the demo's own "Beispielentwurf" label). This is the honest substitute for testimonials.
4. **The offer (Direktbucher)** — the 3 tiers at a glance (Basis €3.900 / **Komplett €6.900** ⭐ / Premium €9.900; care €99/€149/€199; "live in 2 Wochen"), → CTA. Not the full Angebot (that follows the inquiry). Numbers must match the Direktbucher SSOT (`websites/docs/offers/Direktbucher.md`).
5. **FAQ** — 4–5 Q&As targeting long-tail (e.g. "Was kostet eine Website für eine Pension?", "Wie lange dauert es?", "Bekomme ich eine Förderung?" → honest KMU.DIGITAL info, "Kann ich Booking.com-Provision sparen?"). Backs the FAQPage JSON-LD.
6. **CTA — light qualifier** — one question before the contact step (e.g. "Haben Sie schon eine Website?" or "Zahlen Sie aktuell Provision an Buchungsportale?"), then routes to the existing `/contact` form carrying that context (querystring or prefilled subject). DSGVO: no extra data stored beyond what /contact already collects; the qualifier is a UI step, not a new data sink.

**Folded feedback:** breadcrumb + Service + FAQ JSON-LD (4a, 5-schema); inline cross-links to `/webdesign` and `/seo` within the copy (4b); live-demo-as-interactive-proof (1a honest version); light qualifier (3a light); productized tiers (2a, already). Local fonts inherited from the site (5) — verify no remote font calls introduced.

## Honesty / compliance constraints
- All claims point to shipped capability (demo) or labelled offers — ADR-0038 A2.
- KMU.DIGITAL in the FAQ = informational only (client pursues it; LS not a registered consultant), matching the Angebot.
- Self-hosted fonts only; no Google Fonts / remote calls (DSGVO).
- DE/EN parity; `de-AT` Sie-Form; brand-canon (Cormorant/Italiana/General Sans, gold, AA contrast).

## Testing / verification
- `next build` + `tsc --noEmit` + lint clean.
- Route renders at `/de/pension-website-tirol` and `/en/pension-website-tirol`; appears in `/sitemap.xml`.
- JSON-LD validates (Service + FAQPage + BreadcrumbList present, well-formed).
- DE/EN dictionary parity; numbers match the Direktbucher SSOT.
- Render-first surface-audit: AA contrast on all sections incl. the tier table + CTA; no remote font requests (check network).
- Demo link resolves (200) to `demos.lechner-studios.at/pension`.

## What this spec produces
The bilingual landing route + copy + component + JSON-LD + sitemap entry. (The minor Werk→demos redirect cut-over in `websites/vercel.json` is a separate small follow-up, tracked below.)

---

## Notes — backlog from owner feedback (beyond this scope)

Captured for later wedges (do once the evidence/products exist):
1. **Real performance proof** — gather actual Lighthouse numbers (custom build vs typical Baukasten) → then a side-by-side perf slider. Honest only with real data.
2. **Social proof** — collect testimonials + a real metric after client #1; then place high on landing + service pages.
3. **Team / "family-run" humanisation** on `/about` (portraits, behind-the-scenes) — within the family-privacy rule (name + role only).
4. **Productize remaining niches/pillars** — extend the Direktbucher pattern (Gasthof/Skischule/Tischlerei demos exist) and the non-web pillars (per `websites/docs/Preisstrategie.md` deferral).
5. **Sub-brand landings/case studies** (Vistera/VOT) — only for shipped products, with real timelines; do NOT hype paused/on-hold products.
6. **Site-wide lead qualifier** — a fuller typeform-style intake (bottleneck: Zeit / Sichtbarkeit / veraltetes Design), DSGVO-minimal.
7. **Breadcrumbs site-wide** — visible + BreadcrumbList schema on blog and service pages.
8. **Cross-link audit** — inline pillar↔pillar links across existing pages.
9. **Impressum** — add UID when issued; periodic check that no remote font/CDN calls slipped in.
10. **Werk→demos cut-over** — verify/activate the `websites/vercel.json` redirects from retired GitHub-Pages mockups to `demos.lechner-studios.at`.

---

## Self-review
- **Placeholders:** none — sections, slug, route, copy intent, JSON-LD types all concrete. (Exact FAQ wording + final qualifier question land in the plan/copy.)
- **Consistency:** tier numbers reference the Direktbucher SSOT; KMU.DIGITAL framing matches the Angebot; honesty constraints align with ADR-0038 A2.
- **Scope:** one route, one repo, complete-but-bounded; backlog explicitly deferred.
- **Ambiguity:** slug is shared-per-folder with per-locale keyword optimisation (routing reality), stated explicitly to avoid the "different slug per locale" misread.
