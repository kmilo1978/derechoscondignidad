// Genera los entregables documentales del brief (sección 12) a partir de dist/, docs/_pages.json y tools/excel.json
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from '../src/config.mjs';

const pages = JSON.parse(fs.readFileSync('docs/_pages.json', 'utf8'));
const excel = JSON.parse(fs.readFileSync('tools/excel.json', 'utf8'));
const implemented = new Set(pages.filter((p) => !p.noindex).map((p) => p.url));
const csv = (rows) => rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
const w = (f, c) => fs.writeFileSync(path.join('docs', f), c);

// ---- Mapeo URL propuesta (Excel) -> URL implementada ----
const ALIAS = {
  '/servicios/objecion-aseguradora/': ['/servicios/aseguradoras-no-pagan/', 'Consolidada: el sitemap del brief usa aseguradoras-no-pagan'],
  '/servicios/gastos-medicos-sobre-tope-soat/': ['/servicios/gastos-medicos-superan-soat/', 'Consolidada: el sitemap del brief usa gastos-medicos-superan-soat'],
  '/servicios/muerte-accidente-transito/': ['/servicios/accidente-mortal/', 'Consolidada: el sitemap del brief usa accidente-mortal'],
  '/blog/apelar-dictamen-junta/': ['/blog/junta-calificacion-guia/', 'Consolidada en la guía de Junta de Calificación'],
  '/servicios/medicina-legal/': ['/blog/medicina-legal-cita-accidente/', 'Consolidada: cubierta por guía informativa'],
  '/servicios/domiciliarios-plataformas/': ['/servicios/accidentes-plataformas/', 'Consolidada con plataformas + guía de domiciliarios'],
  '/servicios/fractura-tobillo-pie/': ['/servicios/fracturas-accidente-transito/', 'Consolidada en fracturas (evitar páginas débiles)'],
  '/servicios/fractura-costillas/': ['/servicios/fracturas-accidente-transito/', 'Consolidada en fracturas (evitar páginas débiles)'],
  '/servicios/lesion-rodilla/': ['/servicios/lesiones-personales/', 'Consolidada: pendiente de página propia si hay diferencial'],
  '/servicios/lesion-hombro/': ['/servicios/lesiones-personales/', 'Consolidada: pendiente de página propia si hay diferencial'],
  '/servicios/lesion-mano-dedos/': ['/servicios/lesiones-personales/', 'Consolidada: pendiente de página propia si hay diferencial'],
  '/servicios/menores-adultos-mayores/': ['/servicios/accidentes-peatones/', 'Parcial: pendiente de página propia (Ola 3)'],
};
const NOT_BUILT = {
  '/calculadora-indemnizacion/': 'No construida: el brief exige metodología validada por abogado antes de publicar una calculadora',
  '/servicios/patineta-electrica/': 'Pendiente (Ola 3, prioridad media): validar demanda y contenido diferencial',
  '/servicios/vehiculos-pesados/': 'Pendiente (Ola 3, prioridad baja)',
};

const kwRows = excel.Keywords.slice(1).filter((r) => r[0]).map((r) => {
  const [kw, cluster, intent, type, url, prio] = r;
  let impl = '', estado = '';
  if (implemented.has(url)) { impl = url; estado = 'Implementada'; }
  else if (ALIAS[url] && implemented.has(ALIAS[url][0])) { impl = ALIAS[url][0]; estado = ALIAS[url][1]; }
  else if (url.startsWith('/abogado-accidentes-transito-')) { estado = 'No construida: páginas por municipio solo si la firma presta servicio allí y hay contenido local diferenciado (evitar doorway pages)'; }
  else if (NOT_BUILT[url]) { estado = NOT_BUILT[url]; }
  else estado = 'Pendiente';
  return [kw, cluster, intent, type, prio, url, impl, estado, 'PENDIENTE DE VALIDAR', 'PENDIENTE DE VALIDAR'];
});
w('02-matriz-url-keyword.csv', '\uFEFF' + csv([['Keyword primaria', 'Cluster', 'Intención', 'Tipo de página', 'Prioridad', 'URL propuesta (Excel)', 'URL implementada', 'Estado', 'Volumen mensual', 'Dificultad'], ...kwRows]));

