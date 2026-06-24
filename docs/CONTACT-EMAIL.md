# Contact form email delivery

The contact form (`/contact`) posts to `POST /api/contact`. The route always
validates input server-side. **Email delivery is optional and env-gated:**

- **No env set** (local dev, CI, preview): the route logs each inquiry to the
  server console and returns success. Nothing is emailed.
- **Env set** (production): each submission is emailed to your inbox via
  [Resend](https://resend.com), with the visitor's address as the reply-to so
  you can reply directly from your mail client.

## One-time setup

1. **Create a Resend account** and verify your sending domain
   (`carolinacreampups.com`). Resend walks you through the DNS records
   (SPF/DKIM). You must send from a verified domain.
2. **Create an API key** in the Resend dashboard (Sending access is enough).
3. **Set the environment variables** in Vercel (Project → Settings →
   Environment Variables). These are server-only — never prefix them with
   `NEXT_PUBLIC_`:

   | Variable | Required | Example |
   | --- | --- | --- |
   | `RESEND_API_KEY` | yes | `re_xxxxxxxx` |
   | `CONTACT_FROM_EMAIL` | yes | `Carolina Cream Pups <hello@carolinacreampups.com>` |
   | `CONTACT_TO_EMAIL` | no (defaults to `site.contact.email`) | `you@example.com` |

4. **Redeploy** so the new env vars take effect.

## Verifying

Submit the form on the production site. You should receive an email titled
"New inquiry from …". If delivery fails, the API returns a 502 and the form
shows an error asking the visitor to email directly; check the Vercel function
logs for the Resend error detail.

## Switching providers

`src/lib/email.ts` is the only file that talks to Resend. To use Postmark,
SendGrid, etc., swap the `fetch` call in `sendContactEmail` — the route,
validation, and the pure `buildContactEmail` body builder stay the same.
