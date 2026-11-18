import fs from 'node:fs';
let b = fs.readFileSync('build.mjs', 'utf8');
let miss = 0;
const rep = (a, c) => { if (!b.includes(a)) { miss++; console.log('NO ENCONTRADO:', a.slice(0, 90).replace(/\n/g, '⏎')); return; } b = b.replace(a, () => c); };
const cut = (start, endMarker, replacement) => { const i = b.indexOf(start); const j = b.indexOf(endMarker, i); if (i < 0 || j < 0) { miss++; console.log('NO ENCONTRADO (cut):', start.slice(0, 60)); return; } b = b.slice(0, i) + replacement + b.slice(j); };

// 1) imports
rep("import { ARTICLES2, SEO_TITLES } from './src/articles2.mjs';", "import { ARTICLES2, SEO_TITLES } from './src/articles2.mjs';\nimport { faqsFor, POOLS_BY_HUB, POOLS_BY_CLUSTER } from './src/faqs.mjs';\nimport { MUNICIPIOS, muniFaqs } from './src/municipios.mjs';");

// 2) NAV
rep("{ label: 'Blog', href: '/blog/' },", "{ label: 'Cobertura', href: '/area-metropolitana/' },\n  { label: 'Calculadora', href: '/calculadora-indemnizacion/' },\n  { label: 'Blog', href: '/blog/' },");
rep('class="px-3 py-2 text-sm font-medium text-white/90 hover:text-gold-500 transition-colors">${n.label}</a>`;', 'class="px-2.5 py-2 text-sm font-medium text-white/90 hover:text-gold-500 transition-colors">${n.label}</a>`;');

// 3) render()
rep("minimal = false, canonicalUrl }) {\n  const canonical", `minimal = false, canonicalUrl, faq = null, scripts = [] }) {
  if (faq) { const list = faqsFor(faq.own || [], faq.pools || ['primeros'], faq.seed || url, faq.min || 6); body = insertBeforeCta(body, faqSection(list, faq.title, faq.search)); schema = [...schema, faqSchema(list)]; }
  { const words = body.replace(/<script[\\s\\S]*?<\\/script>|<[^>]+>/g, ' ').split(/\\s+/).filter(Boolean).length; const mins = Math.max(1, Math.round(words / 200)); body = body.replace('<!--READING-->', \`<span class="inline-flex items-center gap-1 mr-3 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">\${ic('clock', 'w-3.5 h-3.5')}\${mins} min de lectura</span>\`); }
  const crumbBar = crumbs.length && !minimal ? crumbsBar(crumbs) : '';
  const canonical`);
rep('<a href="#contenido" class="sr-only', '<div id="readProgress" class="fixed top-0 left-0 h-1 bg-gold-500 z-[60] w-0" aria-hidden="true"></div>\n<a href="#contenido" class="sr-only');
rep('<main id="contenido">\n${body}\n</main>', '<main id="contenido">\n${crumbBar}${body}\n</main>');
rep('<script src="/assets/app.js" defer></script>', '<button id="toTop" type="button" aria-label="Volver arriba" class="fixed bottom-20 right-5 z-40 w-11 h-11 rounded-full bg-navy-900 text-white shadow-lg flex items-center justify-center opacity-0 pointer-events-none transition-opacity">${ic(\'down\', \'w-5 h-5 rotate-180\')}</button>\n${scripts.map((s) => `<script src="${s}" defer></script>`).join(\'\')}\n<script src="/assets/app.js" defer></script>');

// 4) pageHero sin migas (ahora hay barra de migas propia) + datesLine + faqHtml + renderBlocks
rep("    ${crumbs ? crumbsHtml(crumbs) : ''}\n", '');
rep('<p class="text-xs text-slate-500">Publicado:', '<p class="text-xs text-slate-500"><!--READING-->Publicado:');
cut('const faqHtml = (faqs) =>', '\n\nconst ctaFinal', "const faqHtml = (faqs, search = false) => `<div data-faq>${search ? '<input data-faq-search type=\"search\" placeholder=\"Buscar en las preguntas…\" aria-label=\"Buscar en las preguntas frecuentes\" class=\"w-full mb-4 bg-white border border-slate-200 rounded-lg px-4 py-3\">' : ''}<div class=\"flex justify-between items-center mb-3 text-xs\"><span class=\"text-slate-500\">${faqs.length} preguntas</span><span class=\"flex gap-4 no-print\"><button type=\"button\" data-faq-toggle=\"open\" class=\"underline\">Abrir todas</button><button type=\"button\" data-faq-toggle=\"close\" class=\"underline\">Cerrar todas</button></span></div><div class=\"space-y-3\">${faqs.map(([q, a]) => `<details class=\"group bg-white border border-slate-200 rounded-xl p-5\"><summary class=\"flex justify-between items-center gap-4 cursor-pointer font-semibold text-navy-900 list-none\">${esc(q)}<span class=\"shrink-0 transition-transform group-open:rotate-180\">${ic('down')}</span></summary><p class=\"mt-3 text-slate-600 leading-relaxed\">${esc(a)}</p></details>`).join('')}</div>${search ? '<p data-faq-empty class=\"hidden text-sm text-slate-500 mt-3\">No encontramos preguntas con ese término.</p>' : ''}</div>`;");
rep("if (typeof b === 'string') return `<p class=\"leading-relaxed mb-4\">${esc(b)}</p>`;", "if (typeof b === 'string') return para(b);");

