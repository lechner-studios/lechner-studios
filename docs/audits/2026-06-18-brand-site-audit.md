# Brand site audit — Lechner Studios (umbrella flagship)

**Date:** 2026-06-18
**Branch:** `main` (commit `9e779b3`)
**Method:** render-first. Local production build (`next build` + `next start -p 3990`, `MAINTENANCE_MODE` unset to bypass the maintenance rewrite), driven with Playwright. Routes captured desktop (1280) + mobile (390), light + dark, with step-scroll to trigger reveals. Screenshots in `C:/Users/blaqu/AppData/Local/Temp/lsaudit/`. Network panel + computed-style + contrast checks run in-browser.
**Coverage:** render-verified — home, about, webdesign, apps-automation, seo, work, contact, start, pension, impressum, privacy, blog (de) in light; home/about/webdesign/work/contact in dark; sticky-nav scroll states; mobile nav; chat widget. EN: `/en` home read in full; `/en/webdesign`, `/en/work`, `/en/contact` captured (localization spot-checked on home — not a full EN copy read). A4 (network), the about-stats reconciliation, and the reveal behaviour were verified empirically, not from source.

---

## Overall verdict — **needs significant work (not a ground-up redesign)**

The foundation is genuinely good: the wordmark is correct and crisp everywhere, the cool-Alpine palette is on-canon, typography is on-canon (General Sans / Cormorant / Italiana / IBM Plex Mono — zero Bricolage), DSGVO self-hosting is clean (zero third-party runtime requests, verified), the legal pages are complete and de-AT, and the honesty posture is exemplary (own products shown with honest *Aktiver Service / Demnächst / In Wartung* statuses, the Maya voice-AI demo is a real asset, no fake clients or invented metrics). The owner's instinct that it can't be stood behind is right, but the cause is **one systemic functional bug plus a credibility-of-craft gap**, not a broken brand.

Two things hold it back. (1) The service pages (webdesign / seo / apps-automation) are **walls of stacked paragraphs with no imagery, no proof, no rhythm** — they read like a text document, not a premium studio. (2) The forms (contact / start) bury their primary action behind a caption-styled submit and sit half-empty on desktop. Plus a cluster of P1 fixes (nav overlap on inner pages, a fragile reveal mechanism, FAB occlusion). Give the service pages visual structure, fix the form CTAs and the nav overlap, harden the reveal, and this is stand-behind-able without a redesign.

> **Note on the reveal animation:** an earlier pass suspected scroll-reveal sections rendered as permanent blank voids. Re-tested at human scroll cadence (3/3 runs the Work section reveals) and on reload+scroll-up (self-heals) — **normal users do not see permanent blanks**. The defect is narrower (P1-6): visibility is gated on `IntersectionObserver` with no fallback, so it blanks under fast/programmatic scroll and lacks a reduced-motion/no-JS safety net. Worth fixing, but not a blocker — the home/pension blanks seen in the batch screenshots were a fast-scroll capture artifact, not the live experience.

---

## P0 — blockers (site looks broken / cannot stand behind)

### P0-1 · Sticky nav overlaps page headings on inner pages
- **Where:** Work page top (`work_d_light.png`, `work_d_dark.png`) — "Produkte & Projekte" heading + first list rows sit *under* the fixed nav. Pension hero (`pension_d_light.png`) — "Eine Website für Ihre … bucht." headline is clipped/overlapped by the nav.
- **What's wrong:** inner-page top sections don't reserve the fixed-nav height (no top offset / scroll-margin), so the first heading renders behind the translucent nav bar.
- **Fix:** add top padding / `scroll-margin-top` equal to nav height on the first section of inner pages (or give those pages the same hero top-spacing the home/contact pages use).

---

## P1 — credibility / quality (must fix to read as a premium studio)

### P1-1 · Service pages are undifferentiated text-walls (the core "generic" problem)
- **Where:** `webdesign_d_light.png`, `seo_d_light.png`, `apps_d_light.png` (+ dark equivalents).
- **What's wrong:** each is a hero followed by 4-5 stacked `H?` + paragraph blocks, single column, **no imagery, no UI/screenshots, no proof, no metric, no visual rhythm change** until a pull-quote near the bottom. Typographically clean but visually monotone — reads as a Word doc, not a studio that commands authority. This is the single biggest "why isn't this good enough" driver after the reveal bug.
- **Fix:** introduce section variety — alternating layouts, a real artifact per service (a screenshot, a before/after, a small diagram, a numbered deliverable list with substance), and at least one piece of proof. Break the column. Borrow the stronger rhythm the pension page already has.

