/**
 * SITE CONFIG — brand, navigation, and SEO basics.
 *
 * This file holds the stable, infrequently-changing configuration that feeds
 * <head> metadata, the sitemap, and JSON-LD. It is intentionally NOT part of the
 * editable content layer: editable content (litters, puppies, photos, copy, FAQ)
 * lives in content.ts behind typed accessors. See docs/SANITY-MIGRATION.md.
 */

export const site = {
  name: "Carolina Cream Pups",
  legalName: "Carolina Cream Pups",
  tagline: "A calm, loving start for every puppy.",
  description:
    "Family-raised AKC English Cream Golden Retrievers in Wake Forest, North Carolina. Health-tested parents, Puppy Culture program, and lifetime breeder support.",
  // Update to the production origin before launch (used for canonical URLs,
  // sitemap, and Open Graph). Falls back here if env var is unset.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://carolinacreampups.com",
  locale: "en_US",
  location: {
    city: "Wake Forest",
    region: "North Carolina",
    regionCode: "NC",
    country: "US",
  },
  breed: "English Cream Golden Retriever",
  contact: {
    email: "hello@carolinacreampups.com",
    // Add real handles when available; empty entries are skipped in the UI.
    social: {
      instagram: "",
      facebook: "",
    },
  },
} as const;

/**
 * When true, the site asks search engines not to index it. Set
 * NEXT_PUBLIC_NOINDEX=1 in non-production environments (e.g. the beta/staging
 * deploy) so staging never competes with production in search results.
 */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX === "1";

export type NavItem = { href: string; label: string };
/** Primary navigation. Order here drives the header and footer. */
export const nav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/parents", label: "Meet the Parents" },
  { href: "/reserve", label: "Reserve a Puppy" },
  { href: "/gallery", label: "Photo Gallery" },
  { href: "/contact", label: "Contact" },
];
