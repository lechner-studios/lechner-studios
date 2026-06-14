import type { MetadataRoute } from "next";

const BASE = "https://lechner-studios.at";

const routes = ["", "/work", "/about", "/contact", "/impressum", "/privacy"] as const;

function priorityFor(route: string): number {
  if (route === "") return 1.0;
  if (route === "/impressum" || route === "/privacy") return 0.5;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.flatMap((route) => [
    {
      url: `${BASE}/de${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: priorityFor(route),
      alternates: {
        languages: {
          "de-AT": `${BASE}/de${route}`,
          en: `${BASE}/en${route}`,
          "x-default": `${BASE}/de${route}`,
        },
      },
    },
    {
      url: `${BASE}/en${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: priorityFor(route),
      alternates: {
        languages: {
          "de-AT": `${BASE}/de${route}`,
          en: `${BASE}/en${route}`,
          "x-default": `${BASE}/de${route}`,
        },
      },
    },
  ]);
}
