import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation for editable content (Airtable data + Cloudinary
 * photos/gallery). Lets changes appear within seconds instead of waiting out
 * the ~5 minute ISR window.
 *
 *   POST /api/revalidate?secret=YOUR_SECRET
 *
 * Set REVALIDATE_SECRET in the environment; call it manually or from an
 * automation (optional — without it, changes still appear within ~5 min).
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("reserve");
  revalidateTag("gallery");
  revalidateTag("images");
  return NextResponse.json({ revalidated: true, tags: ["reserve", "gallery", "images"] });
}
