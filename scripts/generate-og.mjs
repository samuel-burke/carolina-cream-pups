/**
 * Generates raster brand assets from inline SVG using sharp:
 *   public/og.png            1200x630  social share card
 *   public/icon-192.png      PWA manifest icon
 *   public/icon-512.png      PWA manifest icon
 *   src/app/apple-icon.png   180x180   Apple touch icon (auto-detected by Next)
 *
 * Rasterizing to PNG (not SVG) is required because Twitter/Slack/LinkedIn don't
 * render SVG Open Graph images. Re-run after changing brand colors or wordmark:
 *   node scripts/generate-og.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const C = {
  bg: "#FAF7F2",
  surface: "#F5EFE6",
  text: "#3A352E",
  sage: "#8A9A85",
  taupe: "#B7A892",
  on: "#FFFDF8",
};

const DOG_PATH =
  "M50 18c-10 0-13 6-20 8-6 2-12 1-12 9 0 6 4 9 9 11 1 9 10 17 23 17s22-8 23-17c5-2 9-5 9-11 0-8-6-7-12-9-7-2-10-8-20-8z";

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.bg}"/>
      <stop offset="1" stop-color="${C.surface}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="${C.sage}" stroke-opacity="0.4" stroke-width="2"/>
  <g transform="translate(548 96) scale(1.05)" fill="${C.taupe}" opacity="0.9">
    <path d="${DOG_PATH}"/>
  </g>
  <text x="600" y="330" text-anchor="middle" font-family="DejaVu Serif, Georgia, serif" font-size="78" fill="${C.text}">Carolina <tspan font-style="italic" fill="${C.sage}">Cream</tspan> Pups</text>
  <text x="600" y="392" text-anchor="middle" font-family="DejaVu Serif, Georgia, serif" font-style="italic" font-size="34" fill="${C.text}" opacity="0.8">A calm, loving start for every puppy.</text>
  <text x="600" y="470" text-anchor="middle" font-family="Liberation Sans, sans-serif" font-size="24" letter-spacing="3" fill="${C.text}" opacity="0.6">AKC ENGLISH CREAM GOLDEN RETRIEVERS</text>
  <text x="600" y="508" text-anchor="middle" font-family="Liberation Sans, sans-serif" font-size="22" letter-spacing="2" fill="${C.sage}">WAKE FOREST, NORTH CAROLINA</text>
</svg>`;
}

function iconSvg(size) {
  // Cream tile + sage outlined paw with "CCP" (matches src/app/icon.svg). The
  // tile keeps the Apple/PWA/maskable icons from rendering transparent-on-black.
  const r = Math.round((size * 0.22 * 64) / size);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${r}" fill="${C.bg}"/>
  <g fill="none" stroke="${C.sage}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="14.5" cy="29" rx="5.6" ry="8.2" transform="rotate(-24 14.5 29)"/>
    <ellipse cx="26" cy="19.5" rx="6" ry="9" transform="rotate(-8 26 19.5)"/>
    <ellipse cx="38" cy="19.5" rx="6" ry="9" transform="rotate(8 38 19.5)"/>
    <ellipse cx="49.5" cy="29" rx="5.6" ry="8.2" transform="rotate(24 49.5 29)"/>
    <path d="M32 32c-7.6 0-14.2 5.7-15.4 13.1-1 6.3 3.5 11.6 9.8 11.6 2.1 0 3.5-.9 5.6-.9s3.5.9 5.6.9c6.3 0 10.8-5.3 9.8-11.6C46.2 37.7 39.6 32 32 32z"/>
  </g>
  <text x="32" y="49.5" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="12" letter-spacing="0.4" fill="${C.sage}">CCP</text>
</svg>`;
}

async function png(svg, size, out) {
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  await writeFile(out, buf);
}

await mkdir(join(ROOT, "public"), { recursive: true });

// OG card
await writeFile(
  join(ROOT, "public", "og.png"),
  await sharp(Buffer.from(ogSvg())).png().toBuffer(),
);

// Icons
await png(iconSvg(192), 192, join(ROOT, "public", "icon-192.png"));
await png(iconSvg(512), 512, join(ROOT, "public", "icon-512.png"));
await png(iconSvg(180), 180, join(ROOT, "src", "app", "apple-icon.png"));

console.log("Generated og.png, icon-192/512.png, apple-icon.png");
