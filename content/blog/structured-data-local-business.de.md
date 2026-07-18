---
title: >-
  Strukturierte Daten für lokale Unternehmen: Was Schema.org-Markup wirklich
  bewirkt
description: >-
  Wie strukturierte Daten nach Schema.org lokalen Unternehmen helfen, in der
  Google-Suche besser verstanden zu werden – technisch erklärt.
excerpt: >-
  Strukturierte Daten helfen Suchmaschinen, Ihr lokales Unternehmen korrekt
  einzuordnen.
date: '2026-06-30'
category: SEO & Growth
keywords:
  - strukturierte Daten lokale Unternehmen
  - Schema.org Markup
  - LocalBusiness Schema
  - technisches SEO
  - lokale Suche
graphic: load-waterfall
---
Wer ein lokales Unternehmen betreibt – sei es ein Handwerksbetrieb in Innsbruck, eine Praxis in Salzburg oder ein Fachgeschäft in Wien – stellt sich früher oder später die Frage: Wie stellt Google eigentlich sicher, dass meine Adresse, meine Öffnungszeiten und mein Angebot in den Suchergebnissen korrekt angezeigt werden? Ein wesentlicher Teil der Antwort liegt in strukturierten Daten, genauer gesagt im sogenannten Schema.org-Markup. Was dahintersteckt und warum es für lokale Betriebe technisch relevant ist, erklärt dieser Beitrag.

## Was sind strukturierte Daten überhaupt?

Strukturierte Daten sind maschinenlesbare Informationen, die direkt im Quellcode einer Website eingebettet werden. Sie folgen einem standardisierten Vokabular – dem von Schema.org – und beschreiben Inhalte so, dass Suchmaschinen wie Google sie eindeutig interpretieren können. Statt dass ein Crawler aus dem Fließtext einer Seite ableiten muss, ob „Mo–Fr 8–18 Uhr" die Öffnungszeiten eines Unternehmens oder den Zeitplan einer Veranstaltung beschreibt, liefert das Markup diese Information direkt und unmissverständlich mit.

Das am häufigsten verwendete Format ist JSON-LD (JavaScript Object Notation for Linked Data), das Google ausdrücklich empfiehlt. Es wird als separater Script-Block im HTML eingebettet und beeinflusst die Darstellung der Seite für Besucherinnen und Besucher in keiner Weise – es kommuniziert ausschließlich mit der Suchmaschine.

## Was LocalBusiness-Schema konkret leistet

Für lokale Unternehmen ist der Schema-Typ `LocalBusiness` (bzw. seine spezifischeren Untertypen wie `MedicalBusiness`, `FoodEstablishment` oder `HomeAndConstructionBusiness`) besonders relevant. Damit lassen sich strukturiert übermitteln:

- **Name, Adresse und Telefonnummer** (NAP-Daten) – konsistent und maschinenlesbar
- **Öffnungszeiten** – inklusive Sonderregelungen für Feiertage
- **Geo-Koordinaten** – für die präzise Verortung in der lokalen Suche
- **Bewertungen** – sofern sie auf der eigenen Website eingebunden sind
- **Angebotene Leistungen** – über verknüpfte `Service`-Objekte

Ein konkretes Beispiel: Ein Tischlereibetrieb in Hall in Tirol betreibt eine einfache Website mit Kontaktseite. Ohne strukturierte Daten muss Google aus dem Seitentext ableiten, was das Unternehmen macht, wo es sich befindet und wann es erreichbar ist. Mit einem korrekt eingebetteten `LocalBusiness`-Block im JSON-LD-Format weiß die Suchmaschine exakt: Unternehmenstyp ist `HomeAndConstructionBusiness`, die Adresse lautet Musterstraße 4, 6060 Hall in Tirol, geöffnet ist Montag bis Freitag von 7:30 bis 17:00 Uhr. Diese Klarheit reduziert Interpretationsspielraum – und das ist im technischen SEO ein echter Vorteil.

## Wie strukturierte Daten in die Praxis umgesetzt werden

Die Implementierung erfolgt im Quellcode der Website, idealerweise so früh wie möglich im Projektverlauf – also beim Aufbau oder Relaunch einer Seite. Nachträgliches Einpflegen ist zwar möglich, aber aufwändiger, weil es eine saubere Abstimmung mit dem bestehenden CMS oder Framework erfordert.

