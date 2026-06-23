import { NextResponse } from "next/server";

/**
 * Contact form endpoint. Validates input server-side and (for now) logs the
 * message. Wire up a real delivery mechanism where indicated — e.g. Resend,
 * Postmark, SendGrid, or a Formspree-style service — using a server-side env
 * var for the API key. Keep validation here regardless of provider.
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

  // TODO: deliver the message (email/CRM). Example:
  //   await sendEmail({ to: site.contact.email, replyTo: email, name, phone, message });
  console.info("[contact] new inquiry", { name, email, phone: body.phone ?? "" });

  return NextResponse.json({ ok: true });
}
