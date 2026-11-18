// Rastreo de auditoría sobre dist/: métricas técnicas, semánticas, de schema y de duplicidad.
import fs from 'node:fs';
import path from 'node:path';

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk('dist').filter((f) => f.endsWith('index.html') || f.endsWith('404.html'));
const url = (f) => { if (f.endsWith('404.html')) return '/404.html'; const r = '/' + path.relative('dist', path.dirname(f)).replace(/\\/g, '/') + '/'; return r === '//' || r === '/./' ? '/' : r; };
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ');
const text = (h) => strip(h).replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>|<nav[\s\S]*?<\/nav>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const types = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { const j = JSON.parse(m[1]); return j['@type']; } catch { return 'INVALIDO'; } });

const pages = files.map((f) => {
  const h = fs.readFileSync(f, 'utf8');
  const u = url(f);
  const body = text(h);
  const hs = [...h.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  let skip = 0; for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) skip++;
  const links = [...h.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
  return {
    u, words: body.split(' ').length, body,
    title: (h.match(/<title>(.*?)<\/title>/) || [])[1] || '', desc: (h.match(/<meta name="description" content="(.*?)"/) || [])[1] || '',
    h1: (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '') || '', hs, skip,
    canonical: (h.match(/rel="canonical" href="(.*?)"/) || [])[1] || '', og: /property="og:image"/.test(h), tw: /name="twitter:card"/.test(h),
    ogTitle: /property="og:title"/.test(h), lang: (h.match(/<html lang="(.*?)"/) || [])[1], robots: (h.match(/name="robots" content="(.*?)"/) || [])[1],
    schema: types(h), imgs: (h.match(/<img /g) || []).length, internal: links.filter((l) => l.startsWith('/')).length, external: links.filter((l) => /^https?:/.test(l)).length,
    faq: (h.match(/<details /g) || []).length, tables: (h.match(/<table/g) || []).length, pend: (h.match(/data-pendiente/g) || []).length,
    bytes: Buffer.byteLength(h), depth: u.split('/').filter(Boolean).length,
  };
});
const by = (re) => pages.filter((p) => re.test(p.u));

// ---- Duplicidad (Jaccard sobre 6-gramas) dentro de familias de páginas ----
const grams = (t) => { const w = t.toLowerCase().split(' '); const s = new Set(); for (let i = 0; i < w.length - 5; i++) s.add(w.slice(i, i + 6).join(' ')); return s; };
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };
function family(name, list) {
  const g = list.map((p) => [p, grams(p.body)]); const out = [];
  for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) out.push([g[i][0].u, g[j][0].u, jac(g[i][1], g[j][1])]);
  out.sort((a, b) => b[2] - a[2]);
  const avg = out.reduce((s, x) => s + x[2], 0) / (out.length || 1);
  console.log(`\n[${name}] ${list.length} páginas | similitud media ${(avg * 100).toFixed(1)}% | máx ${(out[0]?.[2] * 100 || 0).toFixed(1)}% (${out[0]?.[0]} ~ ${out[0]?.[1]})`);
  console.log('  Top 3 pares:', out.slice(0, 3).map((x) => `${x[0].split('/').filter(Boolean).pop()}~${x[1].split('/').filter(Boolean).pop()} ${(x[2] * 100).toFixed(0)}%`).join(' | '));
}
family('servicios', by(/^\/servicios\/[^/]+\/$/));
family('municipios', by(/^\/abogado-accidentes-transito-/));
family('guías', by(/^\/blog\/[^/]+\/$/));

