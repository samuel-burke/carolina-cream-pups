# Images (Cloudinary)

Photos are hosted on **Cloudinary** and rendered with `<CldImage>`
(`next-cloudinary`), which automatically does responsive sizing, AVIF/WebP,
blur-up placeholders, and CDN caching. **Changing a photo is drag-and-drop** in
the Cloudinary Media Library — no code, no git, no cache purging.

When Cloudinary isn't configured (local dev / CI), every image falls back to the
local SVG placeholder in `/public/images`, so the site always builds.

## How it fits together

- `src/lib/images.ts` — the manifest. Each slot maps a key (e.g. `heroHome`) to a
  Cloudinary **public id** in a page folder (e.g. `home/hero`). It serves the
  Cloudinary photo when `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set, else the local
  placeholder. No edits needed to swap a photo.
- `src/lib/cloudinary.ts` — lists the `gallery` folder so the gallery page shows
  whatever you've uploaded (server-only; uses the API key/secret).
- `ImageBox` / `HomeHero` — render `<CldImage>` for real photos, `next/image`
  for placeholders.

## One-time setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Find your **cloud name** (Dashboard → Product Environment / top of the page).
3. Create an **API key + secret** (Settings → API Keys). **Required:** Cloudinary
   adds a random suffix to uploads (`hero` → `hero_gq2zgp`), so the site looks up
   each photo by name via the API rather than guessing the URL.
4. Add these in Vercel (Project → Settings → Environment Variables), Production
   **and Preview** (the `dev`/beta site needs them too):
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your key (server-only)
   - `CLOUDINARY_API_SECRET` = your secret (server-only)
5. Redeploy.

## Naming (this is what matters)

The site finds each photo by its **name** (the filename you upload, without the
extension), ignoring Cloudinary's random suffix. **Folders are just for your own
organization** — you can use them or not; only the name has to match.

| Upload a photo named… | Where it shows |
| --- | --- |
| `hero` | Home hero background |
| `breeder-home` | Home intro photo |
| `diff-puppy-culture`, `diff-health-tested`, `diff-ens` | Home "why families choose us" |
| `about-portrait` | About page |
| `parent-dam`, `parent-sire`, `parent-3` | Meet the Parents (dam/sire also on Reserve) |
| `alumni-luna`, `alumni-cooper`, `alumni-daisy` | Gallery "where they are now" |
| `contact-map` | Contact page |
| `testimonial-1` … `testimonial-4` | Testimonial photos |
| anything in a **`gallery`** folder | Photo gallery — every image there shows, ordered by name |

> Example: drag `hero.jpg` into the Media Library (any folder). Its name is
> `hero`, so it becomes the home hero — even though Cloudinary stores it as
> `hero_ab12cd`. To use folders for tidiness, put the gallery photos in a folder
> literally named `gallery`.

## Changing a photo

1. Open the Cloudinary **Media Library**.
2. **Upload your new photo with the same name** (e.g. `parent-dam`), overwriting
   the old one (choose "replace" when prompted), or delete the old one and upload
   the new. The site picks it up automatically — names are matched, suffix and
   all. Changes appear within ~5 minutes (or instantly if you hit the revalidate
   webhook).

Adding gallery photos is even simpler: drop any images into the `gallery` folder
and they appear automatically, ordered by filename (prefix `01-`, `02-`, … to
control order). Remove one from the folder and it disappears from the site.

## Notes

- You can upload large originals; Cloudinary resizes and optimizes on delivery.
- The cloud name is intentionally public (it's in every image URL). Keep the API
  **secret** server-only — never prefix it with `NEXT_PUBLIC_`.
- Instant gallery refresh: the gallery is cached for ~5 minutes (ISR). To force an
  immediate refresh after adding photos, redeploy or hit the revalidate route
  (the gallery uses the `gallery` cache tag).
