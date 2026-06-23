# Carolina Cream Pups

Marketing site for [carolinacreampups.com](https://carolinacreampups.com) — a
family raising AKC English Cream Golden Retrievers in Wake Forest, NC.

Built with **Next.js (App Router) + TypeScript**, styled with CSS Modules driven
by a single design-token source, and fully static-rendered for speed and SEO.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Project structure

```
src/
  app/                     # routes (one folder per page) + sitemap/robots/api
    layout.tsx             # fonts, metadata, JSON-LD, nav/footer shell
    page.tsx               # Home
    about/ parents/ reserve/ gallery/ contact/
    api/contact/route.ts   # contact form endpoint (validation + delivery hook)
  components/
    ui/                    # design-system kit (Button, Heading, Grid, ...)
    layout/                # Nav, Footer, Logo
    sections/              # page-specific composite sections
    seo/                   # JSON-LD structured data
  lib/
    theme.ts               # design tokens -> CSS custom properties (single source)
    site.ts                # brand/business info, nav, SEO config (stable)
    content-types.ts       # types for all editable content (the CMS contract)
    content.ts             # async content accessors (the single content doorway)
    images.ts              # image manifest (src + alt + dimensions)
scripts/
  generate-placeholders.mjs  # regenerates the placeholder images
public/images/             # image assets
```

## Theming

All visual tokens live in `src/lib/theme.ts`. They are emitted as CSS custom
properties at the document root, and every component reads `var(--token)`. To
re-theme the whole site, edit that one file. Responsiveness uses real CSS media
queries (breakpoint: 768px) — there is no JS width detection.

## Content

All editable content (litters, puppies, photos, page copy, FAQ, gallery) flows
through one typed, async layer:

- `src/lib/content-types.ts` — the shape of every piece of content.
- `src/lib/content.ts` — async accessors (`getHomeContent`, `getLitter`,
  `getFaqs`, `getGallery`, …). Pages `await` these; to edit content today, change
  the data returned here.

This indirection is deliberate: it makes adding a CMS later a drop-in change
(swap the accessor bodies to fetch from the CMS, types stay the same) without
touching any component or page. See [`docs/SANITY-MIGRATION.md`](docs/SANITY-MIGRATION.md).

Stable, non-editable config (brand/business info, navigation, SEO) stays in
`src/lib/site.ts` and feeds the sitemap, metadata, and structured data.

## Images

Every image is registered in `src/lib/images.ts` (semantic key → filename +
`alt`). Images render through `next/image` (via `ImageBox`), which lazy-loads,
serves responsive AVIF/WebP, and shows a blur-up placeholder. Only the hero is
`priority`; everything else is lazy.

### Adding real photos (fast path)

A pipeline handles sizing, compression, dimensions, and blur previews for you:

1. Put originals in a `photos-src/` folder (gitignored — only the optimized
   outputs are committed), named after the slot they fill, e.g. `hero.jpg`,
   `puppy-biscuit.jpg`, `gallery-1.jpg`. The slot names are the filenames in
   `src/lib/images.ts`. (Export HEIC to JPEG first — HEIC isn't supported.)
2. Run `npm run photos`. This downscales to a 2000px max edge, strips EXIF,
   compresses (mozjpeg), writes `public/images/<name>.jpg`, and records each
   image's real width/height + `blurDataURL` in `image-meta.generated.json`.
3. In `src/lib/images.ts`, point the relevant entries' `src` at the new `.jpg`
   filename and update `alt` to describe the photo. (Dimensions and blur are
   merged automatically from the generated metadata.)
4. `npm run build`. Commit the optimized files in `public/images` and the
   updated manifest/metadata.

### Adding photos from a raw dump (e.g. a WordPress export)

If your photos are a folder tree (e.g. `wp-content/uploads/2024/10/…`), don't
clean it up by hand:

1. Drop the whole tree into `photos-src/`. The scanner (`scripts/scan-photos.mjs`)
   recurses and automatically ignores `elementor`/`thumbs` caches and WordPress
   size-variants (`-300x200`, `-scaled`, …), keeping only the largest original of
   each image.
2. Run `npm run photos:catalog` → generates numbered contact sheets in
   `photo-catalog/` (gitignored) plus `index.json`. Open the sheets to see every
   candidate photo with its number.
3. Create `photos.map.json` mapping each slot to a catalog number (or a path),
   e.g. `{ "hero": 7, "puppy-willow": 12, "gallery-1": 3 }`.
4. Run `npm run photos` → optimizes only the mapped photos into
   `public/images/<slot>.jpg` with dimensions + blur metadata.
5. The output filenames already match the slot keys, so update `alt` text in
   `src/lib/images.ts` (and any `src` still pointing at a `.svg`), then
   `npm run build` and commit.

Alternatively, host on an external CDN and set the entry's `src` to a full URL
(add the host to `images.remotePatterns` in `next.config.mjs`).

## Contact form

`POST /api/contact` validates submissions (with a honeypot for spam) and
currently logs them. Wire up an email/CRM provider where marked in
`src/app/api/contact/route.ts`, using a server-side env var for credentials.

## SEO & analytics

- Per-page metadata, canonical URLs, Open Graph + Twitter cards, and a generated
  `og.png` social image.
- Structured data: `LocalBusiness` (site-wide), `BreadcrumbList` (subpages), and
  `FAQPage` (Reserve page). Sitemap and robots are generated from the nav config.
- Analytics is off by default. Set `NEXT_PUBLIC_ANALYTICS_DOMAIN` to enable a
  cookieless, Plausible-compatible script (see `.env.example`).

FAQ content lives in `src/lib/content.ts` (`getFaqs`) — answers are placeholders;
edit them to match your real policies before launch.

## Deployment

Continuous deployment runs on **GitHub Actions → Vercel**, gated by CI: the
`deploy` job runs only after lint/typecheck/test/build pass.

| Branch | Environment | Domain                       |
| ------ | ----------- | ---------------------------- |
| `main` | production  | `carolinacreampups.com`      |
| `dev`  | staging     | `beta.carolinacreampups.com` (noindex) |

`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_NOINDEX` are set per-environment in
Vercel. Full one-time setup (secrets, env vars, domains) is in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). The site also runs on any Node host
via `npm run build && npm run start`.
