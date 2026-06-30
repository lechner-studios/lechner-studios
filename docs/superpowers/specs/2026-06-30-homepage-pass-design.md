# Homepage pass — design (2026-06-30)

Branch: `feat/hero-source-surface` (widened from the hero PR #90 into a homepage
pass, per owner). Render-first verification at desktop/mobile × light/dark for
every change. Owner reviews the whole preview at the end.

## Context
Home order (`src/app/(site)/[locale]/page.tsx`):
Hero → Stance → Services → Work → HomeOffers → FoundationPartner → ContactCta → Footer.

Owner direction this session:
- Move the **code↔render slider** out of the hero into the **Stance** ("Keine
  Vorlage") section — it proves that section's "no templates, hand-written" claim.
- The hero then becomes an **interactive pillar-morph** (chosen over editorial /
  motif / product-montage / day-night / contours / typing toy).
- A **graphic on every section** — honest *Mix*: real screenshots where they
  exist, on-brand editorial motifs for abstract sections, photo slots reserved
  for owner-supplied images.
- **Contact** is a reframe, not a rebuild: surface low-friction options; demote
  `/start`; dedup two adjacent identical CTAs.
- **Work / Produkte & Projekte**: real CodeFlash sample cards (like werk).
- **Pillar→colour remap** (see Workstream 0).

## Workstream 0 — Pillar→colour remap (DO FIRST; doctrine change)
Owner: green maps better to *Growth*; a lake is a region's identifying feature,
so navy/lake maps better to *Identity*. Keep the colour tiles in place, relabel.

Net mapping (apply everywhere the mapping is used):
- Web & Design → **stone** (unchanged)
- Apps & Automation → **sky** (unchanged)
- **SEO & Growth → pine (green)** — was lake
- **Brand & Identity → lake (navy)** — was pine

Touch points:
- `Services.tsx` PILLARS array (2×2 grid) — swap the SEO and Brand cell colours;
  keep grid order; move the `seo` entry in `PILLAR_SLUGS` so the SEO page link
  rides the now-green SEO cell. Verify AA of text-on-cell in both themes.
- Hero pillar chips (built in Workstream 1) — use the new mapping.
- Leave the abstract brand mark squares (`BrandMark.tsx`, `EndorsementStamp.tsx`)
  as-is — they are decorative, not labelled pillars.
- **Doctrine:** amend ADR-0037 (palette/pillars) + `brand-canon` mapping line in
  the same session before merge ([[feedback_doctrine_edit_adr_check]]).

## Workstream 1 — Hero: pillar morph
- Left column: overline, headline, rule, **4 pillar chips** (Web & Design ·
  Apps & Automation · SEO & Growth · Brand & Identity), CTAs, location.
- Right column: a **live pillar panel**. Default = quiet studio summary;
  hover/focus a chip → panel shows that pillar (Cormorant name + one-line proof)
  and a **decorative** element recolours to the pillar hue (per Workstream 0).
  Recolour touches fills/rules only — body text stays ink/accent → **AA holds in
  every state**.
- Chips are **links to `/services#<slug>`** (hover/focus previews, click
  navigates). Keyboard-operable; reduced-motion = instant swap, no animation.
- This fills the right column (removes the CTA-left coupling from the slider era)
  and gives the hero a real job: communicate the four disciplines.

## Workstream 2 — Stance receives the slider
Drop `<HeroSourceSurface />` (the before/after slider) into the Stance section as
its section graphic. Responsive/full-bleed already handled in the component.

## Workstream 3 — Contact reframe + CTA dedup
- Homepage contact: low-friction primary — **simple message form (or link to the
  existing `/contact` form) + email button (mailto:hallo@lechner-studios.at) +
  WhatsApp** (`wa.me/436641534653`, plain link, DSGVO-safe — confirm number).
- Demote `/start` to a secondary "Oder wissen Sie schon, was Sie wollen? →
  Projekt starten".
- **Dedup:** `FoundationPartner` and `ContactCta` both link `/start` with the
  same label — give FoundationPartner a contextual CTA (or drop its CTA).

## Workstream 4 — Work / Produkte & Projekte: CodeFlash cards
Render real CodeFlash sample cards (like werk) on the CodeFlash entry in `Work`.

## Workstream 5 — Section graphics (Mix)
Real screenshots where they exist (Work, offers); on-brand editorial motifs for
abstract sections (Services already has the pillar grid; FoundationPartner);
reserved photo slot for owner-supplied founder/Tirol imagery. No stock, no
generic icon-tile/gradient tells (A1/A2).

## Sequencing
0 (remap) → 1 (hero) → 2 (slider→Stance) → 3 (contact) → 4 (Work cards) →
5 (graphics). Commit + render-verify each; ADR/brand-canon amended before merge.

## Out of scope / owner inputs
- Owner-supplied photos (founder/Tirol) for the reserved slots.
- Confirm `+43 664 153 4653` is WhatsApp-enabled.
