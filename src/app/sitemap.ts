import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return nav.map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    lastModified: now,
    changeFrequency: href === "/reserve" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/reserve" ? 0.9 : 0.7,
  }));
}
