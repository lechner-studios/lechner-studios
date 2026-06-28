"use client";
import React from "react";

// Brand-native hero graphic: the Alpine-pillar tile system rendered at hero
// scale as an editorial composition — the studio's own identity as the art.
// Golden-ratio asymmetric split, the gold founder dot on the seam, staggered
// reveal. Fixed brand-palette hex (consistent across themes, like BrandMark);
// hairline gaps via the container background read on both light and dark.
const TILES = ["#D6CDBE", "#8FA8C5", "#254268", "#5E8263"]; // Stone · Alpine sky · Lake navy · Pine sage

export default function HeroComposition() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "relative", width: "min(380px, 100%)", aspectRatio: "1 / 1", marginLeft: "auto" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.618fr 1fr",
          gridTemplateRows: "1fr 1.618fr",
          gap: "1.5px",
          padding: "1.5px",
          background: "var(--hero-border)",
          borderRadius: "3px",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        {TILES.map((c, i) => (
          <span key={c} className="hero-tile" style={{ background: c, animationDelay: `${1.0 + i * 0.12}s` }} />
        ))}
      </div>
      {/* Gold founder dot — the signature, on the golden-ratio seam */}
      <span
        className="hero-tile"
        style={{
          position: "absolute",
          top: "27.6%",
          left: "51.3%",
          width: "21%",
          aspectRatio: "1 / 1",
          background: "#B8944D",
          borderRadius: "50%",
          boxShadow: "0 2px 14px rgba(184,148,77,0.35)",
          animationDelay: "1.55s",
        }}
      />
    </div>
  );
}
