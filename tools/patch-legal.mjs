import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const cut = (a, b) => { const i = s.indexOf(a); const j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('no: ' + a.slice(0, 50)); return [i, j + b.length]; };

// 1) import
s = s.replace("import { MUNICIPIOS, muniFaqs, DIRECTORIO_URL, RECURSOS } from './src/municipios.mjs';",
  "import { MUNICIPIOS, muniFaqs, DIRECTORIO_URL, RECURSOS } from './src/municipios.mjs';\nimport { PRIVACIDAD, AUTORIZACION, TERMINOS, COOKIES, LEGAL_FAQ } from './src/legal.mjs';");

// 2) Reemplazar páginas de privacidad y tratamiento por la plantilla legal
const [a, b] = cut("  simple({ url: '/politica-de-privacidad/'", "'Tienes derecho a conocer, actualizar, rectificar y suprimir tus datos, y a revocar la autorización, en los términos de la ley.'])}` });");
s = s.slice(0, a) + '  legales();' + s.slice(b);

const LEGAL_FN = `
// ---------- PÁGINAS LEGALES ----------
const LEGAL_LINKS = [
  ['Política de privacidad', '/politica-de-privacidad/'],
  ['Autorización de tratamiento de datos', '/tratamiento-de-datos/'],
  ['Términos de uso', '/terminos-de-uso/'],
  ['Política de cookies', '/politica-de-cookies/'],
];
function legalPage({ url, title, desc, h1, sub, sections, note, faq }) {
  const crumbs = [['Inicio', '/'], [h1, url]];
  const ids = sections.map(([t], i) => ['l' + (i + 1), t]);
  const inner = \`
  \${pending(note)}
  <p class="text-sm text-slate-500">Última actualización: <time datetime="\${SITE.lastReview}">\${longDate(SITE.lastReview)}</time> · Versión 1.0 · Pendiente de revisión jurídica</p>
  <nav aria-label="Contenido de la página" class="bg-white border border-slate-200 rounded-xl p-5"><p class="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-3">En esta página</p><ol class="grid sm:grid-cols-2 gap-x-6 gap-y-2 list-decimal pl-5 text-sm marker:text-gold-700">\${ids.map(([id, t]) => \`<li><a class="text-navy-900 hover:text-gold-700 underline-offset-2 hover:underline" href="#\${id}">\${esc(t)}</a></li>\`).join('')}</ol></nav>
  \${sections.map(([t, bl], i) => \`<section id="l\${i + 1}" class="scroll-mt-28" aria-labelledby="h-l\${i + 1}"><h2 id="h-l\${i + 1}" class="text-xl md:text-2xl font-semibold text-navy-900 tracking-tight mb-4"><span class="text-gold-700 mr-2">\${i + 1}.</span>\${esc(t)}</h2>\${renderBlocks(bl)}</section>\`).join('')}
  \${faq ? \`<section aria-labelledby="h-lfaq"><h2 id="h-lfaq" class="text-xl md:text-2xl font-semibold text-navy-900 tracking-tight mb-4">Preguntas frecuentes</h2>\${faqHtml(faq)}</section>\` : ''}
  <aside class="bg-navy-900 text-slate-300 rounded-2xl p-6"><p class="text-white font-semibold">Otros documentos legales</p><ul class="mt-3 grid sm:grid-cols-2 gap-2 text-sm">\${LEGAL_LINKS.filter((l) => l[1] !== url).map(([t, u]) => \`<li><a class="hover:text-gold-500 underline-offset-2 hover:underline" href="\${u}">\${esc(t)}</a></li>\`).join('')}</ul><p class="mt-4 text-sm">¿Dudas sobre tus datos? <a class="text-gold-500 underline" href="/contacto/">Contáctanos</a>.</p></aside>\`;
  simple({ url, title, desc, h1, sub, kicker: 'Información legal', crumbs, cta: false, inner, schema: faq ? [faqSchema(faq)] : [] });
}
function legales() {
  legalPage({ url: '/politica-de-privacidad/', title: 'Política de privacidad y protección de datos | Derechos con Dignidad',
    desc: 'Cómo Derechos con Dignidad recoge, usa y protege tus datos personales según la Ley 1581 de 2012, y cómo ejercer tus derechos como titular.',
    h1: 'Política de privacidad', sub: 'Qué datos recogemos, para qué los usamos y cómo puedes conocerlos, corregirlos o pedir que se eliminen.',
    sections: PRIVACIDAD, faq: LEGAL_FAQ.privacidad,
    note: 'razón social, NIT y correo de atención de datos; confirmar proveedores (hosting, correo, mensajería, analítica), plazos de conservación y registro en el RNBD si aplica. Texto a aprobar por el abogado responsable.' });
  legalPage({ url: '/tratamiento-de-datos/', title: 'Autorización de tratamiento de datos personales | Derechos con Dignidad',
    desc: 'Texto de la autorización para el tratamiento de datos personales y datos sensibles de salud de quienes consultan a Derechos con Dignidad.',
    h1: 'Autorización de tratamiento de datos personales', sub: 'Lo que aceptas al marcar la casilla de autorización en nuestros formularios.',
    sections: AUTORIZACION,
    note: 'razón social, NIT y correo del responsable; definir cómo se guarda la prueba de la autorización (registro del formulario o grabación). Texto a aprobar por el abogado responsable.' });
  legalPage({ url: '/terminos-de-uso/', title: 'Términos de uso del sitio | Derechos con Dignidad',
    desc: 'Condiciones de uso del sitio de Derechos con Dignidad: carácter informativo, relación abogado-cliente, calculadora, propiedad intelectual y ley aplicable.',
    h1: 'Términos de uso', sub: 'Condiciones para usar este sitio y alcance de la información que publicamos.',
    sections: TERMINOS,
    note: 'razón social y titularidad de la marca y el logotipo. Texto a aprobar por el abogado responsable.' });
  legalPage({ url: '/politica-de-cookies/', title: 'Política de cookies | Derechos con Dignidad',
    desc: 'Qué cookies y almacenamiento local usa el sitio de Derechos con Dignidad, para qué sirven y cómo puedes bloquearlos o borrarlos.',
    h1: 'Política de cookies', sub: 'Qué guarda este sitio en tu navegador y cómo controlarlo.',
    sections: COOKIES,
    note: 'actualizar la tabla si se activan Google Analytics, mapas, videos u otras herramientas de terceros.' });
}
`;
s = s.replace('// ---------- BLOG ----------', LEGAL_FN + '\n// ---------- BLOG ----------');

