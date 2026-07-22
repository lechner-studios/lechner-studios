import { test } from "node:test";
import assert from "node:assert/strict";
import { PILLAR_LINKS, pillarLink } from "./pillar-links.mjs";

test("every topics.yaml pillar has a link target", () => {
  assert.deepEqual(Object.keys(PILLAR_LINKS).sort(), ["apps-automation", "brand", "seo", "webdesign"]);
});

test("webdesign points at the werk storefront, not the 301 route", () => {
  for (const locale of ["de", "en"]) {
    assert.equal(pillarLink("webdesign", locale), "https://werk.lechner-studios.at");
    assert.doesNotMatch(pillarLink("webdesign", locale), /\/webdesign/);
  }
});

test("the on-site pillars are locale-prefixed", () => {
  assert.equal(pillarLink("seo", "de"), "/de/seo");
  assert.equal(pillarLink("apps-automation", "en"), "/en/apps-automation");
  assert.equal(pillarLink("brand", "de"), "/de/brand");
});

test("unknown and inherited keys resolve to null, never a link", () => {
  for (const k of ["nope", "", "toString", "constructor", undefined, null, 42]) {
    assert.equal(pillarLink(k, "en"), null, String(k));
  }
});
