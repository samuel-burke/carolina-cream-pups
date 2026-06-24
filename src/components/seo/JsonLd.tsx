import { site, socialLinks } from "@/lib/site";

/**
 * Site-wide structured data (LocalBusiness + WebSite) for rich results / local
 * SEO. Rendered once in the document head. `sameAs`, `telephone`, and `logo`
 * populate automatically from `site` config as that info is filled in.
 */
export function JsonLd() {
  const sameAs = socialLinks().map((l) => l.href);

  const business = {
    "@type": "LocalBusiness",
    "@id": `${site.url}#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.contact.email,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    image: `${site.url}/og.png`,
    logo: `${site.url}/icon-512.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.regionCode,
      addressCountry: site.location.country,
    },
    areaServed: `${site.location.region}, ${site.location.country}`,
    knowsAbout: site.breed,
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    name: site.name,
    url: site.url,
    publisher: { "@id": `${site.url}#business` },
  };

  const data = { "@context": "https://schema.org", "@graph": [business, website] };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
