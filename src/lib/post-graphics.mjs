// Crafted technical graphics for the blog. One dark "engineering panel" family:
// self-hosted IBM Plex Mono, ink ground, sky/lake linework, gold used once as a
// mark. Deliberately dark in both site themes, the way a code editor is.
//
// These are plain data descriptors, not markup. Each builder below returns a
// { viewBox, title, nodes } spec describing rects/lines/paths/text — never a
// string of HTML/SVG. `renderGraphic()` resolves the {{TOKEN}}-style label
// references into plain strings and hands the result to PostGraphic.tsx,
// which maps nodes to real JSX elements. React escapes every text child it
// renders, so there is no HTML-injection sink anywhere in this pipeline: a
// post's frontmatter can only ever select *which* of the four fixed
// descriptors renders (GRAPHICS[key] is undefined for anything else), never
// influence what markup gets produced.
//
// Every graphic uses the same 1000x340 viewBox so slots are interchangeable.

const INK = "#15171A";
const HAIR = "#F7F8F8";
const SKY = "#8FA8C5";
const GOLD = "#B8944D";

// ---- node constructors -----------------------------------------------
// Each returns a plain object; PostGraphic.tsx reads these fields directly.
// `opacity` on rect/text/tspan-parts maps to fill-opacity; path distinguishes
// fill vs stroke opacity since it can use both.

const bgRect = () => ({ t: "rect", x: 0, y: 0, w: 1000, h: 340, rx: 6, fill: INK });
const borderRect = () => ({
  t: "rect", x: 0.5, y: 0.5, w: 999, h: 339, rx: 6,
  fill: "none", stroke: HAIR, strokeOpacity: "0.12",
});

// Label text whose content is a token, resolved later via `labels[token]`.
const lblToken = (x, y, label, fill, opacity = 1, anchor = "start") => ({
  t: "text", cls: "pg-lb", x, y, fill, opacity, anchor, label,
});
// Label text whose content is a literal string, never localized.
const lblText = (x, y, text, fill, opacity = 1, anchor = "start") => ({
  t: "text", cls: "pg-lb", x, y, fill, opacity, anchor, text,
});
// Monospace "code" text, always literal.
const codeText = (x, y, text, fill, opacity = 1) => ({
  t: "text", cls: "pg-c", x, y, fill, opacity, text,
});

function panel(title, nodes) {
  return { viewBox: "0 0 1000 340", title, nodes: [bgRect(), borderRect(), ...nodes] };
}

// ---------------------------------------------------------------- dom-diff
// Nested builder markup collapsing into noise vs four semantic tags.
const BUILDER = [
  '<div class="elementor-section">', '<div class="elementor-container">',
  '<div class="elementor-column">', '<div class="elementor-widget-wrap">',
  '<div class="elementor-widget">', '<div class="elementor-widget-container">',
  '<div class="elementor-heading">', '<div class="e-con-inner">',
  '<div class="jet-listing-dynamic">', '<div class="elementor-element">',
  '<div class="wpb_wrapper">', "<div>", "…",
];

// tag parts render in SKY with no opacity attribute; token parts render in
// HAIR at a fixed 0.92 opacity — mirrors the old tag-vs-substitution split.
const DOM_DIFF_ROWS = [
  { indent: 0, parts: [{ tag: "<main>" }] },
  { indent: 1, parts: [{ tag: "<article>" }] },
  { indent: 2, parts: [{ tag: "<h1>" }, { token: "W1" }, { tag: "</h1>" }] },
  { indent: 2, parts: [{ tag: "<p>" }, { token: "W2" }, { tag: "</p>" }] },
  { indent: 1, parts: [{ tag: "</article>" }] },
  { indent: 0, parts: [{ tag: "</main>" }] },
];

