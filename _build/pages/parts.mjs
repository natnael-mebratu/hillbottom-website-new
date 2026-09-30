import { CO, INTEREST } from "../data.mjs";
import { esc, ICON, btn, facts, ridge, plate } from "../ui.mjs";

export const fmtDate = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

export const coverFor = (slug) =>
  slug === "why-buy-property-in-ayat" ? "hillbottom-interior"
  : slug === "roi-of-buying-in-addis" ? "urban-kaza-ext-v2"
  : slug === "how-to-buy-real-estate-in-ethiopia" ? "recreation-hub"
  : slug === "how-reliable-are-real-estates-in-ethiopia" ? "kaza-building" : "kaza-rooftop";

export const storyCard = (p, d = 0, prefix = "") => `
<a class="story zoom rv" href="${prefix}${p.slug}.html">
  ${plate(coverFor(p.slug), p.title, { d, ar: "ar", sizes: "(min-width:900px) 31vw, 100vw" })}
  <p class="mark">${fmtDate(p.date)} · ${esc(p.readTime)}</p>
  <h3 class="story__t">${esc(p.title)}</h3>
  <p class="story__d">${esc(p.excerpt)}</p>
</a>`;

/* The inquiry form. Client-side validation only — there is no endpoint yet.
   Wire submitInquiry() in assets/js/hb.js to the real handler. */
export const inquiryForm = (d = 0, id = "inquiry") => `
<form class="form rv" data-inquiry novalidate id="${id}">
  <div class="form__ok" role="status" tabindex="-1"><div><b>Inquiry received</b><p>Our sales team will contact you shortly. For the fastest reply, message us on WhatsApp at ${esc(CO.wa)}.</p></div></div>
  <div class="form__fail" role="status"><div><b>Your inquiry has not been sent</b><p>Online delivery is not connected yet. Your details remain below. Please <a href="${CO.waHref}" target="_blank" rel="noreferrer">contact our sales team on WhatsApp</a> at ${esc(CO.wa)}.</p></div></div>
  <div class="form__grid">
    <p class="field"><label for="${id}-name">Full Name</label><input id="${id}-name" name="name" type="text" autocomplete="name" placeholder="Your full name" required><span class="field__err"></span></p>
    <p class="field"><label for="${id}-email">Email</label><input id="${id}-email" name="email" type="email" autocomplete="email" placeholder="name@example.com" required><span class="field__err"></span></p>
  </div>
  <div class="form__grid">
    <p class="field"><label for="${id}-phone">Phone Number</label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" placeholder="+251 …" required><span class="field__err"></span></p>
    <p class="field"><label for="${id}-country">Country of Residence</label><input id="${id}-country" name="country" type="text" autocomplete="country-name" placeholder="USA, UK, Ethiopia…"><span class="field__err"></span></p>
  </div>
  <div class="form__grid">
    <p class="field"><label for="${id}-interest">Interested In</label>
      <select id="${id}-interest" name="interest">
        <option value="">Select interest</option>
        ${INTEREST.map((o) => `<option>${esc(o)}</option>`).join("")}
      </select><span class="field__err"></span></p>
    <div aria-hidden="true"></div>
  </div>
  <p class="field"><label for="${id}-msg">Message (Optional)</label><textarea id="${id}-msg" name="message" placeholder="Any specific requirements or questions?"></textarea><span class="field__err"></span></p>
  <div class="btn-row" style="align-items:center;gap:22px">
    <button class="btn btn--gold" type="submit" disabled>Send Inquiry</button>
    <span class="form__note">We respond within 24 hours on business days. Fastest response via WhatsApp.</span>
  </div>
  <noscript><p>Please enable JavaScript to use this form, or contact our sales team on <a href="${CO.waHref}">WhatsApp</a>.</p></noscript>
</form>`;

/* Every page opens on imagery, cut into the chapter below by the ridge. */
export const pageHero = (d, { title, sub, imgName, alt: altText, stations = [], tall = false, cut = "var(--paper)", heroClass = "", brand = "" }) => `
<section class="hero ${tall ? "" : "hero--short"} ${heroClass}">
  <div class="hero__media">
    <img src="${"../".repeat(d)}assets/img/${imgName}-1400.webp" srcset="${"../".repeat(d)}assets/img/${imgName}-800.webp 800w, ${"../".repeat(d)}assets/img/${imgName}-1400.webp 1400w" sizes="100vw" alt="${esc(altText)}" fetchpriority="high">
  </div>
  <span class="hero__veil"></span>
  <div class="wrap hero__in">
    <div class="hero__stage">
      ${brand}
      <h1 class="d1" data-words>${esc(title)}</h1>
      ${sub ? `<p class="hero__sub">${sub}</p>` : ""}
    </div>
    ${stations.length ? `<div style="margin-top:clamp(40px,6vh,72px)">${facts(stations, { d })}</div>` : ""}
  </div>
  ${ridge("bottom", cut)}
</section>`;

export const ctaBand = (d, { title, body, primary, primaryHref, secondary, secondaryHref, tone = "ch--abyss" }) => `
<section class="ch ${tone} pad">
  <div class="wrap">
    <div class="head head--split rv">
      <h2 class="d2">${esc(title)}</h2>
      <div class="head__side">
        <p>${esc(body)}</p>
        <div class="btn-row" style="margin-top:28px">
          ${primary ? btn(primary, primaryHref, { kind: "btn--gold", d }) : ""}
          ${secondary ? btn(secondary, secondaryHref, { d, ext: /^https?:/.test(secondaryHref) }) : ""}
        </div>
      </div>
    </div>
  </div>
</section>`;
