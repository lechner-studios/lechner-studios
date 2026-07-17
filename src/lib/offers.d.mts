export type OfferKey = "website-check" | "direktbucher";

export type Offer = {
  key: OfferKey;
  /** ABSOLUTE werk storefront URL. Never locale-prefixed. */
  href: string;
  /** Brand name. Never translated. */
  title: string;
  price: { de: string; en: string };
  /** Per-offer brand hex for the card's inset top edge. */
  accent: string;
};

export declare const OFFERS: Record<OfferKey, Offer>;
export declare const OFFER_ORDER: Offer[];
export declare const DEFAULT_OFFER: OfferKey;
export declare function isOfferKey(v: unknown): v is OfferKey;
