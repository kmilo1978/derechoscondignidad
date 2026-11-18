import fs from 'node:fs';
import { SERVICES } from '../src/content.mjs';
import { ARTICLES } from '../src/articles.mjs';
const x = JSON.parse(fs.readFileSync('tools/excel.json', 'utf8'));
const have = new Set(['/', '/servicios/', ...Object.keys(SERVICES).map((s) => `/servicios/${s}/`), '/honorarios-cuota-litis/', '/nosotros/', '/preguntas-frecuentes/', '/blog/', '/contacto/', '/politica-de-privacidad/', '/tratamiento-de-datos/', ...ARTICLES.map((a) => `/blog/${a.slug}/`)]);
const kw = x.Keywords.slice(1).filter((r) => r[0]);
const urls = new Map();
for (const r of kw) { const u = r[4]; if (!urls.has(u)) urls.set(u, []); urls.get(u).push(r[0]); }
console.log('Keywords:', kw.length, '| URLs destino distintas:', urls.size);
console.log('\nURLs destino del Excel SIN página en el sitio:');
for (const [u, k] of urls) if (!have.has(u)) console.log(' ', u, '<-', k.length, 'kw');
console.log('\nBlog del Excel (título -> ¿cubierto?):');
for (const r of x.Blog.slice(1)) console.log(' ', r[1], '|', r[4].slice(0, 70), '|', r[5]);
console.log('\nAlertas:'); x.Alertas.slice(1).forEach((r) => console.log(' -', r[1]));
