// Revisa desbordes horizontales y objetivos táctiles pequeños en varios anchos (Chrome CDP).
import { spawn } from 'node:child_process';
const BASE = 'http://localhost:5174';
const pages = ['/', '/servicios/', '/servicios/', '/blog/', '/calculadora-indemnizacion/', '/contacto/', '/area-metropolitana/', '/glosario/', '/honorarios-cuota-litis/', '/nosotros/'];
const extra = process.argv.slice(2);
const sizes = [[320, 640], [375, 667], [414, 896], [768, 1024], [1024, 768], [1280, 800], [1920, 1080]];
const ch = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9667', '--user-data-dir=' + process.env.TEMP + '\\chr15', 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3000));
const tabs = await (await fetch('http://127.0.0.1:9667/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) pend[m.id](m.result); };
await send('Page.enable'); await send('Runtime.enable');
const expr = `(() => {
  const W = document.documentElement.clientWidth;
  const over = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > W + 1 && getComputedStyle(el).position !== 'fixed') {
      let p = el.parentElement, clipped = false;
      while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') { clipped = true; break; } p = p.parentElement; }
      if (!clipped) over.push(el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 50) + ' r=' + Math.round(r.right));
    }
  });
  const small = [];
  if (W < 1024) document.querySelectorAll('a,button,summary,input,select,textarea').forEach((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (r.width && cs.visibility !== 'hidden' && cs.display !== 'none' && (r.height < 40) && !(el.textContent || '').startsWith('Saltar') && !el.closest('p,li,dd,td,.prose') ) small.push((el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30) + ' h=' + Math.round(r.height));
  });
  return JSON.stringify({ sw: document.documentElement.scrollWidth, W, over: over.slice(0, 5), small: small.slice(0, 6) });
})()`;
let bad = 0;
const list = [...new Set(extra.length ? extra : pages)];
for (const [w, h] of sizes) {
  for (const p of list) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 800 });
    await send('Emulation.setTouchEmulationEnabled', { enabled: w < 800, maxTouchPoints: 5 });
    await send('Page.navigate', { url: BASE + p });
    await new Promise((r) => setTimeout(r, 900));
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    const o = JSON.parse(res.result.value);
    if (o.sw > o.W + 1 || o.over.length || o.small.length) { bad++; console.log(w, p, JSON.stringify(o)); }
  }
}
console.log('problemas:', bad);
ch.kill(); process.exit(0);
