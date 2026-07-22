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
 * Usage:  node scripts/render-brand-card.mjs
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import { chromium } from "playwright";

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

  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  console.log(`rendered ${WIDTH}x${HEIGHT} → public/og-image.png`);
} finally {
  await browser.close();
  server.close();
}
