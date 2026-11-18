import fs from 'node:fs';
let miss = 0;
const edit = (file, fn) => { let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, c) => { if (!s.includes(a)) { miss++; console.log('NO ENCONTRADO:', a.slice(0, 90).replace(/\n/g, '⏎')); return s; } return s.replace(a, () => c); };

// ---- Configuración con los datos reales entregados ----
edit('src/config.mjs', (s) => {
  s = s.replace(/  phone: '[^']*',[^\n]*\n/, "  phone: '(604) 557 5073', // se muestra tal cual\n  phoneDial: '+576045575073', // formato internacional para enlaces tel:\n");
  s = s.replace(/  address: '[^']*',[^\n]*\n/, "  street: 'Calle 53 # 45-112', // para datos estructurados\n  address: 'Calle 53 # 45-112, Medellín, Antioquia',\n");
  s = s.replace(/  hours: '[^']*',[^\n]*\n/, "  hours: 'Disponibilidad 24/7',\n");
  return s;
});

// ---- Generador ----
edit('build.mjs', (b) => {
  b = rep(b, "const telLink = hasPhone ? `tel:+${digits(SITE.phone)}` : '/contacto/';", "const telLink = hasPhone ? `tel:${SITE.phoneDial || '+' + digits(SITE.phone)}` : '/contacto/';");
  b = rep(b, "...(hasPhone ? { telephone: SITE.phone } : {})", "...(hasPhone ? { telephone: SITE.phoneDial || SITE.phone } : {})");
  b = rep(b, "streetAddress: SITE.address, addressLocality: 'Medellín', addressCountry: 'CO'", "streetAddress: SITE.street || SITE.address, addressLocality: 'Medellín', addressRegion: 'Antioquia', addressCountry: 'CO'");

  // Botones: sin WhatsApp, el principal es llamar y el secundario enviar consulta
  const i = b.indexOf("const btnWA = (label");
  const j = b.indexOf('// ---------- Navegación');
  b = b.slice(0, i) + `const gold = 'inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3.5 rounded-lg transition-colors';
const outline = 'inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-lg transition-colors';
const btnWA = (label = 'Escríbenos por WhatsApp', cls = '', loc = 'cta') => hasWA
  ? \`<a href="\${waLink()}" data-track="whatsapp" data-loc="\${loc}" target="_blank" rel="noopener" class="\${gold} \${cls}">\${ic('chat')}\${label}</a>\`
  : \`<a href="\${telLink}" data-track="call" data-loc="\${loc}" class="\${gold} \${cls}">\${ic('phone')}\${label === 'WhatsApp' ? 'Llamar' : 'Llamar ahora'}</a>\`;
const btnCall = (label = hasPhone ? esc(SITE.phone) : 'Llamar', cls = '', loc = 'cta') => hasWA
  ? \`<a href="\${telLink}" data-track="call" data-loc="\${loc}" class="\${outline} \${cls}">\${ic('phone')}\${label}</a>\`
  : \`<a href="/contacto/#formulario" data-track="form" data-loc="\${loc}" class="\${outline} \${cls}">\${ic('mail')}Enviar consulta</a>\`;

` + b.slice(j);

  // Botón flotante
  b = rep(b, '<a href="${waLink()}" data-track="whatsapp" data-loc="flotante" ${hasWA ? \'target="_blank" rel="noopener"\' : \'\'} class="fixed', '<a href="${hasWA ? waLink() : telLink}" data-track="${hasWA ? \'whatsapp\' : \'call\'}" data-loc="flotante" ${hasWA ? \'target="_blank" rel="noopener"\' : \'\'} class="fixed');
  b = rep(b, 'aria-label="Contactar por WhatsApp">${ic(\'chat\', \'w-6 h-6\')}<span class="hidden sm:inline">WhatsApp</span></a>', 'aria-label="${hasWA ? \'Contactar por WhatsApp\' : \'Llamar ahora\'}">${ic(hasWA ? \'chat\' : \'phone\', \'w-6 h-6\')}<span class="hidden sm:inline">${hasWA ? \'WhatsApp\' : \'Llamar\'}</span></a>');

  // Barra de confianza de la home con los 4 compromisos de la firma
  b = rep(b, "[['shield', 'Información prudente', 'Contenido orientativo, sin cifras garantizadas.'], ['file', 'Revisión documental', 'Analizamos tus soportes antes de opinar.'], ['clock', 'Atención ágil', 'Primera orientación por WhatsApp o llamada.'], ['pin', 'Enfoque local', 'Conocemos la realidad de Medellín y el Valle de Aburrá.']]",
    "[['users', 'Atención humana', 'Te escucha una persona que entiende tu situación.'], ['check', 'Consulta sin costo', 'La primera revisión de tu caso no tiene costo.'], ['shield', 'Defensa experta', 'Acompañamiento jurídico en accidentes de tránsito.'], ['clock', 'Disponibilidad 24/7', 'Llámanos o escríbenos a cualquier hora.']]");

  // Bloque "Qué recibes" (home y contacto)
  b = rep(b, "const HOME_FAQ =", `const RECIBES = [['file', 'Revisión inicial del caso', 'Analizamos lo que te ocurrió y los datos que tienes.'], ['scale', 'Ruta jurídica recomendada', 'Qué vía conviene en tu situación y por qué.'], ['shield', 'Documentos clave', 'Qué soportes reunir y cuáles son los más importantes.'], ['clock', 'Próximos pasos con tiempos estimados', 'Qué sigue, en qué orden y con qué plazos orientativos.']];
const recibeHtml = (dark = false) => \`<ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">\${RECIBES.map(([i, t, d]) => \`<li class="\${dark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200'} border rounded-2xl p-5"><span class="text-gold-600">\${ic(i, 'w-6 h-6')}</span><p class="mt-3 font-semibold \${dark ? 'text-white' : 'text-navy-900'}">\${t}</p><p class="mt-1 text-sm">\${d}</p></li>\`).join('')}</ul>\`;
const HOME_FAQ =`);
  b = rep(b, '<section class="py-20 bg-navy-900 text-white">', `<section class="py-16 bg-white border-b border-slate-200" id="que-recibes">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-gold-600 text-xs font-semibold uppercase tracking-[0.2em]">Tu primera consulta</p>
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">¿Qué recibes?</h2>
    <div class="mt-8">\${recibeHtml()}</div>
  </div>
</section>

<section class="py-20 bg-navy-900 text-white">`);
  b = rep(b, '${contactFormHtml()}', '<section><h2 class="text-2xl font-semibold text-navy-900 mb-4">¿Qué recibes en tu primera consulta?</h2>${recibeHtml()}</section>\n    ${contactFormHtml()}');
  return b;
});

