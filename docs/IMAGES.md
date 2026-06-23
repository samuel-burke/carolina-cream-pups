# Images & the Cloudflare R2 CDN

Real photos are hosted on **Cloudflare R2** (object storage + CDN) and served
through `next/image`, which optimizes them to responsive AVIF/WebP on Vercel's
edge. Photos live on the CDN, **not in git** — only tiny metadata (dimensions +
blur placeholders) is committed.

## How it fits together

- `src/lib/images.ts` — the manifest. Each slot is `slot("hero", alt, w, h)` and
  resolves automatically: the R2 photo when its `<name>.jpg` metadata exists and
  the CDN env var is set, otherwise the local `<name>.svg` placeholder. No manual
  edits are needed to switch a slot over — committing the metadata does it.
- `NEXT_PUBLIC_IMAGE_BASE_URL` — the R2 public origin (e.g.
  `https://images.carolinacreampups.com`). `photo()` builds its URL from this,
  and `next.config.mjs` adds the host to `images.remotePatterns` automatically.
  Unset → everything falls back to `/public/images` (dev/CI safe).
- `src/lib/image-meta.generated.json` — width/height + `blurDataURL` per file,
  produced by the pipeline and committed (a few KB).

## One-time R2 setup

1. **Create a bucket** in the Cloudflare dashboard (R2 → Create bucket), e.g.
   `carolina-cream-pups`.
2. **Make it public** with a custom domain: bucket → Settings → Public access →
   *Connect Domain* → `images.carolinacreampups.com`. (If your DNS is on
   Cloudflare this is automatic; otherwise add the CNAME it gives you.) The
   `r2.dev` URL also works for testing but is rate-limited — use a custom domain
   for production.
3. **Set the env var** in Vercel (both Production and Preview) and locally:
   `NEXT_PUBLIC_IMAGE_BASE_URL=https://images.carolinacreampups.com`

## Adding / updating photos

Two ways — pick whichever you prefer:

### A. Optimize locally, then upload (best quality + blur placeholders)

1. Put photos (or a whole WordPress dump) in `photos-src/` (gitignored).
2. `npm run photos:catalog` → numbered contact sheets in `photo-catalog/`.
3. Map slots to numbers in `photos.map.json`.
4. `npm run photos` → optimized JPEGs land in `r2-upload/` (gitignored, ~2000px,
   compressed) and dimensions + blur are written to `image-meta.generated.json`.
5. Upload everything in `r2-upload/` to the bucket (drag-drop in the R2 dashboard,
   or `rclone`/`aws s3 sync` with an R2 token).
6. Commit `image-meta.generated.json` (and `photos.map.json`). Each processed slot
   switches to its real photo automatically — no manifest edits. (Optionally tidy
   the `alt` text in `src/lib/images.ts`.)

### The photo gallery (bulk, any number of photos)

The gallery page shows **every** gallery photo you add — not a fixed count. Add
them in one command (no per-photo mapping):

1. Put your gallery-worthy shots in a `gallery-src/` folder (gitignored).
2. `npm run photos:gallery` → optimizes them into `r2-upload/gallery-1.jpg`,
   `gallery-2.jpg`, … (numbered in filename order) with dimensions + blur.
3. Upload `r2-upload/gallery-*.jpg` to the R2 bucket.
4. Commit `image-meta.generated.json`. The gallery renders all of them
   automatically, in order, with natural aspect ratios.

Re-running replaces the gallery set, so prefix filenames (`01-`, `02-`, …) if you
want to control the order.

### Cleaning up duplicate sizes (optional)

You don't need this for the website — the pipeline already ignores WordPress size
variants. But to physically delete the duplicates from a folder (reclaim disk),
run the safe deduper (dry-run by default):

```bash
npm run photos:dedupe -- photos-src            # preview what would be removed
npm run photos:dedupe -- photos-src --delete   # actually delete
```

It keeps the largest original of each photo and removes `-WxH`/`-scaled`
variants and `elementor`/`thumbs` caches. Work on a copy or keep a backup before
using `--delete`.

### B. Drag-drop straight to R2 (simplest, no local tooling)

Upload images named after their slots (`hero.jpg`, `puppy-willow.jpg`, …) directly
in the R2 dashboard. For a slot to switch over, it still needs a metadata entry —
add `{ "hero.jpg": { "width": W, "height": H } }` to `image-meta.generated.json`
(blur optional). You skip the local optimize step (Vercel still optimizes on
delivery), but no blur-up placeholder. Upload reasonably sized images (≤ ~2500px),
not 24‑megapixel originals.

## Why this design

Photos are content that changes often (new litters) and shouldn't ride through
code commits or bloat the repo. Hosting them on R2 decouples media from deploys,
costs pennies for the storage, and keeps git small — while `next/image` still
gives responsive formats and lazy loading.
