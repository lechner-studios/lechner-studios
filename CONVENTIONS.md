# Conventions — `lechner-studios` (umbrella site)

Repo-specific patterns + pointers to the canonical source-of-truth specs. **Read this first** when working on any UI / brand / legal surface in this repo.

> **Canonical specs** (in the `websites` repo):
> - `websites/docs/superpowers/specs/2026-04-27-brand-v4.1-design.md` — tokens, typography, palette, mark, wordmark, pillar grid
> - `websites/docs/superpowers/specs/2026-04-28-brand-v4.2-compact-wordmark-design.md` — compact wordmark + endorsement stamp text revision
> - `websites/docs/superpowers/specs/2026-04-28-brand-v4.2-portfolio-amendments-design.md` — rollout outcomes, mobile breakpoint, FlexKapG checklist, deprecated framings
>
> The brand specs are authoritative. This file is a pointer + the few conventions that are repo-local.

## Brand & positioning

- Hero subline (canonical): `Modern. Precise. European. Family-run. AI-native.` / `Modern. Präzise. Europäisch. Familiengeführt. KI-nativ.` (each adjective is a standalone declarative — period-separated for cadence, not comma-joined.)
- Family-business positioning is canonical — Sonja Lechner (Founder) + Jason Lechner (Managing Director). Don't reintroduce "independent solo studio" or "one-person studio" framings.
- Three-discipline framing ("product development / web design / AI systems") is **deprecated**. Four pillars are canonical: Web & Design, Apps & Automation, SEO & Growth, Brand & Identity.
- Pillar → token mapping is locked: see brand v4.1 spec §3.3.

## Color tokens

CSS custom properties in `src/app/globals.css`. Never hardcode hex when a token exists.

| Use | Token | Hex |
|---|---|---|
| Ink (body text) | `--color-ink` | `#15171A` |
| Paper (cool near-white surface) | `--color-paper` | `#F7F8F8` |
| Warm white (light surface alt) | `--color-warm-white` | `#FBFCFC` |
| Gold (on light) | `--color-gold` | `#B8944D` |
| Gold (on dark) | `--color-gold-on-dark` | `#C9A961` |
| Pillar Stone | `--color-pillar-stone` | `#D6CDBE` |
| Pillar Sky | `--color-pillar-sky` | `#8FA8C5` (v4.1 amendment from `#B8C5D6`) |
| Pillar Lake | `--color-pillar-lake` | `#254268` |
| Pillar Pine | `--color-pillar-pine` | `#5E8263` |

## Typography

All self-hosted via `next/font/local` in `src/app/(site)/[locale]/layout.tsx` (no runtime Google fetch). Fallback stacks + token definitions live in `src/app/globals.css` (brand v4.2 / ADR-0027).

| CSS variable | Font | Use |
|---|---|---|
| `--font-display` | Cormorant (variable, weight 300–700, upright + italic) | Display headings (body serif retired) |
| `--font-display-bold` | Cormorant 700 (self-hosted) | Brand wordmark, hero h1 |
| `--font-display-italiana` | Italiana 400 (self-hosted) | Sub-lines, decorative |
| `--font-sans` | General Sans (self-hosted, 400/500/600) | Body, UI |
| `--font-mono` | IBM Plex Mono (self-hosted, 400/500) | Overlines, labels, captions |

## i18n

- Bilingual DE + EN, **locale-routed** under `src/app/(site)/[locale]/` (`de` default). Routing config — `LOCALES`, `DEFAULT_LOCALE`, `HREFLANG` — lives in `src/i18n/config.ts`; copy in `src/i18n/dictionaries.ts`.
- URLs are locale-prefixed (`/de/…`, `/en/…`). `src/middleware.ts` redirects `/` → `/de` and legacy bare `/impressum` + `/privacy` → their `/de/…` equivalent (308). The active locale comes from the URL segment and is passed server-side to `LanguageProvider` (`src/context/LanguageContext.tsx`); the `Nav` language toggle is a `<Link>` to the alternate-locale URL (preserving path + hash).
- `hreflang` alternates are emitted from `generateMetadata` (`de` → `de-AT`, `en` → `en`, `x-default` → `/de`); `<html lang>` is set per route.
- Add new copy to BOTH locales in the same edit. Never ship asymmetric dictionary state.
- Title localization in EN copy: `Geschäftsführer` → `Managing Director`, `Gründerin` → `Founder`. **Exception: legal pages** (Impressum, Datenschutz) preserve the German title because it's the registered designation.

## Mobile breakpoint

Single breakpoint at `max-width: 768px`. CSS classes in `globals.css`:

- Section padding: `.lc-pad-section`, `.lc-pad-hero`, `.lc-pad-footer`, `.lc-pad-nav`
- Stacking grids: `.lc-stack-2col`, `.lc-stack-pillars`
- Work section internals: `.lc-work-header`, `.lc-work-item`, `.lc-work-meta`

