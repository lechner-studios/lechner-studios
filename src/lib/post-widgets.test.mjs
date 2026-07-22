import { test } from "node:test";
import assert from "node:assert/strict";
import { WIDGET_KEYS, isWidgetKey } from "./post-widgets.mjs";

test("isWidgetKey accepts every key in WIDGET_KEYS", () => {
  for (const k of WIDGET_KEYS) assert.equal(isWidgetKey(k), true, `${k} should be valid`);
});

test("isWidgetKey rejects unknown values", () => {
  assert.equal(isWidgetKey("nope"), false);
  assert.equal(isWidgetKey(""), false);
  assert.equal(isWidgetKey(null), false);
  assert.equal(isWidgetKey(undefined), false);
  assert.equal(isWidgetKey(42), false);
  // Array#includes, not an object-key lookup, but guard the same prototype
  // keys the other key-validators guard against for consistency.
  assert.equal(isWidgetKey("toString"), false);
  assert.equal(isWidgetKey("constructor"), false);
});
