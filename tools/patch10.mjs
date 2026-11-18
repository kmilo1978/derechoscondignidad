import fs from 'node:fs';
let miss = 0;
const read = (f) => fs.readFileSync(f, 'utf8');
const write = (f, s) => fs.writeFileSync(f, s);
const SRC = ['build.mjs', 'src/articles.mjs', 'src/articles2.mjs', 'src/content.mjs', 'src/services2.mjs', 'src/config.mjs'];
// Reemplazo del primer hallazgo en cualquiera de los archivos
const swap = (oldS, newS, files = SRC) => { for (const f of files) { const s = read(f); if (s.includes(oldS)) { write(f, s.replace(oldS, () => newS)); return; } } miss++; console.log('NO ENCONTRADO:', oldS.slice(0, 80)); };

// ---- 1) Descripciones fuera de rango (120–160 caracteres) ----
swap("'Qué es la valoración médico-legal, qué llevar, qué esperar y cómo se relaciona con tu reclamación.'", "'Qué evalúa Medicina Legal tras un accidente de tránsito, qué documentos llevar a la cita, cómo responder y qué hacer después con el dictamen.'");
swap("'Qué son los plazos de prescripción y caducidad, por qué varían según la vía y qué hacer para no perder tus derechos.'", "'Qué son los plazos de prescripción y caducidad tras un accidente de tránsito, por qué varían según la vía y qué hacer para no perder tus derechos.'");
swap("desc: 'Calculadora orientativa de perjuicios patrimoniales tras un accidente de tránsito: daño emergente, lucro cesante y ajuste por culpa. No es una oferta ni una predicción.'", "desc: 'Calculadora orientativa de perjuicios patrimoniales tras un accidente de tránsito: daño emergente, lucro cesante y ajuste por culpa. No es una oferta.'", ['build.mjs']);
swap("desc: 'Contáctanos por WhatsApp o llamada para una primera orientación sobre tu accidente de tránsito en Medellín.'", "desc: 'Llama al (604) 557 5073 o envíanos tu caso: consulta inicial sin costo, disponibilidad 24/7 y orientación sobre tu accidente de tránsito en Medellín.'", ['build.mjs']);
swap("con lenguaje claro y sin presiones.',\n    body, schema", "con lenguaje claro.',\n    body, schema", ['build.mjs']);
swap("desc: 'Conoce el enfoque de Derechos con Dignidad y el equipo de abogados para víctimas de accidentes de tránsito en Medellín.'", "desc: 'Conoce el enfoque de Derechos con Dignidad, cómo trabajamos y cómo atendemos a víctimas de accidentes de tránsito en Medellín y el Valle de Aburrá.'", ['build.mjs']);
swap("desc: 'Respuestas a las dudas más comunes tras un accidente de tránsito: SOAT, aseguradoras, plazos y honorarios.'", "desc: 'Más de 25 respuestas a las dudas más comunes tras un accidente de tránsito: SOAT, aseguradoras, plazos, honorarios y qué hacer primero.'", ['build.mjs']);
swap("'Qué es el SOAT, qué cubre y qué no, qué documentos pedir y qué hacer cuando se agota o la aseguradora no responde.'", "'Qué es el SOAT, qué cubre y qué no, qué documentos pedir y qué hacer cuando se agota el tope o la aseguradora no responde tras un accidente.'");
swap("'Trauma craneoencefálico y daño cerebral tras un accidente: por qué el seguimiento médico importa y qué perjuicios pueden analizarse para la víctima y su familia.'", "'Trauma craneoencefálico y daño cerebral tras un accidente: por qué importa el seguimiento médico y qué perjuicios pueden analizarse para la familia.'");
swap("desc: 'Autorización para el tratamiento de datos personales de quienes contactan a Derechos con Dignidad.'", "desc: 'Autorización para el tratamiento de datos personales de quienes contactan a Derechos con Dignidad: finalidad, datos de salud y derechos del titular.'", ['build.mjs']);

