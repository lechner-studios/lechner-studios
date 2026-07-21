import React from "react";
import { renderGraphic } from "../lib/post-graphics.mjs";
import type { GraphicNode } from "../lib/post-graphics.d.mts";

// Renders a crafted technical graphic as real JSX (not markup). Inline (not
// <img src=".svg">) so the SVG can use the site's self-hosted fonts and
// palette, and so labels localize.
//
// renderGraphic() returns a plain data descriptor — viewBox, title, and a
// list of rect/line/path/text/tspans nodes with labels already resolved to
// plain strings. Every text value below is passed as a React child, so React
// escapes it; there is no dangerouslySetInnerHTML, and therefore no
// HTML-injection sink here at all.
function renderNode(node: GraphicNode, key: number) {
  switch (node.t) {
    case "rect":
      return (
        <rect
          key={key}
          x={node.x}
          y={node.y}
          width={node.w}
          height={node.h}
          rx={node.rx}
          fill={node.fill}
          fillOpacity={node.opacity}
          stroke={node.stroke}
          strokeOpacity={node.strokeOpacity}
        />
      );
    case "line":
      return (
        <line
          key={key}
          x1={node.x1}
          y1={node.y1}
          x2={node.x2}
          y2={node.y2}
          stroke={node.stroke}
          strokeOpacity={node.strokeOpacity}
          strokeWidth={node.strokeWidth}
          strokeDasharray={node.dash}
        />
      );
    case "path":
      return (
        <path
          key={key}
          d={node.d}
          fill={node.fill}
          fillOpacity={node.fillOpacity}
          stroke={node.stroke}
          strokeOpacity={node.strokeOpacity}
        />
      );
    case "text":
      return (
        <text
          key={key}
          x={node.x}
          y={node.y}
          className={node.cls}
          fill={node.fill}
          fillOpacity={node.opacity}
          textAnchor={node.anchor}
          style={node.style}
        >
          {node.text}
        </text>
      );
    case "tspans":
      return (
        <text key={key} x={node.x} y={node.y} className={node.cls}>
          {node.parts.map((p, i) => (
            <tspan key={i} fill={p.fill} fillOpacity={p.opacity}>
              {p.text}
            </tspan>
          ))}
        </text>
      );
    default:
      return null;
  }
}

export default function PostGraphic({
  graphic,
  labels,
  variant,
}: {
  graphic: string;
  labels: Record<string, string>;
  variant: "hero" | "tile";
}) {
  const spec = renderGraphic(graphic, labels);
  if (!spec) return null;
  const isHero = variant === "hero";
  const titleId = `pg-title-${graphic}`;
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
    >
      <svg viewBox={spec.viewBox} role="img" aria-labelledby={titleId}>
        <title id={titleId}>{spec.title}</title>
        {spec.nodes.map((node, i) => renderNode(node, i))}
      </svg>
    </div>
  );
}
