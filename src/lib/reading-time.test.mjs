import { test } from "node:test";
import assert from "node:assert/strict";
import { readingTime } from "./reading-time.mjs";

function words(n) {
  return Array(n).fill("word").join(" ");
}

test("empty body returns 1, never 0", () => {
  assert.equal(readingTime(""), 1);
  assert.equal(readingTime(undefined), 1);
  assert.equal(readingTime(null), 1);
  assert.equal(readingTime("   \n\n  "), 1);
});

test("~200 words returns 1", () => {
  assert.equal(readingTime(words(200)), 1);
});

test("~450 words returns 3", () => {
  assert.equal(readingTime(words(450)), 3);
});

test("markdown syntax (##, links, backticks) is not counted as extra words", () => {
  // 10 headed sections. Each contributes exactly 20 real words: 1 from the
  // heading text ("H0".."H9"), 17 plain body words, 1 from a link's anchor
  // text (the URL itself must not count), and 1 from backtick-wrapped inline
  // code. 200 real words total — exactly on the 1-minute boundary.
  //
  // A naive whitespace split (one that does NOT strip the "## " marker)
  // would count each standalone "##" token as an extra word per section —
  // 210 words, which crosses into a 2-minute result. Asserting exactly 1
  // here only passes if the "##" markers are correctly excluded.
  const sections = [];
  for (let i = 0; i < 10; i++) {
    sections.push(`## H${i}\n${words(17)} [linkword](https://example.com/path/${i}) \`codeword\``);
  }
  const body = sections.join("\n\n");
  assert.equal(readingTime(body), 1);
});

test("identical body yields identical result (pure, no mutation)", () => {
  const body = "## Title\n\nSome [text](https://example.com) with `code` and prose.";
  const before = body;
  const first = readingTime(body);
  const second = readingTime(body);
  assert.equal(first, second);
  assert.equal(body, before);
});
