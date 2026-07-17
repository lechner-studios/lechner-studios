import React from "react";
import { artSpec } from "../lib/post-art.mjs";

// Decorative brand art. Geometry lives in src/lib/post-art.mjs (pure + tested);
// this file only turns that data into SVG.
export default function PostArt({
  slug,
  category,
  variant,
}: {
  slug: string;
  category: string;
  variant: "hero" | "tile";
}) {
  const { shapes } = artSpec(slug, category);
  const isHero = variant === "hero";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      // Decorative: it carries nothing the headline doesn't, so it is hidden
      // from assistive tech rather than given invented alt text.
      aria-hidden="true"
      role="presentation"
      focusable="false"
      style={{
        display: "block",
        width: isHero ? "100%" : "72px",
        height: isHero ? "180px" : "72px",
        flexShrink: 0,
        borderRadius: "4px",
        border: "1px solid var(--border)",
        background: "var(--bg-alt)",
      }}
    >
      {shapes.map((s, i) =>
        s.kind === "circle" ? (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.fill} opacity={s.opacity} />
        ) : (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill} opacity={s.opacity} />
        ),
      )}
    </svg>
  );
}
