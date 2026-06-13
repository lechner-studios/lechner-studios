// src/components/LegalImpressumDE.tsx
//
// DE-only Impressum body. Rendered at /de/impressum.
// Legal copy ported from ai-brain 00g (finalized 2026-06-13, GISA 39801708).
// Sonja Lechner, Einzelunternehmerin — Etablissementbezeichnung "Lechner Studios".

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

export default function LegalImpressumDE() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <p style={overlineStyle}>Rechtliche Information</p>
        <h1 style={headlineStyle}>Impressum</h1>
        <p style={subStyle}>
          Offenlegung gemäß § 5 E-Commerce-Gesetz (ECG), § 63 Gewerbeordnung
          1994 (GewO) und § 25 Mediengesetz (MedienG).
        </p>

        <section>
          <div style={sectionLabelStyle}>
            Medieninhaberin & für den Inhalt verantwortlich
          </div>
          <div style={sectionValueStyle}>
            Sonja Lechner
            <br />
            Einzelunternehmerin
            <br />
            Unternehmensbezeichnung (Etablissementbezeichnung): Lechner Studios
            <br />
            Wattenbachgasse 29
            <br />
            6112 Wattens
            <br />
            Österreich
          </div>

          <div style={sectionLabelStyle}>Kontakt</div>
          <div style={sectionValueStyle}>
            E-Mail:{" "}
            <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
              hallo@lechner-studios.at
            </a>
          </div>

          <div style={sectionLabelStyle}>Unternehmensgegenstand</div>
          <div style={sectionValueStyle}>
            Dienstleistungen in der automatischen Datenverarbeitung und
            Informationstechnik (u.&nbsp;a. Software- und Webentwicklung,
            Webdesign, Automatisierung, Hosting/Konfiguration, IT-Beratung und
            -Schulung).
          </div>

          <div style={sectionLabelStyle}>Gewerbe</div>
          <div style={sectionValueStyle}>
            Dienstleistungen in der automatischen Datenverarbeitung und
            Informationstechnik (freies Gewerbe)
            <br />
            GISA-Zahl: 39801708
          </div>

          <div style={sectionLabelStyle}>Gewerbebehörde</div>
          <div style={sectionValueStyle}>
            Bezirkshauptmannschaft Innsbruck (Bezirksverwaltungsbehörde)
          </div>

          <div style={sectionLabelStyle}>Mitgliedschaft</div>
          <div style={sectionValueStyle}>
            Wirtschaftskammer Tirol — Fachgruppe Unternehmensberatung,
            Buchhaltung und Informationstechnologie (UBIT), Sparte Information &
            Consulting.
          </div>

          <div style={sectionLabelStyle}>Berufsrechtliche Vorschriften</div>
          <div style={sectionValueStyle}>
            Gewerbeordnung 1994 (GewO), abrufbar unter{" "}
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

          <div style={sectionLabelStyle}>Umsatzsteuer</div>
          <div style={sectionValueStyle}>
            Kleinunternehmerin gemäß § 6 Abs 1 Z 27 UStG — umsatzsteuerbefreit;
            es wird keine UID-Nummer geführt, ausgewiesene Beträge enthalten
            keine Umsatzsteuer.
          </div>

          <div style={sectionLabelStyle}>Verbraucherstreitbeilegung</div>
          <div style={sectionValueStyle}>
            Wir sind nicht verpflichtet und nicht bereit, an einem
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen. (Hinweis: Die EU-Online-Streitbeilegungs-Plattform
            [OS] wurde mit 20.07.2025 eingestellt — daher kein OS-Link mehr.)
          </div>

          <div style={sectionLabelStyle}>
            Grundlegende Richtung (§ 25 MedienG)
          </div>
          <div style={sectionValueStyle}>
            Unternehmenswebsite der Lechner Studios — Information über das
            Dienstleistungsangebot von Sonja Lechner in den Bereichen Web- und
            Softwareentwicklung, digitale Produkte und Content.
          </div>

          <div style={sectionLabelStyle}>Urheberrecht</div>
          <div style={sectionValueStyle}>
            Inhalte und Werke auf dieser Website unterliegen dem
            österreichischen Urheberrecht. Jede Verwertung außerhalb der Grenzen
            des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung der
            Medieninhaberin.
          </div>

          <div style={sectionLabelStyle}>Haftung für Inhalte und Links</div>
          <div style={sectionValueStyle}>
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt; für
            Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr
            übernommen. Für Inhalte externer Links sind ausschließlich deren
            Betreiber verantwortlich.
          </div>

          <div style={sectionLabelStyle}>Stand</div>
          <div style={sectionValueStyle}>Juni 2026</div>
        </section>

        <Link href="/de" style={backLinkStyle}>
          ← Zurück
        </Link>
      </div>
    </main>
  );
}
