// src/lib/monitoring/client.ts
// ─────────────────────────────────────────────────────────────
// Client-side error tracking, OFF by default. Sentry is loaded ONLY when
// NEXT_PUBLIC_SENTRY_DSN is set, via a dynamic import — so the default build
// ships no Sentry code in the main path and self-hosted/forked deploys stay
// clean. Sentry.init installs global handlers for window.onerror and
// unhandledrejection, so unhandled errors are captured without an
// ErrorBoundary.
//
// ⚠️ DSGVO: enabling this sends error data to Sentry (Functional Software,
// Inc.). The DSN below targets Sentry's EU data region. Before setting
// NEXT_PUBLIC_SENTRY_DSN in production you MUST keep the Datenschutz Sentry
// disclosure (it renders on the same env gate) and the next.config.ts CSP
// connect-src EU ingest host in place. PII is suppressed (sendDefaultPii:
// false), but the disclosure is still required.
// ─────────────────────────────────────────────────────────────

let started = false;

export async function initClientMonitoring(): Promise<void> {
  if (started) return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  // EU-region guard: the CSP connect-src and the Datenschutz disclosure both
  // assert Sentry's EU data region. A non-EU DSN would falsify that, so refuse
  // it rather than ship events to a US ingest host. (See OWNER ACTION in PR.)
  if (!dsn.includes(".de.sentry.io")) {
    console.error("[monitoring] NEXT_PUBLIC_SENTRY_DSN is not an EU-region DSN (*.de.sentry.io) — monitoring disabled to honour the EU-region disclosure.");
    return;
  }
  started = true;
  try {
    const Sentry = await import("@sentry/browser");
    Sentry.init({
      dsn,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
      // Errors only — no performance tracing (keeps quota + payload down).
      tracesSampleRate: 0,
      // DSGVO: do not attach IP address / request cookies by default.
      sendDefaultPii: false,
    });
  } catch (err) {
    // Monitoring is best-effort; never let it break the app.
    console.error("[monitoring] client init failed:", err);
  }
}
