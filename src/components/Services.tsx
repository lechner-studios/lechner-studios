"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";

// Canonical pillar palette per brand spec §3.3
// (websites/docs/superpowers/specs/2026-04-27-brand-v4.1-design.md, lines 185-188)
// Order matches the 2×2 grid: TL=Stone, TR=Sky, BL=Lake, BR=Pine.
const PILLARS = [
  { bg: "var(--color-pillar-stone)", text: "#4A4131", muted: "rgba(74,65,49,0.92)" },
  { bg: "var(--color-pillar-sky)",   text: "#15171A", muted: "rgba(21,23,26,0.92)" },
  { bg: "var(--color-pillar-lake)",  text: "#FBFCFC", muted: "rgba(251,252,252,0.92)" },
  { bg: "var(--color-pillar-pine-deep)",  text: "#FBFCFC", muted: "rgba(251,252,252,0.92)" },
];

export default function Services() {
  const { dict } = useLanguage();
  const d = dict.services;

  return (
    <section
      className="grain lc-pad-section"
      style={{
        position: "relative",
        background: "#15171A",
        padding: "120px 48px",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(154,160,166,0.04) 0%, transparent 70%)",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Overline */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#9AA0A6",
          marginBottom: "2rem",
        }}>
          {d.overline}
        </p>

        {/* Headline */}
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "#F7F8F8",
          marginBottom: "80px",
          whiteSpace: "pre-line",
        }}>
          {d.headline}
        </h2>

        {/* 2×2 pillar grid — full pillar-colored cells per brand spec §3.3 */}
        <div className="lc-stack-pillars" style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1px",
          background: "rgba(247,248,248,0.07)",
        }}>
          {d.items.map((item, i) => {
            const p = PILLARS[i] ?? PILLARS[0];
            return (
              <div
                key={i}
                className="grain"
                style={{
                  position: "relative",
                  padding: "56px 48px",
                  background: p.bg,
                  overflow: "hidden",
                  minHeight: "260px",
                }}
              >
                <div style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: p.text,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "20px",
                  opacity: 0.9,
                }}>
                  0{i + 1}
                </div>
                <h3 style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "var(--font-display)",
                  fontSize: "1.7rem",
                  fontWeight: 500,
                  color: p.text,
                  marginBottom: "16px",
                  lineHeight: 1.2,
                  letterSpacing: "0.005em",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  position: "relative",
                  zIndex: 1,
                  fontSize: "0.92rem",
                  color: p.muted,
                  lineHeight: 1.7,
                  fontWeight: 400,
                  maxWidth: "44ch",
                }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