// 5) servicePage
rep("const allFaqs = [...s.faqs, ...x.faqs];", "TIPSET.clear();\n  const allFaqs = faqsFor([...s.faqs, ...x.faqs], POOLS_BY_HUB[s.hub] || ['primeros'], slug);");
rep("s.entender.map((p) => `<p class=\"leading-relaxed mb-4\">${esc(p)}</p>`).join('')", "s.entender.map(para).join('')");
rep("s.seguros.map((p) => `<p class=\"leading-relaxed mb-4\">${esc(p)}</p>`).join('')", "s.seguros.map(para).join('')");
rep("<h3 class=\"mt-8 mb-3 text-lg font-semibold text-navy-900\">Documentos útiles</h3><ul class=\"grid sm:grid-cols-2 gap-2\">${s.docs.map((d) => `<li class=\"flex gap-2 text-sm\">${ic('file', 'w-4 h-4 text-gold-600 shrink-0 mt-0.5')}${esc(d)}</li>`).join('')}</ul>`)}", "<h3 class=\"mt-8 mb-3 text-lg font-semibold text-navy-900\">Documentos útiles</h3>${checklistHtml(slug, s.docs)}`)}");
rep('<nav aria-label="En esta página" class="bg-white', '<nav data-toc aria-label="En esta página" class="bg-white');

// 6) blog
rep("for (const a of ARTICLES) {\n    const url = `/blog/${a.slug}/`;", "for (const a of ARTICLES) {\n    TIPSET.clear();\n    const faqs = faqsFor(a.faqs, POOLS_BY_CLUSTER[a.cluster] || ['primeros'], a.slug);\n    const url = `/blog/${a.slug}/`;");
rep('${faqHtml(a.faqs)}', '${faqHtml(faqs)}');
rep('faqSchema(a.faqs),', 'faqSchema(faqs),');
rep('<nav aria-label="En este artículo" class=', '<nav data-toc aria-label="En este artículo" class=');
rep("body, crumbs: [['Inicio', '/'], ['Blog', '/blog/']] });", "body, crumbs: [['Inicio', '/'], ['Blog', '/blog/']], faq: { pools: ['primeros', 'seguros', 'proceso', 'honorarios'], min: 8 } });");
rep("body, crumbs: [['Inicio', '/'], ['Glosario', '/glosario/']],\n    schema:", "body, crumbs: [['Inicio', '/'], ['Glosario', '/glosario/']], faq: { pools: ['seguros', 'lesiones', 'proceso'], min: 6 },\n    schema:");

// 7) servicios hub / recursos / simple pages
rep("body, crumbs: [['Inicio', '/'], ['Servicios', '/servicios/']] });", "body, crumbs: [['Inicio', '/'], ['Servicios', '/servicios/']], faq: { pools: ['primeros', 'seguros', 'lesiones', 'transporte', 'estado'], min: 8 } });");
rep("'/recursos/modelo-derecho-de-peticion/']] });\n}", "'/recursos/modelo-derecho-de-peticion/']], faq: { pools: ['seguros', 'proceso', 'primeros'], min: 6 } });\n}");
rep("function simple({ url, title, desc, h1, sub, kicker, inner, crumbs, cta = true, noindex = false, schema = [] }) {", "function simple({ url, title, desc, h1, sub, kicker, inner, crumbs, cta = true, noindex = false, schema = [], faq = null }) {");
rep("render({ url, title, desc, body, crumbs, noindex, schema });", "render({ url, title, desc, body, crumbs, noindex, schema, faq });");
rep("h1: 'Honorarios y cuota litis', sub:", "faq: { pools: ['honorarios', 'proceso', 'primeros'], min: 8 }, h1: 'Honorarios y cuota litis', sub:");
rep("h1: 'Nosotros', sub:", "faq: { pools: ['honorarios', 'contacto', 'primeros'], min: 6 }, h1: 'Nosotros', sub:");
rep("h1: 'Contacto', sub:", "faq: { pools: ['contacto', 'primeros', 'honorarios'], min: 8 }, h1: 'Contacto', sub:");
rep("<p class=\"text-sm\">También puedes usar el <a class=\"underline text-navy-900 font-medium\" href=\"/#formulario\">formulario de la página de inicio</a>.</p>", "${contactFormHtml()}");
rep("inner: faqHtml(FAQ_GENERAL), schema: [faqSchema(FAQ_GENERAL)] });", "inner: faqHtml(BIG_FAQ, true), schema: [faqSchema(BIG_FAQ)] });");

