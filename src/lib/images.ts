/**
 * IMAGE MANIFEST — the single source of truth for every image on the site.
 *
 * Each slot maps a short key (e.g. `heroHome`) to a Cloudinary **public id**
 * organized in page folders (e.g. "home/hero"). It resolves automatically:
 *   - When NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set, the slot serves the photo
 *     from Cloudinary via <CldImage> (responsive AVIF/WebP, blur-up, CDN cache).
 *   - Otherwise it falls back to the local SVG placeholder in /public/images
 *     (so dev/CI/sandbox work with no Cloudinary account).
 *
 * To change a photo: drag-drop it into the matching folder in the Cloudinary
 * Media Library, using the same name (e.g. home/hero). No code, no commit.
 * See docs/IMAGES.md.
 */
import { listCloudinaryFolder } from "./cloudinary";

/** Cloud name (client-visible). Unset => local placeholders everywhere. */
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export type ImageAsset = {
  /** Cloudinary public id (e.g. "home/hero") — drives <CldImage> when present. */
  cloudinaryId?: string;
  /** Local placeholder used when Cloudinary isn't configured (dev/CI). */
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Resolve a slot to its Cloudinary photo when configured, else the local SVG
 * placeholder. The placeholder filename is the last path segment of the id
 * (e.g. "home/hero" -> /images/hero.svg). `width`/`height` are nominal intrinsic
 * dimensions used for layout ratios; Cloudinary resizes responsively regardless.
 */
const slot = (id: string, alt: string, width: number, height: number): ImageAsset => {
  const placeholder = `/images/${id.split("/").pop()}.svg`;
  return cloudName
    ? { cloudinaryId: id, src: placeholder, alt, width, height }
    : { src: placeholder, alt, width, height };
};

export const images = {
  heroHome: slot("home/hero", "An English Cream Golden Retriever resting in soft natural light", 1600, 900),
  breederHome: slot("home/breeder-home", "The breeder at home with one of the golden retrievers", 800, 1000),
  diffPuppyCulture: slot("home/diff-puppy-culture", "A young puppy during a Puppy Culture socialization exercise", 800, 600),
  diffHealthTested: slot("home/diff-health-tested", "A healthy adult English Cream Golden Retriever outdoors", 800, 600),
  diffEns: slot("home/diff-ens", "A newborn puppy being gently handled during Early Neurological Stimulation", 800, 600),
  aboutPortrait: slot("about/about-portrait", "Portrait of the breeder at home with the dogs", 800, 1066),
  parentDam: slot("parents/parent-dam", "Our dam, a light English Cream Golden Retriever", 800, 1000),
  parentSire: slot("parents/parent-sire", "Our sire, a cream English Golden Retriever", 800, 1000),
  parentThird: slot("parents/parent-3", "A third English Cream Golden Retriever parent", 800, 1000),
  puppyBiscuit: slot("puppies/puppy-biscuit", "Biscuit, a male cream golden retriever puppy", 800, 1000),
  puppyWillow: slot("puppies/puppy-willow", "Willow, a female light gold golden retriever puppy", 800, 1000),
  puppySailor: slot("puppies/puppy-sailor", "Sailor, a male cream golden retriever puppy", 800, 1000),
  gallery1: slot("gallery/gallery-1", "Spring 2026 litter puppy photo", 800, 1000),
  gallery2: slot("gallery/gallery-2", "Spring 2026 litter puppy photo", 800, 800),
  gallery3: slot("gallery/gallery-3", "Spring 2026 litter puppy photo", 800, 1066),
  gallery4: slot("gallery/gallery-4", "Spring 2026 litter puppy photo", 800, 600),
  gallery5: slot("gallery/gallery-5", "Spring 2026 litter puppy photo", 800, 800),
  gallery6: slot("gallery/gallery-6", "Spring 2026 litter puppy photo", 800, 1066),
  alumniLuna: slot("alumni/alumni-luna", "Luna, a grown golden retriever, two years old in Charlotte, NC", 800, 800),
  alumniCooper: slot("alumni/alumni-cooper", "Cooper, a golden retriever therapy dog in Raleigh, NC", 800, 800),
  alumniDaisy: slot("alumni/alumni-daisy", "Daisy, a grown golden retriever, three years old at the Outer Banks", 800, 800),
  contactMap: slot("contact/contact-map", "Map showing our location in Wake Forest, North Carolina", 800, 600),
  testimonial1: slot("testimonials/testimonial-1", "A family's grown English Cream Golden Retriever", 800, 600),
  testimonial2: slot("testimonials/testimonial-2", "A family's grown English Cream Golden Retriever", 800, 600),
  testimonial3: slot("testimonials/testimonial-3", "A family's grown English Cream Golden Retriever", 800, 600),
  testimonial4: slot("testimonials/testimonial-4", "A family's grown English Cream Golden Retriever", 800, 600),
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
 * The full photo gallery. When Cloudinary is configured, returns every image in
 * the "gallery" folder (any count, ordered) — so adding gallery photos is just a
 * drag-drop into that folder. Otherwise (or if the listing fails) returns the
 * local placeholder grid.
 */
export async function galleryImages(): Promise<ImageAsset[]> {
  if (cloudName) {
    try {
      const remote = await listCloudinaryFolder("gallery");
      if (remote.length) return remote;
    } catch {
      // fall through to placeholders
    }
  }
  return GALLERY_PLACEHOLDERS;
}
