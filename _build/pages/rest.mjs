import fs from "fs";
const IMAGES = JSON.parse(fs.readFileSync(new URL("../images.json", import.meta.url), "utf8"));
import { ukIntro } from "../intros.mjs";
import {
  CO, CTA, KAZA_UNIT_SET, KAZA_BANDS, PROJECTS, PILLARS, POSTS, TESTIMONIALS, VR_TOURS, PROCESS, VALUES, TEAMS,
  KAZA_FLOORS, KAZA_UNITS, KAZA_UNIT_COLS, KAZA_NOTE, KAZA_CONTEXT, KAZA_GALLERY,
  VILLAGE_P1, VILLAGE_P2, REC_FACILITIES, REC_GALLERY,
} from "../data.mjs";
import { page, facts, alt, ridge, plate, img, btn, link, lightbox, unitSelector, esc, ICON } from "../ui.mjs";
import { inquiryForm, pageHero, ctaBand, storyCard, fmtDate, coverFor } from "./parts.mjs";


const galleryGrid = (items, d) => `
<div class="gal rv">
  ${items.map((g) => `
  <button type="button" data-lb="${"../".repeat(d)}assets/img/${g.img}-1400.webp" data-lb-cap="${esc(g.cap)}" aria-label="View ${esc(g.cap)} full size">
    ${plate(g.img, g.cap, { d, ar: "43", sizes: "(min-width:900px) 32vw, 100vw" })}
  </button>`).join("")}
</div>`;

const outlineIcon = (...paths) => `<svg class="uicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.map((path) => `<path pathLength="1" d="${path}"/>`).join("")}</svg>`;
const UK_CONTEXT_ICONS = [
  outlineIcon("M3 21h18M5 21V9l7-5 7 5v12M9 12h6M9 16h6"),
  outlineIcon("M5 19c2.2-3.4 4.6-5.1 7-5.1s4.8 1.7 7 5.1", "M8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z", "M3 4h3M18 4h3M12 1v2"),
  outlineIcon("M4 21V5h16v16M8 9h2M14 9h2M8 13h2M14 13h2M9 21v-4h6v4"),
  outlineIcon("M12 21V10M8 14l4-4 4 4M6 10c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5M4 21h16"),
];
const UK_FLOOR_ICONS = [
  outlineIcon("M4 15h16l-2-6H6l-2 6ZM6 15v4M18 15v4M8 18h8"),
  outlineIcon("M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2M8 4v2M12 4v2"),
  outlineIcon("M5 21V3h7a5 5 0 0 1 0 10H5M8 6h4a2 2 0 0 1 0 4H8"),
  outlineIcon("M3 11 12 4l9 7M5 10v10h14V10M9 20v-6h6v6"),
  outlineIcon("M4 10v4M7 8v8M17 8v8M20 10v4M7 12h10"),
];
const FEATURE_ICONS = [
  outlineIcon("M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z", "m8.5 12 2.2 2.2 4.8-5"),
  outlineIcon("M4 19h16M6 16l4-4 3 3 5-7", "M18 8h-4M18 8v4"),
  outlineIcon("M3 11 12 4l9 7M5 10v10h14V10M9 20v-6h6v6"),
  outlineIcon("M7 12h10M12 7v10", "M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z"),
  outlineIcon("M4 18V8M10 18V4M16 18v-6M22 18H2", "m4 8 6-4 6 8 6-5"),
  outlineIcon("M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z", "M2 12h2M20 12h2M12 2v2M12 20v2M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"),
];
const ABOUT_PILLARS = [...PILLARS, { n: "06", t: "Community", d: "Vibrant shared spaces designed to make everyday life feel connected." }];
const featureGrid = (items, icons = FEATURE_ICONS, className = "") => `<ol class="feature-grid ${className} rv">
  ${items.map((item, i) => `<li class="feature-card" style="--feature-i:${i}">
    <span class="feature-card__icon">${icons[i % icons.length]}</span>
    <span class="feature-card__number">${esc(item.n || String(i + 1).padStart(2, "0"))}</span>
    <h3>${esc(item.t)}</h3>
    <p>${esc(item.d)}</p>
  </li>`).join("")}
</ol>`;
const PROJECT_FEATURE_ICONS = [
  outlineIcon("M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z", "m8.5 12 2.2 2.2 4.8-5"),
  outlineIcon("M4 19h16M7 19V9h10v10M9 9V5h6v4", "M9 13h6"),
  outlineIcon("M5 21V3h14v18M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-5h4v5"),
  outlineIcon("M4 17h16M6 17l1-7h10l1 7M8 20h.01M16 20h.01", "M9 13h6"),
  outlineIcon("M4 12a8 8 0 1 0 16 0M7 12a5 5 0 1 0 10 0", "M12 4v8"),
  outlineIcon("M4 18V8M10 18V4M16 18v-6M22 18H2", "m4 8 6-4 6 8 6-5"),
];
const REC_ICONS = [
  outlineIcon("M5 20h14M7 20v-7a5 5 0 0 1 10 0v7", "M9 7h6M10 4h4"),
  outlineIcon("M7 20h10M8 16h8M9 12h6", "M8 3c0 2 2 2 2 4s-2 2-2 4M13 3c0 2 2 2 2 4s-2 2-2 4"),
  outlineIcon("M4 18h16M6 18l2-9h8l2 9", "M9 6h6M12 3v3"),
  outlineIcon("M3 15c2 2 4 2 6 0s4-2 6 0 4 2 6 0", "M3 19c2 2 4 2 6 0s4-2 6 0 4 2 6 0", "M5 11h14"),
  outlineIcon("M4 21V5h16v16M8 9h2M14 9h2M8 13h2M14 13h2M9 21v-4h6v4"),
  outlineIcon("M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2", "M8 4v2M12 4v2"),
  outlineIcon("M5 19c2-4 4-6 7-6s5 2 7 6", "M8 8a4 4 0 1 1 8 0", "M4 21h16"),
  outlineIcon("M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8", "M17 10h2a2 2 0 0 1 0 4h-2"),
  outlineIcon("M4 18h16M6 18V8l6-4 6 4v10", "M9 12h6"),
  outlineIcon("M3 18h18M5 18v-7l7-5 7 5v7", "M8 14h8"),
  outlineIcon("M4 10v4M7 8v8M17 8v8M20 10v4M7 12h10"),
];
const CONTACT_LOCATIONS = [
  {
    name: "Hill Bottom Village",
    role: "Completed community · Ayat",
    address: "Hill Bottom Village Apartments, Ayat Square, Addis Ababa",
    lat: 9.0217854,
    lng: 38.8770157,
  },
  {
    name: "Urban Kaza",
    role: "Residential project · Kazanchis",
    address: "Kazanchis, near Addis Sport Park, Addis Ababa",
    lat: 9.0146,
    lng: 38.7729,
  },
];
const projectFeatureGrid = (items, className = "") => `<ol class="project-feature-grid ${className} rv">
  ${items.map((item, i) => `<li class="project-feature-card" style="--feature-i:${i}">
    <span class="project-feature-card__icon">${PROJECT_FEATURE_ICONS[i % PROJECT_FEATURE_ICONS.length]}</span>
    <span class="project-feature-card__number">${String(i + 1).padStart(2, "0")}</span>
    <h3>${esc(item)}</h3>
  </li>`).join("")}
</ol>`;
const UK_FEATURED_GALLERY = KAZA_GALLERY.filter((_, index) => [0, 3, 7, 11, 15, 18, 22, 24, 25, 26, 6, 14].includes(index));
const towerWindows = Array.from({ length: 13 }, (_, row) => Array.from({ length: 6 }, (_, column) => {
  const x1 = 200 + column * 39;
  const x2 = x1 + 26;
  const y1 = 183 + row * 31 - (x1 - 180) * .17;
  const y2 = 183 + row * 31 - (x2 - 180) * .17;
  return `<polygon points="${x1},${y1.toFixed(1)} ${x2},${y2.toFixed(1)} ${x2},${(y2 + 18).toFixed(1)} ${x1},${(y1 + 18).toFixed(1)}"/>`;
}).join("")).join("");
const towerSideWindows = Array.from({ length: 13 }, (_, row) => Array.from({ length: 2 }, (_, column) => {
  const x1 = 466 + column * 42;
  const x2 = x1 + 27;
  const y1 = 153 + row * 31 + column * 22;
  const y2 = y1 + 15;
  return `<polygon points="${x1},${y1} ${x2},${y1 + 14} ${x2},${y2 + 18} ${x1},${y2 + 4}"/>`;
}).join("")).join("");
const MODEL_HOTSPOTS = [[50,87],[52,78],[53,68],[54,40],[55,8]];
const ZONE_KEYS = ["underground", "ground", "first", "residential", "rooftop"];
const ZONE_VIEWS = [["aerial", "Aerial"], ["low", "Low angle"], ["elevation", "Elevation"]];
const ZONE_ANCHORS = JSON.parse(fs.readFileSync(new URL("../kaza3d/out/anchors.json", import.meta.url), "utf8"));
const kazaTowerModel = () => {
  const u = "../assets/img/zoning/";
  const src = (v, s) => `${u}${v}-${s}-1400.webp`;
  const set = (v, s) => `${u}${v}-${s}-1400.webp 1400w, ${u}${v}-${s}-2400.webp 2400w`;
  return `
<div class="uk-zoning" data-zoning data-view="aerial" data-zone="none">
  <div class="uk-zoning__stage">
    ${ZONE_VIEWS.map(([v, label], vi) => `<div class="uk-zoning__view" data-zoning-view="${v}"${vi ? " hidden" : ""}>
      <img class="uk-zoning__base" src="${src(v, "none")}" srcset="${set(v, "none")}" sizes="100vw" alt="White clay orthographic ${label.toLowerCase()} view of Urban Kaza in its Kazanchis block" loading="lazy" decoding="async">
      ${ZONE_KEYS.map((z) => `<img class="uk-zoning__layer" data-zoning-layer="${z}" data-src="${src(v, z)}" data-srcset="${set(v, z)}" sizes="100vw" alt="" aria-hidden="true">`).join("")}
      ${ZONE_KEYS.map((z) => { const [x, y] = ZONE_ANCHORS[v][z]; return `<span class="uk-zoning__pin" data-zoning-pin="${z}" style="--x:${x}%;--y:${y}%"><i></i><b>${esc(KAZA_FLOORS[ZONE_KEYS.indexOf(z)].t)}</b></span>`; }).join("")}
    </div>`).join("")}
    <div class="uk-zoning__views" role="group" aria-label="Model view">
      ${ZONE_VIEWS.map(([v, label], i) => `<button type="button" data-zoning-set-view="${v}" aria-pressed="${i === 0}">${label}</button>`).join("")}
    </div>
    <span class="uk-zoning__stamp">Urban Kaza · Zoning model · Orthographic</span>
  </div>
  <ol class="uk-zoning__list" aria-label="Urban Kaza floor functions">
    ${KAZA_FLOORS.map((floor, i) => `<li><button type="button" class="uk-zoning__zone" data-tower-trigger="${i}" data-building-level="${i}" data-zoning-key="${ZONE_KEYS[i]}" aria-current="false"><span class="uk-zoning__icon">${UK_FLOOR_ICONS[i]}</span><span><i>${esc(floor.f)}</i><b>${esc(floor.t)}</b></span></button></li>`).join("")}
  </ol>
</div>`;
};

