"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

// Pillar palette per brand spec §3.3, grid positions fixed: TL=Stone, TR=Sky,
// BL=Lake, BR=Pine. Per owner (2026-06-30) the BL/BR *labels* swap so green→
// Growth and lake→Identity, while the colour tiles stay put — so dict.services
// .items order is [Web, Apps, Brand & Identity (lake), SEO & Growth (pine)].
const PILLARS = [
  { bg: "var(--color-pillar-stone)", text: "#4A4131", muted: "rgba(74,65,49,0.92)" },
  { bg: "var(--color-pillar-sky)",   text: "#15171A", muted: "rgba(21,23,26,0.92)" },
  { bg: "var(--color-pillar-lake)",  text: "#FBFCFC", muted: "rgba(251,252,252,0.92)" },
  { bg: "var(--color-pillar-pine-deep)",  text: "#FBFCFC", muted: "rgba(251,252,252,0.92)" },
];

// Service-page links by grid index. SEO now rides the green (BR) cell; the lake
// (BL) cell is Brand & Identity, which has no dedicated page.
const PILLAR_SLUGS: (string | null)[] = ["webdesign", "apps-automation", null, "seo"];

export default function Services() {
  const { dict, locale } = useLanguage();
  const d = dict.services;

  return (
    <section
      className="grain lc-pad-section"
      style={{
        position: "relative",
        background: "var(--bg)",
        padding: "120px 48px",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(154,160,166,0.04) 0%, transparent 70%)",
      }} />

      <Reveal style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Overline */}
        <Overline marginBottom="2rem">
          {d.overline}
        </Overline>

        {/* Headline */}
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "var(--text)",
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
          background: "var(--border)",
        }}>
          {d.items.map((item, i) => {
            const p = PILLARS[i] ?? PILLARS[0];
            const slug = PILLAR_SLUGS[i];

            const cellStyle: React.CSSProperties = {
              position: "relative",
              display: "block",
              padding: "56px 48px",
              background: p.bg,
              overflow: "hidden",
              minHeight: "260px",
              color: "inherit",
              textDecoration: "none",
              transition: "opacity 0.25s",
            };

            const inner = (
              <>
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
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                }}>
                  {item.title}
                  {slug && (
                    <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", opacity: 0.7 }}>→</span>
                  )}
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
              </>
            );

            if (slug) {
              return (
                <Link
                  key={i}
                  href={`/${locale}/${slug}`}
                  className="grain"
                  style={cellStyle}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.86")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div key={i} className="grain" style={cellStyle}>
                {inner}
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
