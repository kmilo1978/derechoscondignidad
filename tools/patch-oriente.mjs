import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('no encontrado: ' + a.slice(0, 80)); s = s.split(a).join(b); };

r("import { MUNICIPIOS, muniFaqs, DIRECTORIO_URL, RECURSOS } from './src/municipios.mjs';",
  "import { MUNICIPIOS, muniFaqs, DIRECTORIO_URL, RECURSOS, REGIONES, regionOf } from './src/municipios.mjs';");

// ---- Hub de cobertura ----
r("const crumbs = [['Inicio', '/'], ['Área metropolitana', '/area-metropolitana/']];\n  const body = pageHero({ crumbs, h1: 'Abogado de accidentes de tránsito en el Valle de Aburrá', sub: 'Orientamos a víctimas de accidentes en Medellín y en los municipios del área metropolitana: Bello, Itagüí, Envigado, Sabaneta, La Estrella, Caldas, Copacabana, Girardota y Barbosa.', ctas: false })",
  "const crumbs = [['Inicio', '/'], ['Cobertura', '/area-metropolitana/']];\n  const byReg = (k) => MUNICIPIOS.filter((m) => regionOf(m) === k);\n  const names = (k) => byReg(k).map((m) => m.name).join(', ');\n  const card = (m) => `<a href=\"${muniUrl(m)}\" class=\"group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all\"><p class=\"text-xs uppercase tracking-wide text-gold-700 font-semibold\">${regionOf(m) === 'oriente' ? 'Oriente antioqueño' : 'Zona ' + m.zona}</p><h3 class=\"mt-1 font-semibold text-navy-900 text-lg\">${esc(m.name)}</h3><p class=\"mt-2 text-sm\">Qué hacer si el accidente ocurrió en ${esc(m.name)} y cómo reunir los soportes.</p><span class=\"mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900\">Ver página ${ic('arrow', 'w-4 h-4')}</span></a>`;\n  const body = pageHero({ crumbs, h1: 'Abogado de accidentes de tránsito en el Valle de Aburrá y el Oriente antioqueño', sub: `Orientamos a víctimas de accidentes en Medellín, en el área metropolitana (${names('aburra')}) y en el Oriente antioqueño (${names('oriente')}).`, ctas: false })");

const gStart = s.indexOf('<section><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Municipios que orientamos</h2>');
const gEnd = s.indexOf('</div></section>', gStart) + '</div></section>'.length;
if (gStart < 0) throw new Error('grid');
s = s.slice(0, gStart) + `<section><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Valle de Aburrá</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <a href="/" class="group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all"><p class="text-xs uppercase tracking-wide text-gold-700 font-semibold">Sede principal</p><h3 class="mt-1 font-semibold text-navy-900 text-lg">Medellín</h3><p class="mt-2 text-sm">Página de inicio con todos los servicios.</p></a>
      \${byReg('aburra').map(card).join('')}
    </div></section>
  <section><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-3">Oriente antioqueño</h2><p class="mb-5 leading-relaxed max-w-3xl">Muchas personas viven o trabajan entre Medellín y el Oriente, y los accidentes ocurren con frecuencia en los corredores que los unen. En estos municipios la autoridad que atiende puede ser municipal o, en vías nacionales y departamentales, la Policía de Tránsito y Transporte.</p>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">\${byReg('oriente').map(card).join('')}</div></section>` + s.slice(gEnd);

r("tableHtml({ cap: 'Municipios del Valle de Aburrá: zona y corredores de referencia (información general, verificar en fuentes oficiales)', head: ['Municipio', 'Zona', 'Corredores y transporte de referencia'], rows: MUNICIPIOS.map((m) => [m.name, m.zona === 'norte' ? 'Norte' : 'Sur', `${m.vias}. ${m.transporte}.`]) })",
  "tableHtml({ cap: 'Municipios: zona y corredores de referencia (información general, verificar en fuentes oficiales)', head: ['Municipio', 'Zona', 'Corredores y transporte de referencia'], rows: MUNICIPIOS.map((m) => [m.name, regionOf(m) === 'oriente' ? 'Oriente antioqueño' : (m.zona === 'norte' ? 'Norte del Valle de Aburrá' : 'Sur del Valle de Aburrá'), `${m.vias}. ${m.transporte}.`]) })");