// ---- Sitemap jerárquico ----
const sorted = [...pages].sort((a, b) => a.url.localeCompare(b.url));
const lines = sorted.map((p) => `${'  '.repeat(Math.max(0, p.crumbs.length - 1))}- \`${p.url}\` — ${p.h1 || p.title} ${p.noindex ? '**(noindex, landing de pauta)**' : ''}`);
w('01-sitemap-jerarquico.md', `# Sitemap jerárquico implementado\n\nPáginas indexables: ${implemented.size}. Landings de pauta noindex: ${pages.filter((p) => p.noindex && p.url.startsWith('/lp/')).length}.\n\nNavegación principal: Inicio | Accidentes y lesiones | SOAT y aseguradoras | Responsabilidad civil | Blog | Nosotros | Contacto. "Casos y resultados" y "Testimonios" se activarán solo cuando existan casos reales y autorizados (\`SITE.cases\`, \`SITE.testimonials\`).\n\n${lines.join('\n')}\n`);

// ---- Brief de contenido por URL ----
w('03-brief-contenido-por-url.csv', '\uFEFF' + csv([['URL', 'Indexable', 'H1', 'Title SEO', 'Meta description', 'H2'], ...sorted.map((p) => [p.url, p.noindex ? 'no' : 'sí', p.h1, p.title, p.desc, p.h2.join(' | ')])]));

// ---- Plan editorial ----
const SLUG = ['accidente-transito-colombia-que-hacer-a-quien-reclamar', 'que-hacer-despues-accidente-transito', 'firmar-acuerdo-aseguradora', 'ipat-informe-accidente', 'soat-cuanto-cubre', 'diferencia-soat-demanda-civil', 'reclamar-soat-paso-a-paso', 'como-se-calcula-indemnizacion', 'indemnizacion-fractura-segun-hueso', 'dano-moral-vida-de-relacion', 'plazos-demandar-accidente', 'etapas-duracion-proceso', 'guia-motociclista-lesionado', 'parrillero-ciclista-peaton-quien-responde', 'domiciliarios-plataformas-accidente', 'demanda-alcaldia-hueco', 'aseguradora-objeta-como-responder', 'medicina-legal-cita-accidente', 'junta-calificacion-guia', null, 'cuanto-cobra-abogado-accidente-transito'];
const blog = excel.Blog.slice(1).filter((r) => r[4]).map((r, i) => {
  const slug = SLUG[i];
  const url = slug ? `/blog/${slug}/` : '';
  const ok = url && implemented.has(url);
  const nota = !slug ? 'No redactado: requiere datos oficiales verificados de siniestralidad (no se inventan cifras)' : (i === 7 ? 'El "ejemplo" se resuelve de forma cualitativa: el brief prohíbe presentar cifras como garantía' : i === 8 ? 'Sin montos por hueso: se explican variables' : '');
  return [r[1], r[2], r[4], r[5], r[7], url, ok ? 'Redactado (pendiente revisión jurídica)' : 'Pendiente', nota];
});
w('04-plan-editorial.md', `# Plan editorial (Excel, hoja Blog)\n\nEstado: todo contenido está **redactado como borrador pendiente de revisión por un abogado colombiano**. Fechas de publicación: a definir por la firma.\n\n| Ola | Cluster | Título propuesto | Keyword | Enlaza a | URL | Estado | Nota |\n|---|---|---|---|---|---|---|---|\n${blog.map((r) => `| ${r.map((c) => String(c).replace(/\|/g, '/')).join(' | ')} |`).join('\n')}\n\nArtículos adicionales derivados de la matriz de keywords: \`/blog/vale-la-pena-contratar-abogado/\`, \`/blog/dias-incapacidad-fracturas/\`.\n`);

