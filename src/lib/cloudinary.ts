/**
 * CLOUDINARY — image delivery + asset lookup.
 *
 * Photos live in Cloudinary and render with <CldImage> (see ImageBox). Cloudinary
 * appends a random suffix to uploads (e.g. `hero` becomes `hero_gq2zgp`) and, in
 * dynamic-folder accounts, the folder is metadata rather than part of the public
 * id. So we can't hardcode public ids — instead we list the account's images once
 * (cached) and resolve each slot by its *name*. Changing a photo is then pure
 * drag-and-drop in the Media Library. See docs/IMAGES.md.
 *
 * Env:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME — cloud name (client-visible; delivery URLs)
 *   CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET — server-only; used to list assets
 *                                       so slots/gallery resolve. Unset => placeholders.
 */
import type { ImageAsset } from "./images";

// Trim to guard against a stray space/newline when the values are pasted into the
// host's env settings — a common cause of a Cloudinary 401.
const CLOUD = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();
const KEY = (process.env.CLOUDINARY_API_KEY ?? "").trim();
const SECRET = (process.env.CLOUDINARY_API_SECRET ?? "").trim();

/** Enough to build delivery URLs. */
export const cloudinaryConfigured = (): boolean => CLOUD.length > 0;
/** Enough to list assets (resolve names -> public ids). */
export const cloudinaryAdminConfigured = (): boolean =>
  CLOUD.length > 0 && KEY.length > 0 && SECRET.length > 0;

export type ResolvedAsset = { publicId: string; width: number; height: number; folder: string };

type RawResource = {
  public_id: string;
  width: number;
  height: number;
  asset_folder?: string;
  display_name?: string;
};

/** Strip Cloudinary's random upload suffix ("hero_gq2zgp" -> "hero"). */
function stripSuffix(name: string): string {
  return name.replace(/_[a-z0-9]{6}$/i, "");
}

/** Fetch every image in the account (cached via ISR). Empty when admin unset. */
async function fetchAllImages(): Promise<RawResource[]> {
  if (!cloudinaryAdminConfigured()) return [];
  const auth = Buffer.from(`${KEY}:${SECRET}`).toString("base64");
  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload?max_results=500`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 300, tags: ["gallery", "images"] },
  });
  if (!res.ok) throw new Error(`Cloudinary list failed: ${res.status}`);
  const data = (await res.json()) as { resources?: RawResource[] };
  return data.resources ?? [];
}

/** All the lookup keys an asset can be found by (lowercased). */
function keysFor(r: RawResource): string[] {
  const last = r.public_id.split("/").pop() ?? r.public_id;
  const base = stripSuffix(last);
  const display = r.display_name ? stripSuffix(r.display_name) : "";
  const folder = r.asset_folder ?? "";
  const keys = [r.public_id, last, base, display];
  if (folder && base) keys.push(`${folder}/${base}`);
  if (folder && display) keys.push(`${folder}/${display}`);
  return keys.filter(Boolean).map((k) => k.toLowerCase());
}

/** Build a name -> asset index from the account's images (cached, never throws). */
async function getAssetIndex(): Promise<Map<string, ResolvedAsset>> {
  const index = new Map<string, ResolvedAsset>();
  let resources: RawResource[] = [];
  try {
    resources = await fetchAllImages();
  } catch {
    return index;
  }
  for (const r of resources) {
    const asset: ResolvedAsset = {
      publicId: r.public_id,
      width: r.width,
      height: r.height,
      folder: r.asset_folder ?? "",
    };
    for (const k of keysFor(r)) {
      if (!index.has(k)) index.set(k, asset);
    }
  }
  return index;
}

/**
 * Resolve a slot id (e.g. "home/hero") to a real Cloudinary asset, tolerating the
 * upload suffix and folder mode. Returns null when not configured or not found
 * (caller then shows the local placeholder).
 */
export async function resolvePublicId(slotId: string): Promise<ResolvedAsset | null> {
  if (!cloudinaryConfigured()) return null;
  const index = await getAssetIndex();
  const last = slotId.split("/").pop() ?? slotId;
  for (const key of [slotId, last]) {
    const hit = index.get(key.toLowerCase());
    if (hit) return hit;
  }
  return null;
}

/**
 * TEMPORARY diagnostic — surfaces what the deployed site sees so we can tell why
 * photos aren't resolving (config, what's actually in the account, and whether a
 * few slots match). No secrets are returned. Remove once images are working.
 */
export async function debugInfo() {
  const slots = ["home/hero", "parents/parent-dam", "about/about-portrait", "contact/contact-map"];
  let resources: RawResource[] = [];
  let fetchError: string | null = null;
  try {
    resources = await fetchAllImages();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }
  const samples = resources.slice(0, 20).map((r) => ({
    public_id: r.public_id,
    asset_folder: r.asset_folder ?? null,
    display_name: r.display_name ?? null,
    keys: keysFor(r),
  }));
  const resolved: Record<string, string | null> = {};
  for (const s of slots) {
    const hit = await resolvePublicId(s);
    resolved[s] = hit ? hit.publicId : null;
  }
  let galleryCount = 0;
  try {
    galleryCount = (await galleryAssets()).length;
  } catch {
    /* ignore */
  }
  return {
    cloudNameConfigured: cloudinaryConfigured(),
    adminConfigured: cloudinaryAdminConfigured(),
    totalImagesFound: resources.length,
    fetchError,
    galleryCount,
    resolvedSlots: resolved,
    sampleAssets: samples,
  };
}

/**
 * Every image in the "gallery" folder, ordered by name. Falls back to matching
 * public ids that start with "gallery" when folder metadata isn't present.
 */
export async function galleryAssets(): Promise<ImageAsset[]> {
  let resources: RawResource[] = [];
  try {
    resources = await fetchAllImages();
  } catch {
    return [];
  }
  const inGallery = resources.filter((r) => {
    if ((r.asset_folder ?? "").toLowerCase() === "gallery") return true;
    const last = (r.public_id.split("/").pop() ?? "").toLowerCase();
    return last.startsWith("gallery");
  });
  return inGallery
    .sort((a, b) => a.public_id.localeCompare(b.public_id, undefined, { numeric: true }))
    .map((r) => ({
      cloudinaryId: r.public_id,
      src: "/images/gallery-1.svg",
      alt: "English Cream Golden Retriever — gallery photo",
      width: r.width,
      height: r.height,
    }));
}
