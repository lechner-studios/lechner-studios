// Crafted technical graphics for the blog. One dark "engineering panel" family:
// self-hosted IBM Plex Mono, ink ground, sky/lake linework, gold used once as a
// mark. Deliberately dark in both site themes, the way a code editor is.
//
// These are SVG strings rather than JSX so the preview tooling and the site
// render byte-identical output. Labels are tokenised ({{L1}}…) and filled per
// locale by the renderer, which is only possible because the SVG is inlined in
// the page rather than referenced as a flat .svg file.
//
// Every graphic uses the same 1000x340 viewBox so slots are interchangeable.

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const INK = "#15171A";
const HAIR = "#F7F8F8";
const SKY = "#8FA8C5";
const GOLD = "#B8944D";

function panel(inner) {
  return [
    '<svg viewBox="0 0 1000 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pgT">',
    '<title id="pgT">{{ALT}}</title>',
    `<rect x="0" y="0" width="1000" height="340" rx="6" fill="${INK}"/>`,
    `<rect x="0.5" y="0.5" width="999" height="339" rx="6" fill="none" stroke="${HAIR}" stroke-opacity="0.12"/>`,
    inner,
    "</svg>",
  ].join("\n");
}

const lbl = (x, y, text, fill, op = 1, anchor = "start") =>
  `<text x="${x}" y="${y}" class="pg-lb" text-anchor="${anchor}" fill="${fill}" fill-opacity="${op}">${text}</text>`;

const code = (x, y, text, fill, op = 1) =>
  `<text x="${x}" y="${y}" class="pg-c" fill="${fill}" fill-opacity="${op}">${esc(text)}</text>`;

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

function domDiff() {
  let left = "";
  BUILDER.forEach((t, i) => {
    left += code(30 + i * 11, 84 + i * 18, t, HAIR, Math.max(0.16, 0.42 - i * 0.019).toFixed(3)) + "\n";
  });
  const rows = [
    [0, [["<main>", 1]]],
    [1, [["<article>", 1]]],
    [2, [["<h1>", 1], ["{{W1}}", 0], ["</h1>", 1]]],
    [2, [["<p>", 1], ["{{W2}}", 0], ["</p>", 1]]],
    [1, [["</article>", 1]]],
    [0, [["</main>", 1]]],
  ];
  let right = "";
  rows.forEach(([ind, parts], n) => {
    let ts = "";
    for (const [t, isTag] of parts) {
      ts += isTag
        ? `<tspan fill="${SKY}">${esc(t)}</tspan>`
        : `<tspan fill="${HAIR}" fill-opacity="0.92">${t}</tspan>`;
    }
    right += `<text x="${556 + ind * 18}" y="${118 + n * 29}" class="pg-c">${ts}</text>\n`;
  });
  return panel([
    `<line x1="500" y1="26" x2="500" y2="314" stroke="${HAIR}" stroke-opacity="0.10"/>`,
    lbl(30, 46, "{{L1}}", HAIR, 0.4),
    lbl(470, 46, "{{L2}}", HAIR, 0.28, "end"),
    lbl(556, 46, "{{L3}}", SKY),
    lbl(970, 46, "{{L4}}", SKY, 0.65, "end"),
    `<line x1="556" y1="58" x2="590" y2="58" stroke="${GOLD}" stroke-width="2"/>`,
    left, right,
  ].join("\n"));
}

