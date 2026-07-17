// src/components/LegalImpressumEN.tsx
//
// EN-only Impressum body. Rendered at /en/impressum.
// Legal copy ported from ai-brain 00g (finalized 2026-06-13, GISA 39801708).
// Sonja Lechner, Einzelunternehmerin — business designation "Lechner Studios".

import Link from "next/link";
import {
  pageStyle,
  containerStyle,
  overlineStyle,
  headlineStyle,
  subStyle,
  sectionLabelStyle,
  sectionValueStyle,
  linkStyle,
  backLinkStyle,
} from "./LegalStyles";

export default function LegalImpressumEN() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <p style={overlineStyle}>Legal disclosure</p>
        {/* "Impressum" is preserved as the EN headline per CONVENTIONS.md legal-page
            exception — it's the registered legal designation in AT. */}
        <h1 style={headlineStyle}>Impressum</h1>
        <p style={subStyle}>
          Disclosure pursuant to § 5 E-Commerce Act (ECG), § 63 Trade Act 1994
          (GewO) and § 25 Media Act (MedienG).
        </p>

        <section>
          <div style={sectionLabelStyle}>
            Media owner & responsible for content
          </div>
          <div style={sectionValueStyle}>
            Sonja Lechner
            <br />
            Sole proprietor (Einzelunternehmerin)
            <br />
            Business designation: Lechner Studios
            <br />
            Wattenbachgasse 29
            <br />
            6112 Wattens
            <br />
            Austria
          </div>

          <div style={sectionLabelStyle}>Contact</div>
          <div style={sectionValueStyle}>
            Email:{" "}
            <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
              hallo@lechner-studios.at
            </a>
            <br />
            Phone:{" "}
            <a href="tel:+436641534653" style={linkStyle}>
              +43 664 153 4653
            </a>
          </div>

          <div style={sectionLabelStyle}>Object of business</div>
          <div style={sectionValueStyle}>
            Services in automatic data processing and information technology
            (incl. software and web development, web design, automation,
            hosting/configuration, IT consulting and training), as well as
            advertising and marketing communication (brand design, brand
            identity and content/marketing communication).
          </div>

          <div style={sectionLabelStyle}>Trade (Gewerbe)</div>
          <div style={sectionValueStyle}>
            Dienstleistungen in der automatischen Datenverarbeitung und
            Informationstechnik (free trade)
            <br />
            GISA no.: 39801708
            <br />
            <br />
            Werbeagentur (free trade)
            <br />
            GISA no.: 39826466
          </div>

          <div style={sectionLabelStyle}>Trade authority</div>
          <div style={sectionValueStyle}>
            Bezirkshauptmannschaft Innsbruck (district administrative
            authority).
          </div>

          <div style={sectionLabelStyle}>Chamber membership</div>
          <div style={sectionValueStyle}>
            Wirtschaftskammer Tirol (Tyrol Economic Chamber) — Professional
            Group UBIT (Management Consulting, Accounting & IT) and Professional
            Group Advertising & Market Communication.
          </div>

          <div style={sectionLabelStyle}>Applicable professional law</div>
          <div style={sectionValueStyle}>
            Gewerbeordnung 1994 (Austrian Trade Act), available at{" "}
            <a
              href="https://www.ris.bka.gv.at"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              www.ris.bka.gv.at
            </a>
            .
          </div>

          <div style={sectionLabelStyle}>VAT</div>
          <div style={sectionValueStyle}>
            Small-business exemption under § 6 (1) line 27 UStG — VAT-exempt; no
            VAT identification number is held, amounts shown do not include VAT.
          </div>

          <div style={sectionLabelStyle}>Consumer dispute resolution</div>
          <div style={sectionValueStyle}>
            We are neither obliged nor willing to participate in
            dispute-resolution proceedings before a consumer arbitration board.
            (Note: the EU Online Dispute Resolution [ODR] platform was
            discontinued on 20 July 2025 — hence no ODR link.)
          </div>

          <div style={sectionLabelStyle}>
            Basic orientation (§ 25 MedienG)
          </div>
          <div style={sectionValueStyle}>
            Company website of Lechner Studios — information about the services
            offered by Sonja Lechner in web and software development, digital
            products and content.
          </div>

          <div style={sectionLabelStyle}>Copyright</div>
          <div style={sectionValueStyle}>
            Content and works on this website are subject to Austrian copyright
            law. Any use beyond the limits of copyright requires the prior
            written consent of the media owner.
          </div>

          <div style={sectionLabelStyle}>Liability for content and links</div>
          <div style={sectionValueStyle}>
            Content was prepared with utmost care; no guarantee is given for
            accuracy, completeness or timeliness. Operators of external linked
            sites are solely responsible for their content.
          </div>

          <div style={sectionLabelStyle}>Last updated</div>
          <div style={sectionValueStyle}>June 2026</div>
        </section>

        <Link href="/en" style={backLinkStyle}>
          ← Back
        </Link>
      </div>
    </main>
  );
}
