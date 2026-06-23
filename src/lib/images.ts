/**
 * IMAGE MANIFEST — the single source of truth for every image on the site.
 *
 * Each slot is referenced by a short name (e.g. "hero"). It resolves automatically:
 *   - If a real photo has been processed (an entry for "<name>.jpg" exists in
 *     image-meta.generated.json) AND the CDN is configured
 *     (NEXT_PUBLIC_IMAGE_BASE_URL), the slot serves the optimized photo from the
 *     R2 CDN, with real dimensions + a blur-up placeholder.
 *   - Otherwise it falls back to the local SVG placeholder in /public/images.
 *
 * So populating photos needs NO edits here — see README "Images":
 *   1. Put originals in photos-src/, run `npm run photos:catalog`, map slots in
 *      photos.map.json, run `npm run photos` (writes <name>.jpg meta + blur).
 *   2. Upload r2-upload/* to the R2 bucket.
 *   3. Commit image-meta.generated.json. Each processed slot switches to its
 *      real photo automatically.
 *
 * (Edit `alt` here anytime to describe the real photos for accessibility + SEO.)
 */
import metaJson from "./image-meta.generated.json";

type ImageMeta = { width: number; height: number; blurDataURL: string };
const meta = metaJson as Record<string, ImageMeta>;

/** CDN origin for real photos (Cloudflare R2). Unset => local placeholders. */
const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "").replace(/\/+$/, "");

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tiny base64 preview shown (blurred) while the full image loads. */
  blurDataURL?: string;
};

/**
 * Resolve a slot to its CDN photo when available, else the SVG placeholder.
 * `width`/`height` are the placeholder's fallback dimensions; the real photo's
 * dimensions come from the generated metadata.
 */
const slot = (name: string, alt: string, width: number, height: number): ImageAsset => {
  const m = meta[`${name}.jpg`];
  return base && m
    ? { src: `${base}/${name}.jpg`, alt, width: m.width, height: m.height, blurDataURL: m.blurDataURL }
    : { src: `/images/${name}.svg`, alt, width, height };
};

export const images = {
  heroHome: slot("hero", "An English Cream Golden Retriever resting in soft natural light", 1600, 900),
  breederHome: slot("breeder-home", "The breeder at home with one of the golden retrievers", 800, 1000),
  diffPuppyCulture: slot("diff-puppy-culture", "A young puppy during a Puppy Culture socialization exercise", 800, 600),
  diffHealthTested: slot("diff-health-tested", "A healthy adult English Cream Golden Retriever outdoors", 800, 600),
  diffEns: slot("diff-ens", "A newborn puppy being gently handled during Early Neurological Stimulation", 800, 600),
  aboutPortrait: slot("about-portrait", "Portrait of the breeder at home with the dogs", 800, 1066),
  parentDam: slot("parent-dam", "Our dam, a light English Cream Golden Retriever", 800, 1000),
  parentSire: slot("parent-sire", "Our sire, a cream English Golden Retriever", 800, 1000),
  parentThird: slot("parent-3", "A third English Cream Golden Retriever parent", 800, 1000),
  puppyBiscuit: slot("puppy-biscuit", "Biscuit, a male cream golden retriever puppy", 800, 1000),
  puppyWillow: slot("puppy-willow", "Willow, a female light gold golden retriever puppy", 800, 1000),
  puppySailor: slot("puppy-sailor", "Sailor, a male cream golden retriever puppy", 800, 1000),
  gallery1: slot("gallery-1", "Spring 2026 litter puppy photo", 800, 1000),
  gallery2: slot("gallery-2", "Spring 2026 litter puppy photo", 800, 800),
  gallery3: slot("gallery-3", "Spring 2026 litter puppy photo", 800, 1066),
  gallery4: slot("gallery-4", "Spring 2026 litter puppy photo", 800, 600),
  gallery5: slot("gallery-5", "Spring 2026 litter puppy photo", 800, 800),
  gallery6: slot("gallery-6", "Spring 2026 litter puppy photo", 800, 1066),
  alumniLuna: slot("alumni-luna", "Luna, a grown golden retriever, two years old in Charlotte, NC", 800, 800),
  alumniCooper: slot("alumni-cooper", "Cooper, a golden retriever therapy dog in Raleigh, NC", 800, 800),
  alumniDaisy: slot("alumni-daisy", "Daisy, a grown golden retriever, three years old at the Outer Banks", 800, 800),
  contactMap: slot("contact-map", "Map showing our location in Wake Forest, North Carolina", 800, 600),
  testimonial1: slot("testimonial-1", "A family's grown English Cream Golden Retriever", 800, 600),
  testimonial2: slot("testimonial-2", "A family's grown English Cream Golden Retriever", 800, 600),
  testimonial3: slot("testimonial-3", "A family's grown English Cream Golden Retriever", 800, 600),
  testimonial4: slot("testimonial-4", "A family's grown English Cream Golden Retriever", 800, 600),
} as const;

export type ImageKey = keyof typeof images;

const GALLERY_PLACEHOLDERS: ImageAsset[] = [
  images.gallery1,
  images.gallery2,
  images.gallery3,
  images.gallery4,
  images.gallery5,
  images.gallery6,
];

/**
 * The full photo gallery — every `gallery-<n>.jpg` present in the metadata (any
 * count, numerically ordered) served from the CDN, or the placeholder grid when
 * no real gallery photos have been added. Populate with `npm run photos:gallery`.
 */
export function galleryImages(): ImageAsset[] {
  const nums = Object.keys(meta)
    .map((k) => /^gallery-(\d+)\.jpg$/.exec(k))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => Number(m[1]))
    .sort((a, b) => a - b);

  if (base && nums.length) {
    return nums.map((n) => {
      const m = meta[`gallery-${n}.jpg`]!;
      return {
        src: `${base}/gallery-${n}.jpg`,
        alt: `English Cream Golden Retriever — gallery photo ${n}`,
        width: m.width,
        height: m.height,
        blurDataURL: m.blurDataURL,
      };
    });
  }
  return GALLERY_PLACEHOLDERS;
}
