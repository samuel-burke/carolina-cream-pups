/**
 * Deletes duplicate/derivative image files, keeping only the largest original of
 * each photo. Targets WordPress noise: `-150x150`/`-300x200`/… size variants,
 * `-scaled`/`-e<timestamp>` duplicates, and `elementor`/`thumbs` caches.
 *
 * SAFE BY DEFAULT: dry-run unless you pass --delete.
 *
 *   node scripts/dedupe-photos.mjs [folder]            # preview (default: photos-src)
 *   node scripts/dedupe-photos.mjs [folder] --delete   # actually delete
 *
 * Tip: work on a COPY of your photos, or have a backup, before using --delete.
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import { scanOriginals, SUPPORTED } from "./scan-photos.mjs";

const args = process.argv.slice(2);
const doDelete = args.includes("--delete");
const root = resolve(args.find((a) => !a.startsWith("--")) ?? "photos-src");

if (!existsSync(root)) {
  console.error(`Folder not found: ${root}`);
  process.exit(1);
}

/** Every image file under root, including elementor/thumbs caches. */
async function walkAll(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walkAll(p, out);
    else if (SUPPORTED.has(extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
}

const keepers = new Set((await scanOriginals(root)).map((o) => o.path));
const all = await walkAll(root);
const toDelete = all.filter((p) => !keepers.has(p));

let freed = 0;
for (const p of toDelete) freed += (await stat(p)).size;
const mb = (freed / 1024 / 1024).toFixed(1);

console.log(`Scanned ${all.length} image files under ${root}`);
console.log(`Keep (largest original of each photo): ${keepers.size}`);
console.log(`Duplicates/derivatives to remove: ${toDelete.length}  (~${mb} MB)\n`);

if (!doDelete) {
  for (const p of toDelete.slice(0, 40)) console.log(`  would delete  ${p.replace(root + "/", "")}`);
  if (toDelete.length > 40) console.log(`  …and ${toDelete.length - 40} more`);
  console.log(`\nDry run — nothing deleted. Re-run with --delete to remove these.`);
} else {
  for (const p of toDelete) await unlink(p);
  console.log(`Deleted ${toDelete.length} files, freed ~${mb} MB. Kept ${keepers.size} originals.`);
}
