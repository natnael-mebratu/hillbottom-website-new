/* ===================== PROMO LANDING (billboard QR, US display ads) =====
   Standalone, compact, single-viewport page — not linked from nav/sitemap.
   Built from scratch (not the shared page() wrapper) to skip header/footer/
   intro chrome entirely; still uses the real stylesheets, fonts, tokens and
   component primitives so it reads as the same brand, not a knockoff.

   Content owed later (placeholders, not invented facts):
   - Real Seychelles/Travel Sultan offer terms and their Instagram handle
   - Hero video/gift-card fields will become admin-editable (see apiClient
     work on the other repo) — for now this reads the literal values below. */
import { CO } from "../data.mjs";
import { esc, btn, ridge, MARK, SITE_URL } from "../ui.mjs";

const TITLE = "Ayat Delivered. Kazanchis On Sale. — Hill Bottom Properties";
const DESC = "Hill Bottom Village in Ayat is delivered. Urban Kaza in Kazanchis is now selling. Scan to see the walkthrough and claim your Seychelles getaway entry.";
const YOUTUBE_ID = "6gNt0DWdpWk";
const INSTAGRAM_PLACEHOLDER = "https://instagram.com/travelsultan"; // TODO: confirm real handle

const PLANE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 7.5 3 13.2l6.3 1.5 1.5 6.3L16.5 3 21 7.5Z"/></svg>`;
const SEAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="9" r="5.5"/><path d="m8 13.5-2 7 6-3 6 3-2-7"/></svg>`;

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
<meta property="og:image" content="${SITE_URL}/assets/img/kaza-building-1400.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/img/kaza-building-1400.webp" as="image">
<link rel="preload" href="assets/fonts/gs-SB2OEB6IKZPRR6JT4GFJ2TFT6HBB6AZN.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/hb.css">
<link rel="stylesheet" href="assets/css/editorial.css">
<link rel="stylesheet" href="assets/css/kaza.css">
<link rel="stylesheet" href="assets/css/premium-2026.css">
<link rel="stylesheet" href="assets/css/home-feedback.css">
<link rel="stylesheet" href="assets/css/site-unified.css">
<link rel="stylesheet" href="assets/css/refine-2026.css">
<style>
  html,body{height:100%}
  body{margin:0;overflow:hidden;background:var(--abyss)}
  *,*::before,*::after{box-sizing:border-box}
  @keyframes promoRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes promoGlow{0%,100%{box-shadow:0 0 0 0 rgba(229,72,72,.5)}50%{box-shadow:0 0 0 7px rgba(229,72,72,0)}}
  @keyframes planeFly{0%{left:-6%;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:94%;opacity:0}}

  .promo{
    height:100dvh; height:100svh;
    display:flex; flex-direction:column;
    gap:clamp(9px,1.9vh,15px);
    padding:env(safe-area-inset-top,0) clamp(16px,4vw,28px) env(safe-area-inset-bottom,0);
    max-width:460px; margin:0 auto; position:relative; overflow:hidden; isolation:isolate;
  }
  .promo__bg{position:absolute;inset:0;z-index:-1;background:
      linear-gradient(180deg,rgba(6,11,20,.55) 0%,rgba(6,11,20,.88) 46%,var(--abyss) 72%),
      url("assets/img/kaza-building-1400.webp") center 30%/cover no-repeat;
    filter:saturate(1.05)}
  .promo__bg::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 0%,transparent 0%,rgba(6,11,20,.4) 100%)}

  .promo__brand{display:flex;align-items:center;gap:10px;padding-top:clamp(8px,1.6vh,14px);animation:promoRise .6s both}
  .promo__brand svg{width:22px;height:22px;color:var(--gold-lit)}
  .promo__brand span{font-family:var(--sans);font-weight:600;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--fg-2)}

  .promo__hero{animation:promoRise .6s .08s both}
  .promo__hero h1{margin:0;font-family:var(--display);font-weight:200;letter-spacing:-.03em;line-height:1.04;color:#F6F8FB;font-size:clamp(1.74rem,6.8vw,2.56rem);text-shadow:0 2px 18px rgba(0,0,0,.35)}
  .promo__hero h1 em{font-style:normal;font-weight:600;color:var(--gold-lit)}
  .promo__hero p{margin:.5em 0 0;color:#C7D1DE;font-family:var(--sans);font-size:clamp(.8rem,2.6vw,.92rem);line-height:1.45;max-width:40ch}

  .promo__video{position:relative;width:100%;flex:1 1 auto;min-height:106px;max-height:36vh;border-radius:16px;overflow:hidden;
    border:1px solid rgba(198,178,124,.28);background:var(--raise);
    box-shadow:0 18px 40px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.03) inset;
    animation:promoRise .6s .16s both}
  .promo__video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
  .promo__video__tag{position:absolute;top:9px;left:9px;z-index:1;display:flex;align-items:center;gap:6px;background:rgba(6,11,20,.62);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px 10px 5px 8px;font-family:var(--sans);font-size:.62rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#F6F8FB;pointer-events:none}
  .promo__video__tag i{width:6px;height:6px;border-radius:50%;background:#E54848;animation:promoGlow 1.8s infinite}

  .promo__card{position:relative;border:1px solid rgba(198,178,124,.3);border-radius:16px;padding:clamp(13px,2.4vh,17px);
    background:linear-gradient(155deg,rgba(23,39,63,.92),rgba(10,17,30,.92));overflow:hidden;
    box-shadow:0 14px 30px rgba(0,0,0,.35);animation:promoRise .6s .24s both}
  .promo__card::before{content:"";position:absolute;top:-40%;right:-20%;width:70%;height:180%;background:radial-gradient(circle,rgba(198,178,124,.16),transparent 65%);pointer-events:none}
  .promo__card__top{display:flex;align-items:center;justify-content:space-between;gap:10px;position:relative}
  .promo__card .mark{color:var(--gold-lit);margin:0;display:flex;align-items:center;gap:6px}
  .promo__card .mark svg{width:13px;height:13px}
  .promo__card__badge{font-family:var(--sans);font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0D1B30;background:var(--gold-lit);border-radius:999px;padding:3px 9px;white-space:nowrap}
  .promo__route{position:relative;display:flex;align-items:center;gap:8px;margin:11px 0;font-family:var(--sans);overflow:hidden}
  .promo__route span{font-size:.68rem;font-weight:600;letter-spacing:.06em;color:#F6F8FB;white-space:nowrap}
  .promo__route .line{position:relative;flex:1;height:1px;background:repeating-linear-gradient(90deg,rgba(198,178,124,.55) 0 5px,transparent 5px 9px)}
  .promo__route .line svg{position:absolute;top:50%;width:15px;height:15px;color:var(--gold-lit);transform:translateY(-50%);animation:planeFly 3.2s ease-in-out infinite}
  .promo__card p{position:relative;margin:0;font-family:var(--sans);font-size:.78rem;line-height:1.5;color:#B9C4D4}
  .promo__card a{color:var(--gold-lit);text-decoration:underline;text-underline-offset:2px}

  .promo__ctas{display:flex;gap:10px;animation:promoRise .6s .32s both}
  .promo__ctas .btn{flex:1;justify-content:center;font-size:.76rem;padding:.85em .6em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .promo__ctas .btn--gold{box-shadow:0 10px 24px rgba(198,178,124,.28)}

  @media (min-width:860px){
    body{display:flex;align-items:center;justify-content:center}
    .promo{
      min-height:min(880px,96dvh); height:min(880px,96dvh); max-width:420px;
      padding-top:clamp(18px,3vh,28px); padding-bottom:clamp(18px,3vh,28px);
      border:1px solid rgba(198,178,124,.22); border-radius:28px;
      box-shadow:0 40px 100px rgba(0,0,0,.6); overflow:hidden;
    }
    .promo__video{max-height:200px}
  }
</style>
</head>
<body class="ch ch--abyss">
${ridge("bottom")}
<main class="promo">
  <div class="promo__bg"></div>
  <div class="promo__brand">${MARK}<span>Hill Bottom Properties</span></div>

  <section class="promo__hero">
    <h1>Ayat Site <em>Delivered</em> Now,<br>Kazanchis <em>On Sale!</em></h1>
    <p>Hill Bottom Village in Ayat is delivered and occupied. Urban Kaza in Kazanchis — 98 residences in the diplomatic corridor — is selling now.</p>
  </section>

  <section class="promo__video">
    <span class="promo__video__tag"><i></i> Sneak Look</span>
    <iframe src="https://www.youtube.com/embed/${YOUTUBE_ID}" title="Urban Kaza walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
  </section>

  <section class="promo__card">
    <div class="promo__card__top">
      <span class="mark">${SEAL} Every scan, one entry</span>
      <span class="promo__card__badge">Free Flight</span>
    </div>
    <div class="promo__route">
      <span>Addis Ababa</span>
      <span class="line">${PLANE}</span>
      <span>Seychelles</span>
    </div>
    <p>Hill Bottom is giving away a free flight for two to Seychelles, in partnership with <a href="${INSTAGRAM_PLACEHOLDER}" target="_blank" rel="noreferrer">Travel Sultan</a>. Message us on WhatsApp to confirm your entry.</p>
  </section>

  <section class="promo__ctas">
    ${btn("WhatsApp Us", CO.waHref, { kind: "btn--gold", ext: true, icon: "wa" })}
    ${btn("Call Us", CO.telHref, { kind: "btn--ghost", icon: "phone" })}
  </section>
</main>
</body>
</html>`;
