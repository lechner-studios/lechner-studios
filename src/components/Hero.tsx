"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";

const PROOF = [
  { slug: "pension", label: "Pension" },
  { slug: "gasthof", label: "Gasthof" },
  { slug: "skischule", label: "Skischule" },
  { slug: "tischlerei", label: "Tischlerei" },
];

export default function Hero() {
  const { dict, locale } = useLanguage();
  const lines = dict.hero.tagline.split("\n");

  return (
    <section
      className="grain lc-pad-hero"
      style={{
        position: "relative",
        background: "var(--hero-bg)",
        display: "flex",
        flexDirection: "column",
        padding: "150px 48px 110px",
        overflow: "hidden",
      }}
    >
      {/* Editorial column grid — faint vertical hairlines for structure
          (replaces the old radial-glow gradient). */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{ borderRight: i < 3 ? "1px solid var(--hero-border)" : "none" }}
          />
        ))}
      </div>

      <div
        className="lc-stack-2col"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "56px",
          alignItems: "end",
        }}
      >
        {/* LEFT: overline + headline + rule */}
        <div>
          {/* Overline */}
          <p
            className="reveal reveal-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--hero-accent)",
              marginBottom: "2rem",
            }}
          >
            {dict.hero.overline}
          </p>

          {/* Wordmark — masked, line-by-line rise */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 6vw, 5.25rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--hero-text)",
              marginBottom: "2.5rem",
            }}
          >
            {lines.map((ln, i) => (
              <span key={i} className="hero-line-mask">
                <span
                  className="hero-line-inner"
                  style={{ animationDelay: `${0.2 + i * 0.13}s` }}
                >
                  {ln}
                </span>
              </span>
            ))}
          </h1>

          {/* Accent rule — draws itself in */}
          <div
            className="hero-rule"
            style={{
              width: "56px",
              height: "1px",
              background: "var(--hero-accent)",
              animationDelay: "0.62s",
            }}
          />
        </div>

        {/* RIGHT: CTAs + location, bottom-aligned to the headline baseline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2rem",
            paddingBottom: "4px",
          }}
        >
        {/* CTAs */}
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            flexWrap: "wrap",
            animationDelay: "0.92s",
          }}
        >
          <a
            href={`/${locale}/start`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--hero-accent)",
              border: "1px solid color-mix(in srgb, var(--hero-accent) 50%, transparent)",
              borderRadius: "2px",
              padding: "14px 26px",
              textDecoration: "none",
              transition: "background 0.25s, color 0.25s, border-color 0.25s",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.background = "var(--hero-accent)";
              t.style.color = "var(--hero-accent-text)";
              t.style.borderColor = "var(--hero-accent)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.background = "transparent";
              t.style.color = "var(--hero-accent)";
              t.style.borderColor = "color-mix(in srgb, var(--hero-accent) 50%, transparent)";
            }}
          >
            {dict.hero.ctaPrimary} →
          </a>
          <a
            href={`/${locale}/work`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--hero-text-muted)",
              textDecoration: "none",
              borderBottom: "1px solid var(--hero-border)",
              paddingBottom: "3px",
              transition: "color 0.25s, border-color 0.25s",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.color = "var(--hero-text)";
              t.style.borderColor = "var(--hero-accent)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.color = "var(--hero-text-muted)";
              t.style.borderColor = "var(--hero-border)";
            }}
          >
            {dict.hero.ctaSecondary}
          </a>
        </div>

        {/* Location */}
        <p
          className="reveal"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--hero-text-faint)",
            animationDelay: "1.05s",
          }}
        >
          {dict.hero.location}
        </p>
        </div>
      </div>

      {/* PROOF STRIP — live demo screenshots. The work, made visible in the
          first viewport. Self-hosted webp, honest Konzept labels, links live. */}
      <div
        className="reveal hero-proof"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1200px",
          marginTop: "clamp(48px, 6vw, 88px)",
          animationDelay: "1.15s",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--hero-accent)",
            marginBottom: "1.25rem",
          }}
        >
          {dict.hero.proofOverline}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {PROOF.map((d) => (
            <a
              key={d.slug}
              href={`https://demos.lechner-studios.at/${d.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-proof-card"
              style={{ display: "block", textDecoration: "none" }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16 / 11",
                  borderRadius: "3px",
                  overflow: "hidden",
                  border: "1px solid var(--hero-border)",
                  backgroundImage: `url(/proof/${d.slug}.webp)`,
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#fff",
                    background: "rgba(21,23,26,0.66)",
                    padding: "3px 8px",
                    borderRadius: "2px",
                  }}
                >
                  {dict.demos.conceptLabel}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--hero-text)" }}>
                  {d.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--hero-accent)",
                  }}
                >
                  {dict.hero.proofCta} →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
