import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9333;
const OUT = "_shots";
fs.mkdirSync(OUT, { recursive: true });

const shots = [
  ["home-d", "http://localhost:8422/index.html", 1440, 900],
  ["home-m", "http://localhost:8422/index.html", 390, 844],
  ["projects-d", "http://localhost:8422/projects.html", 1440, 900],
  ["kaza-d", "http://localhost:8422/projects/urban-kaza.html", 1440, 900],
  ["kaza-m", "http://localhost:8422/projects/urban-kaza.html", 390, 844],
  ["about-d", "http://localhost:8422/about.html", 1440, 900],
  ["contact-d", "http://localhost:8422/contact.html", 1440, 900],
  ["contact-m", "http://localhost:8422/contact.html", 390, 844],
  ["contact-t", "http://localhost:8422/contact.html", 820, 1180],
  ["news-d", "http://localhost:8422/news.html", 1440, 900],
  ["article-d", "http://localhost:8422/news/roi-of-buying-in-addis.html", 1440, 900],
  ["article-m", "http://localhost:8422/news/why-buy-property-in-ayat.html", 390, 844],
  ["article-t", "http://localhost:8422/news/why-buy-property-in-ayat.html", 820, 1180],
  ["team-d", "http://localhost:8422/team.html", 1440, 900],
  ["vr-d", "http://localhost:8422/vr-tours.html", 1440, 900],
  ["village-d", "http://localhost:8422/projects/hillbottom-village.html", 1440, 900],
  ["village-m", "http://localhost:8422/projects/hillbottom-village.html", 390, 844],
  ["village-t", "http://localhost:8422/projects/hillbottom-village.html", 820, 1180],
  ["rec-d", "http://localhost:8422/projects/recreation-center.html", 1440, 900],
  ["rec-m", "http://localhost:8422/projects/recreation-center.html", 390, 844],
  ["rec-t", "http://localhost:8422/projects/recreation-center.html", 820, 1180],
];

const proc = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--mute-audio",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.resolve("_edge-cdp")}`,
  "--window-size=1440,900", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const json = async (p) => (await fetch(`http://127.0.0.1:${PORT}${p}`)).json();

let ws;
for (let i = 0; i < 60; i++) { try { const v = await json("/json/version"); ws = v.webSocketDebuggerUrl; break; } catch (e) { await sleep(500); } }
if (!ws) { proc.kill(); throw new Error("CDP did not come up"); }

const { WebSocket } = await import("ws").catch(() => ({ WebSocket: globalThis.WebSocket }));
const sock = new WebSocket(ws);
await new Promise((r) => sock.addEventListener("open", r));
let id = 0; const waiters = new Map(); const events = [];
sock.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiters.has(m.id)) { waiters.get(m.id)(m); waiters.delete(m.id); }
  else if (m.method) events.push(m);
});
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const i = ++id; waiters.set(i, (m) => (m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result)));
  sock.send(JSON.stringify({ id: i, method, params, sessionId }));
});

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Log.enable", {}, sessionId);

const consoleErrors = [];
sock.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.method === "Log.entryAdded" && m.params.entry.level === "error") consoleErrors.push(m.params.entry.text + " @ " + (m.params.entry.url || ""));
  if (m.method === "Runtime.exceptionThrown") consoleErrors.push("JS: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
});


