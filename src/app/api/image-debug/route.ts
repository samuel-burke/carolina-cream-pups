import { NextResponse } from "next/server";
import { debugInfo } from "@/lib/cloudinary";

/**
 * TEMPORARY diagnostic for Cloudinary image resolution. Returns config flags and
 * what the deployed site actually sees in the account (no secrets). Hit it at
 * /api/image-debug, then remove this route once photos are showing.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await debugInfo());
}
