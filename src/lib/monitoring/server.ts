// src/lib/monitoring/server.ts
// ─────────────────────────────────────────────────────────────
// Server-side error tracking for the API routes (contact + chat), OFF by
// default. Sentry is loaded ONLY when NEXT_PUBLIC_SENTRY_DSN is set, via a
// dynamic import, so the default build pays no cost and forks stay clean.
//
// We use the SAME env gate as the client (NEXT_PUBLIC_SENTRY_DSN) so that
// client capture, server capture, and the Datenschutz disclosure activate in
// lockstep — keeping the disclosure truthful in both states.
//
// ⚠️ DSGVO: see client.ts. sendDefaultPii is false (no IP/cookies). The DSN
// targets Sentry's EU data region.
// ─────────────────────────────────────────────────────────────

import type * as SentryNode from "@sentry/node";

let clientPromise: Promise<typeof SentryNode | null> | null = null;

async function getSentry(): Promise<typeof SentryNode | null> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return null;
  // EU-region guard: server events are NOT subject to the browser CSP, so a
  // non-EU DSN would silently ship server-side errors to a US ingest host and
  // falsify the Datenschutz EU-region statement. Refuse it. (See OWNER ACTION.)
  if (!dsn.includes(".de.sentry.io")) {
    console.error("[monitoring] NEXT_PUBLIC_SENTRY_DSN is not an EU-region DSN (*.de.sentry.io) — server monitoring disabled to honour the EU-region disclosure.");
    return null;
  }
  if (!clientPromise) {
    clientPromise = (async () => {
      try {
        const Sentry = await import("@sentry/node");
        Sentry.init({
          dsn,
          environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
          release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
          // Errors only — no performance tracing.
          tracesSampleRate: 0,
          // DSGVO: do not attach IP address / request headers by default.
          sendDefaultPii: false,
        });
        return Sentry;
      } catch (err) {
        console.error("[monitoring] server init failed:", err);
        return null;
      }
    })();
  }
  return clientPromise;
}

// Report a server-side error to Sentry when enabled. No-op (and never throws)
// when NEXT_PUBLIC_SENTRY_DSN is unset. Always pair with the existing
// console.error so Vercel logs keep the error regardless.
export async function captureServerError(
  err: unknown,
  context?: Record<string, unknown>,
): Promise<void> {
  try {
    const Sentry = await getSentry();
    if (!Sentry) return;
    Sentry.captureException(err, context ? { extra: context } : undefined);
    // API routes are short-lived; flush so the event is sent before the
    // function suspends/returns.
    await Sentry.flush(2000);
  } catch {
    // Best-effort; swallow so error reporting can't itself break the handler.
  }
}
