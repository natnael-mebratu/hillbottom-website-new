import { hbIntro } from "./intros.mjs";
import fs from "fs";
import { CO, NAV, NAV_SECONDARY, CTA } from "./data.mjs";

const IMAGES = JSON.parse(fs.readFileSync(new URL("./images.json", import.meta.url), "utf8"));
export const HAS_HERO_VIDEO = fs.existsSync(new URL("../assets/video/hillbottom-hero.mp4", import.meta.url));

export const esc = (s) => String(s).replace(/&(?![a-z#0-9]+;)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const up = (depth) => "../".repeat(depth);
/* Internal hrefs are written relative to the site root and get the page's depth
   prefix. An href starting with ./ or ../ is a deliberate sibling link, kept. */
const rel = (d, href) => (/^(https?:|tel:|mailto:|#|\.\/|\.\.\/)/.test(href) ? href : up(d) + href);

/* ---- icons: authored SVG, one stroke weight, one 24-unit grid -------- */
const S = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const ICON = {
  arrow: S(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  arrowUR: S(`<path d="M7 17 17 7M8 7h9v9"/>`),
  left: S(`<path d="M19 12H5M11 18l-6-6 6-6"/>`),
  right: S(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  close: S(`<path d="M6 6l12 12M18 6L6 18"/>`),
  chevronDown: S(`<path d="M6 9l6 6 6-6"/>`),
  phone: S(`<path d="M15.6 13.4a9.2 9.2 0 0 1-5-5l1.7-1.6a1 1 0 0 0 .2-1.1L11.1 2.6a1 1 0 0 0-1.1-.6l-3 .6A1 1 0 0 0 6.2 3.7 17.6 17.6 0 0 0 20.3 17.8a1 1 0 0 0 1.1-.8l.6-3a1 1 0 0 0-.6-1.1l-3.1-1.4a1 1 0 0 0-1.1.2z"/>`),
  mail: S(`<rect x="2.5" y="5" width="19" height="14" rx="1.6"/><path d="m3 6.5 9 6 9-6"/>`),
  pin: S(`<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>`),
  clock: S(`<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/>`),
  plus: S(`<path d="M12 5v14M5 12h14"/>`),
  check: S(`<path d="m4 12.5 5.2 5.2L20 7"/>`),
  play: S(`<circle cx="12" cy="12" r="9"/><path d="M10 8.6 16 12l-6 3.4z"/>`),
  cube: S(`<path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z"/><path d="M3.5 7 12 11.3 20.5 7M12 11.3v9.9"/>`),
  doc: S(`<path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"/><path d="M14 3v4.5h4.5M8.5 13h7M8.5 16.5h4.5"/>`),
  chat: S(`<path d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.4 3.3a.6.6 0 0 1-1-.48V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z"/><path d="M8 10h8M8 13h5"/>`),
  wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.14-.17.19-.3.29-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.28.18-1.41-.08-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.45 6.6 2.02 12.05 2.02c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.49-8.41z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0M3.2 21.5h3.5V8.9H3.2zM13.1 8.65c-1.82 0-2.72.97-3.19 1.66V8.9H6.44c.05.94 0 12.6 0 12.6h3.47v-7.04c0-.31.02-.62.11-.85.25-.62.82-1.27 1.78-1.27 1.26 0 1.76.95 1.76 2.35v6.81h3.47v-7.21c0-3.2-1.71-4.69-4-4.69z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.1 21.5v-8.3h2.8l.42-3.24H14.1V7.9c0-.94.26-1.58 1.6-1.58h1.72V3.42c-.3-.04-1.32-.13-2.51-.13-2.49 0-4.19 1.52-4.19 4.3v2.4H7.9v3.24h2.82v8.3z"/></svg>`,
};

export const MARK = `<svg class="lockup__mark" viewBox="0 0 117.6 117.6" fill="currentColor" aria-hidden="true"><polygon points="117.6 0 117.6 61.4 112.8 57.8 108.8 61.8 84.6 43.7 81 47.3 58.8 30.7 36.5 47.3 32.9 43.7 8.7 61.8 4.7 57.8 0 61.4 0 0 117.6 0"/><polygon points="113.3 68.2 117.6 70.7 117.6 117.6 0 117.6 0 70.8 4.3 68.4 8.3 71.4 32.5 56.2 36.1 62.4 58.8 43.9 81.5 62.4 85.1 56.2 109.3 71.4 113.3 68.2"/></svg>`;

/* ---- primitives ------------------------------------------------------- */
export const img = (name, alt, { d = 0, cls = "", sizes = "100vw", big = false, eager = false } = {}) => {
  const variants = IMAGES[name];
  if (!variants) throw new Error(`unknown image "${name}" — run node _build/images.mjs`);
  const b = `${up(d)}assets/img/${name}`;
  const pick = big ? variants : variants.filter((v) => v.name <= 1400);
  const set = pick.map((v) => `${b}-${v.name}.webp ${v.w}w`).join(", ");
  const fallback = (pick.find((v) => v.name === 1400) || pick[pick.length - 1]).name;
  return `<img src="${b}-${fallback}.webp" srcset="${set}" sizes="${sizes}" alt="${esc(alt)}" class="${cls}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
};

export const plate = (name, alt, { d = 0, ar = "ar", sizes = "100vw", big = false, eager = false, par = false } = {}) =>
  `<div class="plate plate--${ar}${par ? " par" : ""}">${img(name, alt, { d, sizes, big, eager })}</div>`;

/* THE RIDGE — the logo's own notched horizon, cutting one chapter into the
   next. At most three appearances per page. */
export const ridge = (edge = "bottom", fill = "") =>
  `<span class="ridge ridge--${edge}"${fill ? ` style="--ridge-fill:${fill}"` : ""}></span>`;

/* A row of facts. Same information the old dimension line carried, without
   the hairline-and-tick texture that reads as a generated default. */
export const facts = (items, { d = 0, cls = "" } = {}) => `
<div class="facts ${cls}" style="--n:${items.length}">
  ${items.map((s) => {
    const inner = `<span class="k">${esc(s.k)}</span><span class="v">${esc(s.v)}</span>${s.n ? `<span class="n">${esc(s.n)}</span>` : ""}`;
    return s.href ? `<a class="fact" href="${rel(d, s.href)}">${inner}</a>` : `<div class="fact">${inner}</div>`;
  }).join("")}
</div>`;

/* The ridge as an altitude gauge — fills toward the delivery state. */
export const alt = (pct, label, note = "") => `
<div class="alt">
  <div class="alt__bar"><span class="alt__fill" style="--pct:${pct}%"></span></div>
  <p class="alt__label"><b>${esc(label)}</b>${note ? `<span>${esc(note)}</span>` : ""}</p>
</div>`;

export const btn = (label, href, { kind = "", d = 0, icon = "", ext = false, attrs = "" } = {}) => {
  const h = rel(d, href);
  return `<a class="btn ${kind}" href="${h}"${ext ? ' target="_blank" rel="noreferrer"' : ""}${attrs}>${esc(label)}${icon ? ICON[icon] : ""}</a>`;
};

export const link = (label, href, { d = 0, ext = false } = {}) => {
  const h = rel(d, href);
  return `<a class="link" href="${h}"${ext ? ' target="_blank" rel="noreferrer"' : ""}>${esc(label)}<span class="arw">${ICON.arrow}</span></a>`;
};

/* Urban Kaza unit selector (audit §18). Filters the published schedule by
   bedrooms and size. Availability and per-unit price are not published, so
   the card asks for them rather than stating them. */
export const unitSelector = (units, bands, d = 0) => `
<div class="units" data-units>
  <div class="units__filters">
    <fieldset class="units__group">
      <legend>Bedrooms</legend>
      <div class="units__chips">
        <label class="chip"><input type="radio" name="beds" value="" checked><span>All</span></label>
        <label class="chip"><input type="radio" name="beds" value="1"><span>1 Bedroom</span></label>
        <label class="chip"><input type="radio" name="beds" value="2"><span>2 Bedroom</span></label>
      </div>
    </fieldset>
    <fieldset class="units__group">
      <legend>Total area</legend>
      <div class="units__chips">
        <label class="chip"><input type="radio" name="band" value="" checked><span>All</span></label>
        ${bands.map((b) => `<label class="chip"><input type="radio" name="band" value="${b.key}"><span>${esc(b.label)}</span></label>`).join("")}
      </div>
    </fieldset>
  </div>
  <p class="units__count" data-units-count aria-live="polite"></p>
  <div class="units__grid">
    ${units.map((x) => `
    <article class="unit" data-beds="${x.beds}" data-band="${x.band}">
      <h3 class="unit__id">${esc(x.id)}</h3>
      <p class="unit__type">${esc(x.type)}</p>
      <dl class="unit__spec">
        <div><dt>Net</dt><dd>${esc(x.net)}</dd></div>
        <div><dt>Common</dt><dd>${esc(x.common)}</dd></div>
        <div><dt>Parking</dt><dd>${esc(x.parking)}</dd></div>
        <div><dt>Total</dt><dd><b>${esc(x.total)}</b></dd></div>
      </dl>
      <p class="unit__price">Request current price</p>
      <a class="unit__cta" href="${up(d)}contact.html">${esc(CTA.plan)}${ICON.arrow}</a>
    </article>`).join("")}
  </div>
  <p class="units__empty" data-units-empty hidden>No residence matches that combination. Clear a filter, or <a href="${up(d)}contact.html">ask our sales team</a> what is available.</p>
</div>`;

/* ---- chrome ------------------------------------------------------------ */
const lockup = (d) => `
<a class="lockup" href="${up(d)}index.html">
  ${MARK}
  <span class="lockup__type"><b>HILL BOTTOM</b><i>PROPERTIES</i></span>
</a>`;

export const header = (d, current) => `
<header class="hdr">
  <div class="wrap"><div class="hdr__in">
    ${lockup(d)}
    <nav class="nav" aria-label="Primary">
      ${NAV.map((n) => `<a href="${up(d)}${n.href}"${current === n.href ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`).join("")}
      <div class="nav__more" data-nav-more>
        <button type="button" class="nav__more-btn" aria-expanded="false" aria-haspopup="true" aria-controls="hb-nav-more-menu">More${ICON.chevronDown}</button>
        <div class="nav__more-menu" id="hb-nav-more-menu" role="menu">
          ${NAV_SECONDARY.map((n) => `<a role="menuitem" href="${up(d)}${n.href}"${current === n.href ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`).join("")}
        </div>
      </div>
    </nav>
    <div class="hdr__cta">
      <a class="btn btn--gold" href="${up(d)}contact.html">${CTA.project}</a>
    </div>
    <button class="burger" type="button" aria-expanded="false" aria-controls="hb-drawer" aria-label="Open menu"><i></i><i></i></button>
  </div></div>
</header>
<div class="drawer" id="hb-drawer" aria-hidden="true" inert>
  ${NAV.map((n) => `<a class="dl" href="${up(d)}${n.href}">${esc(n.label)}${n.note ? `<em>${esc(n.note)}</em>` : ""}</a>`).join("")}
  <p class="dl--more-label">More</p>
  ${NAV_SECONDARY.map((n) => `<a class="dl dl--sub" href="${up(d)}${n.href}">${esc(n.label)}</a>`).join("")}
  <div class="btn-row">
    <a class="btn" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}WhatsApp</a>
    <a class="btn btn--gold" href="${up(d)}contact.html">${CTA.project}</a>
  </div>
</div>`;

export const rail = () => `
<div class="rail">
  <a href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}<b>WhatsApp ${esc(CO.wa)}</b></a>
  <a href="${CO.telHref}">${ICON.phone}<b>Call ${esc(CO.tel)}</b></a>
  <a href="${CO.shortHref}">${ICON.doc}<b>Short code ${esc(CO.short)}</b></a>
</div>
<nav class="bar" aria-label="Quick contact">
  <a href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}WhatsApp</a>
  <a href="${CO.telHref}">${ICON.phone}Call</a>
</nav>`;

/* ---- chat widget -------------------------------------------------------
   Real canned-question widget (ported from the old React ChatWidget —
   same 5 questions), not a WhatsApp redirect dressed up as one. The
   rail()'s "Live Chat" pill opens this via data-live-chat/data-chat-toggle
   in hb.js instead of navigating. */
const CHAT_QUESTIONS = [
  {
    q: "Where are your projects located?",
    a: "Our developments are in Ayat Square and Kazanchis, Addis Ababa. Each project page has the exact location and nearby landmarks.",
    link: { href: "projects.html", label: "View all projects" },
  },
  {
    q: "What units are still available?",
    a: "Availability varies by project and updates as units are reserved. Check a project's detail page for current unit types and availability, or message us directly for the latest.",
    link: { href: "projects.html", label: "See residences" },
  },
  {
    q: "Can I see real construction progress?",
    a: "Yes — our Construction Updates page has live, admin-updated status for every project, compared against the original delivery plan.",
    link: { href: "construction.html", label: "View construction updates" },
  },
  {
    q: "Can I take a virtual tour?",
    a: "Yes — explore Hill Bottom developments from wherever you are with our 360° virtual tour.",
    link: { href: "vr-tours.html", label: "Take the virtual tour" },
  },
  {
    q: "Can I check your projects?",
    a: "Browse every Hill Bottom development — completed, ongoing, under construction, and upcoming — in one place.",
    link: { href: "projects.html", label: "Check our projects" },
  },
];

export const chatWidget = (d = 0) => `
<div class="chatw" id="hb-chat">
  <button type="button" class="chatw__fab" data-chat-toggle aria-expanded="false" aria-controls="hb-chat-panel" aria-label="Open chat">
    <span class="chatw__fab-icon chatw__fab-icon--open">${ICON.chat}</span>
    <span class="chatw__fab-icon chatw__fab-icon--close">${ICON.close}</span>
  </button>
  <div class="chatw__panel" id="hb-chat-panel" role="dialog" aria-label="Hill Bottom chat" aria-hidden="true">
    <div class="chatw__head">
      <div><span class="mark">Hill Bottom</span><p>How can we help?</p></div>
      <button type="button" class="chatw__close" data-chat-close aria-label="Close chat">${ICON.close}</button>
    </div>
    <div class="chatw__body">
      <div class="chatw__list" data-chat-list>
        <p class="chatw__hint">Quick answers:</p>
        ${CHAT_QUESTIONS.map((item, i) => `<button type="button" class="chatw__q" data-chat-q="${i}">${esc(item.q)}</button>`).join("")}
      </div>
      ${CHAT_QUESTIONS.map((item, i) => `
      <div class="chatw__answer" data-chat-a="${i}" hidden>
        <button type="button" class="chatw__back" data-chat-back>${ICON.left}Back</button>
        <p class="chatw__q-echo">${esc(item.q)}</p>
        <p class="chatw__a-text">${esc(item.a)}</p>
        <a class="chatw__link" href="${rel(d, item.link.href)}">${esc(item.link.label)}${ICON.arrow}</a>
      </div>`).join("")}
    </div>
    <div class="chatw__foot">
      <p>Prefer to talk directly?</p>
      <a class="btn btn--gold" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}WhatsApp Us</a>
    </div>
  </div>
</div>`;

export const footer = (d) => `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div>
        ${lockup(d)}
        <p class="body" style="margin-top:24px;max-width:34ch">${esc(CO.line)} ${esc(CO.promise)}</p>
        <div class="social" style="margin-top:30px">
          ${CO.social.map((s) => `<a href="${s.href}" target="_blank" rel="noreferrer" aria-label="${esc(s.name)}">${ICON[s.icon]}</a>`).join("")}
        </div>
      </div>
      <div>
        <h3>Sales Office</h3>
        <ul class="ftr__links">
          ${CO.offices.map((o) => `<li><span><b style="color:#F6F8FB;font-weight:600">${esc(o.name)}</b><br>${o.lines.slice(1).map(esc).join("<br>")}</span></li>`).join("")}
          <li><span>${esc(CO.hours)}</span></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul class="ftr__links">
          <li><a href="mailto:${CO.email}">${esc(CO.email)}</a></li>
          <li><a href="${CO.telHref}">${esc(CO.tel)}</a></li>
          <li><a href="${CO.shortHref}">Short code ${esc(CO.short)}</a></li>
          <li><a href="${CO.waHref}" target="_blank" rel="noreferrer">WhatsApp ${esc(CO.wa)}</a></li>
        </ul>
      </div>
      <div>
        <h3>Quick Links</h3>
        <ul class="ftr__links">
          <li><a href="${up(d)}index.html">Home</a></li>
          ${NAV.map((n) => `<li><a href="${up(d)}${n.href}">${esc(n.label)}</a></li>`).join("")}
          ${NAV_SECONDARY.map((n) => `<li><a href="${up(d)}${n.href}">${esc(n.label)}</a></li>`).join("")}
        </ul>
      </div>
    </div>
    <div class="ftr__bot">
      <small>${esc(CO.copyright)}</small>
      <small>Addis Ababa, Ethiopia</small>
    </div>
  </div>
</footer>`;

export const welcome = (d, W) => `
<div class="scrim"></div>
<aside class="welcome" aria-labelledby="wel-t" aria-hidden="true" inert>
  <button class="welcome__x" type="button" data-wel-close aria-label="Dismiss">${ICON.close}</button>
  <h2 class="d3" id="wel-t">${esc(W.title)}</h2>
  <p>${esc(W.body)}</p>
  <div class="btn-row">
    <a class="btn btn--gold" href="${up(d)}${W.yesHref}" data-wel-close>${esc(W.yes)}</a>
    <button class="btn btn--light" type="button" data-wel-close>${esc(W.no)}</button>
  </div>
</aside>`;

export const lightbox = () => `
<div class="lb" role="dialog" aria-modal="true" aria-label="Image viewer" aria-hidden="true" inert>
  <button class="lb__x" type="button" data-lb-close aria-label="Close viewer">${ICON.close}</button>
  <figure class="lb__fig"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt="" width="1600" height="1200"><figcaption></figcaption></figure>
  <div class="lb__nav">
    <button type="button" data-lb-prev aria-label="Previous image">${ICON.left}</button>
    <button type="button" data-lb-next aria-label="Next image">${ICON.right}</button>
  </div>
</div>`;

/* ---- the direction contract, emitted into every page ------------------- */
export const CONTRACT = `<!--
IMPECCABLE DIRECTION CONTRACT — Hill Bottom Properties
THESIS: Elevation, made literal. The logo mark is a notched horizon, the name is a
  landform, Addis sits at 2,355m and the brand line is "Elevated Living" — so the
  ridge is the site's structure, not its decoration. Refuses the two generated
  defaults the first build fused: near-black-plus-one-accent, and the hairline
  broadsheet of rules, zero radius and dense columns.
OWN-WORLD: Deep #060B14 grounds and #F4F5F7 paper; Maastricht Blue #0D1B30 and Dark
  Tan #907B46 as brand law. Gold is LIGHT — edge gleam on glass — never a hairline.
  Glass on the functional layer only (nav, sheet, rail), never on content. Display is
  Montserrat 200/300 at scale; Bold appears twice a page. Imagery owns whole viewports.
STORY: A buyer who cannot visit sees what is finished, what is building, and when the
  rest lands — then reaches a human on WhatsApp in one tap from any scroll position.
FIRST VIEWPORT: Full-bleed film under a parallaxing ridge; the headline arrives word by
  word in Montserrat Light at 7rem; the portfolio reads as four facts across the foot.
  One gold action, in the header pill and at the end of the hero.
FORM: Chaptered cinematic editorial — pinned by the client's brief and confirmed answer,
  so no concept roll was dealt.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export const SITE_URL = "https://hillbottomproperties.com";

const ORG_JSONLD = () => `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": CO.name,
  "url": SITE_URL,
  "logo": `${SITE_URL}/assets/img/favicon.svg`,
  "image": `${SITE_URL}/assets/img/hero-hillbottom-1400.webp`,
  "description": "Luxury real estate developer in Addis Ababa, Ethiopia, serving buyers in Ethiopia and the Ethiopian diaspora.",
  "telephone": CO.tel,
  "email": CO.email,
  "areaServed": ["Ethiopia", "Ethiopian diaspora"],
  "address": CO.offices.map((o) => ({
    "@type": "PostalAddress",
    "streetAddress": o.lines[0],
    "addressLocality": o.lines[1],
    "addressCountry": "ET",
  })),
  "sameAs": CO.social.map((s) => s.href),
})}</script>`;

export const page = ({ title, desc, d = 0, current = "", body, bodyClass = "", head = "", scripts = "", path = "", image = "hero-hillbottom-1400" }) => {
  const canonical = `${SITE_URL}/${path}`;
  const ogImage = `${SITE_URL}/assets/img/${image}.webp`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#060B14">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:site_name" content="${esc(CO.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImage}">
${ORG_JSONLD()}
<link rel="icon" href="${up(d)}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${up(d)}assets/fonts/gs-SB2OEB6IKZPRR6JT4GFJ2TFT6HBB6AZN.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${up(d)}assets/css/hb.css">
<link rel="stylesheet" href="${up(d)}assets/css/editorial.css">
<link rel="stylesheet" href="${up(d)}assets/css/kaza.css">
<link rel="stylesheet" href="${up(d)}assets/css/premium-2026.css">
<link rel="stylesheet" href="${up(d)}assets/css/home-feedback.css">
<link rel="stylesheet" href="${up(d)}assets/css/site-unified.css">
<link rel="stylesheet" href="${up(d)}assets/css/refine-2026.css">
${head}
<script>try{var c=document.documentElement.classList,s=sessionStorage;if(s.getItem("hb-intro-v3"))c.add("hbi-seen");if(s.getItem("uk-intro-v4"))c.add("uki-seen");if(matchMedia("(prefers-reduced-motion: reduce)").matches)c.add("hbi-seen","uki-seen")}catch(e){}</script>
<noscript><style>.hbi,.uki{display:none!important}</style></noscript>
</head>
<body class="${bodyClass}">
${CONTRACT}
${bodyClass.includes("urban-kaza-page") ? "" : hbIntro(up(d))}
<a class="skip" href="#main">Skip to content</a>
${header(d, current)}
<main id="main">
${body}
</main>
${footer(d)}
${rail()}
${chatWidget(d)}
${scripts}
<script src="${up(d)}assets/js/hb.js" defer></script>
</body>
</html>`;
};
