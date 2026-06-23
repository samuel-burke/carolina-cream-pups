import { nav, site } from "@/lib/site";

/**
 * Emits BreadcrumbList structured data (Home › Page) for a subpage. Invisible —
 * it improves how the page is represented in search results. Looks up the page
 * label from the nav config so there's a single source of truth.
 */
export function Breadcrumbs({ href }: { href: string }) {
  const page = nav.find((n) => n.href === href);
  if (!page || href === "/") return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: page.label,
        item: new URL(href, site.url).toString(),
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
