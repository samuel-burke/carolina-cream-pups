# Images & the Cloudflare R2 CDN

Real photos are hosted on **Cloudflare R2** (object storage + CDN) and served
through `next/image`, which optimizes them to responsive AVIF/WebP on Vercel's
edge. Photos live on the CDN, **not in git** — only tiny metadata (dimensions +
blur placeholders) is committed.

## How it fits together

- `src/lib/images.ts` — the manifest. Each slot is either:
  - `img("hero.svg", …)` — a local placeholder in `/public/images`, or
  - `photo("hero.jpg", "hero.svg", …)` — a real photo on the CDN. The second arg
    is the placeholder to fall back to when the CDN env var is unset (dev/CI).
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
6. In `src/lib/images.ts`, switch each migrated slot from `img("x.svg", …)` to
   `photo("x.jpg", "x.svg", …)` and write real `alt` text. Commit the manifest +
   metadata.

### B. Drag-drop straight to R2 (simplest, no local tooling)

Upload images named after their slots (`hero.jpg`, `puppy-willow.jpg`, …) directly
in the R2 dashboard, then switch those slots to `photo("…​.jpg", "…​.svg", …)` in
the manifest. You skip the local optimize step (Vercel still optimizes on delivery),
but you won't get the blur-up placeholder unless the metadata exists. For best
results upload reasonably sized images (≤ ~2500px), not 24‑megapixel originals.

## Why this design

Photos are content that changes often (new litters) and shouldn't ride through
code commits or bloat the repo. Hosting them on R2 decouples media from deploys,
costs pennies for the storage, and keeps git small — while `next/image` still
gives responsive formats and lazy loading.
