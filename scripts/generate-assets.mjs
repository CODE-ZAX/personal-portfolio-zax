/**
 * Local asset pipeline.
 *
 * Approved stills live in the bot store and are resized here.
 * Projects without a still get a generative SVG composition in the same
 * charcoal / cedar palette. Swap a file by replacing its WebP and re-running
 * `npm run assets`. Paths are declared in src/data/media.ts.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = process.env.PORTFOLIO_ASSET_SOURCE ?? "/cursor/stores/bot/portfolio-assets";
const outDir = path.join(root, "public/assets/images");

const cedar = "#c9844a";
const cedarHot = "#e7b184";
const silver = "#d5d0c8";
const ink = "#141311";

function stage(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1152" height="864" viewBox="0 0 1152 864">
  <defs>
    <radialGradient id="wash" cx="48%" cy="42%" r="72%">
      <stop offset="0%" stop-color="#2c2824"/>
      <stop offset="62%" stop-color="#171614"/>
      <stop offset="100%" stop-color="#100f0e"/>
    </radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a342e"/>
      <stop offset="100%" stop-color="#1a1816"/>
    </linearGradient>
    <linearGradient id="cedar" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${cedarHot}"/>
      <stop offset="100%" stop-color="${cedar}"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>
  <rect width="1152" height="864" fill="${ink}"/>
  <rect width="1152" height="864" fill="url(#wash)"/>
  ${body}
</svg>`;
}

const compositions = {
  applix: stage(`
    <ellipse cx="760" cy="250" rx="180" ry="90" fill="${cedar}" opacity="0.28" filter="url(#glow)"/>
    <g transform="translate(286 122)">
      <rect width="580" height="620" rx="36" fill="url(#metal)" stroke="${silver}" stroke-opacity="0.28"/>
      <rect x="48" y="64" width="180" height="14" rx="7" fill="${silver}" opacity="0.45"/>
      <rect x="48" y="150" width="484" height="64" rx="14" fill="#121110" stroke="${silver}" stroke-opacity="0.2"/>
      <rect x="48" y="238" width="484" height="64" rx="14" fill="url(#cedar)"/>
      <rect x="70" y="262" width="210" height="16" rx="8" fill="#1a120c" opacity="0.55"/>
      <rect x="48" y="326" width="230" height="64" rx="14" fill="#121110" stroke="${silver}" stroke-opacity="0.2"/>
      <rect x="302" y="326" width="230" height="64" rx="14" fill="#121110" stroke="${silver}" stroke-opacity="0.2"/>
      <rect x="48" y="414" width="484" height="64" rx="14" fill="#121110" stroke="${silver}" stroke-opacity="0.2"/>
      <rect x="48" y="512" width="200" height="52" rx="26" fill="${cedar}"/>
    </g>
  `),
  bill: stage(`
    <g transform="translate(386 78)">
      <path d="M40 0 H340 Q380 0 380 40 V760 Q380 800 340 800 H40 Q0 800 0 760 V40 Q0 0 40 0 Z" fill="url(#metal)" stroke="${silver}" stroke-opacity="0.3"/>
      <path d="M40 0 H300 L380 80 V40 Q380 0 340 0 Z" fill="#3f3832"/>
      <rect x="48" y="120" width="220" height="16" rx="8" fill="${silver}" opacity="0.55"/>
      <rect x="48" y="168" width="284" height="8" rx="4" fill="${silver}" opacity="0.22"/>
      <rect x="48" y="196" width="250" height="8" rx="4" fill="${silver}" opacity="0.18"/>
      <rect x="48" y="224" width="270" height="8" rx="4" fill="${silver}" opacity="0.18"/>
      <rect x="48" y="280" width="284" height="10" rx="5" fill="${silver}" opacity="0.16"/>
      <rect x="48" y="312" width="190" height="10" rx="5" fill="${silver}" opacity="0.16"/>
      <rect x="48" y="344" width="230" height="10" rx="5" fill="${silver}" opacity="0.16"/>
      <rect x="48" y="420" width="284" height="56" rx="12" fill="url(#cedar)"/>
      <g fill="${silver}" opacity="0.55">
        <rect x="48" y="640" width="6" height="70"/>
        <rect x="62" y="640" width="3" height="70"/>
        <rect x="72" y="640" width="8" height="70"/>
        <rect x="86" y="640" width="3" height="70"/>
        <rect x="96" y="640" width="5" height="70"/>
        <rect x="108" y="640" width="10" height="70"/>
        <rect x="124" y="640" width="3" height="70"/>
        <rect x="134" y="640" width="7" height="70"/>
        <rect x="148" y="640" width="4" height="70"/>
        <rect x="160" y="640" width="12" height="70"/>
        <rect x="178" y="640" width="3" height="70"/>
        <rect x="188" y="640" width="8" height="70"/>
        <rect x="202" y="640" width="5" height="70"/>
        <rect x="214" y="640" width="3" height="70"/>
        <rect x="224" y="640" width="9" height="70"/>
      </g>
    </g>
    <ellipse cx="576" cy="150" rx="90" ry="40" fill="${cedar}" opacity="0.22" filter="url(#glow)"/>
  `),
  proposal: stage(`
    <ellipse cx="780" cy="560" rx="120" ry="70" fill="${cedar}" opacity="0.3" filter="url(#glow)"/>
    <g transform="translate(300 110) rotate(-7 276 322)">
      <rect width="520" height="660" rx="18" fill="#221f1c" stroke="${silver}" stroke-opacity="0.28"/>
      <rect x="48" y="56" width="240" height="18" rx="9" fill="${silver}" opacity="0.7"/>
      <rect x="48" y="120" width="400" height="10" rx="5" fill="${silver}" opacity="0.22"/>
      <rect x="48" y="148" width="360" height="10" rx="5" fill="${silver}" opacity="0.18"/>
      <rect x="48" y="176" width="390" height="10" rx="5" fill="${silver}" opacity="0.18"/>
      <rect x="48" y="204" width="300" height="10" rx="5" fill="${silver}" opacity="0.16"/>
      <rect x="48" y="260" width="410" height="10" rx="5" fill="${silver}" opacity="0.16"/>
      <rect x="48" y="288" width="340" height="10" rx="5" fill="${silver}" opacity="0.14"/>
      <rect x="48" y="316" width="380" height="10" rx="5" fill="${silver}" opacity="0.14"/>
      <circle cx="400" cy="520" r="78" fill="none" stroke="url(#cedar)" stroke-width="10"/>
      <circle cx="400" cy="520" r="48" fill="url(#cedar)"/>
    </g>
  `),
  youtube: stage(`
    <ellipse cx="576" cy="432" rx="260" ry="120" fill="${cedar}" opacity="0.2" filter="url(#glow)"/>
    <circle cx="576" cy="432" r="250" fill="none" stroke="${silver}" stroke-opacity="0.18" stroke-width="2"/>
    <circle cx="576" cy="432" r="168" fill="none" stroke="${silver}" stroke-opacity="0.12" stroke-width="18"/>
    <g transform="translate(176 432)">
      ${Array.from({ length: 40 }, (_, i) => {
        const h = [18, 28, 46, 70, 96, 120, 84, 56, 140, 90, 40, 24, 64, 110, 150, 80, 36, 22, 48, 100, 130, 70, 30, 18, 54, 88, 120, 60, 26, 44, 92, 70, 34, 20, 58, 40, 24, 16, 22, 14][i];
        const x = i * 20;
        const fill = i > 22 && i < 30 ? "url(#cedar)" : silver;
        const opacity = i > 22 && i < 30 ? 1 : 0.55;
        return `<rect x="${x}" y="${-h / 2}" width="8" height="${h}" rx="4" fill="${fill}" opacity="${opacity}"/>`;
      }).join("")}
    </g>
  `),
  xclipy: stage(`
    <ellipse cx="620" cy="640" rx="240" ry="40" fill="${cedar}" opacity="0.16" filter="url(#glow)"/>
    <g>
      <rect x="250" y="250" width="560" height="360" rx="28" fill="#2a2622" stroke="${silver}" stroke-opacity="0.2"/>
      <rect x="300" y="190" width="560" height="360" rx="28" fill="#322e2a" stroke="${silver}" stroke-opacity="0.25"/>
      <rect x="350" y="130" width="560" height="360" rx="28" fill="url(#metal)" stroke="${cedar}" stroke-opacity="0.85" stroke-width="3"/>
      <rect x="398" y="190" width="220" height="16" rx="8" fill="${silver}" opacity="0.6"/>
      <rect x="398" y="236" width="420" height="10" rx="5" fill="${silver}" opacity="0.22"/>
      <rect x="398" y="264" width="360" height="10" rx="5" fill="${silver}" opacity="0.18"/>
      <rect x="398" y="292" width="390" height="10" rx="5" fill="${silver}" opacity="0.16"/>
      <rect x="398" y="360" width="140" height="42" rx="21" fill="url(#cedar)"/>
    </g>
  `),
  tidydesk: stage(`
    <ellipse cx="820" cy="220" rx="140" ry="70" fill="${cedar}" opacity="0.22" filter="url(#glow)"/>
    ${[0, 1, 2, 3, 4, 5]
      .map((col) => {
        return [0, 1, 2, 3]
          .map((row) => {
            const x = 176 + col * 140;
            const y = 150 + row * 150;
            const drift = col < 2 ? (row % 2 === 0 ? -18 : 22) : 0;
            const fill = col === 4 && row === 1 ? "url(#cedar)" : "url(#metal)";
            const stroke = col === 4 && row === 1 ? cedar : silver;
            return `<rect x="${x + drift}" y="${y}" width="96" height="112" rx="16" fill="${fill}" stroke="${stroke}" stroke-opacity="0.35"/>`;
          })
          .join("");
      })
      .join("")}
  `),
  subtitles: stage(`
    <rect x="96" y="150" width="960" height="540" rx="28" fill="#1a1816" stroke="${silver}" stroke-opacity="0.28"/>
    <rect x="96" y="150" width="960" height="8" fill="${silver}" opacity="0.2"/>
    <ellipse cx="760" cy="390" rx="180" ry="80" fill="${cedar}" opacity="0.18" filter="url(#glow)"/>
    <rect x="210" y="560" width="520" height="64" rx="18" fill="#2a2724" stroke="${silver}" stroke-opacity="0.3"/>
    <rect x="250" y="584" width="300" height="16" rx="8" fill="${silver}" opacity="0.7"/>
    <rect x="748" y="560" width="240" height="64" rx="18" fill="url(#cedar)"/>
  `),
  insiders: stage(`
    <g fill="none" stroke="${silver}" stroke-opacity="0.35" stroke-width="2">
      <path d="M300 280 L576 432 L820 260"/>
      <path d="M300 280 L260 560 L576 432"/>
      <path d="M820 260 L900 500 L576 432"/>
      <path d="M260 560 L470 680 L576 432 L700 700 L900 500"/>
      <path d="M470 680 L700 700"/>
    </g>
    <circle cx="300" cy="280" r="34" fill="#221f1c" stroke="${silver}" stroke-opacity="0.5"/>
    <circle cx="820" cy="260" r="28" fill="#221f1c" stroke="${silver}" stroke-opacity="0.5"/>
    <circle cx="260" cy="560" r="22" fill="#221f1c" stroke="${silver}" stroke-opacity="0.45"/>
    <circle cx="900" cy="500" r="26" fill="#221f1c" stroke="${silver}" stroke-opacity="0.45"/>
    <circle cx="470" cy="680" r="20" fill="#221f1c" stroke="${silver}" stroke-opacity="0.4"/>
    <circle cx="700" cy="700" r="24" fill="#221f1c" stroke="${silver}" stroke-opacity="0.4"/>
    <circle cx="576" cy="432" r="92" fill="${cedar}" opacity="0.28" filter="url(#glow)"/>
    <circle cx="576" cy="432" r="54" fill="url(#cedar)"/>
    <circle cx="576" cy="432" r="18" fill="#1a120c" opacity="0.35"/>
  `),
};

const aiStills = [
  { file: "hero-poster.webp", widths: [640, 1280], ratio: 9 / 16 },
  { file: "project-ai-interviewee.webp", widths: [640, 1152], ratio: 3 / 4 },
  { file: "project-jarvis.webp", widths: [640, 1152], ratio: 3 / 4 },
  { file: "project-chatli.webp", widths: [640, 1152], ratio: 3 / 4 },
  { file: "bg-texture.webp", widths: [640, 1024], ratio: 1 },
];

async function writeWebp(input, file, width, height) {
  await sharp(input)
    .resize(width, height, { fit: "cover", position: "centre" })
    .webp({ quality: 74, effort: 5 })
    .toFile(path.join(outDir, file));
}

async function main() {
  await mkdir(outDir, { recursive: true });

  for (const still of aiStills) {
    const input = path.join(sourceDir, still.file);
    const base = still.file.replace(/\.webp$/, "");
    for (const width of still.widths) {
      const height = Math.round(width * still.ratio);
      await writeWebp(input, `${base}-${width}.webp`, width, height);
    }
    await sharp(input).webp({ quality: 78, effort: 5 }).toFile(path.join(outDir, still.file));
  }

  for (const [name, svg] of Object.entries(compositions)) {
    const buffer = Buffer.from(svg);
    await writeWebp(buffer, `project-${name}-1152.webp`, 1152, 864);
    await writeWebp(buffer, `project-${name}-640.webp`, 640, 480);
  }

  const portrait = path.join(outDir, "portrait-faraz.png");
  await writeWebp(portrait, "portrait-faraz-460.webp", 460, 460);
  await writeWebp(portrait, "portrait-faraz-320.webp", 320, 320);

  console.log("Wrote responsive WebP assets to", outDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
