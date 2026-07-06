import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      // Sentry EU data region ingest (error tracking; only used when
      // NEXT_PUBLIC_SENTRY_DSN is set — see src/lib/monitoring). Listing the
      // host is harmless while monitoring is off (nothing connects there).
      "connect-src 'self' https://*.ingest.de.sentry.io",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // The Brand & Identity page first shipped at /marke-identitaet, then was
      // renamed to /brand. Redirect the old slug so any crawled/linked URL resolves.
      { source: "/:locale/marke-identitaet", destination: "/:locale/brand", permanent: true },
      // Web & Design consolidated into the dedicated werk storefront (2026-07).
      // These pages now live on werk.lechner-studios.at; 301 both locales there.
      { source: "/:locale/webdesign", destination: "https://werk.lechner-studios.at", permanent: true },
      { source: "/:locale/pension-website-tirol", destination: "https://werk.lechner-studios.at/pension-website-tirol", permanent: true },
      { source: "/:locale/website-check", destination: "https://werk.lechner-studios.at/website-check", permanent: true },
    ];
  },
};

export default nextConfig;