function domDiff() {
  const left = BUILDER.map((text, i) =>
    codeText(30 + i * 11, 84 + i * 18, text, HAIR, Math.max(0.16, 0.42 - i * 0.019).toFixed(3)),
  );
  const right = DOM_DIFF_ROWS.map(({ indent, parts }, n) => ({
    t: "tspans",
    x: 556 + indent * 18,
    y: 118 + n * 29,
    cls: "pg-c",
    parts: parts.map((p) =>
      "tag" in p ? { text: p.tag, fill: SKY } : { label: p.token, fill: HAIR, opacity: 0.92 },
    ),
  }));
  return panel("ALT", [
    { t: "line", x1: 500, y1: 26, x2: 500, y2: 314, stroke: HAIR, strokeOpacity: "0.10" },
    lblToken(30, 46, "L1", HAIR, 0.4),
    lblToken(470, 46, "L2", HAIR, 0.28, "end"),
    lblToken(556, 46, "L3", SKY),
    lblToken(970, 46, "L4", SKY, 0.65, "end"),
    { t: "line", x1: 556, y1: 58, x2: 590, y2: 58, stroke: GOLD, strokeWidth: 2 },
    ...left,
    ...right,
  ]);
}

// ---------------------------------------------------------------- node-flow
// Tools talking to each other. Right-angle routing, no bubbly SaaS curves.
function box(x, y, w, h, token, strong) {
  return [
    { t: "rect", x, y, w, h, rx: 3, fill: "none", stroke: strong ? SKY : HAIR, strokeOpacity: strong ? 0.85 : 0.3 },
    lblToken(x + w / 2, y + h / 2 + 4, token, strong ? SKY : HAIR, strong ? 1 : 0.55, "middle"),
  ];
}
const arrow = (x, y) => ({ t: "path", d: `M${x} ${y} l-7 -4 v8 z`, fill: SKY, fillOpacity: 0.85 });

function nodeFlow() {
  return panel("ALT", [
    lblToken(30, 46, "L1", SKY),
    { t: "line", x1: 30, y1: 58, x2: 64, y2: 58, stroke: GOLD, strokeWidth: 2 },
    ...box(40, 128, 190, 56, "N1", false),
    ...box(405, 128, 190, 56, "N2", true),
    ...box(770, 128, 190, 56, "N3", false),
    ...box(405, 246, 190, 50, "N4", false),
    { t: "line", x1: 230, y1: 156, x2: 398, y2: 156, stroke: SKY, strokeOpacity: 0.5 },
    arrow(405, 156),
    { t: "line", x1: 595, y1: 156, x2: 763, y2: 156, stroke: SKY, strokeOpacity: 0.5 },
    arrow(770, 156),
    { t: "path", d: "M500 184 V246", fill: "none", stroke: SKY, strokeOpacity: 0.35 },
    { t: "path", d: "M500 246 l-4 -7 h8 z", fill: SKY, fillOpacity: 0.5 },
    lblToken(500, 316, "L2", HAIR, 0.3, "middle"),
  ]);
}

// ---------------------------------------------------------------- load-waterfall
// A lean request waterfall: few bars, short. Illustrative, no measured numbers.
const REQ = [
  { l: "HTML", x: 300, w: 150, o: 0.95 },
  { l: "CSS", x: 330, w: 96, o: 0.72 },
  { l: "FONT", x: 352, w: 78, o: 0.58 },
  { l: "IMG", x: 372, w: 120, o: 0.44 },
  { l: "JS", x: 398, w: 52, o: 0.32 },
];
function loadWaterfall() {
  const rows = REQ.flatMap((r, i) => {
    const y = 116 + i * 38;
    return [
      lblText(40, y + 11, r.l, HAIR, 0.45),
      { t: "rect", x: 130, y, w: 700, h: 14, rx: 2, fill: HAIR, opacity: 0.05 },
      { t: "rect", x: r.x, y, w: r.w, h: 14, rx: 2, fill: SKY, opacity: r.o },
    ];
  });
  return panel("ALT", [
    lblToken(40, 46, "L1", SKY),
    { t: "line", x1: 40, y1: 58, x2: 74, y2: 58, stroke: GOLD, strokeWidth: 2 },
    lblToken(960, 46, "L2", HAIR, 0.28, "end"),
    { t: "line", x1: 130, y1: 86, x2: 130, y2: 316, stroke: HAIR, strokeOpacity: 0.16 },
    ...rows,
    { t: "line", x1: 560, y1: 96, x2: 560, y2: 306, stroke: SKY, strokeOpacity: 0.28, dash: "3 4" },
    lblToken(568, 306, "L3", SKY, 0.6),
  ]);
}