### P1-2 · Form submit buttons look like italic captions, not buttons
- **Where:** contact (`contact_d_light.png` / `_dark`), start (`start_d_light.png`).
- **What's wrong:** the primary submit ("Nachricht senden" / "Anfrage senden") is a `<button type=submit>` styled in **italic Cormorant, transparent background, 1px bottom border** (verified: `font: Cormorant, italic; bg: transparent; border: 0 0 1px`). It reads as a faint caption, not the page's primary action — and it's inconsistent with the strong outlined buttons used elsewhere ("PROJEKT STARTEN", "ANGEBOT ANFORDERN" in `nav_scroll_3.png`, `pension_d_light.png`). On the studio's two conversion pages, the convert action is the weakest element on screen.
- **Fix:** give form submits the same solid/outlined button treatment as the rest of the site. Unify into one button primitive.

### P1-3 · Desktop form pages are half-empty (layout imbalance)
- **Where:** `contact_d_light.png`, `start_d_light.png`.
- **What's wrong:** on the contact page the entire left ~45% is empty whitespace with the form crammed right; on start the right half is empty. Reads as unfinished rather than minimal.
- **Fix:** rebalance — center the form, or use the empty column for proof/contact detail/a visual, or narrow the page.

### P1-4 · Chat FAB overlaps content
- **Where:** contact (`contact_d_light.png` — overlaps "WATTENS, TIROL, ÖSTERREICH"), home/pension (overlaps pillar grid / list rows in `home_d_light.png`, `zoom_faq.png`).
- **What's wrong:** the "The Studio Director" pill is fixed bottom-right but on shorter pages it sits *on top of* real text/links. The pill is dark-on-light (its own contrast is fine) but it occludes content beneath it.
- **Fix:** add bottom padding to pages so content clears the FAB, and/or shrink the FAB to an icon until opened.

### P1-5 · "Vistera / Virtual Office Tirol / AI Flash" are bare `<a>` with no href
- **Where:** home + work list (verified: `_audit_checks` — `a-no-href: 02 Vistera…`, `03 Virtual Office Tirol…`, `05 AI Flash…`).
- **What's wrong (A3):** these "Demnächst / In Wartung" items are anchors without `href`, so they are not keyboard-focusable and announce nothing — they look like links (same row treatment as the active ones) but do nothing.
- **Fix:** render non-linkable items as non-anchor elements (or add a real target), so only genuinely clickable rows are anchors.

### P1-6 · Reveal mechanism gates content visibility on JS with no fallback
- **Where:** every `Reveal`-wrapped section (`Reveal.tsx`, `globals.css:114` `.sr{opacity:0}`).
- **What's wrong:** `Reveal.tsx:12-17` uses `IntersectionObserver({ threshold: 0.15, rootMargin: "0px 0px -10% 0px" })`, sets `is-in` once on intersect, then `io.disconnect()` — with **no fallback**. Content starts at `opacity:0` and only becomes visible if the observer fires. Verified: under fast/programmatic scroll the Work list and pension FAQ render blank (`home_d_light.png`, `zoom_work_light.png`, `pension_d_light.png`; computed `class="sr"`, `opacity:0`). **It is NOT a permanent void for real users** — re-tested at human scroll cadence (3/3 the section reveals) and on reload+scroll-up (self-heals). But gating *visibility* (not just animation) on JS with no reduced-motion / no-JS / timeout safety net is fragile: it will blank for anyone with JS disabled, and is the kind of thing that bites under bfcache/fast scroll.
- **Fix:** make content **visible by default and only animate** the reveal — i.e. `.sr` should be visible without `is-in`, with the entrance effect layered on top; or add a timeout fallback + treat `prefers-reduced-motion` / no-IO as immediately shown. Cheap, removes the whole risk class. (Keep it near the top of sequencing for that reason.)

---

## P2 — polish / smaller corrections

