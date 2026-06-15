"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

export default function FoundationPartner() {
  const { dict, locale } = useLanguage();
  const d = dict.foundation;

  return (
    <section
      className="lc-pad-section"
      style={{
        background: "var(--bg-alt)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Reveal style={{ maxWidth: "760px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "1.5rem",
          }}
        >
          {d.overline}
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: "1.5rem",
          }}
        >
          {d.headline}
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            maxWidth: "60ch",
            marginBottom: "2.5rem",
          }}
        >
          {d.body}
        </p>
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
          {dict.hero.ctaPrimary} →
        </Link>
      </Reveal>
    </section>
  );
}