Pattern uses `!important` to override inline `gridTemplateColumns` / `padding`. Inline styles remain the desktop default; classes scope `!important` to mobile-only overrides.

When adding a new responsive layout, mirror the pattern. Don't introduce a competing breakpoint scheme.

## Component patterns

- **Inline styles + className** is the existing convention for new components. CSS classes are reserved for shared / responsive concerns (see mobile breakpoint above).
- **`onMouseEnter` / `onMouseLeave` color changes** are an a11y anti-pattern (don't fire on keyboard focus or touch). Prefer CSS `:hover, :focus-visible` via classes when adding new interactivity. Existing inline-handler instances are tracked as a follow-up.
- **`next/image`** for portrait/asset images. Set explicit `width` + `height` for layout reservation; use `sizes` for responsive optimization; reserve `priority` for genuinely above-the-fold images.
- **Brand assets** in `public/`:
  - Founder portrait: `public/founder/sonja-lechner.jpg` (used by `src/components/Founder.tsx`)
  - Favicon set: `public/favicon-*.png`, `public/favicon.svg`, `public/apple-touch-icon.png`
  - Fonts (`public/fonts/`, `.woff2`): `cormorant-variable`, `cormorant-italic-variable`, `cormorant-700`, `italiana-400`, `general-sans-400/500/600`, `ibm-plex-mono-400/500`
  - OG image: `public/og-image.png`

## Legal pages

The Impressum (`src/app/(site)/[locale]/impressum/page.tsx`) and Datenschutz (`src/app/(site)/[locale]/privacy/page.tsx`) operate by **stricter rules** than marketing surfaces. See `feedback_legal_pages_canonical` memory and brand-portfolio-amendments §5.

Key rules:

- Use registered legal designations (`Sonja Lechner, Einzelunternehmerin / sole proprietor`). Don't replace with brand titles like "Founder" — required by § 5 ECG and DSGVO Art. 13.
- **Jason Lechner is NOT yet named as Geschäftsführer** in legal disclosures. The Lechner-Studios FlexKapG is in formation but not operative; legal pages update in lockstep across all repos when the Firmenbuch entry lands.
- Date format: month-year (e.g. `April 2026`), not full date and not just year.
- EN section heading: `Last updated`, not `Currency`.
- Bilingual updates: any edit to the DE section requires the parallel EN edit in the same PR.
- When the homepage positioning shifts, audit the Impressum's `Unternehmensgegenstand` / "Object of business" — pre-Tier-1 framing is stale.

## Workflow

- **Worktrees** at `.worktrees/<branch>` (gitignored). One worktree per feature branch. Junction node_modules from main when working in a worktree.
- **Branches**: `claude/<short-name>` for Claude-driven branches.
- **PRs**: keep scope tight. Bundle hygiene fixes into the PR they enable; otherwise split.
- **Commit messages**: conventional-commit-ish (`feat(scope):`, `fix(scope):`, `copy(scope):`, `chore(scope):`, `docs(scope):`).

## Follow-ups (tracked from the 2026-04-28 deep-dive audit)

Context: `project_brand_canon_session_additions` memory and brand-portfolio-amendments §0.

Shipped since the audit (kept here so this doc reflects reality):

- **Bilingual URL routes + `hreflang`** — locale-routed `(site)/[locale]`, `hreflang` alternates + per-route `<html lang>` (see i18n above).
- **JSON-LD structured data** — Organization + LocalBusiness + Person (Sonja) in `src/app/(site)/[locale]/layout.tsx`. A second Person entry (Jason) is not yet added — the original target was Person × 2.
- **Homepage metadata refresh** — per-locale `generateMetadata` (title / description from `dictionaries.ts`, canonical, Open Graph, Twitter) on the four-pillar framing.
- **A11y bundle** — `:focus-visible` + `prefers-reduced-motion` (`globals.css`), a `.skip-link` (`href="#main"`) on every page, and per-route `<html lang>`.
- **Per-pillar pages** — dedicated pillar pages ship at top-level slugs, not `/services/{slug}`: `/apps-automation`, `/seo`, `/brand` (Web & Design 301s to `werk.lechner-studios.at`).

Still open:

- **Process / "How we work" section** — built (`src/components/HowWeWork.tsx`, wired into `/about`) but staged OFF behind `NEXT_PUBLIC_SHOW_HOW_WE_WORK`; flip on when the AI-twin doctrine is implemented.
- **Social proof** — testimonials / client logos / press mentions.
- **`onMouseEnter` / `onMouseLeave` cleanup** — migrate remaining inline hover-only handlers to CSS `:hover, :focus-visible` (see Component patterns above).
