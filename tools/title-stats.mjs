import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync('docs/_audit.json', 'utf8')).filter((x) => x.robots && x.robots.startsWith('index'));
const len = p.map((x) => x.title.length);
console.log('indexables:', p.length, '| títulos >60:', len.filter((l) => l > 60).length, '| >65:', len.filter((l) => l > 65).length, '| >70:', len.filter((l) => l > 70).length, '| máx:', Math.max(...len));
console.log('descripciones <120:', p.filter((x) => x.desc.length < 120).length, '| >160:', p.filter((x) => x.desc.length > 160).length);
const th = p.filter((x) => x.words < 600).map((x) => `${x.u}(${x.words})`);
console.log('<600 palabras:', th.join(', '));
console.log('H1 vacíos o múltiples:', p.filter((x) => x.hs.filter((h) => h === 1).length !== 1).length);
console.log('promedio enlaces internos por página:', (p.reduce((s, x) => s + x.internal, 0) / p.length).toFixed(0), '| enlaces externos totales:', p.reduce((s, x) => s + x.external, 0));
