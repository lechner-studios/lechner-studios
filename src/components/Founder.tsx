"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function Founder() {
  const { dict } = useLanguage();
  const d = dict.founder;

  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="lc-pad-section"
      style={{
        background: "#FBFCFC",
        padding: "120px 48px",
        borderTop: "1px solid rgba(21,23,26,0.08)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#5B6168",
          marginBottom: "2.5rem",
        }}>
          {d.overline}
        </p>

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
              color: "#15171A",
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
              color: "#5B6168",
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
              color: "#15171A",
              marginBottom: "32px",
            }}
          >
            {d.headline}
          </h2>

          <div style={{
            fontSize: "1rem",
            lineHeight: 1.9,
            color: "#15171A",
            fontWeight: 400,
            marginBottom: "32px",
            whiteSpace: "pre-line",
          }}>
            {d.body}
          </div>
        </div>
      </div>
    </section>
  );
}
