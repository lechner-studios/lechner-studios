import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import { emitPost } from "./emit.mjs";

test("writes slug.en.md + slug.de.md that re-parse to the same fields", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-06-19", category: "SEO & Growth", keywords: ["a", "b", "c", "d", "e"] };
  emitPost("my-slug", { en: { frontmatter: fm, body: "Body EN" }, de: { frontmatter: { ...fm, title: "T-de" }, body: "Body DE" } }, dir);
  const en = matter(fs.readFileSync(path.join(dir, "my-slug.en.md"), "utf8"));
  const de = matter(fs.readFileSync(path.join(dir, "my-slug.de.md"), "utf8"));
  assert.equal(en.data.title, "T");
  assert.equal(en.content.trim(), "Body EN");
  assert.equal(de.data.title, "T-de");
  assert.deepEqual(en.data.keywords, ["a", "b", "c", "d", "e"]);
});
