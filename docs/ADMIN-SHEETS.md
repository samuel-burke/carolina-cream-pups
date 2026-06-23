# Editing the litter & waitlists (Google Sheets)

The current litter and the two waitlists are editable in a Google Sheet — no code,
no login to build, no deploy. The site reads the sheet and falls back to in-code
defaults if it's not configured or unreachable, so nothing breaks.

What's editable here: litter status/title/timing/counts, the dam & sire names for
the pairing, and each waitlist's state + reservation count + note. (Page copy,
testimonials, and photos still live in code / R2.)

## One-time setup

### 1. Create the sheet with two tabs

**Tab `Litter`** — header row + one data row:

| status | title | timingLabel | counts | damName | sireName |
| ------ | ----- | ----------- | ------ | ------- | -------- |
| born | Spring 2026 litter | Born March 2nd · ready late April | 4 males · 2 females | Maple | Finn |

- `status`: `born` or `expected`.
- `counts`: leave blank while expected.

**Tab `Waitlists`** — header row + exactly two rows:

| sex | state | reservations | note |
| ---- | ----- | ------------ | ---- |
| Male | open | 2 | |
| Female | full | 5 | Next openings with the summer litter |

- `state`: `open`, `full`, or `closed`.
- `reservations`: a number.

> Tab names and the header names must match exactly (case-sensitive headers).

### 2. Share it for reading

Share → General access → **Anyone with the link → Viewer**. (No API key or
service account needed — the site reads the public CSV export.)

### 3. Get the sheet ID and set the env var

The ID is the long string in the URL:
`https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

In Vercel → Settings → Environment Variables (Production + Preview):
```
GOOGLE_SHEET_ID = THIS_PART
```
Redeploy once so it picks up the variable.

## How editing works

Change a value in the sheet → the site updates **within ~5 minutes** automatically
(ISR). Nothing else to do.

### Optional: instant updates

If 5 minutes isn't fast enough, set `REVALIDATE_SECRET` in Vercel and add a Google
Apps Script **onEdit** trigger to the sheet that calls:
```
POST https://carolinacreampups.com/api/revalidate?secret=YOUR_SECRET
```
Then edits appear in seconds.

## Where it shows

- **Reserve page** — litter info, the dam × sire pairing, and both waitlist cards.
- **Home page band** — headline reflects whether a list is open.

If `GOOGLE_SHEET_ID` is unset (or the sheet can't be read), the site shows the
built-in defaults from `src/lib/content.ts`.
