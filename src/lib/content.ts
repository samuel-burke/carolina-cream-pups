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
  GoingHomeContent,
  HomeContent,
  LitterStatus,
  ParentsContent,
  ReserveContent,
  Testimonial,
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
      heading: "We're a family that raises goldens at home, not a kennel.",
      body: "A couple of sentences about who you are, how long you've been doing this, and what matters most to you when you raise a litter.",
      cta: { label: "Read our story", href: "/about" },
      image: images.breederHome,
    },
    differentiators: {
      eyebrow: "Why families choose us",
      heading: "Three things that set our puppies apart.",
      items: [
        {
          title: "Puppy Culture, start to finish",
          body: "We follow the full 12-week Puppy Culture program. It takes more work on our end, but it's a big reason our puppies come home calmer and easier to train.",
          image: images.diffPuppyCulture,
        },
        {
          title: "Both parents health tested",
          body: "Both parents are cleared for hips, elbows, heart, and eyes, with full genetic panels too. You can see the actual results on our parents' page.",
          image: images.diffHealthTested,
        },
        {
          title: "Early Neurological Stimulation from day 3",
          body: "For the first couple of weeks we spend a few gentle minutes a day with each puppy. It's a small thing that helps them grow up steadier and more confident.",
          image: images.diffEns,
        },
      ],
    },
    finalCta: {
      eyebrow: "Ready when you are",
      heading: "Join the waitlist for an upcoming litter.",
      body: "Fill out a short application and we'll help match the right puppy to your home. There's no deposit to apply.",
      cta: { label: "Start your application", href: "/contact" },
    },
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  return {
    eyebrow: "About us",
    heading: "Who we are, and how we raise them.",
    intro: {
      lead: "We started raising English Cream Goldens because we wanted to do it right, here at home with our kids and a houseful of animals.",
      paragraphs: [
        "A bit more of your story here: how long you've been at it, what you've learned along the way, and the standard you hold yourself to.",
        "And what a family can count on from you, like steady communication, support for the life of the dog, and a puppy raised for temperament first.",
      ],
      image: images.aboutPortrait,
    },
    timeline: {
      eyebrow: "The first eight weeks",
      heading: "Every puppy gets the same head start.",
      body: "Most people never see this part, but it's a big reason our puppies settle in so well once they're home.",
      steps: [
        { head: "Days 1–3 · ENS begins", body: "Gentle daily handling builds early resilience." },
        { head: "Week 4 · Weaning pen", body: "More space, a potty area, and new textures to explore." },
        { head: "Weeks 5–7 · Training", body: "Come, sit, leash, crate time, and lots of calm affection." },
        { head: "Week 8 · Vet & home", body: "First vaccines, deworming, and a vet check. Ready to go home." },
      ],
    },
  };
}

