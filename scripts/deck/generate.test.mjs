// Unit tests for the deck HTML builder (pure/deterministic).
// Run: node --test scripts/deck/generate.test.mjs
//
// Only buildDeckHtml is exercised — renderDeckPdf drives a real browser and is
// verified by actually rendering a sample deck, not in unit tests.

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildDeckHtml } from "./generate.mjs";

const DECK = {
  title: "Lechner Studios — Capabilities",
  overline: "Family studio · Tirol",
  subtitle: "Web, apps, growth, and brand.",
  pillars: [
    { key: "stone", kicker: "Web & Design", title: "Sites that earn trust", points: ["a", "b"] },
    { key: "sky", kicker: "Apps & Automation", title: "Software", points: ["c"] },
    { key: "lake", kicker: "SEO & Growth", title: "Found", points: ["d"] },
    { key: "pine", kicker: "Brand & Identity", title: "Brand", points: ["e"] },
  ],
  closing: { title: "Let's build yours", line: "lechner-studios.at" },
};

const OPTS = { fontBase: "file:///fonts" };

test("emits a valid HTML document", () => {
  const html = buildDeckHtml(DECK, OPTS);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<\/html>\s*$/);
});

test("one slide per pillar plus cover and closing", () => {
  const html = buildDeckHtml(DECK, OPTS);
  const slides = html.match(/class="slide/g) || [];
  assert.equal(slides.length, DECK.pillars.length + 2);
  assert.match(html, /class="slide cover"/);
  assert.match(html, /class="slide closing"/);
});

test("carries canonical v4.1 tokens", () => {
  const html = buildDeckHtml(DECK, OPTS);
  assert.ok(html.includes("#15171A"), "ink token present");
  assert.ok(html.includes("#B8944D"), "gold token present");
  assert.ok(html.includes("#254268"), "pillar lake present");
});

test("renders the wordmark with gold dot", () => {
  const html = buildDeckHtml(DECK, OPTS);
  assert.match(html, /class="wm-l">lechner</);
  assert.match(html, /class="wm-dot"[^>]*>\./);
  assert.match(html, /class="wm-s">studios</);
});

test("uses the pinned fontBase for @font-face", () => {
  const html = buildDeckHtml(DECK, OPTS);
  assert.ok(html.includes("file:///fonts/cormorant-variable.woff2"));
});

test("escapes HTML-significant characters in content", () => {
  const html = buildDeckHtml({
    ...DECK,
    pillars: [{ key: "lake", kicker: "K", title: "A <b> & C", points: ["x < y"] }],
  }, OPTS);
  assert.ok(html.includes("A &lt;b&gt; &amp; C"));
  assert.ok(html.includes("x &lt; y"));
  assert.ok(!html.includes("A <b> & C"));
});

test("is deterministic", () => {
  assert.equal(buildDeckHtml(DECK, OPTS), buildDeckHtml(DECK, OPTS));
});
