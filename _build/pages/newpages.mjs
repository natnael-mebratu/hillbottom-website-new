import { CO, CTA, REMOTE_JOURNEY, REMOTE_SUPPORT, REMOTE_FAQ, CONSTRUCTION, PROCESS } from "../data.mjs";
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
out["buying-from-abroad.html"] = page({
  current: "buying-from-abroad.html",
  path: "buying-from-abroad.html",
  image: "kaza-members-01",
  title: "Buying Property in Ethiopia from Abroad — Hill Bottom Properties",
  desc: "Buy a Hill Bottom residence in Addis Ababa from anywhere. Remote purchase process, virtual tours, written confirmations, milestone-linked payments and legal support for the Ethiopian diaspora and international buyers.",
  bodyClass: "buying-abroad-page",
  body: `
${pageHero(0, {
  title: "Buying from Abroad",
  sub: "You don't need to be in Addis to secure your piece of it. End-to-end support for the Ethiopian diaspora with absolute transparency, legal protection, and peace of mind.",
  imgName: "kaza-members-01", alt: "Members lounge, Urban Kaza",
  stations: [],
})}

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

export default out;
