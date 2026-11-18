// Genera iconos PNG exactos desde src/assets/favicon.svg usando Chrome (CDP).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const svg = fs.readFileSync('src/assets/favicon.svg', 'utf8');
const ch = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9666', '--user-data-dir=' + process.env.TEMP + '\\chr14', 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3000));
const tabs = await (await fetch('http://127.0.0.1:9666/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) pend[m.id](m.result); };
await send('Page.enable');
for (const [size, name] of [[180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: size, height: size, deviceScaleFactor: 1, mobile: false });
  const html = `<!DOCTYPE html><html><body style="margin:0;background:#fff">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`;
  await send('Page.navigate', { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(html) });
  await new Promise((r) => setTimeout(r, 800));
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: size, height: size, scale: 1 } });
  fs.writeFileSync(path.join('src/assets', name), Buffer.from(shot.data, 'base64'));
  console.log('ok', name, size);
}
ch.kill(); process.exit(0);
