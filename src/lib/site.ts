/**
 * SITE CONFIG & CONTENT — the single place to edit copy, nav, and business data.
 *
 * Keeping content out of components means non-developers can update litters,
 * contact details, and SEO metadata without touching JSX. It also feeds the
 * sitemap, JSON-LD structured data, and <head> metadata.
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

/** Current litter status shown in the home-page status band. */
export const litterStatus = {
  headline: "Spring 2026 litter · 3 spots open",
  detail: "Next litter expected late summer.",
  ctaLabel: "See available puppies",
  ctaHref: "/reserve",
} as const;

/** Available puppies for the Reserve page. */
export type Puppy = {
  name: string;
  meta: string;
  note: string;
  available: boolean;
  imageKey: keyof typeof import("./images").images;
};

export const currentLitter = {
  title: "Spring 2026 litter",
  born: "Born March 2nd",
  readyNote: "Born March 2nd · ready for homes late April. Three still looking for their families.",
  puppies: [
    {
      name: "Biscuit",
      meta: "Male · cream",
      note: "The confident one — first to every new thing, loves people.",
      available: true,
      imageKey: "puppyBiscuit",
    },
    {
      name: "Willow",
      meta: "Female · light gold",
      note: "Gentle and watchful. Settles fast, great with kids.",
      available: true,
      imageKey: "puppyWillow",
    },
    {
      name: "Sailor",
      meta: "Male · cream",
      note: "Playful and food-motivated — will be a joy to train.",
      available: true,
      imageKey: "puppySailor",
    },
  ],
} as const;
