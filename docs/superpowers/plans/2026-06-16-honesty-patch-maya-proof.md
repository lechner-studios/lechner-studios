# Honesty Patch + Maya Proof Point — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-anchor the live site's AI claims to shipped capability / build practice (no retreat from AI-native positioning), and surface Maya as Lechner Studios' first concrete AI proof point via a self-hosted case-study video on `/work`.

**Architecture:** Pure content + one presentational component. All copy lives in `src/i18n/dictionaries.ts` (EN + DE, edited in lockstep). A new client component `MayaCaseStudy` reads a new `dict.maya` key and renders a writeup + real stack + a self-hosted `<video>`; it is mounted on the existing `/work` page. No new routes, no runtime AI, no new dependencies, no PII.

**Tech Stack:** Next.js (App Router), React, TypeScript, ESLint, Playwright (e2e). Package manager: **npm** (`package-lock.json`). Branch: **`honesty-patch-maya-proof`** (already created; the design spec is already committed on it).

**Domain note on TDD:** This change is static copy + one presentational component; there is no unit-test runner in the repo (only `eslint` + Playwright e2e). So verification is `next build` + `eslint` + grep assertions on the copy + a render check (surface-audit), with an **optional** Playwright spec for the Maya section. That is the honest, applicable form of "test it" for this domain.

**Working directory for all commands:** `C:/Users/blaqu/dev/lechner-studios`. Each `Bash` step that needs the repo starts with `cd /c/Users/blaqu/dev/lechner-studios &&` because the shell cwd resets between calls.

---

## File map

- **Modify** `src/i18n/dictionaries.ts` — (a) re-anchor 4 claim strings × 2 locales (Task 1); (b) add `maya` key × 2 locales (Task 2).
- **Create** `src/components/MayaCaseStudy.tsx` — featured proof block (Task 3).
- **Modify** `src/app/(site)/[locale]/work/page.tsx` — mount `<MayaCaseStudy />` (Task 4).
- **Create** `public/maya-demo-poster.svg` — placeholder poster so the block renders before the real video exists (Task 4).
- **Owner-supplied** `public/maya-demo.mp4` — the real 30–60s demo (gates the Part-2 merge; see Task 6).
- **Modify (separate repo)** `ai-brain` ADR-0038 — record the public-AI-claims honesty rule (Task 5).

---

## Task 1: Honesty patch — re-anchor AI claims (Part 1)

Re-anchors present-tense buyable-product claims for on-hold/paused things → "in development", while keeping every "AI-native" instance. EN and DE in lockstep. 8 string edits, all in `src/i18n/dictionaries.ts`.

**Files:**
- Modify: `src/i18n/dictionaries.ts`

- [ ] **Step 1: Edit 1a — VOT work-item desc (EN, ~L122)**

Find:
```ts
          desc: "AI-powered phone answering, legally usable business address, and automated back-office for Innsbruck-based businesses.",
```
Replace with:
```ts
          desc: "A platform in development for Innsbruck businesses — a legally usable business address, with AI phone answering and back-office automation on the roadmap.",
```

- [ ] **Step 2: Edit 1b — VOT work-item desc (DE, ~L455)**

Find:
```ts
          desc: "KI-gestützte Telefon-Assistenz, ladungsfähige Geschäftsadresse und automatisiertes Back-Office für Innsbrucker Betriebe.",
```
Replace with:
```ts
          desc: "Eine Plattform in Entwicklung für Innsbrucker Betriebe — eine ladungsfähige Geschäftsadresse, mit KI-Telefon-Assistenz und Back-Office-Automatisierung auf der Roadmap.",
```

- [ ] **Step 3: Edit 2a — Apps & Automation pillar desc (EN, ~L155)**

Find:
```ts
          desc: "The repetitive work that eats your week, software can take off your hands. We build full-stack apps and AI systems that do the actual work — PropTech VR, virtual-office SaaS, AI phone agents, content automation.",
```
Replace with:
```ts
          desc: "The repetitive work that eats your week, software can take off your hands. We build full-stack apps and AI automation — from content pipelines we run in production today to PropTech VR and virtual-office systems in development.",
```

- [ ] **Step 4: Edit 2b — Apps & Automation pillar desc (DE, ~L488)**

