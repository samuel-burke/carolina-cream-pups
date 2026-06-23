/**
 * CONTENT TYPES — the shape of all editable content.
 *
 * These types are the contract between the content source and the UI. Today the
 * source is in-code data (see `content.ts`); when a CMS (Sanity) is added later,
 * its schemas must produce these same shapes and nothing in the components or
 * pages has to change. Every image is an `ImageAsset` so `ImageBox` is reused
 * verbatim regardless of where the image comes from.
 */
import type { ImageAsset } from "./images";

export type Cta = { label: string; href: string };

/** Home — sage status band that answers "are puppies available?". */
export type LitterStatus = {
  headline: string;
  detail: string;
  cta: Cta;
};

export type WaitlistState = "open" | "full" | "closed";

/** One sex-specific reservation waitlist. Position = pick order. */
export type Waitlist = {
  sex: "Male" | "Female";
  state: WaitlistState;
  reservations: number;
  note?: string;
};

/** Compact dam × sire pairing for the current/upcoming litter. */
export type LitterPairing = {
  damName: string;
  damImage: ImageAsset;
  sireName: string;
  sireImage: ImageAsset;
};

export type ReserveContent = {
  status: "expected" | "born";
  title: string;
  timingLabel: string;
  summary: string;
  /** Shown when born (e.g. "4 males · 2 females"); omit while expected. */
  counts?: string;
  pairing: LitterPairing;
  waitlists: { male: Waitlist; female: Waitlist };
};

export type Faq = { question: string; answer: string };

/** A title + body + image row (home differentiators). */
export type Feature = { title: string; body: string; image: ImageAsset };

export type HomeContent = {
  hero: { place: string; tagline: string; cta: Cta; image: ImageAsset };
  intro: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: Cta;
    image: ImageAsset;
  };
  differentiators: { eyebrow: string; heading: string; items: Feature[] };
  finalCta: { eyebrow: string; heading: string; body: string; cta: Cta };
};

export type TimelineStep = { head: string; body: string };

export type AboutContent = {
  eyebrow: string;
  heading: string;
  intro: { lead: string; paragraphs: string[]; image: ImageAsset };
  timeline: { eyebrow: string; heading: string; body: string; steps: TimelineStep[] };
};

export type ParentProfile = {
  role: string;
  name: string;
  description: string;
  clearances: string[];
  image: ImageAsset;
};

/** Gallery — a litter photo (keeps its natural aspect ratio in the masonry). */
export type GalleryImage = { image: ImageAsset; ratio: string };

/** Gallery — a past puppy, grown up. */
export type Alumnus = { name: string; caption: string; image: ImageAsset };

export type GalleryContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  litter: { title: string; born: string; images: GalleryImage[] };
  alumni: { eyebrow: string; heading: string; members: Alumnus[] };
};

export type PairingPoint = { title: string; body: string };

export type ParentsContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  parents: ParentProfile[];
  pairing: { eyebrow: string; heading: string; points: PairingPoint[] };
};
