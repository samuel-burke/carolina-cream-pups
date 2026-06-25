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

**Editing the site? Start with [CONTENT.md](CONTENT.md)** — a map of what to change and where.

All editable content (litters, puppies, photos, page copy, FAQ, gallery) flows
through one typed, async layer:

- `src/lib/content-types.ts` — the shape of every piece of content.
- `src/lib/content.ts` — async accessors (`getHomeContent`, `getReserve`,
  `getFaqs`, `getGallery`, …). Pages `await` these; to edit content today, change
  the data returned here.

This indirection is deliberate: it makes swapping the source a drop-in change
(types stay the same) without touching any component or page.

**The litter & waitlists are editable without code** via Airtable —
`getReserve`/`getLitterStatus` read it when `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID`
are set, and fall back to in-code defaults otherwise. See [`docs/ADMIN-AIRTABLE.md`](docs/ADMIN-AIRTABLE.md).
(A fuller CMS for copy/media remains an option: [`docs/SANITY-MIGRATION.md`](docs/SANITY-MIGRATION.md).)

Stable, non-editable config (brand/business info, navigation, SEO) stays in
`src/lib/site.ts` and feeds the sitemap, metadata, and structured data.

## Images

Real photos are hosted on **Cloudinary** and served with `<CldImage>`
(`next-cloudinary`), which lazy-loads, serves responsive AVIF/WebP, and shows a
blur-up placeholder automatically. Only the hero is `priority`; everything else
is lazy.

Each slot is registered in `src/lib/images.ts` by Cloudinary public id (e.g.
`slot("home/hero", …)`) and resolves **automatically**: it serves the Cloudinary
photo when `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set, otherwise the local SVG
placeholder. **Changing a photo is drag-and-drop** in the Cloudinary Media
Library — no code, no commit, no cache purge. The gallery shows every image in
the `gallery` folder, so adding gallery photos is just uploading to that folder.

**Full setup and workflow: [`docs/IMAGES.md`](docs/IMAGES.md).**

## Contact form

`POST /api/contact` validates submissions (with a honeypot for spam) and
currently logs them. Wire up an email/CRM provider where marked in
`src/app/api/contact/route.ts`, using a server-side env var for credentials.

## SEO & analytics

- Per-page metadata, canonical URLs, Open Graph + Twitter cards, and a generated
  `og.png` social image.
- Structured data: `LocalBusiness` (site-wide), `BreadcrumbList` (subpages),
  `FAQPage` (Reserve page), and `Review`/`AggregateRating` (Testimonials page).
  Sitemap and robots are generated from the nav config.
- Analytics: Vercel Web Analytics (`@vercel/analytics`), enabled from the Vercel
  dashboard — no env var or third-party script to configure.

FAQ content lives in `src/lib/content.ts` (`getFaqs`) — answers are placeholders;
edit them to match your real policies before launch.

## Deployment

Hosting is on **Vercel via its native Git integration** — every push deploys
automatically, no tokens or secrets.

| Branch | Vercel env | Domain                        |
| ------ | ---------- | ----------------------------- |
| `main` | Production | `carolinacreampups.com`       |
| `dev`  | Preview    | `beta.carolinacreampups.com` (noindex) |

GitHub Actions runs the `verify` check (lint/typecheck/test/build); require it via
branch protection on `main` so production only builds from green code.
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, and
`NEXT_PUBLIC_NOINDEX` are set per-environment in Vercel. Full one-time setup (project import, env vars,
domains, branch protection) is in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). The
site also runs on any Node host via `npm run build && npm run start`.
