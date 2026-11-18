// Recorta los retratos circulares de la captura del equipo (Chrome CDP + canvas).
// Uso: node tools/crop-team.mjs "<ruta captura>"
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const src = process.argv[2];
const slugs = ['andres-restrepo', 'alejandro-botero', 'yudy-elena-moreno', 'juan-esteban-montoya', 'daniel-montoya'];
const b64 = fs.readFileSync(src).toString('base64');
const ch = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--remote-debugging-port=9672', '--user-data-dir=' + process.env.TEMP + '\\chr20', 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3000));
const tabs = await (await fetch('http://127.0.0.1:9672/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) pend[m.id](m.result); };
await send('Runtime.enable');
const expr = `new Promise((res) => {
  const img = new Image();
  img.onload = () => {
    const W = img.width, H = img.height;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, W, H).data;
    const lum = (i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    // Fondo navy ~ (15,23,42) / tarjetas (24,32,52). Un píxel "de foto" difiere claramente del navy.
    const isPhoto = (px, py) => { const i = (py * W + px) * 4; const r = d[i], g = d[i + 1], b = d[i + 2]; return !(b > r + 8 && b > g + 4 && lum(i) < 70); };
    // Franja vertical de los retratos: entre la subtítulo y los nombres
    const y0 = Math.round(H * 0.36), y1 = Math.round(H * 0.73);
    const colHas = []; for (let px = 0; px < W; px++) { let n = 0; for (let py = y0; py < y1; py++) if (isPhoto(px, py)) n++; colHas.push(n > 12); }
    const runs = []; let s = -1; for (let px = 0; px <= W; px++) { const v = colHas[px]; if (v && s < 0) s = px; if (!v && s >= 0) { if (px - s > 40) runs.push([s, px - 1]); s = -1; } }
    const out = runs.map(([a, b]) => {
      // Recorre la columna central: primer píxel de foto (top) y hasta 3 filas seguidas de fondo (bottom)
      const mx = Math.round((a + b) / 2); let top = -1, bot = -1, gap = 0;
      for (let py = y0; py < H; py++) {
        const p = isPhoto(mx, py) || isPhoto(mx - 6, py) || isPhoto(mx + 6, py);
        if (top < 0) { if (p) top = py; continue; }
        if (p) { bot = py; gap = 0; } else if (++gap >= 3) break;
      }
      const dia = Math.min(b - a, bot - top); const cx = (a + b) / 2, cy = (top + bot) / 2, rad = dia / 2 - 3; // -3 quita el borde del círculo
      const S = 256, o = document.createElement('canvas'); o.width = S; o.height = S; const ox = o.getContext('2d');
      ox.imageSmoothingQuality = 'high';
      ox.beginPath(); ox.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); ox.clip();
      ox.drawImage(c, cx - rad, cy - rad, rad * 2, rad * 2, 0, 0, S, S);
      return { box: [a, b, top, bot], rad: Math.round(rad), data: o.toDataURL('image/webp', 0.9) };
    });
    res(JSON.stringify(out));
  };
  img.src = 'data:image/png;base64,${b64}';
})`;
const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
const list = JSON.parse(r.result.value);
console.log('retratos detectados:', list.length);
fs.mkdirSync('src/assets/team', { recursive: true });
list.forEach((p, i) => {
  if (!slugs[i]) return;
  const f = path.join('src/assets/team', slugs[i] + '.webp');
  fs.writeFileSync(f, Buffer.from(p.data.split(',')[1], 'base64'));
  console.log(slugs[i], 'caja', p.box.join(','), 'radio', p.rad, '->', f);
});
ch.kill(); process.exit(0);
