# Design — Honesty Patch + Maya Proof Point

**Date:** 2026-06-16
**Repo:** `lechner-studios` (live marketing/portfolio site)
**Wedge:** First sub-project of the "lean bootstrap" roadmap (approach B). Closes the *claims-vs-substance* gap on the live site without retreating from AI-first positioning.
**Status:** Design — awaiting owner review before implementation plan.

---

## Problem

The live site markets Lechner Studios aggressively as **"AI-native / KI-nativ"** (hero, meta, about, services) and presents **AI products as if buyable today** — while shipping **zero functional AI** and with its flagship "AI" products **on hold or paused** (Virtual Office Tirol ⏸️ on hold 2026-06-16; Vistera paused). This is a present-tense over-claim on a *live* surface, and it directly contradicts the studio's own A2 honesty principle (the AI-twin "Wie wir arbeiten" doctrine is correctly gated OFF for exactly this reason).

Meanwhile, a genuinely real, technically strong AI product — **Maya** (embodied-assistant: voice in → Claude → voice out, persistent encrypted memory, animated presence, live on Vercel, ~2.1s end-to-end) — exists but is **invisible** to the public (password-gated, branded as a personal assistant, no LS framing).

So: the claim is unbacked *and* the proof is hidden.

## Goal

1. **Re-anchor** every public AI claim from *"what you can buy today"* → *"how we build / what we've built"*, so each claim points at something real.
2. **Surface Maya** as Lechner Studios' first concrete, showable AI proof point — as a **case study with a self-hosted demo video on the `work` page** (not a live public bot).

## Non-goals (YAGNI)

- No new runtime AI features on the site (no chatbot, no live Maya instance, no AI deps).
- Do **not** flip the AI-twin `NEXT_PUBLIC_SHOW_HOW_WE_WORK` flag — it stays OFF (the backing autonomy system is still vapor; flipping it would *re-create* the honesty problem).
- No new `work/[slug]` detail route — reuse the existing single `work` page.
- No CRM / pipeline / lead-gen tooling — those are later roadmap wedges, justified only after a manual first-client run.

---

## Part 1 — Honesty patch (copy re-anchor)

**Where:** `src/i18n/dictionaries.ts` — the single source for EN + DE copy. **All edits land in DE and EN in lockstep** (per legal-pages-canonical / parallel-locale convention). No component logic changes.

**Classification of existing AI claims:**

