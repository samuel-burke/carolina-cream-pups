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
3. Create an **API key + secret** (Settings → API Keys) — only needed so the
   gallery can auto-list its folder.
4. Add these in Vercel (Project → Settings → Environment Variables), Production
   (and Preview if you want it on the beta site):
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your key (server-only)
   - `CLOUDINARY_API_SECRET` = your secret (server-only)
5. Redeploy.

## Folder layout (match these names)

In the Cloudinary Media Library, create folders and upload images named to match
the slots. The **public id** = folder + name (no extension).

| Folder / public id | Where it shows |
| --- | --- |
| `home/hero` | Home hero background |
| `home/breeder-home` | Home intro photo |
| `home/diff-puppy-culture`, `home/diff-health-tested`, `home/diff-ens` | Home "why families choose us" |
| `about/about-portrait` | About page |
| `parents/parent-dam`, `parents/parent-sire`, `parents/parent-3` | Meet the Parents (dam/sire also on Reserve) |
| `alumni/alumni-luna`, `alumni/alumni-cooper`, `alumni/alumni-daisy` | Gallery "where they are now" |
| `contact/contact-map` | Contact page |
| `testimonials/testimonial-1` … `-4` | Testimonial photos |
| `gallery/<anything>` | Photo gallery — **every** image in this folder shows, ordered by name |

> Cloudinary's "public id" is the folder path + the file's name without its
> extension. Upload `hero.jpg` into a `home` folder and its public id is
> `home/hero` — exactly what the site asks for.

## Changing a photo

1. Open the Cloudinary **Media Library**.
2. Go to the folder (e.g. `parents`) and **upload your new photo with the same
   name** (`parent-dam`), overwriting the old one (choose "overwrite"/"replace"
   when prompted). Cloudinary invalidates its cache automatically, so the change
   shows within seconds — no purge, no redeploy.

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