Find:
```ts
          desc: "Die wiederkehrende Arbeit, die Ihre Woche frisst, kann Software übernehmen. Wir bauen Full-Stack-Apps und KI-Systeme, die die Arbeit wirklich erledigen — PropTech-VR, Virtual-Office-SaaS, KI-Telefonassistenz, Content-Automatisierung.",
```
Replace with:
```ts
          desc: "Die wiederkehrende Arbeit, die Ihre Woche frisst, kann Software übernehmen. Wir bauen Full-Stack-Apps und KI-Automatisierung — von Content-Pipelines, die heute in Produktion laufen, bis zu PropTech-VR und Virtual-Office-Systemen in Entwicklung.",
```

- [ ] **Step 5: Edit 3a — "AI automation, used responsibly" section (EN, ~L219)**

Find:
```ts
            p: "We use AI where it earns its place — phone answering, content automation, back-office routing — inside clear, reviewable scopes, so a human stays in control of anything that matters.",
```
Replace with:
```ts
            p: "We use AI where it earns its place — content automation today, with phone answering and back-office routing in development — always inside clear, reviewable scopes, so a human stays in control of anything that matters.",
```

- [ ] **Step 6: Edit 3b — "KI verantwortungsvoll eingesetzt" section (DE, ~L552)**

Find:
```ts
            p: "Wir setzen KI dort ein, wo sie ihren Platz verdient — Telefon-Assistenz, Content-Automatisierung, Back-Office-Routing — innerhalb klarer, überprüfbarer Grenzen, damit bei allem Wesentlichen ein Mensch die Kontrolle behält.",
```
Replace with:
```ts
            p: "Wir setzen KI dort ein, wo sie ihren Platz verdient — Content-Automatisierung heute, Telefon-Assistenz und Back-Office-Routing in Entwicklung — immer innerhalb klarer, überprüfbarer Grenzen, damit bei allem Wesentlichen ein Mensch die Kontrolle behält.",
```

- [ ] **Step 7: Edit 4a — apps proof line (EN, ~L227) — also introduces Maya as the live one**

Find:
```ts
          "This is what we make for ourselves: Virtual Office Tirol for AI phone answering and automated back-office for Innsbruck businesses, Vistera for VR property walkthroughs, and content pipelines that automate real production work. Each built in-house, the same way we'd build yours.",
```
Replace with:
```ts
          "This is what we build for ourselves: Maya, an in-house voice AI assistant running in production; content pipelines that automate real production work today; and platforms in development — Virtual Office Tirol for phone answering and back-office automation, Vistera for VR property walkthroughs. Each built in-house, the same way we'd build yours.",
```

- [ ] **Step 8: Edit 4b — apps proof line (DE, ~L560)**

Find:
```ts
          "Genau das bauen wir für uns selbst: Virtual Office Tirol für KI-Telefon-Assistenz und automatisiertes Back-Office für Innsbrucker Betriebe, Vistera für VR-Immobilienrundgänge, und Content-Pipelines, die echte Produktionsarbeit automatisieren. Alles im Haus gebaut — so, wie wir auch Ihres bauen würden.",
```
Replace with:
```ts
          "Genau das bauen wir für uns selbst: Maya, einen hauseigenen Sprach-KI-Assistenten, der in Produktion läuft; Content-Pipelines, die heute echte Produktionsarbeit automatisieren; und Plattformen in Entwicklung — Virtual Office Tirol für Telefon-Assistenz und Back-Office-Automatisierung, Vistera für VR-Immobilienrundgänge. Alles im Haus gebaut — so, wie wir auch Ihres bauen würden.",
```

- [ ] **Step 9: Verify the over-claims are gone and the new framing is present**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && \
echo "should be EMPTY:" && \
grep -nE "AI-powered phone answering|AI phone agents|AI systems that do the actual work|KI-Systeme, die die Arbeit wirklich erledigen|KI-gestützte Telefon-Assistenz, ladungsfähige" src/i18n/dictionaries.ts ; \
echo "should each return a hit:" && \
grep -nc "in development" src/i18n/dictionaries.ts && \
grep -nc "in Entwicklung" src/i18n/dictionaries.ts
```
Expected: first grep prints nothing (no over-claims left); the two counts are ≥ 3 and ≥ 3 respectively.

- [ ] **Step 10: Confirm the AI-twin flag was NOT touched**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && grep -rn "SHOW_HOW_WE_WORK" src/ || echo "flag not added/changed — OK"
```
Expected: only the existing reference in `about/page.tsx` (the gating check) — no new default, no `=1`.

