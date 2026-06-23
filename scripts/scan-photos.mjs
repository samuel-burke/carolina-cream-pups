/**
 * Shared scanner for the photo tooling. Recursively walks a directory and
 * returns the *true originals*, filtering out the noise a WordPress/Elementor
 * uploads tree carries:
 *   - directories named `elementor` or `thumbs` (regenerable caches)
 *   - resized variants like `name-300x200.jpg` (WP auto-generates many sizes)
 *   - duplicate sizes of the same image (`name.jpg` vs `name-scaled.jpg` vs
 *     `name-e1700000000000.jpg`) — collapsed to the largest file per image.
 */
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename, relative, sep } from "node:path";

export const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".avif"]);
const SKIP_DIRS = new Set(["elementor", "thumbs", "node_modules", ".git"]);
const VARIANT_RE = /-\d+x\d+$/; // WordPress size suffix, e.g. -1024x768

/** Strip WP suffixes to get a canonical key that groups sizes of one image. */
function canonicalKey(relPath) {
  const dir = relPath.split(sep).slice(0, -1).join(sep);
  let name = basename(relPath, extname(relPath));
  name = name.replace(/-scaled$/, "").replace(/-e\d{13}$/, "");
  return `${dir}/${name}`;
}

async function walk(dir, out) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name.toLowerCase())) continue;
      await walk(join(dir, entry.name), out);
    } else if (SUPPORTED.has(extname(entry.name).toLowerCase())) {
      const name = basename(entry.name, extname(entry.name));
      if (VARIANT_RE.test(name)) continue; // skip -WxH derivatives
      out.push(join(dir, entry.name));
    }
  }
}

/**
 * @returns sorted array of { path, rel } for the largest file of each unique
 *          original image found under `root`.
 */
export async function scanOriginals(root) {
  const files = [];
  await walk(root, files);

  // Collapse duplicate sizes (scaled/edited) to the largest file per image.
  const byKey = new Map();
  for (const path of files) {
    const rel = relative(root, path);
    const key = canonicalKey(rel);
    const size = (await stat(path)).size;
    const prev = byKey.get(key);
    if (!prev || size > prev.size) byKey.set(key, { path, rel, size });
  }

  return [...byKey.values()]
    .sort((a, b) => a.rel.localeCompare(b.rel))
    .map(({ path, rel }) => ({ path, rel }));
}
