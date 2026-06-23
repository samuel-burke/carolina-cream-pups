/**
 * PHOTO PIPELINE — turn raw originals into fast, web-ready images.
 *
 * Input:  drop originals into `photos-src/` (gitignored), named after the slot
 *         they fill — e.g. hero.jpg, puppy-biscuit.jpg, gallery-1.jpg. The base
 *         name should match what `src/lib/images.ts` references.
 * Output: optimized JPEGs in `public/images/<name>.jpg` (committed), plus
 *         `src/lib/image-meta.generated.json` with each image's real
 *         width/height and a tiny blurDataURL for the blur-up placeholder.
 *
 * Run: npm run photos
 *
 * Why: large phone photos are slow and bloat git. We downscale to a sane max
 * edge, strip EXIF, compress with mozjpeg, and precompute a blur preview so the
 * page reserves the right space (no layout shift) and feels instant.
 */
import sharp from "sharp";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "photos-src");
const OUT = join(ROOT, "public", "images");
const META = join(ROOT, "src", "lib", "image-meta.generated.json");

const MAX_EDGE = 2000; // px on the long side — plenty for full-bleed on retina
const QUALITY = 72; // mozjpeg quality; visually clean, well compressed
const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".avif"]);

if (!existsSync(SRC)) {
  console.error(`No photos-src/ folder found. Create it and add originals, e.g.:
  photos-src/hero.jpg, photos-src/puppy-biscuit.jpg
Then re-run: npm run photos`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const entries = (await readdir(SRC)).filter((f) => SUPPORTED.has(extname(f).toLowerCase()));
if (entries.length === 0) {
  console.error(`No supported images in photos-src/ (${[...SUPPORTED].join(", ")}).
Note: HEIC isn't supported — export/convert to JPEG first.`);
  process.exit(1);
}

// Preserve any existing meta (for files processed in previous runs).
const meta = existsSync(META) ? JSON.parse(await readFile(META, "utf8")) : {};

for (const file of entries) {
  const name = basename(file, extname(file));
  const outName = `${name}.jpg`;
  const input = await readFile(join(SRC, file));

  // .rotate() bakes in EXIF orientation, then metadata is dropped by default.
  const pipeline = sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });

  const buf = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  await writeFile(join(OUT, outName), buf);

  const { width, height } = await sharp(buf).metadata();

  // Tiny blurred preview (~20px wide) as a base64 data URI.
  const blur = await sharp(buf).resize(20).blur().webp({ quality: 40 }).toBuffer();
  const blurDataURL = `data:image/webp;base64,${blur.toString("base64")}`;

  meta[outName] = { width, height, blurDataURL };
  console.log(`✓ ${file} -> public/images/${outName} (${width}x${height})`);
}

await writeFile(META, JSON.stringify(meta, null, 2) + "\n");
console.log(`\nUpdated ${META}.
Next: in src/lib/images.ts point the relevant entries' src at the new ".jpg"
filenames and update their alt text, then \`npm run build\`.`);
