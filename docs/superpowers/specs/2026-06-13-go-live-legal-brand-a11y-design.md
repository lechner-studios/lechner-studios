# Lechner Studios — Go-Live: Legal port, brand-contrast resolution, a11y & font fix

**Date:** 2026-06-13 · **Branch:** `claude/go-live-legal-brand-a11y`
**Goal:** Make the site launch-ready — (1) legal/compliance up to code, (2) design polished + accessible enough to go live.

Source of truth for legal copy: `ai-brain/business-planning/lechner-studios/00g-impressum-datenschutz-draft.md` (finalized 2026-06-13, GISA 39801708).

---

## Decisions (owner-confirmed this session)

1. **Contact: BOTH** — keep the working form (`Contact.tsx` + `/api/contact` → Zoho) *and* the visible email fallback. Do **not** port 00g's "email-only / no contact form" sentence; keep the live, form-aware Datenschutz §3.
2. **Brand contrast: HYBRID** — signature gold `#B8944D` stays on dark backgrounds + purely decorative marks; new **action-gold `#7A6029`** (5.29:1) for gold **text on light**; stone body text `#8B8578` → **`#6B6356`** (5.28:1). Amends the brand ADR.

---

## A. Impressum — port 00g additions (DE + EN, parallel edits)

Files: `src/components/LegalImpressumDE.tsx`, `LegalImpressumEN.tsx`.

Add / change (verbatim from 00g, registered designations preserved):
- Disclosure citation → add **§ 63 GewO**: "§ 5 ECG, § 63 GewO 1994 und § 25 MedienG".
- Operator block → add **Unternehmensbezeichnung (Etablissementbezeichnung): Lechner Studios**.
- **Unternehmensgegenstand** → replace the vague "design-orientiertes Digitalstudio" text with the precise 00g wording (Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik …).
- Add **Gewerbe** (freies Gewerbe wording) + **GISA-Zahl: 39801708**.
- Add **Mitgliedschaft:** WKO Tirol — Fachgruppe UBIT, Sparte Information & Consulting.
- Keep Gewerbebehörde: **Bezirkshauptmannschaft Innsbruck**; Berufsrecht: **GewO 1994** (RIS link).
- Keep Umsatzsteuer: **Kleinunternehmerin § 6 Abs 1 Z 27 UStG**.
- Add **Grundlegende Richtung (§ 25 MedienG)** section (00g DE l.77–79 / EN l.131–133).
- **REMOVE** the entire ODR-platform section (`LegalImpressumDE.tsx:93–110`, EN `96–110`) — platform discontinued 20.07.2025. Replace with the short **Verbraucherstreitbeilegung** sentence (no link).
- Add date stamp: **"Stand: Juni 2026"** (DE) / **"Last updated: June 2026"** (EN).
- Keep "Impressum" as the EN headline (registered-designation exception per CONVENTIONS.md).

## B. Datenschutz — sync only (live copy is already richer than 00g)

Files: `LegalPrivacyDE.tsx`, `LegalPrivacyEN.tsx`.
- §10 date: **April 2026 → Juni 2026 / June 2026**.
- §10 trailing example wording: drop the now-false "(if a contact form … is added)"; reword to "(e.g. if analytics or new processors are added)".
- Keep form-aware §3, Zoho processor, §132 BAO, Drittlandtransfer — no structural rewrite.

## C. Stale-comment cleanup

Remove the FlexKapG-transition comment blocks from all four legal component file headers (DE/EN Impressum + Privacy). The FlexKapG lockstep remains tracked in ai-brain memory/ADR; it does not belong as a code comment on the live sole-proprietor pages.

## D. Brand contrast — hybrid (a11y AA)

`src/app/globals.css`:
- Add token `--color-gold-text: #7A6029;` (gold text on light).
- Change `--color-stone: #8B8578` consumers used as **text** to `#6B6356`. (Introduce `--color-stone-text: #6B6356` and keep `--color-stone` for any non-text/decorative use; audit found stone is used as text in About/Founder/Services/legal — repoint those.)

Component sweep (repoint gold-text-on-light → `#7A6029`, stone-text → `#6B6356`, and fix the other audit AA fails to ≥4.5:1 normal / ≥3:1 large):
- `LegalStyles.ts`: `overlineStyle` `#B8944D`→`#7A6029`; `subStyle`/`sectionLabelStyle`/`backLinkStyle` `#8B8578`→`#6B6356`.
- `About.tsx`, `Founder.tsx`, `Work.tsx`: overline `#B8944D`→`#7A6029` (on light); stone caption/body `#8B8578`→`#6B6356`.
- `Services.tsx`: pillar muted text (rgba on Stone/Sky/Pine/Lake pillars) → darken to pass AA on each pillar bg.
- `Footer.tsx`: low-opacity light text (0.2/0.25) → raise to ≥0.6 of warm-white for ≥4.5:1 on ink.
- `Hero.tsx`: location cue / scroll cue / subline low-opacity → raise so subline ≥4.5:1, cues ≥3:1 (large/decorative threshold) on dark.
- `Contact.tsx`: consent label `#6B665C` is 5.08:1 (passes) — leave; verify against final bg.
- `:focus-visible` outline stays `#B8944D` (decorative on varied bg; 3:1 not required for focus indicators but verify visibility).

All final values re-verified with the WebAIM formula (`/tmp/contrast.mjs`) before commit.

## E. Font fidelity fix

`layout.tsx`: Google `Cormorant` is loaded at weights `["500","600"]` but components request 300/400 (`headlineStyle` 300, `h3Style` 400, Hero/Services 300, About 400) → browser substitutes.
**Fix:** load the weights actually used — `weight: ["300","400","500","600"]` — preserving the intended light elegant display look. (Do **not** force 700; that changes the aesthetic.) Confirm `--font-display-bold` (self-hosted 700) has consumers; if dead, leave as-is or note for cleanup.

## F. Doctrine

Record the contrast resolution (hybrid action-gold) in the governing brand ADR in `ai-brain/decisions/` (file references `0027-lechner-brand-guidelines-v4.2-typography.md`; confirm exact ADR for palette/contrast — globals.css cites ADR-0019 palette / ADR-0020 typography, so verify which ADR owns color tokens and amend that one, cross-linking 0027). Per the doctrine-edit rule, check the legal-page-canon ADR is consistent with these page changes.

## G. Deferred (NOT this session)

Client→server / `LanguageProvider` perf refactor — risky, marginal CWV gain on a near-static site. Revisit only if CWV measures red post-launch.

## H. Verification before "done"

- `npm run build` (next build) green.
- `npm run lint` (eslint) clean.
- `npm run test:e2e` (Playwright) green.
- Re-run contrast script on final tokens — all text pairs ≥ AA.
- Contact-form deliverability sanity check (Vercel→Zoho lands in inbox, not spam).
- Stop before go-live: surface `MAINTENANCE_MODE` flip on Vercel as the explicit owner action.

## Process

Feature branch → implement → self-review → `/code-review` → commit + push + PR. Legal + brand are sensitive: open PR for owner review; do **not** flip `MAINTENANCE_MODE`.
