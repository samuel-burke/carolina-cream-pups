/**
 * Remove gallery photos from the site by deleting their metadata entries.
 * The gallery renders every `gallery-<n>.jpg` present in
 * src/lib/image-meta.generated.json, so dropping an entry removes that photo
 * (gaps are fine — the gallery sorts whatever numbers remain).
 *
 *   npm run photos:gallery:remove -- 5 12 27
 *
 * Metadata-only and safe. The image file left on R2 is harmless; to delete it too:
 *   rclone deletefile r2:carolina-cream-pups/gallery-5.jpg
 *
 * After running, commit src/lib/image-meta.generated.json.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const META = join(__dirname, "..", "src", "lib", "image-meta.generated.json");

const nums = process.argv
  .slice(2)
  .map((a) => Number(a))
  .filter((n) => Number.isInteger(n) && n > 0);

if (nums.length === 0) {
  console.error("Usage: npm run photos:gallery:remove -- <number> [<number> ...]\n" +
    "Example: npm run photos:gallery:remove -- 5 12 27");
  process.exit(1);
}

const meta = JSON.parse(await readFile(META, "utf8"));

let removed = 0;
for (const n of nums) {
  const key = `gallery-${n}.jpg`;
  if (key in meta) {
    delete meta[key];
    removed++;
    console.log(`✓ removed ${key}`);
  } else {
    console.warn(`! ${key} not found — skipping`);
  }
}

await writeFile(META, JSON.stringify(meta, null, 2) + "\n");

const remaining = Object.keys(meta).filter((k) => /^gallery-\d+\.jpg$/.test(k)).length;
console.log(`\nRemoved ${removed} photo(s). ${remaining} gallery photos remain.`);
console.log(`Commit src/lib/image-meta.generated.json to apply on the next deploy.`);
