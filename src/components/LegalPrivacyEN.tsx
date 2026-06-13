// src/components/LegalPrivacyEN.tsx
//
// EN-only Privacy notice. Rendered at /en/privacy.
// Legal copy is preserved verbatim from the prior bilingual Privacy page.
// This site has a contact form (Vercel Function → Zoho EU SMTP, email
// only), no analytics, no cookies. Vercel + Zoho are processors.

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
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <p style={overlineStyle}>Privacy</p>
        <h1 style={headlineStyle}>Privacy</h1>
        <p style={subStyle}>
          This site has a contact form (forwarded by a Vercel Function to our email provider Zoho, stored only as an email). No tracking, no analytics, no cookies.
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
            This site sets <strong>no cookies</strong>, performs{" "}
            <strong>no tracking</strong> and uses{" "}
            <strong>no analytics services</strong>.
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
              and IT security.
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
            In addition, <strong>Zoho Corporation B.V.</strong> (Hoogoorddreef 15, 1101 BA Amsterdam, Netherlands) is used as an email provider (Zoho Mail); EU data center, DPA in place (<a href="https://www.zoho.com/privacy.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>privacy policy</a>). No further processors are used on this site — in particular, no
            third-party analytics, tracking, advertising or embedded
            services.
          </p>

          <h3 style={h3Style}>6. Retention</h3>
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
          </ul>

          <h3 style={h3Style}>
            7. Your rights (Art. 15–21 GDPR)
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

          <h3 style={h3Style}>8. Right to lodge a complaint</h3>
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

          <h3 style={h3Style}>9. Third-country transfer</h3>
          <p style={bodyStyle}>
            Vercel is a US provider with EU edge delivery. Where a transfer
            to the US occurs, it is based on the EU Standard Contractual
            Clauses pursuant to Art. 46 GDPR. The email provider used by the
            operator may also process data when receiving inbound mail.
          </p>

          <h3 style={h3Style}>10. Last updated</h3>
          <p style={bodyStyle}>
            June 2026. Updated whenever processing changes (e.g. if analytics
            or new processors are added).
          </p>
        </section>

        <Link href="/en" style={backLinkStyle}>
          ← Back
        </Link>
      </div>
    </main>
  );
}
