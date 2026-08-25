import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = process.argv[2];
const OUT_DIR = path.join(import.meta.dirname, "public", "articles", "static-news");

const files = fs.readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
for (const f of files) {
  const slug = f.replace(/\.(jpe?g|png)$/i, "");
  const out = path.join(OUT_DIR, `${slug}.webp`);
  await sharp(path.join(SRC_DIR, f))
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(out);
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`${slug}.webp ${kb} KB`);
}
console.log(`converted: ${files.length}`);
