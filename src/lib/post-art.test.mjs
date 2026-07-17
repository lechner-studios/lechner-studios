import { test } from "node:test";
import assert from "node:assert/strict";
import { artSpec, FAMILIES } from "./post-art.mjs";

const CATS = ["Web & Design", "Apps & Automation", "SEO & Growth"];

test("is deterministic: the same slug and category give deep-equal output", () => {
  const a = artSpec("what-a-website-costs", "Web & Design");
  const b = artSpec("what-a-website-costs", "Web & Design");
  assert.deepEqual(a, b);
});

test("different slugs give different output", () => {
  const a = artSpec("what-a-website-costs", "Web & Design");
  const b = artSpec("technical-seo-checklist", "Web & Design");
  assert.notDeepEqual(a, b);
});

test("category selects the family, so posts in a pillar look related", () => {
  for (const cat of CATS) {
    const a = artSpec("slug-one", cat);
    const b = artSpec("slug-two", cat);
    assert.equal(a.family, b.family);
    assert.equal(a.family, FAMILIES[cat]);
  }
});

test("an unknown category falls back to a valid family rather than throwing", () => {
  const spec = artSpec("some-slug", "Not A Real Category");
  assert.ok(Object.values(FAMILIES).includes(spec.family));
});

test("always emits at least one shape", () => {
  for (const cat of CATS) {
    for (const slug of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
      assert.ok(artSpec(slug, cat).shapes.length > 0, `${slug}/${cat} produced no shapes`);
    }
  }
});

test("fills are CSS variables only, never hardcoded hex", () => {
  for (const cat of CATS) {
    for (const s of artSpec("what-a-website-costs", cat).shapes) {
      assert.match(s.fill, /^var\(--[a-z0-9-]+\)$/, `bad fill: ${s.fill}`);
      assert.doesNotMatch(s.fill, /#[0-9a-f]{3,6}/i);
    }
  }
});

test("shape opacity stays in a subtle range", () => {
  for (const s of artSpec("connect-your-business-tools", "Apps & Automation").shapes) {
    assert.ok(s.opacity >= 0.15 && s.opacity <= 0.9, `opacity out of range: ${s.opacity}`);
  }
});

test("shapes stay inside the 100x100 viewBox", () => {
  for (const cat of CATS) {
    for (const s of artSpec("getting-found-locally", cat).shapes) {
      if (s.kind === "rect") {
        assert.ok(s.x >= 0 && s.y >= 0 && s.x + s.w <= 100 && s.y + s.h <= 100, `rect escapes: ${JSON.stringify(s)}`);
      } else {
        assert.ok(s.x - s.r >= -1 && s.x + s.r <= 101, `circle escapes: ${JSON.stringify(s)}`);
      }
    }
  }
});
