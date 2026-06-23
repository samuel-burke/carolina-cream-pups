/**
 * IMAGE MANIFEST — the single source of truth for every image on the site.
 *
 * Each entry maps a semantic key to a file in /public/images plus its alt text.
 * Intrinsic dimensions and a blur-up placeholder are merged automatically from
 * `image-meta.generated.json` when present (produced by the photo pipeline,
 * `scripts/process-photos.mjs`); the literal width/height passed here is used as
 * a fallback for files that haven't been processed (e.g. the SVG placeholders).
 *
 * Adding real photos (see README "Images"):
 *   1. Put the original in `photos-src/` named after the slot (e.g. hero.jpg).
 *   2. Run `npm run photos` — it optimizes into /public/images and records the
 *      real dimensions + blurDataURL in image-meta.generated.json.
 *   3. Point the entry's `src` at the new filename (e.g. "hero.jpg") and update
 *      `alt` to describe the real photo.
 */
import metaJson from "./image-meta.generated.json";

type ImageMeta = { width: number; height: number; blurDataURL: string };
const meta = metaJson as Record<string, ImageMeta>;

/**
 * CDN origin for real photos (e.g. https://images.carolinacreampups.com,
 * a Cloudflare R2 public bucket). Set via NEXT_PUBLIC_IMAGE_BASE_URL. When
 * unset, `photo()` falls back to /public/images so dev/CI still works.
 */
const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "").replace(/\/+$/, "");

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tiny base64 preview shown (blurred) while the full image loads. */
  blurDataURL?: string;
};

const withMeta = (file: string, src: string, alt: string, width: number, height: number): ImageAsset => {
  const m = meta[file];
  return { src, alt, width: m?.width ?? width, height: m?.height ?? height, blurDataURL: m?.blurDataURL };
};

/** Local asset in /public/images — used for the SVG placeholders. */
const img = (file: string, alt: string, width: number, height: number): ImageAsset =>
  withMeta(file, `/images/${file}`, alt, width, height);

/**
 * Real photo hosted on the image CDN. Once a photo is uploaded to the bucket,
 * switch a slot from `img("…​.svg", …)` to `photo("…​.jpg", …)`. Dimensions and
 * the blur placeholder come from image-meta.generated.json (produced by
 * `npm run photos`).
 */
export const photo = (file: string, alt: string, width: number, height: number): ImageAsset =>
  withMeta(file, base ? `${base}/${file}` : `/images/${file}`, alt, width, height);

export const images = {
  heroHome: img(
    "hero.svg",
    "An English Cream Golden Retriever resting in soft natural light",
    1600,
    900,
  ),
  breederHome: img(
    "breeder-home.svg",
    "The breeder at home with one of the golden retrievers",
    800,
    1000,
  ),
  diffPuppyCulture: img(
    "diff-puppy-culture.svg",
    "A young puppy during a Puppy Culture socialization exercise",
    800,
    600,
  ),
  diffHealthTested: img(
    "diff-health-tested.svg",
    "A healthy adult English Cream Golden Retriever outdoors",
    800,
    600,
  ),
  diffEns: img(
    "diff-ens.svg",
    "A newborn puppy being gently handled during Early Neurological Stimulation",
    800,
    600,
  ),
  aboutPortrait: img(
    "about-portrait.svg",
    "Portrait of the breeder at home with the dogs",
    800,
    1066,
  ),
  parentDam: img("parent-dam.svg", "Our dam, a light English Cream Golden Retriever", 800, 1000),
  parentSire: img("parent-sire.svg", "Our sire, a cream English Golden Retriever", 800, 1000),
  puppyBiscuit: img("puppy-biscuit.svg", "Biscuit, a male cream golden retriever puppy", 800, 1000),
  puppyWillow: img("puppy-willow.svg", "Willow, a female light gold golden retriever puppy", 800, 1000),
  puppySailor: img("puppy-sailor.svg", "Sailor, a male cream golden retriever puppy", 800, 1000),
  gallery1: img("gallery-1.svg", "Spring 2026 litter puppy photo", 800, 1000),
  gallery2: img("gallery-2.svg", "Spring 2026 litter puppy photo", 800, 800),
  gallery3: img("gallery-3.svg", "Spring 2026 litter puppy photo", 800, 1066),
  gallery4: img("gallery-4.svg", "Spring 2026 litter puppy photo", 800, 600),
  gallery5: img("gallery-5.svg", "Spring 2026 litter puppy photo", 800, 800),
  gallery6: img("gallery-6.svg", "Spring 2026 litter puppy photo", 800, 1066),
  alumniLuna: img("alumni-luna.svg", "Luna, a grown golden retriever, two years old in Charlotte, NC", 800, 800),
  alumniCooper: img("alumni-cooper.svg", "Cooper, a golden retriever therapy dog in Raleigh, NC", 800, 800),
  alumniDaisy: img("alumni-daisy.svg", "Daisy, a grown golden retriever, three years old at the Outer Banks", 800, 800),
  contactMap: img("contact-map.svg", "Map showing our location in Wake Forest, North Carolina", 800, 600),
} as const;

export type ImageKey = keyof typeof images;
