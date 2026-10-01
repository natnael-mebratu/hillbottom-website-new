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
<meta property="og:image" content="${SITE_URL}/assets/img/urban-kaza-dusk-v2.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
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
  body{margin:0;overflow:hidden}
  *,*::before,*::after{box-sizing:border-box}
  .promo{
    height:100dvh;
    height:100svh;
    display:flex;
    flex-direction:column;
    gap:clamp(10px,2.2vh,18px);
    padding:env(safe-area-inset-top,0) clamp(16px,4vw,28px) env(safe-area-inset-bottom,0);
    max-width:460px;
    margin:0 auto;
    position:relative;
  }
  .promo__brand{display:flex;align-items:center;gap:10px;padding-top:clamp(8px,1.6vh,14px)}
  .promo__brand svg{width:22px;height:22px;color:var(--gold-lit)}
  .promo__brand span{font-family:var(--sans);font-weight:600;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--fg-2)}
  .promo__hero h1{margin:0;font-family:var(--display);font-weight:200;letter-spacing:-.03em;line-height:1.04;color:var(--fg);font-size:clamp(1.7rem,6.6vw,2.5rem)}
  .promo__hero h1 em{font-style:normal;font-weight:600;color:var(--gold-lit)}
  .promo__hero p{margin:.5em 0 0;color:var(--fg-2);font-family:var(--sans);font-size:clamp(.8rem,2.6vw,.92rem);line-height:1.45;max-width:38ch}
  .promo__video{position:relative;width:100%;flex:1 1 auto;min-height:110px;max-height:38vh;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:var(--raise)}
  .promo__video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
  .promo__card{border:1px solid var(--line);border-radius:14px;padding:clamp(12px,2.4vh,16px);background:color-mix(in srgb,var(--bg,var(--abyss)) 80%,var(--gold-lit) 4%)}
  .promo__card .mark{color:var(--gold-lit);margin-bottom:.35em;display:block}
  .promo__card p{margin:.25em 0 0;font-family:var(--sans);font-size:.78rem;line-height:1.5;color:var(--fg-2)}
  .promo__card a{color:var(--gold-lit);text-decoration:underline;text-underline-offset:2px}
  .promo__ctas{display:flex;gap:10px}
  .promo__ctas .btn{flex:1;justify-content:center;font-size:.76rem;padding:.85em 1em}
  @media (min-width:860px){
    body{ display:flex; align-items:center; justify-content:center; background:var(--abyss); }
    .promo{
      min-height:min(880px,96dvh);
      height:min(880px,96dvh);
      max-width:420px;
      padding-top:clamp(18px,3vh,28px);
      padding-bottom:clamp(18px,3vh,28px);
      border:1px solid var(--line);
      border-radius:28px;
      box-shadow:var(--lift-3,0 40px 80px rgba(0,0,0,.5));
      overflow:hidden;
    }
    .promo__video{max-height:200px}
  }
</style>
</head>
<body class="ch ch--abyss">
${ridge("bottom")}
<main class="promo">
  <div class="promo__brand">${MARK}<span>Hill Bottom Properties</span></div>

  <section class="promo__hero">
    <h1>Ayat Site <em>Delivered</em> Now,<br>Kazanchis <em>On Sale!</em></h1>
    <p>Hill Bottom Village in Ayat is delivered and occupied. Urban Kaza in Kazanchis — 98 residences in the diplomatic corridor — is selling now.</p>
  </section>

  <section class="promo__video">
    <iframe src="https://www.youtube.com/embed/${YOUTUBE_ID}" title="Urban Kaza walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
  </section>

  <section class="promo__card">
    <span class="mark">Every scan, one entry</span>
    <p>Hill Bottom is giving away a Seychelles getaway for two, in partnership with <a href="${INSTAGRAM_PLACEHOLDER}" target="_blank" rel="noreferrer">Travel Sultan</a>. Message us on WhatsApp to confirm your entry.</p>
  </section>

  <section class="promo__ctas">
    ${btn("WhatsApp Us", CO.waHref, { kind: "btn--gold", ext: true, icon: "wa" })}
    ${btn(`Call ${CO.tel}`, CO.telHref, { kind: "btn--ghost", icon: "phone" })}
  </section>
</main>
</body>
</html>`;
