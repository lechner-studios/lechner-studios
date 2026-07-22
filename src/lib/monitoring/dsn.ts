// src/lib/monitoring/dsn.ts
// ─────────────────────────────────────────────────────────────
// EU-region validation for the Sentry DSN, shared by client.ts and server.ts.
//
// This used to be `dsn.includes(".de.sentry.io")` in both files. A substring
// test is not a host test. It also accepted a DSN pointing at an unrelated
// host that merely mentioned the EU host in its path, query or fragment, or
// one that used the EU host as a prefix of an attacker-controlled domain, or
// one served over plain http. Any of those would have shipped error payloads
// to a non-EU host while the Datenschutz disclosure and the CSP both assert
// the EU data region. It was also too strict in the other direction: the
// leading dot refused the apex host, and the check was case-sensitive.
//
// Parse the URL and compare the host instead. (CodeQL:
// js/incomplete-url-substring-sanitization.)
// ─────────────────────────────────────────────────────────────

const EU_INGEST_HOST = "de.sentry.io";

/**
 * True only when `dsn` is a well-formed https Sentry DSN whose host is
 * `de.sentry.io` or a subdomain of it.
 *
 * A Sentry DSN looks like `https://<publicKey>@<host>/<projectId>`, so the
 * region lives in the host and nowhere else. https is required because every
 * Sentry SaaS ingest endpoint is https; refusing http closes a downgrade that
 * would put error payloads on the wire in clear text.
 */
export function isEuSentryDsn(dsn: string): boolean {
  let url: URL;
  try {
    url = new URL(dsn);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  return host === EU_INGEST_HOST || host.endsWith(`.${EU_INGEST_HOST}`);
}

export const EU_DSN_REJECTED =
  "[monitoring] NEXT_PUBLIC_SENTRY_DSN is not an EU-region DSN (https, host de.sentry.io or a subdomain) — monitoring disabled to honour the EU-region disclosure.";
