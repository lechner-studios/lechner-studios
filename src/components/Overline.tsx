import React from "react";

// Section eyebrow — the small mono-uppercase kicker above section headings.
// Captures the shared type treatment (IBM Plex Mono · 0.62rem · 600 · 0.28em ·
// uppercase). Colour and bottom-spacing vary per section, so they are props.
export default function Overline({
  children,
  color = "var(--accent)",
  marginBottom,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  marginBottom?: string | number;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.62rem",
        fontWeight: 600,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color,
        marginBottom,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
