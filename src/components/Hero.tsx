"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { dict } = useLanguage();

  return (
    <section
      className="grain lc-pad-hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1A1812 0%, #252219 55%, #1A1812 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 48px 80px",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(184,148,77,0.06) 0%, transparent 70%)",
      }} />

      {/* Vertical rule */}
      <div style={{
        position: "absolute", left: "48px", top: 0, bottom: 0,
        width: "1px", background: "rgba(246,241,235,0.06)",
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>
        {/* Overline */}
        <p
          className="reveal reveal-1"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#C9A961",
            marginBottom: "2rem",
          }}
        >
          {dict.hero.overline}
        </p>

        {/* Wordmark */}
        <h1
          className="reveal reveal-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem, 11vw, 9.5rem)",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: "#F6F1EB",
            marginBottom: "2.5rem",
            whiteSpace: "pre-line",
          }}
        >
          {dict.hero.tagline}
        </h1>

        {/* Gold separator */}
        <div
          className="reveal reveal-3"
          style={{ width: "48px", height: "1px", background: "#C9A961", marginBottom: "2.5rem" }}
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
            color: "rgba(246,241,235,0.78)",
            marginBottom: "2.5rem",
            maxWidth: "640px",
            animationDelay: "0.65s",
          }}
        >
          {dict.hero.subline}
        </p>

        {/* Location */}
        <p
          className="reveal reveal-4"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(246,241,235,0.62)",
          }}
        >
          {dict.hero.location}
        </p>
      </div>

      {/* Scroll cue */}
      <div
        className="reveal reveal-5"
        style={{
          position: "absolute",
          bottom: "48px",
          right: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          zIndex: 2,
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(246,241,235,0.62)",
          writingMode: "vertical-rl",
        }}>
          {dict.hero.scroll}
        </span>
        <div style={{
          width: "1px",
          height: "60px",
          background: "linear-gradient(to bottom, rgba(201,169,97,0.6), transparent)",
          animation: "scrollPulse 2.5s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}
