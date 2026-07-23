// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { isEuSentryDsn, EU_DSN_REJECTED } from "@/lib/monitoring/dsn";

// DSN comes from NEXT_PUBLIC_SENTRY_DSN, never hardcoded, the same env gate as
// src/lib/monitoring: monitoring is OFF by default and the DSN is not baked
// into the bundle. Unset means no init; set but not EU-region is refused,
// because the Datenschutz disclosure and the CSP both assert the EU data
// region (see src/lib/monitoring/dsn.ts).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && isEuSentryDsn(dsn)) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,

    // Errors only: no performance tracing (keeps quota and payload down).
    tracesSampleRate: 0,

    // DSGVO: do not ship console logs to Sentry.
    enableLogs: false,

    // DSGVO: do not attach IP address or request cookies.
    sendDefaultPii: false,
  });
} else if (dsn) {
  console.error(EU_DSN_REJECTED);
}
