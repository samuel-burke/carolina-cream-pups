/**
 * CLOUDINARY — simple, no-secrets image delivery.
 *
 * Photos live in Cloudinary and render with <CldImage> (responsive AVIF/WebP,
 * subject-aware cropping, CDN cache). The ONLY configuration is the cloud name —
 * no API key or secret. This relies on two one-time settings in the Cloudinary
 * dashboard (see docs/IMAGES.md):
 *   1. Upload preset: "use filename as public id" ON, "unique/random suffix" OFF
 *      -> uploading hero.jpg stores it as exactly `hero`.
 *   2. Security: "Resource list" un-restricted -> the public tag list powers the
 *      gallery (tag photos `gallery` in the Media Library to show them).
 *
 * The blur-up preview is generated server-side from a tiny blurred rendition and
 * doubles as an existence check: if the fetch 404s (photo not uploaded yet), the
 * caller falls back to the local SVG placeholder instead of a broken image.
 *
 * Env: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. Unset => placeholders (dev/CI safe).
 */
import type { ImageAsset } from "./images";

// Trimmed to guard against stray whitespace pasted into host env settings.
const CLOUD = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();

export const cloudinaryConfigured = (): boolean => CLOUD.length > 0;

/**
 * Tiny blurred preview (~1KB) as a data URL for next/image's blur-up, fetched
 * from Cloudinary and cached via ISR. Returns null when Cloudinary isn't
 * configured, the photo doesn't exist, or the fetch fails — callers treat null
 * as "show the placeholder".
 */
export async function blurDataUrlFor(publicId: string): Promise<string | null> {
  if (!cloudinaryConfigured()) return null;
  const url = `https://res.cloudinary.com/${CLOUD}/image/upload/w_24,e_blur:1000,q_30,f_jpg/${publicId}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300, tags: ["images"] } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

type ListResource = { public_id: string; width: number; height: number };

/**
 * Every image tagged `gallery`, via Cloudinary's public tag list (no credentials;
 * requires "Resource list" to be un-restricted in Cloudinary security settings).
 * Ordered by name — prefix filenames 01-, 02-, … to control order. Returns []
 * on any failure so the gallery falls back to placeholders.
 */
export async function galleryAssets(): Promise<ImageAsset[]> {
  if (!cloudinaryConfigured()) return [];
  const url = `https://res.cloudinary.com/${CLOUD}/image/list/gallery.json`;
  try {
    const res = await fetch(url, { next: { revalidate: 300, tags: ["gallery", "images"] } });
    if (!res.ok) return [];
    const data = (await res.json()) as { resources?: ListResource[] };
    return (data.resources ?? [])
      .slice()
      .sort((a, b) => a.public_id.localeCompare(b.public_id, undefined, { numeric: true }))
      .map((r) => ({
        cloudinaryId: r.public_id,
        src: "/images/gallery-1.svg",
        alt: "English Cream Golden Retriever — gallery photo",
        width: r.width,
        height: r.height,
      }));
  } catch {
    return [];
  }
}
