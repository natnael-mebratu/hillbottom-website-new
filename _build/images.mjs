/* Source renders -> responsive WebP, plus a manifest so the page templates
   emit srcset entries whose declared widths are the real pixel widths. */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "C:/Users/Ident/AppData/Local/Temp/claude/hb/assets";
const OUT = "assets/img";
fs.mkdirSync(OUT, { recursive: true });

const HERO = new Set(["hero-hillbottom", "urban-kaza-ext-v2", "recreation-hub", "kaza-building", "hillbottom-interior"]);
const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".png"));
const manifest = {};

for (const f of files) {
  const base = path.basename(f, ".png");
  const src = path.join(SRC, f);
  const meta = await sharp(src).metadata();
  const targets = HERO.has(base) ? [2400, 1400, 800] : [1400, 800];
  const made = [];
  for (const w of targets) {
    const real = Math.min(w, meta.width);
    const out = path.join(OUT, `${base}-${w}.webp`);
    await sharp(src).resize({ width: real, withoutEnlargement: true })
      .webp({ quality: w >= 2000 ? 72 : 78, effort: 5 }).toFile(out);
    made.push({ name: w, w: real });
  }
  // de-duplicate: if two targets clamped to the same real width, keep the larger name
  const seen = new Set();
  manifest[base] = made.filter((v) => (seen.has(v.w) ? false : (seen.add(v.w), true)))
    .sort((a, b) => a.w - b.w);
  console.log(base.padEnd(24), meta.width + "x" + meta.height, "->", manifest[base].map((v) => v.name + ":" + v.w).join(" "));
}

fs.writeFileSync("_build/images.json", JSON.stringify(manifest, null, 1));
console.log("\n" + Object.keys(manifest).length + " images");
