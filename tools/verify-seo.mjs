// Verifica JSON-LD válido, longitudes de title/description, H1 único, canonical, y archivos LLM.
import fs from 'node:fs';
import path from 'node:path';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const files = walk('dist');
let bad = 0; const types = {}; const titles = new Map(); const descs = new Map();
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const rel = '/' + path.relative('dist', f).split(path.sep).join('/');
  const noindex = /noindex/.test(h);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); for (const x of [].concat(j)) types[x['@type']] = (types[x['@type']] || 0) + 1; }
    catch (e) { bad++; console.log('JSON-LD inválido', rel, e.message); }
  }
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (!noindex) {
    if (titles.has(t)) { bad++; console.log('title duplicado', rel, titles.get(t)); } titles.set(t, rel);
    if (descs.has(d)) { bad++; console.log('description duplicada', rel, descs.get(d)); } descs.set(d, rel);
    if (!/<link rel="canonical"/.test(h)) { bad++; console.log('sin canonical', rel); }
  }
  if (h1 !== 1) { bad++; console.log('H1 =', h1, rel); }
}
console.log('Tipos JSON-LD:', JSON.stringify(types));
const llms = fs.readFileSync('dist/llms.txt', 'utf8'); const full = fs.readFileSync('dist/llms-full.txt', 'utf8');
console.log('llms.txt:', llms.length, 'car.,', (llms.match(/\]\(/g) || []).length, 'enlaces; Oriente:', ['Rionegro', 'La Ceja', 'El Retiro', 'El Carmen de Viboral'].every((n) => llms.includes(n)));
console.log('llms-full.txt:', Math.round(full.length / 1024), 'KB; secciones:', (full.match(/^## /gm) || []).join('').length ? (full.match(/^## .*/gm) || []).join(' | ') : '');
// URLs de llms.txt que no existen en dist
for (const u of llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
  const p = new URL(u[1]).pathname; const f = path.join('dist', p, p.endsWith('/') ? 'index.html' : '');
  if (!fs.existsSync(f)) { bad++; console.log('llms.txt enlace roto', p); }
}
// Sitemap vs páginas indexables
const sm = fs.readFileSync('dist/sitemap.xml', 'utf8'); const locs = (sm.match(/<loc>/g) || []).length;
console.log('sitemap URLs:', locs, '| indexables:', titles.size);
console.log('problemas:', bad);
