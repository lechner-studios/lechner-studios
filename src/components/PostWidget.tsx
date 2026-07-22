import React from "react";
import PortalCommission from "./widgets/PortalCommission";
import { isWidgetKey } from "../lib/post-widgets.mjs";
import type { Dictionary } from "../i18n/dictionaries";

// Maps a frontmatter `widget` key to its component. Returns null for an
// absent or unknown key — a bad key must render nothing, silently, the same
// contract PostMedia/PostGraphic follow for `graphic`. Keep the key→component
// mapping in this one file: adding a widget is a one-line case here plus a
// WIDGET_KEYS entry in post-widgets.mjs.
export default function PostWidget({
  widget,
  dict,
}: {
  widget?: string;
  dict: Dictionary;
}) {
  if (!widget || !isWidgetKey(widget)) return null;
  switch (widget) {
    case "portal-commission":
      return <PortalCommission labels={dict.postWidget["portal-commission"]} />;
    default:
      return null;
  }
}
