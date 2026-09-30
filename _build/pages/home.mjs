import { CO, CTA, PROJECTS, PORTFOLIO_LINE, PILLARS, POSTS, TESTIMONIALS, VR_TOURS, WELCOME, CONSTRUCTION } from "../data.mjs";
import { page, facts, alt, ridge, plate, img, btn, link, welcome, esc, ICON, HAS_HERO_VIDEO } from "../ui.mjs";
import { inquiryForm, storyCard } from "./parts.mjs";

const featured = PROJECTS.filter((p) => !p.concept);
const universalIcon = (...paths) => `<svg class="uicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.map((d) => `<path pathLength="1" d="${d}"/>`).join("")}</svg>`;
const UI_ICON = {
  checkCircle: universalIcon("M21 12a9 9 0 1 1-4.08-7.54", "m9 11 3 3L22 4"),
  key: universalIcon("M15.5 7.5a4 4 0 1 1-5.66 5.66L3 20v1h4v-2h2v-2h2l1.16-1.16", "m16 6 2 2"),
  globe: universalIcon("M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z", "M3.6 9h16.8M3.6 15h16.8", "M12 3c2.3 2.45 3.5 5.45 3.5 9s-1.2 6.55-3.5 9c-2.3-2.45-3.5-5.45-3.5-9S9.7 5.45 12 3Z"),
  fileText: universalIcon("M6 3h8l4 4v14H6V3Z", "M14 3v5h5M9 13h6M9 17h6"),
  shieldCheck: universalIcon("M12 3 20 6v5c0 5.1-3.4 8.4-8 10-4.6-1.6-8-4.9-8-10V6l8-3Z", "m8.5 12 2.2 2.2 4.8-5"),
  building: universalIcon("M4 21V7l8-4v18M12 9h8v12M8 8v1M8 12v1M8 16v1M16 13v1M16 17v1M2 21h20"),
  mapPin: universalIcon("M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"),
  heart: universalIcon("M20.8 5.9c-1.9-2-5-2-6.9 0L12 7.8l-1.9-1.9a4.8 4.8 0 0 0-6.9 6.7L12 21l8.8-8.4a4.8 4.8 0 0 0 0-6.7Z"),
  trend: universalIcon("M4 17 10 11l4 4 6-8", "M15 7h5v5"),
  clock: universalIcon("M12 3a9 9 0 1 1-9 9 9 9 0 0 1 9-9Z", "M12 7v5l3 2"),
  calendar: universalIcon("M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z", "M8 2v4M16 2v4M3 10h18"),
};
const PILLAR_ICONS = [
  UI_ICON.shieldCheck,
  UI_ICON.building,
  UI_ICON.mapPin,
  UI_ICON.heart,
  UI_ICON.trend,
];
const STORY_ICON = `<span class="section-icon" aria-hidden="true">${UI_ICON.fileText}</span>`;
const PROJECT_MEDIA = ["block-c-10-1400.webp", "urban-kaza-dusk-v2.webp", "block-c-01-1400.webp"];
const PROJECT_STATUS_ICON = [
  UI_ICON.checkCircle,
  UI_ICON.clock,
  UI_ICON.calendar,
];
const DELIVERY_GALLERY = [
  ["urban-kaza-elevation-v2.webp", "Urban Kaza twin-pillar elevation at dusk"],
  ["urban-kaza-street-v2.webp", "Urban Kaza podium and street frontage"],
  ["urban-kaza-podium-v2.webp", "Urban Kaza signage above the entrance"],
  ["feedback-gallery-04.webp", "Urban Kaza tower at dusk"],
  ["urban-kaza-aerial-v2.webp", "Aerial view of Urban Kaza and its landscaped surroundings"],
  ["feedback-gallery-06.webp", "Urban Kaza apartment kitchen and dining"],
];
const deliveryFrames = (hidden = false) => `<div class="delivery-marquee__group"${hidden ? ' aria-hidden="true"' : ''}>${DELIVERY_GALLERY.map(([src, altText]) => `<figure><img src="assets/img/${src}" alt="${hidden ? "" : altText}" loading="lazy" decoding="async"></figure>`).join("")}</div>`;
const testimonialSlides = (hidden = false) => `<div class="testimonial-marquee__group"${hidden ? ' aria-hidden="true"' : ''}>${TESTIMONIALS.map((t) => `
  <figure class="testimonial-card">
    <span class="quote-mark" aria-hidden="true">&ldquo;</span>
    <blockquote${t.am ? ' lang="am"' : ""}><span${t.am ? ' class="am"' : ""}>${esc(t.q)}</span></blockquote>
    <figcaption>${esc(t.by)} · ${esc(t.at)}</figcaption>
  </figure>`).join("")}</div>`;

