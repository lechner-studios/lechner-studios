// Lechner Studios — capability / brand deck generator.
//
// Builds an on-brand 16:9 deck as self-contained HTML (canonical v4.1 tokens,
// self-hosted fonts, four-pillar framing) and renders it to PDF via Playwright
// — mirroring scripts/render-assets.mjs rather than adding a new toolchain.
//
// Two layers, so the deck HTML is always produced even without a browser:
//   1. buildDeckHtml(deck, opts) — pure, deterministic HTML. Always produced.
//   2. renderDeckPdf(htmlPath, pdfPath) — Playwright chromium → multi-page PDF.
//
// Usage:
//   node scripts/deck/generate.mjs [input.json] [--out=path.pdf] [--dry-run]
//   # --dry-run writes only the .html (no browser needed)

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..");
const FONT_DIR = resolve(repoRoot, "public", "fonts");

// Canonical cool-Alpine v4.1 tokens (CONVENTIONS.md → globals.css).
const TOKENS = {
  ink: "#15171A",
  paper: "#F7F8F8",
  warmWhite: "#FBFCFC",
  gold: "#B8944D",
  goldOnDark: "#C9A961",
};

// Pillar surface → AA-safe text pairing (per scripts/brand-card.html).
const PILLARS = {
  stone: { bg: "#D6CDBE", fg: "#4A4131", accent: "#B8944D" },
  sky: { bg: "#8FA8C5", fg: "#1A2638", accent: "#1A2638" },
  lake: { bg: "#254268", fg: "#FDFBF8", accent: "#C9A961" },
  pine: { bg: "#5E8263", fg: "#FDFBF8", accent: "#FDFBF8" },
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function fontFaces(fontBase) {
  // fontBase lets tests pin a deterministic path; default resolves real files.
  const u = (file) =>
    fontBase ? `${fontBase}/${file}` : pathToFileURL(resolve(FONT_DIR, file)).href;
  return [
    `@font-face{font-family:'Cormorant';src:url('${u("cormorant-variable.woff2")}') format('woff2');font-weight:300 700;font-style:normal;font-display:swap;}`,
    `@font-face{font-family:'Cormorant';src:url('${u("cormorant-italic-variable.woff2")}') format('woff2');font-weight:300 700;font-style:italic;font-display:swap;}`,
    `@font-face{font-family:'Italiana';src:url('${u("italiana-400.woff2")}') format('woff2');font-weight:400;font-style:normal;font-display:swap;}`,
    `@font-face{font-family:'General Sans';src:url('${u("general-sans-400.woff2")}') format('woff2');font-weight:400;font-style:normal;font-display:swap;}`,
    `@font-face{font-family:'General Sans';src:url('${u("general-sans-600.woff2")}') format('woff2');font-weight:600;font-style:normal;font-display:swap;}`,
    `@font-face{font-family:'IBM Plex Mono';src:url('${u("ibm-plex-mono-500.woff2")}') format('woff2');font-weight:500;font-style:normal;font-display:swap;}`,
  ].join("\n");
}

function wordmark(color = TOKENS.ink, gold = TOKENS.gold) {
  return `<span class="wm" style="color:${color}"><span class="wm-l">lechner</span><span class="wm-dot" style="color:${gold}">.</span><span class="wm-s">studios</span></span>`;
}

function coverSlide(deck) {
  const overline = deck.overline ? `<p class="overline">${esc(deck.overline)}</p>` : "";
  const subtitle = deck.subtitle ? `<p class="cover-sub">${esc(deck.subtitle)}</p>` : "";
  return `<section class="slide cover">
  ${overline}
  <h1 class="cover-mark">${wordmark()}</h1>
  ${subtitle}
</section>`;
}

function pillarSlide(pillar) {
  const p = PILLARS[pillar.key] || PILLARS.lake;
  const points = (pillar.points || [])
    .map((pt) => `<li>${esc(pt)}</li>`)
    .join("\n      ");
  return `<section class="slide pillar" style="background:${p.bg};color:${p.fg}">
  <p class="overline" style="color:${p.accent}">${esc(pillar.kicker)}</p>
  <h2 class="pillar-title">${esc(pillar.title)}</h2>
  <ul class="points">
      ${points}
  </ul>
</section>`;
}

function closingSlide(deck) {
  const c = deck.closing || {};
  const line = c.line ? `<p class="closing-line">${esc(c.line)}</p>` : "";
  return `<section class="slide closing">
  <h2 class="closing-title">${esc(c.title || "Let's build yours")}</h2>
  ${line}
  <div class="closing-mark">${wordmark(TOKENS.warmWhite, TOKENS.goldOnDark)}</div>
</section>`;
}

/** Build a complete, self-contained deck HTML document (pure/deterministic). */
export function buildDeckHtml(deck, opts = {}) {
  const slides = [
    coverSlide(deck),
    ...(deck.pillars || []).map(pillarSlide),
    closingSlide(deck),
  ].join("\n");

  const css = `
${fontFaces(opts.fontBase)}
:root{--ink:${TOKENS.ink};--paper:${TOKENS.paper};--gold:${TOKENS.gold};}
*{margin:0;padding:0;box-sizing:border-box;}
@page{size:1280px 720px;margin:0;}
html,body{background:var(--paper);}
.slide{width:1280px;height:720px;padding:88px 104px;display:flex;flex-direction:column;
  justify-content:center;overflow:hidden;page-break-after:always;position:relative;}
.slide:last-child{page-break-after:auto;}
.overline{font-family:'IBM Plex Mono',monospace;font-weight:500;text-transform:uppercase;
  letter-spacing:.28em;font-size:19px;color:var(--gold);margin-bottom:28px;}
.cover{background:var(--paper);color:var(--ink);}
.wm{font-family:'Cormorant',Georgia,serif;font-weight:700;letter-spacing:-.01em;}
.wm-s{font-family:'Italiana',Georgia,serif;font-weight:400;}
.cover-mark{font-size:112px;line-height:1;margin-bottom:28px;}
.cover-sub{font-family:'Cormorant',Georgia,serif;font-size:40px;line-height:1.3;
  color:var(--ink);max-width:60ch;}
.pillar-title{font-family:'Cormorant',Georgia,serif;font-weight:600;font-size:76px;
  line-height:1.05;margin-bottom:34px;max-width:22ch;}
.points{list-style:none;display:flex;flex-direction:column;gap:18px;}
.points li{font-family:'General Sans',system-ui,sans-serif;font-size:29px;line-height:1.4;
  padding-left:34px;position:relative;max-width:40ch;}
.points li::before{content:"";position:absolute;left:0;top:.62em;width:16px;height:2px;
  background:currentColor;opacity:.55;}
.closing{background:var(--ink);color:${TOKENS.warmWhite};align-items:flex-start;}
.closing-title{font-family:'Cormorant',Georgia,serif;font-weight:600;font-size:88px;
  line-height:1.05;margin-bottom:22px;}
.closing-line{font-family:'IBM Plex Mono',monospace;font-size:24px;letter-spacing:.1em;
  color:${TOKENS.goldOnDark};margin-bottom:60px;}
.closing-mark{font-size:56px;}
`;

  return `<!DOCTYPE html>
<html lang="${esc(deck.lang || "en")}">
<head>
<meta charset="utf-8">
<title>${esc(deck.title || "Lechner Studios")}</title>
<style>${css}</style>
</head>
<body>
${slides}
</body>
</html>
`;
}

/** Render a deck HTML file to a multi-page PDF via Playwright chromium. */
export async function renderDeckPdf(htmlPath, pdfPath) {
  // Lazy import so the pure buildDeckHtml layer never requires the browser dep.
  const { chromium } = await import("playwright");
  // Honour a pre-installed Chromium (e.g. sandboxed CI) when pointed at one;
  // otherwise use Playwright's managed browser.
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
    });
    await page.pdf({ path: pdfPath, printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}

function loadDeck(inputPath) {
  return JSON.parse(readFileSync(inputPath, "utf8"));
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const outArg = args.find((a) => a.startsWith("--out="));
  const inputArg = args.find((a) => !a.startsWith("--"));

  const inputPath = inputArg
    ? resolve(process.cwd(), inputArg)
    : resolve(__dirname, "sample-deck.json");
  const outPdf = outArg
    ? resolve(process.cwd(), outArg.slice("--out=".length))
    : resolve(repoRoot, "public", "capability-deck.pdf");
  const outHtml = outPdf.replace(/\.pdf$/i, ".html");

  const deck = loadDeck(inputPath);
  mkdirSync(dirname(outPdf), { recursive: true });
  writeFileSync(outHtml, buildDeckHtml(deck), "utf8");
  console.log(`wrote ${outHtml}`);

  if (dryRun) {
    console.log("dry run — skipped PDF render");
    return;
  }
  await renderDeckPdf(outHtml, outPdf);
  console.log(`wrote ${outPdf}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
