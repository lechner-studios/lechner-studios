"use client";
import React from "react";

// Source → Surface: the hero proof for a hand-build studio. Real source code on
// the left dissolves (sharp → blur) into its live-rendered result on the right —
// both are real DOM, no image. The blur band is a second, blurred copy of the
// same code masked to the transition zone, so the code literally melts into the
// rendered card. Replaces the brand-tile composition.

// Code-token colours, tuned for the dark code panel (consistent in both themes).
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
  width: "60%",
  height: "100%",
  margin: 0,
  boxSizing: "border-box",
  background: "#15171B",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "22px 24px",
  overflow: "hidden",
};

const maskSharp = "linear-gradient(to right, #000 50%, transparent 86%)";
const maskBlur = "linear-gradient(to right, transparent 38%, #000 60%, transparent 88%)";

export default function HeroSourceSurface() {
  return (
    <div
      className="reveal"
      aria-hidden="true"
      style={{
        position: "relative",
        zIndex: 2,
        width: "min(680px, 100%)",
        height: "clamp(230px, 26vw, 290px)",
        marginTop: "clamp(48px, 6vw, 80px)",
        animationDelay: "1.1s",
      }}
    >
      {/* sharp code, fading out toward the right */}
      <pre style={{ ...codePanelBase, WebkitMaskImage: maskSharp, maskImage: maskSharp }}>
        <CodeLines />
      </pre>
      {/* blurred echo in the transition band — the code dissolving */}
      <pre style={{ ...codePanelBase, border: "none", background: "transparent", filter: "blur(5px)", WebkitMaskImage: maskBlur, maskImage: maskBlur, pointerEvents: "none" }}>
        <CodeLines />
      </pre>
      {/* the rendered surface — the live result of that code, emerging at right */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          width: "46%",
          background: "var(--bg-alt)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "22px 24px",
          boxShadow: "0 30px 60px -28px rgba(21,23,26,0.45)",
          zIndex: 3,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)" }}>
          Web · Tirol
        </span>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, color: "var(--text)", margin: "10px 0 12px", lineHeight: 1.1 }}>
          Maßgeschneidert
        </h3>
        <div style={{ width: "32px", height: "1px", background: "var(--accent)", marginBottom: "12px" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Von Hand gebaut →
        </p>
      </div>
    </div>
  );
}
