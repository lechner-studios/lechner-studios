"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

// Positioning / trust statement (few clients, founder-stage terms). No CTA of its
// own — ContactCta directly below carries that. Paired with an editorial brand
// motif: a quiet "founder-stage" stamp (year + the Alpine palette + place), an
// honest on-brand graphic rather than a generic decorative tile.
const STAMP_HUES = ["#8FA8C5", "#D6CDBE", "#254268", "#5E8263"]; // sky, stone, lake, pine

export default function FoundationPartner() {
  const { dict } = useLanguage();
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
      <div
        className="lc-stack-2col"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* LEFT: the statement */}
        <div>
          <Reveal>
            <Overline marginBottom="1.5rem">{d.overline}</Overline>
          </Reveal>
          <Reveal delay={80}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)",
                fontWeight: 300,
                color: "var(--text)",
                marginBottom: "1.5rem",
              }}
            >
              {d.headline}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: "56ch", margin: 0 }}>
              {d.body}
            </p>
          </Reveal>
        </div>

        {/* RIGHT: editorial founder-stage stamp */}
        <Reveal delay={200} style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            aria-hidden="true"
            style={{
              width: "100%",
              maxWidth: "320px",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "32px 34px",
              boxShadow: "inset 0 3px 0 0 var(--accent), 0 28px 60px -34px rgba(16,18,22,0.4)",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)" }}>
              {d.est}
            </span>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 4rem)", fontWeight: 300, lineHeight: 1, color: "var(--text)", margin: "10px 0 18px", letterSpacing: "-0.01em" }}>
              2026
            </div>
            <div style={{ width: "40px", height: "1px", background: "var(--border-strong)", marginBottom: "18px" }} />
            <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
              {STAMP_HUES.map((h) => (
                <span key={h} style={{ width: "22px", height: "22px", borderRadius: "4px", background: h, border: "1px solid var(--border)", boxSizing: "border-box", boxShadow: "0 2px 6px -1px rgba(16,18,22,0.28)" }} />
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {d.place}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
