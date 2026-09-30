import fs from "fs";
import path from "path";
import home from "./pages/home.mjs";
import rest from "./pages/rest.mjs";
import newpages from "./pages/newpages.mjs";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const pages = { "index.html": home, ...rest, ...newpages };

let bytes = 0;
for (const [rel, html] of Object.entries(pages)) {
  const fp = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, html.trim() + "\n");
  bytes += html.length;
  console.log(String(Math.round(html.length / 1024)).padStart(4), "kb  ", rel);
}
console.log("\n" + Object.keys(pages).length + " pages, " + Math.round(bytes / 1024) + " kb total");

/* sitemap.xml + robots.txt, generated from the same page map so they never
   drift out of sync with the site's actual pages. */
const SITE_URL = "https://hillbottomproperties.com";
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(pages)
  .map((rel) => (rel === "index.html" ? "" : rel))
  .map((rel) => `  <url><loc>${SITE_URL}/${rel}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log("sitemap.xml + robots.txt written for " + Object.keys(pages).length + " pages");

/* the contract must survive into the emitted HTML */
const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
if (!idx.includes("IMPECCABLE DIRECTION CONTRACT")) throw new Error("direction contract missing from build output");
console.log("contract: present in built output");

/* every referenced local asset must exist in the emitted tree */
const missing = new Set();
for (const [rel, html] of Object.entries(pages)) {
  const dir = path.dirname(path.join(ROOT, rel));
  for (const m of html.matchAll(/(?:src|href)="((?!https?:|mailto:|tel:|#|data:)[^"]+)"/g)) {
    const target = path.resolve(dir, m[1].split("#")[0].split("?")[0]);
    if (!fs.existsSync(target)) missing.add(rel + "  ->  " + m[1]);
  }
}
if (missing.size) { console.error("\nMISSING ASSETS:\n " + [...missing].join("\n ")); process.exitCode = 1; }
else console.log("assets: every local src/href resolves");

/* CSS sanity: an unbalanced brace silently swallows every rule after it.
   A stray orphan rule once killed .plate{position:relative} site-wide. */
const css = fs.readFileSync(path.join(ROOT, "assets/css/hb.css"), "utf8");
const braces = [(css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length];
if (braces[0] !== braces[1]) { console.error(`CSS BRACES UNBALANCED: ${braces[0]} open, ${braces[1]} close`); process.exitCode = 1; }
const required = [".plate{", ".ridge{", ".alt{", ".facts{", ".hero{", ".ch--abyss{", ".btn{", ".ledger{", ".field "];
const absent = required.filter((s) => !css.includes(s));
if (absent.length) { console.error("CSS MISSING RULES: " + absent.join(" ")); process.exitCode = 1; }
if (!absent.length && braces[0] === braces[1]) console.log("css: braces balanced, core rules present");

/* A rule that rebinds --fg must also set color; otherwise headings inherit
   body ink and vanish against their own ground. This has bitten twice.
   Modifier classes (.ch--*) are exempt: they ride on a base that sets color. */
const cssBlocks = css.split("}").map((s) => s + "}");
const unbound = cssBlocks
  .filter((blk) => /--fgs*:/.test(blk) && !/(^|[;{s])colors*:/.test(blk))
  .map((blk) => (blk.split("{")[0] || "").split("*/").pop().trim())
  .filter((sel) => sel && !sel.includes("--") && !sel.includes(":root"));
if (unbound.length) { console.error("CSS: rebinds --fg without color -> " + unbound.join(" | ")); process.exitCode = 1; }
else console.log("css: every --fg rebinding also sets color");

/* $ returns one node, $$ returns a list. A single-$ list call throws at
   runtime and only shows up in a console capture. Catch it at build time. */
const js = fs.readFileSync(path.join(ROOT, "assets/js/hb.js"), "utf8");
const badCalls = [...js.matchAll(/(^|[^$])$([^)]*).forEach/g)].map((m) => m[0].trim());
if (badCalls.length) { console.error("JS: single-$ used as a list -> " + badCalls.join(" | ")); process.exitCode = 1; }
else console.log("js: no single-$ list calls");
