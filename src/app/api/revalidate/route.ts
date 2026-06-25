import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation for Airtable-backed content. Lets edits in Airtable
 * appear within seconds instead of waiting out the ISR window.
 *
 *   POST /api/revalidate?secret=YOUR_SECRET
 *
 * Set REVALIDATE_SECRET in the environment and call this from an Airtable
 * automation (optional — without it, edits still appear within ~5 min).
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("reserve");
  revalidateTag("gallery");
  return NextResponse.json({ revalidated: true, tags: ["reserve", "gallery"] });
}
