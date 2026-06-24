import type { MetadataRoute } from "next";
import { nav, secondaryNav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [...nav, ...secondaryNav].map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    lastModified: now,
    changeFrequency: href === "/reserve" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/reserve" ? 0.9 : 0.7,
  }));
}
