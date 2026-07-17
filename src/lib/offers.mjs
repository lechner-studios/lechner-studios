// Single source of truth for the two productized offers: key, href, title,
// price, accent.
//
// This is .mjs, not .ts, on purpose: scripts/blog/lint.mjs runs under bare node
// and cannot import TypeScript. Both Next (.tsx) and the blog generator import
// this same file. Types live in the sibling offers.d.mts (TS pairs .mjs with
// .d.mts, not .d.ts).
//
// The € amounts here are intentional public marketing figures and are exempted
// in .layer0-allow. Keeping them in this one module — and out of the shared copy
// dictionary — is what lets the Layer-0 currency scan stay active over all other
// site copy.
//
// Hrefs are ABSOLUTE: #118 consolidated Web & Design into the werk storefront,
// so the on-site routes are gone and next.config.ts only 301-redirects them.
// Callers link to href as-is and must not locale-prefix it.
export const OFFERS = {
  "website-check": {
    key: "website-check",
    href: "https://werk.lechner-studios.at/website-check",
    title: "Website-Check",
    price: { de: "€290", en: "€290" },
    accent: "#254268",
  },
  "direktbucher": {
    key: "direktbucher",
    href: "https://werk.lechner-studios.at/pension-website-tirol",
    title: "Direktbucher",
    price: { de: "ab €3.900", en: "from €3,900" },
    accent: "#5E8263",
  },
};

// Display order for the homepage band. HomeOffers maps this positionally onto
// dict.homeOffers.items, so the order here must stay (check, then direkt).
export const OFFER_ORDER = [OFFERS["website-check"], OFFERS["direktbucher"]];

// Posts without an explicit `offer:` in topics.yaml fall back to this. It is the
// low-commitment entry offer, which suits nearly every topic.
export const DEFAULT_OFFER = "website-check";

// Object.hasOwn, not `in`: "toString" must not validate as an offer key.
export function isOfferKey(v) {
  return typeof v === "string" && Object.hasOwn(OFFERS, v);
}
