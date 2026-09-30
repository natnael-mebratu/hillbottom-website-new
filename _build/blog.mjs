import fs from "fs";
const src = fs.readFileSync("C:/Users/Ident/AppData/Local/Temp/claude/hb/replit/src/lib/blogData.ts", "utf8");
const body = src.slice(src.indexOf("["), src.lastIndexOf("]") + 1);
// turn the TS object literal into JSON-ish: it uses template literals for content
const posts = [];
const re = /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*coverImage:\s*"([^"]*)",\s*readTime:\s*"([^"]+)",\s*tags:\s*\[([^\]]*)\],\s*content:\s*`([\s\S]*?)`\s*,?\s*\}/g;
let m;
while ((m = re.exec(body))) {
  posts.push({ slug: m[1], title: m[2], excerpt: m[3], date: m[4], cover: m[5], readTime: m[6],
    tags: m[7].split(",").map(s => s.trim().replace(/^"|"$/g, "")).filter(Boolean), content: m[8].trim() });
}
console.log("parsed", posts.length);
posts.forEach(p => console.log(" -", p.slug, p.content.length, "chars, tags:", p.tags.join("/")));
fs.writeFileSync("_build/blog.json", JSON.stringify(posts, null, 1));
