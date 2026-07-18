// One-off: retire the committed stock photos in favour of crafted graphics.
// For every published post, sets `graphic` from CATEGORY_GRAPHIC (skipped if
// already set) and strips the five image fields. Surgical text edit — same
// technique as backfill-images.mjs — so the diff is exactly the image lines
// removed plus one graphic line added; every other line stays byte-identical
// (no gray-matter round-trip, which would re-flow quoting/wrapping on every
// file it touches).
//
//   node scripts/blog/apply-graphics.mjs [--dry-run]
//
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CATEGORY_GRAPHIC } from "../../src/lib/post-graphics.mjs";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const IMAGE_FIELDS = ["image", "imageAlt", "imageCredit", "imageCreditUrl", "imagePexelsUrl"];
const dryRun = process.argv.includes("--dry-run");

function fieldLineRegex(field) {
  return new RegExp(`^${field}:[^\\r\\n]*\\r?\\n`, "m");
}

// Removes the image lines and appends a graphic line, all inside the
// frontmatter block only — never touching the closing delimiter or body.
// Returns null when the file had nothing to change.
function applyOne(file) {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^(---\r?\n[\s\S]*?\n)(---\r?\n)/);
  if (!m) return `no frontmatter`;
  const fmBlock = m[1];
  const close = m[2];
  const rest = raw.slice(m[0].length);
  const { data } = matter(raw);

  // The inserted graphic line matches whatever line-ending style the file's
  // own last image line used, rather than normalizing every line to LF.
  let terminator = "\n";
  const termMatch = fmBlock.match(/^imagePexelsUrl:[^\r\n]*(\r?\n)/m);
  if (termMatch) terminator = termMatch[1];

  let body = fmBlock;
  let touched = false;
  for (const field of IMAGE_FIELDS) {
    const re = fieldLineRegex(field);
    if (re.test(body)) { body = body.replace(re, ""); touched = true; }
  }

  if (data.graphic === undefined) {
    const key = CATEGORY_GRAPHIC[String(data.category || "")];
    if (key) { body += `graphic: ${key}${terminator}`; touched = true; }
  }

  if (!touched) return null;
  if (!dryRun) fs.writeFileSync(file, body + close + rest);
  return "ok";
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).sort();
let changed = 0, skipped = 0;
for (const f of files) {
  const result = applyOne(path.join(BLOG_DIR, f));
  if (result === "ok") { console.log(`  ok    ${f}`); changed++; }
  else if (result === null) { console.log(`  skip  ${f} (nothing to change)`); skipped++; }
  else { console.warn(`  WARN  ${f}: ${result}`); skipped++; }
}
console.log(`\nDone. ${changed} updated, ${skipped} skipped.${dryRun ? " (dry-run: no files written)" : ""}`);
