"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

export default function MayaCaseStudy() {
  const { dict } = useLanguage();
  const d = dict.maya;

  return (
    <section
      id="maya"
      className="lc-pad-section"
      style={{
        background: "var(--bg)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <Overline marginBottom="12px">{d.overline}</Overline>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "24px",
              maxWidth: "20ch",
            }}
          >
            {d.headline}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              lineHeight: 1.75,
              maxWidth: "62ch",
              marginBottom: "48px",
            }}
          >
            {d.body}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div
            style={{
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--bg-alt)",
              marginBottom: "16px",
            }}
          >
            <video
              controls
              preload="none"
              playsInline
              poster="/maya-demo-poster.svg"
              aria-label={d.videoAlt}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                aspectRatio: "16 / 9",
                background: "var(--bg-alt)",
              }}
            >
              <source src="/maya-demo.mp4" type="video/mp4" />
              {/* OWNER GATE: supply /maya-demo.vtt (captions) alongside /maya-demo.mp4 before this goes live — WCAG 2.1 AA 1.2.2 (captions for prerecorded audio). */}
              <track kind="captions" src="/maya-demo.vtt" srcLang="en" label="English" default />
              {d.videoCaption}
            </video>
          </div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              marginBottom: "56px",
            }}
          >
            {d.videoCaption}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            {d.stackLabel}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", maxWidth: "62ch" }}>
            {d.stack.map((line) => (
              <li
                key={line}
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {line}
              </li>
            ))}
          </ul>
          <p
            style={{
              fontSize: "0.85rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              maxWidth: "62ch",
            }}
          >
            {d.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
