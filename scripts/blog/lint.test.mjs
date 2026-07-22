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

test("accepts a valid offer key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, offer: "direktbucher" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("accepts an absent offer key", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("rejects an unknown offer key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, offer: "websitecheck" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /offer/i.test(x)));
});

test("accepts a valid /blog/ image path", () => {
  const v = lintPost({ frontmatter: { ...goodFm, image: "/blog/x.jpg" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("accepts an absent image", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("rejects an image that is a remote hotlink, not a /blog/ path", () => {
  const v = lintPost({ frontmatter: { ...goodFm, image: "https://images.pexels.com/x.jpg" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /image/i.test(x)));
});

test("accepts a valid graphic key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, graphic: "dom-diff" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("rejects an unknown graphic key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, graphic: "nope" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /graphic/i.test(x)));
});

test("accepts a valid widget key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, widget: "portal-commission" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("accepts an absent widget key", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("rejects an unknown widget key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, widget: "nope" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /widget/i.test(x)));
});

test("accepts a body with 0 dashes", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("accepts a body with 6 dashes (at the cap)", () => {
  const dashy = goodBody + " A – b – c – d – e – f – g.";
  assert.equal((dashy.match(/[—–]/g) || []).length, 6);
  const v = lintPost({ frontmatter: goodFm, body: dashy, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("rejects a body with 7 dashes (over the cap)", () => {
  const dashy = goodBody + " A – b – c – d – e – f – g – h.";
  assert.equal((dashy.match(/[—–]/g) || []).length, 7);
  const v = lintPost({ frontmatter: goodFm, body: dashy, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /cadence/i.test(x)));
});

test("accepts the clean goodFm title (no intensifier)", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("rejects a title containing 'wirklich'", () => {
  const v = lintPost({ frontmatter: { ...goodFm, title: "Braucht Ihr Unternehmen wirklich eine neue Website?" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /title/i.test(x) && /intensifier/i.test(x)));
});

test("rejects a title with the 'X – und warum nicht' formula", () => {
  const v = lintPost({ frontmatter: { ...goodFm, title: "Ein neues Logo – und warum nicht" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /title/i.test(x) && /formula/i.test(x)));
});
