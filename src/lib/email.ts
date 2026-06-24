/**
 * EMAIL DELIVERY — contact-form notifications via Resend (env-gated).
 *
 * Delivery is optional and fully gated behind env vars so the site builds and
 * runs (and CI/sandbox stay green) with zero email configuration. When the env
 * is set, a submitted contact form is emailed to the inbox below; when it isn't,
 * the API route falls back to logging the inquiry.
 *
 * Required env (set in Vercel):
 *   RESEND_API_KEY      — Resend API key (server-only, never NEXT_PUBLIC_).
 *   CONTACT_FROM_EMAIL  — verified sender, e.g. "Carolina Cream Pups
 *                         <hello@carolinacreampups.com>".
 * Optional:
 *   CONTACT_TO_EMAIL    — where inquiries land (defaults to site.contact.email).
 */
import { site } from "./site";

export type ContactMessage = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

/** True only when both required env vars are present. */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
}

/** Escape a string for safe interpolation into HTML. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build the notification email (pure — no I/O, easy to unit test). Returns the
 * subject plus plain-text and HTML bodies.
 */
export function buildContactEmail(msg: ContactMessage): {
  subject: string;
  text: string;
  html: string;
} {
  const phone = msg.phone?.trim() || "—";
  const subject = `New inquiry from ${msg.name} — ${site.name}`;

  const text = [
    `New contact form submission on ${site.name}.`,
    "",
    `Name:  ${msg.name}`,
    `Email: ${msg.email}`,
    `Phone: ${phone}`,
    "",
    "Message:",
    msg.message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#3A352E">
      <h2 style="margin:0 0 .5rem">New inquiry — ${escapeHtml(site.name)}</h2>
      <p style="margin:.25rem 0"><strong>Name:</strong> ${escapeHtml(msg.name)}</p>
      <p style="margin:.25rem 0"><strong>Email:</strong> ${escapeHtml(msg.email)}</p>
      <p style="margin:.25rem 0"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:1rem 0 .25rem"><strong>Message:</strong></p>
      <p style="margin:.25rem 0;white-space:pre-wrap">${escapeHtml(msg.message)}</p>
    </div>`.trim();

  return { subject, text, html };
}

/**
 * Send the contact notification via Resend. Throws on misconfiguration or a
 * non-OK response so the caller can decide how to respond. Sets `reply_to` to
 * the visitor's address so a reply goes straight back to them.
 */
export async function sendContactEmail(msg: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Email is not configured.");
  }
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const { subject, text, html } = buildContactEmail(msg);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: msg.email,
      subject,
      text,
      html,
    }),
    // Notifications are one-shot; never cache.
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }
}