// ---- 2) Contraste: texto dorado oscuro (gold-700) ----
let b = read('build.mjs');
b = b.split('hover:text-gold-600').join('hover:text-gold-700').split('text-gold-600').join('text-gold-700');
// ---- 3) Pie de página: títulos de columna sin etiquetas de encabezado (evita saltos h1→h3 y ruido de h2/h3) ----
b = b.replace(/<h3 class="text-white text-xs font-semibold uppercase tracking-widest mb-4">([^<]*)<\/h3>/g, '<p class="text-white text-xs font-semibold uppercase tracking-widest mb-4">$1</p>');
// ---- 4) Sitemap con lastmod ----
b = b.replace("`  <url><loc>${SITE.url}${u}</loc></url>`", "`  <url><loc>${SITE.url}${u}</loc><lastmod>${SITE.lastReview}</lastmod></url>`");
// ---- 5) Datos estructurados de la organización más completos (solo datos reales) ----
const orgOld = "areaServed: { '@type': 'City', name: 'Medellín' }, logo: SITE.url + LOGO.url";
if (b.includes(orgOld)) {
  b = b.replace(orgOld, () => "description: 'Firma de abogados especializada en accidentes de tránsito en Medellín y el Valle de Aburrá. Consulta inicial sin costo y disponibilidad 24/7.', areaServed: [{ '@type': 'City', name: 'Medellín' }, ...MUNICIPIOS.map((m) => ({ '@type': 'City', name: m.name }))], openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }, ...(hasPhone ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', telephone: SITE.phoneDial || SITE.phone, areaServed: 'CO', availableLanguage: 'es' } } : {}), logo: SITE.url + LOGO.url");
} else { miss++; console.log('NO ENCONTRADO: org'); }
// ---- 6) Bandera de producción: oculta los avisos "pendiente" cuando esté activa ----
const pendOld = "const pending = (txt) => `<p class=\"rounded-lg border border-dashed";
if (b.includes(pendOld)) b = b.replace(pendOld, () => "const pending = (txt) => SITE.production ? '' : `<p class=\"rounded-lg border border-dashed");
else { miss++; console.log('NO ENCONTRADO: pending'); }
// ---- 7) Iconos PNG y manifest ----
b = b.replace('<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">', '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">\n<link rel="manifest" href="/assets/site.webmanifest">');
b = b.replace("  if (hasOG) fs.copyFileSync(", "  for (const ic2 of ['apple-touch-icon.png', 'icon-512.png']) if (fs.existsSync('src/assets/' + ic2)) fs.copyFileSync('src/assets/' + ic2, path.join(DIST, 'assets', ic2));\n  w('assets/site.webmanifest', JSON.stringify({ name: SITE.name, short_name: SITE.name, start_url: '/', display: 'browser', background_color: '#ffffff', theme_color: '#0f172a', icons: [{ src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }] }));\n  if (hasOG) fs.copyFileSync(");
// ---- 8) Definición clara de la entidad (home y llms.txt) ----
const defOld = '<section id="situaciones"';
if (b.includes(defOld)) b = b.replace(defOld, () => `<section class="py-10 bg-white border-b border-slate-200" id="quienes-somos"><div class="max-w-4xl mx-auto px-6"><h2 class="text-xl font-semibold text-navy-900">¿Quiénes somos?</h2><p class="mt-3 leading-relaxed"><strong class="text-navy-900">\${esc(SITE.name)}</strong> es una firma de abogados especializada en accidentes de tránsito en Medellín y el Valle de Aburrá. Está ubicada en \${esc(SITE.address)}, atiende por teléfono en el \${esc(SITE.phone)}, ofrece una consulta inicial sin costo y tiene disponibilidad 24/7. <a class="underline text-navy-900 font-medium" href="/nosotros/">Conoce cómo trabajamos</a>.</p></div></section>\n<section id="situaciones"`);
else { miss++; console.log('NO ENCONTRADO: situaciones'); }
b = b.replace("> Orientación jurídica para víctimas de accidentes de tránsito en Medellín y el Valle de Aburrá. Contenido informativo; no constituye asesoría jurídica.", "> ${SITE.name} es una firma de abogados especializada en accidentes de tránsito en Medellín y el Valle de Aburrá. Ubicación: ${SITE.address}. Teléfono: ${SITE.phone}. Consulta inicial sin costo; disponibilidad 24/7. Contenido informativo; no constituye asesoría jurídica.");
write('build.mjs', b);

// ---- 9) Tailwind: color gold-700 ----
let tw = read('tailwind.config.js');
if (!tw.includes('700:')) write('tailwind.config.js', tw.replace("gold: { 500: '#d4af37', 600: '#b4941f' }", "gold: { 500: '#d4af37', 600: '#b4941f', 700: '#7a5f0f' }"));

// ---- 10) CSS: contraste del resaltado + content-visibility en secciones bajo el pliegue ----
let css = read('src/input.css');
css = css.split('#b4941f').join('#7a5f0f');
if (!css.includes('content-visibility')) css = css.replace('@media print {', "/* Rendimiento: no pintar hasta que se acerquen (secciones bajo el pliegue) */\nfooter, #faq, #glosario, #fuentes, #quienes-somos ~ section:nth-of-type(n+6) { content-visibility: auto; contain-intrinsic-size: auto 600px; }\n\n@media print {");
write('src/input.css', css);

// ---- 11) JS: scroll con requestAnimationFrame y sin lecturas de layout repetidas ----
let js = read('src/app.js');
const oldScroll = js.slice(js.indexOf('  var bar = document.getElementById'), js.indexOf('  if (top) top.addEventListener'));
const newScroll = `  var bar = document.getElementById('readProgress');
  var top = document.getElementById('toTop');
  var maxScroll = 0, ticking = false;
  function measure() { var h = document.documentElement; maxScroll = h.scrollHeight - h.clientHeight; }
  function paint() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (bar) bar.style.width = (maxScroll > 0 ? Math.min(100, (y / maxScroll) * 100) : 0) + '%';
    if (top) { top.classList.toggle('opacity-0', y < 700); top.classList.toggle('pointer-events-none', y < 700); }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  window.addEventListener('resize', function () { measure(); paint(); });
  window.addEventListener('load', function () { measure(); paint(); });
  requestAnimationFrame(function () { measure(); paint(); });
`;
if (oldScroll) js = js.replace(oldScroll, () => newScroll); else { miss++; console.log('NO ENCONTRADO: scroll'); }
write('src/app.js', js);
console.log('patch10 listo. Anclas no encontradas:', miss);
