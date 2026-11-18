// Mide el menú de escritorio: espacio entre logo, enlaces y botón en varios anchos.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const ch = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9671', '--user-data-dir=' + process.env.TEMP + '\\chr19', 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3000));
const tabs = await (await fetch('http://127.0.0.1:9671/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) pend[m.id](m.result); };
await send('Page.enable');
const expr = `(() => {
  const nav = document.querySelector('nav[aria-label="Principal"]');
  if (!nav || getComputedStyle(nav).display === 'none') return 'menú móvil';
  const logo = document.querySelector('header a[href="/"]').getBoundingClientRect();
  const btn = nav.nextElementSibling.getBoundingClientRect();
  const items = [...nav.children].map((c) => c.getBoundingClientRect());
  const first = items[0], last = items[items.length - 1];
  return JSON.stringify({ logoAMenu: Math.round(first.left - logo.right), menuABoton: Math.round(btn.left - last.right), anchoMenu: Math.round(last.right - first.left), solapa: btn.left < last.right - 1 });
})()`;
for (const w of (process.argv[2] || '1280,1300,1366,1440,1536,1920').split(',').map(Number)) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 300, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:5174/' });
  await new Promise((r) => setTimeout(r, 1200));
  console.log(w, (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value);
  if (process.argv[3]) { const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: 80, scale: 1 } }); fs.writeFileSync(`../sitio/nav-${w}.png`, Buffer.from(s.data, 'base64')); }
}
ch.kill(); process.exit(0);
