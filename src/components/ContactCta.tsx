"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

// Homepage contact — low-friction first. Three easy channels (message form /
// email / WhatsApp); the bigger "Projekt besprechen" brief (/start) is demoted
// to a quiet secondary nudge for people who already know exactly what they want.
export default function ContactCta() {
  const { dict, locale } = useLanguage();
  const d = dict.contact;

  const optStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--accent)",
    border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)",
    borderRadius: "2px",
    padding: "15px 28px",
    textDecoration: "none",
    display: "inline-block",
    transition: "background 0.25s, color 0.25s, border-color 0.25s",
  };
  const enter = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    t.style.background = "var(--accent)";
    t.style.color = "var(--bg)";
    t.style.borderColor = "var(--accent)";
  };
  const leave = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    t.style.background = "transparent";
    t.style.color = "var(--accent)";
    t.style.borderColor = "color-mix(in srgb, var(--accent) 45%, transparent)";
  };

  return (
    <section
      className="lc-pad-section"
      style={{ background: "var(--bg-alt)", padding: "120px 48px", textAlign: "center" }}
    >
      <Reveal style={{ maxWidth: "760px", margin: "0 auto" }}>
        <Overline marginBottom="1.5rem">{d.overline}</Overline>
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
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 2.5rem",
          }}
        >
          {d.ctaLine}
        </p>

        {/* Low-friction channels */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href={`/${locale}/contact`} style={optStyle} onMouseEnter={enter} onMouseLeave={leave}>
            {d.optMessage}
          </Link>
          <a href={`mailto:${d.email}`} style={optStyle} onMouseEnter={enter} onMouseLeave={leave}>
            {d.optEmail}
          </a>
          <a
            href={`https://wa.me/${d.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            style={optStyle}
            onMouseEnter={enter}
            onMouseLeave={leave}
          >
            {d.optWhatsapp}
          </a>
        </div>

        {/* Secondary — the bigger brief, for those who already know */}
        <Link
          href={`/${locale}/start`}
          style={{
            display: "inline-block",
            marginTop: "2.25rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.66rem",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
            textDecoration: "none",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "3px",
            transition: "color 0.25s, border-color 0.25s",
          }}
          onMouseEnter={(e) => { const t = e.currentTarget as HTMLElement; t.style.color = "var(--text)"; t.style.borderColor = "var(--accent)"; }}
          onMouseLeave={(e) => { const t = e.currentTarget as HTMLElement; t.style.color = "var(--text-faint)"; t.style.borderColor = "var(--border)"; }}
        >
          {d.startNudge}
        </Link>
      </Reveal>
    </section>
  );
}
