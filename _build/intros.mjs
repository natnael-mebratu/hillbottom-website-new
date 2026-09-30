/* Brand intros rebuilt as native motion (Sep 2026) — replaces the two MP4 films.
   Geometry comes from the brand marks themselves, so nothing is traced by eye. */
import { readFileSync } from "fs";

/* ---------------- Hill Bottom: ridge lines -> summit glint -> gold ridge -------- */
// The upper edge of the monogram's ridge gap (logo units, 117.6 wide).
const EDGE = [[0, 61.4], [4.7, 57.8], [8.7, 61.8], [32.9, 43.7], [36.5, 47.3], [58.8, 30.7], [81, 47.3], [84.6, 43.7], [108.8, 61.8], [112.8, 57.8], [117.6, 61.4]];
const LOWER = [[0, 70.8], [4.3, 68.4], [8.3, 71.4], [32.5, 56.2], [36.1, 62.4], [58.8, 43.9], [81.5, 62.4], [85.1, 56.2], [109.3, 71.4], [113.3, 68.2], [117.6, 70.7]];
const S = 12.4, CX = 800;
const f = (n) => Math.round(n * 10) / 10;
function half(side, y0) {
  // from the summit outwards, then run the flank off-canvas at the logo's own slope
  const pts = side < 0 ? EDGE.slice(0, 6).reverse() : EDGE.slice(5);
  const out = pts.map(([x, y]) => [CX + (x - 58.8) * S, y0 + (y - 30.7) * S]);
  const [lx, ly] = out[out.length - 1];
  out.push([lx + side * 900, ly + 900 * 0.748]);
  return "M" + out.map(([x, y]) => `${f(x)} ${f(y)}`).join("L");
}
export function hbIntro(up) {
  const N = 17;
  let lines = "";
  for (let i = 0; i < N; i++) {
    const y0 = 96 + i * 44;
    const t = i / (N - 1);
    const sw = f(1 + t * 1.2), op = f(0.42 + t * 0.58);
    const st = `style="--i:${i};stroke-width:${sw};opacity:${op}"`;
    lines += `<path pathLength="1" d="${half(-1, y0)}" ${st}/><path pathLength="1" d="${half(1, y0)}" ${st}/>`;
  }
  // the ridge band between the monogram's two halves, tapered to points like the film's mark
  const band = [[3.6, 66.4], ...EDGE.slice(2, 9), [114, 66.4], ...LOWER.slice(2, 9).reverse()].map(([x, y]) => `${x},${y}`).join(" ");
  return `<div class="hbi" data-site-loader aria-hidden="true">
  <svg class="hbi__lattice" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><pattern id="hbi-rh" width="420" height="260" patternUnits="userSpaceOnUse" x="590" y="-60"><path d="M0 130 210 0 420 130 210 260Z" fill="none" stroke="#C6B27C" stroke-width="1.2"/></pattern></defs><rect width="1600" height="900" fill="url(#hbi-rh)"/></svg>
  <svg class="hbi__lines" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#CDB67B" stroke-linejoin="miter">${lines}</g></svg>
  <svg class="hbi__lines hbi__lines--glow" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#F6E2A8" stroke-linejoin="miter">${lines}</g></svg>
  <div class="hbi__mark">
    <svg viewBox="1 28 115.6 46"><defs>
      <linearGradient id="hbi-au" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E7443"/><stop offset=".42" stop-color="#E7D29B"/><stop offset=".62" stop-color="#C9AE6D"/><stop offset="1" stop-color="#8A6E3C"/></linearGradient>
      <linearGradient id="hbi-sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <clipPath id="hbi-cl"><polygon points="${band}"/></clipPath></defs>
      <polygon points="${band}" fill="url(#hbi-au)"/>
      <g clip-path="url(#hbi-cl)"><rect class="hbi__sheen" x="-40" y="20" width="26" height="70" fill="url(#hbi-sh)" transform="skewX(-18)"/></g>
    </svg>
  </div>
</div>`;
}

