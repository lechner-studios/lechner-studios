import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "./i18n/config";

const MAINTENANCE_ALLOWLIST = [
  "/maintenance",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
  "/favicon.svg",
];

const LEGACY_PATHS = ["/impressum", "/privacy"];

function isInternalPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/fonts/") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg"
  );
}

function pathnameHasLocale(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. Maintenance mode rewrite (preserved from prior behavior).
  // Accepts "1" (legacy) or "true" so a single MAINTENANCE_MODE=true value
  // works across all Lechner Studios Vercel projects.
  const maintenance = process.env.MAINTENANCE_MODE;
  if (maintenance === "1" || maintenance === "true") {
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/fonts/") ||
      MAINTENANCE_ALLOWLIST.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      )
    ) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  // 2. Skip internal/static paths from locale logic.
  if (isInternalPath(pathname)) {
    return NextResponse.next();
  }

  // 3. Already locale-prefixed → pass through.
  if (pathnameHasLocale(pathname)) {
    return NextResponse.next();
  }

  // 4. Legacy bare paths → redirect to default-locale equivalent.
  if (LEGACY_PATHS.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  // 5. Root → redirect to default locale.
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}`;
    if (search) url.search = search;
    return NextResponse.redirect(url, 308);
  }

  // 6. Anything else (unknown path, no locale prefix) → let Next.js 404 it.
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image).*)",
};