const out = {};

/* ============================ PROJECTS ================================= */
const STAGES = [
  { key: "Newly Launched", note: "Selling now" },
  { key: "Under Construction", note: "On site" },
  { key: "Completed", note: "Delivered and occupied" },
];

out["projects.html"] = page({
  title: "Projects — Hill Bottom Properties",
  desc: "Hill Bottom Village in Ayat, Urban Kaza in Kazanchis, and the Commercial + Recreation Center. What is complete, what is building, and what opens next.",
  current: "projects.html",
  bodyClass: "projects-page",
  body: `
${pageHero(0, {
  title: "Our Projects",
  sub: "From Ayat to Kazanchis — each Hill Bottom project is a deliberate act of community-building and architectural conviction.",
  imgName: "urban-kaza-ext-v2",
  alt: "Urban Kaza exterior, Kazanchis",
  stations: [],
})}

${STAGES.map((stage) => {
  const list = PROJECTS.filter((p) => p.stage === stage.key);
  if (!list.length) return "";
  const dark = stage.key === "Newly Launched" || stage.key === "Completed";
  return `
<section class="ch ${dark ? "ch--abyss" : "ch--paper"} pad">
  <div class="wrap">
    ${list.map((p, i) => p.concept ? `
    <div class="rv" style="border-top:1px solid var(--hair-strong);padding-top:26px;display:grid;gap:14px;max-width:62ch">
      <span class="project-stage-chip">${esc(stage.note)}</span>
      <h3 class="d3">${esc(p.name)}</h3>
      <p class="mark">${esc(p.where)}</p>
      <p class="body">${esc(p.line)} Details are not published yet — register interest and we will contact you when this project is released.</p>
      ${alt(p.pct, p.status)}
      ${link("Register Interest", "contact.html")}
    </div>` : `
    <article class="proj ${i % 2 ? "proj--flip" : ""} rv">
      <div class="proj__media zoom">
        <a href="${p.href}" aria-label="${esc(p.name)} — ${esc(p.cta)}">${plate(p.img, p.alt, { ar: "ar", sizes: "(min-width:1000px) 55vw, 100vw" })}</a>
      </div>
      <div class="proj__body">
        <span class="project-stage-chip">${esc(stage.note)}</span>
        <h3 class="proj__name"><a href="${p.href}">${esc(p.name)}</a></h3>
        <p class="mark">${esc(p.where)}</p>
        <p class="lede" style="max-width:44ch">${p.blurb}</p>
        ${alt(p.pct, p.status)}
        ${link(p.cta, p.href)}
      </div>
    </article>`).join("")}
  </div>
</section>`;
}).join("")}

<section class="ch ch--paper-2 pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(30px,3.5vw,46px)">
      <h2 class="d2">Project Updates</h2>
      <div class="head__side"><p>Receive dated photo and video updates at every construction milestone. You can request additional walkthroughs via video call at any stage.</p></div>
    </div>
    <div class="grid grid--3">
      ${POSTS.slice(0, 3).map((p) => `
      <a class="story zoom rv" href="news/${p.slug}.html">
        ${plate(coverFor(p.slug), p.title, { ar: "ar", sizes: "(min-width:900px) 30vw, 100vw" })}
        <p class="mark">${fmtDate(p.date)} · ${esc(p.readTime)}</p>
        <h3 class="story__t">${esc(p.title)}</h3>
      </a>`).join("")}
    </div>
  </div>
</section>

${ctaBand(0, {
  title: "Buying from abroad?",
  body: "We have a dedicated team for diaspora buyers. Purchase remotely with full legal protection.",
  primary: "Contact Sales", primaryHref: "contact.html",
  secondary: "WhatsApp Us", secondaryHref: CO.waHref,
})}
`,
});

