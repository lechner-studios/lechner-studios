import React from "react";
import { dictionaries } from "../i18n/dictionaries";
import type { Locale } from "../i18n/config";

const BASE = "https://lechner-studios.at";

export default function WebsiteCheckJsonLd({ locale }: { locale: Locale }) {
  const d = dictionaries[locale].websiteCheck;
  const url = `${BASE}/${locale}/website-check`;
  const crumbName = "Website-Check";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: d.metaTitle,
        description: d.metaDescription,
        serviceType: "Website audit",
        provider: { "@id": `${BASE}#organization` },
        areaServed: { "@type": "AdministrativeArea", name: "Tirol" },
        url,
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: "290",
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
          { "@type": "ListItem", position: 2, name: locale === "de" ? "SEO" : "SEO", item: `${BASE}/${locale}/seo` },
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
