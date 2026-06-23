import type { MetadataRoute } from "next";
import { noindex, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging / non-production: block all crawlers and advertise no sitemap.
  if (noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
