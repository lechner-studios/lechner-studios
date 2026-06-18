"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

// Positioning statement shown directly below the hero. Honest, provable claims
// only — hand-coded / self-hosted / DSGVO / accessible — no inflated "laboratory"
// or "household name" language.
export default function Stance() {
  const { dict } = useLanguage();
  const d = dict.stance;

  return (
    <section
      className="lc-pad-section"
      style={{
        background: "var(--bg)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <Overline marginBottom="20px">{d.overline}</Overline>
        </Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--text)",
              maxWidth: "20ch",
              marginBottom: "28px",
            }}
          >
            {d.headline}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--text-muted)",
              lineHeight: 1.75,
              maxWidth: "62ch",
            }}
          >
            {d.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
