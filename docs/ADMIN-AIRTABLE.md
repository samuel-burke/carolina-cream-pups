# Editing the litter & waitlists (Airtable)

The current litter and the two waitlists are editable in Airtable — no code, no
deploy. The site reads the base and falls back to in-code defaults if it isn't
configured or is unreachable, so nothing breaks.

What's editable here: litter status/title/timing/counts, the dam & sire names for
the pairing, and each waitlist's state + reservation count + note. (Page copy,
testimonials, and photos still live in code / R2.)

## One-time setup

### 1. Create a base with two tables

**Table `Litter`** — one record. Fields:

| Field | Type | Example |
| ----- | ---- | ------- |
| `status` | Single select: `born`, `expected` | born |
| `title` | Single line text | Spring 2026 litter |
| `timingLabel` | Single line text | Born March 2nd · ready late April |
| `counts` | Single line text | 4 males · 2 females (blank while expected) |
| `damName` | Single line text | Maple |
| `sireName` | Single line text | Finn |

**Table `Waitlists`** — exactly two records. Fields:

| Field | Type | Example |
| ----- | ---- | ------- |
| `sex` | Single select: `Male`, `Female` | Male |
| `state` | Single select: `open`, `full`, `closed` | open |
| `reservations` | Number (integer) | 2 |
| `note` | Single line text | Next openings with the summer litter |

**Table `Testimonials`** — one record per testimonial (add as many as you like).
Fields:

| Field | Type | Example |
| ----- | ---- | ------- |
| `quote` | Long text | "From our first call to pick-up day…" |
| `name` | Single line text | The Harrisons |
| `location` | Single line text | Raleigh, NC |
| `rating` | Number (1–5, optional) | 5 |
| `image` | Single line text (optional) | 1 |

- A row needs at least `quote` + `name`; everything else is optional.
- `image` is optional: put `1`–`4` to show one of the uploaded testimonial photos
  (`testimonial-1.jpg`…`testimonial-4.jpg` on R2). Leave blank for a clean
  text-only card. While `Testimonials` is empty (or Airtable is unconfigured), the
  built-in sample testimonials show instead.

> Table names and field names must match exactly (case-sensitive).

### 2. Create a read token

Airtable → **Builder hub → Personal access tokens → Create token**:
- Scope: **`data.records:read`**
- Access: **this base only**

Copy the token (starts with `pat...`).

### 3. Get the base ID

Open the base; the URL is `https://airtable.com/`**`appXXXXXXXX`**`/...` — the
`appXXXXXXXX` part is the base ID.

### 4. Set the env vars in Vercel

Settings → Environment Variables (Production + Preview):
```
AIRTABLE_API_KEY = pat...your-token
AIRTABLE_BASE_ID = appXXXXXXXX
```
Redeploy once so they're picked up. (Server-only — never prefix with `NEXT_PUBLIC_`.)

## How editing works

Change a value in Airtable → the site updates **within ~5 minutes** automatically
(ISR). Dropdowns keep `state`/`status` valid and the number field validates counts.

### Optional: instant updates

Set `REVALIDATE_SECRET` in Vercel and add an Airtable **automation** ("When a
record is updated" → "Send web request") that POSTs to:
```
https://carolinacreampups.com/api/revalidate?secret=YOUR_SECRET
```
Then edits appear in seconds.

## Where it shows

- **Reserve page** — litter info, the dam × sire pairing, and both waitlist cards.
- **Home page band** — headline reflects whether a list is open.

If the env vars are unset (or Airtable can't be read), the site shows the built-in
defaults from `src/lib/content.ts`.
