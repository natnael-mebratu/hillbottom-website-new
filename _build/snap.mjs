// node _build/snap.mjs name=url@WxH[:full] ... -> _shots/<name>.png  (intros skipped, reveals forced)
import { spawn } from "child_process"; import fs from "fs"; import path from "path";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", PORT = 9341, OUT = "_shots";
fs.mkdirSync(OUT, { recursive: true });
const jobs = process.argv.slice(2).map((a) => { const [n, rest] = a.split("="); const [u, dim] = rest.split("@"); const [wh, full] = dim.split(":"); const [w, h] = wh.split("x").map(Number); return { n, u: u.startsWith("http") ? u : "http://localhost:8422/" + u, w, h, full: full === "full" }; });
const proc = spawn(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--mute-audio", `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.resolve("_edge-snap")}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws; for (let i = 0; i < 60; i++) { try { ws = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page").webSocketDebuggerUrl; break; } catch { await sleep(400); } }
const sock = new WebSocket(ws); await new Promise((r) => sock.addEventListener("open", r));
let id = 0; const wait = new Map(); const logs = [];
sock.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } else if (m.method === "Runtime.exceptionThrown") logs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); else if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") logs.push(m.params.args.map((a) => a.value).join(" ")); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); sock.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Page.addScriptToEvaluateOnNewDocument", { source: process.env.KEEP_INTRO ? "" : "try{sessionStorage.setItem('hb-film-loader-v2','1');sessionStorage.setItem('hb-intro-v3','1');sessionStorage.setItem('urban-kaza-intro-v3','1');sessionStorage.setItem('urban-kaza-intro-v4','1');localStorage.setItem('hb-welcome-v2','1')}catch(e){}" });
for (const j of jobs) {
  await send("Emulation.setDeviceMetricsOverride", { width: j.w, height: j.h, deviceScaleFactor: 1, mobile: j.w < 700 });
  await send("Page.navigate", { url: j.u }); await sleep(+(process.env.WAIT || 2200));
  if (!process.env.KEEP_INTRO) await ev(`document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('.rv,.alt').forEach(e=>e.classList.add('in'));document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');new Promise(r=>setTimeout(r,900))`);
  if (j.full) {
    const H = await ev("document.documentElement.scrollHeight");
    let k = 0;
    for (let y = 0; y < H && k < 40; y += j.h, k++) {
      await ev(`window.scrollTo(0,${y});new Promise(r=>setTimeout(r,700))`);
      const s = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 });
      fs.writeFileSync(`${OUT}/${j.n}_${k}.jpg`, Buffer.from(s.result.data, "base64"));
    }
    console.log(j.n, "frames", k, "height", H);
  } else {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${OUT}/${j.n}.png`, Buffer.from(shot.result.data, "base64"));
  }
  const ov = await ev("document.documentElement.scrollWidth>innerWidth+1");
  console.log(j.n, "ok", ov ? "H-OVERFLOW" : "");
}
if (logs.length) console.log("console errors:", logs.slice(0, 10));
sock.close(); proc.kill();
