export type ArtFamily = "grid" | "nodes" | "strata";

export type ArtShape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string; opacity: number }
  | { kind: "circle"; x: number; y: number; r: number; fill: string; opacity: number };

export type ArtSpec = { family: ArtFamily; seed: number; shapes: ArtShape[] };

export declare const FAMILIES: Record<string, ArtFamily>;
export declare function hash(str: string): number;
export declare function artSpec(slug: string, category: string): ArtSpec;
