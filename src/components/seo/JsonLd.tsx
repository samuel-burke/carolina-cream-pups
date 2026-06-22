import { site } from "@/lib/site";

/**
 * LocalBusiness structured data for rich results / local SEO. Rendered once in
 * the document head. Extend with `aggregateRating`, `telephone`, or `sameAs`
 * (social profiles) as that information becomes available.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.contact.email,
    image: `${site.url}/images/hero.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.regionCode,
      addressCountry: site.location.country,
    },
    areaServed: `${site.location.region}, ${site.location.country}`,
    knowsAbout: site.breed,
    sameAs: Object.values(site.contact.social).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
