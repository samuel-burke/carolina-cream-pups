/**
 * Bulk-process the photo GALLERY. Point it at a folder of gallery-worthy shots
 * and it optimizes every one into r2-upload/gallery-<n>.jpg (numerically, in
 * filename order) and records dimensions + blur in image-meta.generated.json.
 * No per-photo mapping needed — unlike the named slots, the gallery shows them all.
 *
 *   node scripts/process-gallery.mjs [folder]   (default: gallery-src)
 *   npm run photos:gallery -- [folder]
 *
 * Then upload r2-upload/gallery-*.jpg to the R2 bucket and commit
 * image-meta.generated.json — the gallery renders all of them automatically.
 *
 * Re-running replaces the gallery set (old gallery-* metadata is cleared first),
 * so prefix filenames (01-, 02-, …) if you care about order.
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { scanOriginals } from "./scan-photos.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "r2-upload");
const META = join(ROOT, "src", "lib", "image-meta.generated.json");

const SRC = resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) ?? join(ROOT, "gallery-src"));
const MAX_EDGE = 2000;
const QUALITY = 72;

if (!existsSync(SRC)) {
  console.error(`No gallery folder found: ${SRC}
Put your gallery photos there (or pass a path), then re-run.`);
  process.exit(1);
}

const originals = await scanOriginals(SRC);
if (originals.length === 0) {
  console.error(`No images found under ${SRC}.`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
const meta = existsSync(META) ? JSON.parse(await readFile(META, "utf8")) : {};

// Clear previous gallery entries so re-runs don't leave stale numbers.
for (const key of Object.keys(meta)) {
  if (/^gallery-\d+\.jpg$/.test(key)) delete meta[key];
}

let n = 1;
for (const { path, rel } of originals) {
  const outName = `gallery-${n}.jpg`;
  const buf = await sharp(await readFile(path))
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  await writeFile(join(OUT, outName), buf);

  const { width, height } = await sharp(buf).metadata();
  const blur = await sharp(buf).resize(20).blur().webp({ quality: 40 }).toBuffer();
  meta[outName] = { width, height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
  console.log(`✓ ${outName}  <-  ${rel}  (${width}x${height})`);
  n++;
}

await writeFile(META, JSON.stringify(meta, null, 2) + "\n");
console.log(`\nProcessed ${n - 1} gallery photo(s) into r2-upload/.`);
console.log(`Upload r2-upload/gallery-*.jpg to R2, then commit image-meta.generated.json.`);
