"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";
import SourceSurfaceSlider from "./SourceSurfaceSlider";

// Positioning statement ("Keine Vorlage") shown below the hero. Honest, provable
// claims only — hand-coded / self-hosted / DSGVO / accessible. The code↔render
// slider is its proof: real source on one side, its live rendered result on the
// other — drag to reveal. It literally demonstrates "no templates, hand-written".
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
      <div
        className="lc-stack-2col"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* LEFT: the statement */}
        <div>
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
                maxWidth: "18ch",
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
                maxWidth: "54ch",
              }}
            >
              {d.body}
            </p>
          </Reveal>
        </div>

        {/* RIGHT: the proof — code↔render comparison slider */}
        <Reveal delay={200} style={{ display: "flex", justifyContent: "flex-end" }}>
          <SourceSurfaceSlider
            codeLabel={d.slider.code}
            resultLabel={d.slider.result}
            ariaLabel={d.slider.aria}
          />
        </Reveal>
      </div>
    </section>
  );
}
