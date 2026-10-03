import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { pages, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({
      url: p === "/" ? site.url : `${site.url}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : 0.7,
    })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
