/**
 * CLOUDINARY — image delivery + the dynamic gallery listing.
 *
 * Photos live in Cloudinary and are rendered with <CldImage> (see ImageBox),
 * which handles responsive sizing, AVIF/WebP, blur-up placeholders, and CDN
 * caching automatically. Changing a photo = drag-drop in the Cloudinary Media
 * Library; no code, no commit. See docs/IMAGES.md.
 *
 * Env:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME — your cloud name (client-visible; needed
 *                                       to build delivery URLs).
 *   CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET — server-only; used here to list
 *                                       the gallery folder. Unset => placeholders.
 */
import type { ImageAsset } from "./images";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const KEY = process.env.CLOUDINARY_API_KEY ?? "";
const SECRET = process.env.CLOUDINARY_API_SECRET ?? "";

/** True when the cloud name is set (enough to deliver fixed-slot images). */
export const cloudinaryConfigured = (): boolean => CLOUD.length > 0;

type CloudinaryResource = { public_id: string; width: number; height: number };

/**
 * List every image in a Cloudinary folder (by public-id prefix), numerically/
 * alphabetically ordered. Server-only; needs the API key + secret. Throws on a
 * non-OK response so callers can fall back to placeholders.
 */
export async function listCloudinaryFolder(folder: string): Promise<ImageAsset[]> {
  if (!CLOUD || !KEY || !SECRET) {
    throw new Error("Cloudinary admin API is not configured.");
  }
  const auth = Buffer.from(`${KEY}:${SECRET}`).toString("base64");
  const url =
    `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload` +
    `?prefix=${encodeURIComponent(`${folder}/`)}&type=upload&max_results=100`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    // Cache like the rest of the editable content; refresh on the "gallery" tag.
    next: { revalidate: 300, tags: ["gallery"] },
  });
  if (!res.ok) throw new Error(`Cloudinary list failed for "${folder}": ${res.status}`);

  const data = (await res.json()) as { resources?: CloudinaryResource[] };
  return (data.resources ?? [])
    .slice()
    .sort((a, b) => a.public_id.localeCompare(b.public_id, undefined, { numeric: true }))
    .map((r) => ({
      cloudinaryId: r.public_id,
      src: "",
      alt: "English Cream Golden Retriever — gallery photo",
      width: r.width,
      height: r.height,
    }));
}