// ---- Enlazado interno ----
const distFiles = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? distFiles(path.join(d, e.name)) : [path.join(d, e.name)]);
const inbound = new Map(pages.map((p) => [p.url, new Set()]));
for (const f of distFiles('dist').filter((x) => x.endsWith('index.html'))) {
  const from = '/' + path.relative('dist', path.dirname(f)).replace(/\\/g, '/') + '/';
  const html = fs.readFileSync(f, 'utf8').replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, '');
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) { const to = m[1]; if (to !== from && inbound.has(to)) inbound.get(to).add(from === '//' ? '/' : from); }
}
const orphans = [...inbound].filter(([u, s]) => s.size === 0 && !u.startsWith('/lp/') && u !== '/no-encontrado/');
w('05-enlazado-interno.csv', '\uFEFF' + csv([['URL', 'Enlaces entrantes (contenido, sin header/footer)', 'Huérfana'], ...[...inbound].map(([u, s]) => [u, s.size, s.size === 0 && !u.startsWith('/lp/') ? 'SÍ' : 'no'])]));
console.log('Huérfanas (sin enlaces desde contenido):', orphans.length, orphans.map(([u]) => u).join(', '));

// ---- Datos faltantes ----
const falt = [['Razón social / nombre legal', SITE.legalName], ['Teléfono', SITE.phone], ['WhatsApp', SITE.whatsapp], ['Correo', SITE.email], ['Dirección (igual a Google Business Profile)', SITE.address], ['Horarios', SITE.hours], ['Embed de Google Maps', SITE.mapEmbed], ['Abogados con tarjeta profesional, foto autorizada y bio', SITE.lawyers.length ? 'ok' : ''], ['Testimonios reales y autorizados', SITE.testimonials.length ? 'ok' : ''], ['Casos documentados y autorizados', SITE.cases.length ? 'ok' : ''], ['ID de Google Analytics 4', SITE.ga4], ['Verificación de Search Console', SITE.gscVerification]];
w('00-datos-faltantes.md', `# Diagnóstico de datos faltantes de la firma\n\nEl sitio **no inventa** estos datos. Se configuran en \`src/config.mjs\` y se reflejan al ejecutar \`npm run build\`.\n\n| Dato | Estado |\n|---|---|\n${falt.map(([k, v]) => `| ${k} | ${v ? 'Configurado' : '**FALTA**'} |`).join('\n')}\n\n## Decisiones que debe tomar la firma\n1. Nombre de marca y dominio definitivo (el brief recomienda marca sobre exact-match).\n2. Cobertura real: ¿atiende Bello, Itagüí, Envigado, Sabaneta, La Estrella, Caldas, Copacabana, Girardota, Barbosa, Rionegro? Solo así se crean páginas locales con contenido diferenciado.\n3. Modelo real de honorarios (cuota litis, porcentaje, momento de cobro, gastos del proceso) y política de primera consulta.\n4. Autor y revisor jurídico de cada contenido, con fecha de revisión.\n5. Políticas de privacidad y tratamiento de datos aprobadas por abogado (responsable del tratamiento, NIT, canal para derechos del titular).\n6. Canal de recepción de formularios (WhatsApp, correo o CRM): hoy el formulario no envía a un servidor.\n7. Fotografías reales de oficina y equipo, con autorización.\n8. Metodología validada si se desea publicar la calculadora de indemnización.\n`);

