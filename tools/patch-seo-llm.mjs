// Actualiza SEO on-page y archivos para LLM con la cobertura Valle de Aburrá + Oriente antioqueño
// y con las páginas nuevas (legales, cobertura).
import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('no: ' + a.slice(0, 90)); s = s.split(a).join(b); };
const COV = 'Medellín, el Valle de Aburrá y el Oriente antioqueño';

// ---- Textos de cobertura (footer, home, nosotros, 404) ----
r('Orientación jurídica para víctimas de accidentes de tránsito en Medellín y el Valle de Aburrá.</p>', `Orientación jurídica para víctimas de accidentes de tránsito en ${COV}.</p>`);
r('es una firma de abogados especializada en accidentes de tránsito en Medellín y el Valle de Aburrá. Está ubicada', `es una firma de abogados especializada en accidentes de tránsito en ${COV}. Está ubicada`);
r("desc: 'Abogados de accidentes de tránsito en Medellín y el Valle de Aburrá. Orientación sobre SOAT, aseguradoras y reclamación de perjuicios, con lenguaje claro.',",
  "desc: 'Abogados de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño. Orientación sobre SOAT, aseguradoras y reclamación de perjuicios.',");
r('<h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Medellín y todo el Valle de Aburrá</h2>',
  '<h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Medellín, el Valle de Aburrá y el Oriente</h2>');
r('Orientamos a víctimas de accidentes en Medellín y en los municipios del área metropolitana. El SOAT es nacional; lo que cambia es la autoridad de tránsito y la administración de la vía.</p>\n      <div class="mt-6 flex flex-wrap gap-2">${MUNICIPIOS.map((m) => `<a href="${muniUrl(m)}" class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 hover:border-gold-500 rounded-full px-4 py-2 text-sm text-navy-900">${esc(m.name)}</a>`).join(\'\')}</div>\n      <p class="mt-5"><a href="/area-metropolitana/" class="font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-2">Ver el área metropolitana ${ic(\'arrow\')}</a></p></div>',
  'Orientamos a víctimas de accidentes en Medellín, en los municipios del área metropolitana y en el Oriente antioqueño. El SOAT es nacional; lo que cambia es la autoridad de tránsito y la administración de la vía.</p>\n      ${Object.entries(REGIONES).map(([k, R]) => `<p class="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">${R.label}</p><div class="mt-2 flex flex-wrap gap-2">${MUNICIPIOS.filter((m) => regionOf(m) === k).map((m) => `<a href="${muniUrl(m)}" class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 hover:border-gold-500 rounded-full px-4 py-2 text-sm text-navy-900">${esc(m.name)}</a>`).join(\'\')}</div>`).join(\'\')}\n      <p class="mt-5"><a href="/area-metropolitana/" class="font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-2">Ver toda la cobertura ${ic(\'arrow\')}</a></p></div>');
r("cómo atendemos a víctimas de accidentes de tránsito en Medellín y el Valle de Aburrá.',", "cómo atendemos a víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente.',");
r("'Nos concentramos en accidentes de tránsito en Medellín y el Valle de Aburrá: SOAT,", "'Nos concentramos en accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño: SOAT,");
r("'Orientación a víctimas en Medellín y en los municipios del Valle de Aburrá.'", "'Orientación a víctimas en Medellín, en los municipios del Valle de Aburrá y en el Oriente antioqueño (Rionegro, La Ceja, El Retiro y El Carmen de Viboral).'");
r("['pin', 'Cobertura', 'Medellín y el Valle de Aburrá', '/area-metropolitana/'],", "['pin', 'Cobertura', 'Valle de Aburrá y Oriente antioqueño', '/area-metropolitana/'],");

// ---- Schema.org ----
const AREA = "const AREA_SERVED = [{ '@type': 'City', name: 'Medellín', containedInPlace: { '@type': 'AdministrativeArea', name: 'Antioquia, Colombia' } }, ...MUNICIPIOS.map((m) => ({ '@type': 'City', name: m.name, containedInPlace: { '@type': 'AdministrativeArea', name: 'Antioquia, Colombia' } })), { '@type': 'AdministrativeArea', name: 'Valle de Aburrá' }, { '@type': 'AdministrativeArea', name: 'Oriente antioqueño' }];\n";
r("  const org = { '@context': 'https://schema.org', '@type': 'LegalService',", AREA.replace(/^/, '  ') + "  const org = { '@context': 'https://schema.org', '@type': 'LegalService',");
r("description: 'Firma de abogados especializada en accidentes de tránsito en Medellín y el Valle de Aburrá. Consulta inicial sin costo y disponibilidad 24/7.', areaServed: [{ '@type': 'City', name: 'Medellín' }, ...MUNICIPIOS.map((m) => ({ '@type': 'City', name: m.name }))],",
  "description: 'Firma de abogados especializada en accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño. Consulta inicial sin costo y disponibilidad 24/7.', areaServed: AREA_SERVED, knowsAbout: ['Accidentes de tránsito', 'SOAT', 'Responsabilidad civil extracontractual', 'Reclamaciones a aseguradoras', 'Perjuicios por lesiones personales', 'Responsabilidad del Estado por vías en mal estado'], knowsLanguage: 'es',");
