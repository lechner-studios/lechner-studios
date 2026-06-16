import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const alt = "Lechner Studios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

const TAGLINES: Record<string, string> = {
  de: "Design-orientiertes Digitalstudio aus Tirol.",
  en: "Design-led digital studio from Tirol.",
};

// Brand colours
const INK = "#101216";
const GOLD = "#B8944D";
const OFF_WHITE = "#F7F8F8";
const MUTED = "rgba(247,248,248,0.7)";
const FAINT = "rgba(247,248,248,0.5)";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = TAGLINES[locale] ?? TAGLINES.de;

  // Satori cannot parse woff2, so we ship a self-hosted TTF alongside this
  // route — no third-party runtime dependency during OG generation. Fall back
  // to a plain serif if the read ever fails so the route never hard-crashes.
  let fontData: Buffer | null = null;
  try {
    fontData = await readFile(new URL("./cormorant-600.ttf", import.meta.url));
  } catch {
    fontData = null;
  }

  const fontFamily = fontData ? "Cormorant" : "serif";

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: INK,
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily,
          fontSize: 110,
          lineHeight: 1,
          color: OFF_WHITE,
        }}
      >
        <span style={{ color: OFF_WHITE, fontFamily }}>lechner</span>
        <span style={{ color: GOLD, fontFamily }}>.</span>
        <span style={{ color: OFF_WHITE, fontFamily }}>studios</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 36,
          fontFamily,
          fontSize: 34,
          color: MUTED,
        }}
      >
        {tagline}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 56,
          fontFamily,
          fontSize: 22,
          letterSpacing: 6,
          color: FAINT,
        }}
      >
        WATTENS · TIROL · ÖSTERREICH
      </div>
    </div>
  );

  return new ImageResponse(
    element,
    fontData
      ? {
          ...size,
          fonts: [
            {
              name: "Cormorant",
              data: fontData,
              weight: 600,
              style: "normal",
            },
          ],
        }
      : { ...size },
  );
}
