<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Lechner Studios — agent canonical references

**Before touching any UI, brand, copy, or legal surface, read `CONVENTIONS.md` in this repo.** It points to the authoritative brand specs and captures repo-local patterns.

## Quick references

- **`CONVENTIONS.md`** (this repo) — repo-local patterns, color tokens, typography variables, mobile breakpoint, i18n, component conventions, legal-page rules, pending follow-ups.
- **Brand canon** (in `websites/docs/superpowers/specs/`):
  - `2026-04-27-brand-v4.1-design.md` — canonical tokens, typography, palette, mark, wordmark, pillar grid
  - `2026-04-28-brand-v4.2-compact-wordmark-design.md` — compact wordmark + endorsement stamp text revision
  - `2026-04-28-brand-v4.2-portfolio-amendments-design.md` — rollout outcomes, mobile breakpoint, FlexKapG transition, deprecated framings

## Critical rules (don't violate without reading the spec)

1. **Family-business positioning is canonical.** Sonja Lechner (Founder) + Jason Lechner (Managing Director). Don't reintroduce "independent solo studio" or "one-person studio" framings.
2. **Four pillars, not three disciplines.** Web & Design / Apps & Automation / SEO & Growth / Brand & Identity. The 3-discipline framing is deprecated.
3. **Endorsement stamp is the text variant** (canonical Manrope all-caps), not the wordmark variant. Hex per brand v4.1 §3.3 — locked.
4. **Legal-page accuracy overrides marketing voice.** Impressum + Datenschutz preserve registered legal designations (`Einzelunternehmerin` / `sole proprietor`). Don't replace with brand titles. Jason is not yet named as Geschäftsführer on legal pages — that waits for the Firmenbuch entry of the FlexKapG (currently in formation).
5. **Bilingual parity.** Any dictionary or legal-page edit ships in EN + DE simultaneously.
6. **Mobile breakpoint is `max-width: 768px`.** Use the `.lc-*` class set in `globals.css`. Don't introduce a competing scheme.

## Engineering standard — Ship Complete

Default deliverable is the finished, working artifact — not a plan or a partial.
**Done is tier-scaled** (trivial / simple / complex): a copy tweak is not held to
the payments-surface bar, and a sensitive surface is not waved through. Claims
need receipts, risky changes need a rollback, and work ends reviewable. Security
plus the GDPR/legal human-review gate (Claude drafts and flags; a human certifies)
live in `ai-brain/patterns/security-standard.md`. Full standard and the
`self-iteration` / `security-review` skills: `ai-brain/patterns/ship-complete.md`.
