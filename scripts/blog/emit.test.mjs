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

test("writes the offer key when present", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-16", category: "Web & Design", keywords: ["a", "b", "c", "d", "e"], offer: "direktbucher" };
  emitPost("with-offer", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  const en = matter(fs.readFileSync(path.join(dir, "with-offer.en.md"), "utf8"));
  assert.equal(en.data.offer, "direktbucher");
});

test("omits the offer key entirely when absent, rather than writing undefined", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-16", category: "Web & Design", keywords: ["a", "b", "c", "d", "e"] };
  emitPost("no-offer", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  const raw = fs.readFileSync(path.join(dir, "no-offer.en.md"), "utf8");
  assert.doesNotMatch(raw, /offer/, "an absent offer must not appear in the file at all");
  const en = matter(raw);
  assert.equal("offer" in en.data, false);
});

test("writes image fields when present", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-17", category: "Web & Design", keywords: ["a","b","c","d","e"], image: "/blog/x.jpg", imageAlt: "alt", imageCredit: "Jane", imageCreditUrl: "https://www.pexels.com/@jane", imagePexelsUrl: "https://www.pexels.com/photo/1" };
  emitPost("with-img", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  const en = matter(fs.readFileSync(path.join(dir, "with-img.en.md"), "utf8"));
  assert.equal(en.data.image, "/blog/x.jpg");
  assert.equal(en.data.imageCredit, "Jane");
  assert.equal(en.data.imagePexelsUrl, "https://www.pexels.com/photo/1");
});
test("omits image fields entirely when absent", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-17", category: "Web & Design", keywords: ["a","b","c","d","e"] };
  emitPost("no-img", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  const raw = fs.readFileSync(path.join(dir, "no-img.en.md"), "utf8");
  assert.doesNotMatch(raw, /image/, "absent image fields must not appear at all");
});

test("writes the graphic key when present", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-18", category: "Web & Design", keywords: ["a","b","c","d","e"], graphic: "dom-diff" };
  emitPost("with-g", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  assert.equal(matter(fs.readFileSync(path.join(dir, "with-g.en.md"), "utf8")).data.graphic, "dom-diff");
});
test("omits the graphic key when absent", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blogemit-"));
  const fm = { title: "T", description: "D", excerpt: "E", date: "2026-07-18", category: "Web & Design", keywords: ["a","b","c","d","e"] };
  emitPost("no-g", { en: { frontmatter: fm, body: "B" }, de: { frontmatter: fm, body: "B" } }, dir);
  assert.doesNotMatch(fs.readFileSync(path.join(dir, "no-g.en.md"), "utf8"), /graphic/);
});
