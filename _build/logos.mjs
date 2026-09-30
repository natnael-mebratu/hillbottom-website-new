import fs from "fs"; import path from "path";
const d = "C:/Users/Ident/OneDrive/Desktop/2. Branding Projects/Property and Development/HillBottom Real Estate/Logo Accessible Files/SVG";
for (const f of fs.readdirSync(d)) {
  const t = fs.readFileSync(path.join(d, f), "utf8");
  const vb = (t.match(/viewBox="([^"]+)"/) || [])[1] || "-";
  const fills = [...new Set([...t.matchAll(/#[0-9a-fA-F]{6}/g)].map(m => m[0].toUpperCase()))];
  console.log(f.padEnd(24), vb.padEnd(28), "paths=" + String((t.match(/<path/g)||[]).length).padEnd(4), "kb=" + Math.round(t.length/1024), fills.slice(0,4).join(","));
}
