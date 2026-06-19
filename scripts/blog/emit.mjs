import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const FIELD_ORDER = ["title", "description", "excerpt", "date", "category", "keywords"];

function writeOne(dir, slug, locale, { frontmatter, body }) {
  // Order fields to match existing posts (gray-matter stringify preserves insertion order).
  const ordered = {};
  for (const k of FIELD_ORDER) ordered[k] = frontmatter[k];
  const file = matter.stringify(`${body}\n`, ordered);
  fs.writeFileSync(path.join(dir, `${slug}.${locale}.md`), file, "utf8");
}

// Writes both locale files. Returns the two paths.
export function emitPost(slug, { en, de }, blogDir) {
  fs.mkdirSync(blogDir, { recursive: true });
  writeOne(blogDir, slug, "en", en);
  writeOne(blogDir, slug, "de", de);
  return [path.join(blogDir, `${slug}.en.md`), path.join(blogDir, `${slug}.de.md`)];
}
