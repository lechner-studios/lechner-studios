import { test } from "node:test";
import assert from "node:assert/strict";
import { lintPost } from "./lint.mjs";

const goodFm = {
  title: "Title here that is reasonable",
  description: "A meta description that is comfortably between fifty and a hundred and sixty characters long for SEO purposes here.",
  excerpt: "A short teaser that sits in the sixty to a hundred character window nicely.",
  date: "2026-06-19",
  category: "SEO & Growth",
  keywords: ["a", "b", "c", "d", "e"],
};
const goodBody = "Intro paragraph.\n\n## A section\n\nText. See [how we do SEO](/en/seo) or [get in touch](/en/contact).";

test("clean post passes", () => {
  assert.deepEqual(lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" }), []);
});

test("flags a price", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " It costs €3.900.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /price/i.test(x)));
});

test("flags a guarantee", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " We guarantee results.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /guarantee/i.test(x)));
});

test("flags a percent/metric claim", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " Traffic grew 40% in a month.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /metric|percent/i.test(x)));
});

test("flags missing internal links", () => {
  const v = lintPost({ frontmatter: goodFm, body: "Intro.\n\n## H\n\nNo links here at all.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /link/i.test(x)));
});

test("flags incomplete frontmatter", () => {
  const v = lintPost({ frontmatter: { ...goodFm, keywords: ["only", "three", "kw"] }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /keywords/i.test(x)));
});
