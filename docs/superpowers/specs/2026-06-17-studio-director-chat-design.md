# Design — "The Studio Director" Brand-Site Chat (v1)

**Date:** 2026-06-17
**Repo:** `lechner-studios` (live brand site)
**Status:** Design — awaiting owner review before implementation plan.
**Why:** The strongest answer to "where's the AI on our site?" — a live, disclosed AI assistant that answers questions and routes visitors. Implements the founder's twin (Solara / "The Studio Director") per the marketing plan, ADR-0017 (autonomy doctrine), ADR-0026 (Claude routing). Makes the AI-twin doctrine *real* (enables flipping "Wie wir arbeiten" later — separate follow-up).

## Goal

Ship a **stateless, site-wide chat widget** on lechner-studios.at that, as **The Studio Director** (Sonja's disclosed AI twin), answers visitor questions about Lechner Studios from shipped facts, routes them to the right page, and hands off to a human for anything sensitive — without storing any chat data (so it ships now, no DSGVO blocker).

## Non-goals (YAGNI / doctrine)

- **No stored chat / memory / RAG** (sub-spec 3 deferred; avoids the 🔴 Steuerberater/DSGVO "twin data storage" blocker).
- No lead-capture DB — "leads" = routing to the existing contact form.
- No voice (that's Maya), no other twins (Nox/Kesira/Merrisen), no white-label.
- **Codename "Solara" never shown publicly** — UI/copy use the archetype "The Studio Director" only (ADR-0025 / excellence-as-trademark).
- Not flipping the "Wie wir arbeiten" section here (separate follow-up, now justified).

---

## 1. Persona & disclosure

- Public name: **The Studio Director** (the AI twin for **Sonja Lechner**). Voice: decisive, warm, structural.
- **Opening disclosure (shortened per owner):**
  - EN: *"Hi — I'm The Studio Director, the AI twin for Sonja Lechner at Lechner Studios. Happy to help directly; I'll loop in a human when the stakes need one."*
  - DE: *"Hallo — ich bin The Studio Director, der KI-Zwilling von Sonja Lechner bei Lechner Studios. Ich helfe Ihnen gern direkt; bei heiklen Themen hole ich einen Menschen dazu."*
- **On-demand doctrine** (only if the visitor asks what an AI twin is / how this works):
  - DE: *"Bei Lechner Studios hat jede Führungsperson einen offen deklarierten KI-Zwilling. Jeder Zwilling arbeitet in einem deklarierten, widerrufbaren Autonomie-Rahmen: innerhalb handelt er selbst, außerhalb entwirft er — und ein Mensch entscheidet."* (EN parallel.)
- **Must always identify as AI when asked** (ADR-0017 Tier-3 enforcement; EU AI Act Art. 4).

## 2. Architecture (stateless)

- **Widget** (client, Next.js + Tailwind, brand-styled via brand-canon tokens): a floating launcher (bottom corner) + chat panel, mounted in `src/app/(site)/[locale]/layout.tsx` so it appears on **every page incl. the homepage**. Conversation state lives in React state only.
- **API route** `src/app/api/chat/route.ts` (server, Edge or Node): holds `ANTHROPIC_API_KEY`, calls **Claude Sonnet (`claude-sonnet-4-6`)** (ADR-0026), **streams** the reply. Accepts `{ messages, locale }`; the client sends the full short history each turn (stateless server).
- **Grounding = curated system prompt** built from a maintained `src/lib/studio-director/knowledge.ts` module: the 4 pillars, Direktbucher (3 tiers + the Pension landing), Maya, work/products, contact, about — **shipped facts only** (ADR-0038 A2), plus the **route map** for navigation and the **Tier 1/2/3 behavior**. No RAG.
- **New dep:** `@anthropic-ai/sdk`. **Env:** `ANTHROPIC_API_KEY` (owner adds to the lechner-studios Vercel project).

## 3. Scope & autonomy (ADR-0017)

- **Tier 1 — acts:** answer public questions about LS; **route to the right page** (knows `/[locale]/{work,webdesign,apps-automation,seo,pension-website-tirol,about,contact,blog}` etc. — e.g. "Pensions-Website? → /de/pension-website-tirol"); explain the AI-twin doctrine on request; politely decline/redirect out-of-scope; disclose as AI.
- **Tier 2 / escalate — hands off (never commits):** money, pricing commitments, contracts, legal/tax, press, partnerships, sensitive personal topics → "I'll bring in a human" + link the contact form.
- **Tier 3 — forbidden:** impersonating a human when asked, fabricating facts/figures, agreeing to terms, anything with minors beyond polite routing.
- **Bilingual:** replies in the visitor's language; DE default.

## 4. Cost / abuse / compliance

- **Rate limiting** on the API route (reuse the contact-route limiter pattern): default **~10 requests/min per IP**, **max ~25 messages/session**, **max ~1,500 chars/message**, capped history (~last 12 turns), `max_tokens` bounded. (Numbers adjustable — owner to confirm.)
- **AI disclosure** on widget open + when asked (non-negotiable).
- **DSGVO:** stateless ⇒ no transcript stored; only processing = sending messages to Anthropic (a processor; Anthropic does not train on commercial API data). Add a short **Datenschutz** clause (dsgvo-legal-pages) describing this + an in-widget note "Bitte keine sensiblen Daten eingeben." No new cookie (state is in-memory, not persisted).
- No remote calls except the studio's own API route (which calls Anthropic server-side); self-hosted fonts unaffected (DSGVO).

## 5. Files (units)

- Create `src/components/StudioDirectorChat.tsx` — the widget (launcher + panel + streaming render). One focused unit.
- Create `src/app/api/chat/route.ts` — the Claude-backed streaming endpoint + rate limit.
- Create `src/lib/studio-director/knowledge.ts` — the curated facts + route map + system-prompt builder (the single place to keep grounding accurate).
- Modify `src/i18n/dictionaries.ts` — `studioDirector` block (DE+EN): disclosure, on-demand doctrine, UI labels (launcher, placeholder, send, escalation line, privacy note).
- Modify `src/app/(site)/[locale]/layout.tsx` — mount the widget.
- Modify the Datenschutz component (`LegalPrivacyDE/EN`) — the chat/Anthropic clause.
- `package.json` — add `@anthropic-ai/sdk`.

## 6. Owner gates (not blocking the build, blocking go-live)

- **`ANTHROPIC_API_KEY`** added to the lechner-studios Vercel project (the one human step to make it answer in prod).
- Confirm the rate-limit defaults (§4).
- ADR-0017 wants a private **Autonomy Scope Document** for Solara; the system prompt operationalizes Tier 1/2/3, the formal doc stays in the owner's private store.

## 7. Testing / verification

- `next build` + `tsc` + lint clean; widget renders on `/de` and `/en` (every page).
- API route: returns a streamed Claude reply for a normal question; **refuses/escalates** on a pricing/contract/legal prompt (routes to contact, commits nothing); **stays in scope** (declines unrelated questions); identifies as AI when asked.
- Grounding accuracy: spot-check answers about Direktbucher tiers + Pension landing match the SSOT (no hallucinated prices).
- Rate limit returns 429 past the cap; oversized input rejected.
- DSGVO: no transcript persisted anywhere server-side (stateless); Datenschutz clause present; disclosure shown on open.
- AA contrast on the widget (launcher, panel, bubbles) light + dark; keyboard-accessible (focus, Esc to close); no remote font/CDN calls.

## 8. Follow-ups (out of scope, noted)

- Flip "Wie wir arbeiten" (`NEXT_PUBLIC_SHOW_HOW_WE_WORK`) — now honestly backable once the twin is live (triggers ADR check).
- Memory/RAG (sub-spec 3) + lead capture — after the Steuerberater/DSGVO sign-off (W2) clears.
- Nox ("The Operator") + the productized Kesira/Merrisen — separate efforts.

---

## Self-review
- **Placeholders:** none — persona copy, model, scope, files, limits all concrete (final exact UI strings land in the plan/dict).
- **Consistency:** stateless ⇒ no DSGVO storage blocker; Claude Sonnet per ADR-0026; Tier 1/2/3 per ADR-0017; codename internal per ADR-0025; grounding facts must match the Direktbucher SSOT.
- **Scope:** one widget + one API route + grounding + dict + layout mount + a Datenschutz line — single coherent feature; memory/RAG/other-twins explicitly deferred.
- **Ambiguity:** "stateless" = no server-side persistence; conversation is client-held and sent per turn — stated explicitly.
