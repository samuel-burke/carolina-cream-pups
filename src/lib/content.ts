/**
 * CONTENT ACCESS LAYER — the single doorway every page uses to read editable
 * content (litters, puppies, photos, FAQ, and page copy).
 *
 * Why async: the accessors are async even though they currently return in-code
 * data. That is deliberate. When a CMS (Sanity) is added later, each function
 * body is swapped for a `await client.fetch(...)` returning the SAME type — and
 * because pages already `await` these, no component or page changes. See
 * docs/SANITY-MIGRATION.md.
 *
 * To edit content TODAY (developer): change the data below. The shapes are
 * enforced by the types in content-types.ts.
 */
import { galleryImages, images } from "./images";
import type {
  AboutContent,
  Faq,
  GalleryContent,
  HomeContent,
  Litter,
  LitterStatus,
  ParentsContent,
} from "./content-types";

export async function getHomeContent(): Promise<HomeContent> {
  return {
    hero: {
      place: "Wake Forest, North Carolina",
      tagline: "A calm, loving start for every puppy.",
      cta: { label: "Join the Waitlist", href: "/reserve" },
      image: images.heroHome,
    },
    intro: {
      eyebrow: "Hey y'all",
      heading: "We're a family raising goldens underfoot — not a kennel.",
      body: "Your story in two or three sentences — who you are, how long you've done this, and the one belief that shapes how you raise every litter.",
      cta: { label: "Read our story", href: "/about" },
      image: images.breederHome,
    },
    differentiators: {
      eyebrow: "Why families choose us",
      heading: "Three things that set our puppies apart.",
      items: [
        {
          title: "Puppy Culture, start to finish",
          body: "A complete 12-week program — calmer, more confident, easier to train puppies. Most breeders don't do this. We do all of it.",
          image: images.diffPuppyCulture,
        },
        {
          title: "Both parents health tested",
          body: "OFA hips, elbows, heart, and eyes, plus full genetic panels. The clearances are on the parents' page — not just promised.",
          image: images.diffHealthTested,
        },
        {
          title: "Early Neurological Stimulation from day 3",
          body: "A few minutes of gentle handling each day in the first weeks builds resilience that lasts a lifetime.",
          image: images.diffEns,
        },
      ],
    },
    finalCta: {
      eyebrow: "Ready when you are",
      heading: "Join the waitlist for an upcoming litter.",
      body: "A short application helps us match the right puppy to your home. No deposit to apply.",
      cta: { label: "Start your application", href: "/contact" },
    },
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  return {
    eyebrow: "About us",
    heading: "Who we are, and how we raise them.",
    intro: {
      lead: "We started raising English Cream Goldens because we wanted to do it the right way — in our home, with our kids, our cats, and a few farm animals underfoot.",
      paragraphs: [
        "Your origin story continues — how long you've done this, what you've learned, the standard you hold yourself to.",
        "What a family can expect from you: communication, lifetime support, and a puppy raised for temperament first.",
      ],
      image: images.aboutPortrait,
    },
    timeline: {
      eyebrow: "The first eight weeks",
      heading: "Every puppy follows the same intentional head start.",
      body: "This is the part most people never see — and it's the difference between a puppy that's merely cute and one that's genuinely ready for your home.",
      steps: [
        { head: "Days 1–3 · ENS begins", body: "Gentle daily handling builds early resilience." },
        { head: "Week 4 · Weaning pen", body: "More space, a potty area, and new textures to explore." },
        { head: "Weeks 5–7 · Training", body: "Come, sit, leash, crate time, and lots of calm affection." },
        { head: "Week 8 · Vet & home", body: "First vaccines, deworming, vet check — ready to go home." },
      ],
    },
  };
}

export async function getParentsContent(): Promise<ParentsContent> {
  const clearances = ["OFA Hips", "Elbows", "Heart", "Eyes", "Genetic Panel"];
  return {
    eyebrow: "Meet the parents",
    heading: "Our dams & sires.",
    intro:
      "Health clearances and temperament are everything. Here's who your puppy comes from — and what these two bring together.",
    parents: [
      {
        role: "Dam",
        name: "Name",
        description: "Temperament, weight, color, and a sentence on personality and lineage.",
        clearances,
        image: images.parentDam,
      },
      {
        role: "Sire",
        name: "Name",
        description: "Temperament, weight, color, and a sentence on personality and lineage.",
        clearances,
        image: images.parentSire,
      },
    ],
    pairing: {
      eyebrow: "The pairing",
      heading: "What this cross is bred for.",
      points: [
        {
          title: "Temperament",
          body: "Calm, biddable, people-oriented — bred for family and therapy-style dispositions.",
        },
        {
          title: "Conformation",
          body: "True English Cream type: blocky heads, light coats, sturdy build.",
        },
        {
          title: "Health depth",
          body: "Generations of cleared lines behind both parents, not just the parents themselves.",
        },
      ],
    },
  };
}

export async function getGallery(): Promise<GalleryContent> {
  return {
    eyebrow: "Photo gallery",
    heading: "Our pups, and where they are now.",
    intro:
      "Browse our puppies — and meet some of our past pups all grown up with their families.",
    litter: {
      title: "Our pups",
      born: "",
      // Renders every gallery photo uploaded (any count); ratio comes from each
      // photo's real dimensions so the masonry stays natural. Falls back to the
      // placeholder grid until real gallery photos are added.
      images: galleryImages().map((image) => ({
        image,
        ratio: `${image.width}/${image.height}`,
      })),
    },
    alumni: {
      eyebrow: "Where they are now",
      heading: "Our puppies, grown up and home.",
      members: [
        { name: "Luna", caption: "Two years old · Charlotte, NC", image: images.alumniLuna },
        { name: "Cooper", caption: "Therapy dog · Raleigh, NC", image: images.alumniCooper },
        { name: "Daisy", caption: "Three years old · the Outer Banks", image: images.alumniDaisy },
      ],
    },
  };
}

export async function getLitterStatus(): Promise<LitterStatus> {
  return {
    headline: "Spring 2026 litter · 3 spots open",
    detail: "Next litter expected late summer.",
    cta: { label: "See available puppies", href: "/reserve" },
  };
}

export async function getLitter(): Promise<Litter> {
  return {
    title: "Spring 2026 litter",
    born: "Born March 2nd",
    readyNote:
      "Born March 2nd · ready for homes late April. Three still looking for their families.",
    puppies: [
      {
        name: "Biscuit",
        meta: "Male · cream",
        note: "The confident one — first to every new thing, loves people.",
        available: true,
        image: images.puppyBiscuit,
      },
      {
        name: "Willow",
        meta: "Female · light gold",
        note: "Gentle and watchful. Settles fast, great with kids.",
        available: true,
        image: images.puppyWillow,
      },
      {
        name: "Sailor",
        meta: "Male · cream",
        note: "Playful and food-motivated — will be a joy to train.",
        available: true,
        image: images.puppySailor,
      },
    ],
  };
}

export async function getFaqs(): Promise<Faq[]> {
  return [
    {
      question: "How do I reserve a puppy?",
      answer:
        "Start with a short application — there's no deposit to apply. Once we confirm we're a good fit, a deposit holds your spot in the litter, and you choose your puppy on pick day in birth order by deposit.",
    },
    {
      question: "What comes home with the puppy?",
      answer:
        "Each puppy goes home at eight weeks with age-appropriate vaccinations, deworming, a vet health check, and a starter kit. Replace this with your exact list (microchip, food, blanket, registration paperwork, etc.).",
    },
    {
      question: "Are the parents health tested?",
      answer:
        "Yes. Both parents have OFA clearances for hips, elbows, heart, and eyes, plus full genetic panels. You can review the clearances on the Meet the Parents page.",
    },
    {
      question: "Do you offer a health guarantee?",
      answer:
        "Describe your health guarantee here — what it covers, for how long, and what's expected of you in return (vet visits, diet). This is a key trust signal for buyers.",
    },
    {
      question: "Do you ship puppies or is pickup required?",
      answer:
        "State your policy on pickup, ground/flight nanny transport, and the areas you serve. Many families travel to Wake Forest, NC to meet the dogs before bringing a puppy home.",
    },
  ];
}
