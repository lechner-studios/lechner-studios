"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

export default function HowWeWork() {
  const { dict } = useLanguage();
  const d = dict.howWeWork;

  return (
    <section
      id="how-we-work"
      aria-labelledby="how-we-work-heading"
      className="grain lc-pad-section"
      style={{
        position: "relative",
        background: "var(--bg)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial accent */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(154,160,166,0.05) 0%, transparent 70%)",
        }}
      />

      <Reveal style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "760px" }}>
          <Overline marginBottom="2rem">
            {d.overline}
          </Overline>

          <h2
            id="how-we-work-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "2.5rem",
            }}
          >
            {d.headline}
          </h2>

          <div
            style={{
              width: "48px",
              height: "1px",
              background: "var(--accent)",
              marginBottom: "2.5rem",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.15rem, 1.6vw, 1.4rem)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "var(--text-muted)",
            }}
          >
            {d.statement}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
