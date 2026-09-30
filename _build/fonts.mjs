import fs from "fs";
import { execFileSync } from "child_process";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
function dl(url, out) { execFileSync("curl", ["-s", "--max-time", "90", "-A", UA, url, "-o", out]); }
const jobs = [["_build/tmp/gs.css", "gs"], ["_build/tmp/ms.css", "ms"]];
let css = "";
for (const [file, name] of jobs) {
  let t = fs.readFileSync(file, "utf8");
  // keep only woff2 sources
  const urls = [...new Set([...t.matchAll(/url\(['"]?((?:https:)?\/\/[^)'"]+\.woff2)['"]?\)/g)].map(m => m[1]))];
  console.log(name, "woff2:", urls.length);
  for (const u of urls) {
    const abs = u.startsWith("//") ? "https:" + u : u;
    const local = name + "-" + abs.split("/").pop();
    if (!fs.existsSync("assets/fonts/" + local)) dl(abs, "assets/fonts/" + local);
    t = t.replaceAll(u, "../fonts/" + local);
  }
  // drop woff/ttf fallbacks (woff2 covers every target browser)
  t = t.replace(/,\s*\n?\s*url\(['"]?(?:https:)?\/\/[^)'"]+\.(?:woff|ttf)['"]?\)\s*format\(['"](?:woff|truetype)['"]\)/g, "");
  css += t + "\n";
}
fs.writeFileSync("assets/css/fonts.css", css);
console.log("css bytes", css.length);
