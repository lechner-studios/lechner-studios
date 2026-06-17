// src/components/LegalPrivacyDE.tsx
//
// DE-only Datenschutzerklärung. Rendered at /de/privacy.
// This site has a contact form (Vercel Function → Zoho EU SMTP, email
// only) and a KI-Chat-Assistent (Claude API via Anthropic, rate-limiting
// via Upstash/Vercel KV). No analytics, no cookies.
// Processors: Vercel, Zoho, Anthropic, Upstash/Vercel KV.

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

export default function LegalPrivacyDE() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <p style={overlineStyle}>Datenschutz</p>
        <h1 style={headlineStyle}>Datenschutz</h1>
        <p style={subStyle}>
          Diese Website hat ein Kontaktformular (über eine Vercel-Funktion an unseren E-Mail-Provider Zoho weitergeleitet, ausschließlich als E-Mail gespeichert) und einen KI-Chat-Assistenten (Anthropic Claude API; Nachrichten werden weder von uns noch von Anthropic gespeichert). Kein Tracking, keine Analytics, keine Cookies.
        </p>

        <section>
          <h3 style={h3Style}>1. Verantwortliche Stelle</h3>
          <p style={bodyStyle}>
            Verantwortliche im Sinne der DSGVO ist:
          </p>
          <p style={bodyStyle}>
            Sonja Lechner, Einzelunternehmerin
            <br />
            Wattenbachgasse 29, 6112 Wattens, Österreich
            <br />
            E-Mail:{" "}
            <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
              hallo@lechner-studios.at
            </a>
          </p>

          <h3 style={h3Style}>2. Welche Daten verarbeitet werden</h3>
          <p style={bodyStyle}>
            Beim Aufruf dieser Website werden technisch notwendige Zugriffsdaten
            durch unseren Hosting-Provider verarbeitet (siehe
            Auftragsverarbeiter). Dazu zählen typischerweise:
          </p>
          <ul style={listStyle}>
            <li>IP-Adresse (gekürzt bzw. zur Sicherstellung des Betriebs)</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>aufgerufene URL / referenzierende URL</li>
            <li>User-Agent (Browser, Betriebssystem)</li>
          </ul>
          <p style={bodyStyle}>
            Diese Website setzt <strong>keine Cookies</strong>, betreibt
            <strong> kein Tracking</strong> und nutzt{" "}
            <strong>keine Analytics-Dienste</strong>.
          </p>

          <h3 style={h3Style}>3. Kontaktaufnahme</h3>
          <p style={bodyStyle}>
            Wenn Sie über das Kontaktformular oder per E-Mail Kontakt aufnehmen, verarbeiten wir die von Ihnen übermittelten Angaben (Name, E-Mail-Adresse, Nachrichteninhalt) zum Zweck der Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Übermittelte Formulardaten werden über eine Vercel-Funktion an unseren E-Mail-Provider Zoho weitergeleitet und dort als E-Mail in unserem Postfach gespeichert; eine Persistierung in einer Datenbank, einem CRM oder einem anderen System erfolgt nicht. Speicherdauer: gemäß Postfach-Archivierung; spätestens nach Abschluss der Korrespondenz und Ablauf gesetzlicher Aufbewahrungsfristen. Eine Einwilligung können Sie jederzeit widerrufen — die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.
          </p>

          <h3 style={h3Style}>4. Rechtsgrundlagen (Art. 6 DSGVO)</h3>
          <ul style={listStyle}>
            <li>
              <strong>Art. 6 Abs. 1 lit. f</strong> (berechtigtes Interesse) —
              technische Bereitstellung der Website inkl. Server-Logs zur
              Sicherstellung von Betrieb und IT-Sicherheit; Betrieb des
              KI-Chat-Assistenten zur Besucherunterstützung und
              Missbrauchsprävention.
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. b</strong> (Vertrag /
              vorvertragliche Maßnahmen) — Beantwortung von Anfragen, die per
              E-Mail eingehen.
            </li>
          </ul>

          <h3 style={h3Style}>5. Auftragsverarbeiter</h3>
          <p style={bodyStyle}>
            Die Website wird gehostet bei{" "}
            <strong>Vercel Inc.</strong> (
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
            ). Die Auslieferung erfolgt über das EU-Edge-Netz von Vercel;
            Server-Logs zur Betriebssicherheit werden bei Vercel verarbeitet.
            Es bestehen Standardvertragsklauseln und ein
            Auftragsverarbeitungsvertrag mit Vercel.
          </p>
          <p style={mutedStyle}>
            Darüber hinaus wird <strong>Zoho Corporation B.V.</strong> (Hoogoorddreef 15, 1101 BA Amsterdam, Niederlande) als E-Mail-Provider (Zoho Mail) eingesetzt; EU-Rechenzentrum, AVV vorhanden (<a href="https://www.zoho.com/privacy.html" target="_blank" rel="noopener noreferrer" style={linkStyle}>Datenschutzerklärung</a>).
          </p>
          <p style={mutedStyle}>
            Für den KI-Chat-Assistenten werden Chat-Nachrichten zur Antworterzeugung an{" "}
            <strong>Anthropic PBC</strong> (548 Market St, San Francisco, CA 94104, USA) übermittelt (<a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Datenschutzerklärung</a>). Anthropic verarbeitet diese Daten ausschließlich zur Erbringung der API-Leistung; eine Speicherung durch Anthropic oder ein Training von KI-Modellen auf kommerziellen API-Daten erfolgt nicht. Drittlandtransfer in die USA auf Basis des EU-US Data Privacy Framework (TADPF) sowie EU-Standardvertragsklauseln gem. Art. 46 DSGVO.
          </p>
          <p style={mutedStyle}>
            Für das Rate-Limiting des KI-Chats wird ein pseudonymisierter (einweg-gehashter SHA-256) IP-Zähler mit kurzer Ablaufzeit in{" "}
            <strong>Upstash, Inc.</strong> (Vercel KV; USA) gespeichert (<a href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Datenschutzerklärung</a>). Der Zähler verfällt automatisch nach kurzer TTL; es werden keine weiteren Daten bei Upstash gespeichert. Drittlandtransfer in die USA auf Basis der EU-Standardvertragsklauseln gem. Art. 46 DSGVO.
          </p>
          <p style={mutedStyle}>
            Weitere Auftragsverarbeiter werden auf dieser Website nicht
            eingesetzt — insbesondere keine Analytics-, Tracking-, Werbe-
            oder Embed-Dienste Dritter.
          </p>

          <h3 style={h3Style}>6. KI-Chat-Assistent</h3>
          <p style={bodyStyle}>
            Diese Website betreibt einen offengelegten KI-Chat-Assistenten
            (&#8222;The Studio Director&#8220;), der Besucher zu Leistungen, Projekten und
            Kontaktmöglichkeiten informiert und weiterleitet.
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Zweck:</strong> Besucherunterstützung sowie Erkennung
              und Abwehr missbräuchlicher Nutzung (Missbrauchsprävention).
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse des Verantwortlichen).
            </li>
            <li>
              <strong>Verarbeitung:</strong> Chat-Nachrichten werden zur
              Erzeugung einer Antwort in Echtzeit an die Anthropic Claude API
              übertragen. Weder wir noch Anthropic speichern Chat-Inhalte;
              Anthropic trainiert keine KI-Modelle auf kommerziellen
              API-Daten. Die Konversation wird ausschließlich im Browser der
              Besucherin / des Besuchers gehalten und mit jeder Anfrage
              mitgesendet (zustandsloser Betrieb).
            </li>
            <li>
              <strong>Rate-Limiting:</strong> Zur Begrenzung der Nutzungsrate
              wird ein pseudonymisierter (einweg-gehashter, nicht
              rückrechenbarer) IP-Zähler mit kurzer Ablaufzeit in
              Upstash/Vercel KV gespeichert. Es handelt sich um eine
              Pseudonymisierung gem. Art. 4 Nr. 5 DSGVO, keine
              Anonymisierung. Außer diesem Zähler werden keine weiteren
              personenbezogenen Daten im KV-Speicher abgelegt.
            </li>
            <li>
              <strong>Drittlandtransfer:</strong> Anthropic und Upstash sind
              US-Anbieter. Transfers erfolgen auf Basis des EU-US Data
              Privacy Framework (TADPF) sowie der EU-Standardvertragsklauseln
              gem. Art. 46 DSGVO.
            </li>
            <li>
              <strong>Widerspruch:</strong> Sie können die Nutzung des
              KI-Chats jederzeit unterlassen. Sofern Sie Widerspruch gegen
              die Verarbeitung im Rahmen des berechtigten Interesses einlegen
              möchten, wenden Sie sich an{" "}
              <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
                hallo@lechner-studios.at
              </a>
              .
            </li>
          </ul>

          <h3 style={h3Style}>7. Speicherdauer</h3>
          <ul style={listStyle}>
            <li>
              <strong>Server-Logs (Vercel):</strong> gemäß Default-Retention
              des Hosting-Providers; in der Regel kurzfristig zur
              Betriebssicherheit.
            </li>
            <li>
              <strong>E-Mail-Korrespondenz:</strong> bis der Zweck der Anfrage
              erledigt ist, längstens jedoch im Rahmen gesetzlicher
              Aufbewahrungsfristen (z. B. § 132 BAO bei geschäftlichem
              Schriftverkehr — bis zu 7 Jahre).
            </li>
            <li>
              <strong>KI-Chat-Rate-Limiting (Upstash/Vercel KV):</strong>{" "}
              pseudonymisierter IP-Zähler; kurze TTL (automatischer Verfall);
              keine dauerhafte Speicherung.
            </li>
            <li>
              <strong>Chat-Inhalte:</strong> werden weder von uns noch von
              Anthropic gespeichert; ausschließlich clientseitig (Browser) für
              die Dauer der Sitzung.
            </li>
          </ul>

          <h3 style={h3Style}>
            8. Ihre Rechte (Art. 15–21 DSGVO)
          </h3>
          <p style={bodyStyle}>
            Sie haben jederzeit das Recht auf:
          </p>
          <ul style={listStyle}>
            <li>Auskunft (Art. 15)</li>
            <li>Berichtigung (Art. 16)</li>
            <li>Löschung (Art. 17)</li>
            <li>Einschränkung der Verarbeitung (Art. 18)</li>
            <li>Datenübertragbarkeit (Art. 20)</li>
            <li>
              Widerspruch gegen Verarbeitungen auf Basis berechtigter
              Interessen (Art. 21)
            </li>
          </ul>
          <p style={bodyStyle}>
            Anfragen richten Sie bitte an{" "}
            <a href="mailto:hallo@lechner-studios.at" style={linkStyle}>
              hallo@lechner-studios.at
            </a>
            .
          </p>

          <h3 style={h3Style}>9. Beschwerderecht</h3>
          <p style={bodyStyle}>
            Sie haben das Recht, sich bei der österreichischen
            Aufsichtsbehörde zu beschweren:
          </p>
          <p style={bodyStyle}>
            Österreichische Datenschutzbehörde
            <br />
            Barichgasse 40–42, 1030 Wien
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

          <h3 style={h3Style}>10. Drittlandtransfer</h3>
          <p style={bodyStyle}>
            Vercel ist ein US-Anbieter mit EU-Edge-Auslieferung. Soweit ein
            Transfer in die USA stattfindet, erfolgt dieser auf Basis der
            EU-Standardvertragsklauseln gem. Art. 46 DSGVO. Für den Empfang
            von E-Mails kann zudem der vom Betreiber genutzte
            E-Mail-Provider Daten verarbeiten.
          </p>

          <h3 style={h3Style}>11. Aktualität</h3>
          <p style={bodyStyle}>
            Stand: Juni 2026. Diese Erklärung wird angepasst, sobald sich
            Verarbeitungen ändern (z. B. wenn Analytics oder neue
            Auftragsverarbeiter ergänzt werden).
          </p>
        </section>

        <Link href="/de" style={backLinkStyle}>
          ← Zurück
        </Link>
      </div>
    </main>
  );
}
