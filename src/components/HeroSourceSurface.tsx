"use client";
import React, { useCallback, useRef, useState } from "react";

// Source → Surface: the hero proof for a hand-build studio, as a before/after
// comparison slider. Left layer = the real source code; right layer = its live
// rendered result. Both are real DOM (no images), so the slider literally shows
// "this code → this surface". Drag the handle (or arrow-keys) to reveal more of
// either side; starts at 50/50.

// Code-token colours, tuned to stay legible on the dark code layer in both themes.
const C = {
  kw: "#C7A45C", // keyword — warm gold
  str: "#9DBE8C", // string — sage green
  txt: "#CFC8BA", // plain code — warm grey
};

const Tok = ({ c, children }: { c: string; children: React.ReactNode }) => (
  <span style={{ color: c }}>{children}</span>
);

const fill: React.CSSProperties = { position: "absolute", inset: 0, overflow: "hidden" };
const cornerLabel: React.CSSProperties = {
  position: "absolute",
  top: "14px",
  fontFamily: "var(--font-mono)",
  fontSize: "0.5rem",
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
};

export default function HeroSourceSurface() {
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const updateFromX = useCallback((clientX: number) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch { /* noop */ }
    updateFromX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updateFromX(e.clientX);
  };
  const stop = () => { dragging.current = false; };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); setPos((p) => Math.max(0, p - 4)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setPos((p) => Math.min(100, p + 4)); }
    else if (e.key === "Home") { e.preventDefault(); setPos(0); }
    else if (e.key === "End") { e.preventDefault(); setPos(100); }
  };

  return (
    <div
      ref={boxRef}
      className="hero-ss reveal"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerLeave={stop}
      style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "560px",
        height: "clamp(280px, 34vw, 344px)",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--code-panel-border)",
        boxShadow: "0 36px 72px -34px rgba(16,18,22,0.5)",
        cursor: "ew-resize",
        touchAction: "none",
        animationDelay: "1.1s",
        userSelect: "none",
      }}
    >
      {/* BASE layer — the rendered result (full-bleed card) */}
      <div
        aria-hidden="true"
        style={{ ...fill, background: "var(--bg-alt)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "30px 34px" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)" }}>
          <i style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--signature)", display: "inline-block" }} />
          Web · Tirol
        </span>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3.4vw, 2rem)", fontWeight: 400, color: "var(--text)", margin: "12px 0 14px", lineHeight: 1.05, overflowWrap: "break-word" }}>
          Maßgeschneidert
        </h3>
        <div style={{ width: "36px", height: "1px", background: "var(--accent)", marginBottom: "14px" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
          Von Hand gebaut →
        </p>
        <span style={{ ...cornerLabel, right: "16px", color: "var(--accent)", opacity: 0.7 }}>Ergebnis</span>
      </div>

      {/* TOP layer — the source code, clipped to the left of the handle */}
      <div
        aria-hidden="true"
        style={{ ...fill, background: "var(--code-panel-bg)", padding: "26px 28px", clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <code style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.74rem", lineHeight: 1.8, color: C.txt, whiteSpace: "pre" }}>
          <div><Tok c={C.kw}>export</Tok>{" "}<Tok c={C.kw}>function</Tok>{" Card() {"}</div>
          <div>{"  "}<Tok c={C.kw}>return</Tok>{" ("}</div>
          <div>{"    <article className="}<Tok c={C.str}>&quot;card&quot;</Tok>{">"}</div>
          <div>{"      <span className="}<Tok c={C.str}>&quot;tag&quot;</Tok>{">"}</div>
          <div>{"        <i className="}<Tok c={C.str}>&quot;dot&quot;</Tok>{" /> Web · Tirol"}</div>
          <div>{"      </span>"}</div>
          <div>{"      <h3>Maßgeschneidert</h3>"}</div>
          <div>{"      <p>Von Hand gebaut →</p>"}</div>
          <div>{"    </article>"}</div>
          <div>{"  )"}</div>
          <div>{"}"}</div>
        </code>
        <span style={{ ...cornerLabel, left: "16px", color: C.txt, opacity: 0.6 }}>Code</span>
      </div>

      {/* Divider + draggable handle */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: "2px", background: "rgba(255,255,255,0.85)", transform: "translateX(-1px)", pointerEvents: "none", zIndex: 4 }} />
      <div
        role="slider"
        aria-label="Vergleich: Quellcode und gerendertes Ergebnis – ziehen zum Aufdecken"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`Code ${Math.round(pos)} %`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        style={{
          position: "absolute",
          top: "50%",
          left: `${pos}%`,
          width: "38px",
          height: "38px",
          marginLeft: "-19px",
          marginTop: "-19px",
          borderRadius: "50%",
          background: "#FBFCFC",
          border: "1px solid rgba(21,23,26,0.15)",
          boxShadow: "0 6px 18px -6px rgba(16,18,22,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#15171A",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          lineHeight: 1,
          cursor: "ew-resize",
          zIndex: 5,
        }}
      >
        ⇆
      </div>
    </div>
  );
}
