import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "opt");

const RASTER_TARGETS = {
  "carier.png": 1600,
  "swiper.jpg": 1600,
  "industry.png": 2560,
  "industry_1.jpg": 1200,
  "industry_2.jpg": 1200,
  "industry_3.jpg": 1200,
  "industry_4.jpg": 1200,
  "industry_5.jpg": 1200,
  "advantages_1.jpg": 1600,
  "advantages_2.jpg": 1600,
  "advantages_3.jpg": 1600,
  "advantages_4.jpg": 1600,
  "advantages__3.jpg": 1600,
  "key-advantages.png": 2560,
  "orderss.png": 2560,
  "reviews.png": 2560,
};

const SVG_RASTER_TARGETS = {
  "hero_svg.svg": 1574,
  "footer.svg": 2560,
  "gold.svg": 486,
  "copper.svg": 390,
  "belaz.svg": 630,
  "belaz_2.svg": 672,
  "belaz_3.svg": 354,
  "coal.svg": 246,
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function processRaster(name, targetWidth) {
  const src = path.join(PUBLIC, name);
  const base = name.replace(/\.(png|jpg|jpeg)$/i, "");
  const outWebp = path.join(OUT, `${base}.webp`);
  const outAvif = path.join(OUT, `${base}.avif`);
  try {
    const input = sharp(src);
    const meta = await input.metadata();
    const width = Math.min(targetWidth, meta.width ?? targetWidth);
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(outWebp);
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 5 })
      .toFile(outAvif);
    const [wStat, aStat, origStat] = await Promise.all([
      fs.stat(outWebp),
      fs.stat(outAvif),
      fs.stat(src),
    ]);
    console.log(
      `raster ${name}: ${(origStat.size / 1024).toFixed(0)}KB -> webp ${(wStat.size / 1024).toFixed(0)}KB / avif ${(aStat.size / 1024).toFixed(0)}KB (w=${width})`,
    );
  } catch (err) {
    console.error(`FAILED raster ${name}:`, err.message);
  }
}

function extractBase64FromSvg(svg) {
  const m = svg.match(/data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)/i);
  if (!m) return null;
  return { mime: m[1].toLowerCase(), data: Buffer.from(m[2], "base64") };
}

async function processSvgRaster(name, targetWidth) {
  const src = path.join(PUBLIC, name);
  const base = name.replace(/\.svg$/i, "");
  const outWebp = path.join(OUT, `${base}.webp`);
  const outAvif = path.join(OUT, `${base}.avif`);
  try {
    const svg = await fs.readFile(src, "utf8");
    const extracted = extractBase64FromSvg(svg);
    if (!extracted) {
      console.log(`svg ${name}: no base64 raster found, skipped`);
      return;
    }
    const input = sharp(extracted.data);
    const meta = await input.metadata();
    const width = Math.min(targetWidth, meta.width ?? targetWidth);
    await sharp(extracted.data)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(outWebp);
    await sharp(extracted.data)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 5 })
      .toFile(outAvif);
    const [wStat, aStat, origStat] = await Promise.all([
      fs.stat(outWebp),
      fs.stat(outAvif),
      fs.stat(src),
    ]);
    console.log(
      `svg-raster ${name}: ${(origStat.size / 1024).toFixed(0)}KB -> webp ${(wStat.size / 1024).toFixed(0)}KB / avif ${(aStat.size / 1024).toFixed(0)}KB (w=${width})`,
    );
  } catch (err) {
    console.error(`FAILED svg ${name}:`, err.message);
  }
}

async function main() {
  await ensureDir(OUT);

  for (const [name, w] of Object.entries(RASTER_TARGETS)) {
    await processRaster(name, w);
  }
  for (const [name, w] of Object.entries(SVG_RASTER_TARGETS)) {
    await processSvgRaster(name, w);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
