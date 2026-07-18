import React from "react";
import PostGraphic from "./PostGraphic";
import PostImage from "./PostImage";
import { isGraphicKey } from "../lib/post-graphics.mjs";
import type { GraphicKey } from "../lib/post-graphics.mjs";
import type { Dictionary } from "../i18n/dictionaries";
import type { BlogMeta } from "../lib/blog";

// Precedence: crafted graphic → photo → flat fallback band (PostImage handles
// the photo/fallback split on its own). A graphic only wins when its key is
// valid AND the active locale's dictionary carries a label map for it —
// missing either falls through to the photo rather than rendering an
// unlabeled graphic.
export function pickGraphic(meta: Pick<BlogMeta, "graphic">, dict: Dictionary): GraphicKey | undefined {
  const g = meta.graphic;
  return g && isGraphicKey(g) && dict.blogGraphic[g] ? g : undefined;
}

export default function PostMedia({
  meta,
  dict,
  variant,
}: {
  meta: Pick<BlogMeta, "graphic" | "image" | "imageAlt">;
  dict: Dictionary;
  variant: "hero" | "tile";
}) {
  const graphic = pickGraphic(meta, dict);
  if (graphic) {
    return <PostGraphic graphic={graphic} labels={dict.blogGraphic[graphic]} variant={variant} />;
  }
  return <PostImage image={meta.image} alt={meta.imageAlt} variant={variant} />;
}
