import { test } from "node:test";
import assert from "node:assert/strict";
import { OFFERS, OFFER_ORDER, DEFAULT_OFFER, isOfferKey } from "./offers.mjs";

test("isOfferKey accepts exactly the keys in OFFERS", () => {
  for (const k of Object.keys(OFFERS)) assert.equal(isOfferKey(k), true, `${k} should be valid`);
  assert.equal(isOfferKey("websitecheck"), false);
  assert.equal(isOfferKey("website_check"), false);
  assert.equal(isOfferKey(""), false);
  assert.equal(isOfferKey(undefined), false);
  assert.equal(isOfferKey(null), false);
  assert.equal(isOfferKey(42), false);
  // Object.hasOwn, not `in` — inherited keys must not pass.
  assert.equal(isOfferKey("toString"), false);
  assert.equal(isOfferKey("constructor"), false);
});

test("every OFFERS entry has its own key as .key", () => {
  for (const [k, o] of Object.entries(OFFERS)) assert.equal(o.key, k);
});

test("OFFER_ORDER contains every OFFERS key exactly once", () => {
  const ordered = OFFER_ORDER.map((o) => o.key).sort();
  assert.deepEqual(ordered, Object.keys(OFFERS).sort());
});

test("OFFER_ORDER starts with website-check, matching HomeOffers' dict order", () => {
  assert.equal(OFFER_ORDER[0].key, "website-check");
  assert.equal(OFFER_ORDER[1].key, "direktbucher");
});

test("DEFAULT_OFFER is a valid key", () => {
  assert.equal(isOfferKey(DEFAULT_OFFER), true);
});

test("every offer has de/en prices, an absolute werk href, and an accent", () => {
  for (const o of Object.values(OFFERS)) {
    assert.ok(o.price.de.length > 0, `${o.key} missing de price`);
    assert.ok(o.price.en.length > 0, `${o.key} missing en price`);
    // #118 moved these offers to the werk storefront. The href is absolute and
    // callers must not locale-prefix it; a relative path would only 301-hop.
    assert.ok(o.href.startsWith("https://werk.lechner-studios.at/"), `${o.key} href must be an absolute werk URL`);
    // A palette token, never a fixed hex. The accent paints an edge on --card,
    // which changes between themes, so a hardcoded colour cannot stay legible
    // in both: lake-navy measured 1.53 against the dark card before this.
    assert.match(o.accent, /^var\(--[a-z0-9-]+\)$/, `${o.key} accent must be a palette token`);
    assert.doesNotMatch(o.accent, /#[0-9a-f]{3,6}/i, `${o.key} accent must not hardcode a hex`);
  }
});
