# Images (Cloudinary) — upload and done

Photos live in **Cloudinary** and render through `<CldImage>` (`next-cloudinary`):
responsive AVIF/WebP, subject-aware cropping, blur-up previews, and CDN caching
are all automatic. You never crop, resize, or compress anything — upload any
photo at any size and the site handles the rest.

The only configuration is the **cloud name** (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`).
There is no API key or secret. When the cloud name is unset (local dev / CI), or a
photo hasn't been uploaded yet, the site shows the beige SVG placeholder instead —
nothing ever breaks.

## One-time Cloudinary setup (do this once)

1. **Make filenames the photo's identity.** In Cloudinary: **Settings → Upload**
   and edit the upload preset the Media Library uses (usually `ml_default`):
   - "Use filename as public ID" (or *Public ID generation: filename*): **ON**
   - "Unique filename" (the random suffix, e.g. `hero_gq2zgp`): **OFF**

   After this, uploading `hero.jpg` stores it as exactly `hero` — which is what
   the site looks for. *(Without this, uploads get random suffixes and won't match.)*

2. **Allow the public gallery list.** **Settings → Security → Restricted media
   types**: make sure **"Resource list" is NOT restricted** (uncheck it). This
   lets the site fetch the list of photos tagged `gallery` — it exposes only
   names and sizes of those tagged images, nothing else.

3. **Set the env var in Vercel** (Project → Settings → Environment Variables,
   on **both Production and Preview**):
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = your cloud name
   - (You can delete `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and the old
     `NEXT_PUBLIC_IMAGE_BASE_URL` if they're still there — no longer used.)

4. **Redeploy.**

## What to name each photo

Upload files with these names (any folder, any image format — only the name
matters):

| Filename | Where it shows |
| --- | --- |
| `hero` | Home hero background |
| `breeder-home` | Home intro photo |
| `diff-puppy-culture`, `diff-health-tested`, `diff-ens` | Home "why families choose us" |
| `about-portrait` | About page |
| `parent-dam`, `parent-sire`, `parent-3` | Meet the Parents (dam/sire also on Reserve) |
| `alumni-luna`, `alumni-cooper`, `alumni-daisy` | Gallery "where they are now" |
| `contact-map` | Contact page |
| `testimonial-1` … `testimonial-4` | Testimonial photos |

**The photo gallery** works by tag instead of names: upload any photos, select
them in the Media Library, and add the tag **`gallery`**. Every tagged photo
shows on the gallery page, ordered by filename (prefix `01-`, `02-`, … to control
order). Remove the tag (or the photo) and it disappears from the site.

## Changing a photo

1. Open the Cloudinary **Media Library**.
2. Click the photo → **Replace** it with the new file (this keeps the name and
   clears Cloudinary's cache automatically). Or delete it and upload a new file
   with the same filename.
3. The site picks it up within ~5 minutes. To make it instant, hit the
   revalidate webhook: `POST /api/revalidate?secret=YOUR_SECRET`.

That's the whole workflow — no code, no git, no cropping, no cache purging.

## How it works (for developers)

- `src/lib/images.ts` — the slot manifest: each key maps to a Cloudinary public
  id (= the filename). Falls back to `/public/images/<name>.svg` placeholders.
- `src/lib/cloudinary.ts` — fetches a ~1KB blurred rendition of each photo
  server-side (ISR-cached) to power next/image's blur-up; a 404 on that fetch
  doubles as "photo not uploaded yet", triggering the placeholder. The gallery
  uses Cloudinary's public tag list (`/image/list/gallery.json`).
- `ImageBox` / `HomeHero` — async server components that render `<CldImage>`
  (via the `CloudinaryImage` client wrapper) for real photos, or `next/image`
  for placeholders.
