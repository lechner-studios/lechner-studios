import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { loadTopics, readPublished, pickTopic } from "./topics.mjs";
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

  // Generate + lint, retrying on lint failure — the model occasionally trips a
  // scope/structure rule; a fresh generation usually clears it.
  let post;
  let violations = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    post = await writePost({ ...picked, pillarPath: picked.pillar, date, apiKey });
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

  const outDir = dryRun ? fs.mkdtempSync(path.join(os.tmpdir(), "blog-dry-")) : BLOG_DIR;
  const files = emitPost(picked.slug, post, outDir);
  console.log("Wrote:\n" + files.join("\n"));

  if (dryRun) {
    console.log("\n--- DRY RUN: en post ---\n" + fs.readFileSync(files[0], "utf8"));
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
