/**
 * Generates the static brand assets that are derived from code rather than
 * photography. Run once after changing the brand palette or doctor name:
 *
 *   npm run brand
 *
 * Outputs (all committed, none generated at request time):
 *   public/media/ink-veil.webp   – pigment texture suspended inside the glass surfaces
 *   public/media/ink-plume.webp  – larger, softer plume used in heroes and CTAs
 *   app/apple-icon.png           – 180×180 touch icon
 *   public/og/og-en.png, og-ar.png – 1200×630 social sharing images
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = (...p) => path.join(root, ...p);

const TEAL = [7 / 255, 126 / 255, 163 / 255];
const GREEN = [57 / 255, 181 / 255, 74 / 255];
const DEEP = [7 / 255, 86 / 255, 111 / 255];

/**
 * One pigment layer: fractal noise thresholded into soft clouds, coloured with a
 * single brand colour. `channel` picks which noise channel drives the alpha so
 * layers built from the same seed still differ.
 */
function pigment(id, { color, seed, freq, octaves = 4, gain, offset, blur = 0, type = "fractalNoise" }) {
  const [r, g, b] = color;
  const alphaRow = `${gain} 0 0 0 ${offset}`;
  return `
    <filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="${type}" baseFrequency="${freq}" numOctaves="${octaves}" seed="${seed}" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${alphaRow}" result="c"/>
      ${blur ? `<feGaussianBlur in="c" stdDeviation="${blur}"/>` : ""}
    </filter>`;
}

function inkSvg(width, height, layers) {
  const filters = layers.map((l, i) => pigment(`p${i}`, l)).join("");
  const rects = layers
    .map((l, i) => `<rect width="100%" height="100%" filter="url(#p${i})" opacity="${l.opacity ?? 1}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs>${filters}</defs>${rects}</svg>`;
}

async function renderInk(file, width, height, layers) {
  const svg = inkSvg(width, height, layers);
  await sharp(Buffer.from(svg)).webp({ quality: 78, alphaQuality: 80, effort: 6 }).toFile(file);
  console.log(`wrote ${path.relative(root, file)}`);
}

await mkdir(out("public", "media"), { recursive: true });
await mkdir(out("public", "og"), { recursive: true });

// Fine pigment for cards and panels. Anisotropic noise (low x, higher y
// frequency) stretches the clouds into horizontal wisps, like ink drifting in
// water; a faint, low-gain filament layer adds marbling without hard blobs.
await renderInk(out("public", "media", "ink-veil.webp"), 1200, 800, [
  { color: TEAL, seed: 11, freq: "0.0014 0.0046", gain: 2.5, offset: -1.0, blur: 14, opacity: 0.9 },
  { color: GREEN, seed: 4, freq: "0.0019 0.0052", gain: 2.5, offset: -1.08, blur: 16, opacity: 0.8 },
  { color: DEEP, seed: 23, freq: "0.0022 0.009", octaves: 5, type: "turbulence", gain: 1.6, offset: -0.42, blur: 1.2, opacity: 0.22 },
]);

// Broad, soft plume for large surfaces (hero, CTA). Lower frequency, more blur.
await renderInk(out("public", "media", "ink-plume.webp"), 1600, 1000, [
  { color: TEAL, seed: 31, freq: "0.0012 0.0028", gain: 2.4, offset: -0.95, blur: 22, opacity: 0.95 },
  { color: GREEN, seed: 8, freq: "0.0017 0.0022", gain: 2.5, offset: -1.08, blur: 26, opacity: 0.85 },
  { color: DEEP, seed: 42, freq: "0.0018 0.007", octaves: 5, type: "turbulence", gain: 1.5, offset: -0.4, blur: 1.8, opacity: 0.18 },
]);

/* ---------- Monogram (shared by icon.svg, apple icon and OG images) ---------- */

const monogramPaths = `
  <path d="M13 33.5 20 14.5l7 19" />
  <path d="M15.9 26.5h8.2" />
  <path d="M31.5 14.5v19M31.5 14.5h7M31.5 24h5.6M31.5 33.5h7" />`;

function monogram(size, { radius = 14 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#077EA3"/><stop offset="0.62" stop-color="#0A8F9B"/><stop offset="1" stop-color="#39B54A"/>
    </linearGradient>
    <radialGradient id="h" cx="0.25" cy="0.15" r="0.8">
      <stop offset="0" stop-color="#fff" stop-opacity="0.45"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="48" height="48" rx="${radius}" fill="url(#g)"/>
  <rect width="48" height="48" rx="${radius}" fill="url(#h)"/>
  <g fill="none" stroke="#fff" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">${monogramPaths}</g>
</svg>`;
}

await writeFile(out("app", "icon.svg"), monogram(48, { radius: 13 }));
await sharp(Buffer.from(monogram(180, { radius: 0 }))).png().toFile(out("app", "apple-icon.png"));
console.log("wrote app/icon.svg, app/apple-icon.png");

/* ---------- Social sharing images ---------- */

const og = {
  en: {
    dir: "ltr",
    name: "Dr. Abdullah Elkasaby",
    role: "General Surgery · Bariatric Surgery",
    line: "Considered surgical care, from first consultation to follow-up.",
    font: "Georgia, 'Times New Roman', serif",
    body: "'Segoe UI', Arial, sans-serif",
  },
  ar: {
    dir: "rtl",
    name: "د. عبدالله القصبي",
    role: "الجراحة العامة · جراحات السمنة",
    line: "رعاية جراحية مدروسة من الاستشارة الأولى حتى المتابعة",
    font: "'Segoe UI', Tahoma, Arial, sans-serif",
    body: "'Segoe UI', Tahoma, Arial, sans-serif",
  },
};

const plume = await sharp(out("public", "media", "ink-plume.webp")).resize(1200, 630, { fit: "cover" }).png().toBuffer();

for (const [locale, c] of Object.entries(og)) {
  const rtl = c.dir === "rtl";
  const x = rtl ? 1120 : 80;
  // With direction="rtl", librsvg's "start" is the right-hand edge.
  const anchor = "start";
  const markX = rtl ? 1120 - 96 : 80;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E6F6FA"/><stop offset="0.5" stop-color="#EEF9F1"/><stop offset="1" stop-color="#DDF1F4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <image href="data:image/png;base64,${plume.toString("base64")}" width="1200" height="630" opacity="0.55"/>
  <rect x="48" y="48" width="1104" height="534" rx="40" fill="#ffffff" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.85" stroke-width="2"/>
  <g transform="translate(${markX} 104) scale(2)">
    <rect width="48" height="48" rx="13" fill="#077EA3"/>
    <g fill="none" stroke="#fff" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">${monogramPaths}</g>
  </g>
  <text x="${x}" y="318" text-anchor="${anchor}" direction="${c.dir}" font-family="${c.font}" font-size="72" font-weight="700" fill="#123843">${c.name}</text>
  <text x="${x}" y="382" text-anchor="${anchor}" direction="${c.dir}" font-family="${c.body}" font-size="32" font-weight="600" fill="#07566F">${c.role}</text>
  <text x="${x}" y="470" text-anchor="${anchor}" direction="${c.dir}" font-family="${c.body}" font-size="28" fill="#3E5F66">${c.line}</text>
  <rect x="${rtl ? 1120 - 220 : 80}" y="510" width="220" height="8" rx="4" fill="#39B54A"/>
  <rect x="${rtl ? 1120 - 220 : 80}" y="510" width="120" height="8" rx="4" fill="#077EA3"/>
</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out("public", "og", `og-${locale}.png`));
  console.log(`wrote public/og/og-${locale}.png`);
}