// ---- Resumen técnico ----
const n = (f) => pages.filter(f).length;
console.log('\n=== Resumen ===');
console.log('Páginas rastreadas:', pages.length);
console.log('Sin canonical propio:', n((p) => !p.canonical.endsWith(p.u) && !p.u.startsWith('/lp/') && p.u !== '/no-encontrado/'));
console.log('Sin og:image:', n((p) => !p.og), '| sin twitter:card:', n((p) => !p.tw));
console.log('Imágenes <img> en todo el sitio:', pages.reduce((s, p) => s + p.imgs, 0));
console.log('Saltos de jerarquía de encabezados:', pages.filter((p) => p.skip).map((p) => p.u + '(' + p.skip + ')').join(', ') || 'ninguno');
console.log('Títulos > 60 car.:', n((p) => p.title.length > 60), '| > 70:', n((p) => p.title.length > 70), '| descripciones < 120:', n((p) => p.desc.length < 120));
console.log('Palabras: min', Math.min(...pages.map((p) => p.words)), 'mediana', pages.map((p) => p.words).sort((a, b) => a - b)[Math.floor(pages.length / 2)], 'máx', Math.max(...pages.map((p) => p.words)));
console.log('Páginas < 600 palabras (indexables):', pages.filter((p) => p.words < 600 && !/lp|no-encontrado|politica|tratamiento/.test(p.u)).map((p) => `${p.u}(${p.words})`).join(', '));
console.log('Profundidad máxima:', Math.max(...pages.map((p) => p.depth)));
console.log('Páginas con avisos "pendiente" visibles:', n((p) => p.pend), '| total avisos:', pages.reduce((s, p) => s + p.pend, 0));
const st = {}; pages.forEach((p) => p.schema.forEach((t) => { const k = [].concat(t).join('+'); st[k] = (st[k] || 0) + 1; }));
console.log('Schema por tipo:', JSON.stringify(st));
console.log('Páginas SIN FAQPage pero con ≥6 <details>:', n((p) => p.faq >= 6 && !p.schema.includes('FAQPage')));
console.log('Tamaño HTML medio (KB):', (pages.reduce((s, p) => s + p.bytes, 0) / pages.length / 1024).toFixed(0));

// ---- Canibalización: pares de títulos con alta superposición de palabras clave ----
const tok = (t) => new Set(t.toLowerCase().replace(/\|.*$/, '').replace(/[^a-záéíóúñ ]/g, '').split(' ').filter((w) => w.length > 3));
const idx = pages.filter((p) => !/lp|no-encontrado|politica|tratamiento|glosario/.test(p.u));
const cann = [];
for (let i = 0; i < idx.length; i++) for (let j = i + 1; j < idx.length; j++) { const s = jac(tok(idx[i].title), tok(idx[j].title)); if (s >= 0.6) cann.push([idx[i].u, idx[j].u, s]); }
console.log('\nPares de títulos casi idénticos (>=60% de palabras):', cann.length);
cann.slice(0, 8).forEach((c) => console.log('  ', c[0], '~', c[1], (c[2] * 100).toFixed(0) + '%'));

// ---- Preguntas repetidas entre páginas ----
const qmap = new Map();
for (const f of files) { const h = fs.readFileSync(f, 'utf8'); for (const m of h.matchAll(/<summary[^>]*>([\s\S]*?)<span class="shrink-0/g)) { const q = m[1].replace(/<[^>]+>/g, '').trim(); if (!qmap.has(q)) qmap.set(q, new Set()); qmap.get(q).add(url(f)); } }
const rep = [...qmap].filter(([, s]) => s.size > 8).sort((a, b) => b[1].size - a[1].size);
console.log('\nPreguntas distintas:', qmap.size, '| repetidas en >8 páginas:', rep.length);
rep.slice(0, 5).forEach(([q, s]) => console.log('  ', s.size, 'páginas:', q.slice(0, 80)));

// ---- Archivos técnicos ----
const sm = fs.readFileSync('dist/sitemap.xml', 'utf8');
console.log('\nsitemap: URLs', (sm.match(/<loc>/g) || []).length, '| con lastmod:', (sm.match(/<lastmod>/g) || []).length);
console.log('robots.txt:', fs.readFileSync('dist/robots.txt', 'utf8').split('\n').filter((l) => /Disallow|Allow|Sitemap|User-agent/.test(l)).join(' / '));
console.log('CSS KB:', (fs.statSync('dist/assets/style.css').size / 1024).toFixed(0), '| app.js KB:', (fs.statSync('dist/assets/app.js').size / 1024).toFixed(1), '| llms.txt:', fs.existsSync('dist/llms.txt'), '| llms-full.txt KB:', (fs.statSync('dist/llms-full.txt').size / 1024).toFixed(0));
const home = fs.readFileSync('dist/index.html', 'utf8');
console.log('Home: LegalService props:', Object.keys(JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])).join(','));
const art = fs.readFileSync('dist/blog/soat-cuanto-cubre/index.html', 'utf8');
const a = JSON.parse([...art.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((x) => x.includes('"Article"')));
console.log('Article props:', Object.keys(a).join(','), '| author:', JSON.stringify(a.author));
fs.writeFileSync('docs/_audit.json', JSON.stringify(pages.map(({ body, ...r }) => r), null, 1));