// ---- Especificación técnica ----
w('06-especificacion-tecnica.md', `# Especificación técnica

- **Arquitectura**: sitio estático generado con Node (\`build.mjs\`) + Tailwind CSS 3 compilado (sin CDN). Salida en \`dist/\`, desplegable en cualquier hosting estático/CDN con HTTPS.
- **Rendimiento**: sin JS de terceros por defecto; fuentes del sistema; iconos SVG inline; CSS minificado; sin imágenes pesadas. Medir Core Web Vitals (LCP, INP, CLS) con datos de campo tras publicar.
- **SEO on-page**: un H1 por página, title y meta únicos, canonical, breadcrumbs visibles con \`BreadcrumbList\`, enlaces internos contextuales, glosario y respuesta rápida al inicio de cada página.
- **Datos estructurados**: \`LegalService\` (solo datos reales configurados), \`WebSite\`, \`WebPage\`, \`Service\`, \`Article\`, \`FAQPage\`, \`DefinedTermSet\`, \`Person\` (solo si hay abogados). No se marcan reseñas, calificaciones ni resultados. Validar con las herramientas oficiales antes de publicar. No se promete resultado enriquecido de FAQ.
- **Rastreo e IA**: \`robots.txt\` con reglas separadas para \`OAI-SearchBot\` y \`GPTBot\` (decisión del titular), \`sitemap.xml\` solo con URLs canónicas indexables, \`llms.txt\` y \`llms-full.txt\`. IndexNow: evaluar; no garantiza indexación.
- **Landings de pauta**: \`/lp/*\`, noindex, header/footer mínimos, canonical a la página de servicio.
- **Analítica y eventos**: GA4 (si hay ID) y \`dataLayer\`: \`click_whatsapp\`, \`click_call\`, \`form_submit\` con ubicación. Configurar Search Console y marcar conversiones en GA4.
- **Accesibilidad**: skip link, foco visible, etiquetas de formulario, \`prefers-reduced-motion\`, tablas con encabezados, contraste revisado.
- **Seguridad**: HTTPS y cabeceras en el hosting (CSP, HSTS, X-Content-Type-Options), protección anti-spam en el endpoint del formulario cuando se conecte.
- **QA automático**: \`npm run check\` (enlaces rotos, títulos/metas únicos y longitud, H1, JSON-LD válido, anclas, páginas huérfanas).
- **Redirecciones/404**: \`404.html\` incluida; configurar 301 en el hosting si cambian URLs.
`);

// ---- Validación jurídica y plan por olas ----
w('07-validacion-juridica-y-olas.md', `# Lista de validación jurídica (obligatoria antes de publicar)

- [ ] Un abogado colombiano revisó y aprobó TODO el contenido (servicios, blog, glosario, FAQ, recurso descargable).
- [ ] Verificar vigencia y aplicación de normas citadas: Ley 769 de 2002, Ley 599 de 2000 (art. 120), Decreto 780 de 2016 (SOAT), Ley 1123 de 2007 (Código Disciplinario del Abogado; el informe cita "Decreto 1123", probablemente un error), Ley 1581 de 2012.
- [ ] Verificar topes del SOAT y plazos (prescripción, caducidad, querella) antes de citar cifras. El sitio **no** publica topes ni plazos.
- [ ] No usar cifras como "40 millones" o "30 a 60 millones" ni garantías de resultados.
- [ ] Honorarios y cuota litis coinciden con el contrato real.
- [ ] Autorización escrita para nombres, imágenes, testimonios y casos.
- [ ] Textos de privacidad y tratamiento de datos aprobados (Ley 1581 de 2012).
- [ ] Copys de anuncios revisados bajo reglas de publicidad profesional; sin abordajes intrusivos ni uso de datos sensibles de salud para segmentar.

# Plan por olas (brief, sección 10)

| Ola | Entregables | Estado |
|---|---|---|
| 1 (días 1–30) | Home, hubs, moto/carro, cuota litis, SOAT/aseguradoras, contacto, medición, GBP | Construido; falta datos reales, revisión jurídica y GBP |
| 2 (días 31–60) | Servicios por nicho, artículos prioritarios, enlazado interno | Construido en borrador |
| 3 (días 61–90) | Nichos restantes, contenido de autoridad, calculadora si hay metodología validada | Parcial: pendientes calculadora, municipios, siniestralidad y nichos nuevos del Excel |
| Continuo | Revisión técnica, actualización jurídica, reseñas, análisis | A cargo de la firma |

KPIs: impresiones, clics, CTR y posición por URL/cluster (Search Console); conversiones (WhatsApp, llamadas, formularios); calidad de leads; Core Web Vitals e indexación.
`);
console.log('docs generados:', fs.readdirSync('docs').join(', '));