- [ ] **Step 11: Build + lint**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && npm run build && npm run lint
```
Expected: build succeeds, lint clean. (If lint flags formatting, run `npm run lint -- --fix` or the repo's `/fix` and re-run.)

- [ ] **Step 12: Commit**

```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/i18n/dictionaries.ts && git commit -m "copy: re-anchor AI claims to shipped capability (honesty patch)

Soften present-tense buyable-product claims for on-hold/paused products
(VOT phone answering, AI phone agents) to in-development framing; keep
AI-native positioning; introduce Maya as the live in-house proof. DE+EN.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Add the `maya` dictionary key (EN + DE)

`dict.maya` must exist in **both** locales — `Dictionary = typeof dictionaries.en`, and `dictionaries.de` is not structurally checked against it, so a key present only in `en` would make `dictionaries[locale].maya` a type error. Insert in each locale between the `work` object's closing `},` and the `services:` key.

**Files:**
- Modify: `src/i18n/dictionaries.ts`

- [ ] **Step 1: Insert the EN `maya` block (after the EN `work` object, before `services: {` ~L145)**

Insert this block immediately before the EN `    services: {` line:
```ts
    maya: {
      overline: "BUILT IN-HOUSE",
      headline: "Maya — a voice AI we built and run.",
      body: "Maya is a production voice assistant we built in-house: you speak, she answers in natural speech, and she remembers across conversations. It's the kind of AI capability we bring to client work — real, shipped, and running on our own infrastructure.",
      stackLabel: "The stack",
      stack: [
        "Speech-to-text — AssemblyAI streaming",
        "Reasoning — Claude (Haiku for voice, Sonnet for text)",
        "Memory — persistent and encrypted, distilled by Claude Opus",
        "Speech — Cartesia text-to-speech",
        "~2 seconds end-to-end, live in production",
      ],
      videoCaption: "A real 30-second voice exchange with Maya.",
      videoAlt: "Screen recording of a spoken conversation with Maya, our in-house voice AI assistant.",
      note: "An internal tool, shown here as a capability demo — not a product for sale.",
    },
```

- [ ] **Step 2: Insert the DE `maya` block (after the DE `work` object, before the DE `services: {` ~L478)**

Insert this block immediately before the DE `    services: {` line:
```ts
    maya: {
      overline: "IM HAUS GEBAUT",
      headline: "Maya — eine Sprach-KI, die wir gebaut haben und betreiben.",
      body: "Maya ist ein hauseigener Sprach-Assistent in Produktion: Sie sprechen, Maya antwortet mit natürlicher Stimme und erinnert sich über Gespräche hinweg. Genau diese Art von KI-Fähigkeit bringen wir in die Kundenarbeit ein — real, ausgeliefert und auf unserer eigenen Infrastruktur.",
      stackLabel: "Der Stack",
      stack: [
        "Spracherkennung — AssemblyAI Streaming",
        "Reasoning — Claude (Haiku für Sprache, Sonnet für Text)",
        "Gedächtnis — dauerhaft und verschlüsselt, destilliert von Claude Opus",
        "Sprachausgabe — Cartesia Text-to-Speech",
        "~2 Sekunden Ende-zu-Ende, live in Produktion",
      ],
      videoCaption: "Ein echter 30-sekündiger Sprachdialog mit Maya.",
      videoAlt: "Bildschirmaufnahme eines gesprochenen Gesprächs mit Maya, unserem hauseigenen Sprach-KI-Assistenten.",
      note: "Ein internes Werkzeug, hier als Fähigkeits-Demo gezeigt — kein Produkt zum Verkauf.",
    },
```

- [ ] **Step 3: Verify both locales have `maya` and the type compiles**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && grep -nc "    maya: {" src/i18n/dictionaries.ts && npx tsc --noEmit
```
Expected: count is `2`; `tsc --noEmit` exits clean (no type errors).

- [ ] **Step 4: Commit**

```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/i18n/dictionaries.ts && git commit -m "copy: add Maya case-study dictionary entry (DE+EN)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Create the `MayaCaseStudy` component

A presentational client component matching the `Work.tsx` idiom (CSS custom properties, `Reveal` wrapper). Renders overline → headline → body → self-hosted `<video>` → caption → stack list → "internal tool" note.

