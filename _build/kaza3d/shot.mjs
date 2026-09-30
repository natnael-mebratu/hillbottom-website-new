// screenshots of the zoning section: node _build/kaza3d/shot.mjs
import { spawn } from "child_process"; import fs from "fs"; import path from "path";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", PORT = 9361;
const proc = spawn(EDGE, ["--headless=new", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.resolve("_edge-zone")}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws; for (let i = 0; i < 60; i++) { try { ws = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page").webSocketDebuggerUrl; break; } catch { await sleep(400); } }
const sock = new WebSocket(ws); await new Promise((r) => sock.addEventListener("open", r));
let id = 0; const wait = new Map(); const errs = [];
sock.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } else if (m.method === "Runtime.exceptionThrown") errs.push(m.params.exceptionDetails.exception?.description); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); sock.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send("Runtime.evaluate", { expression: x, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('uk-intro-v4','1');localStorage.setItem('hb-welcome-v2','1')}catch(e){}" });
for (const [n, w, h, act] of [["zd-aerial", 1440, 900, ""], ["zd-low", 1440, 900, "document.querySelector('[data-zoning-set-view=low]').click();document.querySelectorAll('.uk-zoning__zone')[1].click()"], ["zd-elev", 1440, 900, "document.querySelector('[data-zoning-set-view=elevation]').click();document.querySelectorAll('.uk-zoning__zone')[4].click()"], ["zm", 390, 844, "document.querySelectorAll('.uk-zoning__zone')[3].click()"]]) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
  await send("Page.navigate", { url: "http://localhost:8422/projects/urban-kaza.html" }); await sleep(2000);
  await ev(`document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.querySelector('.uk-zoning').scrollIntoView();window.scrollBy(0,${w < 700 ? 0 : -40});new Promise(r=>setTimeout(r,800))`);
  await ev(act + ";new Promise(r=>setTimeout(r,1800))");
  const s = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  fs.writeFileSync(`_shots/${n}.jpg`, Buffer.from(s.result.data, "base64"));
}
console.log("errors", errs); sock.close(); proc.kill();