/* ============================ URBAN KAZA =============================== */
const kaza = PROJECTS.find((p) => p.key === "urban-kaza");
out["projects/urban-kaza.html"] = page({
  d: 1, current: "projects.html",
  bodyClass: "urban-kaza-page",
  title: "Urban Kaza, Kazanchis — Hill Bottom Properties",
  desc: "98 exclusive residential apartments in Kazanchis, near Addis Sport Park. Where sophistication meets community. From 135,000 ETB per sqm.",
  body: `

${ukIntro()}
<section class="hero uk-hero">
  <div class="hero__media"><img src="../assets/img/urban-kaza-dusk-v2.webp" alt="Urban Kaza at dusk in Kazanchis" fetchpriority="high"></div>
  <span class="hero__veil"></span>
  <div class="wrap hero__in">
    <div class="hero__stage">
      <div class="uk-hero__brand" role="img" aria-label="Urban Kaza — living, activated">
        <img src="../assets/img/urban-kaza-lockup-official.svg" alt="" aria-hidden="true">
      </div>
      <h1 class="d1">Urban Kaza</h1>
      <p class="hero__sub">Where sophistication meets community. 98 exclusive residential apartments. One address that changes everything.</p>
      <div class="btn-row uk-hero__actions">
        ${btn("Reserve a Unit", "contact.html", { kind: "btn--gold", d: 1 })}
        ${btn("Explore the Residences", "#floor-plans", { d: 1 })}
      </div>
    </div>
    <div class="uk-hero__facts">${facts([
      { k: "Location", v: "Kazanchis", n: "Near Addis Sport Park, Addis Ababa" },
      { k: "Residences", v: "98", n: "7 unit types, floors 2F–15F" },
      { k: "From", v: "135,000 ETB / sqm", n: "Flexible milestone-based plans" },
      { k: "Status", v: "In Progress", n: "Reserve now" },
    ], { d: 1 })}</div>
  </div>
</section>

<section class="ch ch--paper pad uk-manifesto">
  <div class="wrap">
    <div class="head head--split rv">
      <h2 class="d2">Addis has buildings. It doesn't have a pulse.</h2>
      <div class="head__side">
        <p>Urban Kaza is not another apartment block. It is a frequency shift. We took the deep, grounded soul of Ethiopia and fused it with a sharp, cosmopolitan edge. We call this Ethiopolitan Living.</p>
        <div class="btn-row uk-manifesto__actions">
          ${btn("Reserve a Unit", "contact.html", { kind: "btn--gold", d: 1 })}
          ${btn("Virtual Tour", "vr-tours.html", { d: 1, icon: "cube" })}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="ch ch--abyss uk-location">
  <div class="wrap uk-location__head">
    <div class="head head--split rv">
      <h2 class="d2">Kazanchis · Addis Sport Park</h2>
      <div class="head__side"><p>Urban Kaza sits steps from Addis Sport Park — the city's premier 6-hectare wellness and athletics complex — in the heart of the Kazanchis Diplomatic Corridor.</p></div>
    </div>
  </div>
  <div class="uk-map-stage rv" data-uk-map>
    <div class="uk-map-canvas">
      <iframe title="Google Maps view of Addis Sport Park and the Urban Kaza neighbourhood in Kazanchis" src="https://www.google.com/maps?q=Addis%20Sport%20Park%2C%20Addis%20Ababa&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <span class="uk-map-veil" aria-hidden="true"></span>
    <div class="uk-map-pin uk-map-pin--site is-active" data-map-pin="0"><i></i><span>Urban Kaza</span></div>
    <div class="uk-map-pin uk-map-pin--park" data-map-pin="1"><i></i><span>Addis Sport Park</span></div>
    <ol class="uk-landmarks" aria-label="Urban Kaza neighbourhood landmarks">
      ${KAZA_CONTEXT.map((c, i) => `<li style="--landmark-i:${i}"><button type="button" data-map-trigger="${i}" aria-current="${i === 0 ? "true" : "false"}"><span class="uk-landmark__icon">${UK_CONTEXT_ICONS[i]}</span><span class="uk-landmark__copy"><i>${String(i + 1).padStart(2, "0")}</i><b>${esc(c.t)}</b><small>${esc(c.d)}</small></span></button></li>`).join("")}
    </ol>
    <a class="uk-map-link" href="https://www.google.com/maps/search/?api=1&amp;query=Addis+Sport+Park+Addis+Ababa" target="_blank" rel="noreferrer">Open neighbourhood in Google Maps ${ICON.arrow}</a>
  </div>
</section>

<section class="ch ch--paper pad uk-floor-story" data-tower-scope>
  <div class="wrap">
    <div class="head head--split rv uk-floor-story__head">
      <h2 class="d2">Every floor has a function.</h2>
      <div class="head__side"><p>Every function has an intention. Follow the building from underground arrival to its rooftop social life.</p></div>
    </div>
    <div class="uk-floor-explorer rv">
      ${kazaTowerModel()}
    </div>
  </div>
</section>

<section class="ch ch--abyss pad uk-gallery">
  <div class="wrap">
    <div class="head rv" style="margin-bottom:clamp(30px,3.5vw,48px)">
      <h2 class="d2">Life at Urban Kaza</h2>
    </div>
  </div>
  <div class="uk-gallery-grid">${galleryGrid(UK_FEATURED_GALLERY, 1)}</div>
</section>

<section class="ch ch--paper pad uk-floorplans" id="floor-plans">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(28px,3vw,44px)">
      <h2 class="d2">Floor Plans</h2>
      <div class="head__side">
        <p>Seven complete residence configurations — one and two bedroom layouts across floors 2F–15F. Every published area is visible below.</p>
        <div style="margin-top:22px">${btn("Request Full Floor Plans", "contact.html", { d: 1, icon: "doc" })}</div>
      </div>
    </div>
    <div class="uk-unit-grid rv" aria-label="Urban Kaza residence configurations">
      ${KAZA_UNIT_SET.map((unit) => `<article class="uk-unit-card">
        <div class="uk-unit-card__top"><span>${esc(unit.id)}</span><strong>${esc(unit.type)}</strong></div>
        <p class="uk-unit-card__area"><b>${esc(unit.total)}</b><span>Total area</span></p>
        <dl>
          <div><dt>Net</dt><dd>${esc(unit.net)}</dd></div>
          <div><dt>Common</dt><dd>${esc(unit.common)}</dd></div>
          <div><dt>Parking</dt><dd>${esc(unit.parking)}</dd></div>
        </dl>
        <a href="../contact.html">Ask about this residence ${ICON.arrow}</a>
      </article>`).join("")}
    </div>
    <div class="uk-floorplans__note rv">
      ${KAZA_NOTE.map((n) => `<p style="font-size:.8125rem;line-height:1.6;color:var(--fg-2)">${esc(n)}</p>`).join("")}
    </div>
  </div>
</section>

<section class="ch ch--ink pad uk-commitment">
  <img class="uk-commitment__media" src="../assets/img/kaza-apt-05-1400.webp" alt="Urban Kaza apartment interior" loading="lazy" decoding="async">
  <span class="uk-commitment__veil" aria-hidden="true"></span>
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(30px,3.5vw,48px)">
      <h2 class="d2">Transparency. Timelines. Technical excellence.</h2>
      <div class="head__side"><p>We don't sell renders. We sell execution. Urban Kaza is backed by Hill Bottom Properties — a name synonymous with premium delivery and unmatched velocity in Ethiopia.</p></div>
    </div>
    ${facts([
      { k: "Price", v: "From 135,000 ETB/sqm", n: "Flexible payment plans. Diaspora-friendly process." },
      { k: "Availability", v: "98 residences", n: "Reserved for the few who recognise extraordinary." },
      { k: "WhatsApp", v: CO.wa, n: "Fastest response, 7 days a week.", href: "contact.html" },
      { k: "Sales gallery", v: "Kazanchis", n: "Diplomatic Corridor, Addis Ababa", href: "contact.html" },
    ], { d: 1 })}
    <div class="btn-row rv" style="margin-top:clamp(32px,4vw,52px)">
      ${btn("Secure Your Unit", "contact.html", { kind: "btn--gold", d: 1 })}
      <a class="btn uk-wa" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}WhatsApp Sales</a>
    </div>
  </div>
</section>
${lightbox()}
`,
});

