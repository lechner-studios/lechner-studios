// Inline figures for the blog body — the mid-article counterpart to the hero
// graphics in `post-graphics.mjs`.
//
// Where a hero graphic is one dark "engineering panel" SVG per post, an inline
// figure is a small piece of laid-out HTML that sits between two paragraphs and
// *shows* what the surrounding prose describes.
//
// Same safety property as the graphics registry: a post can only ever select
// WHICH of the fixed figures below renders. `FIGURES[key]` is undefined for
// anything else, the structure lives in PostFigure.tsx as real JSX, and every
// label is a plain string resolved from the locale dictionary. Nothing from the
// markdown reaches the DOM as markup — there is no injection sink here.
//
// ---------------------------------------------------------------------------
// Specimen styling is DATA, not CSS classes.
//
// A "specimen" is one mock business card rendered in a brand system the prose
// describes. Its palette and type are the figure's SUBJECT, so they are the one
// sanctioned exception to the "never hardcode hex" rule in CONVENTIONS.md — and
// they must stay fixed in both site themes, the way the hero graphics stay dark
// in light mode.
//
// Each specimen below is a flat map of CSS custom properties that PostFigure
// applies to the card via `style`. One set of `.bf-*` rules in globals.css then
// drives every specimen, so adding a figure costs a data entry rather than
// another near-duplicate block of CSS.
// ---------------------------------------------------------------------------

const SANS = '"Helvetica Neue", Arial, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
// Self-hosted Quicksand (OFL), wired in the locale layout as
// `--font-specimen-rounded`. SPECIMEN type only — outside the ADR-0027 brand
// set on purpose, and it must never dress a Lechner Studios surface. The
// system stack behind it is a fallback, not the intended render: an earlier
// pass used Trebuchet MS alone, which only approximated the "informal rounded
// sans-serif" the EN post describes.
const ROUNDED = 'var(--font-specimen-rounded), "Trebuchet MS", "Segoe UI", Verdana, sans-serif';
// The site's own display face, self-hosted. Used where a specimen is meant to
// read as a considered serif rather than a system default.
const DISPLAY = "var(--font-display), Georgia, serif";

export const FIGURES = {
  // "Ein konkretes Beispiel" (DE post): two joinery workshops, identical copy
  // and identical offer, in the two brand systems the paragraph describes —
  // cold white/grotesk/grey against warm cream/serif/forest-green. Neither is
  // badly made; one simply fits a craft trade better.
  "type-mood-craft": {
    labels: ["ALT", "EYEBROW", "CAPTION", "TAG_A", "TAG_B", "NAME", "SUB", "BODY", "CTA"],
    specimens: [
      {
        id: "a",
        swatches: ["#111213", "#6E7479", "#E4E6E8"],
        vars: {
          "--bf-bg": "#ffffff",
          "--bf-font": SANS,
          "--bf-tag": "#6e7479",
          "--bf-head-font": SANS,
          "--bf-head-color": "#111213",
          "--bf-head-size": "1.45rem",
          "--bf-head-weight": "700",
          "--bf-head-ls": "-0.02em",
          "--bf-sub-color": "#6e7479",
          "--bf-sub-size": "0.62rem",
          "--bf-sub-weight": "500",
          "--bf-sub-ls": "0.1em",
          "--bf-sub-transform": "uppercase",
          "--bf-body-color": "#5f6469",
          "--bf-btn-bg": "#111213",
          "--bf-btn-fg": "#ffffff",
          "--bf-btn-weight": "600",
          "--bf-btn-transform": "uppercase",
        },
      },
      {
        id: "b",
        swatches: ["#33502F", "#8C7F6B", "#E6DCC9"],
        vars: {
          "--bf-bg": "#f4efe4",
          "--bf-font": SERIF,
          "--bf-tag": "#6b6152",
          "--bf-tag-font": SERIF,
          "--bf-tag-style": "italic",
          "--bf-tag-transform": "none",
          "--bf-tag-size": "0.7rem",
          "--bf-tag-ls": "0.02em",
          "--bf-head-font": DISPLAY,
          "--bf-head-color": "#24301f",
          "--bf-head-size": "2rem",
          "--bf-head-weight": "600",
          "--bf-head-ls": "0.005em",
          "--bf-sub-color": "#5c6b4f",
          "--bf-sub-size": "0.86rem",
          "--bf-sub-style": "italic",
          "--bf-body-color": "#4a443b",
          "--bf-btn-bg": "#33502f",
          "--bf-btn-fg": "#f4efe4",
          "--bf-btn-font": SERIF,
          "--bf-btn-size": "0.76rem",
        },
      },
    ],
  },

  // "A Concrete Example" (EN post): one accountancy firm, two versions. The
  // green/serif version reads as considered and discreet; the coral/rounded
  // version reads as casual — a mismatch when the visitor is about to hand
  // over financial details. Same argument as the craft figure, different fit.
  "type-mood-trust": {
    labels: ["ALT", "EYEBROW", "CAPTION", "TAG_A", "TAG_B", "NAME", "SUB", "BODY", "CTA"],
    specimens: [
      {
        id: "a",
        swatches: ["#1B3A29", "#4A6152", "#DDE5DE"],
        vars: {
          "--bf-bg": "#f7f9f7",
          "--bf-font": SANS,
          "--bf-tag": "#4a6152",
          "--bf-head-font": DISPLAY,
          "--bf-head-color": "#1b3a29",
          "--bf-head-size": "1.9rem",
          "--bf-head-weight": "600",
          "--bf-head-ls": "0.005em",
          "--bf-sub-color": "#41564a",
          "--bf-sub-size": "0.62rem",
          "--bf-sub-weight": "500",
          "--bf-sub-ls": "0.1em",
          "--bf-sub-transform": "uppercase",
          "--bf-body-color": "#474d49",
          "--bf-btn-bg": "#1b3a29",
          "--bf-btn-fg": "#f7f9f7",
          "--bf-btn-weight": "500",
        },
      },
      {
        id: "b",
        swatches: ["#D4523A", "#E38A72", "#FBE3DC"],
        vars: {
          "--bf-bg": "#fff5f2",
          "--bf-font": ROUNDED,
          "--bf-tag": "#8a4634",
          "--bf-tag-transform": "none",
          "--bf-tag-size": "0.68rem",
          "--bf-tag-ls": "0.02em",
          "--bf-head-font": ROUNDED,
          "--bf-head-color": "#9c3B26",
          "--bf-head-size": "1.6rem",
          "--bf-head-weight": "700",
          "--bf-head-ls": "0em",
          "--bf-sub-color": "#8a4634",
          "--bf-sub-size": "0.8rem",
          "--bf-body-color": "#6b4034",
          "--bf-btn-bg": "#c2452c",
          "--bf-btn-fg": "#fff5f2",
          "--bf-btn-font": ROUNDED,
          "--bf-btn-weight": "700",
          "--bf-btn-radius": "999px",
        },
      },
    ],
  },
};

export const FIGURE_KEYS = Object.keys(FIGURES);

export function isFigureKey(v) {
  return typeof v === "string" && Object.hasOwn(FIGURES, v);
}

// Markdown sentinel: an image whose src uses the `figure:` scheme, e.g.
//   ![](figure:type-mood-craft)
// Returns the figure key when `src` names a registered figure, else undefined.
// Anything unregistered falls through and renders as an ordinary image.
const SCHEME = "figure:";

export function figureKeyFromSrc(src) {
  if (typeof src !== "string" || !src.startsWith(SCHEME)) return undefined;
  const key = src.slice(SCHEME.length);
  return isFigureKey(key) ? key : undefined;
}