// ---- Preguntas ----
edit('src/content.mjs', (s) => rep(s, "'Al contactarnos te informamos las condiciones de la primera consulta antes de que decidas continuar.'", "'La consulta inicial no tiene costo: revisamos tu caso y te explicamos tus opciones antes de cualquier decisión sobre honorarios.'"));
edit('src/faqs.mjs', (s) => {
  s = rep(s, "['¿La primera consulta tiene costo?', 'Se informa antes de agendarla. Pregunta siempre por las condiciones.']", "['¿La primera consulta tiene costo?', 'No. La consulta inicial no tiene costo; los honorarios solo se acuerdan por escrito si decides contratarnos.']");
  s = rep(s, "['¿Responden fuera de horario?', 'Los horarios los confirmará la firma en esta página. Deja tu mensaje y te contactaremos.']", "['¿Hay atención las 24 horas?', 'Sí, la firma tiene disponibilidad 24/7. Si no te contestamos de inmediato, deja tu mensaje y te respondemos lo antes posible.']");
  s = rep(s, "['¿Cuál es la forma más rápida de contactarlos?', 'Por WhatsApp o llamada. El formulario también sirve para dejar tu caso resumido y que te contactemos.']", "['¿Cuál es la forma más rápida de contactarlos?', 'Llamando al (604) 557 5073. El formulario también sirve para dejar tu caso resumido y que te contactemos.']");
  s = rep(s, "['¿Se puede consultar sin ir a una oficina?', 'La primera orientación puede hacerse por WhatsApp o llamada.']", "['¿Se puede consultar sin ir a una oficina?', 'Sí. La primera orientación puede hacerse por teléfono; si prefieres ir en persona, estamos en la Calle 53 # 45-112, Medellín.']");
  return s;
});
console.log('patch6 listo. Anclas no encontradas:', miss);
