/* ===================== PROMO LANDING (billboard QR, US display ads) =====
   Standalone scrolling page — not linked from nav/sitemap. Built from scratch
   (not the shared page() wrapper) to skip header/footer/intro chrome, but
   reuses the real stylesheets, fonts, tokens, facts() and the .rv scroll-
   reveal engine from hb.js so it reads as the same brand, not a knockoff.

   Content owed later (placeholders, not invented facts):
   - Real Seychelles/Travel Sultan offer terms and their Instagram handle
   - Hero video/gift-card fields will become admin-editable (see apiClient
     work on the other repo) — for now this reads the literal values below. */
import { CO } from "../data.mjs";
import { esc, btn, MARK, SITE_URL } from "../ui.mjs";

const TITLE = "Ayat Delivered. Kazanchis On Sale. — Hill Bottom Properties";
const DESC = "Hill Bottom Village in Ayat is delivered. Urban Kaza in Kazanchis — 98 residences in the diplomatic corridor — is now selling. Scan to see the walkthrough and claim your Seychelles flight entry.";
const YOUTUBE_ID = "6gNt0DWdpWk";
const INSTAGRAM_PLACEHOLDER = "https://instagram.com/travelsultan"; // TODO: confirm real handle

const SEAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="9" r="5.5"/><path d="m8 13.5-2 7 6-3 6 3-2-7"/></svg>`;
const PALM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M12 22V11"/><path d="M12 11c0-4 2-7 6-8-1 4-3 6-6 8Z"/><path d="M12 11c0-4-2-7-6-8 1 4 3 6 6 8Z"/><path d="M12 11c1.5-3 4-4.5 7-4-2 3-4.5 4.3-7 4Z"/><path d="M12 11c-1.5-3-4-4.5-7-4 2 3 4.5 4.3 7 4Z"/></svg>`;

