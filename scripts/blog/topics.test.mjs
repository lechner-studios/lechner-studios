import { test } from "node:test";
import assert from "node:assert/strict";
import { pickTopic } from "./topics.mjs";

const TOPICS = {
  webdesign: [{ slug: "a", keyword: "k-a", intent: "i" }, { slug: "b", keyword: "k-b", intent: "i" }],
  "apps-automation": [{ slug: "c", keyword: "k-c", intent: "i" }],
  seo: [{ slug: "d", keyword: "k-d", intent: "i" }],
};

test("skips slugs already published", () => {
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(["a"]), pillarCounts: { webdesign: 1, "apps-automation": 0, seo: 0 } });
  assert.notEqual(t.slug, "a");
});

test("prefers the pillar with the fewest published posts", () => {
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(), pillarCounts: { webdesign: 3, "apps-automation": 0, seo: 0 } });
  assert.ok(["apps-automation", "seo"].includes(t.pillar));
});

test("returns null when every topic is covered", () => {
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(["a", "b", "c", "d"]), pillarCounts: {} });
  assert.equal(t, null);
});

test("carries pillar + page path", () => {
  const t = pickTopic({ topics: TOPICS, existingSlugs: new Set(["a", "b", "d"]), pillarCounts: { webdesign: 2, "apps-automation": 0, seo: 1 } });
  assert.equal(t.slug, "c");
  assert.equal(t.pillar, "apps-automation");
});
