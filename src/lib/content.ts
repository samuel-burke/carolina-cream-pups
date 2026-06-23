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
import { airtableConfigured, fetchTable } from "./airtable";
import type {
  AboutContent,
  Faq,
  GalleryContent,
  HomeContent,
  LitterStatus,
  ParentsContent,
  ReserveContent,
  TestimonialsContent,
  Waitlist,
  WaitlistState,
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
  // Placeholder clearances — replace each result, CHIC #, registered name, and
  // verifyUrl with this dog's real OFA/CHIC record before launch.
  const clearances = [
    { test: "Hips", result: "OFA Good" },
    { test: "Elbows", result: "OFA Normal" },
    { test: "Heart", result: "Normal — Advanced Cardiac (cardiologist)" },
    { test: "Eyes", result: "Normal — CAER" },
    { test: "prcd-PRA", result: "Clear" },
    { test: "Ichthyosis (ICT-A)", result: "Clear" },
    { test: "DM", result: "Clear" },
  ];
  return {
    eyebrow: "Meet the parents",
    heading: "Our dams & sires.",
    intro:
      "Health clearances and temperament are everything. Every result below is verifiable in the public OFA/CHIC databases — here's who your puppies come from.",
    parents: [
      {
        role: "Dam",
        name: "Name",
        registeredName: "AKC registered name",
        chicNumber: "Add CHIC #",
        verifyUrl: "https://ofa.org/advanced-search/",
        description: "Temperament, weight, color, and a sentence on personality and lineage.",
        clearances,
        titles: ["AKC Canine Good Citizen"],
        image: images.parentDam,
      },
      {
        role: "Sire",
        name: "Name",
        registeredName: "AKC registered name",
        chicNumber: "Add CHIC #",
        verifyUrl: "https://ofa.org/advanced-search/",
        description: "Temperament, weight, color, and a sentence on personality and lineage.",
        clearances,
        titles: ["AKC Canine Good Citizen"],
        image: images.parentSire,
      },
      {
        role: "Dam",
        name: "Name",
        registeredName: "AKC registered name",
        chicNumber: "Add CHIC #",
        verifyUrl: "https://ofa.org/advanced-search/",
        description: "Temperament, weight, color, and a sentence on personality and lineage.",
        clearances,
        titles: ["AKC Canine Good Citizen"],
        image: images.parentThird,
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
    health: {
      eyebrow: "Health testing & ethics",
      heading: "Every breeding dog is fully health tested — and you can verify it.",
      body: "We test to the standards recommended for Golden Retrievers before any dog is bred, and we publish the results so you never have to take our word for it. Look up any of our dogs by name or CHIC number in the public databases below.",
      standards: [
        "Hips & elbows — OFA evaluated",
        "Heart — OFA Advanced Cardiac, by a board-certified cardiologist",
        "Eyes — annual OFA/CAER exam",
        "Genetic panel — prcd-PRA, PRA1/PRA2, Ichthyosis, DM and more",
        "CHIC number issued once all required tests are on file",
      ],
      links: [
        { label: "OFA database (ofa.org)", href: "https://ofa.org/advanced-search/" },
        { label: "About CHIC", href: "https://ofa.org/about/chic-program/" },
        { label: "AKC", href: "https://www.akc.org/" },
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

/**
 * Operational data (current litter + the two waitlists) is editable in Airtable
 * when AIRTABLE_API_KEY + AIRTABLE_BASE_ID are set; otherwise these in-code
 * defaults are used (dev/CI/sandbox and as a resilient fallback if Airtable is
 * unreachable).
 */
const RESERVE_SUMMARY =
  "We reserve by waitlist, not by individual puppy. Join the male or female list with a deposit; when the litter arrives you choose in list order from the puppies of that sex — so your number is your pick order.";

const RESERVE_DEFAULTS: ReserveContent = {
  status: "born",
  title: "Spring 2026 litter",
  timingLabel: "Born March 2nd · ready for homes late April",
  summary: RESERVE_SUMMARY,
  counts: "4 males · 2 females",
  pairing: { damName: "Name", damImage: images.parentDam, sireName: "Name", sireImage: images.parentSire },
  waitlists: {
    male: { sex: "Male", state: "open", reservations: 2 },
    female: {
      sex: "Female",
      state: "full",
      reservations: 5,
      note: "Next openings expected with the summer litter.",
    },
  },
};

const LITTER_STATUS_DEFAULT: LitterStatus = {
  headline: "Spring 2026 litter · waitlists open",
  detail: "Next litter expected late summer.",
  cta: { label: "See the litter & waitlists", href: "/reserve" },
};

const asState = (s: string): WaitlistState =>
  s === "open" || s === "full" || s === "closed" ? s : "closed";

/** Coerce an Airtable field to a trimmed string (single-selects/text). */
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));

/** Coerce an Airtable field to a non-negative integer (number field). */
const num = (v: unknown): number => {
  const n = typeof v === "number" ? v : Number.parseInt(str(v), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

/** Build one Waitlist from the rows (matched by sex), with safe coercion. */
function listFromRows(rows: Record<string, unknown>[], sex: "Male" | "Female"): Waitlist {
  const r = rows.find((x) => str(x.sex).toLowerCase() === sex.toLowerCase());
  const note = str(r?.note);
  return {
    sex,
    state: asState(str(r?.state).toLowerCase()),
    reservations: num(r?.reservations),
    note: note ? note : undefined,
  };
}

/** Pure mapper: Airtable rows -> ReserveContent (images come from the manifest). */
export function mapReserveRows(
  litterRows: Record<string, unknown>[],
  waitlistRows: Record<string, unknown>[],
): ReserveContent {
  const l = litterRows[0] ?? {};
  return {
    status: str(l.status) === "expected" ? "expected" : "born",
    title: str(l.title) || RESERVE_DEFAULTS.title,
    timingLabel: str(l.timingLabel) || RESERVE_DEFAULTS.timingLabel,
    summary: RESERVE_SUMMARY,
    counts: str(l.counts) || undefined,
    pairing: {
      damName: str(l.damName) || "Name",
      damImage: images.parentDam,
      sireName: str(l.sireName) || "Name",
      sireImage: images.parentSire,
    },
    waitlists: {
      male: listFromRows(waitlistRows, "Male"),
      female: listFromRows(waitlistRows, "Female"),
    },
  };
}

/** Pure mapper: Airtable rows -> the home status band. */
export function mapLitterStatusRows(
  litterRows: Record<string, unknown>[],
  waitlistRows: Record<string, unknown>[],
): LitterStatus {
  const l = litterRows[0] ?? {};
  const title = str(l.title) || RESERVE_DEFAULTS.title;
  const male = listFromRows(waitlistRows, "Male");
  const female = listFromRows(waitlistRows, "Female");
  const anyOpen = male.state === "open" || female.state === "open";
  return {
    headline: `${title} · ${anyOpen ? "waitlists open" : "waitlist updates"}`,
    detail: str(l.timingLabel) || LITTER_STATUS_DEFAULT.detail,
    cta: { label: "See the litter & waitlists", href: "/reserve" },
  };
}

export async function getLitterStatus(): Promise<LitterStatus> {
  if (!airtableConfigured()) return LITTER_STATUS_DEFAULT;
  try {
    const [litter, lists] = await Promise.all([fetchTable("Litter"), fetchTable("Waitlists")]);
    return mapLitterStatusRows(litter, lists);
  } catch {
    return LITTER_STATUS_DEFAULT;
  }
}

export async function getReserve(): Promise<ReserveContent> {
  if (!airtableConfigured()) return RESERVE_DEFAULTS;
  try {
    const [litter, lists] = await Promise.all([fetchTable("Litter"), fetchTable("Waitlists")]);
    return mapReserveRows(litter, lists);
  } catch {
    return RESERVE_DEFAULTS;
  }
}

export async function getTestimonials(): Promise<TestimonialsContent> {
  return {
    eyebrow: "Testimonials",
    heading: "Families who chose us.",
    intro:
      "A few words from the homes our puppies have joined. Replace these with real notes from your families.",
    items: [
      {
        quote:
          "From our first call to pick-up day, everything was thoughtful and unhurried. Our puppy came home calm, healthy, and already so confident around our kids.",
        name: "The Harrisons",
        location: "Raleigh, NC",
        rating: 5,
        image: images.testimonial1,
      },
      {
        quote:
          "You can tell these dogs are raised underfoot, not in a kennel. The socialization showed immediately — crate training was nearly done for us.",
        name: "Megan & Tyler",
        location: "Charlotte, NC",
        rating: 5,
        image: images.testimonial2,
      },
      {
        quote:
          "Health testing, clear communication, and lifetime support that's actually real. We'll be back for our second from them.",
        name: "The Bennetts",
        location: "Wilmington, NC",
        rating: 5,
        image: images.testimonial3,
      },
      {
        quote:
          "Our girl is now a certified therapy dog. The temperament she came with made all the difference — exactly what they promised.",
        name: "Dana P.",
        location: "the Outer Banks",
        rating: 5,
        image: images.testimonial4,
      },
    ],
  };
}

export async function getFaqs(): Promise<Faq[]> {
  return [
    {
      question: "How do I reserve a puppy?",
      answer:
        "Start with a short application — there's no deposit to apply. Once we're a good fit, a deposit reserves your numbered spot on either the male or female waitlist. When the litter arrives, families choose in list order from the puppies of that sex — you reserve a spot in line, not a specific puppy.",
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
