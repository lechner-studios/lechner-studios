export type GraphicKey = "dom-diff" | "node-flow" | "load-waterfall" | "type-system";

export declare const GRAPHICS: Record<GraphicKey, () => string>;
export declare const GRAPHIC_KEYS: GraphicKey[];
export declare function isGraphicKey(v: unknown): v is GraphicKey;

/** Default graphic per pillar category. Overridable per topic. */
export declare const CATEGORY_GRAPHIC: Record<string, GraphicKey>;

/**
 * Render a graphic with its labels filled in. `labels` supplies the tokens the
 * graphic declares; anything missing falls back to an empty string so a
 * partial dictionary can never emit a raw {{TOKEN}} to a visitor.
 */
export declare function renderGraphic(key: string, labels?: Record<string, string>): string | null;
