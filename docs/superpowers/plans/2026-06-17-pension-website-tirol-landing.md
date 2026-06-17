# Pension Website Tirol — SEO Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual, SEO-optimised, conversion-focused landing at `lechner-studios.at/[locale]/pension-website-tirol` that ranks for Pension/FeWo website searches, proves value with the live demo, and drives a qualified inquiry.

**Architecture:** A new App-Router route mirroring the existing service-page pattern, copy in `dictionaries.ts` (DE+EN lockstep), a dedicated `PensionLanding` client component (the generic `ServiceDetail` is too rigid for the custom blocks), a page-level JSON-LD component (Service + FAQPage + BreadcrumbList), and a `sitemap.ts` entry. No backend, no new deps.

**Tech Stack:** Next.js (App Router) + TypeScript, the repo's i18n dictionary + `pageMetadata` helper, brand CSS custom properties + self-hosted fonts (DSGVO). Repo: `lechner-studios`. Worktree/branch: **`feat/pension-landing`** at `C:/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing` (spec already committed here).

**Domain note on TDD:** A marketing page has no meaningful unit test; the repo's gates are `next build` + `eslint` + Playwright e2e. Verification = build/tsc/lint clean, route + sitemap presence, JSON-LD validity, DE/EN parity, AA contrast, demo link 200, no remote font calls. That's the applicable "test it" here.

**Working dir:** `C:/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing` — prefix every Bash call with `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing &&`. The fresh worktree has no `node_modules`; the first build task runs `npm ci`. Write files INTO the worktree.

**Pre-commit note:** this repo's currency guard blocks `€`. These are legitimate marketing/pricing strings — commit with `git commit --no-verify` (authorized). (A `docs/` allowlist exists on websites; lechner-studios could get the same, but src/ files like these would still need `--no-verify` since they're not docs.)

**Canonical numbers (match the Direktbucher SSOT `websites/docs/offers/Direktbucher.md`):** Basis €3.900 / Komplett €6.900 / Premium €9.900 · care €99 / €149 / €199 · live in 2 weeks · KMU.DIGITAL informational only.

**Honesty constraints (ADR-0038 A2):** no fabricated metrics, no testimonials (none exist); proof = the live demo, framed as "Beispiel/example we built". KMU.DIGITAL = informational. Self-hosted fonts only.

---

## File map
- **Modify** `src/i18n/dictionaries.ts` — add `pensionLanding` to `en` and `de` (Task 1).
- **Create** `src/components/PensionLanding.tsx` — the landing sections (Task 2).
- **Create** `src/components/PensionLandingJsonLd.tsx` — Service + FAQPage + BreadcrumbList (Task 3).
- **Create** `src/app/(site)/[locale]/pension-website-tirol/page.tsx` — the route (Task 4).
- **Modify** `src/app/sitemap.ts` — add the route (Task 4).

---

## Task 1: Copy — `pensionLanding` dictionary (EN + DE)

`Dictionary = typeof dictionaries.en` and `de` is not structurally checked, so the key MUST be added to BOTH locales. Insert in each locale near the other page sections (e.g. after the `serviceDetail` object). DE is the SEO-primary; EN targets English keywords. Refine prose with the `copywriting`/`brand-voice` skills if needed, but keep these strings as the baseline and keep the numbers exact.

**Files:** Modify `src/i18n/dictionaries.ts`

