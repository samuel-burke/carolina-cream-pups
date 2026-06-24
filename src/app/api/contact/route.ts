import { NextResponse } from "next/server";
import { emailConfigured, sendContactEmail } from "@/lib/email";

/**
 * Contact form endpoint. Validates input server-side, then delivers the message
 * via Resend when email is configured (see src/lib/email.ts). With no email env
 * set — local dev, CI, preview — it falls back to logging so the form still
 * "works" without secrets. Validation runs regardless of provider.
 */

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string; // honeypot
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots think they succeeded.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in your name, email, and message." }, { status: 422 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const phone = body.phone?.trim() || undefined;

  if (emailConfigured()) {
    try {
      await sendContactEmail({ name, email, phone, message });
    } catch (err) {
      console.error("[contact] delivery failed", err);
      return NextResponse.json(
        { error: "Sorry — we couldn't send your message. Please email us directly." },
        { status: 502 },
      );
    }
  } else {
    // No email provider configured: log so the inquiry isn't lost in dev/preview.
    console.info("[contact] new inquiry (email not configured)", { name, email, phone: phone ?? "" });
  }

  return NextResponse.json({ ok: true });
}
