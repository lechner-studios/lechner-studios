"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import BrandMark from "./BrandMark";

// The studio's own PUBLIC business address — the same hallo@ inbox published on
// the Impressum and in the Organization schema. Kept here (not in the shared
// dictionary) so the Layer-0 PII guard stays active over all site copy; this
// component is exempted in .layer0-allow.
const EMAIL = "hallo@lechner-studios.at";
// The studio's single contact line (a mobile). Personal, but the only number —
// listed on purpose (owner decision 2026-07-17, retiring the ai-brain 00g
// "omitted by choice" note). Display + tel: forms kept in sync with the
// Impressum and the schema `telephone` for NAP consistency.
const PHONE_DISPLAY = "+43 664 153 4653";
const PHONE_HREF = "+436641534653";

const contactLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  color: "var(--on-contrast)",
  letterSpacing: "0.08em",
  textDecoration: "none",
  borderBottom: "1px solid var(--contrast-border)",
  paddingBottom: "2px",
  transition: "border-color 0.2s",
};

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

      {/* Direct contact — a low-friction mailto for visitors who'd rather not
          use the form. Text stays var(--on-contrast) (AA on the dark footer);
          only the underline shifts on hover. */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={`mailto:${EMAIL}`}
          style={contactLinkStyle}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--on-contrast)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--contrast-border)")}
        >
          {EMAIL}
        </a>
        <a
          href={`tel:${PHONE_HREF}`}
          style={contactLinkStyle}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--on-contrast)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--contrast-border)")}
        >
          {PHONE_DISPLAY}
        </a>
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