- [ ] **Step 1: Add the EN block** (inside the `en` object):
```ts
    pensionLanding: {
      metaTitle: "Guesthouse Website Tyrol — direct bookings, not commission",
      metaDescription:
        "A custom website for your Tyrol guesthouse or holiday apartment — with direct booking instead of costly OTA commission. Live in 2 weeks.",
      hero: {
        overline: "GUESTHOUSE & HOLIDAY LET · TYROL",
        headline: "A website for your guesthouse that books direct.",
        sub: "Stop paying ~15% commission to booking portals. We build you a fast website with direct booking — live in 2 weeks.",
        ctaLabel: "Request a quote",
      },
      value: {
        heading: "Every portal booking costs you commission.",
        body: "Booking portals take around 15% of every booking. On €80,000 of portal revenue that's roughly €12,000 a year. Your own direct-booking website wins those bookings — and the margin — back.",
        note: "Work out your own commission in the demo below.",
      },
      demo: {
        heading: "Here's what that looks like — a real example.",
        body: "We built a complete guesthouse website as an example: rooms, availability, location, contact — including a commission calculator. See how yours could look.",
        linkLabel: "View the example site →",
        note: "Example design — not a real business.",
      },
      offer: {
        heading: "Three packages — you choose.",
        intro: "From a fast start to the full direct-booking machine. All prices net (small-business scheme, no VAT).",
        note: "Hosting, business email and maintenance are included in the care plan. Domain first year included.",
        ctaLabel: "Request an offer",
        tiers: [
          { name: "Basis", desc: "5 pages, inquiry form, commission calculator. Live in 2 weeks." },
          { name: "Komplett", desc: "Up to 8 pages, real booking engine, DE/EN/IT, 360° tour, pro photos.", badge: "Most popular" },
          { name: "Premium", desc: "Everything in Komplett + channel-manager sync, video, 12-month growth program." },
        ],
      },
      faq: {
        heading: "Frequently asked",
        items: [
          { q: "What does a professional website for a guesthouse or holiday apartment in Tyrol cost?", a: "Our productized Direktbucher packages start at €3,900 (Basis); the most popular Komplett tier is €6,900. Fixed price, no hidden consulting fees. Depending on your portal commission, the investment often pays for itself within the first few months." },
          { q: "How exactly does your website save the ~15% commission from Booking.com or Expedia?", a: "Through your own fast website with an integrated direct-booking engine. When a guest books direct, you pay 0% portal commission. Portals like Booking.com stay useful as a discovery channel — your website turns first-time guests into recurring direct bookers." },
          { q: "Can I apply for a subsidy (e.g. KMU.DIGITAL)?", a: "Possibly — digitalisation projects for Austrian businesses often qualify for funding like KMU.DIGITAL. You receive a clean, itemised offer/invoice from us as documentation. You submit the application yourself; we are not a registered management consultancy, and a funding approval is not part of our offer." },
          { q: "How long until my website goes live?", a: "For Basis and Komplett we typically go from kickoff to launch in 2 weeks. We don't rely on heavy WordPress themes or page builders — just a lean, fast custom build." },
          { q: "Can I adjust room availability, prices and seasons myself?", a: "Yes. Your website connects to your existing booking system or channel manager (e.g. Feratel) — the exact scope is agreed per project. You keep control of availability and seasonal pricing day to day, no developer needed." },
        ],
      },
      qualifier: {
        heading: "Before we talk — one quick question.",
        question: "What do you estimate your annual commission to booking portals (Booking.com, Airbnb, etc.) to be?",
        options: ["Under €2,500 / year", "€2,500–€7,500 / year", "Over €7,500 / year"],
        ctaLabel: "Continue to inquiry →",
      },
      cta: {
        heading: "More direct bookings, less commission.",
        body: "Tell us briefly about your guesthouse — we'll come back with a concrete proposal.",
        button: "Discuss your project",
      },
      more: { lead: "More on our", web: "custom web design", and: "and", seo: "local SEO", tail: "." },
    },
```

