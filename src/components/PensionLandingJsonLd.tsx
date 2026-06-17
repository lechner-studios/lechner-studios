import React from "react";
import { dictionaries } from "../i18n/dictionaries";
import type { Locale } from "../i18n/config";

const BASE = "https://lechner-studios.at";

export default function PensionLandingJsonLd({ locale }: { locale: Locale }) {
  const d = dictionaries[locale].pensionLanding;
  const url = `${BASE}/${locale}/pension-website-tirol`;
  const crumbName = locale === "de" ? "Pension-Website Tirol" : "Guesthouse Website Tyrol";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: d.metaTitle,
        description: d.metaDescription,
        serviceType: "Web design & automation",
        provider: { "@id": `${BASE}#organization` },
        areaServed: { "@type": "AdministrativeArea", name: "Tirol" },
        url,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: "3900",
          highPrice: "9900",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "de" ? "Start" : "Home", item: `${BASE}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Webdesign", item: `${BASE}/${locale}/webdesign` },
          { "@type": "ListItem", position: 3, name: crumbName, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
