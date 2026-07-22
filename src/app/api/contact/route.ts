import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { captureServerError } from "../../../lib/monitoring/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rate limit is best-effort; resets on cold start.
// Acceptable for v1 traffic; escalate to KV store if abuse appears.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const ipBucket = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipBucket.get(ip);
  if (!entry || entry.reset < now) {
    ipBucket.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload: { name?: string; email?: string; message?: string; consent?: boolean; _hp?: string; subject?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot — silently succeed and drop
  if (payload._hp && payload._hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (payload.name ?? "").trim().replace(/[\r\n]/g, "");
  // Strip CR/LF from email too (defence-in-depth vs header injection in replyTo;
  // the regex below already rejects whitespace, this guards encoding edge-cases).
  const email = (payload.email ?? "").trim().replace(/[\r\n]/g, "");
  const message = (payload.message ?? "").trim();
  // Optional custom subject (e.g. from the project-intake form). Sanitized like
  // name; falls back to the default subject below when absent/empty.
  const subject = (payload.subject ?? "").trim().replace(/[\r\n]/g, "").slice(0, 150);

  if (
    !payload.consent ||
    name.length < 2 || name.length > 200 ||
    // Bound the length BEFORE the regex runs. "." is itself a member of
    // [^\s@], so `[^\s@]+\.[^\s@]+` is ambiguous and backtracks over every
    // candidate separator; an unbounded address ending in "@" makes the final
    // group unmatchable and costs O(n^2). 254 is the RFC 5321 forward-path
    // limit, so no deliverable address is turned away. Order matters here:
    // `||` short-circuits, and moving this below the test restores the flaw.
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    message.length < 20 || message.length > 5000
  ) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  // Zoho ZeptoMail (EU) transactional SMTP. The SMTP username is the fixed
  // literal "emailapikey"; the password is the ZeptoMail Send-Mail token. The
  // sender must be on the verified ZeptoMail domain (mail.lechner-studios.at) —
  // NOT the SMTP user — so `from` is ZEPTOMAIL_FROM, not the auth user.
  const smtpPass = process.env.ZEPTOMAIL_TOKEN?.trim().replace(/^Zoho-enczapikey\s+/i, "");
  if (!smtpPass) {
    console.error("[contact] ZEPTOMAIL_TOKEN missing — set it to the ZeptoMail Send-Mail token");
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
  }
  const fromAddress = process.env.ZEPTOMAIL_FROM?.trim() || "noreply@mail.lechner-studios.at";

  try {
    const transport = nodemailer.createTransport({
      host: "smtp.zeptomail.eu",
      port: 465,
      secure: true,
      auth: { user: "emailapikey", pass: smtpPass },
    });

    // The studio inbox is the system-of-record. An optional notify address
    // (e.g. a personal Gmail) is added via env so it stays OUT of this PUBLIC
    // repo and can be changed without a redeploy. Zoho free plan blocks
    // mailbox forwarding, so delivery to a second inbox is done here instead.
    const recipients = ["hallo@lechner-studios.at"];
    const notify = process.env.CONTACT_NOTIFY_EMAIL?.trim();
    if (notify) recipients.push(notify);

    await transport.sendMail({
      from: `Lechner Studios Kontakt <${fromAddress}>`,
      to: recipients,
      replyTo: `${name} <${email}>`,
      subject: subject || `Kontaktanfrage: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (err) {
    // SMTP/network failure — log for diagnosis, return a clear error so the
    // client surfaces the "try again or email us directly" fallback.
    console.error("[contact] sendMail failed:", err);
    // No PII: only the error itself (no name/email/message body).
    await captureServerError(err, { route: "contact", stage: "sendMail" });
    return NextResponse.json({ ok: false, error: "mail_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
