import { test } from "node:test";
import assert from "node:assert/strict";
import { queryFor, pickIndex, choosePhoto, CATEGORY_IMAGE_QUERIES } from "./images.mjs";

test("queryFor uses the per-post override when present", () => {
  assert.equal(queryFor({ category: "Web & Design", imageQuery: "custom thing" }), "custom thing");
});
test("queryFor falls back to the category theme", () => {
  assert.equal(queryFor({ category: "SEO & Growth" }), CATEGORY_IMAGE_QUERIES["SEO & Growth"]);
});
test("queryFor falls back again for an unknown category", () => {
  assert.equal(queryFor({ category: "Nope" }), "minimal architecture");
});
test("queryFor ignores a blank override", () => {
  assert.equal(queryFor({ category: "SEO & Growth", imageQuery: "   " }), CATEGORY_IMAGE_QUERIES["SEO & Growth"]);
});
test("pickIndex is deterministic and in range", () => {
  assert.equal(pickIndex("what-a-website-costs", 15), pickIndex("what-a-website-costs", 15));
  for (const n of [1, 3, 15]) {
    const i = pickIndex("some-slug", n);
    assert.ok(i >= 0 && i < n, `${i} out of range for ${n}`);
  }
});
test("pickIndex handles empty result sets without throwing", () => {
  assert.equal(pickIndex("any", 0), 0);
});
test("every category maps to a distinct query", () => {
  const qs = Object.values(CATEGORY_IMAGE_QUERIES);
  assert.equal(new Set(qs).size, qs.length);
  assert.deepEqual(Object.keys(CATEGORY_IMAGE_QUERIES).sort(),
    ["Apps & Automation", "Brand & Identity", "SEO & Growth", "Web & Design"]);
});

const PHOTOS = [{ url: "a" }, { url: "b" }, { url: "c" }, { url: "d" }, { url: "e" }];
test("choosePhoto returns null on an empty set", () => {
  assert.equal(choosePhoto([], "slug"), null);
});
test("choosePhoto is deterministic for a slug when nothing is avoided", () => {
  assert.deepEqual(choosePhoto(PHOTOS, "getting-found-locally"), choosePhoto(PHOTOS, "getting-found-locally"));
});
test("choosePhoto skips an already-used url (dedupe)", () => {
  const first = choosePhoto(PHOTOS, "getting-found-locally");
  const second = choosePhoto(PHOTOS, "getting-found-locally", new Set([first.url]));
  assert.notEqual(second.url, first.url);
});
test("choosePhoto falls back to the hashed pick when every url is taken", () => {
  const taken = new Set(PHOTOS.map((p) => p.url));
  const chosen = choosePhoto(PHOTOS, "any-slug", taken);
  assert.ok(PHOTOS.includes(chosen));
});
