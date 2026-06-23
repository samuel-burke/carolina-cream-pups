/**
 * Generates on-brand SVG placeholder images into /public/images.
 *
 * These stand in for real photography while keeping the layout, dimensions,
 * and alt-text pipeline production-accurate. Replace the files in /public/images
 * with real photos (same filenames) and delete this script when no longer needed.
 *
 * Run: node scripts/generate-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images");

// Warm palette pulled from the theme tokens.
const TONES = [
  { a: "#F3E9D8", b: "#E7D8BE", dog: "#CDB590" },
  { a: "#EFE4D2", b: "#DEC9A8", dog: "#C7AC83" },
  { a: "#F5EFE6", b: "#E4DACA", dog: "#B7A892" },
  { a: "#EDE6D6", b: "#D8C7A6", dog: "#BBA17a" },
];
const INK = "#3A352E";
const SAGE = "#8A9A85";

// A simple, friendly golden-retriever silhouette (head + ears), normalized to a
// 100x100 viewbox and scaled/placed per image.
const DOG_PATH =
  "M50 18c-10 0-13 6-20 8-6 2-12 1-12 9 0 6 4 9 9 11 1 9 10 17 23 17s22-8 23-17c5-2 9-5 9-11 0-8-6-7-12-9-7-2-10-8-20-8z";

const files = [
  ["hero.svg", 1600, 900, "Hero — cream golden, natural light"],
  ["breeder-home.svg", 800, 1000, "The breeder, at home with the dogs"],
  ["diff-puppy-culture.svg", 800, 600, "Puppy Culture"],
  ["diff-health-tested.svg", 800, 600, "Health tested parents"],
  ["diff-ens.svg", 800, 600, "Early Neurological Stimulation"],
  ["about-portrait.svg", 800, 1066, "Portrait of the breeder at home"],
  ["parent-dam.svg", 800, 1000, "Dam"],
  ["parent-sire.svg", 800, 1000, "Sire"],
  ["puppy-biscuit.svg", 800, 1000, "Biscuit"],
  ["puppy-willow.svg", 800, 1000, "Willow"],
  ["puppy-sailor.svg", 800, 1000, "Sailor"],
  ["gallery-1.svg", 800, 1000, "Spring litter 1"],
  ["gallery-2.svg", 800, 800, "Spring litter 2"],
  ["gallery-3.svg", 800, 1066, "Spring litter 3"],
  ["gallery-4.svg", 800, 600, "Spring litter 4"],
  ["gallery-5.svg", 800, 800, "Spring litter 5"],
  ["gallery-6.svg", 800, 1066, "Spring litter 6"],
  ["alumni-luna.svg", 800, 800, "Luna, grown up"],
  ["alumni-cooper.svg", 800, 800, "Cooper, grown up"],
  ["alumni-daisy.svg", 800, 800, "Daisy, grown up"],
  ["contact-map.svg", 800, 600, "Map / location"],
  // Appended at the end so existing placeholders keep their tone (index-based).
  ["parent-3.svg", 800, 1000, "Parent"],
  ["testimonial-1.svg", 800, 600, "Family dog"],
  ["testimonial-2.svg", 800, 600, "Family dog"],
  ["testimonial-3.svg", 800, 600, "Family dog"],
  ["testimonial-4.svg", 800, 600, "Family dog"],
];

function svg(w, h, label, i) {
  const tone = TONES[i % TONES.length];
  const cx = w / 2;
  const cy = h / 2;
  const dogSize = Math.min(w, h) * 0.42;
  const dx = cx - dogSize / 2;
  const dy = cy - dogSize / 2 - h * 0.04;
  const scale = dogSize / 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tone.a}"/>
      <stop offset="1" stop-color="${tone.b}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g transform="translate(${dx} ${dy}) scale(${scale})" fill="${tone.dog}">
    <path d="${DOG_PATH}"/>
  </g>
  <circle cx="${cx}" cy="${cy + h * 0.04}" r="${Math.min(w, h) * 0.34}" fill="none" stroke="${SAGE}" stroke-opacity="0.35" stroke-width="${Math.max(1, w * 0.0025)}"/>
  <text x="${cx}" y="${h - Math.max(18, h * 0.06)}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="${Math.max(11, Math.min(w, h) * 0.03)}" letter-spacing="1.5" fill="${INK}" fill-opacity="0.55">${label.toUpperCase()}</text>
</svg>
`;
}

await mkdir(OUT, { recursive: true });
let n = 0;
for (const [name, w, h, label] of files) {
  await writeFile(join(OUT, name), svg(w, h, label, n));
  n++;
}
console.log(`Generated ${n} placeholder images in public/images`);
