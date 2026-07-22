#!/usr/bin/env node
/**
 * Render scripts/brand-card.html → public/og-image.png (1200x630).
 *
 * Why Playwright rather than resvg/sharp: the card is typeset in Cormorant +
 * Italiana. Vector rasterisers resolve fonts through fontconfig and only find
 * the faces if they are installed system-wide. Headless Chromium instead loads
 * the same self-hosted @font-face declarations the live site uses, so the
 * output matches what visitors actually see.
 *
 * The card references /public/fonts/*.woff2, so it is served over a local
 * static server rooted at the repo (file:// would block the font fetches).
 * No network access required.
 *
 * This script is the ONLY writer of public/og-image.png. render-assets.mjs used
 * to render it too, over file://, where the absolute /public/fonts/ URLs resolve
 * to the filesystem root and silently fall back to Georgia. That path is gone.
 *
 * Usage:  node scripts/render-brand-card.mjs
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "og-image.png");
const WIDTH = 1200;
const HEIGHT = 630;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    // Strip query, prevent path traversal.
    const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
    const abs = join(ROOT, rel);
    if (!abs.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    const body = await readFile(abs);
    res.writeHead(200, { "content-type": MIME[extname(abs)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  await page.goto(`http://127.0.0.1:${port}/scripts/brand-card.html`, {
    waitUntil: "networkidle",
  });

  // Fail loudly rather than silently shipping a fallback-serif render.
  await page.evaluate(() => document.fonts.ready);
  const fontsOk = await page.evaluate(() =>
    document.fonts.check('700 100px Cormorant') && document.fonts.check('400 85px Italiana'),
  );
  if (!fontsOk) throw new Error("Cormorant/Italiana did not load — refusing to render a fallback-serif card.");

  const raw = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });

  // Chromium's PNG encoder is tuned for speed, not size, and the card's grain
  // (a dot lattice plus an feTurbulence overlay) is high-frequency noise that
  // defeats PNG's row filters — the unoptimised file is ~482 KB.
  //
  // PALETTE_COLOURS is 256 deliberately, and is NOT a knob to turn down. The
  // whole card holds only ~1842 distinct RGB values, so a 256-entry palette is
  // effectively lossless (measured mean absolute error 0.01/255) and roughly
  // halves the file. Below 256 the quantiser stops preserving the grain and
  // starts dithering it: in a flat 150x90 patch the source has 14 distinct
  // colours, 256 keeps all 14, and 128 collapses to 2, replacing the regular
  // lattice with irregular dither noise. 128/64/32 all produce the same ~74 KB
  // for that reason — once the texture is gone, palette size stops mattering.
  const PALETTE_COLOURS = 256;
  await sharp(raw)
    .png({ palette: true, colors: PALETTE_COLOURS, effort: 10, dither: 1.0 })
    .toFile(OUT);

  const { size } = await stat(OUT);
  console.log(
    `rendered ${WIDTH}x${HEIGHT} → public/og-image.png (${(size / 1024).toFixed(1)} KB)`,
  );
} finally {
  await browser.close();
  server.close();
}