const projectChapter = (p, i) => `
<article class="proj ${i % 2 ? "proj--flip" : ""} rv">
  <div class="proj__media zoom">
    <a href="${p.href}" aria-label="${esc(p.name)} — ${esc(p.cta)}">
      <div class="plate plate--ar"><img src="assets/img/${PROJECT_MEDIA[i]}" alt="${esc(p.alt)}"${i ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}></div>
    </a>
  </div>
  <div class="proj__body">
    <p class="mark mark--accent">${esc(p.where)}</p>
    <h3 class="proj__name"><a href="${p.href}">${esc(p.name)}</a></h3>
    <p class="lede" style="max-width:40ch">${p.blurb}</p>
    <div class="project-status">
      <span class="project-status__icon">${PROJECT_STATUS_ICON[i]}</span>
      <p><b>${esc(p.status)}</b>${p.price ? `<span>From ${esc(p.price)}</span>` : ""}</p>
    </div>
    <div class="project-actions">
      ${link(p.cta, p.href)}
      ${CO.offices.find((office) => office.name === p.name) ? link("View Location", CO.offices.find((office) => office.name === p.name).map, { ext: true }) : ""}
    </div>
  </div>
</article>`;

export default page({
  title: "Hill Bottom Properties — Real Estate & Luxury Apartments in Addis Ababa, Ethiopia",
  desc: "Luxury real estate in Addis Ababa, Ethiopia, for local and diaspora buyers. Hill Bottom Village in Ayat is complete and occupied; Urban Kaza in Kazanchis is now selling.",
  current: "",
  path: "",
  image: "urban-kaza-dusk-v2",
  bodyClass: "home-editorial",
  body: `
${welcome(0, WELCOME)}

<section class="hero">
  <div class="hero__media">
    <img src="assets/img/urban-kaza-dusk-v2.webp" alt="Urban Kaza at dusk in Kazanchis" fetchpriority="high">
    <video data-hero-video muted loop playsinline preload="metadata" poster="assets/img/urban-kaza-dusk-v2.webp" aria-hidden="true"><source src="assets/video/urban-kaza-showcase-v2.mp4" type="video/mp4"></video>
  </div>
  <span class="hero__veil"></span>
  <div class="wrap hero__in">
    <div class="hero__stage">
      <h1 class="d1" data-words>Elevated Living</h1>
      <p class="hero__sub">${esc(CO.line)}</p>
    </div>
    <div class="btn-row" style="margin-top:38px">
      ${btn(CTA.home, "projects.html", { kind: "btn--gold" })}
      ${btn("Book a Virtual Tour", "vr-tours.html", { icon: "cube" })}
    </div>
  </div>
  <div class="herocards">
    <a class="herocard" href="projects/urban-kaza.html"><b>Now Selling</b><span>Urban Kaza, Kazanchis</span></a>
    <a class="herocard" href="projects/hillbottom-village.html"><b>Delivered</b><span>Hill Bottom Village</span></a>
  </div>
</section>

<section class="ch ch--paper portfolio-index rv" aria-label="Project status">
  <div class="status-grid">
    <a class="status-card" style="--progress:100;--status-i:0" href="projects/hillbottom-village.html">
      <span class="status-card__location">Ayat · Block A</span><span class="status-card__value">Complete</span><span class="status-card__note">Delivered and fully occupied</span>
      <svg class="status-card__mountain" viewBox="0 0 240 54" aria-hidden="true"><path class="status-card__track" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/><path class="status-card__fill" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/></svg>
    </a>
    <a class="status-card" style="--progress:66;--status-i:1" href="projects/hillbottom-village.html">
      <span class="status-card__location">Ayat · Block B</span><span class="status-card__value">October 2026</span><span class="status-card__note">In construction</span>
      <svg class="status-card__mountain" viewBox="0 0 240 54" aria-hidden="true"><path class="status-card__track" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/><path class="status-card__fill" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/></svg>
    </a>
    <a class="status-card" style="--progress:44;--status-i:2" href="projects/urban-kaza.html">
      <span class="status-card__location">Kazanchis</span><span class="status-card__value">Urban Kaza</span><span class="status-card__note">98 residences · in progress</span>
      <svg class="status-card__mountain" viewBox="0 0 240 54" aria-hidden="true"><path class="status-card__track" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/><path class="status-card__fill" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/></svg>
    </a>
    <a class="status-card" style="--progress:18;--status-i:3" href="projects/recreation-center.html">
      <span class="status-card__location">Ayat · Phase 3</span><span class="status-card__value">January 2027</span><span class="status-card__note">Commercial + Recreation</span>
      <svg class="status-card__mountain" viewBox="0 0 240 54" aria-hidden="true"><path class="status-card__track" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/><path class="status-card__fill" pathLength="100" d="M4 45 50 16l12 9 44-21 26 22 13-10 28 22 16-12 47 27"/></svg>
    </a>
  </div>
</section>

<section class="ch ch--paper pad-s home-proof">
  <div class="proof-grid">
      <a class="proofcard rv" href="projects/hillbottom-village.html" style="--proof-image:url('../img/feedback-village.webp')">
        <span class="proofcard__badge" aria-hidden="true">${UI_ICON.checkCircle}</span>
        <p class="mark">Delivered</p>
        <h2 class="d3">Hill Bottom Village</h2>
        <p class="story__d">Completed and occupied.</p>
        <span class="outlined-action" aria-hidden="true">View delivered project<span>${ICON.arrow}</span></span>
      </a>
      <a class="proofcard rv" href="projects/urban-kaza.html" style="--proof-image:url('../img/urban-kaza-dusk-v2.webp')">
        <span class="proofcard__badge" aria-hidden="true">${UI_ICON.key}</span>
        <p class="mark">Now Selling</p>
        <h2 class="d3">Urban Kaza</h2>
        <p class="story__d">Kazanchis · 98 residences · from 135,000 ETB / sqm.</p>
        <span class="outlined-action" aria-hidden="true">Explore Urban Kaza<span>${ICON.arrow}</span></span>
      </a>
      <a class="proofcard rv" href="buying-from-abroad.html" style="--proof-image:url('../img/feedback-abroad.webp')">
        <span class="proofcard__badge" aria-hidden="true">${UI_ICON.globe}</span>
        <p class="mark">Buying From Abroad</p>
        <h2 class="d3">Remote purchase</h2>
        <p class="story__d">Private video consultations, virtual tours and milestone updates.</p>
        <span class="outlined-action" aria-hidden="true">See how remote purchasing works<span>${ICON.arrow}</span></span>
      </a>
  </div>
</section>

<section class="ch ch--paper pad home-intro">
  <div class="intro-editorial">
    <div class="intro-editorial__copy rv">
      <h2 class="d2">Building more than buildings. <em>Building community.</em></h2>
      <p class="intro-editorial__lede">A premium Ethiopian real estate developer committed to transparency, timelines, and technical excellence — since day one.</p>
      <p>Hill Bottom Properties was founded on a simple premise: Ethiopia deserves world-class real estate delivered with absolute integrity. We saw a gap between aspiration and reality in the Ethiopian property market, and we set out to close it.</p>
      <p>Our first completed project — Hill Bottom Village in Ayat — became a proof of concept. Buyers watched their homes rise, received progress updates at every milestone, and received their keys on time. We are now applying the same standard to Urban Kaza in the Kazanchis Diplomatic Corridor.</p>
      <a class="outlined-action outlined-action--dark" href="about.html">About Hill Bottom<span>${ICON.arrow}</span></a>
    </div>
    <figure class="intro-editorial__media rv"><img src="assets/img/feedback-village.webp" alt="Hill Bottom Village at Ayat" loading="lazy" decoding="async"></figure>
  </div>
</section>

<section class="ch ch--abyss pad home-projects" id="projects">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(56px,7vw,110px)">
      <h2 class="d2">Our Signature Developments</h2>
      <div class="head__side">
        <p>From Ayat to Kazanchis — each Hill Bottom project is a deliberate act of community-building and architectural conviction.</p>
        <div style="margin-top:26px">${link("View All Projects", "projects.html")}</div>
      </div>
    </div>
    <div class="project-collection">${featured.map(projectChapter).join("")}</div>
  </div>
</section>


<section class="ch ch--paper pad home-delivered">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(44px,5vw,76px)">
      <h2 class="d2" style="max-width:17ch">Before we ask for your trust, <em>see what we delivered</em>.</h2>
      <div class="head__side">
        <p>Hill Bottom Village Phase 1 is complete and fully occupied. Prospective buyers are welcome to visit the completed Phase 1 and speak with current residents before committing to Phase 2.</p>
        <div class="btn-row" style="margin-top:26px">
          ${btn(CTA.delivered, "contact.html", { kind: "btn--gold" })}
          ${btn("View Development", "projects/hillbottom-village.html", { kind: "btn--ghost" })}
        </div>
      </div>
    </div>
  </div>
  <div class="delivery-marquee rv" aria-label="Completed Hill Bottom spaces">
    <div class="delivery-marquee__track">${deliveryFrames()}${deliveryFrames(true)}</div>
  </div>
</section>

<section class="home-abroad">
  <img class="home-abroad__media" src="assets/img/feedback-abroad.webp" alt="Hill Bottom development in Addis Ababa" loading="lazy" decoding="async">
  <span class="home-abroad__veil"></span>
  <div class="wrap home-abroad__content rv">
    <p class="mark">Buying from abroad</p>
    <h2 class="d2">Your next home is in Addis. <em>Your control stays with you.</em></h2>
    <p>Review your residence remotely, speak with the sales team in your timezone, verify documentation, follow construction progress and complete each stage with written confirmation.</p>
    <div class="btn-row">
      ${btn(CTA.diaspora, "buying-from-abroad.html", { kind: "btn--gold" })}
      <a class="btn btn--ghost" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}WhatsApp International Sales</a>
    </div>
  </div>
</section>

<!-- imagery owns a whole screen; the ridge cuts it into the chapter below -->
<section class="band">
  <div class="band__media"><img src="assets/img/feedback-community.webp" alt="Members lounge and social space" loading="lazy" decoding="async"></div>
  <span class="band__veil"></span>
  <div class="wrap band__in rv">
    <h2 class="d2" style="max-width:16ch">Discover a <em>thriving community</em>.</h2>
    <p class="lede" style="margin-top:22px">At Hill Bottom, we blend luxury with connection, offering vibrant social spaces, state-of-the-art health facilities, and lush gardens for an unparalleled lifestyle.</p>
  </div>
  ${ridge("bottom", "var(--paper)")}
</section>

<section class="ch ch--paper pad home-values" id="why">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(44px,5vw,72px)">
      <h2 class="d2">Why Hillbottom?</h2>
      <div class="head__side"><p>${esc(CO.promise)}</p></div>
    </div>
    <ul class="ledger rv">
      ${PILLARS.map((p) => `
      <li class="ledger__row" style="--i:${PILLARS.indexOf(p)}">
        <span class="pillar-icon">${PILLAR_ICONS[PILLARS.indexOf(p)]}</span>
        <div><h3 class="ledger__t">${esc(p.t)}</h3>
        <p class="ledger__d">${esc(p.d)}</p></div>
      </li>`).join("")}
    </ul>
  </div>
</section>

<section class="home-tours">
  <div class="home-tours__media">
    <img src="assets/img/feedback-team.webp" alt="Urban Kaza living space" loading="lazy" decoding="async">
    <video data-loop-video muted loop playsinline preload="metadata" poster="assets/img/feedback-team.webp" aria-hidden="true"><source src="assets/video/urban-kaza-showcase-v2.mp4" type="video/mp4"></video>
  </div>
  <span class="home-tours__veil"></span>
  <div class="wrap home-tours__content rv">
    <h2 class="d2">Step Inside Your Future Home</h2>
    <p>Explore our signature developments from the comfort of your screen. Virtual tours available for diaspora buyers worldwide.</p>
    <div class="tour-portals">
      <a class="tour-portal" href="vr-tours.html" aria-label="View Hill Bottom virtual tour">
        <svg class="tour-portal__mark tour-portal__mark--hill" viewBox="0 0 117.6 92" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="M2 61.4 6.7 57.8l4 4 24.2-18.1 3.6 3.6 22.3-16.6L83 47.3l3.6-3.6 24.2 18.1 4-4 4.8 3.6"/></svg>
        <span>Hill Bottom</span><em>View Hill Bottom</em>
      </a>
      <a class="tour-portal" href="vr-tours.html" aria-label="View Urban Kaza virtual tour">
        <img class="tour-portal__mark tour-portal__mark--kaza" src="assets/img/urban-kaza-mark-official.svg" alt="" aria-hidden="true">
        <span>Urban Kaza</span><em>View Urban Kaza</em>
      </a>
    </div>
  </div>
</section>

<section class="ch ch--paper pad home-residents">
  <div class="wrap"><h2 class="d2 rv">What Our Residents Say</h2></div>
  <div class="testimonial-marquee wrap rv" aria-label="Resident testimonials"><div class="testimonial-marquee__track">${testimonialSlides()}</div></div>
</section>

<!-- The brand line, set as the page's one held breath. This is the CEO
     chapter until the real message and portrait arrive; it needs neither,
     and it never pretends to be a quotation from a person. -->
<section class="home-team-line">
  <img src="assets/img/feedback-team.webp" alt="Hill Bottom team environment" loading="lazy" decoding="async">
  <span class="home-team-line__veil"></span>
  <div class="wrap home-team-line__content">
    <p class="d2 rv">&ldquo;We make dream lifestyles a reality.&rdquo;</p>
    <p class="mark rv">Hill Bottom Properties</p>
    <div class="rv">${link("Meet the Team", "team.html")}</div>
  </div>
</section>

<section class="ch ch--paper-2 pad home-stories">
  <div class="wrap">
    <div class="stories-head rv">
      <div><h2 class="d2">Latest Updates and Insights</h2>
      <p>Expert guides, investment analysis, and market insights — written for buyers, investors, and the Ethiopian diaspora.</p></div>
      ${link("All Articles", "news.html")}
    </div>
    <div class="grid grid--3">${POSTS.slice(0, 3).map((p) => storyCard(p, 0, "news/").replace('<p class="mark">', STORY_ICON + '<p class="mark">')).join("")}</div>
  </div>
</section>

<section class="ch ch--abyss pad home-inquiry" id="inquiry">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(44px,5vw,72px)">
      <h2 class="d2">Ready to Find <em>Your Home</em>?</h2>
      <div class="head__side">
        <p>Whether you're buying from Ethiopia or abroad, our team is here to guide you every step of the way.</p>
        <div class="btn-row" style="margin-top:26px">
          <a class="btn" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}WhatsApp Us</a>
          <a class="btn btn--ghost" href="${CO.telHref}">${ICON.phone}${esc(CO.tel)}</a>
        </div>
      </div>
    </div>
    ${inquiryForm(0, "home-inquiry")}
  </div>
</section>
`,
});
