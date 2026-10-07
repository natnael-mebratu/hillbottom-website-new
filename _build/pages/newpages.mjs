import { CO, CTA, REMOTE_JOURNEY, REMOTE_SUPPORT, REMOTE_FAQ, CONSTRUCTION, PROCESS, MARKETING_POSTS, SISTER_COMPANIES } from "../data.mjs";
import { page, facts, alt, plate, btn, link, esc, ICON } from "../ui.mjs";
import { pageHero, ctaBand, inquiryForm } from "./parts.mjs";

const out = {};

const outlineIcon = (...paths) => `<svg class="uicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.map((path) => `<path pathLength="1" d="${path}"/>`).join("")}</svg>`;
const REMOTE_ICONS = [
  outlineIcon("M4 5h16v14H4Z", "M8 9h8M8 13h5"),
  outlineIcon("M3 6h18v12H3Z", "m8 10 3 2-3 2v-4ZM7 21h10"),
  outlineIcon("M12 3v18M7 7h7.5a2.5 2.5 0 0 1 0 5H9.5a2.5 2.5 0 0 0 0 5H17"),
  outlineIcon("M4 4h16v16H4Z", "m8 12 2.5 2.5L16 9"),
  outlineIcon("M3 11 12 4l9 7M5 10v10h14V10M9 20v-6h6v6"),
];
const SUPPORT_ICONS = [
  outlineIcon("M4 18V8M10 18V4M16 18v-6M22 18H2", "m4 8 6-4 6 8 6-5"),
  outlineIcon("M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z", "m8.5 12 2.2 2.2 4.8-5"),
  outlineIcon("M4 21V5h16v16M8 9h2M14 9h2M8 13h2M14 13h2M9 21v-4h6v4"),
];
const INFO_ICONS = [
  outlineIcon("M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"),
  outlineIcon("M5 4h14v16H5Z", "M8 8h8M8 12h8M8 16h5"),
  outlineIcon("M4 12h16M12 4v16", "M6 6h12v12H6Z"),
];
const iconGrid = (items, icons = REMOTE_ICONS, className = "") => `<ol class="process-icon-grid ${className} rv">
  ${items.map((item, i) => `<li class="process-icon-card" style="--process-i:${i}">
    <span class="process-icon-card__icon">${icons[i % icons.length]}</span>
    <span class="process-icon-card__number">${String(i + 1).padStart(2, "0")}</span>
    <h3>${esc(item.t)}</h3>
    <p>${esc(item.d)}</p>
  </li>`).join("")}
</ol>`;

/* ===================== BUYING FROM ABROAD (audit §12, §28) =====================
   A standalone landing page rather than diaspora references scattered across
   the site. All copy carried over verbatim from the Diaspora page. */
const REMOTE_FAQ_JSONLD = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": REMOTE_FAQ.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
})}</script>`;

out["buying-from-abroad.html"] = page({
  current: "buying-from-abroad.html",
  path: "buying-from-abroad.html",
  image: "kaza-members-01",
  title: "Buying Property in Ethiopia from Abroad — Hill Bottom Properties",
  desc: "Buy a Hill Bottom residence in Addis Ababa from anywhere. Remote purchase process, virtual tours, written confirmations, milestone-linked payments and legal support for the Ethiopian diaspora and international buyers.",
  bodyClass: "buying-abroad-page",
  head: REMOTE_FAQ_JSONLD,
  body: `
${pageHero(0, {
  title: "Buying from Abroad",
  sub: "You don't need to be in Addis to secure your piece of it. End-to-end support for the Ethiopian diaspora with absolute transparency, legal protection, and peace of mind.",
  imgName: "kaza-members-01", alt: "Members lounge, Urban Kaza",
  stations: [],
})}

<section class="ch ch--paper pad" style="padding-bottom:0">
  <div class="wrap"><p class="body" style="max-width:66ch">${esc(REMOTE_FAQ[0].a)}</p></div>
</section>

<section class="ch ch--paper pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(44px,5vw,76px)">
      <h2 class="d2">Your Remote Buying Journey</h2>
      <div class="head__side">
        <p>From first browse to key collection — a transparent, guided roadmap designed specifically for international buyers.</p>
        <div class="btn-row" style="margin-top:26px">
          ${btn(CTA.diaspora, "contact.html", { kind: "btn--gold" })}
          <a class="btn btn--ghost" href="${CO.waHref}" target="_blank" rel="noreferrer">${ICON.wa}WhatsApp Sales Team</a>
        </div>
      </div>
    </div>
    ${iconGrid(REMOTE_JOURNEY)}
  </div>
