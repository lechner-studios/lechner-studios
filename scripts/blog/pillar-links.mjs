// Where a post's body must link for its pillar — the single source shared by
// writer.mjs (which tells the model what to emit) and lint.mjs (which rejects a
// post that emitted something else). One map, so the two cannot drift.
//
// Three pillars still have an on-site page. Web & Design does not: #118
// consolidated it into the werk storefront, and next.config.ts now only
// 301-redirects /:locale/webdesign there. lint.mjs previously REQUIRED that
// redirect, so every Web & Design post ever generated sends its readers through
// a 301 — and lands them on the storefront root rather than a relevant page.
//
// Functions rather than plain strings because three targets are locale-prefixed
// on-site paths and one is an absolute external URL.
export const PILLAR_LINKS = {
  webdesign: () => "https://werk.lechner-studios.at",
  "apps-automation": (locale) => `/${locale}/apps-automation`,
  seo: (locale) => `/${locale}/seo`,
  brand: (locale) => `/${locale}/brand`,
};

// Object.hasOwn, not `in`: "toString" must not resolve to a link.
export function pillarLink(pillar, locale) {
  if (typeof pillar !== "string" || !Object.hasOwn(PILLAR_LINKS, pillar)) return null;
  return PILLAR_LINKS[pillar](locale);
}
