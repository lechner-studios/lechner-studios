// src/components/LegalPrivacyEN.tsx
//
// EN-only Privacy notice. Rendered at /en/privacy.
// This site has a contact form (Vercel Function → Zoho EU SMTP, email
// only) and an AI chat assistant (Claude API via Anthropic, rate-limiting
// via Upstash/Vercel KV). Cookieless analytics (Vercel Web Analytics); no cookies.
// Processors: Vercel, Zoho, Anthropic, Upstash/Vercel KV — plus Sentry
// (error tracking) ONLY when NEXT_PUBLIC_SENTRY_DSN is set; the Sentry
// disclosure below renders on that same env gate.

import Link from "next/link";
import {
  pageStyle,
  containerStyle,
  overlineStyle,
  headlineStyle,
  subStyle,
  linkStyle,
  backLinkStyle,
  h3Style,
  bodyStyle,
  mutedStyle,
  listStyle,
} from "./LegalStyles";

export default function LegalPrivacyEN() {
  // Error tracking (Sentry) is opt-in via env. When enabled, the processor
  // disclosure below must be shown — gated on the same flag so the page is
  // truthful in both states (SSG: baked at build time, so set the env in
  // Vercel and redeploy to activate both monitoring and this disclosure).
  const sentryEnabled = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <p style={overlineStyle}>Privacy</p>
        <h1 style={headlineStyle}>Privacy</h1>
        <p style={subStyle}>
          This site has a contact form (forwarded by a Vercel Function to our email provider Zoho, stored only as an email) and an AI chat assistant (Anthropic Claude API; messages are not stored by us or by Anthropic). No cookies and no personal tracking — for reach measurement we use only a cookieless, anonymous statistic (Vercel Web Analytics).
        </p>

        <section>
          <h3 style={h3Style}>1. Controller</h3>
          <p style={bodyStyle}>
            Controller within the meaning of the GDPR is:
          </p>
          <p style={bodyStyle}>
            Sonja Lechner, sole proprietor (Einzelunternehmerin)
            <br />
            Wattenbachgasse 29, 6112 Wattens, Austria
            <br />
            Email:{" "}
            <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
              hallo@lechner-studios.at
            </a>
          </p>

          <h3 style={h3Style}>2. What data is processed</h3>
          <p style={bodyStyle}>
            When you visit this site, technically necessary access data is
            processed by our hosting provider (see processors). This typically
            includes:
          </p>
          <ul style={listStyle}>
            <li>IP address (truncated / for operational security)</li>
            <li>date and time of the request</li>
            <li>requested URL / referring URL</li>
            <li>user agent (browser, operating system)</li>
          </ul>
          <p style={bodyStyle}>
            This site sets <strong>no cookies</strong> and performs{" "}
            <strong>no personal tracking</strong>. For reach measurement we use
            only a <strong>cookieless, anonymous statistic</strong> (Vercel Web
            Analytics — see point&nbsp;5).
          </p>

          <h3 style={h3Style}>3. Contact requests</h3>
          <p style={bodyStyle}>
            If you contact us via the contact form or by email, we process the data you provide (name, email address, message body) for the purpose of handling your request. Legal basis is Art. 6(1)(b) GDPR (pre-contractual steps) and/or Art. 6(1)(a) GDPR (consent). Form submissions are forwarded by a Vercel Function to our email provider Zoho and stored as an email in our mailbox; no persistence in a database, CRM, or other system occurs. Retention: per mailbox archival; at latest after correspondence completion and applicable statutory retention periods. Consent may be withdrawn at any time — the lawfulness of processing carried out prior to withdrawal remains unaffected.
          </p>

          <h3 style={h3Style}>4. Legal bases (Art. 6 GDPR)</h3>
          <ul style={listStyle}>
            <li>
              <strong>Art. 6(1)(f)</strong> (legitimate interest) — technical
              provision of the website incl. server logs to ensure operation
              and IT security; operation of the AI chat assistant for visitor
              support and abuse prevention.
            </li>
            <li>
              <strong>Art. 6(1)(b)</strong> (contract / pre-contractual
              measures) — answering inbound requests sent by email.
            </li>
          </ul>

          <h3 style={h3Style}>5. Processors</h3>
          <p style={bodyStyle}>
            The site is hosted by <strong>Vercel Inc.</strong> (
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Privacy Policy
            </a>
            ,{" "}
            <a
              href="https://vercel.com/legal/dpa"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              DPA
            </a>
            ). Delivery is performed via Vercel&apos;s EU edge network;
            server logs for operational security are processed at Vercel.
            Standard Contractual Clauses and a Data Processing Agreement are
            in place with Vercel.
          </p>
          <p style={mutedStyle}>
            To tailor and improve the site, we collect anonymous, aggregated
            usage statistics with <strong>Vercel Web Analytics</strong>. The
            measurement is <strong>cookieless</strong>: no cookies, no
            cross-device recognition, no persistent user profile. Only
            aggregated metrics are collected (pages viewed, referring page,
            approximate region at country level, device/browser type);
            individuals are not identifiable. Legal basis: Art. 6(1)(f) GDPR
            (legitimate interest). As no information is stored on or read from
            your device, no consent is required; you may object under Art. 21
            GDPR. Processing is carried out by our hosting provider Vercel named
            above.
          </p>
          <p style={mutedStyle}>
            In addition, <strong>Zoho Corporation B.V.</strong> (Hoogoorddreef 15, 1101 BA Amsterdam, Netherlands) is used as an email provider (Zoho Mail); EU data center, DPA in place (<a href="https://www.zoho.com/privacy.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>privacy policy</a>).
          </p>
          <p style={mutedStyle}>
            For the AI chat assistant, chat messages are transmitted to{" "}
            <strong>Anthropic PBC</strong> (548 Market St, San Francisco, CA 94104, USA) to generate replies (<a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>privacy policy</a>). Anthropic processes these data solely to deliver the API service; messages are not stored by Anthropic and Anthropic does not train AI models on commercial API data. Transfer to the US is based on the EU-US Data Privacy Framework (DPF) and EU Standard Contractual Clauses pursuant to Art. 46 GDPR.
          </p>
          <p style={mutedStyle}>
            For rate-limiting of the AI chat, a pseudonymised (one-way SHA-256 hashed) IP counter with a short expiry is stored in{" "}
            <strong>Upstash, Inc.</strong> (Vercel KV; USA) (<a href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>privacy policy</a>). The counter expires automatically after a short TTL; no further personal data is stored at Upstash. Transfer to the US is based on EU Standard Contractual Clauses pursuant to Art. 46 GDPR.
          </p>
          {sentryEnabled && (
            <p style={mutedStyle}>
              For error and crash diagnostics of the site,{" "}
              <strong>Sentry</strong> (Functional Software, Inc., USA) is used (<a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" style={linkStyle}>privacy policy</a>). Data is stored in Sentry&apos;s EU data region. Only technical error data is transmitted; no personal data by default (no IP address, no cookies; <code>sendDefaultPii</code> disabled). Where support access from the US occurs, it is based on EU Standard Contractual Clauses pursuant to Art. 46 GDPR; a Data Processing Agreement is in place.
            </p>
          )}
          <p style={mutedStyle}>
            No further processors are used on this site — in particular no
            third-party advertising, tracking, profiling or embedded services
            and no cookie-based analytics.
          </p>

          <h3 style={h3Style}>6. AI chat assistant</h3>
          <p style={bodyStyle}>
            This site operates a disclosed AI chat assistant (&ldquo;The Studio
            Director&rdquo;) that informs and routes visitors about services,
            projects and contact options.
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Purpose:</strong> visitor support and detection and
              prevention of abusive use.
            </li>
            <li>
              <strong>Legal basis:</strong> Art. 6(1)(f) GDPR (legitimate
              interest of the controller).
            </li>
            <li>
              <strong>Processing:</strong> Chat messages are transmitted in
              real time to the Anthropic Claude API to generate a reply.
              Neither we nor Anthropic store chat content; Anthropic does not
              train AI models on commercial API data. The conversation is held
              exclusively in the visitor&apos;s browser and sent with each
              request (stateless operation).
            </li>
            <li>
              <strong>Rate-limiting:</strong> To limit the rate of use, a
              pseudonymised (one-way hashed, non-reversible) IP counter with a
              short expiry is stored in Upstash/Vercel KV. This constitutes
              pseudonymisation within the meaning of Art. 4(5) GDPR, not
              anonymisation. No further personal data is stored in the KV
              store.
            </li>
            <li>
              <strong>Third-country transfer:</strong> Anthropic and Upstash
              are US providers. Transfers are based on the EU-US Data Privacy
              Framework (DPF) and EU Standard Contractual Clauses pursuant to
              Art. 46 GDPR.
            </li>
            <li>
              <strong>Objection:</strong> You may refrain from using the AI
              chat at any time. To object to processing based on legitimate
              interest, please contact{" "}
              <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
                hallo@lechner-studios.at
              </a>
              .
            </li>
          </ul>

          <h3 style={h3Style}>7. Retention</h3>
          <ul style={listStyle}>
            <li>
              <strong>Server logs (Vercel):</strong> per the hosting
              provider&apos;s default retention; generally short-term for
              operational security.
            </li>
            <li>
              <strong>Email correspondence:</strong> until the purpose of the
              request is fulfilled, at most within statutory retention periods
              (e.g. § 132 BAO for business correspondence — up to 7 years).
            </li>
            <li>
              <strong>AI chat rate-limiting (Upstash/Vercel KV):</strong>{" "}
              pseudonymised IP counter; short TTL (automatic expiry); no
              persistent storage.
            </li>
            <li>
              <strong>Chat content:</strong> not stored by us or by Anthropic;
              held client-side (browser) only for the duration of the session.
            </li>
          </ul>

          <h3 style={h3Style}>
            8. Your rights (Art. 15–21 GDPR)
          </h3>
          <p style={bodyStyle}>
            You have the right at any time to:
          </p>
          <ul style={listStyle}>
            <li>access (Art. 15)</li>
            <li>rectification (Art. 16)</li>
            <li>erasure (Art. 17)</li>
            <li>restriction of processing (Art. 18)</li>
            <li>data portability (Art. 20)</li>
            <li>
              object to processing based on legitimate interests (Art. 21)
            </li>
          </ul>
          <p style={bodyStyle}>
            Requests can be sent to{" "}
            <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
              hallo@lechner-studios.at
            </a>
            .
          </p>

          <h3 style={h3Style}>9. Right to lodge a complaint</h3>
          <p style={bodyStyle}>
            You have the right to lodge a complaint with the Austrian
            supervisory authority:
          </p>
          <p style={bodyStyle}>
            Österreichische Datenschutzbehörde
            <br />
            Barichgasse 40–42, 1030 Vienna
            <br />
            <a
              href="https://www.dsb.gv.at"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              www.dsb.gv.at
            </a>
          </p>

          <h3 style={h3Style}>10. Third-country transfer</h3>
          <p style={bodyStyle}>
            Vercel is a US provider with EU edge delivery. Where a transfer
            to the US occurs, it is based on the EU Standard Contractual
            Clauses pursuant to Art. 46 GDPR. The email provider used by the
            operator may also process data when receiving inbound mail.
          </p>

          <h3 style={h3Style}>11. Last updated</h3>
          <p style={bodyStyle}>
            July 2026.
          </p>
        </section>

        <Link href="/en" style={backLinkStyle}>
          ← Back
        </Link>
      </div>
    </main>
  );
}
