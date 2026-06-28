"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import type { ServiceDetailEntry } from "../i18n/dictionaries";
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <span className="svc-shot"><img src={src} alt={alt} loading="lazy" decoding="async" /></span>
      {caption ? <figcaption className="svc-shot-cap">{caption}</figcaption> : null}
    </figure>
  );
}

export default function ServiceDetail({ serviceKey }: { serviceKey: ServiceKey }) {
  const { dict, locale } = useLanguage();
  const sd: ServiceDetailEntry = dict.serviceDetail[serviceKey];

  const related = ORDER.filter((k) => k !== serviceKey);
  const relatedLabel = locale === "de" ? "Weitere Leistungen" : "More services";
  const workLabel = locale === "de" ? "Arbeiten ansehen" : "See the work";
  const checkLabel = locale === "de" ? "Website-Check" : "Website-Check";

  const CTA_REST_BORDER = "color-mix(in srgb, var(--accent) 50%, transparent)";
  const ctaStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 600,
    letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)",
    border: `1px solid ${CTA_REST_BORDER}`,
    borderRadius: "2px", padding: "15px 30px", textDecoration: "none",
    display: "inline-block", transition: "background 0.25s, color 0.25s, border-color 0.25s",
  };
  const onCtaEnter = (e: React.MouseEvent) => { const t = e.currentTarget as HTMLElement; t.style.background = "var(--accent)"; t.style.color = "var(--bg)"; t.style.borderColor = "var(--accent)"; };
  const onCtaLeave = (e: React.MouseEvent) => { const t = e.currentTarget as HTMLElement; t.style.background = "transparent"; t.style.color = "var(--accent)"; t.style.borderColor = CTA_REST_BORDER; };

  return (
    <section
      className={`lc-pad-section svc-${serviceKey}`}
      style={{ background: "var(--bg)", padding: "120px 48px", borderTop: "1px solid var(--border)" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* 1 · Hero */}
        <Reveal>
          <div className={sd.heroArtifact ? "svc-hero" : undefined} style={{ marginBottom: "72px" }}>
            <div>
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
              <div className="svc-code" aria-hidden="true" dangerouslySetInnerHTML={{ __html: sd.schemaArtifact.lines.join("<br>") }} />
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

        {/* Proof quote */}
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

        {/* Related links */}
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
          <Link href={`/${locale}/website-check`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
            {checkLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
