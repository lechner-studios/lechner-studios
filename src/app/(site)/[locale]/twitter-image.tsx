// runtime and dynamic must be declared as literals in this file — Turbopack
// (Next 16) cannot statically parse a re-exported route-segment-config field.
// Without the local `dynamic`, this route builds as ƒ (dynamic) while
// opengraph-image builds as ○ (static), and every crawler hit costs an
// invocation to serve a file that never changes between deploys.
export const runtime = "nodejs";
export const dynamic = "force-static";

export { default, alt, size, contentType } from "./opengraph-image";
