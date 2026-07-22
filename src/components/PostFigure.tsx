import React from "react";
import { FIGURES, isFigureKey } from "../lib/post-figures.mjs";
import type { FigureSpecimen } from "../lib/post-figures.d.mts";

// Renders an inline blog figure: two mock business cards showing the same
// business in two brand systems, so the reader sees the difference the
// surrounding paragraph describes.
//
// Structure is fixed JSX here and specimen styling comes from the registry in
// post-figures.mjs, so a post can never influence what markup is produced —
// see that file for the full note. Layout lives in globals.css under `.bf-*`;
// each card supplies its own palette and type through CSS custom properties.
//
// The figure CHROME (eyebrow, caption, borders) is token-driven and follows
// the site theme. The specimen cards deliberately do not: their palettes are
// the subject of the figure, so they stay fixed in light and dark alike.

function lbl(labels: Record<string, string>, token: string) {
  return labels[token] ?? "";
}

function Card({
  specimen,
  tag,
  name,
  sub,
  body,
  cta,
}: {
  specimen: FigureSpecimen;
  tag: string;
  name: string;
  sub: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="bf-mock" style={specimen.vars as React.CSSProperties}>
      <p className="bf-tag">{tag}</p>
      <h3 className="bf-name">{name}</h3>
      <p className="bf-sub">{sub}</p>
      <p className="bf-body">{body}</p>
      <span className="bf-btn">{cta}</span>
      <div className="bf-swatches" aria-hidden="true">
        {specimen.swatches.map((c) => (
          <span key={c} className="bf-sw" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

export default function PostFigure({
  figure,
  labels,
}: {
  figure: string;
  labels: Record<string, string>;
}) {
  if (!isFigureKey(figure)) return null;
  const def = FIGURES[figure];
  const [a, b] = def.specimens;

  // Identical name, tagline, body and CTA in both cards — that identity is the
  // whole argument. Only the brand system differs.
  const shared = {
    name: lbl(labels, "NAME"),
    sub: lbl(labels, "SUB"),
    body: lbl(labels, "BODY"),
    cta: lbl(labels, "CTA"),
  };

  return (
    <figure className="bf" role="group" aria-label={lbl(labels, "ALT")}>
      <div className="bf-eyebrow">{lbl(labels, "EYEBROW")}</div>
      <div className="bf-grid">
        <Card specimen={a} tag={lbl(labels, "TAG_A")} {...shared} />
        <Card specimen={b} tag={lbl(labels, "TAG_B")} {...shared} />
      </div>
      <figcaption className="bf-cap">{lbl(labels, "CAPTION")}</figcaption>
    </figure>
  );
}
