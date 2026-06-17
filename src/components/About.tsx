"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

export default function About() {
  const { dict } = useLanguage();
  const d = dict.about;

  return (
    <section
      id="about"
      className="lc-pad-section"
      style={{
        background: "var(--bg)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Reveal style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Overline */}
        <Overline marginBottom="2.5rem">
          {d.overline}
        </Overline>

        <div className="lc-stack-2col" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "start",
        }}>
          {/* Left: headline */}
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}>
            {d.headline}
          </h2>

          {/* Right: body + stats */}
          <div>
            <p style={{
              fontSize: "1rem",
              lineHeight: 1.9,
              color: "var(--text-muted)",
              fontWeight: 400,
              marginBottom: "48px",
            }}>
              {d.body}
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
              {[
                { n: d.stat1n, l: d.stat1l },
                { n: d.stat2n, l: d.stat2l },
                { n: d.stat3n, l: d.stat3l },
              ].map((s, i) => (
                <div key={i} style={{ borderTop: "2px solid color-mix(in srgb, var(--accent) 50%, transparent)", paddingTop: "20px" }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.8rem",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--accent)",
                    marginBottom: "6px",
                  }}>
                    {s.n}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