r("render({ url: '/area-metropolitana/', title: 'Abogado de accidentes de tránsito en el Valle de Aburrá', desc: 'Orientación a víctimas de accidentes de tránsito en Medellín, Bello, Itagüí, Envigado, Sabaneta, La Estrella, Caldas, Copacabana, Girardota y Barbosa.'",
  "render({ url: '/area-metropolitana/', title: 'Abogado de accidentes de tránsito en el Valle de Aburrá y el Oriente', desc: 'Orientación a víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá (Bello, Itagüí, Envigado y más) y el Oriente antioqueño: Rionegro, La Ceja, El Retiro y El Carmen de Viboral.'");

// ---- Páginas de municipio ----
r("const crumbs = [['Inicio', '/'], ['Área metropolitana', '/area-metropolitana/'], [m.name, url]];",
  "const crumbs = [['Inicio', '/'], ['Cobertura', '/area-metropolitana/'], [m.name, url]];\n    const reg = regionOf(m);");
r('<dd class="font-medium text-navy-900 capitalize">${m.zona} del Valle de Aburrá</dd>',
  '<dd class="font-medium text-navy-900">${reg === \'oriente\' ? \'Oriente antioqueño\' : (m.zona === \'norte\' ? \'Norte\' : \'Sur\') + \' del Valle de Aburrá\'}</dd>');
r('<p class="font-semibold text-navy-900 text-base">${esc(a.nombre)}</p>',
  '<p class="font-semibold text-navy-900 text-base">${esc(a.titulo || a.nombre)}</p>');
r('<li><a class="underline text-navy-900" href="${a.web}" target="_blank" rel="noopener">${esc(a.nombre)}: sitio oficial</a></li>',
  '<li><a class="underline text-navy-900" href="${a.web}" target="_blank" rel="noopener">${esc(a.candidato ? \'Alcaldía de \' + m.name : a.nombre)}: sitio oficial</a></li>');
r('<li><a class="underline text-navy-900" href="${DIRECTORIO_URL}" target="_blank" rel="noopener">Directorio oficial de secretarías de tránsito del Valle de Aburrá</a></li>',
  '${reg === \'aburra\' ? `<li><a class="underline text-navy-900" href="${DIRECTORIO_URL}" target="_blank" rel="noopener">Directorio oficial de secretarías de tránsito del Valle de Aburrá</a></li>` : \'\'}');
// Aviso de dato pendiente (solo en modo no producción)
r("${SITE.coverageConfirmed ? '' : pending(`confirmar con la firma que presta servicio en ${m.name}, la modalidad de atención y validar los datos locales de esta página.`)}",
  "${SITE.coverageConfirmed ? '' : pending(`confirmar con la firma que presta servicio en ${m.name}, la modalidad de atención y validar los datos locales de esta página.`)}\n  ${a.candidato ? pending(`verificar en fuente oficial: ${a.candidato}.`) : ''}");
// Otros municipios agrupados por región
r('<section class="bg-white border border-slate-200 rounded-2xl p-6"><p class="font-semibold text-navy-900">Otros municipios del Valle de Aburrá</p><p class="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-1">${MUNICIPIOS.filter((x) => x !== m).map((x) => `<a class="underline text-navy-900" href="${muniUrl(x)}">${esc(x.name)}</a>`).join(\'\')}<a class="underline text-navy-900" href="/area-metropolitana/">Ver todos</a></p></section>',
  '<section class="bg-white border border-slate-200 rounded-2xl p-6 grid sm:grid-cols-2 gap-6">${Object.entries(REGIONES).map(([k, R]) => `<div><p class="font-semibold text-navy-900">${R.titulo}</p><p class="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-2">${MUNICIPIOS.filter((x) => x !== m && regionOf(x) === k).map((x) => `<a class="underline text-navy-900" href="${muniUrl(x)}">${esc(x.name)}</a>`).join(\'\')}${k === \'aburra\' ? \'<a class="underline text-navy-900" href="/">Medellín</a>\' : \'\'}</p></div>`).join(\'\')}<p class="sm:col-span-2 text-sm"><a class="underline text-navy-900 font-medium" href="/area-metropolitana/">Ver toda la cobertura</a></p></section>');
fs.writeFileSync('build.mjs', s);
console.log('ok');