// 3) 404 rediseñada
const [c, d] = cut("simple({ url: '/no-encontrado/'", "consulta los <a class=\"underline text-navy-900 font-medium\" href=\"/servicios/\">servicios</a>.</p>` });");
const N404 = `{
  const quick = [
    ['scale', 'Servicios', 'Todas las situaciones que orientamos', '/servicios/'],
    ['shield', 'SOAT y aseguradoras', 'Qué cubre y qué hacer si no pagan', '/servicios/#seguros'],
    ['file', 'Guías', 'Qué hacer, qué reclamar y qué evitar', '/blog/'],
    ['clock', 'Calculadora', 'Estimación orientativa de perjuicios', '/calculadora-indemnizacion/'],
    ['pin', 'Cobertura', 'Medellín y el Valle de Aburrá', '/area-metropolitana/'],
    ['phone', 'Contacto', 'Cuéntanos tu caso', '/contacto/'],
  ];
  const body = \`<section class="relative bg-navy-900 text-white overflow-hidden"><div class="absolute inset-0 hero-grid opacity-40" aria-hidden="true"></div>
  <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true"></div>
  <div class="relative max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
    <p class="text-7xl md:text-8xl font-semibold tracking-tight text-gold-500" aria-hidden="true">404</p>
    <h1 class="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Esta página no existe o cambió de dirección</h1>
    <p class="mt-4 text-lg text-slate-300">Revisa que el enlace esté bien escrito o usa uno de estos accesos. Si tuviste un accidente, también puedes contactarnos directamente.</p>
    <div class="mt-8 flex flex-wrap gap-3 justify-center"><a href="/" class="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3.5 rounded-lg transition-colors">Volver al inicio</a>\${btnCall(undefined, '', '404')}</div>
  </div></section>
  <section class="py-14"><div class="max-w-5xl mx-auto px-6"><h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-6 text-center">Quizás buscabas</h2>
  <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">\${quick.map(([i, t, x, u]) => \`<li><a href="\${u}" class="group flex gap-4 items-start bg-white border border-slate-200 hover:border-gold-500 rounded-xl p-5 h-full transition-colors"><span class="w-10 h-10 shrink-0 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center">\${ic(i, 'w-5 h-5')}</span><span><span class="block font-semibold text-navy-900 group-hover:text-gold-700">\${esc(t)}</span><span class="block text-sm text-slate-500 mt-1">\${esc(x)}</span></span></a></li>\`).join('')}</ul>
  <p class="mt-8 text-center text-sm text-slate-500">¿Llegaste aquí desde un enlace de nuestro sitio? <a class="underline text-navy-900" href="/contacto/">Avísanos</a> para corregirlo.</p></div></section>\`;
  render({ url: '/no-encontrado/', title: 'Página no encontrada | Derechos con Dignidad', desc: 'La página que buscas no existe o fue movida. Vuelve al inicio o consulta los servicios para víctimas de accidentes de tránsito.', body, crumbs: [], noindex: true });
}`;
s = s.slice(0, c) + N404 + s.slice(d);

// 4) Enlaces legales en el pie
s = s.replace('<p class="mt-2">© ${new Date().getFullYear()} ${esc(SITE.legalName || SITE.name)}. Todos los derechos reservados.</p>',
  '<div class="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-3"><p>© ${new Date().getFullYear()} ${esc(SITE.legalName || SITE.name)}. Todos los derechos reservados.</p><ul class="flex flex-wrap gap-x-5 gap-y-2">${LEGAL_LINKS.map(([t, u]) => `<li><a class="hover:text-gold-500" href="${u}">${t}</a></li>`).join(\'\')}</ul></div>');
fs.writeFileSync('build.mjs', s);

// 5) Páginas legales exentas del mínimo de palabras/FAQs en el chequeo SEO
let c2 = fs.readFileSync('check-seo.mjs', 'utf8');
c2 = c2.replace('politica-de-privacidad|tratamiento-de-datos|no-encontrado', 'politica-de-privacidad|tratamiento-de-datos|terminos-de-uso|politica-de-cookies|no-encontrado');
fs.writeFileSync('check-seo.mjs', c2);
console.log('ok');