// ---------------------------------------------------------------- node-flow
// Tools talking to each other. Right-angle routing, no bubbly SaaS curves.
function nodeFlow() {
  const box = (x, y, w, h, text, strong) => [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="${strong ? SKY : HAIR}" stroke-opacity="${strong ? 0.85 : 0.3}"/>`,
    lbl(x + w / 2, y + h / 2 + 4, text, strong ? SKY : HAIR, strong ? 1 : 0.55, "middle"),
  ].join("\n");
  const arrow = (x, y) =>
    `<path d="M${x} ${y} l-7 -4 v8 z" fill="${SKY}" fill-opacity="0.85"/>`;
  return panel([
    lbl(30, 46, "{{L1}}", SKY),
    `<line x1="30" y1="58" x2="64" y2="58" stroke="${GOLD}" stroke-width="2"/>`,
    box(40, 128, 190, 56, "{{N1}}", false),
    box(405, 128, 190, 56, "{{N2}}", true),
    box(770, 128, 190, 56, "{{N3}}", false),
    box(405, 246, 190, 50, "{{N4}}", false),
    `<line x1="230" y1="156" x2="398" y2="156" stroke="${SKY}" stroke-opacity="0.5"/>`,
    arrow(405, 156),
    `<line x1="595" y1="156" x2="763" y2="156" stroke="${SKY}" stroke-opacity="0.5"/>`,
    arrow(770, 156),
    `<path d="M500 184 V246" fill="none" stroke="${SKY}" stroke-opacity="0.35"/>`,
    `<path d="M500 246 l-4 -7 h8 z" fill="${SKY}" fill-opacity="0.5"/>`,
    lbl(500, 316, "{{L2}}", HAIR, 0.3, "middle"),
  ].join("\n"));
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
  let rows = "";
  REQ.forEach((r, i) => {
    const y = 116 + i * 38;
    rows += lbl(40, y + 11, r.l, HAIR, 0.45) + "\n";
    rows += `<rect x="130" y="${y}" width="700" height="14" rx="2" fill="${HAIR}" fill-opacity="0.05"/>\n`;
    rows += `<rect x="${r.x}" y="${y}" width="${r.w}" height="14" rx="2" fill="${SKY}" fill-opacity="${r.o}"/>\n`;
  });
  return panel([
    lbl(40, 46, "{{L1}}", SKY),
    `<line x1="40" y1="58" x2="74" y2="58" stroke="${GOLD}" stroke-width="2"/>`,
    lbl(960, 46, "{{L2}}", HAIR, 0.28, "end"),
    `<line x1="130" y1="86" x2="130" y2="316" stroke="${HAIR}" stroke-opacity="0.16"/>`,
    rows,
    `<line x1="560" y1="96" x2="560" y2="306" stroke="${SKY}" stroke-opacity="0.28" stroke-dasharray="3 4"/>`,
    lbl(568, 306, "{{L3}}", SKY, 0.6),
  ].join("\n"));
}

// ---------------------------------------------------------------- type-system
// Brand as a system: one specimen letter, a scale, the Alpine chips.
const CHIPS = [
  { c: "#D6CDBE", l: "STONE" },
  { c: SKY, l: "SKY" },
  { c: "#254268", l: "LAKE" },
  { c: "#5E8263", l: "PINE" },
];
function typeSystem() {
  let chips = "";
  CHIPS.forEach((ch, i) => {
    const x = 556 + i * 104;
    chips += `<rect x="${x}" y="228" width="72" height="40" rx="3" fill="${ch.c}"/>\n`;
    chips += lbl(x, 290, ch.l, HAIR, 0.4) + "\n";
  });
  const scale = [
    { y: 120, s: 26, t: "Cormorant 700" },
    { y: 158, s: 18, t: "General Sans 500" },
    { y: 190, s: 13, t: "IBM Plex Mono 400" },
  ];
  let rows = "";
  scale.forEach((r) => {
    rows += `<text x="556" y="${r.y}" class="pg-c" style="font-size:${r.s}px" fill="${HAIR}" fill-opacity="0.75">${esc(r.t)}</text>\n`;
  });
  return panel([
    `<line x1="500" y1="26" x2="500" y2="314" stroke="${HAIR}" stroke-opacity="0.10"/>`,
    lbl(30, 46, "{{L1}}", SKY),
    `<line x1="30" y1="58" x2="64" y2="58" stroke="${GOLD}" stroke-width="2"/>`,
    `<text x="40" y="268" style="font-family:Cormorant,Georgia,serif;font-size:196px;font-weight:700" fill="${HAIR}" fill-opacity="0.9">Aa</text>`,
    `<text x="330" y="268" style="font-family:Cormorant,Georgia,serif;font-size:196px;font-weight:700" fill="${GOLD}">.</text>`,
    lbl(556, 46, "{{L2}}", HAIR, 0.4),
    rows,
    chips,
  ].join("\n"));
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

// Render a graphic with its labels filled in. `labels` supplies the tokens the
// graphic declares; anything missing falls back to an empty string so a partial
// dictionary can never emit a raw {{TOKEN}} to a visitor.
export function renderGraphic(key, labels = {}) {
  const build = GRAPHICS[key];
  if (!build) return null;
  return build().replace(/\{\{(\w+)\}\}/g, (_, k) => esc(labels[k] ?? ""));
}
