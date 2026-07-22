// Closed registry of interactive post widgets (src/components/widgets/).
// Mirrors post-graphics.mjs's key-validation shape exactly, for the same
// reason: plain ESM so bare-node lint.mjs can import it (a .ts file cannot be
// imported by node). Types live in the sibling post-widgets.d.mts — never
// .d.ts, which TypeScript silently ignores for a .mjs source, making every
// import untyped (any).
//
// A post's frontmatter can only ever select *which* of these fixed widgets
// renders (isWidgetKey gates it) — never author new markup or behaviour.
// That closed-registry shape is the whole reason MDX was rejected for posts:
// posts are LLM-generated, and every existing guardrail (lint.mjs's price/
// guarantee/metric bans) assumes plain text, not arbitrary JSX.
export const WIDGET_KEYS = ["portal-commission"];

export function isWidgetKey(v) {
  return typeof v === "string" && WIDGET_KEYS.includes(v);
}
