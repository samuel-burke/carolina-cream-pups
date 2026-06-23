/**
 * PHOTO PIPELINE — turn raw originals into fast, web-ready images.
 *
 * Input:  photos-src/ (gitignored). Either a curated set named after slots
 *         (hero.jpg, puppy-willow.jpg, …) or a raw dump of WordPress month
 *         folders — the scanner skips elementor/thumbs and -WxH variants and
 *         recurses, so nested year/month layouts work as-is.
 * Output: optimized JPEGs in public/images/<slot>.jpg (committed) + each image's
 *         real width/height and a blur preview in src/lib/image-meta.generated.json.
 *
 * Two modes:
 *   - Mapping mode (preferred for a dump): create photos.map.json mapping each
 *     slot to a catalog number or path, e.g. { "hero": 7, "puppy-willow": "2024/10/willow.jpg" }.
 *     Use `npm run photos:catalog` first to get the numbers.
 *   - Auto mode (curated): no map file — every original whose basename matches a
 *     slot is processed (basename becomes the output slot).
 *
 * Run: npm run photos
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scanOriginals } from "./scan-photos.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "photos-src");
const OUT = join(ROOT, "public", "images");
const META = join(ROOT, "src", "lib", "image-meta.generated.json");
const MAP = join(ROOT, "photos.map.json");
const CATALOG_INDEX = join(ROOT, "photo-catalog", "index.json");

const MAX_EDGE = 2000;
const QUALITY = 72;

if (!existsSync(SRC)) {
  console.error("No photos-src/ folder. Add photos (whole month folders are fine) and re-run.");
  process.exit(1);
}

const originals = await scanOriginals(SRC);
if (originals.length === 0) {
  console.error("No original images found under photos-src/.");
  process.exit(1);
}

// Build the list of { slot, path } jobs from either the map or basenames.
const jobs = [];
if (existsSync(MAP)) {
  const map = JSON.parse(await readFile(MAP, "utf8"));
  const byNumber = existsSync(CATALOG_INDEX)
    ? new Map(JSON.parse(await readFile(CATALOG_INDEX, "utf8")).map((e) => [e.n, e.rel]))
    : new Map();

  for (const [slot, ref] of Object.entries(map)) {
    let match;
    if (typeof ref === "number") {
      const rel = byNumber.get(ref);
      match = rel && originals.find((o) => o.rel === rel);
      if (!match) console.warn(`! slot "${slot}": catalog #${ref} not found (run npm run photos:catalog)`);
    } else {
      const needle = String(ref);
      match =
        originals.find((o) => o.rel === needle) ??
        originals.find((o) => o.rel.endsWith(needle)) ??
        originals.find((o) => basename(o.rel) === needle);
      if (!match) console.warn(`! slot "${slot}": no original matching "${ref}"`);
    }
    if (match) jobs.push({ slot, path: match.path });
  }
} else {
  for (const o of originals) jobs.push({ slot: basename(o.rel, extname(o.rel)), path: o.path });
}

if (jobs.length === 0) {
  console.error("Nothing to process. Create photos.map.json (see npm run photos:catalog).");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
const meta = existsSync(META) ? JSON.parse(await readFile(META, "utf8")) : {};

for (const { slot, path } of jobs) {
  const outName = `${slot}.jpg`;
  const buf = await sharp(await readFile(path))
    .rotate() // bake in EXIF orientation, then metadata is dropped
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  await writeFile(join(OUT, outName), buf);

  const { width, height } = await sharp(buf).metadata();
  const blur = await sharp(buf).resize(20).blur().webp({ quality: 40 }).toBuffer();
  meta[outName] = { width, height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
  console.log(`✓ ${slot}  <-  ${path.replace(SRC + "/", "")}  (${width}x${height})`);
}

await writeFile(META, JSON.stringify(meta, null, 2) + "\n");
console.log(`\nProcessed ${jobs.length} photo(s) into public/images.`);
console.log(`If any output names differ from the manifest, update src/lib/images.ts 'src' + 'alt'.`);
