import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9333;
const OUT = "_shots";
fs.mkdirSync(OUT, { recursive: true });

const shots = [
  ["article-m", "http://localhost:8422/news/why-buy-property-in-ayat.html", 390, 844, ".article-reading"],
  ["article-t", "http://localhost:8422/news/why-buy-property-in-ayat.html", 820, 1180, ".article-reading"],
  ["contact-m", "http://localhost:8422/contact.html", 390, 844, ".contact-map-section"],
  ["contact-t", "http://localhost:8422/contact.html", 820, 1180, ".contact-map-section"],
  ["village-m", "http://localhost:8422/projects/hillbottom-village.html", 390, 844, ".project-feature-grid"],
  ["recreation-t", "http://localhost:8422/projects/recreation-center.html", 820, 1180, ".rec-amenities"],
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

const report = [];
for (const [name, url, w, h, focusSelector] of shots) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 }, sessionId);
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{localStorage.setItem('hb-welcome-v2','1');sessionStorage.setItem('hb-film-loader-v2','1')}catch(e){}" }, sessionId);
  await send("Page.navigate", { url }, sessionId);
  await sleep(1400);
  // trigger every reveal by scrolling the page in steps, then return to top
  await send("Runtime.evaluate", { expression: `(async()=>{document.documentElement.style.scrollBehavior='auto';const H=document.body.scrollHeight;for(let y=0;y<H;y+=${Math.floor(h * 0.8)}){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,450));})()`, awaitPromise: true }, sessionId);
  await sleep(500);
  if (focusSelector) {
    await send("Runtime.evaluate", { expression: `(()=>{const el=document.querySelector(${JSON.stringify(focusSelector)});if(el)window.scrollTo(0,el.getBoundingClientRect().top+scrollY-80)})()` }, sessionId);
    await sleep(500);
    const focused = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 }, sessionId);
    fs.writeFileSync(path.join(OUT, "review-" + name + ".jpg"), Buffer.from(focused.data, "base64"));
  }
  const metrics = await send("Page.getLayoutMetrics", {}, sessionId);
  const cw = Math.ceil(metrics.cssContentSize.width), chh = Math.ceil(metrics.cssContentSize.height);
  const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: cw, height: Math.min(chh, 30000), scale: 1 } }, sessionId);
  fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(data, "base64"));
  // overflow audit
  const audit = await send("Runtime.evaluate", {
    expression: `JSON.stringify((()=>{const vw=document.documentElement.clientWidth;const bad=[];document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect();if(r.width>0&&(r.right>vw+1.5||r.left<-1.5)){const cs=getComputedStyle(el);if(cs.position==='fixed')return;bad.push((el.tagName.toLowerCase()+'.'+(el.className&&el.className.toString?el.className.toString().split(' ').filter(Boolean).slice(0,3).join('.'):'')).slice(0,60)+' L'+Math.round(r.left)+' R'+Math.round(r.right));}});return {vw,docW:document.documentElement.scrollWidth,overflow:[...new Set(bad)].slice(0,12)};})())`,
    returnByValue: true,
  }, sessionId);
  report.push({ name, size: cw + "x" + chh, ...JSON.parse(audit.result.value) });
  console.log(name.padEnd(12), (cw + "x" + chh).padEnd(12), "docW=" + JSON.parse(audit.result.value).docW, JSON.parse(audit.result.value).overflow.length ? "OVERFLOW: " + JSON.parse(audit.result.value).overflow.join(" | ") : "");
}
fs.writeFileSync("_shots/audit.json", JSON.stringify({ report, consoleErrors: [...new Set(consoleErrors)] }, null, 1));
console.log("\nconsole errors:", [...new Set(consoleErrors)].slice(0, 10));
sock.close(); proc.kill();
process.exit(0);