- [ ] **Step 2: Add the DE block** (inside the `de` object):
```ts
    pensionLanding: {
      metaTitle: "Pension-Website Tirol — direkt buchen statt Provision zahlen",
      metaDescription:
        "Maßgeschneiderte Website für Ihre Pension oder Ferienwohnung in Tirol — mit eigener Direktbuchung statt teurer Portal-Provision. Live in 2 Wochen.",
      hero: {
        overline: "PENSION & FERIENWOHNUNG · TIROL",
        headline: "Eine Website für Ihre Pension, die direkt bucht.",
        sub: "Schluss mit ~15 % Provision an Buchungsportale. Wir bauen Ihnen eine schnelle, eigene Website mit Direktbuchung — live in 2 Wochen.",
        ctaLabel: "Unverbindlich anfragen",
      },
      value: {
        heading: "Jede Portal-Buchung kostet Sie Provision.",
        body: "Buchungsportale nehmen rund 15 % von jeder Buchung. Bei 80.000 € Portal-Umsatz sind das etwa 12.000 € pro Jahr. Eine eigene Direktbuchungs-Website holt diese Buchungen — und die Marge — zurück.",
        note: "Im Beispiel unten rechnen Sie Ihre eigene Provision aus.",
      },
      demo: {
        heading: "So sieht das aus — ein echtes Beispiel.",
        body: "Wir haben eine vollständige Pensions-Website als Beispiel gebaut: Zimmer, Verfügbarkeit, Lage, Kontakt — inklusive Provisionsrechner. Schauen Sie sich an, wie Ihre aussehen könnte.",
        linkLabel: "Beispiel-Website ansehen →",
        note: "Beispielentwurf — kein echter Betrieb.",
      },
      offer: {
        heading: "Drei Pakete — Sie wählen.",
        intro: "Vom schnellen Einstieg bis zur kompletten Direktbuchungs-Maschine. Alle Preise netto (Kleinunternehmer, keine USt).",
        note: "Hosting, Geschäfts-E-Mail und Wartung sind im Wartungspaket enthalten. Domain 1. Jahr inklusive.",
        ctaLabel: "Angebot anfordern",
        tiers: [
          { name: "Basis", desc: "5 Seiten, Anfrageformular, Provisionsrechner. Live in 2 Wochen." },
          { name: "Komplett", desc: "Bis zu 8 Seiten, echte Buchungsmaschine, DE/EN/IT, 360°-Tour, Profi-Fotos.", badge: "Beliebteste" },
          { name: "Premium", desc: "Alles aus Komplett + Channel-Manager-Sync, Video, 12-Monats-Wachstumsprogramm." },
        ],
      },
      faq: {
        heading: "Häufige Fragen",
        items: [
          { q: "Was kostet eine professionelle Website für eine Pension oder Ferienwohnung in Tirol?", a: "Unsere produktisierten Direktbucher-Pakete starten bei 3.900 € (Basis); das beliebteste Komplett-Paket liegt bei 6.900 €. Festpreis statt langer Beratungsgespräche mit verstecktem Honorar. Je nach Portal-Provision amortisiert sich die Investition oft schon in den ersten Monaten." },
          { q: "Wie genau spart Ihre Website die ~15 % Provision von Booking.com oder Expedia?", a: "Durch eine eigene, schnelle Website mit integrierter Direktbuchung. Bucht ein Gast direkt bei Ihnen, zahlen Sie 0 % Portal-Provision. Portale wie Booking.com bleiben als Einstiegskanal nützlich — Ihre Website macht aus Erstgästen wiederkehrende Direktbucher." },
          { q: "Kann ich eine Förderung (z. B. KMU.DIGITAL) beantragen?", a: "Möglicherweise — Digitalisierungsprojekte österreichischer Betriebe qualifizieren sich oft für Förderungen wie KMU.DIGITAL. Sie erhalten von uns ein sauber aufgeschlüsseltes Angebot bzw. eine Rechnung als Unterlage. Den Antrag stellen Sie eigenständig; wir sind keine registrierte Unternehmensberatung, und eine Förderzusage ist nicht Teil unseres Angebots." },
          { q: "Wie lange dauert die Umsetzung, bis meine Website live geht?", a: "Für Basis und Komplett gehen wir in der Regel in 2 Wochen von Kickoff bis Launch. Wir setzen nicht auf schwere WordPress-Themes oder Baukästen, sondern auf eine schlanke, schnelle Eigenentwicklung." },
          { q: "Kann ich Zimmerverfügbarkeiten, Preise und Saisonen selbst anpassen?", a: "Ja. Ihre Website lässt sich mit Ihrem bestehenden Buchungssystem bzw. Channel-Manager (z. B. Feratel) verbinden — den konkreten Umfang stimmen wir pro Projekt ab. Verfügbarkeiten und Saisonpreise behalten Sie selbst in der Hand, ohne Entwickler für den Alltag." },
        ],
      },
      qualifier: {
        heading: "Bevor wir sprechen — eine kurze Frage.",
        question: "Wie hoch schätzen Sie Ihre jährlichen Provisionszahlungen an Buchungsportale (Booking.com, Airbnb etc.)?",
        options: ["Unter 2.500 € / Jahr", "2.500 – 7.500 € / Jahr", "Über 7.500 € / Jahr"],
        ctaLabel: "Weiter zur Anfrage →",
      },
      cta: {
        heading: "Mehr Direktbuchungen, weniger Provision.",
        body: "Erzählen Sie uns kurz von Ihrer Pension — wir melden uns mit einem konkreten Vorschlag.",
        button: "Projekt besprechen",
      },
      more: { lead: "Mehr zu unserer", web: "maßgeschneiderten Webentwicklung", and: "und", seo: "lokalem SEO", tail: "." },
    },
```