// Service en cada servicio: área completa (se define a nivel de módulo)
r("provider: { '@id': SITE.url + '/#organization' }, areaServed: { '@type': 'City', name: 'Medellín' }, description: s.metaDesc },",
  "provider: { '@id': SITE.url + '/#organization' }, areaServed: [{ '@type': 'City', name: 'Medellín' }, ...MUNICIPIOS.map((m) => ({ '@type': 'City', name: m.name }))], description: s.metaDesc },");
// Municipio: WebPage + Service local
r("about: { '@type': 'City', name: m.name } }],",
  "about: { '@type': 'City', name: m.name, containedInPlace: { '@type': 'AdministrativeArea', name: (reg === 'oriente' ? 'Oriente antioqueño' : 'Valle de Aburrá') + ', Antioquia, Colombia' } }, isPartOf: { '@id': SITE.url + '/#website' } },\n        { '@context': 'https://schema.org', '@type': 'Service', name: `Orientación jurídica por accidentes de tránsito en ${m.name}`, serviceType: 'Asesoría jurídica en accidentes de tránsito', provider: { '@id': SITE.url + '/#organization' }, areaServed: { '@type': 'City', name: m.name }, description: m.desc }],");
// Hub cobertura: ItemList de municipios
r("render({ url: '/area-metropolitana/', title: 'Abogado de accidentes de tránsito en el Valle de Aburrá y el Oriente',",
  "render({ url: '/area-metropolitana/', schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Municipios con orientación por accidentes de tránsito', itemListElement: MUNICIPIOS.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, url: SITE.url + muniUrl(m) })) }], title: 'Abogado de accidentes de tránsito en el Valle de Aburrá y el Oriente',");

