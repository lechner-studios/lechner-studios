import { test } from "node:test";
import assert from "node:assert/strict";
import { systemPrompt } from "./writer.mjs";

const base = {
  category: "Web & Design", keyword: "Direktbuchung", intent: "angle",
  slug: "a-slug", date: "2026-07-22", pillarPath: "webdesign", locale: "en",
};

test("no correction block on the first attempt", () => {
  for (const v of [undefined, null, []]) {
    const p = systemPrompt({ ...base, violations: v });
    assert.doesNotMatch(p, /PREVIOUS ATTEMPT WAS REJECTED/, String(v));
  }
});

test("violations reach the prompt verbatim", () => {
  const violations = [
    "cadence: 7 dashes in the body (max 6) — remove at least 1, using commas, colons or shorter sentences",
    'cadence: intensifier padding in the body ("Actually") — the sentence is stronger without it',
  ];
  const p = systemPrompt({ ...base, violations });
  assert.match(p, /PREVIOUS ATTEMPT WAS REJECTED/);
  // The whole point is the specifics: a count and an exact word.
  for (const v of violations) assert.ok(p.includes(v), `missing: ${v}`);
  assert.match(p, /remove at least 1/);
  assert.match(p, /"Actually"/);
});

test("the correction block is the last thing in the prompt before the sign-off", () => {
  const p = systemPrompt({ ...base, violations: ["cadence: something"], recentTitles: ["An older title"] });
  assert.ok(p.indexOf("PREVIOUS ATTEMPT") > p.indexOf("RECENT TITLES"), "correction must follow recent titles");
});

test("the pillar link in the prompt is the werk storefront, not the 301", () => {
  const p = systemPrompt(base);
  assert.match(p, /\[text\]\(https:\/\/werk\.lechner-studios\.at\)/);
  assert.doesNotMatch(p, /\[text\]\(\/en\/webdesign\)/);
});

test("the example rule names the marker and rejects the bare 'concrete example' opener", () => {
  const p = systemPrompt(base);
  assert.match(p, /openly hypothetical/i);
  assert.match(p, /is NOT a marker/);
});