**Files:**
- Create: `src/components/MayaCaseStudy.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/MayaCaseStudy.tsx`:
```tsx
"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

export default function MayaCaseStudy() {
  const { dict } = useLanguage();
  const d = dict.maya;

  return (
    <section
      id="maya"
      className="lc-pad-section"
      style={{
        background: "var(--bg)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "12px",
            }}
          >
            {d.overline}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "24px",
              maxWidth: "20ch",
            }}
          >
            {d.headline}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              lineHeight: 1.75,
              maxWidth: "62ch",
              marginBottom: "48px",
            }}
          >
            {d.body}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div
            style={{
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--bg-alt)",
              marginBottom: "16px",
            }}
          >
            <video
              controls
              preload="none"
              playsInline
              poster="/maya-demo-poster.svg"
              aria-label={d.videoAlt}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                aspectRatio: "16 / 9",
                background: "var(--bg-alt)",
              }}
            >
              <source src="/maya-demo.mp4" type="video/mp4" />
            </video>
          </div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              marginBottom: "56px",
            }}
          >
            {d.videoCaption}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            {d.stackLabel}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", maxWidth: "62ch" }}>
            {d.stack.map((line) => (
              <li
                key={line}
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {line}
              </li>
            ))}
          </ul>
          <p
            style={{
              fontSize: "0.85rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              maxWidth: "62ch",
            }}
          >
            {d.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck the component**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && npx tsc --noEmit
```
Expected: clean. (Confirms `dict.maya` and all referenced fields resolve, and that `Reveal`/`useLanguage` import paths are correct — they mirror `Work.tsx`.)

- [ ] **Step 3: Commit**

```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/components/MayaCaseStudy.tsx && git commit -m "feat: MayaCaseStudy proof-point component

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Mount on the `/work` page + placeholder poster

**Files:**
- Modify: `src/app/(site)/[locale]/work/page.tsx`
- Create: `public/maya-demo-poster.svg`

- [ ] **Step 1: Add the import**

In `src/app/(site)/[locale]/work/page.tsx`, find:
```tsx
import Work from "../../../../components/Work";
import Footer from "../../../../components/Footer";
```
Replace with:
```tsx
import Work from "../../../../components/Work";
import MayaCaseStudy from "../../../../components/MayaCaseStudy";
import Footer from "../../../../components/Footer";
```

- [ ] **Step 2: Render the component between `<Work />` and `<Footer />`**

Find:
```tsx
        <Work />
        <Footer />
```
Replace with:
```tsx
        <Work />
        <MayaCaseStudy />
        <Footer />
```

- [ ] **Step 3: Create a placeholder poster so the block renders before the real video lands**

Create `public/maya-demo-poster.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Maya demo video">
  <rect width="1600" height="900" fill="#15171a"/>
  <circle cx="800" cy="430" r="64" fill="none" stroke="#8FA8C5" stroke-width="3"/>
  <path d="M780 400 l44 30 -44 30 z" fill="#8FA8C5"/>
  <text x="800" y="560" fill="#C9CDD2" font-family="monospace" font-size="34" letter-spacing="6" text-anchor="middle">MAYA — VOICE AI DEMO</text>
</svg>
```

- [ ] **Step 4: Build + lint**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && npm run build && npm run lint
```
Expected: build succeeds, lint clean.

- [ ] **Step 5: Render check (manual)**

Run `npm run dev`, open `http://localhost:3000/en/work` and `http://localhost:3000/de/work`. Confirm: the Maya section renders below the project list; overline/headline/body/stack/note show in the right language; the poster displays with a play control; no console errors except an expected media 404 for `/maya-demo.mp4` until the owner supplies it. Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
cd /c/Users/blaqu/dev/lechner-studios && git add "src/app/(site)/[locale]/work/page.tsx" public/maya-demo-poster.svg && git commit -m "feat: mount Maya proof point on /work + placeholder poster

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Doctrine lockstep — record the honesty rule in ADR-0038 (ai-brain)

Editing AI-positioning copy on a live surface triggers the doctrine-edit → ADR-check rule. Record the governing principle so the standard and the surface stay in lockstep.

**Files:**
- Modify (separate repo `C:/Users/blaqu/dev/ai-brain`): the ADR-0038 document.

- [ ] **Step 1: Locate the ADR file**

Run:
```bash
cd /c/Users/blaqu/dev/ai-brain && grep -rl "0038" docs 2>/dev/null | grep -i adr ; ls docs/adr 2>/dev/null | grep -i 0038
```
Expected: one ADR-0038 markdown path.

- [ ] **Step 2: Add the normative clause**