// ---- llms.txt y llms-full.txt ----
const i0 = s.indexOf("  w('llms.txt',");
const i1 = s.indexOf("  w('llms-full.txt', full);") + "  w('llms-full.txt', full);".length;
if (i0 < 0 || i1 < i0) throw new Error('bloque llms');
const LLMS = `  const regionList = (k) => MUNICIPIOS.filter((m) => regionOf(m) === k);
  const auth = (m) => m.autoridad.candidato ? m.autoridad.nombre + ' (datos de contacto por confirmar en la alcaldía)' : m.autoridad.nombre + ': ' + m.autoridad.dir + '. Tel. ' + m.autoridad.tel;
  const legalLinks = LEGAL_LINKS.map(([t, u]) => \`- [\${t}](\${SITE.url}\${u})\`).join('\\n');
  w('llms.txt', [
    \`# \${SITE.name}\`,
    \`> \${SITE.name} es una firma de abogados que orienta a víctimas de accidentes de tránsito en \${'Medellín, el Valle de Aburrá y el Oriente antioqueño'} (Colombia). Oficina: \${SITE.address}. Teléfono: \${SITE.phone}. Consulta inicial sin costo; disponibilidad 24/7. El contenido del sitio es informativo y no constituye asesoría jurídica ni garantiza resultados.\`,
    \`Última actualización del contenido: \${SITE.lastReview}. Idioma: español (Colombia).\`,
    '## Datos clave',
    [\`- Nombre: \${SITE.name}\`, \`- Dirección: \${SITE.address}\`, \`- Teléfono: \${SITE.phone}\`, \`- Horario: \${SITE.hours}\`, '- Primera consulta: sin costo', \`- Cobertura: Medellín; Valle de Aburrá (\${regionList('aburra').map((m) => m.name).join(', ')}); Oriente antioqueño (\${regionList('oriente').map((m) => m.name).join(', ')})\`, '- Temas: accidentes de tránsito, SOAT, reclamaciones a aseguradoras, responsabilidad civil, lesiones y perjuicios, responsabilidad del Estado por vías'].join('\\n'),
    '## Servicios',
    Object.entries(SERVICES).map(([sl, v]) => \`- [\${v.short}](\${SITE.url}\${svcUrl(sl)}): \${v.metaDesc}\`).join('\\n'),
    '## Cobertura por municipio',
    \`- [Cobertura: Valle de Aburrá y Oriente antioqueño](\${SITE.url}/area-metropolitana/)\`,
    ...Object.entries(REGIONES).map(([k, R]) => \`### \${R.label}\\n\` + regionList(k).map((m) => \`- [\${m.name}](\${SITE.url}\${muniUrl(m)}): \${m.desc}\`).join('\\n')),
    '## Guías',
    \`- [Índice de guías](\${SITE.url}/blog/)\`,
    ARTICLES.map((a) => \`- [\${a.title}](\${SITE.url}/blog/\${a.slug}/): \${a.desc}\`).join('\\n'),
    '## Herramientas y recursos',
    [\`- [Calculadora orientativa de indemnización](\${SITE.url}/calculadora-indemnizacion/): estima perjuicios patrimoniales; no incluye perjuicios morales ni garantiza montos.\`, \`- [Modelo de derecho de petición a una aseguradora](\${SITE.url}/recursos/modelo-derecho-de-peticion/)\`, \`- [Glosario](\${SITE.url}/glosario/)\`, \`- [Preguntas frecuentes](\${SITE.url}/preguntas-frecuentes/)\`, \`- [Honorarios y cuota litis](\${SITE.url}/honorarios-cuota-litis/)\`].join('\\n'),
    '## Sobre la firma',
    [\`- [Nosotros](\${SITE.url}/nosotros/)\`, \`- [Contacto](\${SITE.url}/contacto/)\`].join('\\n'),
    '## Legal',
    legalLinks,
    '## Optional',
    \`- [Contenido completo en texto](\${SITE.url}/llms-full.txt)\`,
  ].join('\\n\\n') + '\\n');
  const blk = (arr) => arr.join('\\n\\n');
  const full = ['# ' + SITE.name + ' (contenido completo)', '> Orientación jurídica informativa para víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño (Colombia). No constituye asesoría jurídica ni garantiza resultados. Última actualización: ' + SITE.lastReview + '.',
    '## Datos de la firma', ['- Nombre: ' + SITE.name, '- Dirección: ' + SITE.address, '- Teléfono: ' + SITE.phone, '- Horario: ' + SITE.hours, '- Primera consulta sin costo', '- Sitio: ' + SITE.url].join('\\n'),
    '## Preguntas frecuentes generales', FAQ_GENERAL.map(([q, a]) => '- **' + q + '** ' + a).join('\\n'),
    '## Servicios',
    ...Object.entries(SERVICES).map(([sl, v]) => { const x = EXTRA[sl]; return blk(['### ' + v.title, SITE.url + svcUrl(sl), '**Respuesta rápida:** ' + x.respuesta, ...v.entender, '**Perjuicios que pueden analizarse:**\\n' + v.danos.map((d) => '- ' + d).join('\\n'), ...v.seguros, '**Preguntas frecuentes:**\\n' + [...v.faqs, ...x.faqs].map(([q, a]) => '- ' + q + ' ' + a).join('\\n')]); }),
    '## Cobertura por municipio',
    'El SOAT es de alcance nacional. Entre municipios cambian la autoridad de tránsito que elabora el informe, la entidad que administra la vía y los trámites locales. Los datos de autoridades provienen de fuentes oficiales y deben confirmarse antes de acudir.',
    ...MUNICIPIOS.map((m) => blk(['### ' + m.name + ' (' + REGIONES[regionOf(m)].label + ')', SITE.url + muniUrl(m), m.p1, m.p2, m.p3, '**Autoridad de tránsito:** ' + auth(m), '**Situaciones frecuentes:**\\n' + m.escenarios.map(([t, d]) => '- ' + t + ': ' + d).join('\\n'), '**Preguntas frecuentes:**\\n' + muniFaqs(m).map(([q, a]) => '- ' + q + ' ' + a).join('\\n')])),
    '## Guías',
    ...ARTICLES.map((a) => blk(['### ' + a.title, SITE.url + '/blog/' + a.slug + '/', '**En resumen:**\\n' + a.resumen.map((x) => '- ' + x).join('\\n'), ...a.sections.map(([t, bl]) => '#### ' + t + '\\n' + blocksToText(bl))])),
    '## Glosario',
    ...Object.values(GLOSARIO).map(([t, d]) => '- **' + t + ':** ' + d),
    '## Aviso',
    'La información es orientativa y general. Cada caso requiere revisión individual por un abogado. Normas, topes y trámites cambian: verifica su vigencia. Documentos legales: ' + LEGAL_LINKS.map(([t, u]) => t + ' (' + SITE.url + u + ')').join('; ') + '.'].join('\\n\\n');
  w('llms-full.txt', full);`;
s = s.slice(0, i0) + LLMS + s.slice(i1);
fs.writeFileSync('build.mjs', s);

// ---- FAQs de cobertura en contenidos ----
let f = fs.readFileSync('src/faqs.mjs', 'utf8');
f = f.replace("['¿Atienden casos de todo el Valle de Aburrá?', 'Orientamos a víctimas de accidentes en los diez municipios del Valle de Aburrá. Confirma la modalidad de atención al contactarnos.'],",
  "['¿Atienden casos de todo el Valle de Aburrá y del Oriente?', 'Orientamos a víctimas de accidentes en los diez municipios del Valle de Aburrá y en Rionegro, La Ceja, El Retiro y El Carmen de Viboral. Confirma la modalidad de atención al contactarnos.'],");
fs.writeFileSync('src/faqs.mjs', f);
let c = fs.readFileSync('src/content.mjs', 'utf8');
c = c.replace("['¿Atienden fuera de Medellín?', 'Nuestro enfoque es Medellín y el Valle de Aburrá. Si estás en otro municipio, escríbenos y te indicamos si podemos atender tu caso.'],",
  "['¿Atienden fuera de Medellín?', 'Sí. Orientamos a víctimas en el Valle de Aburrá y en el Oriente antioqueño (Rionegro, La Ceja, El Retiro y El Carmen de Viboral). Si estás en otro municipio, escríbenos y te indicamos si podemos atender tu caso.'],");
fs.writeFileSync('src/content.mjs', c);
console.log('ok');
