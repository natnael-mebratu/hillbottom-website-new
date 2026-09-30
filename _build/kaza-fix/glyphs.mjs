// Rasterise the official Urban Kaza lockup paths (no live <text>) to a white-on-transparent PNG.
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
const svg = readFileSync("assets/img/urban-kaza-lockup-official.svg", "utf8").replace(/<text[\s\S]*?<\/text>/g, "");
const png = new Resvg(svg, { fitTo: { mode: "width", value: 4126 }, background: "rgba(0,0,0,0)" }).render().asPng();
writeFileSync("_build/kaza-fix/lockup-paths.png", png);
const mark = readFileSync("assets/img/urban-kaza-mark-official.svg", "utf8");
writeFileSync("_build/kaza-fix/mark.png", new Resvg(mark, { fitTo: { mode: "height", value: 1600 } }).render().asPng());
console.log("ok");