- **P2-1 · §6 Kleinunternehmer note absent on pension pricing.** Prices "€3.900 / €6.900 / €9.900 + €99–199/Monat" (`PensionLanding.tsx:8-9`) carry no USt clarification. This is a marketing page, not an invoice, so not a legal violation — but the canon wants a `Preise gem. § 6 Abs. 1 Z 27 UStG (Kleinunternehmer), keine USt` line near pricing for consistency with offers. (Impressum already carries the Kleinunternehmer note — good.)
- **P2-2 · `stone` (#8A9098, 3.03:1 on paper) as small text.** Token exists and fails AA as normal text; `--color-stone-text:#5B6168` is the AA-safe alias. Verify no small label still uses raw `stone` on light (overlines default to `--accent`, which passes — so confirm no stragglers). `gold #B8944D` = 2.67:1, correctly routed to `--color-gold-text` for text; confirm it's never applied as actual body/label text.
- **P2-3 · /start vs /contact redundancy.** Two contact-style pages (`/de/contact` = short form, `/de/start` = long qualified intake). Defensible (different intents) but verify both earn their place and are cross-linked sensibly, not competing.
- **P2-4 · Pillar 2x2 colored-tile grid (A1 watch).** The four-quadrant pillar grid (`nav_scroll_1.png`) flirts with the "pastel icon-tile grid" template tell. It's saved by using the actual brand pillar palette (stone/sky/lake/pine) as a deliberate device — keep it, but don't let it drift toward generic; it's the one spot that reads slightly template-y.
- **P2-5 · Skip-link appears in some full-page captures.** "ZUM INHALT SPRINGEN" shows at top-left in several screenshots, but computed style confirms it's correctly translated off-screen when unfocused (`transform: translateY(-100%)`). Almost certainly a Playwright full-page-capture artifact, not a live bug — spot-check in a real browser to be safe, but do not treat as a finding.

---

## What's actually good / keep

- **Wordmark** renders correctly everywhere — Cormorant "lechner" + Italiana ".studios" + gold period, in light and dark (`contact_d_light.png`, `contact_d_dark.png`). Don't touch.
- **Typography on-canon** — General Sans / Cormorant / Italiana / IBM Plex Mono; **zero Bricolage**. This IS the canon (the brand-canon *skill file* is stale on this point — it still calls the reconciliation "pending"; the 2026-06-16 revert settled it. Worth updating the skill, out of scope for the site punch-list).
- **A4 DSGVO — clean.** Render-verified **zero third-party runtime requests**; `next/font/google` (Cormorant) self-hosts at build, so no Google Fonts CDN call. Self-hosted woff2 for all other faces.
- **A2 honesty — exemplary.** Portfolio is the studio's own products with honest statuses; Maya voice-AI demo is a real shipped asset; about stats ("5 gebaut / 2 Live im Einsatz / 4 Säulen") reconcile against the work statuses (Werk active + Maya in production = the 2 live). The "Ein junges Studio — und genau der richtige Moment" section (`nav_scroll_3.png`) is honest early-phase positioning done well.
- **Legal pages — complete & de-AT.** Impressum (GISA 39801708, Einzelunternehmen, §6 Kleinunternehmer, EU-Streitschlichtung, dated) and Datenschutz (numbered, "keine Cookies/Tracking/Analyse", explicit KI-Chat-Assistent disclosure). A7 pass.
- **Dark mode is solid** — token-driven flip works on every page checked; text legible, wordmark adapts, hero band recolors. No dark-mode contrast failures found.
- **Blog / Journal** — 8 real, substantive de+en articles with category tags and dates. Earns its place.
- **Pension landing** — the most complete page: problem framing, real-example CTA, 3-tier pricing, FAQ. The model to bring the service pages up to.
- **A5 scope — clean.** SEO page is technical/implementation SEO (audit, on-page, CWV, structured data), not Unternehmensberatung; apps copy stays in EDV/IT build scope.
- **A6** — token-driven CSS, semantic theme tokens, `!important` confined to the documented mobile-override block.

---

## Recommended sequencing (to stand-behind-able)

1. **P0-1 nav-overlap** — top offset / `scroll-margin-top` on inner-page first sections. Cheap, removes the only "looks broken" defect.
2. **P1-6 reveal hardening** — one component fix (`Reveal.tsx`): visible-by-default, animate-only (+ reduced-motion/no-JS fallback). Cheap, removes the whole blank-section risk class. Verify with fast-scroll + JS-disabled.
3. **P1-2 form buttons** + **P1-3 form layout** — fixes the conversion pages, currently the weakest screens.
4. **P1-4 FAB occlusion** + **P1-5 bare-anchor a11y** — quick.
5. **P1-1 service-page redesign** — the real craft work; bring webdesign/seo/apps up to the pension page's rhythm and add proof/imagery. Biggest design lift; do it as a focused pass once the functional fixes land.
6. **P2 sweep** — pricing §6 note, stone/gold text-token audit, /start vs /contact, pillar-grid watch.

After steps 1-5 the site is honest, on-canon, functional, and visually credible enough to come out of maintenance.
