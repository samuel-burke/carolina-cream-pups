/**
 * Builds numbered contact sheet(s) from a raw photo dump so photos can be mapped
 * to slots visually. Scans photos-src/ for true originals (recursively, skipping
 * elementor/thumbs and WP size-variants), tiles them into labeled grids, and
 * writes an index.
 *
 * Output (gitignored): photo-catalog/sheet-N.jpg + photo-catalog/index.json
 * Run: npm run photos:catalog
 *
 * Then map slots to numbers in photos.map.json, e.g. { "hero": 7, "puppy-willow": 12 }.
 */
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scanOriginals } from "./scan-photos.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "photos-src");
const OUT = join(ROOT, "photo-catalog");

const TILE = 240;
const LABEL_H = 22;
const COLS = 5;
const ROWS = 6;
const PER_PAGE = COLS * ROWS;
const CELL_W = TILE;
const CELL_H = TILE + LABEL_H;
const PAD = 8;

if (!existsSync(SRC)) {
  console.error("No photos-src/ folder. Add your photos (whole month folders are fine) and re-run.");
  process.exit(1);
}

const originals = await scanOriginals(SRC);
if (originals.length === 0) {
  console.error("No original images found under photos-src/.");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

function labelSvg(n, rel) {
  const name = rel.length > 30 ? "…" + rel.slice(-29) : rel;
  const esc = name.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return Buffer.from(
    `<svg width="${CELL_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#3A352E"/>
      <text x="6" y="15" font-family="sans-serif" font-size="12" fill="#fff">#${n} ${esc}</text>
    </svg>`,
  );
}

async function cell(n, { path, rel }) {
  const photo = await sharp(path)
    .rotate()
    .resize(TILE, TILE, { fit: "cover" })
    .jpeg()
    .toBuffer();
  return sharp({
    create: { width: CELL_W, height: CELL_H, channels: 3, background: "#fff" },
  })
    .composite([
      { input: photo, top: 0, left: 0 },
      { input: labelSvg(n, rel), top: TILE, left: 0 },
    ])
    .jpeg()
    .toBuffer();
}

const index = [];
const pageW = COLS * CELL_W + PAD * (COLS + 1);
const pageH = ROWS * CELL_H + PAD * (ROWS + 1);
let sheetCount = 0;

for (let start = 0; start < originals.length; start += PER_PAGE) {
  const slice = originals.slice(start, start + PER_PAGE);
  const composites = [];
  for (let i = 0; i < slice.length; i++) {
    const n = start + i + 1;
    index.push({ n, rel: slice[i].rel });
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    composites.push({
      input: await cell(n, slice[i]),
      top: PAD + row * (CELL_H + PAD),
      left: PAD + col * (CELL_W + PAD),
    });
  }
  sheetCount++;
  const out = join(OUT, `sheet-${sheetCount}.jpg`);
  await sharp({ create: { width: pageW, height: pageH, channels: 3, background: "#E4DACA" } })
    .composite(composites)
    .jpeg({ quality: 80 })
    .toFile(out);
  console.log(`✓ ${out} (${slice.length} photos)`);
}

await writeFile(join(OUT, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(
  `\n${originals.length} originals across ${sheetCount} sheet(s).\n` +
    `Map slots to numbers in photos.map.json, e.g. { "hero": 1, "puppy-willow": 5 }, then run: npm run photos`,
);
