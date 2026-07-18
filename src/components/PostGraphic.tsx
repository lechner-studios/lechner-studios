import React from "react";
import { renderGraphic } from "../lib/post-graphics.mjs";

// Inlines a crafted technical graphic. Inline (not <img src=".svg">) so the SVG
// can use the site's self-hosted fonts and palette, and so labels localize.
//
// dangerouslySetInnerHTML is safe here: the markup is our own static template
// and renderGraphic escapes every interpolated label.
export default function PostGraphic({
  graphic,
  labels,
  variant,
}: {
  graphic: string;
  labels: Record<string, string>;
  variant: "hero" | "tile";
}) {
  const svg = renderGraphic(graphic, labels);
  if (!svg) return null;
  const isHero = variant === "hero";
  return (
    <div
      className="pg-wrap"
      style={{
        width: isHero ? "100%" : "72px",
        height: isHero ? "auto" : "72px",
        flexShrink: 0,
        borderRadius: "4px",
        overflow: "hidden",
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
