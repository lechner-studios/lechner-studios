"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

export default function Founder() {
  const { dict } = useLanguage();
  const d = dict.founder;

  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="lc-pad-section"
      style={{
        background: "var(--bg-alt)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Reveal style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Overline color="var(--accent-2)" marginBottom="2.5rem">
          {d.overline}
        </Overline>

        {/* Founder portrait */}
        <figure style={{ margin: "0 0 72px", maxWidth: "480px" }}>
          <Image
            src="/founder/sonja-lechner.jpg"
            alt={d.photoAlt}
            width={1078}
            height={1456}
            priority
            sizes="(max-width: 900px) 90vw, 480px"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <figcaption style={{ marginTop: "16px" }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 400,
              letterSpacing: "-0.005em",
              color: "var(--text)",
              lineHeight: 1.2,
            }}>
              {d.sonjaName}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginTop: "6px",
            }}>
              {d.sonjaRole}
            </div>
          </figcaption>
        </figure>

        {/* Text block — full-width below the portrait */}
        <div style={{ maxWidth: "780px" }}>
          <h2
            id="founder-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "32px",
            }}
          >
            {d.headline}
          </h2>

          <div style={{
            fontSize: "1rem",
            lineHeight: 1.9,
            color: "var(--text)",
            fontWeight: 400,
            marginBottom: "32px",
            whiteSpace: "pre-line",
          }}>
            {d.body}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