// ---------------------------------------------------------------- type-system
// Brand as a system: one specimen letter, a scale, the Alpine chips.
const CHIPS = [
  { c: "#D6CDBE", l: "STONE" },
  { c: SKY, l: "SKY" },
  { c: "#254268", l: "LAKE" },
  { c: "#5E8263", l: "PINE" },
];
const SPECIMEN_STYLE = { fontFamily: "Cormorant,Georgia,serif", fontSize: "196px", fontWeight: 700 };
const SCALE = [
  { y: 120, s: 26, t: "Cormorant 700" },
  { y: 158, s: 18, t: "General Sans 500" },
  { y: 190, s: 13, t: "IBM Plex Mono 400" },
];

function typeSystem() {
  const chips = CHIPS.flatMap((ch, i) => {
    const x = 556 + i * 104;
    return [
      { t: "rect", x, y: 228, w: 72, h: 40, rx: 3, fill: ch.c },
      lblText(x, 290, ch.l, HAIR, 0.4),
    ];
  });
  const scale = SCALE.map((r) => ({ ...codeText(556, r.y, r.t, HAIR, 0.75), style: { fontSize: `${r.s}px` } }));
  return panel("ALT", [
    { t: "line", x1: 500, y1: 26, x2: 500, y2: 314, stroke: HAIR, strokeOpacity: "0.10" },
    lblToken(30, 46, "L1", SKY),
    { t: "line", x1: 30, y1: 58, x2: 64, y2: 58, stroke: GOLD, strokeWidth: 2 },
    { t: "text", x: 40, y: 268, fill: HAIR, opacity: 0.9, style: SPECIMEN_STYLE, text: "Aa" },
    { t: "text", x: 330, y: 268, fill: GOLD, style: SPECIMEN_STYLE, text: "." },
    lblToken(556, 46, "L2", HAIR, 0.4),
    ...scale,
    ...chips,
  ]);
}

export const GRAPHICS = {
  "dom-diff": domDiff,
  "node-flow": nodeFlow,
  "load-waterfall": loadWaterfall,
  "type-system": typeSystem,
};

export const GRAPHIC_KEYS = Object.keys(GRAPHICS);
export function isGraphicKey(v) {
  return typeof v === "string" && Object.hasOwn(GRAPHICS, v);
}

// Default graphic per pillar category. Overridable per topic.
export const CATEGORY_GRAPHIC = {
  "Web & Design": "dom-diff",
  "Apps & Automation": "node-flow",
  "SEO & Growth": "load-waterfall",
  "Brand & Identity": "type-system",
};

function resolveText(label, text, labels) {
  if (label != null) return labels[label] ?? "";
  return text ?? "";
}

function resolveNode(node, labels) {
  if (node.t === "text") {
    const { label, text, ...rest } = node;
    return { ...rest, text: resolveText(label, text, labels) };
  }
  if (node.t === "tspans") {
    const { parts, ...rest } = node;
    return {
      ...rest,
      parts: parts.map(({ label, text, ...p }) => ({ ...p, text: resolveText(label, text, labels) })),
    };
  }
  return node;
}

// Render a graphic with its labels filled in. `labels` supplies the tokens the
// graphic declares; anything missing falls back to an empty string so a
// partial dictionary can never emit a raw {{TOKEN}} to a visitor. Returns a
// plain data descriptor — no HTML, no escaping — for PostGraphic.tsx to turn
// into JSX.
export function renderGraphic(key, labels = {}) {
  const build = GRAPHICS[key];
  if (!build) return null;
  const spec = build();
  return {
    viewBox: spec.viewBox,
    title: labels[spec.title] ?? "",
    nodes: spec.nodes.map((n) => resolveNode(n, labels)),
  };
}
