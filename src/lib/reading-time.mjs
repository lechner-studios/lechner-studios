// Pure reading-time estimate for a post body.
//
// This is .mjs, not .ts, matching the repo's established pattern (see
// offers.mjs, post-graphics.mjs): both Next (.tsx) and any bare-node script
// can import it without a build step. Types live in the sibling
// reading-time.d.mts (TS pairs .mjs with .d.mts, not .d.ts — the latter is
// silently ignored for a .mjs import and every call site degrades to `any`).
//
// Reading time is computed from the body at render time, never stored in
// frontmatter — that keeps it honest when a post is edited and avoids one
// more field a writer could get stale.

const WORDS_PER_MINUTE = 200;

// Strips the markdown constructs explicitly called out as "must not count as
// extra words": ATX headings ("## Heading"), link syntax ("[text](url)" —
// keep the anchor text, drop the URL), and backticks (inline code and fenced
// blocks) — without discarding the actual prose inside any of them.
function stripMarkdownSyntax(text) {
  return text
    // Fenced code blocks: drop the ``` fence markers, keep the code content
    // (a reader does still read code shown in a post).
    .replace(/```/g, "")
    // Inline code: `code` -> code. Function-form replacer, not a numbered
    // backreference string — a literal dollar sign immediately followed by a
    // digit trips the repo's Layer-0 pre-commit currency scan, which can't
    // tell a regex backreference apart from a currency amount.
    .replace(/`([^`]*)`/g, (_match, inner) => inner)
    // ATX headings: "## Heading" -> "Heading" (the "#" markers are not words).
    .replace(/^#{1,6}\s+/gm, "")
    // Links: "[text](url)" -> "text" (the URL is not prose).
    .replace(/\[([^\]]*)\]\([^)]*\)/g, (_match, anchorText) => anchorText);
}

function countWords(body) {
  if (!body) return 0;
  const stripped = stripMarkdownSyntax(String(body)).trim();
  if (!stripped) return 0;
  const matches = stripped.match(/\S+/g);
  return matches ? matches.length : 0;
}

/**
 * Estimated reading time in whole minutes, rounded up, minimum 1.
 * Pure: same body always yields the same result; never mutates its input.
 */
export function readingTime(body, wordsPerMinute = WORDS_PER_MINUTE) {
  const words = countWords(body);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
