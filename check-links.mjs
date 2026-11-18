import fs from 'node:fs';
import path from 'node:path';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk('dist').filter((f) => f.endsWith('.html'));
const bad = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const u = m[1];
    const p = path.join('dist', u);
    if (!(fs.existsSync(p) && fs.statSync(p).isFile()) && !fs.existsSync(path.join(p, 'index.html'))) bad.add(`${f} -> ${u}`);
  }
}
console.log('Archivos HTML:', files.length, '| Enlaces rotos:', bad.size);
[...bad].slice(0, 20).forEach((b) => console.log(b));
