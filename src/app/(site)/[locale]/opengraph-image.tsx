import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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

  // Satori needs a TTF (can't parse woff2). Self-hosted font read from the repo
  // at request time — NO third-party / runtime network request (was a jsdelivr
  // fetch). Falls back to the default font if the read fails so it never crashes.
  let fontData: Buffer | null = null;
  try {
    fontData = await readFile(
      join(process.cwd(), "public/fonts/cormorant-700.ttf"),
    );
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
              weight: 700,
              style: "normal",
            },
          ],
        }
      : { ...size },
  );
}
