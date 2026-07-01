/**
 * IMAGE MANIFEST — the single source of truth for every image on the site.
 *
 * Each slot maps a key (e.g. `heroHome`) to a Cloudinary public id, which is
 * simply the uploaded file's name without extension (upload `hero.jpg` and its
 * id is `hero` — see docs/IMAGES.md for the required one-time upload settings).
 *
 *   - When NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set AND the photo exists, the
 *     slot renders from Cloudinary (responsive AVIF/WebP, blur-up, CDN cache).
 *   - Otherwise it falls back to the local SVG placeholder in /public/images,
 *     so dev/CI and not-yet-uploaded slots always render cleanly.
 *
 * To change a photo: replace the file of the same name in the Cloudinary Media
 * Library. No code, no commit. (Edit `alt` text here anytime for accessibility.)
 */
import { galleryAssets } from "./cloudinary";

/** Cloud name (client-visible). Unset => local placeholders everywhere. */
const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();

export type ImageAsset = {
  /** Cloudinary public id (the uploaded filename, e.g. "hero"). */
  cloudinaryId?: string;
  /** Local placeholder used when Cloudinary isn't configured or lacks the photo. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Resolve a slot to its Cloudinary id when configured, else the local SVG
 * placeholder. `width`/`height` are nominal dimensions used for layout ratios;
 * Cloudinary resizes responsively regardless.
 */
const slot = (id: string, alt: string, width: number, height: number): ImageAsset => {
  const placeholder = `/images/${id}.svg`;
  return cloudName
    ? { cloudinaryId: id, src: placeholder, alt, width, height }
    : { src: placeholder, alt, width, height };
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
 * The full photo gallery: every image tagged `gallery` in Cloudinary (any count,
 * ordered by name) — so adding gallery photos is upload + tag. Falls back to the
 * local placeholder grid when Cloudinary is unset or the list is empty/fails.
 */
export async function galleryImages(): Promise<ImageAsset[]> {
  if (cloudName) {
    const remote = await galleryAssets();
    if (remote.length) return remote;
  }
  return GALLERY_PLACEHOLDERS;
}
