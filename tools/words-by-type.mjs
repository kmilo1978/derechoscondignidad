import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync('docs/_audit.json', 'utf8')).filter((x) => x.robots && x.robots.startsWith('index'));
const groups = {
  servicios: (u) => /^\/servicios\/[^/]+\/$/.test(u), guías: (u) => /^\/blog\/[^/]+\/$/.test(u),
  municipios: (u) => /^\/abogado-accidentes-transito-/.test(u), otras: (u) => !/^\/(servicios\/[^/]+|blog\/[^/]+)\/$|abogado-accidentes/.test(u),
};
for (const [g, f] of Object.entries(groups)) {
  const l = p.filter((x) => f(x.u)).sort((a, b) => a.words - b.words);
  console.log(`${g}: n=${l.length} min=${l[0].words} mediana=${l[Math.floor(l.length / 2)].words} máx=${l.at(-1).words}`);
  console.log('   más cortas:', l.slice(0, 6).map((x) => `${x.u.replace(/\/$/, '').split('/').pop()}(${x.words})`).join(', '));
}
