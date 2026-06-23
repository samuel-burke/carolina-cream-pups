# Adding Sanity later (deferred CMS)

The site is **CMS-ready but not yet on a CMS**. All editable content (litters,
puppies, photos, page copy, FAQ) flows through one typed, async layer:

- **Types** — `src/lib/content-types.ts` (the contract a CMS must satisfy)
- **Accessors** — `src/lib/content.ts` (`getHomeContent`, `getAboutContent`,
  `getParentsContent`, `getLitter`, `getLitterStatus`, `getGallery`, `getFaqs`)

Pages already `await` these accessors, so switching the data source from in-code
data to Sanity does **not** touch any component or page.

## Why this is a small change

The accessors are already `async` and return stable types. Adding Sanity means
re-implementing the **bodies** of the functions in `content.ts` to fetch from
Sanity and map the response into the existing types. That's it for the UI.

## Steps when you're ready

1. **Create a Sanity project** (free tier) → note the `projectId` and `dataset`.
2. **Install**: `npm i sanity next-sanity @sanity/image-url`.
3. **Define schemas** that mirror `content-types.ts` (a `home` singleton, an
   `about` singleton, a `parents` doc, a `litter` doc with `puppy` objects, a
   `gallery` doc, and a repeatable `faq`). Image fields use Sanity's `image` type.
4. **Embed the editor** at `/studio` (App Router route) so your sister logs in and
   edits with a media library — this is the photo-upload experience that drove the
   choice of Sanity.
5. **Swap the accessor bodies** in `content.ts` to `await client.fetch(groq...)`,
   mapping Sanity images to `ImageAsset` via `@sanity/image-url` (it provides
   `src`, plus `width`/`height` from asset metadata). Keep the return types.
6. **Configure image domains**: add `cdn.sanity.io` to
   `next.config.mjs` → `images.remotePatterns`.
7. **Instant updates**: add an on-demand revalidation route
   (`/api/revalidate`) and a Sanity webhook so edits publish without a redeploy.
   Use `export const revalidate` / `revalidateTag` on the content fetches.
8. **Env vars** (see `.env.example`): `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   `NEXT_PUBLIC_SANITY_DATASET`, and a server-only `SANITY_REVALIDATE_SECRET`.

## What stays in code (not in the CMS)

Brand/business info, navigation, and SEO metadata live in `src/lib/site.ts` and
the route `metadata` exports. These rarely change and are intentionally not
sister-editable. Promote them into Sanity later only if needed.

## Alternative: Keystatic (git-based)

If you'd rather keep content + images in the repo (full version control, no
external content database), the same accessor layer supports Keystatic instead —
point the accessor bodies at Keystatic's reader API. Photo uploads become git
commits; add Keystatic Cloud if you want a media CDN.
