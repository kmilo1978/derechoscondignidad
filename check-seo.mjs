import fs from 'node:fs';
import path from 'node:path';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk('dist').filter((f) => f.endsWith('.html'));
const titles = new Map(); const metas = new Map(); let problems = 0;
const bad = (f, m) => { problems++; console.log('✗', f.replace('dist', ''), m); };
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const t = (h.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const d = (h.match(/<meta name="description" content="(.*?)"/) || [])[1] || '';
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) bad(f, `h1=${h1}`);
  if (t.length < 20 || t.length > 75) bad(f, `title ${t.length} car.`);
  if (d.length < 70 || d.length > 175) bad(f, `meta ${d.length} car.`);
  if (titles.has(t)) bad(f, 'title duplicado'); titles.set(t, f);
  if (metas.has(d)) bad(f, 'meta duplicada'); metas.set(d, f);
  if (!/rel="canonical"/.test(h)) bad(f, 'sin canonical');
  const rel = f.replace('dist', '').replace(/\\/g, '/');
  const exempt = /\/(politica-de-privacidad|tratamiento-de-datos|terminos-de-uso|politica-de-cookies|no-encontrado)\/|\/lp\/|404\.html/.test(rel);
  const nFaq = (h.match(/<details /g) || []).length;
  if (!exempt && nFaq < 6) bad(f, `solo ${nFaq} preguntas frecuentes (mínimo 6)`);
  if (rel !== '/index.html' && !exempt && !/aria-label="Migas de pan"/.test(h)) bad(f, 'sin migas de pan');
  if (/\$\{|undefined|\[object Object\]/.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) bad(f, 'plantilla sin resolver (${…}, undefined u [object Object])');
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { bad(f, 'JSON-LD inválido'); } }
  const ids = [...h.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) bad(f, 'ids duplicados: ' + [...new Set(dup)].join(','));
  for (const m of h.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(m[1])) bad(f, 'ancla rota #' + m[1]);
}
console.log(`Revisadas ${files.length} páginas. Problemas: ${problems}`);
