// Revisión completa de enlaces del sitio generado (dist/):
//  - internos (absolutos y relativos), anclas (#id) en la misma página y en otras
//  - recursos en CSS (url()), manifest, imágenes, scripts
//  - URLs de sitemap.xml, llms.txt, llms-full.txt y canonical/og
//  - enlaces externos: petición HTTP real (HEAD y, si falla, GET)
import fs from 'node:fs';
import path from 'node:path';
const DIST = 'dist';
const SITE = 'https://indemnizavial.co';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const all = walk(DIST);
const html = all.filter((f) => f.endsWith('.html'));
const urlOf = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/index\.html$/, '');
const pageIds = new Map();
for (const f of html) {
  const h = fs.readFileSync(f, 'utf8');
  pageIds.set(urlOf(f), new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}
const resolveLocal = (p) => {
  const clean = decodeURIComponent(p.split('#')[0].split('?')[0]);
  const fp = path.join(DIST, clean);
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) return clean;
  if (fs.existsSync(path.join(fp, 'index.html'))) return clean.endsWith('/') ? clean : clean + '/';
  return null;
};
const broken = []; const anchors = []; const external = new Map(); let checked = 0;
const add = (from, u) => {
  if (!u || /^(mailto:|tel:|javascript:|data:|sms:|whatsapp:)/i.test(u)) return;
  if (u.startsWith(SITE)) u = u.slice(SITE.length) || '/';
  if (/^https?:\/\//i.test(u)) { if (!external.has(u)) external.set(u, new Set()); external.get(u).add(from); return; }
  if (u.startsWith('//')) return;
  checked++;
  let abs = u;
  if (u.startsWith('#')) abs = from + u;
  else if (!u.startsWith('/')) abs = new URL(u, 'http://x' + from).pathname + (u.includes('#') ? '#' + u.split('#')[1] : '');
  const [p, hash] = abs.split('#');
  const target = resolveLocal(p || from);
  if (!target) { broken.push(`${from}  ->  ${u}`); return; }
  if (hash && pageIds.has(target) && !pageIds.get(target).has(decodeURIComponent(hash))) anchors.push(`${from}  ->  ${u}`);
};
for (const f of html) {
  const from = urlOf(f); const h = fs.readFileSync(f, 'utf8');
  for (const m of h.matchAll(/\s(?:href|src|action|poster)="([^"]*)"/g)) add(from, m[1].replace(/&amp;/g, '&'));
  for (const m of h.matchAll(/\ssrcset="([^"]*)"/g)) m[1].split(',').forEach((x) => add(from, x.trim().split(/\s+/)[0]));
  for (const m of h.matchAll(/<meta[^>]+(?:property|name)="(?:og:image|og:url|twitter:image)"[^>]+content="([^"]+)"/g)) add(from, m[1]);
}
for (const f of all.filter((x) => x.endsWith('.css'))) for (const m of fs.readFileSync(f, 'utf8').matchAll(/url\(["']?([^"')]+)["']?\)/g)) if (!m[1].startsWith('data:')) add('/' + path.relative(DIST, f).split(path.sep).join('/'), m[1]);
const man = all.find((x) => /manifest|\.webmanifest$/.test(x));
if (man) for (const m of fs.readFileSync(man, 'utf8').matchAll(/"src"\s*:\s*"([^"]+)"/g)) add('/manifest', m[1]);
for (const t of ['sitemap.xml', 'llms.txt', 'llms-full.txt', 'robots.txt']) {
  const fp = path.join(DIST, t); if (!fs.existsSync(fp)) { broken.push('falta ' + t); continue; }
  for (const m of fs.readFileSync(fp, 'utf8').matchAll(/https?:\/\/[^\s)<>"\]]+/g)) add('/' + t, m[0].replace(/[.,;:]+$/, ''));
}
console.log(`HTML: ${html.length} | enlaces internos revisados: ${checked} | externos únicos: ${external.size}`);
console.log(`Internos rotos: ${broken.length}`); broken.slice(0, 40).forEach((b) => console.log('  ✗', b));
console.log(`Anclas inexistentes: ${anchors.length}`); [...new Set(anchors)].slice(0, 40).forEach((b) => console.log('  ✗', b));

// ---- Externos ----
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const probe = async (u) => {
  for (const method of ['HEAD', 'GET']) {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
      const r = await fetch(u, { method, redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA, accept: 'text/html,*/*' } });
      clearTimeout(t);
      if (r.status < 400) return { ok: true, status: r.status, final: r.url };
      if (method === 'GET') return { ok: false, status: r.status };
    } catch (e) { if (method === 'GET') return { ok: false, status: e.name === 'AbortError' ? 'timeout' : (e.cause?.code || e.message) }; }
  }
};
const list = [...external.keys()];
const res = [];
for (let i = 0; i < list.length; i += 8) res.push(...await Promise.all(list.slice(i, i + 8).map(async (u) => ({ u, ...(await probe(u)) }))));
// Sitios que bloquean scripts o tienen cadena SSL incompleta para Node, pero abren bien en navegador (verificado a mano).
const MANUAL = {
  'https://www.medicinalegal.gov.co': 'bloquea peticiones automáticas (403); abre en navegador',
  'https://www.suin-juriscol.gov.co': 'certificado intermedio no enviado; abre en navegador (200)',
  'https://www.funcionpublica.gov.co/eva/gestornormativo': 'certificado intermedio no enviado; abre en navegador (200)',
};
const isManual = (u) => Object.keys(MANUAL).find((k) => u.replace(/\/$/, '') === k);
res.filter((x) => !x.ok && isManual(x.u)).forEach((x) => console.log(`  ⚠ verificado a mano: ${x.u} — ${MANUAL[isManual(x.u)]}`));
const bad = res.filter((x) => !x.ok && !isManual(x.u));
console.log(`Externos con problema: ${bad.length} de ${res.length}`);
bad.forEach((x) => console.log(`  ✗ [${x.status}] ${x.u}\n      en: ${[...external.get(x.u)].slice(0, 3).join(', ')}${external.get(x.u).size > 3 ? ' …' : ''}`));
fs.writeFileSync('docs/_links-externos.json', JSON.stringify(res.map((x) => ({ url: x.u, ok: x.ok, status: x.status, final: x.final, paginas: [...external.get(x.u)] })), null, 1));