// 8) home
rep("faqHtml(FAQ_GENERAL.slice(0, 5))", "faqHtml(HOME_FAQ)");
rep("faqSchema(FAQ_GENERAL.slice(0, 5))", "faqSchema(HOME_FAQ)");
rep('<section class="py-20 bg-slate-50" id="contacto-home">', `<section class="py-20 bg-white" id="cobertura">
  <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
    <div><p class="text-gold-600 text-xs font-semibold uppercase tracking-[0.2em]">Cobertura</p><h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Medellín y todo el Valle de Aburrá</h2>
      <p class="mt-4 leading-relaxed">Orientamos a víctimas de accidentes en Medellín y en los municipios del área metropolitana. El SOAT es nacional; lo que cambia es la autoridad de tránsito y la administración de la vía.</p>
      <div class="mt-6 flex flex-wrap gap-2">\${MUNICIPIOS.map((m) => \`<a href="\${muniUrl(m)}" class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 hover:border-gold-500 rounded-full px-4 py-2 text-sm text-navy-900">\${esc(m.name)}</a>\`).join('')}</div>
      <p class="mt-5"><a href="/area-metropolitana/" class="font-semibold text-navy-900 hover:text-gold-600 inline-flex items-center gap-2">Ver el área metropolitana \${ic('arrow')}</a></p></div>
    <div class="bg-navy-900 text-white rounded-2xl p-8"><span class="text-gold-500">\${ic('calc', 'w-8 h-8')}</span><h2 class="mt-4 text-2xl font-semibold tracking-tight">Calculadora orientativa</h2><p class="mt-3 text-slate-300 leading-relaxed">Mira cómo influyen tus ingresos, la incapacidad y las secuelas en los perjuicios patrimoniales. Es una herramienta de orientación, no una oferta ni una predicción.</p><a href="/calculadora-indemnizacion/" class="mt-6 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3 rounded-lg">Usar la calculadora \${ic('arrow')}</a></div>
  </div>
</section>

<section class="py-20 bg-slate-50" id="contacto-home">`);

// 9) footer
rep('<li><a class="hover:text-gold-500" href="/nosotros/">Nosotros</a></li>', '<li><a class="hover:text-gold-500" href="/nosotros/">Nosotros</a></li><li><a class="hover:text-gold-500" href="/area-metropolitana/">Cobertura: área metropolitana</a></li><li><a class="hover:text-gold-500" href="/calculadora-indemnizacion/">Calculadora de indemnización</a></li>');

// 10) bloque nuevo + llamadas + tech
const snip = fs.readFileSync('src/snip-new.txt', 'utf8');
rep('// ---------- Landings de pauta', snip + '// ---------- Landings de pauta');
rep('landings(); recursos(); datosReales();', 'landings(); recursos(); municipios(); calculadora(); datosReales();');
rep("  w('assets/app.js', fs.readFileSync('src/app.js', 'utf8'));", "  w('assets/app.js', fs.readFileSync('src/app.js', 'utf8'));\n  w('assets/calc.js', fs.readFileSync('src/calc.js', 'utf8'));");

fs.writeFileSync('build.mjs', b);
let cfg = fs.readFileSync('src/config.mjs', 'utf8');
if (!cfg.includes('coverageConfirmed')) fs.writeFileSync('src/config.mjs', cfg.replace("  ga4:", "  coverageConfirmed: false, // poner true cuando la firma confirme cobertura en cada municipio\n  ga4:"));
console.log('patch3 listo. Anclas no encontradas:', miss);
