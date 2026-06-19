# Service-page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the three service pages (webdesign / apps-automation / seo) from a single stacked-paragraph column into a data-driven **hybrid showcase** — image-forward for web, structured for apps/seo — with no fabricated proof.

**Architecture:** One component, `ServiceDetail.tsx`, renders all three pages and is driven entirely by the per-service `serviceDetail` dictionary. New optional dict fields (`heroArtifact`, per-section `artifact`, `steps`, `included`, `schemaArtifact`, `proofArtifact`) decide which slots a page shows, so the same template flexes from image-forward to structured. Each page carries a per-service pillar accent via a CSS custom property (`--svc-accent`) that flips for dark mode.

**Tech Stack:** Next.js App Router + React + TypeScript; inline-styled components + token-driven rules in `src/app/globals.css`; i18n via `src/i18n/dictionaries.ts` (de + en). No new dependencies. Verification is `tsc` + `npm run build` + render (this is presentational UI, not unit-tested logic).

**Spec:** `docs/superpowers/specs/2026-06-18-service-pages-redesign-design.md`

**Working dir:** repo root `C:/Users/blaqu/dev/lechner-studios`, branch `feat/service-pages-redesign`. Prefix bash with `cd /c/Users/blaqu/dev/lechner-studios &&`. The site is in maintenance; this ships as a PR for owner review (do NOT merge / un-maintenance).

---

## File map

- **Modify** `src/i18n/dictionaries.ts` — extend the `serviceDetail` TypeScript shape (new optional fields) and the three `web`/`apps`/`seo` entries (de + en) with the new content. (Tasks 1, 3, 4.)
- **Modify** `src/app/globals.css` — add the hybrid layout classes + the per-service `--svc-accent` vars. (Task 2.)
- **Rewrite** `src/components/ServiceDetail.tsx` — the hybrid renderer. (Task 5.)
- The three page files under `src/app/(site)/[locale]/{webdesign,apps-automation,seo}/page.tsx` are **unchanged** (they already render `<ServiceDetail serviceKey=…>`).

---

## Task 1: Extend the `serviceDetail` dict TYPE shape

**Files:** Modify `src/i18n/dictionaries.ts` (the type/interface that describes `serviceDetail[key]`).

Find how `serviceDetail` is typed. The dict is a plain object literal typed via a `Dictionary`/`dictionaries` type. The three entries currently have `{ overline, headline, intro, sections: {h,p}[], proof, ctaLabel, slug, metaTitle, metaDescription }`. Add the new OPTIONAL fields so existing entries still type-check and new fields can be added incrementally.

- [ ] **Step 1: Locate the type.** Run:
```bash
cd /c/Users/blaqu/dev/lechner-studios && grep -n "serviceDetail\|sections:\|metaTitle\|ServiceDetail" src/i18n/dictionaries.ts | head
```
Identify whether `serviceDetail` entries are typed by an explicit `interface`/`type` or inferred from a `satisfies`/typed root. If there is an explicit per-service type (e.g. `type ServiceDetailEntry`), edit it. If the shape is inferred from the object literal (no explicit type), then adding the fields to the de/web object in Task 3 defines the shape and en must match — in that case SKIP the explicit-type edit here and note it; the build is the type check.

- [ ] **Step 2: If an explicit type exists, add the optional fields.** Add to the service-detail entry type:
```ts
  // Hybrid-showcase additions (all optional; per-service slots).
  heroArtifact?: { src: string; alt: string; caption?: string };
  steps?: { n: string; label: string }[];
  included?: string[];
  includedLabel?: string;
  schemaArtifact?: { lines: string[]; note: string };
  proofArtifact?: { images: { src: string; alt: string }[]; workLabel: string };
```
And change the `sections` element type to allow an optional artifact:
```ts
  sections: { h: string; p: string; artifact?: { src: string; alt: string; caption?: string } }[];
```

- [ ] **Step 3: Typecheck.** Run: `cd /c/Users/blaqu/dev/lechner-studios && npx tsc --noEmit`. Expected: PASS (no entries use the new fields yet, so nothing breaks).