- [ ] **Step 3: Typecheck**

Run: `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && grep -c "pensionLanding: {" src/i18n/dictionaries.ts` → must be `2`. (Full `tsc` runs after the component exists, in Task 2.)

- [ ] **Step 4: Commit**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && git add src/i18n/dictionaries.ts && git commit --no-verify -m "copy: pensionLanding dictionary (DE+EN)"
```

---

## Task 2: `PensionLanding` component

A client component reading `dict.pensionLanding`, styled with the brand CSS vars used by `Work.tsx` (`var(--text)`, `var(--text-muted)`, `var(--accent)`, `var(--bg)`, `var(--bg-alt)`, `var(--border)`, `var(--font-display)`, `var(--font-mono)`), using `Reveal`. The qualifier is a small `useState` interaction that builds the `/contact` href with context. Tier prices are constants here (locale-independent); blurbs come from the dict. Cross-links go to the locale-prefixed `/webdesign` and `/seo`.

**Files:** Create `src/components/PensionLanding.tsx`

- [ ] **Step 1: Write the component**
```tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

const DEMO_URL = "https://demos.lechner-studios.at/pension";
const TIER_PRICES = ["€3.900", "€6.900", "€9.900"];
const TIER_CARE = ["€99", "€149", "€199"];

export default function PensionLanding() {
  const { dict, locale } = useLanguage();
  const d = dict.pensionLanding;
  const [pick, setPick] = useState<number | null>(null);
  const PROVISION = ["low", "mid", "high"];

  const contactHref =
    `/${locale}/contact?betreff=` +
    encodeURIComponent("Pension-Website") +
    (pick !== null ? `&provision=${PROVISION[pick]}` : "");

  const wrap: React.CSSProperties = { maxWidth: "1100px", margin: "0 auto" };
  const section: React.CSSProperties = {
    padding: "96px 48px",
    borderTop: "1px solid var(--border)",
  };
  const overline: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "12px",
  };
  const h2: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    color: "var(--text)",
    marginBottom: "20px",
    maxWidth: "24ch",
  };
  const body: React.CSSProperties = {
    fontSize: "1.05rem",
    color: "var(--text-muted)",
    lineHeight: 1.75,
    maxWidth: "62ch",
  };
  const cta: React.CSSProperties = {
    display: "inline-block",
    marginTop: "28px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--bg)",
    background: "var(--text)",
    padding: "14px 24px",
    borderRadius: "2px",
    textDecoration: "none",
  };

  return (
    <>
      {/* Hero */}
      <section className="lc-pad-section" style={{ ...section, borderTop: "none", paddingTop: "120px", background: "var(--bg)" }}>
        <div style={wrap}>
          <Reveal>
            <p style={overline}>{d.hero.overline}</p>
            <h1 style={{ ...h2, fontSize: "clamp(2.2rem, 5vw, 3.6rem)", maxWidth: "18ch" }}>{d.hero.headline}</h1>
            <p style={{ ...body, fontSize: "1.15rem" }}>{d.hero.sub}</p>
            <Link href={contactHref} style={cta}>{d.hero.ctaLabel}</Link>
          </Reveal>
        </div>
      </section>

      {/* Value */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.value.heading}</h2>
            <p style={body}>{d.value.body}</p>
            <p style={{ ...body, fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginTop: "16px" }}>{d.value.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Live demo proof */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.demo.heading}</h2>
            <p style={body}>{d.demo.body}</p>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" style={cta}>{d.demo.linkLabel}</a>
            <p style={{ ...body, fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginTop: "14px" }}>{d.demo.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Offer — 3 tiers */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.offer.heading}</h2>
            <p style={{ ...body, marginBottom: "40px" }}>{d.offer.intro}</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {d.offer.tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div
                  style={{
                    border: t.badge ? "2px solid var(--accent)" : "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "28px 24px",
                    height: "100%",
                    background: "var(--bg)",
                  }}
                >
                  {t.badge && (
                    <span style={{ ...overline, color: "var(--accent)", marginBottom: "10px" }}>{t.badge}</span>
                  )}
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--text)", marginBottom: "6px" }}>{t.name}</h3>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "var(--text)", marginBottom: "4px" }}>{TIER_PRICES[i]}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "16px" }}>+ {TIER_CARE[i]}/Monat</p>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p style={{ ...body, fontSize: "0.85rem", marginTop: "24px" }}>{d.offer.note}</p>
            <Link href={contactHref} style={cta}>{d.offer.ctaLabel}</Link>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.faq.heading}</h2>
          </Reveal>
          <div style={{ maxWidth: "760px" }}>
            {d.faq.items.map((it, i) => (
              <Reveal key={it.q} delay={i * 60}>
                <details style={{ borderBottom: "1px solid var(--border)", padding: "18px 0" }}>
                  <summary style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--text)", cursor: "pointer" }}>{it.q}</summary>
                  <p style={{ ...body, marginTop: "12px" }}>{it.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p style={{ ...body, fontSize: "0.9rem", marginTop: "28px" }}>
              {d.more.lead}{" "}
              <Link href={`/${locale}/webdesign`} style={{ color: "var(--accent)" }}>{d.more.web}</Link>{" "}
              {d.more.and}{" "}
              <Link href={`/${locale}/seo`} style={{ color: "var(--accent)" }}>{d.more.seo}</Link>{d.more.tail}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Qualifier + CTA */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.cta.heading}</h2>
            <p style={{ ...body, marginBottom: "28px" }}>{d.cta.body}</p>
            <p style={{ ...overline, color: "var(--text-muted)" }}>{d.qualifier.question}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "12px 0 8px" }}>
              {d.qualifier.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPick(i)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    padding: "10px 16px",
                    borderRadius: "2px",
                    cursor: "pointer",
                    border: "1px solid var(--border)",
                    background: pick === i ? "var(--text)" : "transparent",
                    color: pick === i ? "var(--bg)" : "var(--text-muted)",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <Link href={contactHref} style={cta}>{d.cta.button}</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
```
Note: confirm `useLanguage()` returns `{ dict, locale }` (it does — `Work.tsx`/`page.tsx` use `dict`; `locale` is provided by `LanguageProvider`). If `locale` isn't on the hook, read it from `dict`/context per the repo's actual shape and adjust the `contactHref`/links.

- [ ] **Step 2: Typecheck**
Run: `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && npm ci >/tmp/ls-ci.log 2>&1 && npx tsc --noEmit && echo TSC_CLEAN`
Expected: `TSC_CLEAN` (confirms dict fields + hook shape resolve). If `useLanguage` lacks `locale`, fix per the repo's context API and re-run.

- [ ] **Step 3: Commit**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && git add src/components/PensionLanding.tsx && git commit --no-verify -m "feat: PensionLanding landing component"
```

---

## Task 3: JSON-LD — Service + FAQPage + BreadcrumbList

**Files:** Create `src/components/PensionLandingJsonLd.tsx`

- [ ] **Step 1: Write the component**
```tsx
import React from "react";
import { dictionaries } from "../i18n/dictionaries";
import type { Locale } from "../i18n/config";

const BASE = "https://lechner-studios.at";

export default function PensionLandingJsonLd({ locale }: { locale: Locale }) {
  const d = dictionaries[locale].pensionLanding;
  const url = `${BASE}/${locale}/pension-website-tirol`;
  const crumbName = locale === "de" ? "Pension-Website Tirol" : "Guesthouse Website Tyrol";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: d.metaTitle,
        description: d.metaDescription,
        serviceType: "Web design & automation",
        provider: { "@id": `${BASE}#organization` },
        areaServed: { "@type": "AdministrativeArea", name: "Tirol" },
        url,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: "3900",
          highPrice: "9900",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "de" ? "Start" : "Home", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Webdesign", item: `${BASE}/${locale}/webdesign` },
          { "@type": "ListItem", position: 3, name: crumbName, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
```

- [ ] **Step 2: Typecheck** — `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && npx tsc --noEmit && echo TSC_CLEAN`. Expected `TSC_CLEAN`.

- [ ] **Step 3: Commit**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && git add src/components/PensionLandingJsonLd.tsx && git commit --no-verify -m "feat: Pension landing JSON-LD (Service + FAQ + Breadcrumb)"
```

---

## Task 4: Route + sitemap

**Files:** Create `src/app/(site)/[locale]/pension-website-tirol/page.tsx`; Modify `src/app/sitemap.ts`

- [ ] **Step 1: Write the route** (mirrors `webdesign/page.tsx`):
```tsx
import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../lib/seo";
import Nav from "../../../../components/Nav";
import PensionLanding from "../../../../components/PensionLanding";
import PensionLandingJsonLd from "../../../../components/PensionLandingJsonLd";
import Footer from "../../../../components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  return pageMetadata(
    locale,
    "/pension-website-tirol",
    dict.pensionLanding.metaTitle,
    dict.pensionLanding.metaDescription,
  );
}

export default async function PensionWebsiteTirolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  return (
    <LanguageProvider locale={locale}>
      <a href="#main" className="skip-link">
        {dictionaries[locale].a11y.skipLink}
      </a>
      <PensionLandingJsonLd locale={locale} />
      <Nav />
      <main id="main" style={{ minHeight: "100vh" }}>
        <PensionLanding />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
```

- [ ] **Step 2: Add the sitemap route.** In `src/app/sitemap.ts`, find:
```ts
const routes = ["", "/work", "/about", "/blog", "/contact", "/start", "/webdesign", "/apps-automation", "/seo", "/impressum", "/privacy"] as const;
```
Replace with (adds `/pension-website-tirol`):
```ts
const routes = ["", "/work", "/about", "/blog", "/contact", "/start", "/webdesign", "/apps-automation", "/seo", "/pension-website-tirol", "/impressum", "/privacy"] as const;
```

- [ ] **Step 3: Build + lint**
Run: `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && npm run build >/tmp/ls-build.log 2>&1 && tail -4 /tmp/ls-build.log && npx tsc --noEmit && npm run lint 2>&1 | tail -5`
Expected: build succeeds and generates `/de/pension-website-tirol` + `/en/pension-website-tirol`; tsc clean; no NEW lint errors in the new files (pre-existing unrelated lint warnings may exist — confirm none are in PensionLanding*/page/sitemap).

- [ ] **Step 4: Commit**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && git add "src/app/(site)/[locale]/pension-website-tirol/page.tsx" src/app/sitemap.ts && git commit --no-verify -m "feat: /pension-website-tirol route + sitemap entry"
```

---

## Task 5: Verification & ship

**Files:** none (verification + PR).

- [ ] **Step 1: Build / type / lint** — `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && npm run build && npx tsc --noEmit && npm run lint 2>&1 | tail -5`. All clean / no new errors.

- [ ] **Step 2: Route + sitemap presence**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && \
grep -q "/de/pension-website-tirol" /tmp/ls-build.log && echo "route built ✓" ; \
grep -c "pension-website-tirol" src/app/sitemap.ts
```
Expected: route built; sitemap count ≥1.

- [ ] **Step 3: DE/EN parity + numbers**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && \
grep -c "pensionLanding: {" src/i18n/dictionaries.ts && \
grep -c "3.900\|6.900\|9.900" src/components/PensionLanding.tsx
```
Expected: dict count `2`; tier prices present in the component.

- [ ] **Step 4: Honesty + DSGVO + a11y audit (surface-audit skill)**
Render `/de/pension-website-tirol` and `/en/pension-website-tirol` (dev server or Playwright screenshot). Confirm: AA contrast on all sections incl. tier cards + qualifier buttons (selected = text-bg invert) + dark mode; the demo link points to `https://demos.lechner-studios.at/pension` and returns 200 (`curl -sS -o /dev/null -w "%{http_code}" https://demos.lechner-studios.at/pension` → 200); no remote font/CDN requests in the network panel; FAQ `<details>` keyboard-accessible; no fabricated metric/testimonial present; KMU.DIGITAL answer is informational only.

- [ ] **Step 5: JSON-LD validity**
View page source (or `curl` the dev route) and confirm one `application/ld+json` from the page with `@type` Service, FAQPage (5 questions), and BreadcrumbList; valid JSON. (Optional: paste into Google Rich Results Test.)

- [ ] **Step 6: Push + PR** — use `superpowers:finishing-a-development-branch`.
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/pension-landing && git push && gh pr create --base main --head feat/pension-landing --title "feat: Pension Website Tirol SEO landing" --body "Bilingual (DE-optimised) SEO landing at /[locale]/pension-website-tirol — hero, Provisionsrechner value, live-demo proof (demos.lechner-studios.at/pension), Direktbucher tiers (€3.900/€6.900/€9.900), FAQ, light qualifier → /contact. Adds Service + FAQPage + BreadcrumbList JSON-LD, sitemap entry, pillar cross-links. Honest: no fabricated metrics/testimonials; KMU.DIGITAL informational; self-hosted fonts. Spec: docs/superpowers/specs/2026-06-17-pension-website-tirol-landing-design.md.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Self-review
- **Spec coverage:** hero/value/demo/offer/FAQ/qualifier+CTA → Task 1 (copy) + Task 2 (component); JSON-LD (Service+FAQ+Breadcrumb) → Task 3; route + sitemap → Task 4; SEO meta via `pageMetadata` → Task 4 route; cross-links (4b) + live-demo proof (1a) + light qualifier (3a) → Task 2; honesty/DSGVO/AA + demo-200 → Task 5. Backlog items remain in the spec (out of scope). ✓
- **Placeholders:** copy strings are concrete; the only deferred polish is optional prose refinement via copywriting (numbers/structure fixed). No TBDs. ✓
- **Consistency:** `pensionLanding` fields used in the component/JSON-LD match the dict definitions (hero.overline, value.*, demo.*, offer.tiers[].{name,desc,badge}, faq.items[].{q,a}, qualifier.{question,options}, cta.*, more.*); tier prices/care match the Direktbucher SSOT; route path string identical across page, metadata, sitemap, JSON-LD. One flagged unknown: `useLanguage()` must expose `locale` — Task 2 Step 1 note + Step 2 tsc catch it. ✓
