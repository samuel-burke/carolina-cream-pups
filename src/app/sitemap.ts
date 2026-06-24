import type { MetadataRoute } from "next";
import { legalNav, nav, secondaryNav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const primary = [...nav, ...secondaryNav].map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    lastModified: now,
    changeFrequency: (href === "/reserve" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: href === "/" ? 1 : href === "/reserve" ? 0.9 : 0.7,
  }));
  const legal = legalNav.map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));
  return [...primary, ...legal];
}