const evaluate = async (expression) => {
 const result = await send("Runtime.evaluate", {expression, returnByValue:true, awaitPromise:true}, sessionId);
 if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
 return result.result.value;
};
const results=[];
const check = async (name,expression) => {
 const value=await evaluate(expression);
 results.push({name,pass:!!value});
 console.log(name, value ? "PASS":"FAIL");
};
await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);
await send("Page.navigate",{url:"http://localhost:8422/"},sessionId);
await sleep(500);
await evaluate("sessionStorage.removeItem('hb-intro-v3');location.reload()");
await sleep(220);
await check("Native brand intro plays on the first session (no film)", "!!document.querySelector('.hbi') && !document.querySelector('video[data-loader-video]') && document.documentElement.classList.contains('intro-lock') && document.querySelectorAll('.hbi__lines path').length>20");
await sleep(5200);
await check("Brand intro exits and unlocks the page", "document.documentElement.classList.contains('hbi-seen') && !document.documentElement.classList.contains('intro-lock') && document.querySelector('.hero').classList.contains('lit')");
await check("Project status rail has four mountain progress cards", "document.querySelector('.portfolio-index').classList.contains('rv') && document.querySelectorAll('.status-card .status-card__fill').length===4");
await check("Hero uses the supplied looping Urban Kaza film", "document.querySelector('[data-hero-video] source').getAttribute('src').includes('urban-kaza-showcase-v2.mp4') && document.querySelector('[data-hero-video]').loop");
await check("Construction progress chapter is removed", "!document.querySelector('.home-construction')");
await check("Delivered gallery loops while testimonials remain stable and readable", "document.querySelectorAll('.delivery-marquee__group').length===2 && document.querySelectorAll('.testimonial-marquee__group').length===1 && getComputedStyle(document.querySelector('.testimonial-marquee__track')).animationName==='none'");
await check("Buttons are flat: no gradient, glass or shadow", "[...document.querySelectorAll('.btn')].every(b=>{const s=getComputedStyle(b);return s.backgroundImage==='none'&&s.boxShadow==='none'&&(s.backdropFilter==='none'||!s.backdropFilter)})");
await evaluate("localStorage.removeItem('hb-welcome-v2');location.reload()");
await sleep(4000);
await check("Welcome opens without focus theft", "document.querySelector('.welcome').classList.contains('is-open') && document.activeElement===document.body");
await evaluate("document.querySelector('[data-wel-close]').click()");
await check("Welcome dismiss persists", "document.querySelector('.welcome').inert && localStorage.getItem('hb-welcome-v2')==='1'");
await evaluate("document.querySelector('.burger').click()");
await sleep(300);
await check("Menu focuses first link", "document.activeElement===document.querySelector('.drawer a') && document.querySelector('main').inert");
await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape"},sessionId);
await check("Menu Escape restores focus", "document.activeElement===document.querySelector('.burger') && document.querySelector('.drawer').inert && !document.querySelector('main').inert");
await evaluate("document.querySelector('form').requestSubmit()");
await check("Invalid form identifies first field", "document.activeElement.name==='name' && document.activeElement.getAttribute('aria-invalid')==='true'");
await evaluate("document.querySelector('[name=name]').value='Test User';document.querySelector('[name=email]').value='test@example.com';document.querySelector('[name=phone]').value='1234567890';document.querySelector('form').requestSubmit()");
await check("Unsent form preserves input and reports honestly", "document.querySelector('.form__fail').classList.contains('is-on') && document.querySelector('[name=name]').value==='Test User' && document.querySelector('.form__fail').textContent.includes('has not been sent')");
await send("Page.navigate",{url:"http://localhost:8422/projects/urban-kaza.html"},sessionId);
await sleep(800);
await evaluate("document.querySelector('[data-uk-skip]')?.click()");
await evaluate("document.querySelector('[data-lb]').focus();document.querySelector('[data-lb]').click()");
await check("Gallery is outside inert background", "document.querySelector('.lb').parentElement===document.body && !document.querySelector('.lb').inert && document.activeElement===document.querySelector('.lb__x') && document.querySelector('main').inert");
await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Tab",code:"Tab",modifiers:8},sessionId);
await check("Gallery traps reverse Tab", "document.activeElement===Array.from(document.querySelectorAll('.lb button')).at(-1)");
await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape"},sessionId);
await check("Gallery closes and restores trigger", "document.activeElement.matches('[data-lb]') && !document.querySelector('main').inert && document.querySelector('.lb').inert");
await send("Page.navigate",{url:"http://localhost:8422/projects/urban-kaza.html"},sessionId);
await sleep(500);
await evaluate("sessionStorage.removeItem('uk-intro-v4');location.reload()");
await sleep(450);
await check("Urban Kaza intro plays the official lockup natively", "!!document.querySelector('.uki') && document.querySelectorAll('.uki__k').length===4 && document.querySelectorAll('.uki__u').length===5 && !document.querySelector('.uki video') && !document.querySelector('.uki').inert && document.querySelector('main').inert && document.activeElement.matches('[data-uk-skip]')");
await evaluate("document.querySelector('[data-uk-skip]').click()");
await sleep(450);
await check("Urban Kaza intro is skippable and unlocks page", "document.documentElement.classList.contains('uki-seen') && !document.querySelector('main').inert && !document.documentElement.classList.contains('intro-lock')");
await check("Floor explorer starts with a visible current option", "!!document.querySelector('[data-tower-trigger][aria-current=true].is-active')");
await check("Urban Kaza uses a live map and universal landmark icons", "document.querySelector('[data-uk-map] iframe').src.includes('google.com/maps') && document.querySelectorAll('[data-map-trigger] .uicon').length===4");
await check("Urban Kaza exposes every residence and a curated lightbox grid", "document.querySelectorAll('.uk-unit-card').length===7 && document.querySelectorAll('.uk-gallery [data-lb]').length===12");
await check("Urban Kaza closes on a dimmed interior scene", "document.querySelector('.uk-commitment__media') && document.querySelector('.uk-commitment .uk-wa')");
await check("Urban Kaza applies the supplied palette and responsive lockup scale", "getComputedStyle(document.body).getPropertyValue('--uk-terra').trim()==='#A6522F' && getComputedStyle(document.body).getPropertyValue('--uk-offwhite').trim()==='#F5F5DB' && document.querySelector('.uk-hero__brand img').getBoundingClientRect().width>=250");
const routes = fs.readdirSync('.').filter(p=>p.endsWith('.html')).concat(fs.readdirSync('projects').filter(p=>p.endsWith('.html')).map(p=>'projects/'+p),fs.readdirSync('news').filter(p=>p.endsWith('.html')).map(p=>'news/'+p));
for (const width of [320,390,768,820,1440]) {
 await send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<700},sessionId);
 for(const route of routes){
  await send("Page.navigate",{url:"http://localhost:8422/"+route},sessionId);
  await sleep(220);
  await check(route+" @ "+width+" layout/unique IDs", "(()=>{const ids=Array.from(document.querySelectorAll('[id]')).map(e=>e.id);return document.documentElement.scrollWidth<=innerWidth && ids.length===new Set(ids).size})()");
 }
}
await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);
await send("Page.navigate",{url:"http://localhost:8422/"},sessionId);
await sleep(500);
await check("Landing-page Insights stack one article per row on mobile", "(()=>{const cards=Array.from(document.querySelectorAll('.home-stories .story'));const lefts=new Set(cards.map(card=>Math.round(card.getBoundingClientRect().left)));return cards.length===3 && lefts.size===1 && cards.every(card=>card.getBoundingClientRect().width>300)})()");
await send("Page.navigate",{url:"http://localhost:8422/news.html"},sessionId);
await sleep(500);
await check("News feed stacks one article per row on mobile", "(()=>{const cards=Array.from(document.querySelectorAll('.news-page .story'));const lefts=new Set(cards.map(card=>Math.round(card.getBoundingClientRect().left)));return cards.length>=3 && lefts.size===1 && cards.every(card=>card.getBoundingClientRect().width>300)})()");
await send("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:1,mobile:false},sessionId);
await send("Page.navigate",{url:"http://localhost:8422/projects/urban-kaza.html"},sessionId);
await sleep(450);
await evaluate("sessionStorage.setItem('uk-intro-v4','1');location.reload()");
await sleep(900);
for (const [name, selector] of [
 ["kaza-hero", ".uk-hero"],
 ["kaza-map", ".uk-map-stage"],
 ["kaza-tower", ".uk-floor-explorer"],
 ["kaza-gallery", ".uk-gallery-grid"],
 ["kaza-units", ".uk-unit-grid"],
 ["kaza-close", ".uk-commitment"],
]) {
 await evaluate(`(()=>{const element=document.querySelector('${selector}');window.scrollTo(0,element.getBoundingClientRect().top+scrollY)})()`);
 await sleep(700);
 const shot=await send("Page.captureScreenshot",{format:"jpeg",quality:82},sessionId);
 fs.writeFileSync(`_shots/${name}.jpg`,Buffer.from(shot.data,"base64"));
}
await send("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:1,mobile:false},sessionId);
await send("Page.navigate",{url:"http://localhost:8422/"},sessionId);
await sleep(1200);
await check("Inter Light is the shared body typography", "getComputedStyle(document.body).fontFamily.includes('Inter') && getComputedStyle(document.body).fontWeight==='300'");
await check("Discovery and article cards use the universal SVG icon system", "document.querySelectorAll('.proofcard__badge .uicon').length===3 && document.querySelectorAll('.home-stories .section-icon .uicon').length===3");
await check("Portfolio lines use a delicate slow fill", "getComputedStyle(document.querySelector('.status-card__fill')).transitionDuration==='3.8s' && parseFloat(getComputedStyle(document.querySelector('.status-card__fill')).strokeWidth)<=1.25");
await check("Development statuses use the enlarged gold treatment", "parseFloat(getComputedStyle(document.querySelector('.project-status')).minHeight)>=58 && getComputedStyle(document.querySelector('.project-status')).borderRadius!=='0px'");
await check("Testimonials use the restrained editorial scale", "parseFloat(getComputedStyle(document.querySelector('.testimonial-card blockquote')).fontSize)<=19 && document.querySelector('.testimonial-card').getBoundingClientRect().width<=411");
await check("Step Inside uses the supplied official Urban Kaza mark", "document.querySelector('.tour-portal__mark--kaza').getAttribute('src').endsWith('urban-kaza-mark-official.svg')");
await check("Primary navigation replaces Why Hill Bottom with one About link", "Array.from(document.querySelectorAll('.nav a')).filter(a=>a.textContent.trim()==='About').length===1 && !Array.from(document.querySelectorAll('.nav a')).some(a=>a.textContent.includes('Why Hill Bottom'))");
await check("Insights is available in the primary navigation", "Array.from(document.querySelectorAll('.nav a')).some(a=>a.textContent.trim()==='Insights' && a.getAttribute('href').endsWith('news.html'))");
await check("Footer social links use the verified official destinations", "['https://www.linkedin.com/company/hill-bottom-properties/','https://www.instagram.com/hillbottomproperties','https://www.facebook.com/hillbottomproperties'].every(href=>Array.from(document.querySelectorAll('.social a')).some(a=>a.href===href))");
await send("Page.navigate",{url:"http://localhost:8422/projects.html"},sessionId);
await sleep(500);
await check("Projects removes the hero summary and concept chapter", "!document.querySelector('.hero .facts') && !document.body.textContent.includes('The Switch') && document.querySelectorAll('.project-stage-chip').length===3");
await check("Projects hero uses Montserrat", "getComputedStyle(document.querySelector('.hero .d1')).fontFamily.includes('Montserrat')");
await send("Page.navigate",{url:"http://localhost:8422/about.html"},sessionId);
await sleep(500);
await check("About uses symmetric icon cards and generated resident imagery", "document.querySelectorAll('.about-features .feature-card').length===17 && document.querySelector('.about-community__media').src.includes('about-residents-lifestyle.webp')");
await send("Page.navigate",{url:"http://localhost:8422/buying-from-abroad.html"},sessionId);
await sleep(500);
await check("Remote journeys use five balanced universal-icon cards", "Array.from(document.querySelectorAll('.process-icon-grid')).every(grid=>grid.querySelectorAll('.process-icon-card').length===5) && document.querySelectorAll('.process-icon-card .uicon').length===10");
await check("Diaspora FAQ uses compact accessible dropdown controls", "document.querySelectorAll('.faq details').length===7 && document.querySelectorAll('.faq__toggle').length===7 && !document.querySelector('.faq summary svg')");
await send("Page.navigate",{url:"http://localhost:8422/construction.html"},sessionId);
await sleep(500);
await check("Construction uses icon infographics without a hero fact box", "!document.querySelector('.hero .facts') && document.querySelectorAll('.construction-card__infographic').length===3 && document.querySelectorAll('.construction-card .btn--gold').length===3");
await send("Page.navigate",{url:"http://localhost:8422/projects/hillbottom-village.html"},sessionId);
await sleep(500);
await check("Village removes the hero facts and uses three proportional icon grids", "!document.querySelector('.hero .facts') && document.querySelectorAll('.project-feature-grid').length===3 && document.querySelectorAll('.project-feature-card .uicon').length===18");
await check("Village hero title uses Montserrat", "getComputedStyle(document.querySelector('.hero .d1')).fontFamily.includes('Montserrat')");
await send("Page.navigate",{url:"http://localhost:8422/projects/recreation-center.html"},sessionId);
await sleep(500);
await check("Recreation page uses the supplied Block C render set throughout", "document.querySelector('.hero__media img').src.includes('block-c-01-1400.webp') && document.querySelector('.rec-amenities__media').src.includes('block-c-08-1400.webp') && document.querySelectorAll('.rec-gallery__wall [data-lb]').length===12");
await check("Recreation amenities form a twelve-cell animated icon system", "document.querySelectorAll('.rec-amenity-card').length===12 && document.querySelectorAll('.rec-amenity-card .uicon').length===12 && !document.querySelector('.hero .facts')");
await check("Recreation hero title uses Montserrat", "getComputedStyle(document.querySelector('.hero .d1')).fontFamily.includes('Montserrat')");
for (const [name, selector] of [["rec-intro",".rec-intro"],["rec-amenities",".rec-amenities"],["rec-gallery",".rec-gallery"]]) {
 await evaluate(`(()=>{const element=document.querySelector('${selector}');window.scrollTo(0,element.getBoundingClientRect().top+scrollY)})()`);
 await sleep(650);
 const shot=await send("Page.captureScreenshot",{format:"jpeg",quality:80},sessionId);
 fs.writeFileSync(`_shots/${name}.jpg`,Buffer.from(shot.data,"base64"));
}
await send("Page.navigate",{url:"http://localhost:8422/contact.html"},sessionId);
await sleep(500);
await check("Contact removes the hero facts and organizes four sales cards", "!document.querySelector('.hero .facts') && document.querySelectorAll('.contact-card').length===4 && getComputedStyle(document.querySelector('.hero .d1')).fontFamily.includes('Montserrat')");
await check("Contact exposes two selectable styled OpenStreetMap locations", "document.querySelectorAll('[data-contact-location]').length===2 && document.querySelector('[data-contact-map-canvas]').classList.contains('leaflet-container') && document.querySelectorAll('.hb-map-marker').length===2 && !document.body.textContent.includes('Open in Maps')");
await evaluate("document.querySelectorAll('[data-contact-location]')[1].click()");
await sleep(100);
await check("Contact location selection zooms to Urban Kaza", "document.querySelectorAll('[data-contact-location]')[1].getAttribute('aria-pressed')==='true' && document.querySelector('[data-contact-map]').getAttribute('data-active-location')==='Urban Kaza' && document.querySelector('[data-contact-map-title]').textContent==='Urban Kaza'");
await evaluate("(()=>{const element=document.querySelector('.contact-map-section');window.scrollTo(0,element.getBoundingClientRect().top+scrollY)})()");
await sleep(900);
{
 const shot=await send("Page.captureScreenshot",{format:"jpeg",quality:80},sessionId);
 fs.writeFileSync("_shots/contact-map.jpg",Buffer.from(shot.data,"base64"));
}
await send("Page.navigate",{url:"http://localhost:8422/news/why-buy-property-in-ayat.html"},sessionId);
await sleep(500);
await check("Insight articles remove the hero fact box and use Montserrat titles", "!document.querySelector('.hero .facts') && getComputedStyle(document.querySelector('.hero .d1')).fontFamily.includes('Montserrat')");
await check("Insight articles use the editorial rail and balanced reading layout", "document.querySelector('.article-layout') && document.querySelector('.article-rail') && document.querySelector('.article-prose') && document.querySelectorAll('.article-rail__topics i').length>=1");
await check("The article highlights Insights in primary navigation", "document.querySelector('.nav a[aria-current=page]') && document.querySelector('.nav a[aria-current=page]').textContent.trim()==='Insights'");
await send("Page.navigate",{url:"http://localhost:8422/projects/urban-kaza.html"},sessionId);
await sleep(500);
await evaluate("sessionStorage.setItem('uk-intro-v4','1');location.reload()");
await sleep(500);
await check("Urban Kaza zoning model offers three orthographic views and five zones", "document.querySelector('.uk-hero__brand img').src.includes('urban-kaza-lockup-official.svg') && document.querySelectorAll('[data-zoning-set-view]').length===3 && document.querySelectorAll('.uk-zoning__zone').length===5 && document.querySelectorAll('[data-zoning-layer]').length===15");
await check("Urban Kaza display titles use Futura PT uppercase", "getComputedStyle(document.querySelector('.uk-location .d2')).fontFamily.includes('Futura PT') && getComputedStyle(document.querySelector('.uk-location .d2')).textTransform==='uppercase'");
await check("Urban Kaza map has no static background image", "getComputedStyle(document.querySelector('.uk-map-canvas')).backgroundImage==='none'");
await send("Page.navigate",{url:"http://localhost:8422/"},sessionId);
await sleep(900);
const {data}=await send("Page.captureScreenshot",{format:"jpeg",quality:80},sessionId);
fs.writeFileSync("_shots/final-home.jpg",Buffer.from(data,"base64"));
for (const [name, selector] of [
 ["status", ".portfolio-index"],
 ["proof", ".home-proof"],
 ["projects", ".home-projects .proj"],
 ["tours", ".home-tours"],
 ["residents", ".home-residents"],
 ["stories", ".home-stories"],
]) {
 await evaluate(`(()=>{document.documentElement.style.scrollBehavior='auto';const element=document.querySelector('${selector}');window.scrollTo(0,element.getBoundingClientRect().top+scrollY-(innerHeight-element.offsetHeight)/2)})()`);
 await sleep(650);
 const shot=await send("Page.captureScreenshot",{format:"jpeg",quality:76},sessionId);
 fs.writeFileSync(`_shots/final-${name}.jpg`,Buffer.from(shot.data,"base64"));
}
fs.writeFileSync("_shots/interactions.json",JSON.stringify({results,consoleErrors},null,2));
console.log("Total",results.length,"Failed",results.filter(r=>!r.pass).length,"Console errors",consoleErrors.length);
sock.close();proc.kill();process.exit(results.some(r=>!r.pass)||consoleErrors.length ? 1:0);