/* ---------------- Urban Kaza: the official lockup, split into animatable glyphs -- */
const SVG = readFileSync("assets/img/urban-kaza-lockup-official.svg", "utf8");
function glyphs() {
  const els = [...SVG.matchAll(/<(path|polygon|rect)\b[^>]*\/>/g)].map((m) => m[0]);
  const nums = (s) => (s.match(/-?\d*\.?\d+/g) || []).map(Number);
  return els.map((el) => {
    let xs = [], ys = [];
    if (el.startsWith("<polygon")) { const n = nums(el.match(/points="([^"]+)"/)[1]); xs = n.filter((_, i) => !(i % 2)); ys = n.filter((_, i) => i % 2); }
    else if (el.startsWith("<rect")) { const y = +(el.match(/\by="([^"]+)"/) || [0, 0])[1]; xs = [0, 18]; ys = [y]; }
    else { const d = el.match(/d="([^"]+)"/)[1]; const m = d.match(/^M(-?[\d.]+),(-?[\d.]+)/); xs = [+m[1]]; ys = [+m[2]]; }
    return { el: el.replace(/ class="[^"]*"/, ""), x: Math.min(...xs), y: Math.min(...ys) };
  });
}
// The pattern from the film: alternating open triangles, odd rows offset half a step.
function field() {
  const b = 112, h = 97, step = b / 2 + 30, pitch = h + 34;
  let out = "";
  for (let r = 0, y = -70; y < 960; r++, y += pitch) {
    for (let c = 0, x = -140 + (r % 2 ? step : 0); x < 1720; c++, x += step) {
      const up = (c + r) % 2 === 0;
      const pts = up ? [[x + b / 2, y], [x + b, y + h], [x, y + h]] : [[x + b / 2, y + h], [x, y], [x + b, y]];
      // start each outline at its apex so the corner "cut" opens at the apex
      const d = 0.3 + ((x + 140) / 1860) * 1.35 + (r % 3) * 0.04;
      out += `<polygon pathLength="1" points="${pts.map((p) => p.map((n) => Math.round(n)).join(",")).join(" ")}" style="--d:${d.toFixed(2)}s"/>`;
    }
  }
  return out;
}
export function ukIntro() {
  const g = glyphs();
  const urban = g.filter((e) => e.y < 120).sort((a, b) => a.x - b.x);
  const kaza = g.filter((e) => e.y >= 120);
  // KAZA: bar+chevron of K, then A, Z, A by x position
  const slot = (x) => (x < 250 ? 0 : x < 520 ? 1 : x < 760 ? 2 : 3);
  const kg = [0, 1, 2, 3].map((k) => kaza.filter((e) => slot(e.x) === k).map((e) => e.el).join(""));
  const ug = urban.map((e) => `<g class="uki__u" style="--k:${urban.indexOf(e)}">${e.el}</g>`).join("");
  return `<div class="uki" data-uk-intro inert>
  <button class="uki__skip" type="button" data-uk-skip>Skip intro</button>
  <div class="uki__cam"><svg class="uki__field" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="#F3E7CF" stroke-linejoin="miter">${field()}</g></svg></div>
  <div class="uki__lockup" role="img" aria-label="Urban Kaza — living activated">
    <svg viewBox="0 -8 1031.56 596" fill="#F5F5DB" aria-hidden="true">
      ${ug}
      ${kg.map((p, i) => `<g class="uki__k" style="--k:${i}">${p}</g>`).join("")}
      <g clip-path="url(#uki-a)"><rect class="uki__glint" x="860" y="170" width="70" height="260" fill="url(#uki-gl)"/></g>
      <defs><clipPath id="uki-a">${kg[3]}</clipPath><linearGradient id="uki-gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
      <text class="uki__tag" x="515.78" y="559" text-anchor="middle">LIVING ACTIVATED</text>
    </svg>
  </div>
</div>`;
}