export async function getGoingHomeContent(): Promise<GoingHomeContent> {
  return {
    eyebrow: "Going home",
    heading: "What comes home with your puppy — and how to be ready.",
    intro:
      "Bringing a puppy home is a big day. Here's exactly what your puppy leaves with, what to have ready before pickup, and how we support you through the first weeks and beyond.",
    included: {
      eyebrow: "What's included",
      heading: "Every puppy goes home at eight weeks with:",
      items: [
        {
          title: "Vet check & vaccinations",
          body: "A full vet health exam, age-appropriate vaccinations, and deworming — with records you can hand straight to your own vet.",
        },
        {
          title: "Microchip",
          body: "Registered and ready to update to your contact details, so your puppy can always find its way home.",
        },
        {
          title: "AKC registration paperwork",
          body: "Registration application and your puppy's pedigree, plus a copy of the parents' health clearances.",
        },
        {
          title: "One-year genetic health guarantee",
          body: "Written coverage for serious hereditary or congenital conditions. (See the full terms in your sales agreement.)",
        },
        {
          title: "Go-home starter kit",
          body: "A bag of the food your puppy is already eating, a blanket that smells like home and littermates, and a favorite toy.",
        },
        {
          title: "Puppy Culture head start",
          body: "Eight weeks of socialization, early potty and crate work, and gentle handling — so your puppy arrives confident and ready to learn.",
        },
      ],
    },
    prepare: {
      eyebrow: "Before pickup",
      heading: "A short list to have ready at home.",
      body: "You don't need much — just the basics, set up before your puppy walks in the door so the first day is calm.",
      steps: [
        { head: "A safe space", body: "A crate and a small gated area for naps, meals, and downtime." },
        { head: "Food & bowls", body: "We'll tell you the exact food; keep them on it to start, then transition slowly." },
        { head: "Potty plan", body: "Pick a potty spot and a schedule. Young puppies go out often — and right after meals and naps." },
        { head: "Vet appointment", body: "Book a wellness visit within the first few days, as the health guarantee asks." },
      ],
    },
    firstDays: {
      eyebrow: "The first days home",
      heading: "Go slow, keep it calm, and let your puppy settle.",
      paragraphs: [
        "The first few days are about decompression, not training. Keep things quiet, limit visitors, and let your puppy explore one room at a time. Short, positive moments beat long, exciting ones.",
        "Expect a couple of unsettled nights — that's normal. A crate near your bed, a warm blanket, and a consistent bedtime routine help your puppy feel secure. Within a week, most puppies are sleeping through and finding their rhythm.",
        "Stick to the feeding schedule and potty routine, and reach out to us anytime. We've raised this litter from day one and we're always glad to help.",
      ],
      image: images.diffHealthTested,
    },
    support: {
      eyebrow: "We don't disappear",
      heading: "Lifetime breeder support.",
      body: "Questions about food, training, vet care, or just want to share a photo? We're a text away — for the whole life of your dog. If your circumstances ever change, your puppy always has a place to come back to.",
    },
    cta: {
      eyebrow: "Ready when you are",
      heading: "Have a question about bringing one home?",
      body: "We're happy to walk you through what to expect and help you get ready.",
      cta: { label: "Get in touch", href: "/contact" },
    },
  };
}

