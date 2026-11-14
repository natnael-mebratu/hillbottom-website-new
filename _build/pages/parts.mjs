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

/* The inquiry form. Submits to the real /api/leads endpoint (see
   submitInquiry() in assets/js/hb.js), which always tags the Odoo lead
   "Website Lead" — pass extra `tags` here for a specific page/campaign
   (e.g. the promo landing page's own form also tagging "Promo"). */
export const inquiryForm = (d = 0, id = "inquiry", tags = []) => `
<form class="form rv" data-inquiry novalidate id="${id}">
  <div class="form__ok" role="status" tabindex="-1"><div><b>Inquiry received</b><p>Our sales team will contact you shortly. For the fastest reply, message us on WhatsApp at ${esc(CO.wa)}.</p></div></div>
  <div class="form__fail" role="status"><div><b>Your inquiry has not been sent</b><p>Online delivery is not connected yet. Your details remain below. Please <a href="${CO.waHref}" target="_blank" rel="noreferrer">contact our sales team on WhatsApp</a> at ${esc(CO.wa)}.</p></div></div>${tags.length ? `
  <input type="hidden" name="tags" value="${esc(tags.join(","))}">` : ""}
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

/* careers.html's per-job "Apply" form. Separate from inquiryForm() because
   it needs a file field (the CV) — FormData with a file still works with
   fetch, but it's submitted by its own data-job-apply handler in hb.js
   rather than the generic data-inquiry one, and posts to
   window.HB_JOBS_ENDPOINT (set it to "<api base>/api/jobs/apply" once the
   API is deployed — same deferred-config pattern as HB_FORM_ENDPOINT). */
export const jobApplyForm = (job) => `
<details class="job-apply">
  <summary class="btn btn--gold">Apply for this role</summary>
  <form class="form rv" data-job-apply novalidate id="apply-${job.id}">
    <div class="form__ok" role="status" tabindex="-1"><div><b>Application received</b><p>Thank you for applying — our team will review your CV and reach out if it's a match.</p></div></div>
    <div class="form__fail" role="status"><div><b>Your application has not been sent</b><p>Online delivery is not connected yet. Please email your CV directly to <a href="mailto:${esc(CO.email)}">${esc(CO.email)}</a> with "${esc(job.title)}" in the subject line.</p></div></div>
    <input type="hidden" name="jobId" value="${job.id}">
    <div class="form__grid">
      <p class="field"><label for="apply-${job.id}-name">Full Name</label><input id="apply-${job.id}-name" name="fullName" type="text" autocomplete="name" placeholder="Your full name" required><span class="field__err"></span></p>
      <p class="field"><label for="apply-${job.id}-email">Email</label><input id="apply-${job.id}-email" name="email" type="email" autocomplete="email" placeholder="name@example.com" required><span class="field__err"></span></p>
    </div>
    <div class="form__grid">
      <p class="field"><label for="apply-${job.id}-phone">Phone Number</label><input id="apply-${job.id}-phone" name="phone" type="tel" autocomplete="tel" placeholder="+251 …"><span class="field__err"></span></p>
      <p class="field"><label for="apply-${job.id}-cv">CV (PDF or Word)</label><input id="apply-${job.id}-cv" name="cv" type="file" accept=".pdf,.doc,.docx" required><span class="field__err"></span></p>
    </div>
    <p class="field"><label for="apply-${job.id}-note">Cover Note (Optional)</label><textarea id="apply-${job.id}-note" name="coverNote" placeholder="Anything you'd like us to know?"></textarea><span class="field__err"></span></p>
    <div class="btn-row" style="align-items:center;gap:22px">
      <button class="btn btn--gold" type="submit">Submit Application</button>
      <span class="form__note">We review every application and respond if it's a fit.</span>
    </div>
    <noscript><p>Please enable JavaScript to use this form, or email your CV to <a href="mailto:${esc(CO.email)}">${esc(CO.email)}</a>.</p></noscript>
  </form>
</details>`;

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
