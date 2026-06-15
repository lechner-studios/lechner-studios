"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import BrandMark from "./BrandMark";

export default function Footer() {
  const { dict, locale } = useLanguage();
  const d = dict.footer;
  const year = new Date().getFullYear();

  const legalLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    color: "var(--on-contrast-faint)",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    textDecoration: "none",
    transition: "color 0.2s",
  };

  return (
    <footer className="lc-pad-footer" style={{
      background: "var(--contrast-bg)",
      padding: "48px 48px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "32px",
      borderTop: "1px solid var(--contrast-border)",
    }}>
      {/* Parent-brand signature mark — the Alpine-pillar tiles + gold dot
          (favicon mark). NOT the "A Lechner Studios product" endorsement
          stamp: this is the umbrella/parent site, so it carries the mark
          alone, no product wording. */}
      <Link href={`/${locale}`} aria-label="Lechner Studios" style={{ display: "inline-flex", lineHeight: 0 }}>
        <BrandMark size={30} />
      </Link>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "32px",
        flexWrap: "wrap",
        width: "100%",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--on-contrast-faint)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textAlign: "center",
        }}>
          {d.tagline}
        </span>

        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--on-contrast-faint)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          © {year} · {d.rights}
        </span>
      </div>

      {/* Legal disclosure links — Impressum/Datenschutz live in the footer
          where they're expected and §5 ECG-findable. */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "28px",
        flexWrap: "wrap",
        width: "100%",
      }}>
        <Link
          href={`/${locale}/impressum`}
          style={legalLinkStyle}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--on-contrast)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--on-contrast-faint)")}
        >
          {d.impressum}
        </Link>
        <Link
          href={`/${locale}/privacy`}
          style={legalLinkStyle}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--on-contrast)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--on-contrast-faint)")}
        >
          {d.privacy}
        </Link>
      </div>
    </footer>
  );
}