- [ ] **Step 4: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/i18n/dictionaries.ts && git commit -m "feat(services): extend serviceDetail dict shape for hybrid showcase"
```

---

## Task 2: Add the hybrid CSS + per-service accent vars

**Files:** Modify `src/app/globals.css`.

- [ ] **Step 1: Append the layout + accent rules.** Add to `src/app/globals.css` (token-driven; mirrors existing patterns):
```css
/* ── Service-detail hybrid showcase ─────────────────────────────────────────
   Per-service pillar accent (Säulenfarbe), AA-legible in both modes — raw
   pillar colours are too light on cream (stone/sky) or invisible on dark (lake),
   so each service maps to a darker/lighter variant of its pillar hue. */
.svc-web  { --svc-accent: #7A6A4E; }   /* Stone family */
.svc-apps { --svc-accent: #3E5F86; }   /* Sky family */
.svc-seo  { --svc-accent: #254268; }   /* Lake */
[data-theme="dark"] .svc-web  { --svc-accent: #D6CDBE; }
[data-theme="dark"] .svc-apps { --svc-accent: #8FA8C5; }
[data-theme="dark"] .svc-seo  { --svc-accent: #8FA8C5; }

/* Image-forward hero (web): text + artifact side by side. */
.svc-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
/* Alternating method blocks. */
.svc-method { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; margin-bottom: 40px; }
.svc-method:last-child { margin-bottom: 0; }
.svc-method.reverse > .svc-method-art { order: -1; }   /* image on the left on alternating rows */
/* A self-hosted screenshot frame (no tilt/3D — plain editorial frame). */
.svc-shot { border: 1px solid var(--border); border-radius: 4px; overflow: hidden; background: var(--bg-alt); display: block; width: 100%; }
.svc-shot img { display: block; width: 100%; height: auto; }
.svc-shot-cap { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-faint); margin-top: 8px; }
/* How-it-works steps. */
.svc-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.svc-step { border: 1px solid var(--border); border-radius: 3px; padding: 18px; }
.svc-step-n { font-family: var(--font-mono); font-size: 0.62rem; font-weight: 600; letter-spacing: 0.1em; color: var(--svc-accent); margin-bottom: 8px; }
.svc-step-l { font-size: 0.95rem; color: var(--text); line-height: 1.4; }
/* What's included — borderless check + label (NOT a checkbox box). */
.svc-incl { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 28px; }
.svc-incl-item { display: flex; align-items: center; gap: 12px; font-size: 0.98rem; color: var(--text); }
/* SEO real-schema artifact. */
.svc-code { background: var(--contrast-bg); color: var(--on-contrast-muted); border-radius: 4px; padding: 18px 20px; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.7; overflow-x: auto; }
.svc-code .k { color: var(--accent-on-contrast); }
.svc-code .v { color: var(--signature); }
.svc-code-note { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-2); margin-top: 10px; }
/* Web proof row. */
.svc-proofrow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
@media (max-width: 768px) {
  .svc-hero, .svc-method { grid-template-columns: 1fr !important; gap: 28px !important; }
  .svc-method.reverse > .svc-method-art { order: 0; }
  .svc-steps { grid-template-columns: 1fr !important; }
  .svc-incl { grid-template-columns: 1fr !important; }
  .svc-proofrow { grid-template-columns: 1fr 1fr !important; }
}
```

- [ ] **Step 2: Typecheck/build sanity.** Run: `cd /c/Users/blaqu/dev/lechner-studios && npm run build`. Expected: PASS (CSS only; no consumers yet).

- [ ] **Step 3: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/app/globals.css && git commit -m "feat(services): hybrid showcase CSS + per-service pillar accents"
```

---

## Task 3: Author WEB content (image-forward) — de + en

**Files:** Modify `src/i18n/dictionaries.ts` — the `serviceDetail.web` entry in BOTH the `de` and `en` dictionaries.

Keep the existing `overline`, `headline`, `intro`, `proof`, `ctaLabel`, `slug`, `meta*`. ADD the new fields. Reuse the existing four self-hosted demo screenshots in `public/proof/`.

- [ ] **Step 1: Add web fields (en).** In the `en` dict's `serviceDetail.web`, add:
```ts
    heroArtifact: { src: "/proof/pension.webp", alt: "Pension Musterhof — a website we designed and built", caption: "Live demo · pension" },
    includedLabel: "What's included",
    included: ["Hand-coded", "Self-hosted", "DSGVO by construction", "WCAG AA accessible", "Responsive", "Brand built in"],
    proofArtifact: {
      images: [
        { src: "/proof/pension.webp", alt: "Pension demo" },
        { src: "/proof/gasthof.webp", alt: "Gasthof demo" },
        { src: "/proof/skischule.webp", alt: "Skischule demo" },
        { src: "/proof/tischlerei.webp", alt: "Tischlerei demo" },
      ],
      workLabel: "See the work",
    },
```
Then give the FIRST TWO existing `sections` an `artifact` (alternating imagery), reusing demo shots:
```ts
    // existing sections[0]: add  artifact: { src: "/proof/gasthof.webp", alt: "Gasthof — built to measure" }
    // existing sections[1]: add  artifact: { src: "/proof/tischlerei.webp", alt: "Tischlerei — hand-coded, self-hosted" }
```
(If `web.sections` has fewer than 2 entries, add the artifact to whatever exists; leave any third section text-only.)

- [ ] **Step 2: Mirror to `de`.** Add the same structure to the `de` dict's `serviceDetail.web` with German strings: `includedLabel: "Enthalten"`, `included: ["Handgeschrieben", "Selbst gehostet", "DSGVO-konform by construction", "WCAG-AA-barrierefrei", "Responsiv", "Marke integriert"]`, `heroArtifact.caption: "Live-Demo · Pension"`, `proofArtifact.workLabel: "Arbeiten ansehen"`, and German `alt` text. Keep image `src` paths identical.

- [ ] **Step 3: Typecheck.** Run: `cd /c/Users/blaqu/dev/lechner-studios && npx tsc --noEmit`. Expected: PASS (de and en `web` shapes match).

- [ ] **Step 4: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/i18n/dictionaries.ts && git commit -m "feat(services): web page content — image-forward (demos, included, proof)"
```

---

## Task 4: Author APPS (capability-only) + SEO (structured) content — de + en

**Files:** Modify `src/i18n/dictionaries.ts` — `serviceDetail.apps` and `serviceDetail.seo` in BOTH `de` and `en`.

Apps gets `steps` + `included` (NO `heroArtifact`, NO `proofArtifact`, NO disclaimer). SEO gets `schemaArtifact` + `included`.

- [ ] **Step 1: Apps (en).** Add to `en.serviceDetail.apps`:
```ts
    steps: [
      { n: "01", label: "Map the workflow that eats your time" },
      { n: "02", label: "Build the tool around it" },
      { n: "03", label: "It runs; you review" },
    ],
    includedLabel: "What we build",
    included: ["Custom web apps", "Workflow automation", "Content pipelines", "Internal tools"],
```
Apps (de): `steps` German (`"Den Arbeitsablauf erfassen, der Ihre Zeit frisst"`, `"Das Werkzeug darum herum bauen"`, `"Es läuft; Sie prüfen"`), `includedLabel: "Was wir bauen"`, `included: ["Individuelle Web-Apps", "Workflow-Automatisierung", "Content-Pipelines", "Interne Tools"]`.

- [ ] **Step 2: SEO (en).** Add to `en.serviceDetail.seo`:
```ts
    schemaArtifact: {
      lines: [
        '<span class="k">"@type"</span>: <span class="v">"Service"</span>,',
        '<span class="k">"areaServed"</span>: <span class="v">"Tirol"</span>,',
        '<span class="k">"@type"</span>: <span class="v">"FAQPage"</span>,',
        '<span class="k">"@type"</span>: <span class="v">"BreadcrumbList"</span>',
      ],
      note: "Rich-result eligible · live on our own pages",
    },
    includedLabel: "What we implement",
    included: ["Semantic HTML", "JSON-LD schema", "Sitemap / robots", "Internal linking"],
```
SEO (de): same `schemaArtifact.lines` (code is language-neutral), `note: "Rich-Snippet-fähig · live auf unseren eigenen Seiten"`, `includedLabel: "Was wir umsetzen"`, `included: ["Semantisches HTML", "JSON-LD-Schema", "Sitemap / robots", "Interne Verlinkung"]`.
NOTE: the `lines` contain HTML spans rendered via `dangerouslySetInnerHTML` in Task 5 — they are static, author-controlled strings (no user input), so this is XSS-safe.

- [ ] **Step 3: Typecheck.** Run: `cd /c/Users/blaqu/dev/lechner-studios && npx tsc --noEmit`. Expected: PASS.

- [ ] **Step 4: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/i18n/dictionaries.ts && git commit -m "feat(services): apps (capability-only) + seo (schema artifact) content"
```

---

## Task 5: Rewrite `ServiceDetail.tsx` as the hybrid renderer

**Files:** Modify `src/components/ServiceDetail.tsx` (full rewrite).

- [ ] **Step 1: Replace the component.** Overwrite `src/components/ServiceDetail.tsx` with:
```tsx
"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

type ServiceKey = "web" | "apps" | "seo";
const ORDER: ServiceKey[] = ["web", "apps", "seo"];

// Thin line-style check; colour comes from the per-service --svc-accent var.
function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--svc-accent)"
         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
         style={{ flex: "none" }}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function Shot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure style={{ margin: 0 }}>
      {/* self-hosted demo screenshots; plain editorial frame, no tilt */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <span className="svc-shot"><img src={src} alt={alt} loading="lazy" decoding="async" /></span>
      {caption ? <figcaption className="svc-shot-cap">{caption}</figcaption> : null}
    </figure>
  );
}

export default function ServiceDetail({ serviceKey }: { serviceKey: ServiceKey }) {
  const { dict, locale } = useLanguage();
  const sd = dict.serviceDetail[serviceKey];

  const related = ORDER.filter((k) => k !== serviceKey);
  const relatedLabel = locale === "de" ? "Weitere Leistungen" : "More services";
  const workLabel = locale === "de" ? "Arbeiten ansehen" : "See the work";

  const ctaStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 600,
    letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)",
    border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
    borderRadius: "2px", padding: "15px 30px", textDecoration: "none",
    display: "inline-block", transition: "background 0.25s, color 0.25s, border-color 0.25s",
  };
  const onCtaEnter = (e: React.MouseEvent) => { const t = e.currentTarget as HTMLElement; t.style.background = "var(--accent)"; t.style.color = "var(--bg)"; t.style.borderColor = "var(--accent)"; };
  const onCtaLeave = (e: React.MouseEvent) => { const t = e.currentTarget as HTMLElement; t.style.background = "transparent"; t.style.color = "var(--accent)"; t.style.borderColor = "color-mix(in srgb, var(--accent) 50%, transparent)"; };

  return (
    <section
      className={`lc-pad-section svc-${serviceKey}`}
      style={{ background: "var(--bg)", padding: "120px 48px", borderTop: "1px solid var(--border)" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* 1 · Hero — image-forward when heroArtifact present, else text-only */}
        <Reveal>
          <div className={sd.heroArtifact ? "svc-hero" : undefined} style={{ marginBottom: "72px" }}>
            <div>
              {/* overline tinted with the service accent */}
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--svc-accent)", marginBottom: "2rem" }}>
                {sd.overline}
              </p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.02, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "32px", fontStyle: "italic" }}>
                {sd.headline}
              </h1>
              <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: "560px", marginBottom: "28px" }}>
                {sd.intro}
              </p>
              <Link href={`/${locale}/start`} style={ctaStyle} onMouseEnter={onCtaEnter} onMouseLeave={onCtaLeave}>
                {sd.ctaLabel} →
              </Link>
            </div>
            {sd.heroArtifact ? <Shot src={sd.heroArtifact.src} alt={sd.heroArtifact.alt} caption={sd.heroArtifact.caption} /> : null}
          </div>
        </Reveal>

        {/* 2 · Method blocks — alternating when a section has an artifact, else stacked text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginBottom: "72px" }}>
          {sd.sections.map((sec, i) => (
            <Reveal key={i} delay={i * 60}>
              {sec.artifact ? (
                <div className={`svc-method${i % 2 === 1 ? " reverse" : ""}`}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, color: "var(--text)", marginBottom: "12px", lineHeight: 1.25 }}>{sec.h}</h2>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{sec.p}</p>
                  </div>
                  <div className="svc-method-art"><Shot src={sec.artifact.src} alt={sec.artifact.alt} caption={sec.artifact.caption} /></div>
                </div>
              ) : (
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, color: "var(--text)", marginBottom: "12px", lineHeight: 1.25 }}>{sec.h}</h2>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: "620px" }}>{sec.p}</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        {/* 3 · How it works (optional) */}
        {sd.steps && sd.steps.length > 0 ? (
          <Reveal>
            <div style={{ marginBottom: "72px" }}>
              <Overline marginBottom="1.5rem">{locale === "de" ? "So läuft es ab" : "How it works"}</Overline>
              <div className="svc-steps">
                {sd.steps.map((s) => (
                  <div className="svc-step" key={s.n}>
                    <div className="svc-step-n">{s.n}</div>
                    <div className="svc-step-l">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* 4 · What's included (optional) */}
        {sd.included && sd.included.length > 0 ? (
          <Reveal>
            <div style={{ marginBottom: "72px" }}>
              <Overline marginBottom="1.5rem">{sd.includedLabel ?? (locale === "de" ? "Enthalten" : "What's included")}</Overline>
              <div className="svc-incl">
                {sd.included.map((item) => (
                  <div className="svc-incl-item" key={item}><Check />{item}</div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* 5a · SEO schema artifact (optional) */}
        {sd.schemaArtifact ? (
          <Reveal>
            <div style={{ marginBottom: "72px" }}>
              <Overline marginBottom="1.5rem">{locale === "de" ? "Echte strukturierte Daten" : "Real structured data"}</Overline>
              <div className="svc-code" dangerouslySetInnerHTML={{ __html: sd.schemaArtifact.lines.join("<br>") }} />
              <div className="svc-code-note">— {sd.schemaArtifact.note} —</div>
            </div>
          </Reveal>
        ) : null}

        {/* 5b · Web proof row (optional) */}
        {sd.proofArtifact ? (
          <Reveal>
            <div style={{ marginBottom: "16px" }}>
              <Overline marginBottom="1.5rem">{locale === "de" ? "Die Arbeit ist der Beweis" : "The work is the proof"}</Overline>
              <div className="svc-proofrow">
                {sd.proofArtifact.images.map((im) => (
                  <span className="svc-shot" key={im.src}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={im.src} alt={im.alt} loading="lazy" decoding="async" /></span>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* Proof quote — kept, anchored to the work link where present */}
        <Reveal>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.15rem", color: "var(--text)", lineHeight: 1.7, maxWidth: "620px", borderLeft: "3px solid var(--svc-accent)", paddingLeft: "24px", marginBottom: "64px" }}>
            {sd.proof}{" "}
            {sd.proofArtifact ? (
              <Link href={`/${locale}/work`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none", whiteSpace: "nowrap" }}>→ {sd.proofArtifact.workLabel}</Link>
            ) : null}
          </p>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <Link href={`/${locale}/start`} style={ctaStyle} onMouseEnter={onCtaEnter} onMouseLeave={onCtaLeave}>
            {sd.ctaLabel} →
          </Link>
        </Reveal>

        {/* Related / internal links */}
        <div style={{ marginTop: "80px", paddingTop: "32px", borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 28px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-faint)" }}>{relatedLabel}</span>
          {related.map((k) => {
            const r = dict.serviceDetail[k];
            return (
              <Link key={k} href={`/${locale}/${r.slug}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
                {r.overline} →
              </Link>
            );
          })}
          <Link href={`/${locale}/work`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
            {workLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck.** Run: `cd /c/Users/blaqu/dev/lechner-studios && npx tsc --noEmit`. Expected: PASS. If a field is reported possibly-undefined, confirm the optional guards (`sd.steps && …`, `sd.heroArtifact ?`) are present.

- [ ] **Step 3: Build.** Run: `cd /c/Users/blaqu/dev/lechner-studios && npm run build`. Expected: PASS (all routes prerender).

- [ ] **Step 4: Commit.**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git add src/components/ServiceDetail.tsx && git commit -m "feat(services): hybrid ServiceDetail renderer (image-forward ↔ structured)"
```

---

## Task 6: Verify, render, and ship

**Files:** none (verification + PR).

- [ ] **Step 1: Build + typecheck clean.** Run: `cd /c/Users/blaqu/dev/lechner-studios && npx tsc --noEmit && npm run build`. Expected: both PASS.

- [ ] **Step 2: Render each service page, light + dark, desktop + mobile.** Build a local prod server with `MAINTENANCE_MODE` unset and drive Playwright (throwaway script, delete after; do NOT commit), capturing `/de/webdesign`, `/de/apps-automation`, `/de/seo` (+ `/en/…`) at 1280 and 390, in light and dark (`colorScheme`). Confirm:
  - **web** is image-forward (hero screenshot in view, alternating method blocks, proof row);
  - **apps** shows hero → 3-step "how it works" → "what we build" checks → CTA (no artifact, no disclaimer, not empty);
  - **seo** shows the JSON-LD code block + "what we implement" checks;
  - **checkmarks are borderless** and tinted the right per-service pillar colour, **legible in BOTH light and dark**;
  - no text-walls remain; mobile collapses cleanly (single column).
  - If rendering is blocked in this environment, say so and rely on the Vercel preview (next step) for the visual gate — but typecheck/build MUST pass here.

- [ ] **Step 3: AA contrast spot-check** the `--svc-accent` overline + checkmarks (both modes), the seo code block, and text over the demo images. Fix any sub-3:1 mark by darkening/lightening that service's `--svc-accent` variant in `globals.css`.

- [ ] **Step 4: Honesty pass.** Grep the three `serviceDetail` entries: no numeric metrics/percentages, no "Maya"/vendor names, no "case study"/disclaimer text, seo copy is capability-not-results. All image `src` are local `/proof/*.webp` (zero third-party).

- [ ] **Step 5: Push + PR (do NOT merge — site stays in maintenance).**
```bash
cd /c/Users/blaqu/dev/lechner-studios && git push -u origin feat/service-pages-redesign
```
Then `gh pr create` against `main`, title `feat(site): service-page redesign — hybrid showcase (audit P1-1)`, body summarizing: the three text-walls → hybrid showcase (web image-forward, apps capability-only, seo structured+schema), borderless per-service pillar-accent checks, honesty (no metrics/Maya), AA both modes, self-hosted images. Ask the owner to eyeball the Vercel preview (light + dark, all three pages) before merge.

---

## Self-review

- **Spec coverage:** hybrid template → Task 5; dict shape → Task 1; CSS + `--svc-accent` → Task 2; web image-forward content → Task 3; apps capability-only + seo schema → Task 4; per-service pillar checks (AA both modes) → Task 2 (vars) + Task 5 (Check uses the var); borderless checks → Task 5 `.svc-incl-item` + `Check`; honesty (no metrics/Maya/disclaimer) → Task 4 + Task 6 Step 4; render light/dark/mobile + AA → Task 6. ✓
- **Placeholders:** none — full component code, full CSS, concrete dict values incl. the exact accent hexes and `included`/`steps`/`schema` strings. The only judgement left to the implementer is light prose polish on existing `sections[].p` (kept from current copy) and German `alt` text — concrete examples given. ✓
- **Type consistency:** `heroArtifact`/`steps`/`included`/`includedLabel`/`schemaArtifact`/`proofArtifact` field names + shapes match between Task 1 (type), Tasks 3–4 (content), and Task 5 (renderer). `Check` takes no prop (colour via CSS var). `serviceKey` className `svc-${serviceKey}` matches the `.svc-web/.svc-apps/.svc-seo` CSS. ✓
- **Risk flagged:** (a) Task 1 — if `serviceDetail` is inferred (no explicit type), the de/web object literal defines the shape and en must mirror exactly; the build is the type gate (noted in Task 1 Step 1). (b) `schemaArtifact.lines` use `dangerouslySetInnerHTML` — static author-controlled strings only (noted Task 4 Step 2). (c) rendering may be blocked locally → Vercel preview is the visual gate (noted Task 6 Step 2).
