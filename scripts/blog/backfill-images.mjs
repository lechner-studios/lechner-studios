// One-off: fetch and self-host a Pexels photo for every already-published post
// that lacks one. Inserts the image fields into the EXISTING frontmatter with a
// surgical text edit (js-yaml dump, no line-folding), so the diff is +image
// lines only — it does NOT re-serialize the whole file the way gray-matter
// round-tripping would. Dedupes photos across posts. Writes files only; the
// human reviews the picks and commits.
//
//   node --env-file=.env.local scripts/blog/backfill-images.mjs [--dry-run]
//
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { fetchPhoto } from "./images.mjs";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const OUT_DIR = path.join(ROOT, "public", "blog");
const IMAGE_FIELDS = ["image", "imageAlt", "imageCredit", "imageCreditUrl", "imagePexelsUrl"];
const dryRun = process.argv.includes("--dry-run");

// --slug=a,b,c restricts the run to named posts. Without it every post lacking
// an image is fetched, which is rarely what you want now that most posts carry
// a crafted graphic instead.
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const onlySlugs = slugArg ? new Set(slugArg.slice("--slug=".length).split(",").map((s) => s.trim()).filter(Boolean)) : null;

const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) { console.error("PEXELS_API_KEY not set (use --env-file=.env.local)"); process.exit(1); }

// Insert the image fields at the end of the existing frontmatter block, leaving
// every existing line byte-for-byte. lineWidth:-1 keeps long URLs on one line.
function insertImageFields(file, img) {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^(---\r?\n[\s\S]*?\n)(---\r?\n)/);
  if (!m) throw new Error(`no frontmatter in ${file}`);
  const ordered = {};
  for (const k of IMAGE_FIELDS) ordered[k] = img[k];
  const block = yaml.dump(ordered, { lineWidth: -1, quotingType: '"' });
  fs.writeFileSync(file, m[1] + block + m[2] + raw.slice(m[0].length));
}

const enFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".en.md")).sort();
console.log(`${enFiles.length} posts found.\n`);

const usedUrls = new Set();
let done = 0, skipped = 0, failed = 0;
for (const enFile of enFiles) {
  const slug = enFile.slice(0, -".en.md".length);
  const enPath = path.join(BLOG_DIR, `${slug}.en.md`);
  const dePath = path.join(BLOG_DIR, `${slug}.de.md`);
  const { data: enFm } = matter(fs.readFileSync(enPath, "utf8"));
  if (onlySlugs && !onlySlugs.has(slug)) { skipped++; continue; }
  if (enFm.image) { console.log(`  skip  ${slug} (already has image)`); usedUrls.add(enFm.imagePexelsUrl); skipped++; continue; }
  // A crafted graphic outranks a photo at render, so fetching one would spend
  // API quota and commit a jpg nothing displays. Same guard as generate.mjs.
  if (enFm.graphic) { console.log(`  skip  ${slug} (has graphic "${enFm.graphic}")`); skipped++; continue; }
  if (!fs.existsSync(dePath)) { console.warn(`  WARN  ${slug} has no .de.md — skipping`); skipped++; continue; }

  try {
    const img = await fetchPhoto({
      post: { category: String(enFm.category || ""), imageQuery: enFm.imageQuery },
      slug, apiKey, outDir: OUT_DIR, avoidUrls: usedUrls,
    });
    if (!img) { console.warn(`  MISS  ${slug} (no usable photo)`); failed++; continue; }
    usedUrls.add(img.imagePexelsUrl);

    console.log(`  ok    ${slug}  [${enFm.category}]`);
    console.log(`        ${img.imageCredit} | ${img.imagePexelsUrl}`);

    if (!dryRun) { insertImageFields(enPath, img); insertImageFields(dePath, img); }
    done++;
  } catch (e) {
    console.error(`  FAIL  ${slug}: ${e.message}`);
    failed++;
  }
}

console.log(`\nDone. ${done} fetched, ${skipped} skipped, ${failed} failed.${dryRun ? " (dry-run: no files written)" : ""}`);