Ein korrektes `LocalBusiness`-Markup sieht in JSON-LD vereinfacht so aus:

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Tischlerei Muster GmbH",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstraße 4",
    "addressLocality": "Hall in Tirol",
    "postalCode": "6060",
    "addressCountry": "AT"
  },
  "telephone": "+43 5223 000000",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "07:30",
      "closes": "17:00"
    }
  ],
  "url": "https://www.tischlerei-muster.at"
}
```

Wichtig ist dabei die Konsistenz: Die hier angegebenen NAP-Daten sollten exakt mit jenen im Google Business Profile und auf der Website selbst übereinstimmen. Abweichungen – etwa unterschiedliche Schreibweisen der Adresse – können dazu führen, dass Suchmaschinen die Informationen als widersprüchlich einstufen.

Nach der Implementierung empfiehlt sich eine Überprüfung mit dem [Rich Results Test](https://search.google.com/test/rich-results) von Google sowie der Schema Markup Validator unter validator.schema.org. Beide Tools zeigen an, ob das Markup syntaktisch korrekt ist und welche Felder erkannt wurden.

## Eine Vorlage zum Direktverwenden

Das bisher Erklärte zeigt, was strukturierte Daten leisten und warum sie relevant sind. Hier finden Sie einen vollständigeren `LocalBusiness`-Block, den Sie tatsächlich übernehmen können – kein weiteres Anschauungsbeispiel, sondern ein Ausgangspunkt mit den gängigen Feldern bereits ausgefüllt, den Sie mit Ihren eigenen Angaben anpassen und in den `<head>` einsetzen können.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Musterbetrieb GmbH",
  "url": "https://www.musterbetrieb.at",
  "image": "https://www.musterbetrieb.at/bilder/betrieb.jpg",
  "logo": "https://www.musterbetrieb.at/bilder/logo.svg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstraße 1",
    "postalCode": "6020",
    "addressLocality": "Innsbruck",
    "addressRegion": "Tirol",
    "addressCountry": "AT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.2692,
    "longitude": 11.4041
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Tirol"
  },
  "sameAs": [
    "https://www.facebook.com/musterbetrieb",
    "https://www.instagram.com/musterbetrieb"
  ]
}
```

Worauf Sie vor dem Einsatz achten sollten:

- **Wählen Sie den spezifischsten passenden Typ.** `LocalBusiness` funktioniert, aber `Restaurant`, `HairSalon`, `HomeAndConstructionBusiness` oder `Electrician` sagen Suchmaschinen mehr. Die vollständige Liste der Untertypen finden Sie auf schema.org.
- **Jeder Wert muss dem entsprechen, was Besucherinnen und Besucher tatsächlich auf der Seite sehen.** Markup, das dem sichtbaren Inhalt widerspricht, ist schlimmer als gar keines.
- **`addressCountry` erhält den ISO-Code `AT`,** nicht den ausgeschriebenen Ländernamen.
- **Verwenden Sie Ihre echten Koordinaten.** Klicken Sie in einem Kartendienst mit der rechten Maustaste auf Ihren Standort und übernehmen Sie die angezeigten Werte; erfundene Koordinaten platzieren Sie in der falschen Straße.
- **Als Kleinunternehmer:in lassen Sie `vatID` einfach weg,** statt eine zu erfinden. Ein fehlendes optionales Feld ist unproblematisch, ein falsches nicht.
- **Wo es hingehört:** in den `<head>`, als `<script type="application/ld+json">`-Element.
- **Prüfen Sie es, bevor Sie sich darauf verlassen.** Googles Rich Results Test und der Validator unter validator.schema.org sind beide kostenlos und zeigen Fehler zuverlässig an. Strukturierte Daten, die die Validierung nicht bestehen, bewirken nichts.

Ein Feld fehlt bewusst: `priceRange`. Es ist optional, und ein Platzhalter aus ein paar Währungszeichen ist schlechter als das Weglassen – tragen Sie es erst ein, wenn Sie einen echten Wert haben, der widerspiegelt, was Sie tatsächlich verlangen.

Zwei weitere Felder gehören in einen echten Eintrag, stehen im Block oben aber bewusst nicht: `telephone` und `email`. Tragen Sie Ihre eigenen ein. Das erste Beispiel in diesem Artikel zeigt das Format der Telefonnummer – international, mit Ländervorwahl.

## Was strukturierte Daten nicht sind

Es lohnt sich, an dieser Stelle realistisch zu bleiben: Schema.org-Markup ist kein Selbstläufer und kein Allheilmittel. Es ist ein technisches Signal unter vielen, das Suchmaschinen dabei unterstützt, Ihre Website besser zu verstehen. Ob und wie stark sich das auf die Sichtbarkeit auswirkt, hängt von zahlreichen weiteren Faktoren ab – von der Qualität der Inhalte über die Seitenstruktur bis hin zur allgemeinen Domain-Autorität. Strukturierte Daten sind ein solides Fundament, kein Ersatz für durchdachte Inhalte und eine technisch saubere Website.

---

Strukturierte Daten gehören bei Lechner Studios zum technischen Standardrepertoire bei jedem Website-Aufbau – nicht als optionales Extra, sondern als Teil einer sorgfältigen Umsetzung. Wenn Sie wissen möchten, wie Ihre Website in dieser Hinsicht aufgestellt ist oder was sich im Rahmen eines Projekts umsetzen ließe, finden Sie weitere Informationen unter [SEO & technische Optimierung](/de/seo) oder nehmen Sie direkt [Kontakt auf](/de/contact).
