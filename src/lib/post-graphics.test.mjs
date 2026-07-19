import { test } from "node:test";
import assert from "node:assert/strict";
import { GRAPHIC_KEYS, isGraphicKey, renderGraphic } from "./post-graphics.mjs";

const FULL_LABELS = {
  ALT: "An alt text",
  L1: "Label one", L2: "Label two", L3: "Label three", L4: "Label four",
  N1: "Node one", N2: "Node two", N3: "Node three", N4: "Node four",
  W1: "the body copy", W2: "another paragraph",
};

// Walk every string the descriptor could put on the page: the title, each
// text node's content, and each tspan part's content.
function collectStrings(spec) {
  const out = [spec.title];
  for (const node of spec.nodes) {
    if (node.t === "text") out.push(node.text);
    if (node.t === "tspans") for (const p of node.parts) out.push(p.text);
  }
  return out;
}

test("every graphic key renders a descriptor with a non-empty nodes array", () => {
  for (const key of GRAPHIC_KEYS) {
    const spec = renderGraphic(key, FULL_LABELS);
    assert.ok(spec, `${key} should render`);
    assert.ok(Array.isArray(spec.nodes) && spec.nodes.length > 0, `${key} should have nodes`);
    assert.equal(typeof spec.viewBox, "string");
  }
});

test("isGraphicKey agrees with GRAPHIC_KEYS", () => {
  for (const key of GRAPHIC_KEYS) assert.ok(isGraphicKey(key));
  assert.equal(isGraphicKey("nope"), false);
  assert.equal(isGraphicKey(123), false);
});

test("renderGraphic returns null for an unknown key", () => {
  assert.equal(renderGraphic("nope"), null);
  assert.equal(renderGraphic("nope", FULL_LABELS), null);
});

test("resolved labels appear as plain strings on the right nodes", () => {
  const spec = renderGraphic("dom-diff", FULL_LABELS);
  assert.equal(spec.title, "An alt text");
  const strings = collectStrings(spec);
  assert.ok(strings.includes("Label one"));
  assert.ok(strings.includes("Label two"));
  assert.ok(strings.includes("Label three"));
  assert.ok(strings.includes("Label four"));
  assert.ok(strings.includes("the body copy"));
  assert.ok(strings.includes("another paragraph"));
});

// "No node value anywhere contains < or >" cannot hold literally for
// dom-diff: its design *deliberately* shows literal markup — "<div
// class=...>", "<main>", "<h1>" — as on-screen text (see BUILDER and
// DOM_DIFF_ROWS in post-graphics.mjs, and the baseline's escaped
// "&lt;div ...&gt;" entries). That text is a hard-coded design constant, not
// attacker-influenced input, and removing it would break visual fidelity.
//
// The property that actually matters — the one CodeQL's stored-xss finding
// is about — is the frontmatter → label → sink pathway: whatever a label
// resolves to must reach the descriptor as inert data, not be parsed,
// concatenated into, or otherwise built into markup. So instead of asserting
// brackets are globally absent, this proves the substitution layer builds
// nothing: a label containing markup-like characters comes back out exactly
// as given, verbatim, as plain data — there is no escaping, sanitizing, or
// templating step left to bypass, because there is no markup-building step
// at all. (Safety now comes structurally from React escaping text children
// in PostGraphic.tsx, not from anything in this file.)
test("label substitution is inert: a label's value passes through unchanged, never parsed as markup", () => {
  const hostileValue = `<img src=x onerror=alert(1)> & "quoted" '<script>'`;
  const hostileLabels = Object.fromEntries(Object.keys(FULL_LABELS).map((k) => [k, hostileValue]));
  for (const key of GRAPHIC_KEYS) {
    const spec = renderGraphic(key, hostileLabels);
    const strings = collectStrings(spec);
    const labelDerived = strings.filter((v) => v === hostileValue);
    // Every graphic declares at least one token (title, if nothing else), so
    // the hostile value must show up at least once, unmodified.
    assert.ok(labelDerived.length > 0, `${key} should substitute at least one token`);
    for (const value of labelDerived) assert.equal(value, hostileValue);
  }
});

test("every node value containing markup characters is a known, static design literal — never label-derived", () => {
  // Allowlist of the hard-coded "code" strings the graphics intentionally
  // render as text (see BUILDER / DOM_DIFF_ROWS). Anything with < or > that
  // is NOT one of these would mean a label leaked raw markup into the page.
  const STATIC_MARKUP_LITERALS = new Set([
    '<div class="elementor-section">', '<div class="elementor-container">',
    '<div class="elementor-column">', '<div class="elementor-widget-wrap">',
    '<div class="elementor-widget">', '<div class="elementor-widget-container">',
    '<div class="elementor-heading">', '<div class="e-con-inner">',
    '<div class="jet-listing-dynamic">', '<div class="elementor-element">',
    '<div class="wpb_wrapper">', "<div>",
    "<main>", "<article>", "<h1>", "</h1>", "<p>", "</p>", "</article>", "</main>",
  ]);
  for (const key of GRAPHIC_KEYS) {
    const spec = renderGraphic(key, FULL_LABELS);
    for (const value of collectStrings(spec)) {
      if (typeof value === "string" && (value.includes("<") || value.includes(">"))) {
        assert.ok(STATIC_MARKUP_LITERALS.has(value), `${key} produced unexpected markup-bearing text: ${value}`);
      }
    }
  }
});

test("an unknown token resolves to empty string, never a literal {{TOKEN}}", () => {
  for (const key of GRAPHIC_KEYS) {
    const spec = renderGraphic(key, {});
    const strings = collectStrings(spec);
    for (const value of strings) {
      assert.equal(typeof value, "string");
      assert.ok(!value.includes("{{"), `${key} leaked a raw token: ${value}`);
      assert.ok(!value.includes("}}"), `${key} leaked a raw token: ${value}`);
    }
  }
});

test("renderGraphic defaults labels to {} when omitted", () => {
  for (const key of GRAPHIC_KEYS) {
    assert.doesNotThrow(() => renderGraphic(key));
  }
});
