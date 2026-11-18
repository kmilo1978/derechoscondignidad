import fs from 'node:fs';
let b = fs.readFileSync('build.mjs', 'utf8');
let miss = 0;
const rep = (a, c) => { if (!b.includes(a)) { miss++; console.log('NO ENCONTRADO:', a.slice(0, 90)); return; } b = b.replace(a, () => c); };

rep("import { MUNICIPIOS, muniFaqs } from './src/municipios.mjs';", "import { MUNICIPIOS, muniFaqs, DIRECTORIO_URL, RECURSOS } from './src/municipios.mjs';");

const i = b.indexOf('function municipios() {');
const j = b.indexOf('// ---------- Calculadora orientativa');
if (i < 0 || j < 0) { console.log('NO ENCONTRADO: municipios()'); process.exit(1); }
const fn = `function municipios() {
  areaMetro();
  for (const m of MUNICIPIOS) {
    TIPSET.clear();
    const url = muniUrl(m);
    const crumbs = [['Inicio', '/'], ['Área metropolitana', '/area-metropolitana/'], [m.name, url]];
    const near = m.vecinos.map((n) => MUNICIPIOS.find((x) => x.name === n)).filter(Boolean);
    const a = m.autoridad;
    const extra = RECURSOS[m.slug] || [];
    const h2c = 'text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5';
    const body = pageHero({ crumbs, h1: \`Abogado de accidentes de tránsito en \${m.name}\`, sub: m.hook }) + \`
<div class="max-w-7xl mx-auto px-6 py-14 space-y-14">
  \${answerBox(\`Si sufriste un accidente de tránsito en \${m.name}, el SOAT atiende tu atención médica inicial sin importar quién tuvo la culpa y los demás perjuicios se reclaman al responsable y a su aseguradora. Lo que depende del municipio es la autoridad que elabora el informe (\${a.nombre}) y quién administra la vía donde ocurrió. Antes de firmar acuerdos, reúne tus soportes y pide una revisión.\`)}
  \${SITE.coverageConfirmed ? '' : pending(\`confirmar con la firma que presta servicio en \${m.name}, la modalidad de atención y validar los datos locales de esta página.\`)}
  <section id="contexto" class="scroll-mt-28 grid lg:grid-cols-[1.4fr_1fr] gap-10"><div><h2 class="\${h2c}">Accidentes en \${esc(m.name)}: contexto útil</h2><p class="leading-relaxed mb-4">\${tipify(esc(m.p1))}</p><p class="leading-relaxed mb-4">\${tipify(esc(m.p2))}</p><p class="leading-relaxed">\${tipify(esc(m.p3))}</p></div>
    <aside class="bg-white border border-slate-200 rounded-2xl p-6 text-sm space-y-3 self-start"><p class="font-semibold text-navy-900">Datos de referencia</p><dl class="space-y-2"><div><dt class="text-slate-500">Zona</dt><dd class="font-medium text-navy-900 capitalize">\${m.zona} del Valle de Aburrá</dd></div><div><dt class="text-slate-500">Corredores</dt><dd class="font-medium text-navy-900">\${esc(m.vias)}</dd></div><div><dt class="text-slate-500">Transporte</dt><dd class="font-medium text-navy-900">\${esc(m.transporte)}</dd></div>\${near.length ? \`<div><dt class="text-slate-500">Municipios cercanos</dt><dd class="font-medium text-navy-900">\${near.map((n) => \`<a class="underline" href="\${muniUrl(n)}">\${esc(n.name)}</a>\`).join(', ')}\${m.vecinos.includes('Medellín') ? ', <a class="underline" href="/">Medellín</a>' : ''}</dd></div>\` : ''}</dl><p class="text-xs text-slate-400">Información general; verifica datos locales en fuentes oficiales.</p></aside></section>
  <section id="primeras-24-horas" class="scroll-mt-28"><h2 class="\${h2c}">Primeras 24 horas si el accidente fue en \${esc(m.name)}</h2>
    <p class="leading-relaxed mb-5">Los pasos generales (atención médica, pruebas, datos del otro conductor y no firmar acuerdos) están en nuestra <a class="underline text-navy-900 font-medium" href="/blog/que-hacer-despues-accidente-transito/">guía de qué hacer después de un accidente</a>. Lo específico de \${esc(m.name)}:</p>
    \${bullets([\`Pide el informe a la \${a.nombre} (\${a.dir}). \${a.nota}\`, \`Anota la dirección exacta con nomenclatura y puntos de referencia: en \${m.name} esto define qué autoridad atendió y de quién es la vía.\`, \`Pide cuanto antes las cámaras de negocios y edificios de la zona, y deja constancia escrita de la solicitud.\`, \`Guarda la historia clínica de cada institución que te atienda y las facturas desde el primer día.\`])}</section>
  <section id="escenarios" class="scroll-mt-28"><h2 class="\${h2c}">Situaciones frecuentes en \${esc(m.name)} y qué se revisa</h2><div class="grid md:grid-cols-3 gap-5">\${m.escenarios.map(([t, d]) => \`<article class="bg-white border border-slate-200 rounded-2xl p-6"><h3 class="font-semibold text-navy-900">\${esc(t)}</h3><p class="mt-2 text-sm leading-relaxed">\${tipify(esc(d))}</p></article>\`).join('')}</div></section>
  <section id="autoridad" class="scroll-mt-28"><h2 class="\${h2c}">Autoridad de tránsito y recursos oficiales</h2>
    <div class="bg-white border border-slate-200 rounded-2xl p-6 grid md:grid-cols-2 gap-6 text-sm"><div><p class="font-semibold text-navy-900 text-base">\${esc(a.nombre)}</p><dl class="mt-3 space-y-2"><div><dt class="text-slate-500">Dirección</dt><dd class="text-navy-900">\${esc(a.dir)}</dd></div><div><dt class="text-slate-500">Teléfono</dt><dd class="text-navy-900">\${esc(a.tel)}</dd></div></dl><p class="mt-3 text-slate-500">\${esc(a.nota)}</p></div>
      <div><p class="font-semibold text-navy-900">Enlaces oficiales</p><ul class="mt-3 space-y-2"><li><a class="underline text-navy-900" href="\${a.web}" target="_blank" rel="noopener">\${esc(a.nombre)}: sitio oficial</a></li>\${extra.map(([l, u]) => \`<li><a class="underline text-navy-900" href="\${u}" target="_blank" rel="noopener">\${esc(l)}</a></li>\`).join('')}<li><a class="underline text-navy-900" href="\${DIRECTORIO_URL}" target="_blank" rel="noopener">Directorio oficial de secretarías de tránsito del Valle de Aburrá</a></li></ul><p class="mt-3 text-xs text-slate-400">Las direcciones y teléfonos cambian: confirma siempre en el canal oficial.</p></div></div></section>
  <section id="servicios" class="scroll-mt-28"><h2 class="\${h2c}">Servicios más consultados desde \${esc(m.name)}</h2><div class="flex flex-wrap gap-3">\${m.servicios.map((s) => \`<a href="\${svcUrl(s)}" class="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-gold-500 rounded-full px-5 py-3 text-navy-900 font-medium">\${esc(SERVICES[s].short)}\${ic('arrow', 'w-4 h-4 text-gold-600')}</a>\`).join('')}</div></section>
  <section class="bg-white border border-slate-200 rounded-2xl p-6"><p class="font-semibold text-navy-900">Otros municipios del Valle de Aburrá</p><p class="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-1">\${MUNICIPIOS.filter((x) => x !== m).map((x) => \`<a class="underline text-navy-900" href="\${muniUrl(x)}">\${esc(x.name)}</a>\`).join('')}<a class="underline text-navy-900" href="/area-metropolitana/">Ver todos</a></p></section>
  <p class="text-xs text-slate-400">Contenido informativo; no constituye asesoría jurídica ni garantiza resultados.</p>
</div>\` + ctaFinal(\`¿Tu accidente fue en \${m.name}?\`, 'Cuéntanos qué pasó. Revisamos tu caso y te explicamos tus opciones, sin presiones.');
    render({ url, title: \`Abogado de accidentes de tránsito en \${m.name} | \${SITE.name}\`, desc: m.desc, body, crumbs,
      schema: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: \`Abogado de accidentes de tránsito en \${m.name}\`, url: SITE.url + url, inLanguage: 'es-CO', datePublished: SITE.published, dateModified: SITE.lastReview, about: { '@type': 'City', name: m.name } }],
      faq: { own: muniFaqs(m), pools: ['cobertura', 'primeros'], seed: m.slug, min: 8 } });
  }
}

`;
b = b.slice(0, i) + fn + b.slice(j);
fs.writeFileSync('build.mjs', b);

// Recursos locales verificados
let mu = fs.readFileSync('src/municipios.mjs', 'utf8');
if (!mu.includes('export const RECURSOS')) {
  mu += `
// Recursos locales adicionales (fuentes oficiales o del operador de tránsito)
export const RECURSOS = {
  sabaneta: [['Observatorio municipal de Sabaneta: movilidad y accidentalidad', 'https://observatorio.sabaneta.gov.co/estadisticas/habitat-y-territorio/movilidad-y-transporte/']],
  'la-estrella': [['EMTRASUR: operador de los servicios de tránsito de La Estrella', 'https://emtrasur.com.co/tramites-de-transito/']],
};
`;
  fs.writeFileSync('src/municipios.mjs', mu);
}
console.log('patch8 listo. Anclas no encontradas:', miss);
