export type FigureKey = "type-mood-craft" | "type-mood-trust";

/** One mock business card. `vars` are CSS custom properties applied to the
 * card element; `swatches` are the palette chips shown beneath it. Both are
 * plain values authored in post-figures.mjs — never caller input. */
export interface FigureSpecimen {
  id: "a" | "b";
  swatches: string[];
  vars: Record<string, string>;
}

/** Label tokens a figure declares, resolved from the locale dictionary; every
 * value is a plain, already-localized string — never markup. */
export interface FigureDef {
  labels: string[];
  specimens: FigureSpecimen[];
}

export declare const FIGURES: Record<FigureKey, FigureDef>;
export declare const FIGURE_KEYS: FigureKey[];
export declare function isFigureKey(v: unknown): v is FigureKey;

/**
 * Resolve the markdown sentinel `![](figure:<key>)` to a figure key. Returns
 * undefined when `src` is not a `figure:` URL or names no registered figure,
 * so unknown keys degrade to an ordinary image rather than rendering nothing.
 */
export declare function figureKeyFromSrc(src: unknown): FigureKey | undefined;
