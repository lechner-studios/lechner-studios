"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import EndorsementStamp from "./EndorsementStamp";

export default function Footer() {
  const { dict, locale } = useLanguage();
  const d = dict.footer;
  const year = new Date().getFullYear();

  const legalLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    color: "rgba(246,241,235,0.6)",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    textDecoration: "none",
    transition: "color 0.2s",
  };

  return (
    <footer className="lc-pad-footer" style={{
      background: "#1A1812",
      padding: "48px 48px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "32px",
      borderTop: "1px solid rgba(246,241,235,0.06)",
    }}>
      <EndorsementStamp variant="small" onDark text={d.endorsement} />

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
          color: "rgba(246,241,235,0.6)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textAlign: "center",
        }}>
          {d.tagline}
        </span>

        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "rgba(246,241,235,0.6)",
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
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#F6F1EB")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(246,241,235,0.6)")}
        >
          {d.impressum}
        </Link>
        <Link
          href={`/${locale}/privacy`}
          style={legalLinkStyle}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#F6F1EB")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(246,241,235,0.6)")}
        >
          {d.privacy}
        </Link>
      </div>
    </footer>
  );
}
