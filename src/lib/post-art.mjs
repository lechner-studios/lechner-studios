// Pure geometry for the blog's generated brand art. No JSX here on purpose:
// this repo has node:test but no React test runner, so keeping the logic pure
// is what makes the determinism guarantee testable. PostArt.tsx is a thin
// renderer over artSpec().
//
// Everything is deterministic from the slug. No Math.random(), no Date — the
// art has to be byte-stable across static builds.

// Pillar category → geometry family. Posts in the same pillar look related.
export const FAMILIES = {
  "Web & Design": "grid",
  "Apps & Automation": "nodes",
  "SEO & Growth": "strata",
};

const FALLBACK_FAMILY = "grid";

// Fills are CSS variable names, never hex, so light/dark comes free from the
// existing palette (--accent #254268 light / #8FA8C5 dark, etc).
const FILLS = ["var(--accent)", "var(--accent-2)", "var(--border)"];

// FNV-1a. Small, stable, dependency-free.
export function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x0100_0193) >>> 0;
  }
  return h >>> 0;
}

// Mulberry32. Deterministic sequence from a seed.
function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function pickFill(rand) {
  return FILLS[Math.floor(rand() * FILLS.length)];
}

function opacity(rand) {
  // 0.15 to 0.9 — subtle enough to sit under an editorial headline.
  return Math.round((0.15 + rand() * 0.75) * 100) / 100;
}

function buildGrid(rand) {
  const shapes = [];
  const cell = 20;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (rand() < 0.55) continue;
      shapes.push({ kind: "rect", x: i * cell, y: j * cell, w: cell, h: cell, fill: pickFill(rand), opacity: opacity(rand) });
    }
  }
  return shapes;
}

function buildNodes(rand) {
  const shapes = [];
  const n = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < n; i++) {
    const r = Math.round((3 + rand() * 7) * 10) / 10;
    shapes.push({
      kind: "circle",
      x: Math.round((r + rand() * (100 - 2 * r)) * 10) / 10,
      y: Math.round((r + rand() * (100 - 2 * r)) * 10) / 10,
      r,
      fill: pickFill(rand),
      opacity: opacity(rand),
    });
  }
  return shapes;
}

function buildStrata(rand) {
  const shapes = [];
  let y = 0;
  while (y < 100) {
    const h = Math.round((6 + rand() * 14) * 10) / 10;
    shapes.push({ kind: "rect", x: 0, y, w: 100, h: Math.min(h, 100 - y), fill: pickFill(rand), opacity: opacity(rand) });
    y += h;
  }
  return shapes;
}

const BUILDERS = { grid: buildGrid, nodes: buildNodes, strata: buildStrata };

/**
 * Stable art description for a post. Same slug always yields the same spec.
 * Returns { family, seed, shapes } where each shape is plain data an SVG
 * renderer can map 1:1 onto <rect> / <circle>.
 */
export function artSpec(slug, category) {
  const family = FAMILIES[category] ?? FALLBACK_FAMILY;
  const seed = hash(slug);
  const rand = rng(seed);
  let shapes = BUILDERS[family](rand);
  // buildGrid can skip every cell on an unlucky seed. Never return nothing.
  if (shapes.length === 0) {
    shapes = [{ kind: "rect", x: 0, y: 40, w: 100, h: 20, fill: FILLS[0], opacity: 0.3 }];
  }
  return { family, seed, shapes };
}
