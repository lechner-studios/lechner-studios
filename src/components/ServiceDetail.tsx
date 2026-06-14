"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

type ServiceKey = "web" | "apps" | "seo";

const ORDER: ServiceKey[] = ["web", "apps", "seo"];

export default function ServiceDetail({ serviceKey }: { serviceKey: ServiceKey }) {
  const { dict, locale } = useLanguage();
  const sd = dict.serviceDetail[serviceKey];

  const related = ORDER.filter((k) => k !== serviceKey);
  const relatedLabel = locale === "de" ? "Weitere Leistungen" : "More services";
  const workLabel = locale === "de" ? "Arbeiten ansehen" : "See the work";

  return (
    <section
      className="lc-pad-section"
      style={{
        background: "var(--bg)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Reveal style={{ maxWidth: "820px", margin: "0 auto" }}>
        {/* Overline */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "2rem",
          }}
        >
          {sd.overline}
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            marginBottom: "32px",
            fontStyle: "italic",
          }}
        >
          {sd.headline}
        </h1>

        {/* Intro */}
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            maxWidth: "620px",
            marginBottom: "72px",
          }}
        >
          {sd.intro}
        </p>

        {/* Methodology sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px", marginBottom: "72px" }}>
          {sd.sections.map((sec, i) => (
            <div key={i}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: "12px",
                  lineHeight: 1.25,
                  letterSpacing: "0.005em",
                }}
              >
                {sec.h}
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  maxWidth: "620px",
                }}
              >
                {sec.p}
              </p>
            </div>
          ))}
        </div>

        {/* Proof */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "1.15rem",
            color: "var(--text)",
            lineHeight: 1.7,
            maxWidth: "620px",
            borderLeft: "3px solid var(--accent)",
            paddingLeft: "24px",
            marginBottom: "64px",
          }}
        >
          {sd.proof}
        </p>

        {/* CTA — accent-outlined, matches ContactCta */}
        <Link
          href={`/${locale}/start`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
            borderRadius: "2px",
            padding: "15px 30px",
            textDecoration: "none",
            display: "inline-block",
            transition: "background 0.25s, color 0.25s, border-color 0.25s",
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.background = "var(--accent)";
            t.style.color = "var(--bg)";
            t.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.background = "transparent";
            t.style.color = "var(--accent)";
            t.style.borderColor = "color-mix(in srgb, var(--accent) 50%, transparent)";
          }}
        >
          {sd.ctaLabel} →
        </Link>

        {/* Related / internal links */}
        <div
          style={{
            marginTop: "80px",
            paddingTop: "32px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "8px 28px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
            }}
          >
            {relatedLabel}
          </span>
          {related.map((k) => {
            const r = dict.serviceDetail[k];
            return (
              <Link
                key={k}
                href={`/${locale}/${r.slug}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                {r.overline} →
              </Link>
            );
          })}
          <Link
            href={`/${locale}/work`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            {workLabel} →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
