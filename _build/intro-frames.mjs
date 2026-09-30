// node _build/intro-frames.mjs <page> <WxH> <prefix> t1,t2,...  (seconds after navigation commit)
import { spawn } from "child_process"; import fs from "fs"; import path from "path";
const [pg, dim, pre, ts] = process.argv.slice(2); const [W, H] = dim.split("x").map(Number);
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", PORT = 9351;
const proc = spawn(EDGE, ["--headless=new", "--hide-scrollbars", "--mute-audio", `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.resolve("_edge-frames")}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws; for (let i = 0; i < 60; i++) { try { ws = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page").webSocketDebuggerUrl; break; } catch { await sleep(400); } }
const sock = new WebSocket(ws); await new Promise((r) => sock.addEventListener("open", r));
let id = 0; const wait = new Map(); const errs = [];
sock.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } else if (m.method === "Runtime.exceptionThrown") errs.push(m.params.exceptionDetails.exception?.description); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); sock.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
// pause the animation clock so each frame is exact
await send("Animation.enable");
const t0 = Date.now();
await send("Page.navigate", { url: "http://localhost:8422/" + pg });
if (!process.env.REAL) await sleep(1500);
const times = ts.split(",").map(Number);
// restart all animations from 0 and seek them
for (const t of times) {
  if (process.env.REAL) { const w = t * 1000 - (Date.now() - t0); if (w > 0) await sleep(w); }
  else { await send("Runtime.evaluate", { expression: `document.getAnimations().forEach(a=>{a.pause();a.currentTime=${t * 1000}})` }); await sleep(250); }
  const s = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  fs.writeFileSync(`_shots/${pre}-${t}.jpg`, Buffer.from(s.result.data, "base64"));
}
if (errs.length) console.log(errs);
sock.close(); proc.kill(); console.log("done");
