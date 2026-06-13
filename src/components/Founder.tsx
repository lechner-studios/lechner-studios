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
        background: "#FDFBF8",
        padding: "120px 48px",
        borderTop: "1px solid rgba(26,24,18,0.08)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#7A6029",
          marginBottom: "2.5rem",
        }}>
          {d.overline}
        </p>

        {/* Photo row — Sonja + Jason side by side, captioned */}
        <div className="lc-stack-2col" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginBottom: "72px",
        }}>
          <figure style={{ margin: 0 }}>
            <Image
              src="/founder/sonja-lechner.jpg"
              alt={d.photoAlt}
              width={1078}
              height={1456}
              priority
              sizes="(max-width: 900px) 90vw, 520px"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <figcaption style={{ marginTop: "16px" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 400,
                letterSpacing: "-0.005em",
                color: "#1A1812",
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
                color: "#6B6356",
                marginTop: "6px",
              }}>
                {d.sonjaRole}
              </div>
            </figcaption>
          </figure>

          <figure style={{ margin: 0 }}>
            <Image
              src="/founder/jason-lechner.jpg"
              alt={d.jasonPhotoAlt}
              width={1080}
              height={1440}
              sizes="(max-width: 900px) 90vw, 520px"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <figcaption style={{ marginTop: "16px" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 400,
                letterSpacing: "-0.005em",
                color: "#1A1812",
                lineHeight: 1.2,
              }}>
                {d.jasonName}
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#6B6356",
                marginTop: "6px",
              }}>
                {d.jasonRole}
              </div>
            </figcaption>
          </figure>
        </div>

        {/* Text block — full-width below the photo row */}
        <div style={{ maxWidth: "780px" }}>
          <h2
            id="founder-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#1A1812",
              marginBottom: "32px",
            }}
          >
            {d.headline}
          </h2>

          <div style={{
            fontSize: "1rem",
            lineHeight: 1.9,
            color: "#1A1812",
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