const SPEC_ICONS = {
  pin: `<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>`,
  units: `<path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6M9 12h.01M15 12h.01"/>`,
  price: `<circle cx="12" cy="12" r="9"/><path d="M9.5 15.5c.6.7 1.4 1 2.5 1 1.8 0 3-1 3-2.3 0-1.4-1.3-1.9-3-2.2-1.7-.3-3-.8-3-2.2 0-1.3 1.2-2.3 3-2.3 1.1 0 1.9.3 2.5 1M12 7v1.3M12 15.7V17"/>`,
  status: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/>`,
};
const specIcon = (name) => `<svg class="spec__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SPEC_ICONS[name]}</svg>`;

const SPECS = [
  { icon: "pin", v: "Kazanchis", n: "Diplomatic Quarter" },
  { icon: "units", v: "98 Units", n: "1 & 2-Bedroom Luxury" },
  { icon: "price", v: "135,000 ETB/sq.m", n: "Flexible Installments" },
  { icon: "status", v: "In Progress", n: "Ayat Site On Delivery" },
];
const specsGrid = `<div class="spec-grid">${SPECS.map((s) => `
  <div class="spec">
    <span class="spec__icon">${specIcon(s.icon)}</span>
    <strong>${esc(s.v)}</strong>
    <small>${esc(s.n)}</small>
  </div>`).join("")}</div>`;

export default `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(TITLE)}</title>
<meta name="description" content="${esc(DESC)}">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#060B14">
<link rel="canonical" href="${SITE_URL}/promo.html">
<meta property="og:title" content="${esc(TITLE)}">
<meta property="og:description" content="${esc(DESC)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}/promo.html">
<meta property="og:image" content="${SITE_URL}/assets/img/hillbottom-aerial-hero-1400.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/img/hillbottom-aerial-hero-1400.webp" as="image">
<link rel="preload" href="assets/fonts/gs-SB2OEB6IKZPRR6JT4GFJ2TFT6HBB6AZN.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/hb.css">
<link rel="stylesheet" href="assets/css/editorial.css">
<link rel="stylesheet" href="assets/css/kaza.css">
<link rel="stylesheet" href="assets/css/premium-2026.css">
<link rel="stylesheet" href="assets/css/home-feedback.css">
<link rel="stylesheet" href="assets/css/site-unified.css">
<link rel="stylesheet" href="assets/css/refine-2026.css">
<style>
  *,*::before,*::after{box-sizing:border-box}
  body{margin:0;background:var(--abyss)}
  .promo-wrap{max-width:560px;margin:0 auto;position:relative}

  @keyframes promoGlow{0%,100%{box-shadow:0 0 0 0 rgba(229,72,72,.5)}50%{box-shadow:0 0 0 7px rgba(229,72,72,0)}}
  @keyframes ticketFloat{0%,100%{transform:rotate(-.6deg) translateY(0)}50%{transform:rotate(.6deg) translateY(-6px)}}
  @keyframes foilSweep{0%{transform:translateX(-120%) rotate(8deg)}100%{transform:translateX(220%) rotate(8deg)}}
  @keyframes driftA{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,-18px)}}
  @keyframes driftB{0%,100%{transform:translate(0,0)}50%{transform:translate(-18px,14px)}}

  /* ---- hero ---- */
  .promo-hero{position:relative;padding:env(safe-area-inset-top,0) clamp(18px,5vw,32px) clamp(40px,7vh,64px);overflow:hidden;isolation:isolate}
  .promo-hero__bg{position:absolute;inset:0;z-index:-1;background:
      linear-gradient(180deg,rgba(6,11,20,.5) 0%,rgba(6,11,20,.86) 60%,var(--abyss) 100%),
      url("assets/img/hillbottom-aerial-hero-1400.webp") center 30%/cover no-repeat}
  .promo-brand{display:flex;align-items:center;gap:10px;padding-top:clamp(14px,3vh,22px)}
  .promo-brand svg{width:22px;height:22px;color:var(--gold-lit)}
  .promo-brand span{font-family:var(--sans);font-weight:600;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--fg-2)}
  .promo-hero h1{margin:clamp(20px,5vh,36px) 0 0;font-family:var(--display);font-weight:200;letter-spacing:-.03em;line-height:1.04;color:#F6F8FB;font-size:clamp(2rem,8.4vw,3.1rem);text-shadow:0 2px 18px rgba(0,0,0,.35)}
  .promo-hero h1 em{font-style:normal;font-weight:600;color:var(--gold-lit)}
  .promo-hero p{margin:.7em 0 0;color:#C7D1DE;font-family:var(--sans);font-size:clamp(.86rem,2.6vw,1rem);line-height:1.55;max-width:42ch}

  .promo-video{position:relative;margin:clamp(22px,5vh,36px) 0 0;width:100%;aspect-ratio:16/9;border-radius:18px;overflow:hidden;
    border:1px solid rgba(198,178,124,.3);background:var(--raise);
    box-shadow:0 22px 50px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.03) inset}
  .promo-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
  .promo-video__tag{position:absolute;top:10px;left:10px;z-index:1;display:flex;align-items:center;gap:6px;background:rgba(6,11,20,.62);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px 10px 5px 8px;font-family:var(--sans);font-size:.62rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#F6F8FB;pointer-events:none}
  .promo-video__tag i{width:6px;height:6px;border-radius:50%;background:#E54848;animation:promoGlow 1.8s infinite}

  /* ---- spec bar (paper section) ---- */
  .promo-specs{padding:clamp(34px,6vh,54px) clamp(20px,5vw,36px)}
  .spec-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(24px,4vh,34px) 18px;max-width:460px;margin:0 auto}
  .spec{display:flex;flex-direction:column;gap:7px;position:relative;padding-right:10px}
  .spec__icon{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);margin-bottom:2px}
  .spec__icon-svg{width:15px;height:15px}
  .spec strong{font-family:var(--display);font-weight:500;font-size:clamp(1.02rem,2.4vw,1.2rem);color:var(--fg);letter-spacing:-.01em;line-height:1.2}
  .spec small{font-family:var(--sans);font-size:.72rem;color:var(--fg-2);line-height:1.4}
  @media (min-width:640px){
    .spec-grid{grid-template-columns:repeat(4,1fr);gap:0}
    .spec{padding:0 22px;border-left:1px solid var(--line)}
    .spec:first-child{border-left:none;padding-left:0}
  }

  /* ---- ticket section ---- */
  .promo-giveaway{position:relative;padding:clamp(34px,6vh,54px) clamp(18px,5vw,32px);overflow:hidden;isolation:isolate}
  .promo-giveaway__orb{position:absolute;border-radius:50%;filter:blur(40px);pointer-events:none;z-index:-1}
  .promo-giveaway__orb--a{width:220px;height:220px;top:-40px;left:-60px;background:radial-gradient(circle,rgba(198,178,124,.22),transparent 70%);animation:driftA 9s ease-in-out infinite}
  .promo-giveaway__orb--b{width:260px;height:260px;bottom:-60px;right:-70px;background:radial-gradient(circle,rgba(99,160,198,.16),transparent 70%);animation:driftB 11s ease-in-out infinite}
  .promo-giveaway__head{text-align:center;margin:0 auto clamp(30px,5vh,46px);max-width:34ch}
  .promo-giveaway__head .mark{color:var(--gold-lit);display:inline-flex;align-items:center;gap:6px;background:rgba(198,178,124,.1);border:1px solid rgba(198,178,124,.25);border-radius:999px;padding:6px 14px;margin:0}
  .promo-giveaway__head .mark svg{width:13px;height:13px}
  .promo-giveaway__head h2{margin:.6em 0 0;font-family:var(--display);font-weight:200;color:#F6F8FB;font-size:clamp(1.7rem,5.6vw,2.4rem);line-height:1.1;letter-spacing:-.02em}
  .promo-giveaway__head h2 em{font-style:normal;font-weight:600;color:var(--gold-lit)}

  .ticket{position:relative;max-width:420px;margin:0 auto;animation:ticketFloat 6s ease-in-out infinite;transform-origin:center}
  .ticket__body{position:relative;display:grid;grid-template-columns:1fr auto;background:linear-gradient(155deg,rgba(28,45,71,.95),rgba(9,16,28,.97));
    border:1px solid rgba(198,178,124,.35);border-radius:18px;box-shadow:0 26px 60px rgba(0,0,0,.5);overflow:hidden}
  .ticket__notch{position:absolute;top:50%;width:22px;height:22px;background:var(--abyss);border-radius:50%;transform:translateY(-50%);z-index:2}
  .ticket__notch--l{left:-11px}
  .ticket__notch--r{right:calc(118px - 11px)}
  .ticket__main{padding:18px 16px 18px 20px;position:relative}
  .ticket__badge{display:inline-flex;align-items:center;gap:5px;font-family:var(--sans);font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0D1B30;background:var(--gold-lit);border-radius:999px;padding:3px 10px;margin-bottom:10px}
  .ticket__flight{display:flex;align-items:center;gap:8px;margin:2px 0 12px}
  .ticket__flight b{font-family:var(--display);font-weight:600;font-size:1.05rem;color:#F6F8FB;white-space:nowrap;position:relative;z-index:1}
  .ticket__arc{flex:1;min-width:40px;height:30px;overflow:visible}
  .ticket__arc .arc-base{fill:none;stroke:rgba(198,178,124,.25);stroke-width:1.3;stroke-dasharray:2 6}
  .ticket__arc .arc-trail{fill:none;stroke:var(--gold-lit);stroke-width:1.8;stroke-dasharray:420;filter:drop-shadow(0 0 3px rgba(198,178,124,.55))}
  .ticket__arc .arc-plane{fill:var(--gold-lit)}
  .ticket__meta{display:flex;gap:18px;margin-bottom:12px}
  .ticket__meta div{font-family:var(--sans)}
  .ticket__meta small{display:block;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:#8AA0BC;margin-bottom:3px}
  .ticket__meta strong{font-size:.78rem;color:#F6F8FB;font-weight:600}
  .ticket__copy{margin:0;font-family:var(--sans);font-size:.8rem;line-height:1.55;color:#B9C4D4;max-width:42ch}
  .ticket__copy a{color:var(--gold-lit);text-decoration:underline;text-underline-offset:2px}
  .ticket__stub{position:relative;width:118px;border-left:1px dashed rgba(198,178,124,.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px 10px;background:rgba(255,255,255,.02)}
  .ticket__stub svg{width:22px;height:22px;color:var(--gold-lit)}
  .ticket__stub span{writing-mode:vertical-rl;text-orientation:mixed;font-family:var(--sans);font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8AA0BC}
  .ticket__barcode{display:flex;gap:2px;align-items:flex-end;height:30px}
  .ticket__barcode span{display:block;width:2px;background:rgba(198,178,124,.55)}
  .ticket__foil{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden}
  .ticket__foil::after{content:"";position:absolute;top:-50%;left:0;width:30%;height:200%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.14),transparent);animation:foilSweep 5s ease-in-out infinite}

  /* ---- CTA band ---- */
  .promo-ctas{padding:clamp(28px,5vh,46px) clamp(18px,5vw,32px) calc(env(safe-area-inset-bottom,0) + clamp(28px,5vh,46px))}
  .promo-ctas__row{display:flex;gap:10px;max-width:420px;margin:0 auto}
  .promo-ctas__row .btn{flex:1;justify-content:center;font-size:.8rem;padding:.95em 1em}
  .promo-ctas__row .btn--gold{box-shadow:0 10px 26px rgba(198,178,124,.3)}

  @media (prefers-reduced-motion:reduce){
    .ticket,.ticket__foil::after,.promo-giveaway__orb,.promo-video__tag i{animation:none}
    .ticket__arc animate,.ticket__arc animateMotion{display:none}
  }
</style>
</head>
<body class="ch ch--abyss">
<div class="promo-wrap">

  <section class="promo-hero">
    <div class="promo-hero__bg"></div>
    <div class="promo-brand">${MARK}<span>Hill Bottom Properties</span></div>
    <h1>Ayat Site <em>Delivered</em> Now,<br>Kazanchis <em>On Sale!</em></h1>
    <p>Hill Bottom Village in Ayat is delivered and occupied. Urban Kaza in Kazanchis — 98 residences for sale in the diplomatic quarter.</p>

    <div class="promo-video">
      <span class="promo-video__tag"><i></i> Sneak Look</span>
      <iframe src="https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&modestbranding=1&playsinline=1&rel=0" title="Urban Kaza walkthrough" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="eager"></iframe>
    </div>
  </section>

  <section class="ch ch--paper promo-specs rv">
    ${specsGrid}
  </section>

  <section class="promo-giveaway rv">
    <div class="promo-giveaway__orb promo-giveaway__orb--a"></div>
    <div class="promo-giveaway__orb promo-giveaway__orb--b"></div>
    <div class="promo-giveaway__head">
      <span class="mark">${SEAL} Every scan, one entry</span>
      <h2>Win a flight for two<br>to <em>Seychelles</em></h2>
    </div>
    <div class="ticket">
      <span class="ticket__notch ticket__notch--l"></span>
      <span class="ticket__notch ticket__notch--r"></span>
      <div class="ticket__body">
        <div class="ticket__main">
          <span class="ticket__badge">Free Flight</span>
          <div class="ticket__flight">
            <b>ADD</b>
            <svg class="ticket__arc" viewBox="0 0 220 32" preserveAspectRatio="none" aria-hidden="true">
              <path class="arc-base" d="M8,26 Q110,-4 212,26"/>
              <path class="arc-trail" d="M8,26 Q110,-4 212,26">
                <animate attributeName="stroke-dashoffset" values="420;420;40;420" keyTimes="0;0.08;0.55;1" dur="4.5s" repeatCount="indefinite"/>
              </path>
              <path d="M-7,-4 L7,0 L-7,4 L-3,0 Z" class="arc-plane">
                <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear" path="M8,26 Q110,-4 212,26"/>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.85;1" dur="4.5s" repeatCount="indefinite"/>
              </path>
            </svg>
            <b>SEZ</b>
          </div>
          <div class="ticket__meta">
            <div><small>Passengers</small><strong>Two</strong></div>
            <div><small>Partner</small><strong>Travel Sultan</strong></div>
            <div><small>Entry</small><strong>One / Scan</strong></div>
          </div>
          <p class="ticket__copy">Hill Bottom is giving away a free flight for two to Seychelles, in partnership with <a href="${INSTAGRAM_PLACEHOLDER}" target="_blank" rel="noreferrer">Travel Sultan</a>. Message us on WhatsApp to confirm your entry.</p>
        </div>
        <div class="ticket__stub">
          ${PALM}
          <span>Boarding Pass</span>
          <div class="ticket__barcode">${Array.from({ length: 14 }, (_, i) => `<span style="height:${10 + ((i * 37) % 20)}px"></span>`).join("")}</div>
        </div>
        <div class="ticket__foil"></div>
      </div>
    </div>
  </section>

  <section class="promo-ctas rv">
    <div class="promo-ctas__row">
      ${btn("WhatsApp Us", CO.waHref, { kind: "btn--gold", ext: true, icon: "wa" })}
      ${btn("Call Us", CO.telHref, { kind: "btn--ghost", icon: "phone" })}
    </div>
  </section>

</div>
<script src="assets/js/hb.js"></script>
</body>
</html>`;
