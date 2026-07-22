import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { loadTopics, readPublished, pickTopic, readRecentTitles } from "./topics.mjs";
import { writePost } from "./writer.mjs";
import { emitPost } from "./emit.mjs";
import { lintPost } from "./lint.mjs";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const TOPICS_PATH = path.join(BLOG_DIR, "topics.yaml");
const dryRun = process.argv.includes("--dry-run");
// Optional owner override: generate one specific topic by slug — from the
// workflow's `topic` input (TARGET_SLUG) or a local `--slug=<slug>` arg.
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const targetSlug = ((slugArg ? slugArg.slice("--slug=".length) : process.env.TARGET_SLUG) || "").trim() || undefined;

function isoToday() {
  // GHA Node has Date; pass via env for sandboxes that block Date.
  return process.env.POST_DATE || new Date().toISOString().slice(0, 10);
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const topics = loadTopics(TOPICS_PATH);
  const { slugs, pillarCounts } = readPublished(BLOG_DIR);
  const picked = pickTopic({ topics, existingSlugs: slugs, pillarCounts, targetSlug });
  if (!picked) {
    console.error(targetSlug
      ? `Target topic "${targetSlug}" not found in topics.yaml or already published.`
      : "No uncovered topics left — refill content/blog/topics.yaml.");
    process.exit(2);
  }
  const date = isoToday();
  console.log(`Generating: [${picked.pillar}] ${picked.slug} — "${picked.keyword}"`);

  // Recent titles per locale, newest first — the only variety signal a
  // one-post-at-a-time generator has to avoid converging on a formula.
  // Computed once (titles don't change across retries below).
  const recentTitles = {
    en: readRecentTitles(BLOG_DIR, "en", 8),
    de: readRecentTitles(BLOG_DIR, "de", 8),
  };

  // Generate + lint, retrying on lint failure — the model occasionally trips a
  // scope/structure rule; a fresh generation usually clears it.
  let post;
  let violations = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    post = await writePost({ ...picked, pillarPath: picked.pillar, date, apiKey, recentTitles });
    // `offer` is owner data from topics.yaml, never model output — the writer is
    // deliberately not told about offers, so its "NO prices" rule stays true.
    if (picked.offer !== undefined) {
      post.en.frontmatter.offer = picked.offer;
      post.de.frontmatter.offer = picked.offer;
    }
    // Crafted graphic per pillar, overridable per topic (topics.yaml `graphic:`).
    // `graphic: none` opts a topic out entirely, which is the only way to reach
    // the Pexels photo path below — a graphic always outranks a photo at render.
    const { CATEGORY_GRAPHIC, isGraphicKey } = await import("../../src/lib/post-graphics.mjs");
    const optedOut = picked.graphic === "none";
    const g = optedOut
      ? null
      : isGraphicKey(picked.graphic)
        ? picked.graphic
        : CATEGORY_GRAPHIC[picked.category];
    if (g) { post.en.frontmatter.graphic = g; post.de.frontmatter.graphic = g; }
    // Optional interactive widget (topics.yaml `widget:`), owner data — same
    // as offer/graphic, never model output. No category default exists (only
    // one widget key so far), so an invalid or absent value simply attaches
    // nothing; lintPost below is the net that catches a typo.
    const { isWidgetKey } = await import("../../src/lib/post-widgets.mjs");
    if (isWidgetKey(picked.widget)) {
      post.en.frontmatter.widget = picked.widget;
      post.de.frontmatter.widget = picked.widget;
    }
    const enViol = lintPost({ frontmatter: post.en.frontmatter, body: post.en.body, pillarPath: picked.pillar, locale: "en" });
    const deViol = lintPost({ frontmatter: post.de.frontmatter, body: post.de.body, pillarPath: picked.pillar, locale: "de" });
    violations = [...enViol.map((x) => `[en] ${x}`), ...deViol.map((x) => `[de] ${x}`)];
    if (!violations.length) break;
    console.error(`Attempt ${attempt}/3 — lint failed:\n` + violations.join("\n"));
  }
  if (violations.length) {
    console.error("Lint failed after 3 attempts:\n" + violations.join("\n"));
    process.exit(3);
  }

  // Fetch a self-hosted photo (Pexels) ONLY when no graphic was assigned. A
  // graphic always outranks a photo at render, so fetching one anyway would
  // spend API quota and commit a jpg that never displays. Set `graphic: none`
  // on a topic to opt into this path.
  //
  // Generation-time only either way; the browser never calls Pexels. A post
  // without a photo is still valid, so a failure warns and continues.
  if (post.en.frontmatter.graphic) {
    console.log(`Graphic "${post.en.frontmatter.graphic}" assigned — skipping photo fetch.`);
  } else if (process.env.PEXELS_API_KEY) {
    try {
      const { fetchPhoto } = await import("./images.mjs");
      const img = await fetchPhoto({
        post: picked,
        slug: picked.slug,
        apiKey: process.env.PEXELS_API_KEY,
        outDir: path.join(ROOT, "public", "blog"),
      });
      if (img) {
        Object.assign(post.en.frontmatter, img);
        Object.assign(post.de.frontmatter, img);
      } else {
        console.warn(`No Pexels photo for "${picked.slug}" — post ships without one.`);
      }
    } catch (e) {
      console.warn(`Pexels fetch failed for "${picked.slug}": ${e.message} — post ships without one.`);
    }
  } else {
    console.warn("PEXELS_API_KEY not set — post ships without a photo.");
  }

  const outDir = dryRun ? fs.mkdtempSync(path.join(os.tmpdir(), "blog-dry-")) : BLOG_DIR;
  const files = emitPost(picked.slug, post, outDir);
  console.log("Wrote:\n" + files.join("\n"));

  if (dryRun) {
    // Both locales, not just en. de-AT is the primary market and the one where
    // the cadence rules carry real linguistic risk, since the Gedankenstrich is
    // correct German punctuation. A dry run that hides the German post cannot
    // verify the thing most likely to go wrong.
    for (const file of files) {
      const locale = path.basename(file).split(".").at(-2);
      console.log(`\n--- DRY RUN: ${locale} post ---\n` + fs.readFileSync(file, "utf8"));
    }
    return;
  }

  // Build check — proves the post renders + sitemap regenerates.
  console.log("Running build check…");
  execSync("npm run build", { cwd: ROOT, stdio: "inherit" });

  // Emit outputs for the workflow (branch name + PR title/body) via GITHUB_OUTPUT.
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    fs.appendFileSync(out, `slug=${picked.slug}\n`);
    fs.appendFileSync(out, `pillar=${picked.category}\n`);
    fs.appendFileSync(out, `keyword=${picked.keyword}\n`);
  }
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
