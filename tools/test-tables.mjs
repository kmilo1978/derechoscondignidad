// Revisa en todas las páginas con tablas que nada se salga del ancho (Chrome CDP).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []);
const urls = walk('dist').filter((f) => fs.readFileSync(f, 'utf8').includes('<table')).map((f) => '/' + path.relative('dist', path.dirname(f)).split(path.sep).join('/') + '/').map((u) => u.replace('//', '/'));
console.log('páginas con tablas:', urls.length);
const ch = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9670', '--user-data-dir=' + process.env.TEMP + '\\chr18', 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3000));
const tabs = await (await fetch('http://127.0.0.1:9670/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) pend[m.id](m.result); };
await send('Page.enable');
const expr = `(() => {
  const W = document.documentElement.clientWidth, bad = [];
  document.querySelectorAll('.rtable').forEach((w, i) => {
    const r = w.getBoundingClientRect(), t = w.querySelector('table').getBoundingClientRect();
    const scroll = w.scrollWidth > w.clientWidth + 1;
    if (r.right > W + 1 || t.right > W + 1 || scroll) bad.push('tabla' + i + ' wrap=' + Math.round(r.right) + ' table=' + Math.round(t.right) + (scroll ? ' scroll' : ''));
  });
  return JSON.stringify({ W, sw: document.documentElement.scrollWidth, bad });
})()`;
let n = 0;
for (const w of [320, 375, 414, 640, 768, 1024, 1280]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 800 });
  for (const u of urls) {
    await send('Page.navigate', { url: 'http://localhost:5174' + u });
    await new Promise((r) => setTimeout(r, 700));
    const o = JSON.parse((await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value);
    if (o.bad.length || o.sw > o.W + 1) { n++; console.log(w, u, JSON.stringify(o)); }
  }
}
// Capturas de ejemplo
for (const [w, name] of [[375, 'tabla-375.png'], [768, 'tabla-768.png']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 800 });
  await send('Page.navigate', { url: 'http://localhost:5174/' });
  await new Promise((r) => setTimeout(r, 900));
  const y = (await send('Runtime.evaluate', { expression: `(() => { const el = document.querySelector('.rtable'); el.scrollIntoView(); return window.scrollY; })()`, returnByValue: true })).result.value;
  await new Promise((r) => setTimeout(r, 300));
  const s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('../sitio/' + name, Buffer.from(s.data, 'base64'));
}
console.log('problemas:', n);
ch.kill(); process.exit(0);