</section>

<section class="ch ch--abyss pad">
  <div class="wrap">
    <h2 class="d2 rv" style="max-width:20ch;margin-bottom:clamp(44px,5vw,72px)">In another country. <em>Still in control.</em></h2>
    <div class="grid grid--3">
      ${REMOTE_SUPPORT.map((s, i) => `
      <div class="rv" style="display:grid;gap:16px;align-content:start;border-top:1px solid var(--line);padding-top:26px">
        <span class="support-icon">${SUPPORT_ICONS[i]}</span>
        <h3 class="d4">${esc(s.t)}</h3>
        <p class="story__d">${esc(s.d)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>

<section class="ch ch--paper-2 pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(38px,4.5vw,60px)">
      <h2 class="d2">Diaspora Buyer FAQ</h2>
      <div class="head__side"><p>The most common questions from buyers in the US, UK, and Europe — answered honestly.</p></div>
    </div>
    <div class="faq rv">
      ${REMOTE_FAQ.map((f, i) => `
      <details class="faq__item"${i === 0 ? " open" : ""}>
        <summary><span>${esc(f.q)}</span><i class="faq__toggle" aria-hidden="true"></i></summary>
        <div class="faq__a"><p>${esc(f.a)}</p></div>
      </details>`).join("")}
    </div>
  </div>
</section>

<section class="ch ch--paper pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(38px,4.5vw,60px)">
      <h2 class="d2">The Full Buying Process</h2>
      <div class="head__side"><p>From first inquiry to key handover — a clear, transparent process designed to reduce uncertainty and build trust at every stage.</p></div>
    </div>
    ${iconGrid(PROCESS)}
  </div>
</section>

<section class="ch ch--abyss pad" id="enquire">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(44px,5vw,72px)">
      <h2 class="d2">Start Your Journey</h2>
      <div class="head__side">
        <p>Fill out the form below to receive our investor prospectus and schedule a consultation.</p>
      </div>
    </div>
    ${inquiryForm(0, "abroad")}
  </div>
</section>
`,
});

/* ========================= CONSTRUCTION UPDATES (audit §14) =========================
   Stage and milestone are the real published states. Dated progress photography
   and a verified completion percentage do not exist yet, so neither is shown —
   the page says how updates are issued instead of inventing them. */
out["construction.html"] = page({
  current: "construction.html",
  path: "construction.html",
  image: "construction-hero-1400",
  title: "Construction Updates — Hill Bottom Properties, Addis Ababa",
  desc: "Current construction stage and next milestone for every Hill Bottom development. Dated photo and video updates are issued to buyers at every milestone.",
  bodyClass: "construction-page",
  body: `
${pageHero(0, {
  title: "Construction Updates",
  sub: "Receive dated photo and video updates at every construction milestone. You can request additional walkthroughs via video call at any stage.",
  imgName: "construction-hero", alt: "Hill Bottom residential development",
  stations: [],
})}

<section class="ch ch--paper pad">
  <div class="wrap">
    <div class="head head--split rv" style="margin-bottom:clamp(44px,5vw,76px)">
      <h2 class="d2">Every project, every stage.</h2>
      <div class="head__side">
        <p>Payment milestones are tied to verified construction progress — not arbitrary dates. Buyers receive dated photography and video at each one.</p>
        <div style="margin-top:26px">${btn(CTA.construction, "contact.html", { kind: "btn--gold" })}</div>
      </div>
    </div>

    ${CONSTRUCTION.map((c, i) => `
    <article class="proj construction-card ${i % 2 ? "proj--flip" : ""} rv"${i ? ' style="margin-top:clamp(70px,9vw,140px)"' : ""}>
      <div class="proj__media zoom">
        <a href="${c.href}" aria-label="${esc(c.name)}">${plate(c.img, `${c.name} — ${c.stage}`, { ar: "ar", sizes: "(min-width:1020px) 56vw, 100vw", par: true })}</a>
      </div>
      <div class="proj__body">
        <span class="construction-card__status">${esc(c.status)}</span>
        <p class="mark mark--accent">${esc(c.where)}</p>
        <h3 class="proj__name"><a href="${c.href}">${esc(c.name)}</a></h3>
        <div class="construction-card__infographic">
          <div><span>${INFO_ICONS[0]}</span><small>Current stage</small><strong>${esc(c.stage)}</strong></div>
          <div><span>${INFO_ICONS[1]}</span><small>Next milestone</small><strong>${esc(c.milestone)}</strong></div>
          <div><span>${INFO_ICONS[2]}</span><small>Project status</small><strong>${esc(c.status)}</strong></div>
        </div>
        ${c.pct != null ? `
        <div class="construction-card__progress">
          <span class="live-badge"><i></i> Live progress</span>
          ${alt(c.pct, `${c.pct}% complete`, c.milestone)}
        </div>` : ""}
        <p class="story__d" style="max-width:44ch">Dated photo and video updates for this development are issued directly to buyers at each milestone. Request the latest pack or a live video walkthrough at any time.</p>
        ${btn("Request Latest Update", "contact.html", { kind: "btn--gold" })}
      </div>
    </article>`).join("")}
  </div>
</section>

${ctaBand(0, {
  title: "Buying from abroad?",
  body: "Follow construction from anywhere. Request dated progress packs and live video walkthroughs in your timezone.",
  primary: CTA.diaspora, primaryHref: "buying-from-abroad.html",
  secondary: "WhatsApp Us", secondaryHref: CO.waHref,
})}
`,
});

