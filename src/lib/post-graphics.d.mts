export type GraphicKey = "dom-diff" | "node-flow" | "load-waterfall" | "type-system";

/** A rect/line/path/text/tspans node in a resolved graphic descriptor. All
 * text content is plain, already-localized strings — never markup. */
export type GraphicNode =
  | {
      t: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      fill: string;
      opacity?: number | string;
      stroke?: string;
      strokeOpacity?: number | string;
    }
  | {
      t: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke: string;
      strokeOpacity?: number | string;
      strokeWidth?: number;
      dash?: string;
    }
  | {
      t: "path";
      d: string;
      fill?: string;
      fillOpacity?: number | string;
      stroke?: string;
      strokeOpacity?: number | string;
    }
  | {
      t: "text";
      x: number;
      y: number;
      cls?: "pg-c" | "pg-lb";
      fill: string;
      opacity?: number | string;
      anchor?: "start" | "middle" | "end";
      style?: Record<string, string | number>;
      text: string;
    }
  | {
      t: "tspans";
      x: number;
      y: number;
      cls: "pg-c" | "pg-lb";
      parts: Array<{ text: string; fill: string; opacity?: number | string }>;
    };

/** A graphic resolved for rendering: labels filled in, ready to map to JSX. */
export interface GraphicSpec {
  viewBox: string;
  title: string;
  nodes: GraphicNode[];
}

export declare const GRAPHICS: Record<GraphicKey, () => unknown>;
export declare const GRAPHIC_KEYS: GraphicKey[];
export declare function isGraphicKey(v: unknown): v is GraphicKey;

/** Default graphic per pillar category. Overridable per topic. */
export declare const CATEGORY_GRAPHIC: Record<string, GraphicKey>;

/**
 * Render a graphic with its labels filled in. `labels` supplies the tokens the
 * graphic declares; anything missing falls back to an empty string so a
 * partial dictionary can never emit a raw {{TOKEN}} to a visitor. Returns a
 * plain data descriptor — no HTML, no escaping.
 */
export declare function renderGraphic(key: string, labels?: Record<string, string>): GraphicSpec | null;
