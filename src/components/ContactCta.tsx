"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

export default function ContactCta() {
  const { dict, locale } = useLanguage();
  const d = dict.contact;

  return (
    <section
      className="lc-pad-section"
      style={{
        background: "#15171A",
        padding: "120px 48px",
        textAlign: "center",
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
            color: "#8FA8C5",
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
            color: "#F7F8F8",
            marginBottom: "1.5rem",
          }}
        >
          {d.headline}
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "rgba(247,248,248,0.7)",
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 2.5rem",
          }}
        >
          {d.ctaLine}
        </p>
        <Link
          href={`/${locale}/contact`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8FA8C5",
            border: "1px solid rgba(143,168,197,0.5)",
            borderRadius: "2px",
            padding: "15px 30px",
            textDecoration: "none",
            display: "inline-block",
            transition: "background 0.25s, color 0.25s, border-color 0.25s",
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.background = "#8FA8C5";
            t.style.color = "#15171A";
            t.style.borderColor = "#8FA8C5";
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.background = "transparent";
            t.style.color = "#8FA8C5";
            t.style.borderColor = "rgba(143,168,197,0.5)";
          }}
        >
          {dict.hero.ctaPrimary} →
        </Link>
      </Reveal>
    </section>
  );
}