/* ===================== MARKETING FEED =====================
   A "floating campaign wall": masonry cards with a per-card scroll
   parallax drift and a large featured first post, not a flat grid.
   Fully database-driven (marketing_posts via admin) — no static fallback
   copy, since this is meant to read as current, not evergreen. Reuses
   the promo page's video-autoplay technique for YouTube/direct-video
   posts; text/image-only posts get a quieter editorial card treatment. */
const youtubeIdFrom = (url) => {
  const m = String(url || "").match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{6,})/);
  return m ? m[1] : null;
};
const isDirectVideo = (url) => /\.(mp4|webm|ogg)(\?|$)/i.test(String(url || ""));

const feedMedia = (post, { eager = false } = {}) => {
  const yt = youtubeIdFrom(post.mediaUrl);
  if (yt) {
    return `<div class="feed__media feed__media--video">
      <iframe src="https://www.youtube.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&modestbranding=1&playsinline=1&rel=0" title="${esc(post.title)}" allow="autoplay; encrypted-media" loading="lazy"></iframe>
    </div>`;
  }
  if (isDirectVideo(post.mediaUrl)) {
    return `<div class="feed__media feed__media--video">
      <video autoplay muted loop playsinline preload="metadata"><source src="${esc(post.mediaUrl)}"></video>
    </div>`;
  }
  if (post.mediaUrl) {
    return `<div class="feed__media"><img src="${esc(post.mediaUrl)}" alt="${esc(post.title)}" loading="${eager ? "eager" : "lazy"}"${eager ? ' fetchpriority="high"' : ""}></div>`;
  }
  return "";
};

const feedCard = (post, i) => `
<article class="feed__card${i === 0 ? " feed__card--feature" : ""} rv" style="--depth:${1 + (i % 3)}" data-feed-index="${i}" tabindex="0" role="button" aria-label="Open ${esc(post.title)}">
  ${feedMedia(post, { eager: i === 0 })}
  <div class="feed__body">
    ${post.campaignTag ? `<span class="feed__tag">${esc(post.campaignTag)}</span>` : ""}
    <h3>${esc(post.title)}</h3>
    ${post.body ? `<p>${esc(post.body)}</p>` : ""}
    <time datetime="${esc(post.publishedAt)}">${new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</time>
  </div>
</article>`;

