// src/components/LegalStyles.ts
//
// Shared CSSProperties consts for the four per-locale legal components
// (LegalImpressumDE/EN, LegalPrivacyDE/EN). Extracted from the prior
// dual-language Impressum + Privacy pages so both halves of each page
// stay visually identical without copy-pasted style blocks.

import type { CSSProperties } from "react";

export const pageStyle: CSSProperties = {
  background: "#F7F8F8",
  minHeight: "100vh",
  padding: "120px 48px",
  color: "#15171A",
};

export const containerStyle: CSSProperties = {
  maxWidth: "780px",
  margin: "0 auto",
};

export const overlineStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  fontWeight: 600,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "#254268",
  marginBottom: "2rem",
};

export const headlineStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
  fontWeight: 300,
  lineHeight: 0.98,
  letterSpacing: "-0.03em",
  color: "#15171A",
  marginBottom: "16px",
  fontStyle: "italic",
};

export const subStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.95rem",
  color: "#5B6168",
  lineHeight: 1.7,
  marginBottom: "64px",
  maxWidth: "620px",
};

export const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#5B6168",
  marginBottom: "8px",
};

export const sectionValueStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "1rem",
  color: "#15171A",
  lineHeight: 1.8,
  marginBottom: "32px",
};

export const linkStyle: CSSProperties = {
  color: "#15171A",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgba(21,23,26,0.25)",
};

export const backLinkStyle: CSSProperties = {
  display: "inline-block",
  marginTop: "48px",
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#5B6168",
  textDecoration: "none",
};

// Privacy-page consts — shared between LegalPrivacyDE and LegalPrivacyEN.
export const h3Style: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "1.4rem",
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
  color: "#15171A",
  marginTop: "40px",
  marginBottom: "12px",
};

export const bodyStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "1rem",
  color: "#15171A",
  lineHeight: 1.8,
  marginBottom: "16px",
};

export const mutedStyle: CSSProperties = {
  ...bodyStyle,
  color: "#5B6168",
};

export const listStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "1rem",
  color: "#15171A",
  lineHeight: 1.8,
  paddingLeft: "1.25rem",
  marginBottom: "16px",
};
