"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";

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
        background: "#15171A",
        padding: "120px 48px",
        borderTop: "1px solid rgba(247,248,248,0.06)",
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

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "760px" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#8FA8C5",
              marginBottom: "2rem",
            }}
          >
            {d.overline}
          </p>

          <h2
            id="how-we-work-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#F7F8F8",
              marginBottom: "2.5rem",
            }}
          >
            {d.headline}
          </h2>

          <div
            style={{
              width: "48px",
              height: "1px",
              background: "#9AA0A6",
              marginBottom: "2.5rem",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.15rem, 1.6vw, 1.4rem)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(247,248,248,0.88)",
            }}
          >
            {d.statement}
          </p>
        </div>
      </div>
    </section>
  );
}
