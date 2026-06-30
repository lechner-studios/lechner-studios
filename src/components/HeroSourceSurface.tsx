"use client";
import React from "react";

// Source → Surface: the hero proof for a hand-build studio. Real source code
// on the left of one dark editor panel dissolves (sharp → blur) into the live-
// rendered card that sits ON the panel's right edge — both are real DOM, no
// image. The blur band is a second, blurred copy of the same code masked to the
// card's left edge, so the code visibly melts into the rendered surface within a
// single frame (no detached card, no gap). Desktop layout is inline; the narrow-
// viewport stack/reflow lives in globals.css (.hero-ss* — see that file).

// Code-token colours, tuned to stay legible on the dark panel in both themes.
const C = {
  kw: "#C7A45C", // keyword — warm gold
  str: "#9DBE8C", // string — sage green
  txt: "#CFC8BA", // plain code — warm grey
};

const Tok = ({ c, children }: { c: string; children: React.ReactNode }) => (
  <span style={{ color: c }}>{children}</span>
);

function CodeLines() {
  return (
    <code style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: 1.85, color: C.txt, whiteSpace: "pre" }}>
      <div><Tok c={C.kw}>export</Tok>{" "}<Tok c={C.kw}>function</Tok>{" Card({ project }) {"}</div>
      <div>{"  "}<Tok c={C.kw}>return</Tok>{" ("}</div>
      <div>{"    <article className="}<Tok c={C.str}>&quot;card&quot;</Tok>{">"}</div>
      <div>{"      <span className="}<Tok c={C.str}>&quot;tag&quot;</Tok>{">Web · Tirol</span>"}</div>
      <div>{"      <h3>{project.title}</h3>"}</div>
      <div>{"    </article>"}</div>
      <div>{"  )"}</div>
      <div>{"}"}</div>
    </code>
  );
}

const codePanelBase: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  margin: 0,
  boxSizing: "border-box",
  borderRadius: "10px",
  padding: "22px 26px",
  overflow: "hidden",
};

// Sharp code fades out before the card; the blurred echo peaks right at the
// card's left edge (~45%), so the dissolve resolves into the rendered surface.
const maskSharp = "linear-gradient(to right, #000 0%, #000 34%, transparent 58%)";
const maskBlur = "linear-gradient(to right, transparent 24%, #000 45%, transparent 64%)";

export default function HeroSourceSurface() {
  return (
    <div
      className="hero-ss reveal"
      aria-hidden="true"
      style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "560px",
        height: "clamp(244px, 30vw, 300px)",
        animationDelay: "1.1s",
      }}
    >
      {/* the dark editor panel — sharp code, fading out toward the card */}
      <pre
        className="hero-ss-code"
        style={{
          ...codePanelBase,
          background: "var(--code-panel-bg)",
          border: "1px solid var(--code-panel-border)",
          WebkitMaskImage: maskSharp,
          maskImage: maskSharp,
        }}
      >
        <CodeLines />
      </pre>

      {/* blurred echo in the transition band — the code dissolving */}
      <pre
        className="hero-ss-blur"
        style={{
          ...codePanelBase,
          border: "none",
          background: "transparent",
          filter: "blur(5px)",
          WebkitMaskImage: maskBlur,
          maskImage: maskBlur,
          pointerEvents: "none",
        }}
      >
        <CodeLines />
      </pre>

      {/* the rendered surface — the live result of that code, sitting on the
          panel's right edge so the dissolving code resolves into it */}
      <div
        className="hero-ss-card"
        style={{
          position: "absolute",
          top: "50%",
          right: "16px",
          transform: "translateY(-50%)",
          width: "52%",
          boxSizing: "border-box",
          background: "var(--bg-alt)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "20px 22px",
          boxShadow: "0 34px 70px -30px rgba(16,18,22,0.55)",
          zIndex: 3,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)" }}>
          Web · Tirol
        </span>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)", fontWeight: 400, color: "var(--text)", margin: "10px 0 12px", lineHeight: 1.1, overflowWrap: "break-word" }}>
          Maßgeschneidert
        </h3>
        <div style={{ width: "32px", height: "1px", background: "var(--accent)", marginBottom: "12px" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
          Von Hand gebaut →
        </p>
      </div>
    </div>
  );
}