| Claim (EN line refs) | Verdict | Action |
|---|---|---|
| "Family-run, **AI-native** digital studio" (meta, ~L18/21/33; DE ~L351/354/366) | **KEEP** | Defensible: backs to the real build practice. No change, or tighten to "AI-native build practice." |
| Hero overline "DESIGN-LED · TIROL · **AI-NATIVE**" (L55; DE L388) | **KEEP** | Positioning, anchored by founder story + Maya. |
| About body "**AI-native operating model**" (L66; DE L399) | **KEEP / lightly tighten** | True (ai-brain, subagent-driven dev, automation). Optionally add a clause pointing at *how* (built solo with AI as the team). |
| VOT card "**AI-powered** phone answering … automated back-office" (L122; DE L455), category "SaaS · AI Systems" (L119/452) | **SOFTEN** | VOT is on hold. Reframe to roadmap / "in development," remove present-tense "powered." |
| Services "We build full-stack apps and **AI systems that do the actual work** — PropTech VR, virtual-office SaaS, **AI phone agents**, content automation" (L155; DE L488) | **SOFTEN** | Present-tense capability claim implying shipped products. Reframe: separate *shipped/real* (content automation — ACC/social-post-analyzer exist) from *in-development* (phone agents, VR). |
| "We use AI where it earns its place — phone answering, content automation, back-office routing — inside clear, reviewable scopes" (L219) | **SOFTEN** | Same: keep the "human-in-control" framing (it's good and honest), but don't imply phone answering is a live offering. |
| "This is what we make for ourselves: Virtual Office Tirol for AI phone answering … Vistera for VR … content pipelines" (L227; DE L560) | **RE-ANCHOR** | Strongest place to tell the truth: frame as *what we're building in-house* (roadmap), and **add Maya** as the one that's actually live. |
| HowWeWork headline/statement "AI-native, transparently / KI-Zwilling" (L81/L414/L415) | **LEAVE — stays gated** | Untouched; flag stays OFF. |

**Re-anchoring principle (the honest, strong story to lean into):**
> Lechner Studios was built solo by one founder *using AI as the team* (Claude Code, subagent-driven development, an in-house automation brain). We are AI-native in **how we build** — and we ship real AI when it's real (Maya, content automation), not before. Products still in development are labelled as such.

**Acceptance for Part 1:**
- No public copy claims a present-tense, buyable AI product that is on-hold/paused/unbuilt.
- "AI-native" survives everywhere, but each instance is backed by build-practice, content-automation, or Maya.
- EN and DE say the same thing.
- The contact form / legal surfaces are untouched.

## Part 2 — Maya proof point (case study + demo video)

**Where:** Featured item on the existing `src/app/(site)/[locale]/work/page.tsx`, with copy in `dictionaries.ts` (new `work` list entry + a short case-study block). No new route.

**Framing (honest, no over-claim, privacy-safe):**
- Present as **"an in-house production voice AI we built"** — a *capability demonstration*, NOT a buyable product and NOT "Sonja's personal assistant" (avoids family-privacy exposure and avoids implying it's for sale).
- Content: 2–4 sentence writeup of what it does + the real stack (AssemblyAI STT → Claude Haiku/Sonnet, Opus for memory → Cartesia TTS; persistent encrypted memory; animated presence; ~2s end-to-end on prod).
- **Demo asset:** a 30–60s **screen-recorded video of one real voice turn** — **owner-supplied** (human task).

**Compliance constraint (hard):** the demo video must be **self-hosted** (mp4 in the project's asset pipeline / `public`), **not** a YouTube/Vimeo embed — per the DSGVO self-hosting rule. No third-party tracking embed on a live AT site.

**Brand constraint:** apply brand-canon (palette, type, AA contrast). No generic gradient placeholders (per no-generic-gradients feedback). Run the render-first surface-audit before merge.

**Acceptance for Part 2:**
- `work` page shows a Maya entry that a stranger can see (no login).
- Claims about Maya are all literally true and verifiable from the embodied-assistant repo.
- Demo video self-hosted, plays, captioned/poster set, AA contrast on any overlay.
- DE + EN parity.

---

## Cross-cutting: ADR / doctrine check

Editing AI-positioning + services copy on a **live** surface triggers the doctrine-edit → ADR-check rule. Before merge:
- Confirm the re-anchor is consistent with the governing design/honesty standard (**ADR-0038**, A2 honesty). If the standard needs a sentence recording "public AI claims must point at shipped capability or be labelled in-development," **amend the ADR in the same session** (ai-brain).
- This keeps the doctrine and the live surface in lockstep.

## Architecture / data flow

Entirely static content. No runtime, no new dependencies, no API surface, no PII. i18n through the existing `dictionaries.ts` dictionary. Demo video served as a static self-hosted asset. Risk surface ≈ zero.

## Testing / verification

- `next build` passes; typecheck/lint clean (`/fix` if needed).
- DE/EN key parity — no missing or orphan keys after edits.
- Render-first surface-audit: home, about, work, apps-automation, services pages — every view + state, AA contrast on the video block and any overlay.
- Manual read-through: no remaining present-tense buyable-AI claim for an on-hold/paused/unbuilt product.
- Confirm `NEXT_PUBLIC_SHOW_HOW_WE_WORK` is still OFF (unchanged).

## Owner dependencies (human tasks, block merge)

1. **Record the Maya demo video** (30–60s, one voice turn). Without it, Part 2 ships text-only or waits.
2. **Approve final copy tone** for the re-anchored strings (drafts provided in the implementation plan).

## Sequencing within the wedge

Part 1 (copy re-anchor) is independent and can ship first — it removes live risk immediately. Part 2 (Maya case study) can follow as soon as the demo video exists. Both are small; can be one PR or two.

## Out of scope → next roadmap wedges

Define the one offer → land client #1 manually → then build the first internal tool (likely proposal generation atop `client-deliverable`), which itself doubles as visible AI proof.