In that ADR's standard/decision section (under the A2 honesty principle), add a bullet:
```markdown
- **Public AI claims must point to shipped capability or be explicitly labelled in development.** Present-tense descriptions of AI products that are unbuilt, paused, or on hold are an A2 honesty violation. Re-anchor them to build practice, shipped capability (e.g. Maya), or an explicit "in development" label. (Applied 2026-06-16: lechner-studios honesty patch.)
```

- [ ] **Step 3: Commit (branch first if on `main`)**

```bash
cd /c/Users/blaqu/dev/ai-brain && git rev-parse --abbrev-ref HEAD
# if main: git checkout -b adr-0038-public-ai-claims-clause
cd /c/Users/blaqu/dev/ai-brain && git add docs && git commit -m "docs(adr-0038): public AI claims must be shipped or labelled in development

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Verification & ship

**Files:** none (verification + PR).

- [ ] **Step 1: Full build + lint + typecheck**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && npm run build && npm run lint && npx tsc --noEmit
```
Expected: all clean.

- [ ] **Step 2: Copy-honesty assertion (no over-claims remain anywhere in src)**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && grep -rnE "AI-powered phone answering|AI phone agents|AI systems that do the actual work" src/ && echo "FAIL: over-claim still present" || echo "PASS: no over-claims"
```
Expected: `PASS: no over-claims`.

- [ ] **Step 3: DE/EN parity check**

Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && grep -nc "    maya: {" src/i18n/dictionaries.ts
```
Expected: `2`.

- [ ] **Step 4: Render-first surface audit**

Invoke the `surface-audit` skill against `/en/work` and `/de/work` plus the touched service/home pages. Render every state; confirm Layer-A AA contrast specifically on: the italic `note` (muted on `--bg`), the mono `videoCaption`, and the video controls overlay against the poster. Record P0/P1 with evidence; fix any P0 before merge.

- [ ] **Step 5 (optional): Playwright smoke for the Maya section**

If the e2e harness runs cleanly in this environment, add `tests/e2e/maya.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("work page shows the Maya proof point", async ({ page }) => {
  await page.goto("/en/work");
  const maya = page.locator("#maya");
  await expect(maya).toBeVisible();
  await expect(maya.getByRole("heading", { name: /Maya/ })).toBeVisible();
  await expect(maya.locator("video")).toHaveCount(1);
});
```
Run: `cd /c/Users/blaqu/dev/lechner-studios && npm run test:e2e -- maya`. Expected: PASS. If the harness needs config not present, skip this step (build + render check already cover it) and note the skip.

- [ ] **Step 6: OWNER GATE — real demo video**

The Part-2 surface is not merge-ready until `public/maya-demo.mp4` (the owner-recorded 30–60s demo, self-hosted — **no YouTube/Vimeo embed**, per DSGVO) is added. Either:
- wait for the owner to drop in `public/maya-demo.mp4` (commit it: `git add public/maya-demo.mp4 && git commit -m "asset: Maya demo video"`), **or**
- merge Part 1 (honesty patch) now and hold Part 2 behind this gate.

- [ ] **Step 7: Push + open PR**

Use the `superpowers:finishing-a-development-branch` skill. Push the branch and open a PR summarizing: Part 1 (honesty re-anchor, DE+EN), Part 2 (Maya proof point), the ADR-0038 lockstep clause, and the owner video gate. Confirm the AI-twin flag remains OFF.

```bash
cd /c/Users/blaqu/dev/lechner-studios && git push && gh pr create --fill --title "Honesty patch + Maya proof point" --body "Re-anchors live AI claims to shipped capability (DE+EN), adds Maya as the first concrete AI proof point on /work (self-hosted demo). AI-twin flag stays OFF. ADR-0038 amended in lockstep. Owner gate: real maya-demo.mp4.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Self-review (done at authoring time)

- **Spec coverage:** Part 1 re-anchor → Task 1 (all 4 claim families, ×2 locales). Maya proof → Tasks 2–4. Self-hosted video / no embed → Task 4 + Task 6 gate. ADR/A2 lockstep → Task 5. Render-first audit + DE/EN parity + flag-OFF → Task 6. Non-goals (no new route, no flag flip, no live bot, no deps) respected throughout. ✓
- **Placeholder scan:** No TBD/TODO; every code/copy step shows the actual content. ✓
- **Type consistency:** `maya` added to both locales (required because `Dictionary = typeof dictionaries.en` and `de` is unchecked); component reads exactly the fields defined in Task 2 (`overline, headline, body, stackLabel, stack, videoCaption, videoAlt, note`); poster filename matches between Task 3 (`/maya-demo-poster.svg`) and Task 4. ✓