/* ======================= HILL BOTTOM VILLAGE =========================== */
out["projects/hillbottom-village.html"] = page({
  d: 1, current: "projects.html",
  title: "Hill Bottom Village, Ayat — Hill Bottom Properties",
  desc: "Phase 1 complete and fully occupied. Block B delivers October 2026. Phase 3 opens January 2027. Ayat Square, Addis Ababa.",
  bodyClass: "village-page",
  body: `
${pageHero(1, {
  title: "Hill Bottom Village",
  sub: "Modern luxury with a touch of Ethiopian heritage. Gated, landscaped, and built to last.",
  imgName: "hillbottom-interior", alt: "Hill Bottom Village interior, Ayat", tall: true,
  stations: [],
})}

<section class="ch ch--paper pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(32px,4vw,52px)">
      <h2 class="d2">The Completed Community</h2>
      <div class="head__side"><p>Hill Bottom Village Phase 1 is complete and fully occupied. Residents enjoy a premium gated lifestyle in Ayat — one of Addis Ababa's most desirable neighbourhoods. Our Phase 1 delivery is the clearest proof of our commitment.</p></div>
    </div>
    <div class="proj rv">
      <div class="proj__media">${plate("hillbottom-interior", "Hill Bottom Village Phase 1 interior", { d: 1, ar: "ar", sizes: "(min-width:1000px) 55vw, 100vw" })}</div>
      <div class="proj__body">
        <h3 class="d3">Phase 1 Features</h3>
        ${projectFeatureGrid(VILLAGE_P1)}
        <p class="body">Prospective buyers are welcome to visit the completed Phase 1 and speak with current residents before committing to Phase 2.</p>
        ${link("Book a Visit", "contact.html", { d: 1 })}
      </div>
    </div>
  </div>
</section>

<section class="ch ch--abyss pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(32px,4vw,52px)">
      <h2 class="d2">Block B — In Progress</h2>
      <div class="head__side"><p>Block B builds on everything we learned from Block A — more units, enhanced amenities, and the same uncompromising quality. Expected completion: October 2026. Secure your unit now.</p></div>
    </div>
    <div class="proj proj--flip rv">
      <div class="proj__media">${plate("recreation-hub", "Hill Bottom Village Block B", { d: 1, ar: "ar", sizes: "(min-width:1000px) 55vw, 100vw" })}</div>
      <div class="proj__body">
        <h3 class="d3">What's New in Phase 2</h3>
        ${projectFeatureGrid(VILLAGE_P2)}
        ${alt(62, "Block B · October 2026")}
        ${link("Request Phase 2 Info", "contact.html", { d: 1 })}
      </div>
    </div>
  </div>
</section>

<section class="ch ch--paper pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(30px,3.5vw,48px)">
      <h2 class="d2">Commercial + Recreation Center</h2>
      <div class="head__side"><p>The final phase of Hill Bottom Village brings a world-class commercial and recreation destination to the community. Open to residents and the wider Ayat neighbourhood. Opening January 2027.</p></div>
    </div>
    <div class="proj rv">
      <div class="proj__media zoom"><a href="recreation-center.html">${plate("block-c-03", "Hill Bottom Commercial + Recreation Center plaza", { d: 1, ar: "ar", sizes: "(min-width:1000px) 55vw, 100vw" })}</a></div>
      <div class="proj__body">
        <p class="body">Phase 3 completes the Hill Bottom Village masterplan — creating a self-contained community with everything residents need within walking distance.</p>
        ${projectFeatureGrid(REC_FACILITIES.slice(0, 6), "project-feature-grid--phase3")}
        ${link("View Recreation Center", "./recreation-center.html", { d: 1 })}
      </div>
    </div>
  </div>
</section>

${ctaBand(1, {
  title: "Secure Your Phase 2 Unit",
  body: "With Phase 1 fully sold and occupied, Phase 2 availability is limited. Contact our sales team to discuss pricing, floor plans, and payment plans.",
  primary: "Request Phase 2 Info", primaryHref: "contact.html",
  secondary: "WhatsApp Sales", secondaryHref: CO.waHref,
})}
`,
});


