import sharp from "sharp"; import fs from "fs";
for (const f of fs.readdirSync("_build/kaza3d/out").filter((f) => f.endsWith(".png") && f !== "sheet.png")) {
  const b = f.replace(".png", "");
  for (const w of [2400, 1400]) await sharp("_build/kaza3d/out/" + f).resize({ width: w }).webp({ quality: w > 2000 ? 80 : 82, effort: 5 }).toFile(`assets/img/zoning/${b}-${w}.webp`);
}
console.log("ok");