const feedLightboxMedia = (post) => {
  const yt = youtubeIdFrom(post.mediaUrl);
  if (yt) return `<iframe src="https://www.youtube.com/embed/${yt}" title="" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  if (isDirectVideo(post.mediaUrl)) return `<video controls preload="metadata"><source src="${esc(post.mediaUrl)}"></video>`;
  if (post.mediaUrl) return `<img src="${esc(post.mediaUrl)}" alt="">`;
  return "";
};

out["marketing.html"] = page({
  current: "marketing.html",
  path: "marketing.html",
  image: "urban-kaza-ext-v2",
  title: "Campaign Feed — Hill Bottom Properties",
  desc: "Live campaign updates, launches and announcements from Hill Bottom Properties — delivery milestones, offers and news as they happen.",
  bodyClass: "marketing-page",
  head: `<style>
    .feed-hero{padding-bottom:0}
    .feed{columns:1;column-gap:clamp(18px,2.4vw,28px);margin-top:clamp(30px,4vw,54px)}
    @media(min-width:720px){.feed{columns:2}}
    @media(min-width:1080px){.feed{columns:3}}
    .feed__card{display:block;break-inside:avoid;margin:0 0 clamp(18px,2.4vw,28px);border:1px solid var(--line);border-radius:3px;overflow:hidden;background:var(--raise);cursor:pointer;will-change:transform;transition:transform .5s var(--ease),border-color .3s var(--ease);text-align:left;width:100%}
    .feed__card:hover{border-color:color-mix(in srgb,var(--accent) 45%,var(--line))}
    .feed__card--feature{column-span:all}
    .feed__card--feature .feed__media{aspect-ratio:21/9}
    .feed__card--feature .feed__body h3{font-size:clamp(1.4rem,2.6vw,2rem)}
    .feed__media{position:relative;width:100%;aspect-ratio:4/3;background:var(--raise);overflow:hidden}
    .feed__media img{width:100%;height:100%;object-fit:cover;display:block}
    .feed__media--video iframe,.feed__media--video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0}
    .feed__body{padding:clamp(18px,2.4vw,26px)}
    .feed__tag{display:inline-block;margin-bottom:10px;padding:4px 12px;border:1px solid color-mix(in srgb,var(--accent) 50%,transparent);border-radius:999px;font-family:var(--sans);font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
    .feed__body h3{margin:0;font-family:var(--display);font-weight:300;font-size:1.15rem;line-height:1.25;color:var(--fg)}
    .feed__body p{margin:.6em 0 0;font-family:var(--sans);font-size:.88rem;line-height:1.6;color:var(--fg-2)}
    .feed__body time{display:block;margin-top:14px;font-family:var(--sans);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--fg-2) 70%,transparent)}
    .feed-empty{margin-top:40px;padding:clamp(40px,6vw,70px);text-align:center;border:1px dashed var(--line);border-radius:3px;color:var(--fg-2)}
    .feed-lb{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:clamp(16px,4vw,48px);background:rgba(6,11,20,.92);backdrop-filter:blur(8px)}
    .feed-lb.is-open{display:flex}
    .feed-lb__panel{position:relative;width:100%;max-width:860px;max-height:92vh;overflow-y:auto;background:var(--abyss);border:1px solid rgba(232,219,184,.18);border-radius:4px}
    .feed-lb__media{width:100%;aspect-ratio:16/9;background:var(--raise);position:relative}
    .feed-lb__media iframe,.feed-lb__media video,.feed-lb__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0}
    .feed-lb__body{padding:clamp(22px,4vw,38px)}
    .feed-lb__body h3{margin:.4em 0 0;font-family:var(--display);font-weight:300;font-size:clamp(1.3rem,3vw,1.8rem);color:#F6F8FB}
    .feed-lb__body p{margin:.8em 0 0;font-family:var(--sans);font-size:.95rem;line-height:1.7;color:#C7D1DE}
    .feed-lb__close{position:absolute;top:14px;right:14px;z-index:1;width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:rgba(6,11,20,.6);color:#fff;border:1px solid rgba(255,255,255,.2)}
    .feed-lb__close svg{width:18px;height:18px}
    @media(prefers-reduced-motion:reduce){.feed__card{transition:none!important}}
  </style>`,
  body: `
${pageHero(0, {
  title: "Campaign Feed",
  sub: "Live updates from Hill Bottom Properties — launches, milestones, and offers as they happen.",
  imgName: "urban-kaza-ext-v2", alt: "Hill Bottom Properties campaign updates",
  stations: [],
  heroClass: "feed-hero",
})}

<section class="ch ch--abyss pad">
  <div class="wrap">
    ${MARKETING_POSTS.length === 0 ? `
    <div class="feed-empty">
      <p class="mark" style="margin-bottom:10px">Nothing posted yet</p>
      <p>Campaign updates will appear here as soon as they're published from the admin panel.</p>
    </div>` : `
    <div class="feed">
      ${MARKETING_POSTS.map(feedCard).join("")}
    </div>`}
  </div>
</section>

${ctaBand(0, {
  title: "Don't miss a launch.",
  body: "Message us on WhatsApp to be notified the moment a new project, unit release, or offer goes live.",
  primary: "WhatsApp Us", primaryHref: CO.waHref,
  secondary: "View Residences", secondaryHref: "projects.html",
})}

<div class="feed-lb" id="feed-lb">
  <div class="feed-lb__panel">
    <button class="feed-lb__close" type="button" data-feed-lb-close aria-label="Close">${ICON.close}</button>
    <div class="feed-lb__media" data-feed-lb-media></div>
    <div class="feed-lb__body">
      <span class="feed__tag" data-feed-lb-tag hidden></span>
      <h3 data-feed-lb-title></h3>
      <p data-feed-lb-body></p>
    </div>
  </div>
</div>
`,
  scripts: MARKETING_POSTS.length ? `<script>(function(){
  var posts = ${JSON.stringify(MARKETING_POSTS.map((p) => ({ title: p.title, body: p.body, campaignTag: p.campaignTag, media: feedLightboxMedia(p) })))};
  var lb = document.getElementById("feed-lb");
  if (!lb) return;
  var mediaEl = lb.querySelector("[data-feed-lb-media]");
  var titleEl = lb.querySelector("[data-feed-lb-title]");
  var bodyEl = lb.querySelector("[data-feed-lb-body]");
  var tagEl = lb.querySelector("[data-feed-lb-tag]");
  function open(i) {
    var p = posts[i];
    if (!p) return;
    mediaEl.innerHTML = p.media;
    titleEl.textContent = p.title;
    bodyEl.textContent = p.body || "";
    bodyEl.hidden = !p.body;
    tagEl.textContent = p.campaignTag || "";
    tagEl.hidden = !p.campaignTag;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("is-open");
    mediaEl.innerHTML = "";
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-feed-index]").forEach(function (card) {
    card.addEventListener("click", function () { open(Number(card.getAttribute("data-feed-index"))); });
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(Number(card.getAttribute("data-feed-index"))); } });
  });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  lb.querySelector("[data-feed-lb-close]").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".feed__card"));
    var ticking = false;
    function parallax() {
      var vh = window.innerHeight;
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) / vh;
        var depth = Number(card.style.getPropertyValue("--depth")) || 1;
        card.style.transform = "translateY(" + (offset * depth * -14) + "px)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }
})();</script>` : "",
});

/* ===================== SISTER COMPANIES =====================
   Hand-authored content (SISTER_COMPANIES in data.mjs), not DB-driven —
   see that file for why. Tona Coffee gets the full treatment since real
   content exists; "hold:true" entries (no confirmed content yet) render
   a quieter placeholder card instead of inventing copy. */
out["sister-companies.html"] = page({
  current: "sister-companies.html",
  path: "sister-companies.html",
  image: "urban-kaza-ext-v2",
  title: "Sister Companies — Hill Bottom Properties",
  desc: "The companies in the Hill Bottom family — from Tona Coffee to our wellness and recreation ventures.",
  bodyClass: "sister-page",
  head: `<style>
    .sister-hero{padding-bottom:0}
    .sister{padding:clamp(50px,7vw,90px) 0}
    .sister__top{display:flex;align-items:center;gap:22px;flex-wrap:wrap;margin-bottom:clamp(30px,4vw,48px)}
    .sister__logo{height:52px;width:auto;padding:10px 16px;background:#060B14;border:1px solid rgba(232,219,124,.22);border-radius:4px}
    .sister__top h2{margin:0;font-family:var(--display);font-weight:300;font-size:clamp(1.8rem,3.4vw,2.6rem);color:var(--fg)}
    .sister__tagline{margin:0;font-family:var(--sans);font-size:.95rem;font-style:italic;color:var(--accent)}
    .sister__grid{display:grid;gap:clamp(30px,4vw,54px);grid-template-columns:1.3fr 1fr}
    @media(max-width:860px){.sister__grid{grid-template-columns:1fr}}
    .sister__about p{font-family:var(--sans);font-size:.95rem;line-height:1.75;color:var(--fg-2);max-width:60ch}
    .sister__about p+p{margin-top:1.1em}
    .sister__pron{font-family:var(--sans);font-size:.8rem;color:var(--fg-2);border-left:2px solid var(--accent);padding-left:14px;margin:1.4em 0}
    .sister__pron b{display:block;color:var(--fg);margin-bottom:4px}
    .sister__pron ul{margin:.4em 0 0;padding-left:1.1em}
    .varieties{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:10px}
    .variety{border:1px solid var(--line);border-radius:3px;padding:16px 18px}
    .variety b{display:block;font-family:var(--display);font-weight:500;font-size:1rem;color:var(--fg);margin-bottom:6px}
    .variety span{font-family:var(--sans);font-size:.82rem;line-height:1.5;color:var(--fg-2)}
    .sister__side{border:1px solid var(--line);border-radius:3px;padding:clamp(22px,3vw,30px);align-self:start}
    .sister__side h4{margin:0 0 14px;font-family:var(--sans);font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
    .sister__side ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
    .sister__side li{font-family:var(--sans);font-size:.86rem;line-height:1.5;color:var(--fg-2);padding-left:18px;position:relative}
    .sister__side li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:6px;border-radius:50%;background:var(--accent)}
    .sister__contact{margin-top:26px;padding-top:22px;border-top:1px solid var(--line);display:grid;gap:8px;font-family:var(--sans);font-size:.85rem;color:var(--fg-2)}
    .sister__contact a{color:var(--fg)}
    .sister--hold{text-align:center;padding:clamp(40px,6vw,64px);border:1px dashed var(--line);border-radius:3px}
    .sister--hold h2{margin:0 0 10px}
    .sister--hold p{max-width:50ch;margin:0 auto;color:var(--fg-2)}
    .sister--hold .mark{color:var(--accent);margin-bottom:12px}
  </style>`,
  body: `
${pageHero(0, {
  title: "Sister Companies",
  sub: "The ventures that share Hill Bottom's name and standards — in real estate and beyond.",
  imgName: "urban-kaza-ext-v2", alt: "Hill Bottom Properties sister companies",
  stations: [],
  heroClass: "sister-hero",
})}

${SISTER_COMPANIES.map((co, i) => co.hold ? `
<section class="ch ${i % 2 ? "ch--abyss" : "ch--paper"} pad">
  <div class="wrap">
    <div class="sister--hold rv">
      <span class="mark">Coming Soon</span>
      <h2 class="d3">${esc(co.name)}</h2>
      <p>${esc(co.about)}</p>
    </div>
  </div>
</section>` : `
<section class="ch ${i % 2 ? "ch--abyss" : "ch--paper"} pad sister">
  <div class="wrap">
    <div class="sister__top rv">
      <img class="sister__logo" src="assets/img/${co.logo}.webp" alt="${esc(co.name)} logo">
      <div>
        <h2>${esc(co.name)}</h2>
        <p class="sister__tagline">${esc(co.tagline)}</p>
      </div>
    </div>
    <div class="sister__grid">
      <div class="sister__about rv">
        <p>${esc(co.about)}</p>
        ${co.pronunciation ? `
        <div class="sister__pron">
          <b>${esc(co.pronunciation)}</b>
          <ul>${co.definitions.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        </div>` : ""}
        ${co.founding ? `<p>${esc(co.founding)}</p>` : ""}
        ${co.mission ? `<p>${esc(co.mission)}</p>` : ""}
        ${co.varieties ? `
        <div class="varieties">
          ${co.varieties.map((v) => `<div class="variety"><b>${esc(v.name)}</b><span>${esc(v.note)}</span></div>`).join("")}
        </div>` : ""}
        ${co.sustainability ? `<p style="margin-top:1.4em">${esc(co.sustainability)}</p>` : ""}
      </div>
      <aside class="sister__side rv">
        ${co.values ? `
        <h4>Values</h4>
        <ul>${co.values.map((v) => `<li>${esc(v)}</li>`).join("")}</ul>` : ""}
        <div class="sister__contact">
          ${co.contact.email ? `<a href="mailto:${esc(co.contact.email)}">${esc(co.contact.email)}</a>` : ""}
          ${co.contact.phone ? `<a href="tel:${esc(co.contact.phone.replace(/\s+/g, ""))}">${esc(co.contact.phone)}</a>` : ""}
          ${co.contact.address ? `<span>${esc(co.contact.address)}</span>` : ""}
        </div>
      </aside>
    </div>
  </div>
</section>`).join("")}

${ctaBand(0, {
  title: "Part of the Hill Bottom family.",
  body: "From residences to recreation — built on the same standard of trust.",
  primary: "View Residences", primaryHref: "projects.html",
  secondary: "Contact Us", secondaryHref: "contact.html",
})}
`,
});

export default out;
