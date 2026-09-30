// Phase 3 interior renders (supplied Sep 2026) -> responsive WebP.
import sharp from "sharp"; import fs from "fs";
const SRC = "C:/Users/Ident/OneDrive/Desktop/3. Monthly Retainers/1. Hillbottom & Urban Kaza/5. Renders/";
const MAP = {
  "1.jpeg": "rec-reception-01", "2.jpeg": "rec-reception-02", "3.jpeg": "rec-salon-01", "4.jpeg": "rec-salon-02",
  "5.jpeg": "rec-salon-03", "6.jpeg": "rec-salon-04", "7.jpeg": "rec-salon-05", "8.jpeg": "rec-nails-01",
  "WhatsApp Image 2026-09-26 at 11.48.51 AM.jpeg": "rec-nails-02", "9.jpeg": "rec-pool", "10.jpeg": "rec-spa-01",
  "11.jpeg": "rec-gym-01", "12.jpeg": "rec-spa-02", "13.jpeg": "rec-gym-02", "14.jpeg": "rec-spa-03", "15.jpeg": "rec-gym-03",
};
const manifest = JSON.parse(fs.readFileSync("_build/images.json", "utf8"));
for (const [f, base] of Object.entries(MAP)) {
  const meta = await sharp(SRC + f).metadata();
  const made = [];
  for (const w of [1400, 800]) {
    const real = Math.min(w, meta.width);
    await sharp(SRC + f).resize({ width: real, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(`assets/img/${base}-${w}.webp`);
    made.push({ name: w, w: real, h: Math.round(meta.height * real / meta.width) });
  }
  manifest[base] = made.sort((a, b) => a.w - b.w);
  console.log(base, meta.width + "x" + meta.height);
}
fs.writeFileSync("_build/images.json", JSON.stringify(manifest, null, 1));