const REC_ZONES = [
  { id: "arrival", name: "Arrival", shots: [["rec-reception-02", "Reception — The Body"], ["rec-reception-01", "Reception desk"]] },
  { id: "beauty", name: "Salon & Beauty", shots: [["rec-salon-02", "Hair salon — styling stations"], ["rec-salon-03", "Hair salon — wash lounge"], ["rec-salon-04", "Hair salon — styling suite"], ["rec-salon-05", "Hair salon — twin stations"], ["rec-salon-01", "Hair salon — styling station"], ["rec-nails-02", "Nail studio"], ["rec-nails-01", "Nail studio and pedicure lounge"]] },
  { id: "wellness", name: "Spa & Wellness", shots: [["rec-spa-01", "Spa — relaxation lounge"], ["rec-spa-02", "Spa — daybed lounge"], ["rec-spa-03", "Spa — treatment room"]] },
  { id: "fitness", name: "Fitness", shots: [["rec-gym-03", "Fitness studio — strength zone"], ["rec-gym-01", "Fitness studio — cardio floor"], ["rec-gym-02", "Fitness studio — treadmill run"]] },
  { id: "pool", name: "Pool Deck", shots: [["rec-pool", "Swimming pool deck"]] },
];
const recInside = (d) => {
  const u = "../".repeat(d) + "assets/img/";
  const total = REC_ZONES.reduce((n, z) => n + z.shots.length, 0);
  const [first] = REC_ZONES[0].shots;
  return `
<section class="ch ch--abyss pad rec-inside" id="inside">
  <div class="wrap">
    <div class="head head--split rv">
      <h2 class="d2">Step Inside</h2>
      <div class="head__side"><p>From the reception to the pool deck — ${total} interior renders of the beauty, wellness, and fitness floors.</p></div>
    </div>
    <div class="rec-zones rv" data-zones>
      <div class="rec-zones__tabs" role="tablist" aria-label="Interior zones">
        ${REC_ZONES.map((z, i) => `<button type="button" role="tab" id="tab-${z.id}" aria-controls="zone-${z.id}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><span>${esc(z.name)}</span><small>${String(z.shots.length).padStart(2, "0")}</small></button>`).join("")}
      </div>
      <button class="rec-stage" type="button" data-stage aria-label="View this render full screen">
        <img class="rec-stage__bg" src="${u}${first[0]}-800.webp" alt="" aria-hidden="true">
        <img class="rec-stage__img" src="${u}${first[0]}-1400.webp" alt="${esc(first[1])}" decoding="async">
        <span class="rec-stage__zoom" aria-hidden="true">${ICON.plus || ""}<span>View full screen</span></span>
      </button>
      <div class="rec-stage__bar">
        <p data-stage-cap>${esc(first[1])}</p>
        <span class="rec-stage__count" data-stage-count>01 / ${String(total).padStart(2, "0")}</span>
        <div class="rec-stage__nav">
          <button type="button" data-stage-step="-1" aria-label="Previous render">${ICON.left}</button>
          <button type="button" data-stage-step="1" aria-label="Next render">${ICON.right}</button>
        </div>
      </div>
      ${REC_ZONES.map((z) => `
      <div class="rec-zone" role="tabpanel" id="zone-${z.id}" aria-labelledby="tab-${z.id}">
        <h3 class="rec-zone__title">${esc(z.name)}</h3>
        <ul class="rec-strip">
          ${z.shots.map(([name, cap]) => {
            const v = IMAGES[name].find((x) => x.name === 1400);
            return `<li><a href="${u}${name}-1400.webp" data-full="${u}${name}-1400.webp" data-thumb="${u}${name}-800.webp" data-cap="${esc(cap)}" aria-label="Show ${esc(cap)}"><img src="${u}${name}-800.webp" alt="" width="${v.w}" height="${v.h}" loading="lazy" decoding="async"></a></li>`;
          }).join("")}
        </ul>
      </div>`).join("")}
    </div>
  </div>
</section>`;
};

/* ======================= RECREATION CENTER ============================= */
out["projects/recreation-center.html"] = page({
  d: 1, current: "projects.html",
  title: "Commercial + Recreation Center, Ayat — Hill Bottom Properties",
  desc: "Phase 3 of Hill Bottom Village. A world-class commercial and community destination at Ayat Square, opening January 2027.",
  bodyClass: "recreation-page",
  body: `
${pageHero(1, {
  title: "Commercial + Recreation",
  sub: "A world-class commercial and community destination at the heart of Ayat Square. Where the Hill Bottom community gathers, relaxes, and thrives.",
  imgName: "block-c-01", alt: "Hill Bottom Commercial and Recreation Center evening street render", tall: true,
  stations: [],
})}

<section class="ch ch--paper pad rec-intro">
  <div class="wrap rec-intro__layout">
    <figure class="rec-intro__media rv">
      <img src="../assets/img/block-c-06-1400.webp" srcset="../assets/img/block-c-06-800.webp 800w, ../assets/img/block-c-06-1400.webp 1400w" sizes="(min-width:900px) 52vw, 100vw" alt="Daytime architectural render of the landscaped recreation center" loading="lazy" decoding="async">
    </figure>
    <div class="rec-intro__copy rv">
      <p class="mark mark--accent">Phase 3 · Hill Bottom Village</p>
      <h2 class="d2">Where the Community Gathers</h2>
      <p class="body">Phase 3 completes the Hill Bottom Village masterplan with a considered mix of wellness, dining, retail, and recreation at Ayat Square.</p>
      <p class="body">Designed for the rhythm of a full day — from morning coffee and focused work to family time, dinner, and evening events.</p>
      <div class="rec-intro__facts">
        <span><b>11</b><small>Curated facilities</small></span>
        <span><b>Jan 2027</b><small>Target opening</small></span>
        <span><b>Ayat</b><small>Addis Ababa</small></span>
      </div>
    </div>
  </div>
</section>

${recInside(1)}

<section class="ch ch--abyss pad rec-amenities">
  <img class="rec-amenities__media" src="../assets/img/block-c-08-1400.webp" srcset="../assets/img/block-c-08-800.webp 800w, ../assets/img/block-c-08-1400.webp 1400w" sizes="100vw" alt="" loading="lazy" decoding="async">
  <span class="rec-amenities__veil" aria-hidden="true"></span>
  <div class="wrap">
    <div class="head head--split rv rec-amenities__head">
      <h2 class="d2">What's Inside</h2>
      <div class="head__side"><p>Eleven curated facilities covering wellness, dining, business, and leisure — all under one roof.</p></div>
    </div>
    <ol class="rec-amenity-grid rv">
      ${REC_FACILITIES.map((facility, i) => `<li class="rec-amenity-card" style="--amenity-i:${i}">
        <span class="rec-amenity-card__icon">${REC_ICONS[i]}</span>
        <span class="rec-amenity-card__number">${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(facility)}</h3>
      </li>`).join("")}
      <li class="rec-amenity-card rec-amenity-card--summary" style="--amenity-i:11">
        <span class="rec-amenity-card__icon">${FEATURE_ICONS[5]}</span>
        <span class="rec-amenity-card__number">11</span>
        <h3>Curated experiences. One destination.</h3>
      </li>
    </ol>
  </div>
</section>

<section class="ch ch--paper pad rec-gallery">
  <div class="wrap rec-gallery__head">
    <div class="head rv">
      <h2 class="d2">Architectural Renders</h2>
    </div>
  </div>
  <div class="rec-gallery__wall">${galleryGrid(REC_GALLERY, 1)}</div>
</section>

${ctaBand(1, {
  title: "Register your interest early",
  body: "Priority access for Hill Bottom Village residents and early registrants. Commercial leasing enquiries also welcome.",
  primary: "Register Interest", primaryHref: "contact.html",
  secondary: "WhatsApp Us", secondaryHref: CO.waHref,
})}
${lightbox()}
`,
});

/* ============================ VR TOURS ================================= */
out["vr-tours.html"] = page({
  current: "vr-tours.html",
  title: "VR Tours — Hill Bottom Properties",
  desc: "Explore Urban Kaza and Hill Bottom Village in full 360°. Virtual tours for buyers in Addis Ababa and the diaspora worldwide.",
  body: `
${pageHero(0, {
  title: "Virtual Tours",
  sub: "Explore Urban Kaza and Hill Bottom Village from the comfort of your screen. Walk through every floor, amenity, and living space in full 360°.",
  imgName: "kaza-rooftop", alt: "Urban Kaza rooftop terrace",
  stations: [
    { k: "Urban Kaza", v: "Kazanchis", n: "In progress · 98 residences", href: "projects/urban-kaza.html" },
    { k: "Hill Bottom Village", v: "Ayat", n: "Block A complete and occupied", href: "projects/hillbottom-village.html" },
    { k: "Format", v: "Full 360°", n: "Desktop, mobile, and headset" },
    { k: "Live walkthrough", v: "On request", n: "Video call with a sales agent", href: "contact.html" },
  ],
})}

<section class="ch ch--paper pad">
  <div class="wrap">
    ${VR_TOURS.map((t, i) => `
    <article class="proj ${i % 2 ? "proj--flip" : ""} rv" ${i ? 'style="margin-top:clamp(64px,8vw,120px)"' : ""}>
      <div class="proj__media">
        <div class="plate plate--ar">
          ${img(t.img, `${t.name} virtual tour preview`, { sizes: "(min-width:1000px) 55vw, 100vw" })}
          <span class="reg"></span>
        </div>
      </div>
      <div class="proj__body">
        <h2 class="proj__name">${esc(t.name)}</h2>
        <p class="mark">${esc(t.where)} · ${esc(t.status)}</p>
        <p class="lede" style="max-width:44ch">${esc(t.d)}</p>
        <div class="btn-row">
          ${btn("Book a Live Walkthrough", "contact.html", { kind: "btn--solid" })}
          <a class="btn" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}Ask a Question</a>
        </div>
      </div>
    </article>`).join("")}
  </div>
</section>

${ctaBand(0, {
  title: "Ready to make it yours?",
  body: "Speak with our sales team to reserve your unit, ask questions, or arrange an in-person site visit.",
  primary: "Book a Site Visit", primaryHref: "contact.html",
  secondary: "WhatsApp Us", secondaryHref: CO.waHref,
})}
`,
});

/* ============================== ABOUT ================================== */
out["about.html"] = page({
  current: "about.html",
  title: "About Us — Hill Bottom Properties",
  desc: "A premium Ethiopian real estate developer committed to transparency, timelines, and technical excellence — since day one.",
  bodyClass: "about-page",
  body: `
${pageHero(0, {
  title: "Who We Are",
  sub: "A premium Ethiopian real estate developer committed to transparency, timelines, and technical excellence — since day one.",
  imgName: "hillbottom-aerial-hero", alt: "Aerial rendering of Hill Bottom developments in Addis Ababa",
  stations: [
    { k: "Delivered", v: "Block A, Ayat", n: "Complete and fully occupied" },
    { k: "In construction", v: "2 projects", n: "Block B · Phase 3" },
    { k: "Now selling", v: "Urban Kaza", n: "98 residences, Kazanchis" },
    { k: "Brand promise", v: CO.promise, n: "" },
  ],
})}

<section class="ch ch--abyss pad about-community">
  <img class="about-community__media" src="assets/img/about-residents-lifestyle.webp" alt="Ethiopian residents sharing coffee in a modern Hill Bottom apartment" loading="lazy" decoding="async">
  <span class="about-community__veil" aria-hidden="true"></span>
  <div class="wrap">
    <div class="about-community__head rv">
      <h2 class="d2">Building more than buildings — building community.</h2>
      <p class="about-community__tagline">We make dream lifestyles a reality.</p>
    </div>
    <div class="about-community__copy rv">
      <p class="body">Hill Bottom Properties was founded on a simple premise: Ethiopia deserves world-class real estate delivered with absolute integrity. We saw a gap between aspiration and reality in the Ethiopian property market, and we set out to close it.</p>
      <p class="body">Our first completed project — Hill Bottom Village in Ayat — became a proof of concept. Buyers watched their homes rise, received progress updates at every milestone, and received their keys on time. We are now applying the same standard to Urban Kaza in the Kazanchis Diplomatic Corridor.</p>
    </div>
  </div>
</section>

<section class="ch ch--abyss pad about-features">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(36px,4vw,60px)">
      <h2 class="d2">What We Stand For</h2>
      <div class="head__side"><p>We understand that for a purchase of this magnitude, trust is not requested — it is earned. Here is the evidence.</p></div>
    </div>
    ${featureGrid(VALUES, FEATURE_ICONS, "feature-grid--dark")}
  </div>
</section>

<section class="ch ch--paper pad about-features">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(36px,4vw,60px)">
      <h2 class="d2">Why Hillbottom?</h2>
      <div class="head__side"><p>At Hill Bottom, we blend luxury with connection, offering vibrant social spaces, state-of-the-art health facilities, and lush gardens for an unparalleled lifestyle.</p></div>
    </div>
    ${featureGrid(ABOUT_PILLARS, FEATURE_ICONS)}
  </div>
</section>

<section class="ch ch--paper-2 pad about-features">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(32px,4vw,52px)">
      <h2 class="d2">How It Works</h2>
      <div class="head__side"><p>From first inquiry to key handover — a clear, transparent process designed to reduce uncertainty and build trust at every stage.</p></div>
    </div>
    ${featureGrid(PROCESS, FEATURE_ICONS)}
  </div>
</section>

<section class="ch ch--abyss pad about-cta">
  <img class="about-cta__media" src="assets/img/feedback-community.webp" alt="Hill Bottom residential community" loading="lazy" decoding="async">
  <span class="about-cta__veil" aria-hidden="true"></span>
  <div class="wrap about-cta__content">
    <div class="head head--split rv">
      <h2 class="d2">Want to learn more?</h2>
      <div class="head__side">
        <p>Talk to our team about available units, payment plans, and the Hill Bottom vision.</p>
        <div class="btn-row" style="margin-top:28px">
          ${btn("Get In Touch", "contact.html", { kind: "btn--gold" })}
          ${btn("Our Projects", "projects.html")}
        </div>
      </div>
    </div>
  </div>
</section>
`,
});

/* =============================== TEAM ================================== */
out["team.html"] = page({
  current: "team.html",
  title: "Our Team — Hill Bottom Properties",
  desc: "The people behind Hill Bottom Properties: leadership, design and construction, and client relations for local and diaspora buyers.",
  body: `
${pageHero(0, {
  title: "Our Team",
  sub: "Experienced real estate professionals with roots in Ethiopia and a global perspective.",
  imgName: "kaza-members-01", alt: "Members lounge, Urban Kaza",
  stations: [
    { k: "Leadership", v: "Executive Team", n: "Roots in Ethiopia, global perspective" },
    { k: "Delivery", v: "Technical Team", n: "Architects and engineers" },
    { k: "Sales", v: "Client Relations", n: "Ethiopia, Europe, North America" },
    { k: "Careers", v: "Job Portal", n: "Openings listed below", href: "team.html#careers" },
  ],
})}

<section class="ch ch--abyss pad-s" id="ceo" style="text-align:center">
  <div class="wrap" style="padding-block:clamp(60px,9vw,130px)">
    <p class="d2 rv" style="font-weight:200;max-width:20ch;margin-inline:auto">&ldquo;We make dream lifestyles a reality.&rdquo;</p>
    <p class="mark mark--accent rv" style="margin-top:32px">Hill Bottom Properties</p>
  </div>
</section>

<section class="ch ch--paper pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(36px,4vw,60px)">
      <h2 class="d2">Our Teams</h2>
      <div class="head__side"><p>Three groups, one standard. Every buyer deals with named people, not a queue.</p></div>
    </div>
    <div class="grid grid--3">
      ${TEAMS.map((t) => `
      <div class="story rv">
        <p class="mark mark--accent">${esc(t.role)}</p>
        <h3 class="d4">${esc(t.t)}</h3>
        <p class="story__d">${esc(t.d)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>

<section class="ch ch--paper pad" id="careers">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(30px,3.5vw,48px)">
      <h2 class="d2">Job Portal</h2>
      <div class="head__side"><p>Open roles at Hill Bottom Properties across construction, sales, and client relations.</p></div>
    </div>
    <div class="rv" style="display:grid;gap:26px;max-width:56ch">
      <p class="body">We are always interested in hearing from architects, engineers, site managers and sales professionals who care about delivery as much as we do.</p>
      <div>${btn("Send an open application", `mailto:${CO.email}`, { kind: "btn--gold" })}</div>
    </div>
    </div>
  </div>
</section>

${ctaBand(0, {
  title: "Talk to a person, not a form.",
  body: "Our sales team answers on WhatsApp seven days a week, and by phone Monday to Saturday.",
  primary: "Contact Us", primaryHref: "contact.html",
  secondary: "WhatsApp Us", secondaryHref: CO.waHref,
})}
`,
});

/* ================================ NEWS ================================= */
out["news.html"] = page({
  current: "news.html",
  bodyClass: "news-page",
  title: "News & Stories — Hill Bottom Properties",
  desc: "Expert guides, investment analysis, and market insights — written for buyers, investors, and the Ethiopian diaspora.",
  body: `
${pageHero(0, {
  title: "News & Stories",
  sub: "Expert guides, investment analysis, and market insights — written for buyers, investors, and the Ethiopian diaspora.",
  imgName: "kaza-cafe-01", alt: "Urban Kaza café and reception",
})}

<section class="ch ch--paper pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(30px,3.5vw,48px)">
      <h2 class="d2">Company News</h2>
      <div class="head__side"><p>Guides, analysis, and project milestones from the Hill Bottom team.</p></div>
    </div>
    <div class="grid grid--3">
      ${POSTS.slice().sort((a, b) => b.date.localeCompare(a.date)).map((p) => `
      <a class="story zoom rv" href="news/${p.slug}.html">
        ${plate(coverFor(p.slug), p.title, { ar: "ar", sizes: "(min-width:900px) 30vw, 100vw" })}
        <p class="mark">${fmtDate(p.date)} · ${esc(p.readTime)}</p>
        <h3 class="story__t">${esc(p.title)}</h3>
        <p class="story__d">${esc(p.excerpt)}</p>
      </a>`).join("")}
    </div>
  </div>
</section>

${ctaBand(0, {
  title: "Ready to take the next step?",
  body: "Our sales team can walk you through pricing, floor plans, and the full buying process — in your timezone.",
  primary: "Explore Projects", primaryHref: "projects.html",
  secondary: "Contact Sales", secondaryHref: "contact.html",
  tone: "ch--paper-2",
})}
`,
});

/* ---- article pages ---- */
const mdish = (content) => content.split(/\n{2,}/).map((para) => {
  const t = para.trim();
  if (!t) return "";
  const isHead = t.length < 110 && /[.?!]$/.test(t) === false ? false : false;
  // Source uses short standalone sentences as sub-headings; treat a short
  // paragraph that ends in a period and is under 90 chars as a sub-heading.
  if (t.length < 90 && !t.includes(". ") && /[.?]$/.test(t)) return `<h2 class="d3">${esc(t.replace(/[.]$/, ""))}</h2>`;
  return `<p class="body" style="max-width:none">${esc(t)}</p>`;
}).join("");

for (const p of POSTS) {
  const sorted = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
  const others = sorted.filter((o) => o.slug !== p.slug).slice(0, 3);
  const articleNumber = String(sorted.findIndex((o) => o.slug === p.slug) + 1).padStart(2, "0");
  out[`news/${p.slug}.html`] = page({
    d: 1, current: "news.html",
    title: `${p.title} — Hill Bottom Properties`,
    desc: p.excerpt,
    bodyClass: "article-page",
    body: `
${pageHero(1, {
  title: p.title, sub: esc(p.excerpt), imgName: coverFor(p.slug), alt: p.title,
  stations: [],
})}
<section class="ch ch--paper pad article-reading">
  <div class="wrap article-layout">
    <aside class="article-rail rv">
      <span class="article-rail__number">${articleNumber}</span>
      <p class="mark mark--accent">Hill Bottom Insights</p>
      <dl>
        <div><dt>Published</dt><dd>${fmtDate(p.date)}</dd></div>
        <div><dt>Reading time</dt><dd>${esc(p.readTime)}</dd></div>
      </dl>
      <div class="article-rail__topics">
        <span>Topics</span>
        <div>${p.tags.map((tag) => `<i>${esc(tag)}</i>`).join("")}</div>
      </div>
      ${link("All Insights", "news.html", { d: 1 })}
    </aside>
    <article class="prose article-prose rv">
    ${["roi-of-buying-in-addis","how-to-buy-real-estate-in-ethiopia","how-does-real-estate-in-ethiopia-really-work","how-reliable-are-real-estates-in-ethiopia"].includes(p.slug) ? `
    <aside class="article-notice rv">
      <p><b>Legal and financial review pending.</b> This article discusses ownership, payment mechanics or investment returns. Figures and legal statements have not yet been reviewed by a qualified Ethiopian attorney, and are published here as general information only — not individual legal or investment advice.</p>
      <dl>
        <div><dt>Last legally reviewed</dt><dd>Not yet reviewed</dd></div>
        <div><dt>Reviewed by</dt><dd>To be appointed</dd></div>
        <div><dt>Applicable law</dt><dd>Proclamation No. 1357 / Ministry of Justice</dd></div>
      </dl>
    </aside>` : ""}
    ${mdish(p.content)}
    <div class="article-prose__end">
      <span>Continue exploring</span>
      ${link("All Insights", "news.html", { d: 1 })}
    </div>
    </article>
  </div>
</section>

<section class="ch ch--paper-2 pad">
  <div class="wrap">
    <h2 class="d2 rv" style="margin-bottom:clamp(30px,3.5vw,46px)">More Insights</h2>
    <div class="grid grid--3">
      ${others.map((o) => `
      <a class="story zoom rv" href="${o.slug}.html">
        ${plate(coverFor(o.slug), o.title, { d: 1, ar: "ar", sizes: "(min-width:900px) 30vw, 100vw" })}
        <p class="mark">${fmtDate(o.date)} · ${esc(o.readTime)}</p>
        <h3 class="story__t">${esc(o.title)}</h3>
      </a>`).join("")}
    </div>
  </div>
</section>

${ctaBand(1, {
  title: "Ready to take the next step?",
  body: "Our sales team can walk you through pricing, floor plans, and the full buying process — in your timezone.",
  primary: "Contact Sales", primaryHref: "contact.html",
  secondary: "Explore Projects", secondaryHref: "projects.html",
})}
`,
  });
}

/* ============================== CONTACT ================================ */
out["contact.html"] = page({
  current: "contact.html",
  title: "Contact — Hill Bottom Properties",
  desc: "Speak to the Hill Bottom sales team. WhatsApp, direct line, short code 9508, or book a visit to the Ayat and Kazanchis sales offices.",
  bodyClass: "contact-page",
  head: `<link rel="stylesheet" href="assets/vendor/leaflet.css">`,
  scripts: `<script src="assets/vendor/leaflet.js" defer></script>`,
  body: `
${pageHero(0, {
  title: "Get In Touch",
  sub: "Whether you're local or abroad, we're ready to help you find your perfect unit. Fastest response via WhatsApp.",
  imgName: "kaza-cafe-02", alt: "Urban Kaza reception lounge",
  stations: [],
})}

<section class="ch ch--abyss pad contact-sales">
  <div class="wrap contact-sales__layout rv">
    <div class="contact-sales__intro">
      <p class="mark mark--accent">Direct access</p>
      <h2 class="d2">WhatsApp Sales Team</h2>
      <p>Fastest response for international and diaspora inquiries. Our team responds within hours, seven days a week.</p>
      <div class="btn-row">
        <a class="btn btn--gold" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}Message on WhatsApp</a>
        <a class="btn" href="${CO.telHref}">${ICON.phone}Call Sales</a>
      </div>
    </div>
    <div class="contact-card-grid">
      ${[
        { i: "wa", t: "WhatsApp", v: CO.wa, h: CO.waHref, n: "Fastest for international inquiries" },
        { i: "phone", t: "Direct Line", v: CO.tel, h: CO.telHref, n: `Short number: ${CO.short}` },
        { i: "mail", t: "Email", v: CO.email, h: `mailto:${CO.email}`, n: "General and sales inquiries" },
        { i: "clock", t: "Office Hours", v: "Mon–Sat", h: "", n: "9:00 AM to 6:00 PM EAT" },
      ].map((c) => `
      <article class="contact-card">
        <span class="contact-card__icon">${ICON[c.i]}</span>
        <p class="mark">${esc(c.t)}</p>
        <p class="contact-card__value">${c.h ? `<a href="${c.h}"${c.h.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${esc(c.v)}</a>` : esc(c.v)}</p>
        <p class="contact-card__note">${esc(c.n)}</p>
      </article>`).join("")}
    </div>
  </div>
</section>

<section class="ch ch--paper pad contact-map-section">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(36px,4vw,56px)">
      <h2 class="d2">Where to Find Us</h2>
      <div class="head__side"><p>Select a location to move the live map directly to Hill Bottom Village in Ayat or Urban Kaza in Kazanchis.</p></div>
    </div>
    <div class="contact-map rv" data-contact-map>
      <div class="contact-map__canvas" data-contact-map-canvas role="region" aria-label="Interactive map showing Hill Bottom locations in Addis Ababa">
        <span class="contact-map__grade" aria-hidden="true"></span>
        <div class="contact-map__label">
          <small>Selected location</small>
          <strong data-contact-map-title>Hill Bottom Village</strong>
        </div>
      </div>
      <div class="contact-map__locations" aria-label="Choose a Hill Bottom location">
        ${CONTACT_LOCATIONS.map((location, i) => `<button type="button" class="contact-location ${i === 0 ? "is-active" : ""}" data-contact-location data-location-lat="${location.lat}" data-location-lng="${location.lng}" data-location-title="${esc(location.name)}" aria-pressed="${i === 0 ? "true" : "false"}">
          <span class="contact-location__icon">${UK_CONTEXT_ICONS[i ? 2 : 0]}</span>
          <span class="contact-location__copy"><i>0${i + 1}</i><b>${esc(location.name)}</b><small>${esc(location.role)}</small><em>${esc(location.address)}</em></span>
        </button>`).join("")}
      </div>
    </div>
  </div>
</section>

<section class="ch ch--ink pad" id="book">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(36px,4vw,56px)">
      <h2 class="d2">Book a Visit</h2>
      <div class="head__side">
        <p>Fill out the form to request a callback, video consultation, or site visit. We respond within 24 hours on business days.</p>
      </div>
    </div>
    ${inquiryForm(0, "book-form")}
  </div>
</section>
`,
});

export default out;