export async function getParentsContent(): Promise<ParentsContent> {
  // Placeholder clearances — replace each result, CHIC #, registered name, and
  // verifyUrl with this dog's real OFA/CHIC record before launch.
  const clearances = [
    { test: "Hips", result: "OFA Good" },
    { test: "Elbows", result: "OFA Normal" },
    { test: "Heart", result: "Normal (Advanced Cardiac, cardiologist)" },
    { test: "Eyes", result: "Normal (CAER)" },
    { test: "prcd-PRA", result: "Clear" },
    { test: "Ichthyosis (ICT-A)", result: "Clear" },
    { test: "DM", result: "Clear" },
  ];
  return {
    eyebrow: "Meet the parents",
    heading: "Our dams & sires.",
    intro:
      "Health and temperament are what matter most to us. Every result you see here can be looked up in the public OFA and CHIC databases. These are the dogs your puppy comes from.",
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
          body: "Calm, gentle, and people-loving. We breed for the kind of disposition that fits family life and therapy work.",
        },
        {
          title: "Conformation",
          body: "True English Cream type, with blocky heads, light coats, and a sturdy build.",
        },
        {
          title: "Health depth",
          body: "Both parents come from health-tested lines that go back generations, not just the parents themselves.",
        },
      ],
    },
    health: {
      eyebrow: "Health testing & ethics",
      heading: "Every one of our dogs is health tested, and you can check the results yourself.",
      body: "Before we breed any dog, we run the full set of tests recommended for Golden Retrievers, and we post the results so you don't have to take our word for it. You can look up any of our dogs by name or CHIC number in the databases below. Every puppy also comes home with a one-year genetic health guarantee.",
      standards: [
        "Hips and elbows, evaluated by OFA",
        "Heart, checked by a board-certified cardiologist (OFA Advanced Cardiac)",
        "Eyes, examined every year (OFA/CAER)",
        "A full genetic panel, including prcd-PRA, PRA1/PRA2, Ichthyosis, and DM",
        "A CHIC number, issued once all the required tests are on file",
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
      "Take a look at our puppies, plus a few of our past pups all grown up with their families.",
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
  "We reserve by waitlist instead of by individual puppy. You join the male or female list with a deposit, and once the litter arrives you choose in the order you're on the list. So your spot in line is your pick order.";

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

const TESTIMONIALS_DEFAULT: TestimonialsContent = {
  eyebrow: "Testimonials",
  heading: "Families who chose us.",
  intro:
    "A few words from the homes our puppies have joined. Replace these with real notes from your families.",
  items: [
    {
      quote:
        "From our first call to the day we picked her up, they took their time with us. Our puppy came home calm and healthy and was already so easy around our kids.",
      name: "The Harrisons",
      location: "Raleigh, NC",
      rating: 5,
      image: images.testimonial1,
    },
    {
      quote:
        "You can tell these dogs are raised in the house and not a kennel. The socialization really showed, and crate training was almost done for us.",
      name: "Megan & Tyler",
      location: "Charlotte, NC",
      rating: 5,
      image: images.testimonial2,
    },
    {
      quote:
        "The health testing, the communication, the help after we got home. All of it was real. We'll be back for our second one.",
      name: "The Bennetts",
      location: "Wilmington, NC",
      rating: 5,
      image: images.testimonial3,
    },
    {
      quote:
        "Our girl is a certified therapy dog now. She had the right temperament from day one, exactly what they told us to expect.",
      name: "Dana P.",
      location: "the Outer Banks",
      rating: 5,
      image: images.testimonial4,
    },
  ],
};

// Map an Airtable `image` value (e.g. "1" or "testimonial-2") to a manifest slot.
const TESTIMONIAL_IMAGES: Record<string, (typeof images)[keyof typeof images]> = {
  "1": images.testimonial1,
  "2": images.testimonial2,
  "3": images.testimonial3,
  "4": images.testimonial4,
};
const testimonialImage = (key: string) => TESTIMONIAL_IMAGES[key.match(/\d/)?.[0] ?? ""];

/** Pure mapper: Airtable rows -> Testimonial[] (skips rows missing quote/name). */
export function mapTestimonialsRows(rows: Record<string, unknown>[]): Testimonial[] {
  return rows
    .map((r): Testimonial | null => {
      const quote = str(r.quote);
      const name = str(r.name);
      if (!quote || !name) return null;
      const ratingSet = r.rating != null && str(r.rating) !== "";
      return {
        quote,
        name,
        location: str(r.location) || undefined,
        rating: ratingSet ? num(r.rating) : undefined,
        image: testimonialImage(str(r.image)),
      };
    })
    .filter((t): t is Testimonial => t !== null);
}

export async function getTestimonials(): Promise<TestimonialsContent> {
  if (!airtableConfigured()) return TESTIMONIALS_DEFAULT;
  try {
    const items = mapTestimonialsRows(await fetchTable("Testimonials"));
    return items.length ? { ...TESTIMONIALS_DEFAULT, items } : TESTIMONIALS_DEFAULT;
  } catch {
    return TESTIMONIALS_DEFAULT;
  }
}

export async function getFaqs(): Promise<Faq[]> {
  return [
    {
      question: "How do I reserve a puppy?",
      answer:
        "Start with a short application. There's no deposit just to apply. Once we know we're a good fit, a deposit holds your numbered spot on the male or female waitlist. When the litter arrives, families pick in list order from the puppies of that sex, so you're reserving a place in line rather than a specific puppy.",
    },
    {
      question: "What comes home with the puppy?",
      answer:
        "Each puppy goes home at eight weeks with age-appropriate vaccinations, deworming, a vet health check, and a starter kit. (Add your exact list here, like microchip, food, blanket, and registration paperwork.)",
    },
    {
      question: "Are the parents health tested?",
      answer:
        "Yes. Both parents have OFA clearances for hips, elbows, heart, and eyes, plus full genetic panels. You can review the clearances on the Meet the Parents page.",
    },
    {
      question: "Do you offer a health guarantee?",
      answer:
        "Yes. Every puppy comes with a one-year genetic health guarantee that covers serious hereditary or congenital conditions. (Add your exact terms here: what's covered, what we ask of you, like a vet visit within a few days and keeping up with vaccinations and diet, and how a claim works.)",
    },
    {
      question: "Do you ship puppies or is pickup required?",
      answer:
        "State your policy on pickup, ground or flight nanny transport, and the areas you serve. A lot of families travel to Wake Forest to meet the dogs before they bring a puppy home.",
    },
  ];
}
