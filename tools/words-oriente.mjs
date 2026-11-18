import fs from 'node:fs';
for (const s of ['rionegro', 'la-ceja', 'el-carmen-de-viboral', 'el-retiro', 'bello']) {
  const h = fs.readFileSync(`dist/abogado-accidentes-transito-${s}/index.html`, 'utf8');
  const main = (h.match(/<main[\s\S]*?<\/main>/) || [h])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
  console.log(s.padEnd(22), main.split(/\s+/).filter((w) => /[a-záéíóúñü0-9]/i.test(w)).length, 'palabras');
}
