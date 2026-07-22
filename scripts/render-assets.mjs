// Render the brand card to public/og-image.png (1200x630),
// rasterize public/favicon.svg into PNGs at 16/32/48/180/192/512,
// and render the wordmark to public/logo.png (1280x400).
//
// Usage: node scripts/render-assets.mjs
// Requires: npx playwright install chromium

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const FAVICON_SVG_PATH = resolve(repoRoot, "public", "favicon.svg");
const BRAND_CARD_PATH = resolve(__dirname, "brand-card.html");
const FONT_DIR = resolve(repoRoot, "public", "fonts");

const PNG_SIZES = [
  { size: 16, file: "favicon-16.png" },
  { size: 32, file: "favicon-32.png" },
  // Google Search picks the SERP site icon from a multiple of 48px and
  // disregards smaller rasters.
  { size: 48, file: "favicon-48.png" },
  { size: 180, file: "apple-touch-icon.png" },
  { size: 192, file: "android-chrome-192.png" },
  { size: 512, file: "android-chrome-512.png" },
];

// schema.org Organization.logo. Geometry mirrors the inline variant of
// src/components/Wordmark.tsx; Google requires >=112x112 and asks that the
// logo read on a purely white background.
const LOGO = {
  w: 1280,
  h: 400,
  size: 200,
  // Baseline centres the 145px cap-height of "lechner" in the canvas.
  baseline: 271,
  ink: "#15171A",
  gold: "#B8944D",
};

async function rasterizeFaviconPngs(browser) {
  const svg = readFileSync(FAVICON_SVG_PATH, "utf8");
  for (const { size, file } of PNG_SIZES) {
    const ctx = await browser.newContext({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const html = `<!DOCTYPE html>
<html><head><style>
  html,body { margin:0; padding:0; width:${size}px; height:${size}px; overflow:hidden; background:transparent; }
  svg { width:${size}px; height:${size}px; display:block; }
</style></head><body>${svg}</body></html>`;
    await page.setContent(html, { waitUntil: "networkidle" });
    const out = resolve(repoRoot, "public", file);
    await page.screenshot({ path: out, omitBackground: true, type: "png" });
    await ctx.close();
    console.log(`  wrote ${file} (${size}x${size})`);
  }
}

async function renderOgImage(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(`file://${BRAND_CARD_PATH.replace(/\\/g, "/")}`, {
    waitUntil: "networkidle",
  });
  // Give web fonts a beat to settle
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });
  const out = resolve(repoRoot, "public", "og-image.png");
  await page.screenshot({
    path: out,
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  await ctx.close();
  console.log(`  wrote og-image.png (1200x630)`);
}

// The wordmark is drawn as SVG text rather than assembled from measured
// glyph advances: Chromium shapes it with HarfBuzz, so kerning matches what
// the live site renders. Fonts are the repo's own woff2 over file://, never
// a CDN, so this is reproducible offline and stays on the self-hosting rule.
function logoHtml() {
  // Inlined as data URIs, not file:// URLs: setContent() leaves the page on an
  // about:blank origin, from which Chromium refuses to fetch file://
  // subresources, and the wordmark would silently fall back to a system serif.
  const fontUrl = (f) =>
    `data:font/woff2;base64,${readFileSync(resolve(FONT_DIR, f)).toString("base64")}`;
  const { w, h, size, baseline, ink, gold } = LOGO;
  return `<!DOCTYPE html>
<html><head><style>
  @font-face { font-family:'Cormorant'; font-weight:700; font-style:normal;
    src:url('${fontUrl("cormorant-700.woff2")}') format('woff2'); }
  @font-face { font-family:'Italiana'; font-weight:400; font-style:normal;
    src:url('${fontUrl("italiana-400.woff2")}') format('woff2'); }
  html,body { margin:0; padding:0; width:${w}px; height:${h}px; overflow:hidden; background:#FFFFFF; }
  svg { display:block; }
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#FFFFFF"/>
  <text x="${w / 2}" y="${baseline}" text-anchor="middle" fill="${ink}">
    <tspan font-family="Cormorant" font-weight="700" font-size="${size}"
           letter-spacing="-0.025em">lechner</tspan><tspan
           font-family="Cormorant" font-weight="700" font-size="${size * 0.32}"
           fill="${gold}" dx="${size * 0.02}">.</tspan><tspan
           font-family="Italiana" font-weight="400" font-size="${size * 0.85}"
           dx="${size * 0.02}">studios</tspan>
  </text>
</svg>
</body></html>`;
}

async function renderLogo(browser) {
  const { w, h } = LOGO;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(logoHtml(), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  // Fail loudly rather than shipping a Georgia-fallback wordmark.
  const ok = await page.evaluate(
    () =>
      document.fonts.check("700 200px Cormorant") &&
      document.fonts.check("400 170px Italiana"),
  );
  if (!ok) throw new Error("Cormorant/Italiana did not load from public/fonts");

  const out = resolve(repoRoot, "public", "logo.png");
  await page.screenshot({ path: out, type: "png", clip: { x: 0, y: 0, width: w, height: h } });
  await ctx.close();
  console.log(`  wrote logo.png (${w}x${h})`);
}

// Pack the 16/32/48 PNGs into src/app/favicon.ico, which Next's app-router
// file convention then serves at /favicon.ico. Built from the same PNGs
// rasterized above so the .ico can never drift from favicon.svg. ICO is just
// a directory of embedded images, so no encoder dependency is needed.
const ICO_SIZES = [16, 32, 48];

function buildFaviconIco() {
  const pngs = ICO_SIZES.map((s) =>
    readFileSync(resolve(repoRoot, "public", `favicon-${s}.png`)),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  const dir = Buffer.alloc(16 * pngs.length);
  let offset = header.length + dir.length;
  pngs.forEach((png, i) => {
    const s = ICO_SIZES[i];
    const e = i * 16;
    dir.writeUInt8(s >= 256 ? 0 : s, e + 0); // width (0 means 256)
    dir.writeUInt8(s >= 256 ? 0 : s, e + 1); // height
    dir.writeUInt8(0, e + 2); // palette size
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // colour planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(png.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });

  const out = resolve(repoRoot, "src", "app", "favicon.ico");
  writeFileSync(out, Buffer.concat([header, dir, ...pngs]));
  console.log(`  wrote favicon.ico (${ICO_SIZES.join("/")})`);
}

(async () => {
  const browser = await chromium.launch();
  try {
    console.log("rasterizing favicon PNGs:");
    await rasterizeFaviconPngs(browser);
    console.log("packing favicon.ico:");
    buildFaviconIco();
    console.log("rendering OG brand card:");
    await renderOgImage(browser);
    console.log("rendering wordmark logo:");
    await renderLogo(browser);
  } finally {
    await browser.close();
  }
})();
