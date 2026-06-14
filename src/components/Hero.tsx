"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { dict, locale } = useLanguage();
  const lines = dict.hero.tagline.split("\n");

  return (
    <section
      className="grain lc-pad-hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--hero-bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "120px 48px 80px",
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
            style={{ borderRight: i < 3 ? "1px solid var(--contrast-border)" : "none" }}
          />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: "960px" }}>
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
            color: "var(--on-contrast)",
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

        {/* Gold rule — draws itself in */}
        <div
          className="hero-rule"
          style={{
            width: "56px",
            height: "1px",
            background: "var(--hero-accent)",
            marginBottom: "2.5rem",
            animationDelay: "0.62s",
          }}
        />

        {/* Italiana sub-line */}
        <p
          className="reveal"
          style={{
            fontFamily: "var(--font-display-italiana)",
            fontSize: "clamp(1.1rem, 1.7vw, 1.5rem)",
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: "0.005em",
            color: "var(--on-contrast-muted)",
            marginBottom: "2.75rem",
            maxWidth: "640px",
            animationDelay: "0.78s",
          }}
        >
          {dict.hero.subline}
        </p>

        {/* CTAs */}
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            flexWrap: "wrap",
            marginBottom: "2.75rem",
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
              t.style.color = "var(--hero-bg)";
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
              color: "var(--on-contrast-muted)",
              textDecoration: "none",
              borderBottom: "1px solid var(--contrast-border)",
              paddingBottom: "3px",
              transition: "color 0.25s, border-color 0.25s",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.color = "var(--on-contrast)";
              t.style.borderColor = "var(--hero-accent)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.color = "var(--on-contrast-muted)";
              t.style.borderColor = "var(--contrast-border)";
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
            color: "var(--on-contrast-faint)",
            animationDelay: "1.05s",
          }}
        >
          {dict.hero.location}
        </p>
      </div>

      {/* Scroll cue */}
      <div
        className="reveal"
        style={{
          position: "absolute",
          bottom: "48px",
          right: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          zIndex: 2,
          animationDelay: "1.2s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--on-contrast-faint)",
            writingMode: "vertical-rl",
          }}
        >
          {dict.hero.scroll}
        </span>
        <div
          style={{
            width: "1px",
            height: "60px",
            background: "linear-gradient(to bottom, color-mix(in srgb, var(--hero-accent) 60%, transparent), transparent)",
            animation: "scrollPulse 2.5s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
