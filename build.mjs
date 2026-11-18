import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './src/config.mjs';
import { HUBS, SERVICES, PASOS_CASO, FAQ_GENERAL } from './src/content.mjs';
import { ARTICLES } from './src/articles.mjs';
import { GLOSARIO, FUENTES, TABLA_VIAS, ERRORES_GENERALES, EXTRA } from './src/extra.mjs';
import { SERVICES2, EXTRA2, HUB_ADD, GLOS2 } from './src/services2.mjs';
import { ARTICLES2, SEO_TITLES } from './src/articles2.mjs';
import { EXTRA_SECTIONS } from './src/articles-extra.mjs';
import { faqsFor, POOLS_BY_HUB, POOLS_BY_CLUSTER } from './src/faqs.mjs';
import { MUNICIPIOS, muniFaqs, DIRECTORIO_URL, RECURSOS, REGIONES, regionOf } from './src/municipios.mjs';
import { PRIVACIDAD, AUTORIZACION, TERMINOS, COOKIES, LEGAL_FAQ } from './src/legal.mjs';
Object.assign(SERVICES, SERVICES2); Object.assign(EXTRA, EXTRA2); Object.assign(GLOSARIO, GLOS2);
for (const [id, items] of Object.entries(HUB_ADD)) HUBS.find((h) => h.id === id).items.push(...items);
ARTICLES.push(...ARTICLES2);
for (const art of ARTICLES) if (EXTRA_SECTIONS[art.slug]) art.sections.push(...EXTRA_SECTIONS[art.slug]);
const pageMeta = [];

const DIST = 'dist';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const digits = (s) => String(s).replace(/\D/g, '');

const BUILD_V = Date.now().toString(36);
// ---------- Iconos (Lucide, inline) ----------
const ICONS = {
  scale: '<path d="M12 3v18m7-13 3 8a5 5 0 0 1-6 0zV7"/><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1M5 8l3 8a5 5 0 0 1-6 0zV7m2 14h10"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  gavel: '<path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999M15.973 4.027l4 4M16 16l6-6m-.5.5-8-8M8 8l6-6M8.5 7.5l8 8"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  phone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
};
const ic = (n, cls = 'w-5 h-5') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

// ---------- Logo ----------
const LOGO_CANDIDATES = ['logo.png', 'logo.webp', 'logo.jpg', 'logo.jpeg', 'logo.svg'];
const logoFile = LOGO_CANDIDATES.find((n) => fs.existsSync('src/assets/' + n));
const LOGO = { url: '/assets/' + logoFile, file: 'src/assets/' + logoFile, ext: path.extname(logoFile), w: 150, h: 50 };
const hasOG = fs.existsSync('src/assets/og-default.png');
const logoImg = (cls = 'h-10 w-auto') => `<img src="${LOGO.url}" alt="${esc(SITE.name)}" width="${LOGO.w}" height="${LOGO.h}" class="${cls}" decoding="async">`;

// ---------- Contacto ----------
const hasWA = !!digits(SITE.whatsapp);
const hasPhone = !!digits(SITE.phone);
const waLink = (msg = 'Hola, tuve un accidente de tránsito y quisiera orientación.') =>
  hasWA ? `https://wa.me/${digits(SITE.whatsapp)}?text=${encodeURIComponent(msg)}` : '/contacto/';
const telLink = hasPhone ? `tel:${SITE.phoneDial || '+' + digits(SITE.phone)}` : '/contacto/';
const pending = (txt) => SITE.production ? '' : `<p class="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500" data-pendiente>Pendiente de la firma: ${esc(txt)}</p>`;

const gold = 'inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3.5 rounded-lg transition-colors';
const outline = 'inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-lg transition-colors';
const btnWA = (label = 'Escríbenos por WhatsApp', cls = '', loc = 'cta') => hasWA
  ? `<a href="${waLink()}" data-track="whatsapp" data-loc="${loc}" target="_blank" rel="noopener" class="${gold} ${cls}">${ic('chat')}${label}</a>`
  : `<a href="${telLink}" data-track="call" data-loc="${loc}" class="${gold} ${cls}">${ic('phone')}${label === 'WhatsApp' ? 'Llamar' : 'Llamar ahora'}</a>`;
const btnCall = (label = hasPhone ? esc(SITE.phone) : 'Llamar', cls = '', loc = 'cta') => hasWA
  ? `<a href="${telLink}" data-track="call" data-loc="${loc}" class="${outline} ${cls}">${ic('phone')}${label}</a>`
  : `<a href="/contacto/#formulario" data-track="form" data-loc="${loc}" class="${outline} ${cls}">${ic('mail')}Enviar consulta</a>`;

// ---------- Navegación ----------
const svcUrl = (s) => `/servicios/${s}/`;
const NAV = [
  { label: 'Accidentes y lesiones', hubs: ['accidentes-lesiones', 'victimas-transporte'] },
  { label: 'SOAT y aseguradoras', hubs: ['soat-aseguradoras'] },
  { label: 'Responsabilidad civil', hubs: ['responsabilidad-estado'] },
  { label: 'Cobertura', href: '/area-metropolitana/' },
  { label: 'Calculadora', href: '/calculadora-indemnizacion/' },
  { label: 'Guías', href: '/blog/' },
  { label: 'Nosotros', href: '/nosotros/' },
  { label: 'Contacto', href: '/contacto/' },
];
const hub = (id) => HUBS.find((h) => h.id === id);

function header() {
  const desk = NAV.map((n) => {
    if (n.href) return `<a href="${n.href}" class="px-2 2xl:px-3 py-2 text-[13px] 2xl:text-[14.5px] font-medium rounded-lg hover:bg-white/5 text-white/90 hover:text-gold-500 focus-visible:text-gold-500 transition-colors whitespace-nowrap">${n.label}</a>`;
    const items = n.hubs.flatMap((id) => hub(id).items).slice(0, 8).map((s) => `<a href="${svcUrl(s)}" class="block px-4 py-2 text-sm text-slate-700 hover:bg-navy-900 hover:text-gold-500 focus-visible:bg-navy-900 focus-visible:text-gold-500 transition-colors">${esc(SERVICES[s].short)}</a>`).join('');
    return `<div class="relative group">
      <a href="/servicios/#${n.hubs[0]}" class="px-2 2xl:px-3 py-2 text-[13px] 2xl:text-[14.5px] font-medium rounded-lg hover:bg-white/5 text-white/90 hover:text-gold-500 group-hover:text-gold-500 group-focus-within:text-gold-500 transition-colors inline-flex items-center gap-1 whitespace-nowrap">${n.label}${ic('down', 'w-4 h-4')}</a>
      <div class="absolute left-0 top-full hidden group-hover:block group-focus-within:block pt-2 w-72 z-50"><div class="bg-white rounded-xl shadow-xl border border-slate-200 py-2">${items}<a href="/servicios/#${n.hubs[0]}" class="block px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-900 hover:text-gold-500 transition-colors border-t border-slate-100">Ver todos</a></div></div></div>`;
  }).join('');
  const mobLink = 'flex items-center justify-between py-3.5 text-base text-white/90 hover:text-gold-500 focus-visible:text-gold-500 transition-colors';
  const mob = NAV.map((n) => {
    if (n.href) return `<li class="border-b border-white/10"><a href="${n.href}" class="${mobLink}">${n.label}</a></li>`;
    const items = n.hubs.flatMap((id) => hub(id).items).map((sv) => `<li><a href="${svcUrl(sv)}" class="block py-2.5 pl-4 text-[15px] text-slate-300 hover:text-gold-500 border-l border-white/10 hover:border-gold-500 transition-colors">${esc(SERVICES[sv].short)}</a></li>`).join('');
    return `<li class="border-b border-white/10"><details class="group/m"><summary class="${mobLink} cursor-pointer list-none group-open/m:text-gold-500">${n.label}<span class="transition-transform group-open/m:rotate-180">${ic('down', 'w-5 h-5')}</span></summary><ul class="pb-3 space-y-0.5">${items}<li><a href="/servicios/#${n.hubs[0]}" class="block py-2.5 pl-4 text-[15px] font-semibold text-gold-500 border-l border-gold-500">Ver toda la sección</a></li></ul></details></li>`;
  }).join('');
  return `<header class="sticky top-0 z-40 bg-navy-900/95 backdrop-blur border-b border-white/10">
  <div class="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-6 2xl:gap-10">
    <a href="/" class="flex items-center shrink-0" aria-label="${esc(SITE.name)} - Inicio"><span class="bg-white rounded-lg px-3 py-1.5 flex items-center">${logoImg('h-10 w-auto')}</span></a>
    <nav class="hidden xl:flex flex-1 justify-center items-center gap-1 2xl:gap-1.5 min-w-0" aria-label="Principal">${desk}</nav>
    <div class="hidden xl:block shrink-0">${btnWA('WhatsApp', '!py-2.5 !px-5 text-sm', 'header')}</div>
    <button id="menuBtn" type="button" class="xl:hidden text-white w-11 h-11 -mr-2 inline-flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-gold-500 transition-colors" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileMenu"><span data-icon-open>${ic('menu', 'w-7 h-7')}</span><span data-icon-close class="hidden">${ic('x', 'w-7 h-7')}</span></button>
  </div>
  <div id="mobileMenu" class="hidden xl:hidden bg-navy-900 border-t border-white/10 px-6 pb-6 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"><nav aria-label="Menú móvil"><ul>${mob}</ul></nav><div class="pt-5">${btnWA('Escríbenos por WhatsApp', 'w-full', 'menu')}</div></div>
</header>`;
}

function headerMin() {
  return `<header class="bg-navy-900 border-b border-white/10"><div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
    <a href="/" class="flex items-center" aria-label="${esc(SITE.name)} - Inicio"><span class="bg-white rounded-lg px-2.5 py-1 flex items-center">${logoImg('h-8 w-auto')}</span></a>
    <div class="flex items-center gap-2"><a href="${telLink}" data-track="call" data-loc="header-min" class="hidden sm:inline-flex items-center gap-2 text-white text-sm px-3 py-2">${ic('phone', 'w-4 h-4')}${hasPhone ? esc(SITE.phone) : 'Llamar'}</a>${btnWA('WhatsApp', '!py-2 !px-4 text-sm', 'header-min')}</div></div></header>`;
}
function footerMin() {
  return `<footer class="bg-navy-900 text-slate-400 py-8 text-xs"><div class="max-w-5xl mx-auto px-6"><p>La información de esta página es orientativa y no constituye asesoría jurídica ni garantiza resultados.</p><p class="mt-2"><a class="underline" href="/politica-de-privacidad/">Política de privacidad</a> · <a class="underline" href="/tratamiento-de-datos/">Tratamiento de datos</a></p></div></footer>`;
}

function footer() {
  const svc = ['accidentes-moto', 'accidentes-carro', 'soat', 'aseguradoras-no-pagan', 'responsabilidad-civil', 'lesiones-graves'];
  return `<footer class="bg-navy-900 text-slate-400 pt-16 pb-8">
  <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
    <div class="md:col-span-1">
      <a href="/" class="inline-flex bg-white rounded-lg px-3 py-2" aria-label="${esc(SITE.name)} - Inicio">${logoImg('h-10 w-auto')}</a>
      <p class="mt-4 text-sm leading-relaxed">Orientación jurídica para víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño.</p>
    </div>
    <div><p class="text-white text-xs font-semibold uppercase tracking-widest mb-4">Servicios</p><ul class="space-y-2 text-sm">${svc.map((s) => `<li><a class="hover:text-gold-500" href="${svcUrl(s)}">${esc(SERVICES[s].short)}</a></li>`).join('')}<li><a class="hover:text-gold-500" href="/servicios/">Ver todos</a></li></ul></div>
    <div><p class="text-white text-xs font-semibold uppercase tracking-widest mb-4">Información</p><ul class="space-y-2 text-sm">
      <li><a class="hover:text-gold-500" href="/nosotros/">Nosotros</a></li><li><a class="hover:text-gold-500" href="/area-metropolitana/">Cobertura: Valle de Aburrá y Oriente</a></li><li><a class="hover:text-gold-500" href="/calculadora-indemnizacion/">Calculadora de indemnización</a></li><li><a class="hover:text-gold-500" href="/honorarios-cuota-litis/">Honorarios y cuota litis</a></li><li><a class="hover:text-gold-500" href="/preguntas-frecuentes/">Preguntas frecuentes</a></li><li><a class="hover:text-gold-500" href="/blog/">Guías</a></li><li><a class="hover:text-gold-500" href="/glosario/">Glosario</a></li><li><a class="hover:text-gold-500" href="/recursos/modelo-derecho-de-peticion/">Modelo de derecho de petición</a></li><li><a class="hover:text-gold-500" href="/politica-de-privacidad/">Política de privacidad</a></li><li><a class="hover:text-gold-500" href="/tratamiento-de-datos/">Tratamiento de datos</a></li></ul></div>
    <div><p class="text-white text-xs font-semibold uppercase tracking-widest mb-4">Contacto</p><ul class="space-y-3 text-sm">
      <li class="flex gap-2">${ic('pin', 'w-4 h-4 mt-0.5 text-gold-500 shrink-0')}<span>${SITE.address ? esc(SITE.address) : 'Medellín, Antioquia'}</span></li>
      <li class="flex gap-2">${ic('phone', 'w-4 h-4 mt-0.5 text-gold-500 shrink-0')}<a href="${telLink}" data-track="call" data-loc="footer">${hasPhone ? esc(SITE.phone) : 'Ver página de contacto'}</a></li>
      ${SITE.email ? `<li class="flex gap-2">${ic('mail', 'w-4 h-4 mt-0.5 text-gold-500 shrink-0')}<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>` : ''}
    </ul></div>
  </div>
  <div class="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 text-xs leading-relaxed">
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-3"><p>© ${new Date().getFullYear()} ${esc(SITE.legalName || SITE.name)}. Todos los derechos reservados.</p><ul class="flex flex-wrap gap-x-5 gap-y-2">${LEGAL_LINKS.map(([t, u]) => `<li><a class="hover:text-gold-500" href="${u}">${t}</a></li>`).join('')}</ul></div>
  </div>
</footer>
<a href="${hasWA ? waLink() : telLink}" data-track="${hasWA ? 'whatsapp' : 'call'}" data-loc="flotante" ${hasWA ? 'target="_blank" rel="noopener"' : ''} class="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-4 py-3 rounded-full shadow-lg" aria-label="${hasWA ? 'Contactar por WhatsApp' : 'Llamar ahora'}">${ic(hasWA ? 'chat' : 'phone', 'w-6 h-6')}<span class="hidden sm:inline">${hasWA ? 'WhatsApp' : 'Llamar'}</span></a>`;
}

// ---------- Layout ----------
const pages = []; // para sitemap
function render({ url, title, desc, body, crumbs = [], schema = [], noindex = false, og = 'website', minimal = false, canonicalUrl, faq = null, scripts = [] }) {
  if (faq) { const list = faqsFor(faq.own || [], faq.pools || ['primeros'], faq.seed || url, faq.min || 6); body = insertBeforeCta(body, faqSection(list, faq.title, faq.search)); schema = [...schema, faqSchema(list)]; }
  { const words = body.replace(/<script[\s\S]*?<\/script>|<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; const mins = Math.max(1, Math.round(words / 200)); body = body.replace('<!--READING-->', `<span class="inline-flex items-center gap-1 mr-3 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">${ic('clock', 'w-3.5 h-3.5')}${mins} min de lectura</span>`); }
  const crumbBar = crumbs.length && !minimal ? crumbsBar(crumbs) : '';
  { const suf = ' | ' + SITE.name; if (title.endsWith(suf) && title.length > 68) title = title.slice(0, -suf.length); }
  const canonical = SITE.url + (canonicalUrl || url);
  pageMeta.push({ url, title, desc, noindex, h1: ((body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim(), h2: [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()), crumbs: crumbs.map((c) => c[0]) });
  const bc = crumbs.length
    ? { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: SITE.url + c[1] })) }
    : null;
  const AREA_SERVED = [{ '@type': 'City', name: 'Medellín', containedInPlace: { '@type': 'AdministrativeArea', name: 'Antioquia, Colombia' } }, ...MUNICIPIOS.map((m) => ({ '@type': 'City', name: m.name, containedInPlace: { '@type': 'AdministrativeArea', name: 'Antioquia, Colombia' } })), { '@type': 'AdministrativeArea', name: 'Valle de Aburrá' }, { '@type': 'AdministrativeArea', name: 'Oriente antioqueño' }];
  const org = { '@context': 'https://schema.org', '@type': 'LegalService', '@id': SITE.url + '/#organization', name: SITE.legalName || SITE.name, url: SITE.url, description: 'Firma de abogados especializada en accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño. Consulta inicial sin costo y disponibilidad 24/7.', areaServed: AREA_SERVED, knowsAbout: ['Accidentes de tránsito', 'SOAT', 'Responsabilidad civil extracontractual', 'Reclamaciones a aseguradoras', 'Perjuicios por lesiones personales', 'Responsabilidad del Estado por vías en mal estado'], knowsLanguage: 'es', openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }, ...(hasPhone ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', telephone: SITE.phoneDial || SITE.phone, areaServed: 'CO', availableLanguage: 'es' } } : {}), logo: SITE.url + LOGO.url, image: SITE.url + (hasOG ? '/assets/og-default.png' : LOGO.url),
    ...(hasPhone ? { telephone: SITE.phoneDial || SITE.phone } : {}), ...(SITE.email ? { email: SITE.email } : {}), ...(SITE.address ? { address: { '@type': 'PostalAddress', streetAddress: SITE.street || SITE.address, addressLocality: 'Medellín', addressRegion: 'Antioquia', addressCountry: 'CO' } } : {}) };
  const ld = [org, bc, ...schema].filter(Boolean).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const ga = SITE.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${SITE.ga4}');</script>` : '';
  const html = `<!DOCTYPE html>
<html lang="es-CO" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta property="og:type" content="${og}"><meta property="og:locale" content="es_CO"><meta property="og:site_name" content="${esc(SITE.name)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<meta name="theme-color" content="#0f172a">
${SITE.gscVerification ? `<meta name="google-site-verification" content="${esc(SITE.gscVerification)}">` : ''}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/assets/site.webmanifest">
${hasOG ? `<meta property="og:image" content="${SITE.url}/assets/og-default.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(SITE.name)}">` : ''}
<meta name="twitter:card" content="${hasOG ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">${hasOG ? `<meta name="twitter:image" content="${SITE.url}/assets/og-default.png">` : ''}
<link rel="stylesheet" href="/assets/style.css?v=${BUILD_V}">
${ld}
${ga}
</head>
<body class="bg-slate-50 text-slate-600 font-sans antialiased selection:bg-gold-500 selection:text-white">
<div id="readProgress" class="fixed top-0 left-0 h-1 bg-gold-500 z-[60] w-0" aria-hidden="true"></div>
<a href="#contenido" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-navy-900 focus:px-4 focus:py-2 focus:rounded">Saltar al contenido</a>
${minimal ? headerMin() : header()}
<main id="contenido">
${crumbBar}${body}
</main>
${minimal ? footerMin() : footer()}
<button id="toTop" type="button" aria-label="Volver arriba" class="fixed bottom-20 right-5 z-40 w-11 h-11 rounded-full bg-navy-900 text-white shadow-lg flex items-center justify-center opacity-0 pointer-events-none transition-opacity">${ic('down', 'w-5 h-5 rotate-180')}</button>
${scripts.map((s) => `<script src="${s}?v=${BUILD_V}" defer></script>`).join('')}
<script src="/assets/app.js?v=${BUILD_V}" defer></script>
</body>
</html>
`;
  const out = path.join(DIST, url === '/' ? '' : url, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (!noindex) pages.push(url);
}

// ---------- Componentes ----------
const crumbsHtml = (c) => `<nav aria-label="Migas de pan" class="text-sm text-slate-400 mb-6"><ol class="flex flex-wrap items-center gap-2">${c.map((x, i) => i === c.length - 1 ? `<li aria-current="page" class="text-slate-300">${esc(x[0])}</li>` : `<li><a href="${x[1]}" class="hover:text-gold-500">${esc(x[0])}</a></li><li aria-hidden="true">/</li>`).join('')}</ol></nav>`;

const pageHero = ({ crumbs, h1, sub, ctas = true, kicker }) => `<section class="relative bg-navy-900 text-white overflow-hidden">
  <div class="absolute inset-0 hero-grid opacity-40" aria-hidden="true"></div>
  <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true"></div>
  <div class="relative max-w-7xl mx-auto px-6 py-14 md:py-20">
    ${kicker ? `<p class="text-gold-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">${esc(kicker)}</p>` : ''}
    <h1 class="text-3xl md:text-5xl font-semibold tracking-tight max-w-4xl leading-tight">${esc(h1)}</h1>
    ${sub ? `<p class="mt-5 text-lg text-slate-300 max-w-3xl leading-relaxed">${esc(sub)}</p>` : ''}
    ${ctas ? `<div class="mt-8 flex flex-wrap gap-3">${btnWA('Hablar por WhatsApp', '', 'hero')}${btnCall(undefined, '', 'hero')}</div>` : ''}
  </div></section>`;

const faqHtml = (faqs, search = false) => `<div data-faq>${search ? '<input data-faq-search type="search" placeholder="Buscar en las preguntas…" aria-label="Buscar en las preguntas frecuentes" class="w-full mb-4 bg-white border border-slate-200 rounded-lg px-4 py-3">' : ''}<div class="flex justify-between items-center mb-3 text-xs"><span class="text-slate-500">${faqs.length} preguntas</span><span class="flex gap-4 no-print"><button type="button" data-faq-toggle="open" class="underline">Abrir todas</button><button type="button" data-faq-toggle="close" class="underline">Cerrar todas</button></span></div><div class="space-y-3">${faqs.map(([q, a]) => `<details class="group bg-white border border-slate-200 rounded-xl p-5"><summary class="flex justify-between items-center gap-4 cursor-pointer font-semibold text-navy-900 list-none">${esc(q)}<span class="shrink-0 transition-transform group-open:rotate-180">${ic('down')}</span></summary><p class="mt-3 text-slate-600 leading-relaxed">${esc(a)}</p></details>`).join('')}</div>${search ? '<p data-faq-empty class="hidden text-sm text-slate-500 mt-3">No encontramos preguntas con ese término.</p>' : ''}</div>`;

const ctaFinal = (title = '¿Tuviste un accidente de tránsito?', text = 'Cuéntanos qué pasó. Revisamos tu caso y te explicamos tus opciones, sin presiones.') => `<section class="relative bg-navy-900 text-white overflow-hidden">
  <div class="absolute inset-0 cta-diag" aria-hidden="true"></div>
  <div class="relative max-w-3xl mx-auto px-6 py-20 text-center">
    <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">${esc(title)}</h2>
    <p class="mt-4 text-slate-300 text-lg">${esc(text)}</p>
    <div class="mt-8 flex flex-wrap gap-3 justify-center">${btnWA('Hablar por WhatsApp', '', 'cta-final')}${btnCall(undefined, '', 'cta-final')}</div>
  </div></section>`;

const trustBlock = (who) => SITE.lawyers.length
  ? `<div class="grid gap-4 sm:grid-cols-2">${SITE.lawyers.map((l) => `<div class="bg-white border border-slate-200 rounded-xl p-5"><p class="font-semibold text-navy-900">${esc(l.name)}</p><p class="text-sm text-slate-500">T.P. ${esc(l.tp)}</p><p class="mt-2 text-sm">${esc(l.bio || '')}</p></div>`).join('')}</div>`
  : pending(`${who}: nombre del abogado responsable, tarjeta profesional, experiencia verificable y fecha de revisión jurídica.`);

const h2 = (t) => `<h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">${esc(t)}</h2>`;


// ---------- Equipo ----------
const TEAM = SITE.team || [];
const teamPhoto = (m) => m.photo && fs.existsSync(`src/assets/team/${m.photo}.webp`) ? `/assets/team/${m.photo}.webp` : '';
const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const teamHtml = () => `<section id="equipo" class="scroll-mt-28 bg-navy-900 text-white rounded-3xl px-5 py-8 md:p-10 -mx-1 md:-mx-6 lg:-mx-28" aria-labelledby="h-equipo">
  <h2 id="h-equipo" class="text-2xl md:text-3xl font-semibold tracking-tight">Conoce nuestro equipo</h2>
  <p class="mt-2 text-slate-300 leading-relaxed">${esc(SITE.teamIntro || '')}</p>
  <ul class="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 [&>li:last-child:nth-child(odd)]:col-span-2 sm:[&>li:last-child:nth-child(odd)]:col-span-1">${TEAM.map((m) => { const ph = teamPhoto(m); return `<li class="group bg-white/[0.04] border border-white/10 hover:border-gold-500/60 rounded-2xl px-3 py-6 text-center transition-colors">
    ${ph ? `<img src="${ph}" alt="Foto de ${esc(m.name)}" width="112" height="112" loading="lazy" decoding="async" class="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/15 group-hover:ring-gold-500 transition">` : `<span class="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 ring-2 ring-white/15 flex items-center justify-center text-2xl font-semibold text-gold-500" aria-hidden="true">${initials(m.name)}</span>`}
    <p class="mt-4 font-semibold leading-snug">${esc(m.name)}</p>
    <p class="mt-1 text-sm text-slate-300 leading-snug">${esc(m.role)}</p></li>`; }).join('')}</ul>
</section>`;
const teamSchema = () => TEAM.map((m) => ({ '@context': 'https://schema.org', '@type': 'Person', name: m.name, description: m.role, worksFor: { '@id': SITE.url + '/#organization' }, ...(teamPhoto(m) ? { image: SITE.url + teamPhoto(m) } : {}) }));

// ---------- HOME ----------
function home() {
  const sit = [
    ['Me chocaron en moto', 'accidentes-moto'], ['Accidente en carro', 'accidentes-carro'], ['Fui atropellado', 'accidentes-peatones'],
    ['Iba de parrillero', 'lesiones-parrillero-moto'], ['Iba de pasajero', 'accidentes-pasajeros-transporte-publico'],
    ['Lesiones graves o secuelas', 'lesiones-graves'], ['La aseguradora no quiere pagar', 'aseguradoras-no-pagan'],
  ];
  const opts = ['Accidente de moto', 'Accidente de carro', 'Atropello (peatón)', 'Parrillero o pasajero', 'SOAT o aseguradora', 'Otro'].map((o) => `<option>${o}</option>`).join('');
  const body = `
<section class="relative bg-navy-900 text-white overflow-hidden">
  <div class="absolute inset-0 hero-grid opacity-40" aria-hidden="true"></div>
  <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true"></div>
  <div class="relative max-w-7xl mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
    <div>
      <span class="inline-flex items-center gap-2 border border-gold-500/40 bg-gold-500/10 text-gold-500 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-gold-500"></span>Medellín y Valle de Aburrá</span>
      <h1 class="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">Abogado de accidentes de tránsito en <span class="text-gold-500">Medellín</span></h1>
      <p class="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">Si tú o un familiar resultaron lesionados, te explicamos con claridad qué puedes reclamar, ante quién y con qué soportes. Sin presiones y sin promesas irreales.</p>
      <div class="mt-9 flex flex-wrap gap-3">${btnWA('Hablar por WhatsApp', '', 'hero')}<a href="#situaciones" class="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-lg transition-colors">Identificar mi situación ${ic('down')}</a></div>
      <ul class="mt-12 pt-8 border-t border-white/10 grid sm:grid-cols-3 gap-6 text-sm">
        <li class="flex gap-3">${ic('check', 'w-5 h-5 text-gold-500 shrink-0')}<span><strong class="block text-white">Lenguaje claro</strong>Sin tecnicismos innecesarios.</span></li>
        <li class="flex gap-3">${ic('check', 'w-5 h-5 text-gold-500 shrink-0')}<span><strong class="block text-white">Sin presiones</strong>Decides con información.</span></li>
        <li class="flex gap-3">${ic('check', 'w-5 h-5 text-gold-500 shrink-0')}<span><strong class="block text-white">Honorarios por escrito</strong>Condiciones claras desde el inicio.</span></li>
      </ul>
    </div>
    <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-t-4 border-gold-500 text-slate-600" id="formulario">
      <h2 class="text-2xl font-semibold text-navy-900 tracking-tight">Cuéntanos tu caso</h2>
      <p class="text-sm text-slate-500 mt-1">Te respondemos con una primera orientación.</p>
      <form id="leadForm" class="mt-6 space-y-4" novalidate>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label for="f-nombre" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">Nombre</label><input id="f-nombre" name="nombre" required autocomplete="name" placeholder="Tu nombre" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></div>
          <div><label for="f-tel" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">Teléfono</label><input id="f-tel" name="telefono" required type="tel" autocomplete="tel" placeholder="300 000 0000" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></div>
        </div>
        <div><label for="f-tipo" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">¿Qué ocurrió?</label><select id="f-tipo" name="tipo" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500">${opts}</select></div>
        <div><label for="f-desc" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">Breve descripción</label><textarea id="f-desc" name="descripcion" rows="3" placeholder="¿Cuándo y cómo ocurrió el accidente?" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></textarea></div>
        <label class="flex gap-3 items-start text-xs text-slate-500"><input type="checkbox" name="consent" required class="mt-0.5 w-4 h-4 accent-yellow-600"><span>Autorizo el tratamiento de mis datos personales para ser contactado, según la <a class="underline" href="/tratamiento-de-datos/">autorización de tratamiento de datos</a> y la <a class="underline" href="/politica-de-privacidad/">política de privacidad</a>.</span></label>
        <button type="submit" class="w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-4 rounded-lg transition-colors">Enviar consulta ${ic('arrow')}</button>
        <p id="formMsg" class="text-sm hidden" role="status"></p>
      </form>
    </div>
  </div>
</section>

<section class="bg-white border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
    ${[['users', 'Atención humana', 'Te escucha una persona que entiende tu situación.'], ['check', 'Consulta sin costo', 'La primera revisión de tu caso no tiene costo.'], ['shield', 'Defensa experta', 'Acompañamiento jurídico en accidentes de tránsito.'], ['clock', 'Disponibilidad 24/7', 'Llámanos o escríbenos a cualquier hora.']].map(([i, t, d]) => `<div class="flex gap-3"><span class="text-gold-700 shrink-0">${ic(i, 'w-6 h-6')}</span><div><p class="font-semibold text-navy-900">${t}</p><p class="text-slate-500">${d}</p></div></div>`).join('')}
  </div>
</section>

<section class="py-10 bg-white border-b border-slate-200" id="quienes-somos"><div class="max-w-4xl mx-auto px-6"><h2 class="text-xl font-semibold text-navy-900">¿Quiénes somos?</h2><p class="mt-3 leading-relaxed"><strong class="text-navy-900">${esc(SITE.name)}</strong> es una firma de abogados especializada en accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño. Está ubicada en ${esc(SITE.address)}, atiende por teléfono en el ${esc(SITE.phone)}, ofrece una consulta inicial sin costo y tiene disponibilidad 24/7. <a class="underline text-navy-900 font-medium" href="/nosotros/">Conoce cómo trabajamos</a>.</p></div></section>
<section id="situaciones" class="py-20 bg-slate-50">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em] text-center">Tu situación</p>
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight text-center mt-2">¿Qué te ocurrió?</h2>
    <p class="text-center mt-3 max-w-2xl mx-auto">Elige la opción que más se parezca a tu caso y te llevamos a la información que necesitas.</p>
    <div class="mt-10 flex flex-wrap justify-center gap-3">
      ${sit.map(([l, s]) => `<a href="${svcUrl(s)}" class="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-full px-5 py-3 text-navy-900 font-medium transition-all">${esc(l)}${ic('arrow', 'w-4 h-4 text-gold-700')}</a>`).join('')}
    </div>
  </div>
</section>

<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Áreas de práctica</p>
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">¿En qué podemos ayudarte?</h2>
    <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      ${HUBS.map((h) => `<a href="/servicios/#${h.id}" class="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all">
        <span class="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-navy-900 group-hover:bg-gold-500 transition-colors">${ic(h.icon, 'w-6 h-6')}</span>
        <h3 class="mt-5 text-xl font-semibold text-navy-900">${esc(h.title)}</h3><p class="mt-2 text-sm leading-relaxed">${esc(h.desc)}</p>
        <span class="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900">Ver servicios ${ic('arrow', 'w-4 h-4')}</span></a>`).join('')}
    </div>
  </div>
</section>

<section class="py-16 bg-white border-b border-slate-200" id="que-recibes">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Tu primera consulta</p>
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">¿Qué recibes?</h2>
    <div class="mt-8">${recibeHtml()}</div>
  </div>
</section>

<section class="py-20 bg-navy-900 text-white">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-gold-500 text-xs font-semibold uppercase tracking-[0.2em]">Cómo trabajamos</p>
    <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mt-2">Un proceso claro, paso a paso</h2>
    <ol class="mt-10 grid md:grid-cols-5 gap-6">
      ${PASOS_CASO.map(([t, d], i) => `<li class="border-t-2 border-gold-500 pt-4"><span class="text-gold-500 font-semibold">0${i + 1}</span><h3 class="mt-1 text-lg font-semibold">${esc(t)}</h3><p class="mt-2 text-sm text-slate-400 leading-relaxed">${esc(d)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="py-16 bg-slate-50" id="casos">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Casos y testimonios</p>
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Experiencias de clientes</h2>
    <div class="mt-6">${SITE.testimonials.length ? `<div class="grid md:grid-cols-2 gap-5">${SITE.testimonials.map((t) => `<figure class="bg-white border border-slate-200 rounded-2xl p-6"><blockquote class="leading-relaxed">${esc(t.text)}</blockquote><figcaption class="mt-3 text-sm font-semibold text-navy-900">${esc(t.name)}</figcaption></figure>`).join('')}</div>` : pending('testimonios y casos reales, documentados y con autorización escrita. No se publican reseñas ni resultados inventados.')}</div>
  </div>
</section>

<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
    <div>
      <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Honorarios</p>
      <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Costos explicados desde el inicio</h2>
      <p class="mt-4 leading-relaxed">Antes de iniciar, las condiciones de los honorarios deben constar por escrito: qué se cobra, cuándo y quién asume los gastos del proceso. Te explicamos cómo funciona la cuota litis y qué preguntar a cualquier abogado.</p>
      <a href="/honorarios-cuota-litis/" class="mt-6 inline-flex items-center gap-2 font-semibold text-navy-900 hover:text-gold-700">Leer sobre honorarios ${ic('arrow')}</a>
    </div>
    <div>
      <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Equipo y confianza</p>
      <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Quién te atiende</h2>
      <div class="mt-4">${trustBlock('Equipo')}<p class="mt-3 text-sm"><a class="underline text-navy-900 font-medium" href="/nosotros/">Conocer a la firma</a></p></div>
    </div>
  </div>
</section>

<section class="py-20 bg-slate-50" id="esencial">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Lo esencial</p>
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Qué debes saber después de un accidente de tránsito</h2>
    <div class="mt-8 grid lg:grid-cols-[1fr_1.2fr] gap-10">
      <div>${answerBox('Tras un accidente de tránsito, el SOAT atiende tu atención médica inicial sin importar quién tuvo la culpa, pero no es una indemnización integral. Los perjuicios adicionales (ingresos perdidos, secuelas, daño moral) se reclaman al responsable y a su aseguradora, con pruebas y dentro de plazos legales.')}
        <p class="mt-4 text-sm">Definiciones clave: <a class="underline text-navy-900" href="/glosario/#soat">SOAT</a>, <a class="underline text-navy-900" href="/glosario/#ipat">IPAT</a>, <a class="underline text-navy-900" href="/glosario/#lucro-cesante">lucro cesante</a>, <a class="underline text-navy-900" href="/glosario/#cuota-litis">cuota litis</a>. <a class="underline text-navy-900 font-medium" href="/glosario/">Ver glosario</a>.</p></div>
      <div>${tableHtml(TABLA_VIAS)}</div>
    </div>
  </div>
</section>

<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex items-end justify-between gap-4 flex-wrap"><div><p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Guías</p><h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Lo que debes saber</h2></div><a href="/blog/" class="font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-2">Ver todas ${ic('arrow')}</a></div>
    <div class="mt-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"><p class="max-w-2xl">Reunimos <strong class="text-navy-900">${ARTICLES.length} guías</strong> sobre qué hacer tras un accidente, SOAT, aseguradoras, honorarios, plazos y más, organizadas por tema para que las encuentres fácil.</p><a href="/blog/" class="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-lg">Ir a las guías ${ic('arrow')}</a></div>
  </div>
</section>

<section class="py-20 bg-slate-50">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight text-center">Preguntas frecuentes</h2>
    <div class="mt-8">${faqHtml(HOME_FAQ)}</div>
    <p class="mt-6 text-center"><a href="/preguntas-frecuentes/" class="font-semibold text-navy-900 hover:text-gold-700">Ver todas las preguntas</a></p>
  </div>
</section>

<section class="py-20 bg-white" id="cobertura">
  <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
    <div><p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Cobertura</p><h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Medellín, el Valle de Aburrá y el Oriente</h2>
      <p class="mt-4 leading-relaxed">Orientamos a víctimas de accidentes en Medellín, en los municipios del área metropolitana y en el Oriente antioqueño. El SOAT es nacional; lo que cambia es la autoridad de tránsito y la administración de la vía.</p>
      ${Object.entries(REGIONES).map(([k, R]) => `<p class="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">${R.label}</p><div class="mt-2 flex flex-wrap gap-2">${MUNICIPIOS.filter((m) => regionOf(m) === k).map((m) => `<a href="${muniUrl(m)}" class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 hover:border-gold-500 rounded-full px-4 py-2 text-sm text-navy-900">${esc(m.name)}</a>`).join('')}</div>`).join('')}
      <p class="mt-5"><a href="/area-metropolitana/" class="font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-2">Ver toda la cobertura ${ic('arrow')}</a></p></div>
    <div class="bg-navy-900 text-white rounded-2xl p-8"><span class="text-gold-500">${ic('calc', 'w-8 h-8')}</span><h2 class="mt-4 text-2xl font-semibold tracking-tight">Calculadora orientativa</h2><p class="mt-3 text-slate-300 leading-relaxed">Mira cómo influyen tus ingresos, la incapacidad y las secuelas en los perjuicios patrimoniales. Es una herramienta de orientación, no una oferta ni una predicción.</p><a href="/calculadora-indemnizacion/" class="mt-6 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3 rounded-lg">Usar la calculadora ${ic('arrow')}</a></div>
  </div>
</section>

<section class="py-20 bg-slate-50" id="contacto-home">
  <div class="max-w-5xl mx-auto px-6 text-center">
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">Contacto</h2>
    <div class="mt-8 grid sm:grid-cols-3 gap-6 text-left">
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('chat', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">WhatsApp</p><p class="text-sm mt-1">${hasWA ? esc(SITE.whatsapp) : 'Número por confirmar'}</p></div>
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('phone', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Teléfono</p><p class="text-sm mt-1">${hasPhone ? esc(SITE.phone) : 'Número por confirmar'}</p></div>
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('pin', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Ubicación</p><p class="text-sm mt-1">${SITE.address ? esc(SITE.address) : 'Medellín, Antioquia (dirección por confirmar)'}</p></div>
    </div>
    <p class="mt-6"><a href="/contacto/" class="font-semibold text-navy-900 hover:text-gold-700">Ir a la página de contacto</a></p>
  </div>
</section>`;
  render({
    url: '/', title: 'Abogado de accidentes de tránsito en Medellín | Derechos con Dignidad',
    desc: 'Abogados de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño. Orientación sobre SOAT, aseguradoras y reclamación de perjuicios.',
    body, schema: [{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE.url + '/#website', name: SITE.name, url: SITE.url, inLanguage: 'es-CO' }, faqSchema(HOME_FAQ)],
  });
}

// ---------- SERVICIOS ----------
function servicesHub() {
  const body = pageHero({ crumbs: [['Inicio', '/'], ['Servicios', '/servicios/']], h1: 'Servicios para víctimas de accidentes de tránsito', sub: 'Encuentra la página que describe tu situación: accidentes, SOAT y aseguradoras, responsabilidad civil y responsabilidad del Estado.', ctas: false }) +
    `<section class="pt-14"><div class="max-w-7xl mx-auto px-6">${answerBox('Si sufriste un accidente de tránsito, empieza por la página que mejor describa tu situación. Cada una explica qué perjuicios pueden analizarse, qué cubre el SOAT, qué documentos reunir y qué errores evitar. Todas son informativas y no reemplazan una revisión individual de tu caso.')}<div class="mt-8">${tableHtml({ cap: 'Cómo elegir la página adecuada', head: ['Si tu situación es…', 'Empieza por'], rows: [['Sufriste un accidente en moto o carro', 'Accidentes en motocicleta / Accidentes en carro'], ['Eras peatón, parrillero o pasajero', 'Víctimas y transporte'], ['El SOAT se agotó o la aseguradora no paga', 'SOAT y aseguradoras'], ['El responsable huyó o no tenía seguro', 'Vehículo fantasma / Vehículo sin SOAT'], ['La causa fue el estado de la vía', 'Huecos y vías en mal estado']] })}</div></div></section>` +
    `<section class="py-16"><div class="max-w-7xl mx-auto px-6 space-y-16">${HUBS.map((h) => `
      <div id="${h.id}" class="scroll-mt-28"><div class="flex items-center gap-3"><span class="w-11 h-11 bg-navy-900 text-gold-500 rounded-lg flex items-center justify-center">${ic(h.icon, 'w-6 h-6')}</span><div><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight">${esc(h.title)}</h2><p class="text-sm">${esc(h.desc)}</p></div></div>
      <div class="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">${h.items.map((s) => `<a href="${svcUrl(s)}" class="group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all"><h3 class="font-semibold text-navy-900 text-lg">${esc(SERVICES[s].short)}</h3><p class="mt-2 text-sm leading-relaxed">${esc(SERVICES[s].sub)}</p><span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900">Ver más ${ic('arrow', 'w-4 h-4')}</span></a>`).join('')}</div></div>`).join('')}</div></section>` + ctaFinal();
  render({ url: '/servicios/', title: 'Servicios de abogado de accidentes de tránsito en Medellín | Derechos con Dignidad', desc: 'Accidentes de moto y carro, lesiones graves, SOAT, aseguradoras, responsabilidad civil y accidentes por vías en mal estado en Medellín.', body, crumbs: [['Inicio', '/'], ['Servicios', '/servicios/']], faq: { pools: ['primeros', 'seguros', 'lesiones', 'transporte', 'estado'], min: 8 } });
}

// ---------- Helpers de estructura semántica ----------
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const longDate = (iso) => { const [y, m, d] = iso.split('-'); return `${+d} de ${MESES[+m - 1]} de ${y}`; };
const datesLine = () => `<p class="text-xs text-slate-500"><!--READING-->Publicado: <time datetime="${SITE.published}">${longDate(SITE.published)}</time> · Actualizado: <time datetime="${SITE.lastReview}">${longDate(SITE.lastReview)}</time> · ${SITE.lawyers.length ? `Revisión jurídica: ${esc(SITE.lawyers[0].name)}` : 'Revisión jurídica: pendiente'}</p>`;

const tableHtml = (t) => `<div class="rtable max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white"><table class="w-full text-sm text-left"><caption class="px-4 py-3 text-left text-xs text-slate-500 caption-bottom">${esc(t.cap)}</caption><thead class="bg-slate-100 text-navy-900"><tr>${t.head.map((x) => `<th scope="col" class="px-4 py-3 font-semibold">${esc(x)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr class="border-t border-slate-200">${r.map((c, i) => i === 0 ? `<th scope="row" data-label="${esc(t.head[0] || '')}" class="px-4 py-3 font-medium text-navy-900 align-top">${esc(c)}</th>` : `<td data-label="${esc(t.head[i] || '')}" class="px-4 py-3 align-top">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const renderBlocks = (blocks) => blocks.map((b) => {
  if (typeof b === 'string') return para(b);
  if (b.ul) return `<ul class="space-y-2 mb-5">${b.ul.map((x) => `<li class="flex gap-3">${ic('check', 'w-5 h-5 text-gold-700 shrink-0 mt-0.5')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
  if (b.ol) return `<ol class="space-y-2 mb-5 list-decimal pl-6 marker:text-gold-700 marker:font-semibold">${b.ol.map((x) => `<li class="pl-1">${esc(x)}</li>`).join('')}</ol>`;
  if (b.table) return `<div class="mb-6">${tableHtml(b.table)}</div>`;
  if (b.h3) return `<h3 class="text-lg font-semibold text-navy-900 mt-6 mb-2">${esc(b.h3)}</h3>`;
  return '';
}).join('');

const glossHtml = (keys) => `<dl class="grid gap-4 sm:grid-cols-2">${keys.map((k) => `<div class="bg-white border border-slate-200 rounded-xl p-5"><dt class="font-semibold text-navy-900"><a class="hover:text-gold-700" href="/glosario/#${k}">${esc(GLOSARIO[k][0])}</a></dt><dd class="mt-1 text-sm leading-relaxed">${esc(GLOSARIO[k][1])}</dd></div>`).join('')}</dl>`;

const sourcesHtml = (keys) => `<ul class="space-y-3">${keys.map((k) => `<li class="text-sm"><a class="text-navy-900 font-medium underline" href="${FUENTES[k][1]}" target="_blank" rel="noopener">${esc(FUENTES[k][0])}</a><span class="block text-slate-500">${esc(FUENTES[k][2])}</span></li>`).join('')}</ul><p class="mt-3 text-xs text-slate-500">Fuentes oficiales de referencia. Las normas, topes y trámites cambian: verifica su vigencia antes de actuar.</p>`;

const answerBox = (text) => `<div class="bg-gold-500/10 border-l-4 border-gold-500 rounded-r-xl p-5" data-respuesta><p class="text-xs font-semibold uppercase tracking-wider text-gold-700">Respuesta rápida</p><p class="mt-2 text-navy-900 leading-relaxed">${esc(text)}</p></div>`;

const faqSchema = (faqs) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

const bullets = (arr, icon = 'check') => `<ul class="space-y-3">${arr.map((d) => `<li class="flex gap-3">${ic(icon, 'w-5 h-5 text-gold-700 shrink-0 mt-0.5')}<span>${esc(d)}</span></li>`).join('')}</ul>`;

function servicePage(slug) {
  const s = SERVICES[slug];
  const x = EXTRA[slug];
  const h = hub(s.hub);
  const crumbs = [['Inicio', '/'], ['Servicios', '/servicios/'], [s.short, svcUrl(slug)]];
  const arts = ARTICLES.filter((a) => a.link === slug || (a.related || []).includes(slug)).slice(0, 4);
  TIPSET.clear();
  const allFaqs = faqsFor([...s.faqs, ...x.faqs], POOLS_BY_HUB[s.hub] || ['primeros'], slug);
  const sec = (id, title, inner) => `<section id="${id}" class="scroll-mt-28" aria-labelledby="h-${id}"><h2 id="h-${id}" class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">${esc(title)}</h2>${inner}</section>`;
  const toc = [['respuesta', 'Respuesta rápida'], ['entender', 'Entender el problema'], ['perjuicios', 'Perjuicios'], ['seguros', 'SOAT y seguros'], ['escenarios', 'Según tu escenario'], ['proceso', 'Cómo gestionamos el caso'], ['errores', 'Errores comunes'], ['urgente', 'Cuándo consultar ya'], ['glosario', 'Definiciones clave'], ['honorarios', 'Honorarios'], ['faq', 'Preguntas frecuentes'], ['fuentes', 'Fuentes']];
  const body = pageHero({ crumbs, h1: s.title, sub: s.sub }) + `
<div class="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_320px] gap-12">
  <article class="space-y-14 min-w-0">
    <div id="respuesta" class="scroll-mt-28">${answerBox(x.respuesta)}<div class="mt-3">${datesLine()}</div></div>
    ${sec('entender', 'Entender el problema', s.entender.map(para).join(''))}
    ${sec('perjuicios', 'Daños y perjuicios que pueden analizarse', bullets(s.danos) + `<p class="mt-4 text-sm text-slate-500">Lo que pueda reclamarse depende de las pruebas y las circunstancias de cada caso. No se garantiza ningún resultado ni monto.</p>`)}
    ${sec('seguros', 'SOAT, seguros y responsabilidad civil', s.seguros.map(para).join('') + `<h3 class="text-lg font-semibold text-navy-900 mt-6 mb-3">Comparación de vías de reclamación</h3>${tableHtml(TABLA_VIAS)}`)}
    ${sec('escenarios', 'Qué se revisa según tu escenario', tableHtml({ cap: `Escenarios frecuentes en: ${s.short}`, head: ['Escenario', 'Qué suele revisarse'], rows: x.escenarios }))}
    ${sec('proceso', 'Cómo se estudia y gestiona el caso', `<ol class="space-y-4">${PASOS_CASO.map(([t, d], i) => `<li class="flex gap-4"><span class="shrink-0 w-8 h-8 rounded-full bg-navy-900 text-gold-500 flex items-center justify-center text-sm font-semibold">${i + 1}</span><div><p class="font-semibold text-navy-900">${esc(t)}</p><p class="text-sm">${esc(d)}</p></div></li>`).join('')}</ol>
      <h3 class="mt-8 mb-3 text-lg font-semibold text-navy-900">Documentos útiles</h3>${checklistHtml(slug, s.docs)}`)}
    ${sec('errores', 'Errores comunes que conviene evitar', bullets([...x.errores, ...ERRORES_GENERALES.slice(0, 2)], 'shield'))}
    ${sec('urgente', 'Cuándo consultar con urgencia', bullets(x.urgente, 'clock'))}
    ${sec('glosario', 'Definiciones clave', glossHtml(x.glos))}
    ${sec('honorarios', 'Honorarios y cuota litis', `<p class="leading-relaxed">Las condiciones de los honorarios, incluidos el valor o porcentaje, el momento de cobro y los gastos del proceso, deben constar por escrito antes de iniciar. <a class="text-navy-900 underline font-medium" href="/honorarios-cuota-litis/">Conoce cómo funciona la cuota litis</a>.</p>`)}
    ${sec('confianza', 'Quién revisa tu caso', trustBlock('Perfil del abogado responsable'))}
    ${sec('faq', 'Preguntas frecuentes', faqHtml(allFaqs))}
    ${sec('fuentes', 'Fuentes y normas de referencia', sourcesHtml(x.fuentes))}
  </article>
  <aside class="space-y-6 lg:sticky lg:top-28 self-start">
    <div class="bg-navy-900 text-white rounded-2xl p-6"><p class="font-semibold text-lg">¿Quieres que revisemos tu caso?</p><p class="text-sm text-slate-400 mt-2">Primera orientación por WhatsApp o llamada.</p><div class="mt-5 space-y-3">${btnWA('WhatsApp', 'w-full', 'aside')}${btnCall(undefined, 'w-full', 'aside')}</div></div>
    <div class="bg-white border border-slate-200 rounded-2xl p-6"><p class="font-semibold text-navy-900">Servicios relacionados</p><ul class="mt-3 space-y-2 text-sm">${s.related.map((r) => `<li><a class="hover:text-gold-700 flex gap-2 items-start" href="${svcUrl(r)}">${ic('arrow', 'w-4 h-4 mt-0.5 shrink-0 text-gold-700')}${esc(SERVICES[r].short)}</a></li>`).join('')}<li><a class="hover:text-gold-700 font-medium" href="/servicios/#${h.id}">Más de ${esc(h.title)}</a></li></ul></div>
    ${arts.length ? `<div class="bg-white border border-slate-200 rounded-2xl p-6"><p class="font-semibold text-navy-900">Guías relacionadas</p><ul class="mt-3 space-y-2 text-sm">${arts.slice(0, 3).map((a) => `<li><a class="hover:text-gold-700 flex gap-2 items-start" href="/blog/${a.slug}/">${ic('file', 'w-4 h-4 mt-0.5 shrink-0 text-gold-700')}${esc(SEO_TITLES[a.slug] || a.seo || a.title)}</a></li>`).join('')}<li><a class="hover:text-gold-700 font-medium" href="/blog/">Ver todas las guías</a></li></ul></div>` : ''}
    <nav data-toc aria-label="En esta página" class="bg-white border border-slate-200 rounded-2xl p-6 text-sm"><p class="font-semibold text-navy-900">En esta página</p><ul class="mt-3 space-y-2">${toc.map(([i, t]) => `<li><a class="hover:text-gold-700" href="#${i}">${t}</a></li>`).join('')}</ul></nav>
  </aside>
</div>
<div class="max-w-7xl mx-auto px-6 pb-14"><p class="text-xs text-slate-500">Contenido informativo y orientativo; no constituye asesoría jurídica ni garantiza resultados.</p></div>` + ctaFinal();
  render({
    url: svcUrl(slug), title: s.metaTitle, desc: s.metaDesc, body, crumbs,
    schema: [
      { '@context': 'https://schema.org', '@type': 'WebPage', name: s.title, url: SITE.url + svcUrl(slug), inLanguage: 'es-CO', datePublished: SITE.published, dateModified: SITE.lastReview, isPartOf: { '@id': SITE.url + '/#website' }, about: s.short },
      { '@context': 'https://schema.org', '@type': 'Service', name: s.short, serviceType: 'Asesoría jurídica en accidentes de tránsito', provider: { '@id': SITE.url + '/#organization' }, areaServed: [{ '@type': 'City', name: 'Medellín' }, ...MUNICIPIOS.map((m) => ({ '@type': 'City', name: m.name }))], description: s.metaDesc },
      faqSchema(allFaqs),
    ],
  });
}

// ---------- OTRAS PÁGINAS ----------
function simple({ url, title, desc, h1, sub, kicker, inner, crumbs, cta = true, noindex = false, schema = [], faq = null }) {
  const body = pageHero({ crumbs, h1, sub, ctas: false, kicker }) + `<div class="max-w-4xl mx-auto px-6 py-14 space-y-10">${inner}</div>` + (cta ? ctaFinal() : '');
  render({ url, title, desc, body, crumbs, noindex, schema, faq });
}
const prose = (arr) => arr.map((p) => `<p class="leading-relaxed">${esc(p)}</p>`).join('');

function otherPages() {
  simple({ url: '/honorarios-cuota-litis/', title: 'Honorarios y cuota litis en accidentes de tránsito | Derechos con Dignidad', desc: 'Cómo funcionan los honorarios y la cuota litis en un caso de accidente de tránsito, y qué preguntar antes de contratar un abogado.',
    faq: { pools: ['honorarios', 'proceso', 'primeros'], min: 8 }, h1: 'Honorarios y cuota litis', sub: 'Qué debe decir el contrato, qué modelos existen y qué preguntar antes de contratar.', crumbs: [['Inicio', '/'], ['Honorarios y cuota litis', '/honorarios-cuota-litis/']],
    inner: `<section>${h2('Modelos de honorarios')}${prose(['Los honorarios dependen de lo que se pacte por escrito. Pueden ser un valor fijo, un porcentaje del resultado (cuota litis) o una combinación.', 'No existe un porcentaje universal. Desconfía de quien lo presente como una tarifa única para todos los casos.'])}</section>
    <section>${h2('Qué debe incluir el contrato')}<ul class="space-y-3">${['Valor o porcentaje y sobre qué base se calcula', 'Momento y forma de pago', 'Quién asume los gastos del proceso (peritajes, copias, notificaciones)', 'Qué ocurre si no se obtiene resultado', 'Qué pasa si el caso termina antes de lo previsto'].map((x) => `<li class="flex gap-3">${ic('check', 'w-5 h-5 text-gold-700 shrink-0 mt-0.5')}${x}</li>`).join('')}</ul></section>
    <section>${h2('Qué incluye la consulta inicial sin costo')}${prose(['La consulta inicial no tiene costo. En ella revisamos tu caso y te explicamos tus opciones antes de cualquier decisión sobre honorarios.'])}<div class="mt-5">${recibeHtml()}</div></section>
    <section>${h2('Cómo comparar propuestas de honorarios')}${tableHtml({ cap: 'Aspectos para comparar dos propuestas', head: ['Aspecto', 'Qué preguntar', 'Por qué importa'], rows: [['Base de cálculo', '¿Se calcula sobre el valor recuperado, sobre el total o sobre otra base?', 'Cambia el valor final que recibes'], ['Momento de pago', '¿Se paga al inicio, por etapas o al final?', 'Afecta tu liquidez durante el proceso'], ['Gastos del proceso', '¿Quién los adelanta y cómo se rinden cuentas?', 'Evita sorpresas durante el caso'], ['Alcance del servicio', '¿Incluye reclamación, conciliación y proceso judicial?', 'Define qué cubre el contrato'], ['Terminación anticipada', '¿Qué ocurre si cambias de abogado o terminas antes?', 'Previene conflictos futuros']] })}</section>
    <section>${h2('Gastos del proceso: de qué hablamos')}${prose(['Los gastos no son honorarios: son costos necesarios para tramitar el caso. Pregunta cuáles se prevén y cómo se manejarán.'])}${bullets(['Copias y certificados de historias clínicas e informes.', 'Notificaciones y trámites ante autoridades.', 'Dictámenes y peritajes cuando sean necesarios.', 'Desplazamientos a audiencias o valoraciones.', 'Costos de pruebas específicas, según el caso.'])}</section>
    <section>${h2('Señales de alerta antes de firmar')}${bullets(['Promesas de resultados o de montos garantizados.', 'Presión para firmar el mismo día.', 'Ausencia de contrato escrito o cláusulas que no te explican.', 'Cobros por adelantado sin explicar a qué corresponden.', 'No identificar al abogado responsable ni su tarjeta profesional.'], 'shield')}<p class="mt-4 text-sm text-slate-500">Los abogados en Colombia están sujetos al Código Disciplinario del Abogado (Ley 1123 de 2007). Verifica su vigencia en fuentes oficiales.</p></section>
    <section>${h2('Modelo de la firma')}${pending('modelo real de honorarios, porcentaje, condiciones y política de primera consulta, según el contrato del despacho.')}</section>` });

  simple({ url: '/nosotros/', schema: teamSchema(), title: 'Nosotros | Derechos con Dignidad', desc: 'Conoce el enfoque de Derechos con Dignidad, cómo trabajamos y cómo atendemos a víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente.',
    faq: { pools: ['honorarios', 'contacto', 'primeros'], min: 6 }, h1: 'Nosotros', sub: 'Una firma enfocada en orientar a víctimas de accidentes de tránsito con claridad y respeto.', crumbs: [['Inicio', '/'], ['Nosotros', '/nosotros/']],
    inner: `<section>${h2('Nuestro enfoque')}${prose(['Creemos que una persona lesionada debe entender su situación jurídica sin tecnicismos, conocer sus opciones y decidir sin presiones.', 'Nos concentramos en accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño: SOAT, aseguradoras, responsabilidad civil y perjuicios derivados de lesiones.'])}</section>
    <section>${h2('Qué hacemos y qué no hacemos')}<div class="grid md:grid-cols-2 gap-6"><div><h3 class="font-semibold text-navy-900 mb-3">Lo que sí hacemos</h3>${bullets(['Orientar a víctimas de accidentes de tránsito y a sus familias.', 'Explicar el SOAT, las aseguradoras y la responsabilidad civil en lenguaje claro.', 'Revisar documentos y definir una ruta jurídica.', 'Acompañar la reclamación o el proceso, según el caso.'])}</div><div><h3 class="font-semibold text-navy-900 mb-3">Lo que no hacemos</h3>${bullets(['Prometer resultados o montos de indemnización.', 'Presionar para firmar contratos o acuerdos.', 'Publicar testimonios o casos sin autorización.', 'Dar diagnósticos médicos.'], 'shield')}</div></div></section>
    <section>${h2('Cómo trabajamos')}${prose(['Trabajamos con cuatro principios: claridad, para que entiendas tu situación sin tecnicismos; prudencia, para no prometer lo que no podemos garantizar; transparencia, con honorarios y condiciones por escrito; y respeto por el momento difícil que atraviesa quien ha sufrido un accidente.', 'Toda la información de este sitio es orientativa y se apoya en fuentes oficiales; antes de actuar en tu caso concreto se requiere una revisión individual.'])}</section>
    <section>${h2('Cómo atendemos')}${bullets([`Atención telefónica al ${SITE.phone}.`, `Oficina en ${SITE.address}.`, 'Disponibilidad 24/7: si no te contestamos de inmediato, deja tu mensaje y te respondemos.', 'Consulta inicial sin costo.', 'Orientación a víctimas en Medellín, en los municipios del Valle de Aburrá y en el Oriente antioqueño (Rionegro, La Ceja, El Retiro y El Carmen de Viboral).'])}<p class="mt-4">Consulta <a class="underline text-navy-900 font-medium" href="/area-metropolitana/">nuestra cobertura en el área metropolitana</a> o escríbenos desde la <a class="underline text-navy-900 font-medium" href="/contacto/">página de contacto</a>.</p></section>
    <section>${h2('Qué esperar de tu primera consulta')}<div class="mt-2">${recibeHtml()}</div></section>
    <section>${h2('Nuestro compromiso con la información')}${prose(['Los contenidos de este sitio son informativos: explican conceptos, coberturas y rutas de reclamación para que puedas tomar decisiones con mejor criterio. No sustituyen una asesoría individual, que requiere revisar tus documentos y los hechos de tu caso.', 'Citamos fuentes oficiales (ADRES, Superintendencia Financiera, Medicina Legal, RUNT y normas publicadas) y te recomendamos verificar siempre la vigencia de topes, trámites y plazos antes de actuar. Cada página muestra su fecha de publicación y de última actualización.'])}${bullets(['No publicamos cifras de indemnización como si fueran garantías.', 'Indicamos cuándo un dato depende de la revisión de un abogado.', 'Corregimos y actualizamos el contenido cuando cambian las normas o los trámites.'])}</section>
    ${TEAM.length ? teamHtml() + pending('tarjeta profesional, formación y una breve biografía de cada integrante del equipo, y fotos originales en mejor resolución.') : `<section>${h2('Equipo')}${trustBlock('Equipo')}</section>`}
    <section>${h2('Ubicación y datos oficiales')}${SITE.address ? `<p>${esc(SITE.address)}</p>` : pending('dirección oficial, coherente con Google Business Profile, y horarios.')}</section>` });

  simple({ url: '/contacto/', title: 'Contacto | Abogado de accidentes de tránsito en Medellín | Derechos con Dignidad', desc: 'Llama al (604) 557 5073 o envíanos tu caso: consulta inicial sin costo, disponibilidad 24/7 y orientación sobre tu accidente de tránsito en Medellín.',
    faq: { pools: ['contacto', 'primeros', 'honorarios'], min: 8 }, h1: 'Contacto', sub: 'Cuéntanos qué pasó. Te respondemos con una primera orientación.', crumbs: [['Inicio', '/'], ['Contacto', '/contacto/']], cta: false,
    inner: `<div class="grid md:grid-cols-3 gap-5">
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('chat', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">WhatsApp</p>${hasWA ? `<p class="mt-3">${btnWA('Escribir', '!bg-gold-500 !py-2.5', 'contacto')}</p>` : `<p class="mt-2 text-sm">${pending('número de WhatsApp.')}</p>`}</div>
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('phone', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Teléfono</p>${hasPhone ? `<p class="mt-2"><a class="underline" data-track="call" data-loc="contacto" href="${telLink}">${esc(SITE.phone)}</a></p>` : `<p class="mt-2 text-sm">${pending('teléfono.')}</p>`}</div>
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('pin', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Ubicación</p><p class="mt-2 text-sm">${SITE.address ? esc(SITE.address) : 'Medellín, Antioquia'}</p>${SITE.hours ? `<p class="mt-1 text-sm">${esc(SITE.hours)}</p>` : ''}</div></div>
    ${SITE.mapEmbed ? `<iframe title="Mapa" src="${esc(SITE.mapEmbed)}" class="w-full h-80 rounded-2xl border-0" loading="lazy"></iframe>` : pending('mapa y horarios confirmados.')}
    <section><h2 class="text-2xl font-semibold text-navy-900 mb-4">¿Qué recibes en tu primera consulta?</h2>${recibeHtml()}</section>
    ${contactFormHtml()}` });

  simple({ url: '/preguntas-frecuentes/', title: 'Preguntas frecuentes sobre accidentes de tránsito | Derechos con Dignidad', desc: 'Más de 25 respuestas a las dudas más comunes tras un accidente de tránsito: SOAT, aseguradoras, plazos, honorarios y qué hacer primero.',
    h1: 'Preguntas frecuentes', crumbs: [['Inicio', '/'], ['Preguntas frecuentes', '/preguntas-frecuentes/']], inner: faqHtml(BIG_FAQ, true), schema: [faqSchema(BIG_FAQ)] });

  legales();
}


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
  const inner = `
  ${pending(note)}
  <p class="text-sm text-slate-500">Última actualización: <time datetime="${SITE.lastReview}">${longDate(SITE.lastReview)}</time> · Versión 1.0 · Pendiente de revisión jurídica</p>
  <nav aria-label="Contenido de la página" class="bg-white border border-slate-200 rounded-xl p-5"><p class="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-3">En esta página</p><ol class="grid sm:grid-cols-2 gap-x-6 gap-y-2 list-decimal pl-5 text-sm marker:text-gold-700">${ids.map(([id, t]) => `<li><a class="text-navy-900 hover:text-gold-700 underline-offset-2 hover:underline" href="#${id}">${esc(t)}</a></li>`).join('')}</ol></nav>
  ${sections.map(([t, bl], i) => `<section id="l${i + 1}" class="scroll-mt-28" aria-labelledby="h-l${i + 1}"><h2 id="h-l${i + 1}" class="text-xl md:text-2xl font-semibold text-navy-900 tracking-tight mb-4"><span class="text-gold-700 mr-2">${i + 1}.</span>${esc(t)}</h2>${renderBlocks(bl)}</section>`).join('')}
  ${faq ? `<section aria-labelledby="h-lfaq"><h2 id="h-lfaq" class="text-xl md:text-2xl font-semibold text-navy-900 tracking-tight mb-4">Preguntas frecuentes</h2>${faqHtml(faq)}</section>` : ''}
  <aside class="bg-navy-900 text-slate-300 rounded-2xl p-6"><p class="text-white font-semibold">Otros documentos legales</p><ul class="mt-3 grid sm:grid-cols-2 gap-2 text-sm">${LEGAL_LINKS.filter((l) => l[1] !== url).map(([t, u]) => `<li><a class="hover:text-gold-500 underline-offset-2 hover:underline" href="${u}">${esc(t)}</a></li>`).join('')}</ul><p class="mt-4 text-sm">¿Dudas sobre tus datos? <a class="text-gold-500 underline" href="/contacto/">Contáctanos</a>.</p></aside>`;
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

// ---------- BLOG ----------
const blocksToText = (blocks) => blocks.map((b) => typeof b === 'string' ? b : b.ul ? b.ul.map((i) => `- ${i}`).join('\n') : b.ol ? b.ol.map((i, n) => `${n + 1}. ${i}`).join('\n') : b.table ? [b.table.head.join(' | '), ...b.table.rows.map((r) => r.join(' | '))].join('\n') : '').join('\n\n');

const readMins = (a) => Math.max(2, Math.round(((a.resumen.join(' ') + ' ' + a.sections.map(([t, bl]) => t + ' ' + blocksToText(bl)).join(' ')).split(/\s+/).length + 380) / 200));
function blog() {
  const clusters = [...new Set(ARTICLES.map((a) => a.cluster))].sort((p, q) => (q === 'Pilar') - (p === 'Pilar'));
  const sorted = [...ARTICLES].sort((p, q) => (q.cluster === 'Pilar') - (p.cluster === 'Pilar'));
  const chip = (label, key, on) => `<button type="button" data-guide-filter="${esc(key)}" aria-pressed="${on}" class="px-4 py-2 rounded-full text-sm font-medium border ${on ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-900 border-slate-200 hover:border-gold-500'}">${esc(label)}</button>`;
  const body = pageHero({ crumbs: [['Inicio', '/'], ['Guías', '/blog/']], h1: 'Guías para víctimas de accidentes de tránsito', sub: 'Información clara sobre qué hacer, qué reclamar y qué evitar. Busca por palabra o filtra por tema.', ctas: false }) +
    `<section class="py-12" id="guias"><div class="max-w-7xl mx-auto px-6">
      <div class="grid gap-4">
        <label for="guide-search" class="sr-only">Buscar guías</label>
        <input id="guide-search" data-guide-search type="search" placeholder="Buscar una guía: SOAT, IPAT, aseguradora, honorarios…" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500">
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar guías por tema">${chip('Todas (' + ARTICLES.length + ')', 'all', true)}${clusters.map((c) => chip(c + ' (' + ARTICLES.filter((a) => a.cluster === c).length + ')', c, false)).join('')}</div>
      </div>
      <h2 class="mt-10 text-2xl font-semibold text-navy-900 tracking-tight">Todas las guías</h2>
      <p data-guide-count class="mt-1 text-sm text-slate-500" aria-live="polite">${ARTICLES.length} guías</p>
      <div data-guides class="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">${sorted.map((a) => `<a href="/blog/${a.slug}/" data-cluster="${esc(a.cluster)}" data-text="${esc((a.title + ' ' + a.desc + ' ' + a.kw).toLowerCase())}" class="group flex flex-col bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all"><div class="flex items-center justify-between gap-2 text-xs"><span class="uppercase tracking-wide text-gold-700 font-semibold">${esc(a.cluster)}</span><span class="inline-flex items-center gap-1 text-slate-500">${ic('clock', 'w-3.5 h-3.5')}${readMins(a)} min</span></div><h3 class="mt-3 text-lg font-semibold text-navy-900 leading-snug">${esc(a.title)}</h3><p class="mt-2 text-sm flex-1">${esc(a.desc)}</p><span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900">Leer guía ${ic('arrow', 'w-4 h-4')}</span></a>`).join('')}</div>
      <p data-guide-empty class="hidden mt-6 text-slate-500">No encontramos guías con ese término. Prueba con otra palabra o <a class="underline text-navy-900" href="/contacto/">escríbenos tu duda</a>.</p>
      <p class="mt-10 text-sm">¿Buscas una definición? Consulta el <a class="underline text-navy-900 font-medium" href="/glosario/">glosario de términos</a>.</p></div></section>` + ctaFinal();
  render({ url: '/blog/', title: 'Guías sobre accidentes de tránsito en Colombia | Derechos con Dignidad', desc: 'Guías prácticas sobre qué hacer después de un accidente, SOAT, aseguradoras, honorarios, plazos y reclamación de perjuicios.', body, crumbs: [['Inicio', '/'], ['Guías', '/blog/']], faq: { pools: ['primeros', 'seguros', 'proceso', 'honorarios'], min: 8 } });

  for (const a of ARTICLES) {
    TIPSET.clear();
    const faqs = faqsFor(a.faqs, POOLS_BY_CLUSTER[a.cluster] || ['primeros'], a.slug);
    const url = `/blog/${a.slug}/`;
    const crumbs = [['Inicio', '/'], ['Guías', '/blog/'], [a.title, url]];
    const target = a.link === 'honorarios' ? ['/honorarios-cuota-litis/', 'Honorarios y cuota litis'] : [svcUrl(a.link), SERVICES[a.link].short];
    const secs = a.sections.map(([t], i) => [`s${i + 1}`, t]);
    const b = pageHero({ crumbs, h1: a.title, sub: a.desc, ctas: false, kicker: a.cluster }) + `
<div class="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_300px] gap-12">
<article class="space-y-12 min-w-0 max-w-3xl">
  <div class="bg-gold-500/10 border-l-4 border-gold-500 rounded-r-xl p-5" data-respuesta><p class="text-xs font-semibold uppercase tracking-wider text-gold-700">En resumen</p><ul class="mt-3 space-y-2">${a.resumen.map((r) => `<li class="flex gap-3 text-navy-900">${ic('check', 'w-5 h-5 text-gold-700 shrink-0 mt-0.5')}<span>${esc(r)}</span></li>`).join('')}</ul></div>
  ${datesLine()}
  ${a.sections.map(([t, bl], i) => `<section id="s${i + 1}" class="scroll-mt-28" aria-labelledby="h-s${i + 1}"><h2 id="h-s${i + 1}" class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">${esc(t)}</h2>${renderBlocks(bl)}</section>`).join('')}
  <section id="glosario" class="scroll-mt-28" aria-labelledby="h-glosario"><h2 id="h-glosario" class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Definiciones clave</h2>${glossHtml(a.glos)}</section>
  <section id="faq" class="scroll-mt-28" aria-labelledby="h-faq"><h2 id="h-faq" class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Preguntas frecuentes</h2>${faqHtml(faqs)}</section>
  <section id="fuentes" class="scroll-mt-28" aria-labelledby="h-fuentes"><h2 id="h-fuentes" class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Fuentes y normas de referencia</h2>${sourcesHtml(a.fuentes)}</section>
  <section class="bg-white border border-slate-200 rounded-2xl p-6"><p class="font-semibold text-navy-900">Para profundizar</p><ul class="mt-2 space-y-1 text-sm"><li><a class="underline text-navy-900 font-medium" href="${target[0]}">${esc(target[1])}</a></li>${a.slug === 'aseguradora-objeta-como-responder' ? '<li><a class="underline text-navy-900 font-medium" href="/recursos/modelo-derecho-de-peticion/">Modelo de derecho de petición</a></li>' : ''}${(a.related || []).filter((r) => SERVICES[r] && svcUrl(r) !== target[0]).map((r) => `<li><a class="underline text-navy-900 font-medium" href="${svcUrl(r)}">${esc(SERVICES[r].short)}</a></li>`).join('')}</ul></section>
  <p class="text-xs text-slate-500">Contenido informativo, no constituye asesoría jurídica ni garantiza resultados.</p>
</article>
<aside class="space-y-6 lg:sticky lg:top-28 self-start">
  <nav data-toc aria-label="En este artículo" class="bg-white border border-slate-200 rounded-2xl p-6 text-sm"><p class="font-semibold text-navy-900">En este artículo</p><ul class="mt-3 space-y-2">${[...secs, ['glosario', 'Definiciones clave'], ['faq', 'Preguntas frecuentes'], ['fuentes', 'Fuentes']].map(([i, t]) => `<li><a class="hover:text-gold-700" href="#${i}">${esc(t)}</a></li>`).join('')}</ul></nav>
  <div class="bg-navy-900 text-white rounded-2xl p-6"><p class="font-semibold">¿Necesitas orientación?</p><div class="mt-4 space-y-3">${btnWA('WhatsApp', 'w-full', 'articulo')}</div></div>
</aside></div>` + ctaFinal();
    const author = SITE.lawyers.length ? { '@type': 'Person', name: SITE.lawyers[0].name } : { '@id': SITE.url + '/#organization' };
    render({ url, title: `${a.seo || SEO_TITLES[a.slug] || a.title} | Derechos con Dignidad`, desc: a.desc, body: b, crumbs, og: 'article',
      schema: [
        { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.desc, inLanguage: 'es-CO', datePublished: SITE.published, dateModified: SITE.lastReview, mainEntityOfPage: SITE.url + url, author, publisher: { '@id': SITE.url + '/#organization' }, articleSection: a.cluster, about: target[1] },
        faqSchema(faqs),
      ] });
  }
}

function glosario() {
  const keys = Object.keys(GLOSARIO).sort((p, q) => GLOSARIO[p][0].localeCompare(GLOSARIO[q][0], 'es'));
  const body = pageHero({ crumbs: [['Inicio', '/'], ['Glosario', '/glosario/']], h1: 'Glosario de términos de accidentes de tránsito', sub: 'Definiciones breves de los términos jurídicos y de seguros que encontrarás en tu reclamación.', ctas: false }) +
    `<section class="py-14"><div class="max-w-4xl mx-auto px-6"><dl class="space-y-5">${keys.map((k) => `<div id="${k}" class="scroll-mt-28 bg-white border border-slate-200 rounded-xl p-6"><dt class="text-lg font-semibold text-navy-900">${esc(GLOSARIO[k][0])}</dt><dd class="mt-2 leading-relaxed">${esc(GLOSARIO[k][1])}</dd></div>`).join('')}</dl><p class="mt-8 text-xs text-slate-500">Definiciones orientativas. La aplicación a cada caso requiere revisión individual por un abogado.</p></div></section>` + ctaFinal();
  render({ url: '/glosario/', title: 'Glosario: SOAT, IPAT, lucro cesante y más términos | Derechos con Dignidad', desc: 'Definiciones claras de SOAT, IPAT, lucro cesante, daño moral, cuota litis, objeción y otros términos de los accidentes de tránsito en Colombia.', body, crumbs: [['Inicio', '/'], ['Glosario', '/glosario/']], faq: { pools: ['seguros', 'lesiones', 'proceso'], min: 6 },
    schema: [{ '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'Glosario de accidentes de tránsito', inLanguage: 'es-CO', hasDefinedTerm: keys.map((k) => ({ '@type': 'DefinedTerm', name: GLOSARIO[k][0], description: GLOSARIO[k][1], url: `${SITE.url}/glosario/#${k}` })) }] });
}

// ---------- Archivos técnicos ----------
function tech() {
  const w = (f, c) => { fs.mkdirSync(path.dirname(path.join(DIST, f)), { recursive: true }); fs.writeFileSync(path.join(DIST, f), c); };
  w('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((u) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${SITE.lastReview}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  // Configuración para hostings Apache / cPanel (Netlify, Vercel y Cloudflare Pages la ignoran y usan 404.html solos)
  w('.htaccess', `# Derechos con Dignidad - configuración Apache (cPanel)
DirectoryIndex index.html
Options -Indexes
ErrorDocument 404 /404.html

# Forzar HTTPS y dominio sin www (coincide con las URL canónicas: ${SITE.url}).
# Actívalo quitando los "#" SOLO cuando el certificado SSL ya esté instalado en el hosting.
# <IfModule mod_rewrite.c>
#   RewriteEngine On
#   RewriteCond %{HTTPS} off [OR]
#   RewriteCond %{HTTP_HOST} ^www\\. [NC]
#   RewriteRule ^ ${SITE.url}%{REQUEST_URI} [L,R=301]
# </IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript text/plain text/xml application/xml image/svg+xml application/json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
`);
  w('robots.txt', `# Política de rastreo (aprobar por el responsable del sitio)\nUser-agent: *\nAllow: /\n\n# Búsqueda de OpenAI: permitir para aparecer en respuestas de búsqueda\nUser-agent: OAI-SearchBot\nAllow: /\n\n# Entrenamiento de modelos de OpenAI: decisión del titular; por defecto permitido\nUser-agent: GPTBot\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
  const regionList = (k) => MUNICIPIOS.filter((m) => regionOf(m) === k);
  const auth = (m) => m.autoridad.candidato ? m.autoridad.nombre + ' (datos de contacto por confirmar en la alcaldía)' : m.autoridad.nombre + ': ' + m.autoridad.dir + '. Tel. ' + m.autoridad.tel;
  const legalLinks = LEGAL_LINKS.map(([t, u]) => `- [${t}](${SITE.url}${u})`).join('\n');
  w('llms.txt', [
    `# ${SITE.name}`,
    `> ${SITE.name} es una firma de abogados que orienta a víctimas de accidentes de tránsito en ${'Medellín, el Valle de Aburrá y el Oriente antioqueño'} (Colombia). Oficina: ${SITE.address}. Teléfono: ${SITE.phone}. Consulta inicial sin costo; disponibilidad 24/7. El contenido del sitio es informativo y no constituye asesoría jurídica ni garantiza resultados.`,
    `Última actualización del contenido: ${SITE.lastReview}. Idioma: español (Colombia).`,
    '## Datos clave',
    [`- Nombre: ${SITE.name}`, `- Dirección: ${SITE.address}`, `- Teléfono: ${SITE.phone}`, `- Horario: ${SITE.hours}`, '- Primera consulta: sin costo', `- Cobertura: Medellín; Valle de Aburrá (${regionList('aburra').map((m) => m.name).join(', ')}); Oriente antioqueño (${regionList('oriente').map((m) => m.name).join(', ')})`, '- Temas: accidentes de tránsito, SOAT, reclamaciones a aseguradoras, responsabilidad civil, lesiones y perjuicios, responsabilidad del Estado por vías'].join('\n'),
    '## Servicios',
    Object.entries(SERVICES).map(([sl, v]) => `- [${v.short}](${SITE.url}${svcUrl(sl)}): ${v.metaDesc}`).join('\n'),
    '## Cobertura por municipio',
    `- [Cobertura: Valle de Aburrá y Oriente antioqueño](${SITE.url}/area-metropolitana/)`,
    ...Object.entries(REGIONES).map(([k, R]) => `### ${R.label}\n` + regionList(k).map((m) => `- [${m.name}](${SITE.url}${muniUrl(m)}): ${m.desc}`).join('\n')),
    '## Guías',
    `- [Índice de guías](${SITE.url}/blog/)`,
    ARTICLES.map((a) => `- [${a.title}](${SITE.url}/blog/${a.slug}/): ${a.desc}`).join('\n'),
    '## Herramientas y recursos',
    [`- [Calculadora orientativa de indemnización](${SITE.url}/calculadora-indemnizacion/): estima perjuicios patrimoniales; no incluye perjuicios morales ni garantiza montos.`, `- [Modelo de derecho de petición a una aseguradora](${SITE.url}/recursos/modelo-derecho-de-peticion/)`, `- [Glosario](${SITE.url}/glosario/)`, `- [Preguntas frecuentes](${SITE.url}/preguntas-frecuentes/)`, `- [Honorarios y cuota litis](${SITE.url}/honorarios-cuota-litis/)`].join('\n'),
    '## Sobre la firma',
    [`- [Nosotros](${SITE.url}/nosotros/)`, `- [Contacto](${SITE.url}/contacto/)`].join('\n'),
    ...(TEAM.length ? ['## Equipo', (SITE.teamIntro ? SITE.teamIntro + '\n' : '') + TEAM.map((m) => `- ${m.name}: ${m.role}`).join('\n')] : []),
    '## Legal',
    legalLinks,
    '## Optional',
    `- [Contenido completo en texto](${SITE.url}/llms-full.txt)`,
  ].join('\n\n') + '\n');
  const blk = (arr) => arr.join('\n\n');
  const full = ['# ' + SITE.name + ' (contenido completo)', '> Orientación jurídica informativa para víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño (Colombia). No constituye asesoría jurídica ni garantiza resultados. Última actualización: ' + SITE.lastReview + '.',
    '## Datos de la firma', ['- Nombre: ' + SITE.name, '- Dirección: ' + SITE.address, '- Teléfono: ' + SITE.phone, '- Horario: ' + SITE.hours, '- Primera consulta sin costo', '- Sitio: ' + SITE.url].join('\n'),
    ...(TEAM.length ? ['## Equipo', (SITE.teamIntro || '') + '\n' + TEAM.map((m) => '- ' + m.name + ': ' + m.role).join('\n')] : []),
    '## Preguntas frecuentes generales', FAQ_GENERAL.map(([q, a]) => '- **' + q + '** ' + a).join('\n'),
    '## Servicios',
    ...Object.entries(SERVICES).map(([sl, v]) => { const x = EXTRA[sl]; return blk(['### ' + v.title, SITE.url + svcUrl(sl), '**Respuesta rápida:** ' + x.respuesta, ...v.entender, '**Perjuicios que pueden analizarse:**\n' + v.danos.map((d) => '- ' + d).join('\n'), ...v.seguros, '**Preguntas frecuentes:**\n' + [...v.faqs, ...x.faqs].map(([q, a]) => '- ' + q + ' ' + a).join('\n')]); }),
    '## Cobertura por municipio',
    'El SOAT es de alcance nacional. Entre municipios cambian la autoridad de tránsito que elabora el informe, la entidad que administra la vía y los trámites locales. Los datos de autoridades provienen de fuentes oficiales y deben confirmarse antes de acudir.',
    ...MUNICIPIOS.map((m) => blk(['### ' + m.name + ' (' + REGIONES[regionOf(m)].label + ')', SITE.url + muniUrl(m), m.p1, m.p2, m.p3, '**Autoridad de tránsito:** ' + auth(m), '**Situaciones frecuentes:**\n' + m.escenarios.map(([t, d]) => '- ' + t + ': ' + d).join('\n'), '**Preguntas frecuentes:**\n' + muniFaqs(m).map(([q, a]) => '- ' + q + ' ' + a).join('\n')])),
    '## Guías',
    ...ARTICLES.map((a) => blk(['### ' + a.title, SITE.url + '/blog/' + a.slug + '/', '**En resumen:**\n' + a.resumen.map((x) => '- ' + x).join('\n'), ...a.sections.map(([t, bl]) => '#### ' + t + '\n' + blocksToText(bl))])),
    '## Glosario',
    ...Object.values(GLOSARIO).map(([t, d]) => '- **' + t + ':** ' + d),
    '## Aviso',
    'La información es orientativa y general. Cada caso requiere revisión individual por un abogado. Normas, topes y trámites cambian: verifica su vigencia. Documentos legales: ' + LEGAL_LINKS.map(([t, u]) => t + ' (' + SITE.url + u + ')').join('; ') + '.'].join('\n\n');
  w('llms-full.txt', full);
  fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
  fs.copyFileSync(LOGO.file, path.join(DIST, 'assets', 'logo' + LOGO.ext));
  for (const ic2 of ['apple-touch-icon.png', 'icon-512.png']) if (fs.existsSync('src/assets/' + ic2)) fs.copyFileSync('src/assets/' + ic2, path.join(DIST, 'assets', ic2));
  w('assets/site.webmanifest', JSON.stringify({ name: SITE.name, short_name: SITE.name, start_url: '/', display: 'browser', background_color: '#ffffff', theme_color: '#0f172a', icons: [{ src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }] }));
  if (hasOG) fs.copyFileSync('src/assets/og-default.png', path.join(DIST, 'assets', 'og-default.png'));
  if (fs.existsSync('src/assets/team')) fs.cpSync('src/assets/team', path.join(DIST, 'assets', 'team'), { recursive: true });
  if (fs.existsSync('src/assets/favicon.svg')) fs.copyFileSync('src/assets/favicon.svg', path.join(DIST, 'assets', 'favicon.svg')); else w('assets/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#d4af37"/><path d="M16 6v20M8 10h16M10 11l-3 7a3.5 3.5 0 0 0 6 0zM22 11l-3 7a3.5 3.5 0 0 0 6 0zM10 26h12" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  w('assets/app.js', fs.readFileSync('src/app.js', 'utf8'));
  w('assets/calc.js', fs.readFileSync('src/calc.js', 'utf8'));
  // La 404 no lleva canonical ni og:url (no es una URL real del sitio)
  w('404.html', fs.readFileSync(path.join(DIST, 'no-encontrado', 'index.html'), 'utf8')
    .replace(/<link rel="canonical"[^>]*>/, '').replace(/<meta property="og:url"[^>]*>/, ''));
  fs.rmSync(path.join(DIST, 'no-encontrado'), { recursive: true, force: true });
}

// ---------- Interactividad y estructura de lectura ----------
ICONS.home = '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>';
ICONS.calc = '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>';

const crumbsBar = (c) => `<nav aria-label="Migas de pan" class="bg-white border-b border-slate-200"><ol class="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">${c.map((x, i) => i === c.length - 1
  ? `<li aria-current="page" class="text-navy-900 font-medium">${esc(x[0])}</li>`
  : `<li class="flex items-center gap-2"><a href="${x[1]}" class="hover:text-gold-700 inline-flex items-center gap-1.5">${i === 0 ? ic('home', 'w-4 h-4') : ''}${esc(x[0])}</a>${ic('down', 'w-4 h-4 text-slate-300 -rotate-90')}</li>`).join('')}</ol></nav>`;

const CTA_MARK = '<section class="relative bg-navy-900 text-white overflow-hidden">\n  <div class="absolute inset-0 cta-diag"';
const insertBeforeCta = (body, html) => { const i = body.lastIndexOf(CTA_MARK); return i === -1 ? body + html : body.slice(0, i) + html + body.slice(i); };
const faqSection = (list, title = 'Preguntas frecuentes', search = false) => `<section class="py-16 bg-white" aria-labelledby="h-faq-auto"><div class="max-w-3xl mx-auto px-6"><h2 id="h-faq-auto" class="text-3xl font-semibold text-navy-900 tracking-tight mb-6">${esc(title)}</h2>${faqHtml(list, search)}</div></section>`;

// Glosario en línea: primera aparición de cada término por página
const TIPSET = new Set();
const TERMS = [[/\bSOAT\b/, 'soat'], [/\bIPAT\b/, 'ipat'], [/\bADRES\b/, 'adres'], [/lucro cesante/i, 'lucro-cesante'], [/daño emergente/i, 'dano-emergente'], [/perjuicios morales|daño moral/i, 'dano-moral'], [/daño a la vida de relación/i, 'dano-vida-relacion'], [/cuota litis/i, 'cuota-litis'], [/Medicina Legal/, 'medicina-legal'], [/pérdida de capacidad laboral/i, 'pcl'], [/concurrencia de culpas/i, 'concurrencia-culpas'], [/finiquito/i, 'transaccion'], [/conciliación/i, 'conciliacion'], [/objeción/i, 'objecion'], [/querella/i, 'querella'], [/epicrisis/i, 'epicrisis'], [/\bARL\b/, 'arl'], [/prescripción/i, 'prescripcion'], [/vehículo fantasma/i, 'vehiculo-fantasma']];
const tipify = (html) => {
  const tags = []; let out = html;
  for (const [re, key] of TERMS) {
    if (TIPSET.has(key) || !GLOSARIO[key]) continue;
    const m = re.exec(out); if (!m) continue;
    TIPSET.add(key);
    tags.push(`<span class="tip" tabindex="0" data-tip="${esc(GLOSARIO[key][1])}">${m[0]}</span>`);
    out = out.slice(0, m.index) + `\u0001${tags.length - 1}\u0001` + out.slice(m.index + m[0].length);
  }
  return out.replace(/\u0001(\d+)\u0001/g, (_, n) => tags[+n]);
};
const para = (p) => `<p class="leading-relaxed mb-4">${tipify(esc(p))}</p>`;

const checklistHtml = (slug, docs) => `<div data-checklist="${slug}" class="bg-white border border-slate-200 rounded-2xl p-5">
  <div class="flex items-center justify-between gap-3 flex-wrap"><p class="font-semibold text-navy-900">Marca lo que ya tienes <span class="text-sm font-normal text-slate-500">(<span data-count>0 de ${docs.length}</span>)</span></p><div class="flex gap-4 text-xs no-print"><button type="button" data-checklist-copy class="underline">Copiar lista</button><button type="button" data-checklist-print class="underline">Imprimir</button></div></div>
  <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div data-bar class="h-full w-0 bg-gold-500 transition-all"></div></div>
  <ul class="mt-4 space-y-2">${docs.map((d) => `<li><label class="flex gap-3 items-start cursor-pointer text-sm"><input type="checkbox" class="chk mt-0.5 w-4 h-4 accent-yellow-600 shrink-0"><span>${esc(d)}</span></label></li>`).join('')}</ul></div>`;

const RECIBES = [['file', 'Revisión inicial del caso', 'Analizamos lo que te ocurrió y los datos que tienes.'], ['scale', 'Ruta jurídica recomendada', 'Qué vía conviene en tu situación y por qué.'], ['shield', 'Documentos clave', 'Qué soportes reunir y cuáles son los más importantes.'], ['clock', 'Próximos pasos con tiempos estimados', 'Qué sigue, en qué orden y con qué plazos orientativos.']];
const recibeHtml = (dark = false) => `<ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">${RECIBES.map(([i, t, d]) => `<li class="${dark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200'} border rounded-2xl p-5"><span class="text-gold-700">${ic(i, 'w-6 h-6')}</span><p class="mt-3 font-semibold ${dark ? 'text-white' : 'text-navy-900'}">${t}</p><p class="mt-1 text-sm">${d}</p></li>`).join('')}</ul>`;
const HOME_FAQ = faqsFor(FAQ_GENERAL, ['primeros', 'seguros', 'honorarios'], 'home', 8);
const BIG_FAQ = faqsFor(FAQ_GENERAL, ['primeros', 'seguros', 'lesiones', 'proceso', 'honorarios', 'transporte', 'estado', 'contacto'], 'faq', 28);

// ---------- Formulario completo de contacto ----------
const MUNI_NAMES = ['Medellín', ...MUNICIPIOS.map((m) => m.name), 'Otro municipio de Antioquia', 'Otro departamento'];
const fIn = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500';
const fText = (id, label, { type = 'text', req = false, ph = '', ac = '', name } = {}) => `<div><label for="${id}" class="block text-sm font-semibold text-navy-900 mb-1.5">${label}${req ? ' <span class="text-red-600" aria-hidden="true">*</span>' : ''}</label><input id="${id}" name="${name || id.replace('k-', '')}" type="${type}" ${req ? 'required' : ''} ${ac ? `autocomplete="${ac}"` : ''} placeholder="${ph}" class="${fIn}"></div>`;
const fSel = (id, label, opts, { req = false, name } = {}) => `<div><label for="${id}" class="block text-sm font-semibold text-navy-900 mb-1.5">${label}${req ? ' <span class="text-red-600" aria-hidden="true">*</span>' : ''}</label><select id="${id}" name="${name || id.replace('k-', '')}" class="${fIn}"><option value="">Selecciona…</option>${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>`;
const fRadios = (name, legend, opts) => `<fieldset><legend class="block text-sm font-semibold text-navy-900 mb-1.5">${legend}</legend><div class="flex flex-wrap gap-2">${opts.map((o, i) => `<label class="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm cursor-pointer has-[:checked]:border-gold-500 has-[:checked]:bg-gold-500/10"><input type="radio" name="${name}" value="${esc(o)}" data-label="${esc(legend)}" class="accent-yellow-600"> ${esc(o)}</label>`).join('')}</div></fieldset>`;
const fieldset = (title, inner) => `<fieldset class="space-y-4"><legend class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 mb-1">${title}</legend>${inner}</fieldset>`;

function contactFormHtml() {
  const docs = ['IPAT / informe de la autoridad', 'Historia clínica', 'Incapacidades', 'Facturas y recibos', 'Fotos o videos', 'Póliza o SOAT'];
  return `<div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8" id="formulario">
  <h2 class="text-2xl font-semibold text-navy-900 tracking-tight">Cuéntanos tu caso</h2>
  <p class="mt-1 text-sm text-slate-500">Cuanta más información nos des, mejor podremos orientarte. Los campos con <span class="text-red-600">*</span> son obligatorios. Si no sabes una respuesta, déjala en blanco.</p>
  <form data-lead data-loc="contacto" class="mt-6 space-y-8" novalidate>
    ${fieldset('1. Tus datos de contacto', `<div class="grid sm:grid-cols-2 gap-4">${fText('k-nombre', 'Nombre completo', { req: true, ac: 'name', name: 'nombre' })}${fText('k-telefono', 'Teléfono o celular', { type: 'tel', req: true, ac: 'tel', ph: '300 000 0000', name: 'telefono' })}</div>
      <div class="grid sm:grid-cols-2 gap-4">${fText('k-correo', 'Correo electrónico (opcional)', { type: 'email', ac: 'email', name: 'correo' })}${fSel('k-residencia', 'Municipio donde vives', MUNI_NAMES, { name: 'residencia' })}</div>
      <div class="grid sm:grid-cols-2 gap-4">${fSel('k-canal', 'Canal preferido', ['WhatsApp', 'Llamada', 'Correo'], { name: 'canal' })}${fSel('k-horario', 'Mejor horario para contactarte', ['Mañana', 'Tarde', 'Noche', 'Cualquier horario'], { name: 'horario' })}</div>
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="tiene_whatsapp" value="Sí" data-label="Este número tiene WhatsApp" class="accent-yellow-600"> Este número tiene WhatsApp</label>`)}
    ${fieldset('2. Sobre el accidente', `<div class="grid sm:grid-cols-2 gap-4">${fText('k-fecha', 'Fecha aproximada del accidente', { type: 'date', name: 'fecha' })}${fSel('k-lugar', 'Municipio donde ocurrió', MUNI_NAMES, { name: 'lugar' })}</div>
      <div class="grid sm:grid-cols-2 gap-4">${fSel('k-tipo', '¿Qué tipo de accidente fue?', ['Accidente de moto', 'Accidente de carro', 'Atropello (peatón)', 'Ciclista', 'Pasajero de transporte público', 'Pasajero de plataforma (Uber, DiDi, inDrive…)', 'Parrillero', 'Accidente por vía en mal estado o señalización', 'Otro'], { name: 'tipo' })}${fSel('k-rol', '¿Cuál fue tu rol?', ['Conductor', 'Parrillero o acompañante', 'Peatón', 'Ciclista', 'Pasajero', 'Familiar de la víctima'], { name: 'rol' })}</div>
      ${fRadios('hubo_lesionados', '¿Hubo lesionados?', ['Sí', 'No'])}
      <div class="grid sm:grid-cols-2 gap-4">${fSel('k-gravedad', 'Gravedad de las lesiones', ['Leves', 'Moderadas', 'Graves (cirugía u hospitalización)', 'Fallecimiento de la víctima'], { name: 'gravedad' })}${fSel('k-atencion', '¿Ha recibido atención médica?', ['Sí, ya terminó', 'Sí, sigue en tratamiento', 'No todavía'], { name: 'atencion' })}</div>`)}
    ${fieldset('3. Responsable, seguros y documentos', `<div class="grid sm:grid-cols-2 gap-4">${fSel('k-ipat', '¿La autoridad elaboró informe (IPAT)?', ['Sí', 'No', 'No sé'], { name: 'ipat' })}${fSel('k-identificado', '¿Se identificó al otro vehículo o conductor?', ['Sí', 'No, huyó', 'No sé'], { name: 'identificado' })}</div>
      <div class="grid sm:grid-cols-2 gap-4">${fSel('k-soat', '¿El otro vehículo tenía SOAT?', ['Sí', 'No', 'No sé'], { name: 'soat_otro' })}${fSel('k-aseguradora', '¿Te contactó alguna aseguradora?', ['Sí', 'No'], { name: 'aseguradora' })}</div>
      ${fRadios('firmo', '¿Has firmado algún documento o acuerdo?', ['No', 'Sí', 'No estoy seguro'])}
      <fieldset><legend class="block text-sm font-semibold text-navy-900 mb-1.5">¿Qué documentos tienes?</legend><div class="grid sm:grid-cols-2 gap-2">${docs.map((d) => `<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="docs" value="${esc(d)}" data-label="Documentos que tengo" class="accent-yellow-600"> ${esc(d)}</label>`).join('')}</div></fieldset>`)}
    ${fieldset('4. Cuéntanos qué pasó', `<div><label for="k-desc" class="block text-sm font-semibold text-navy-900 mb-1.5">Descripción breve</label><textarea id="k-desc" name="descripcion" rows="5" placeholder="¿Cómo ocurrió, qué lesiones tienes y qué te gustaría resolver?" class="${fIn}"></textarea></div>`)}
    <div class="space-y-3 text-sm">
      <label class="flex gap-3 items-start"><input type="checkbox" name="consent" required class="mt-0.5 w-4 h-4 accent-yellow-600"><span>Autorizo el tratamiento de mis datos personales para ser contactado, según la <a class="underline" href="/tratamiento-de-datos/">autorización de tratamiento de datos</a> y la <a class="underline" href="/politica-de-privacidad/">política de privacidad</a>. <span class="text-red-600">*</span></span></label>
      <label class="flex gap-3 items-start text-slate-500"><input type="checkbox" name="consent_salud" class="mt-0.5 w-4 h-4 accent-yellow-600"><span>Entiendo que la información sobre mi salud es un dato sensible, que no estoy obligado a suministrarla y que solo se usará para analizar mi caso.</span></label>
    </div>
    <input type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">
    <button type="submit" class="w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-4 rounded-lg">Enviar consulta ${ic('arrow')}</button>
    <p role="status" class="text-sm" aria-live="polite"></p>
  </form>
  <div data-success class="hidden">
    <div class="flex items-center gap-3 text-green-700"><span class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">${ic('check')}</span><h3 class="text-xl font-semibold text-navy-900">Resumen de tu consulta</h3></div>
    <p class="mt-3 text-sm">Revisa el resumen. ${hasWA ? 'Envíalo por WhatsApp para que lo revisemos.' : 'Cuando se configure el WhatsApp de la firma podrás enviarlo directamente; mientras tanto puedes copiarlo.'}</p>
    <pre data-summary class="mt-4 whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700"></pre>
    <div class="mt-5 flex flex-wrap gap-3"><a data-wa-link target="_blank" rel="noopener" class="hidden inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-5 py-3 rounded-lg">${ic('chat')}Enviar por WhatsApp</a><button type="button" data-copy-summary class="border border-slate-300 px-5 py-3 rounded-lg font-medium text-navy-900">Copiar resumen</button><button type="button" data-again class="px-5 py-3 text-sm underline">Enviar otra consulta</button></div>
  </div>
</div>`;
}

// ---------- Área metropolitana y municipios ----------
const muniUrl = (m) => `/abogado-accidentes-transito-${m.slug}/`;
function areaMetro() {
  const crumbs = [['Inicio', '/'], ['Cobertura', '/area-metropolitana/']];
  const byReg = (k) => MUNICIPIOS.filter((m) => regionOf(m) === k);
  const names = (k) => byReg(k).map((m) => m.name).join(', ');
  const card = (m) => `<a href="${muniUrl(m)}" class="group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all"><p class="text-xs uppercase tracking-wide text-gold-700 font-semibold">${regionOf(m) === 'oriente' ? 'Oriente antioqueño' : 'Zona ' + m.zona}</p><h3 class="mt-1 font-semibold text-navy-900 text-lg">${esc(m.name)}</h3><p class="mt-2 text-sm">Qué hacer si el accidente ocurrió en ${esc(m.name)} y cómo reunir los soportes.</p><span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900">Ver página ${ic('arrow', 'w-4 h-4')}</span></a>`;
  const body = pageHero({ crumbs, h1: 'Abogado de accidentes de tránsito en el Valle de Aburrá y el Oriente antioqueño', sub: `Orientamos a víctimas de accidentes en Medellín, en el área metropolitana (${names('aburra')}) y en el Oriente antioqueño (${names('oriente')}).`, ctas: false }) + `
<div class="max-w-7xl mx-auto px-6 py-14 space-y-12">
  ${answerBox('El SOAT es de alcance nacional: atiende a las víctimas sin importar el municipio del accidente. Lo que cambia entre municipios es la autoridad de tránsito que elabora el informe, quién administra la vía y los trámites locales. Elige tu municipio para ver recomendaciones específicas.')}
  ${SITE.coverageConfirmed ? '' : pending('confirmar con la firma la cobertura real en cada municipio y la modalidad de atención (presencial o virtual).')}
  <section><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Valle de Aburrá</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <a href="/" class="group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all"><p class="text-xs uppercase tracking-wide text-gold-700 font-semibold">Sede principal</p><h3 class="mt-1 font-semibold text-navy-900 text-lg">Medellín</h3><p class="mt-2 text-sm">Página de inicio con todos los servicios.</p></a>
      ${byReg('aburra').map(card).join('')}
    </div></section>
  <section><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-3">Oriente antioqueño</h2><p class="mb-5 leading-relaxed max-w-3xl">Muchas personas viven o trabajan entre Medellín y el Oriente, y los accidentes ocurren con frecuencia en los corredores que los unen. En estos municipios la autoridad que atiende puede ser municipal o, en vías nacionales y departamentales, la Policía de Tránsito y Transporte.</p>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">${byReg('oriente').map(card).join('')}</div></section>
  <section><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Comparativo de referencia</h2>${tableHtml({ cap: 'Municipios: zona y corredores de referencia (información general, verificar en fuentes oficiales)', head: ['Municipio', 'Zona', 'Corredores y transporte de referencia'], rows: MUNICIPIOS.map((m) => [m.name, regionOf(m) === 'oriente' ? 'Oriente antioqueño' : (m.zona === 'norte' ? 'Norte del Valle de Aburrá' : 'Sur del Valle de Aburrá'), `${m.vias}. ${m.transporte}.`]) })}</section>
  <section><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Qué cambia entre un municipio y otro</h2>${bullets(['La autoridad de tránsito que atiende el accidente y elabora el IPAT.', 'La entidad que administra la vía (municipio, entidad nacional o concesión), relevante si el estado de la vía influyó.', 'Los trámites y dependencias locales para solicitar copias de informes.', 'La disponibilidad de cámaras públicas y privadas cercanas, que conviene solicitar de inmediato.'])}<p class="mt-4 text-sm text-slate-500">La ley sustancial (SOAT, responsabilidad civil, perjuicios) es la misma en todo el país.</p></section>
</div>` + ctaFinal();
  render({ url: '/area-metropolitana/', schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Municipios con orientación por accidentes de tránsito', itemListElement: MUNICIPIOS.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, url: SITE.url + muniUrl(m) })) }], title: 'Abogado de accidentes de tránsito en el Valle de Aburrá y el Oriente', desc: 'Abogado para víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente: Rionegro, La Ceja, El Retiro y El Carmen de Viboral.', body, crumbs, faq: { pools: ['cobertura', 'primeros', 'seguros'], min: 8 } });
}

function municipios() {
  areaMetro();
  for (const m of MUNICIPIOS) {
    TIPSET.clear();
    const url = muniUrl(m);
    const crumbs = [['Inicio', '/'], ['Cobertura', '/area-metropolitana/'], [m.name, url]];
    const reg = regionOf(m);
    const near = m.vecinos.map((n) => MUNICIPIOS.find((x) => x.name === n)).filter(Boolean);
    const a = m.autoridad;
    const extra = RECURSOS[m.slug] || [];
    const h2c = 'text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5';
    const body = pageHero({ crumbs, h1: `Abogado de accidentes de tránsito en ${m.name}`, sub: m.hook }) + `
<div class="max-w-7xl mx-auto px-6 py-14 space-y-14">
  ${answerBox(`Si sufriste un accidente de tránsito en ${m.name}, el SOAT atiende tu atención médica inicial sin importar quién tuvo la culpa y los demás perjuicios se reclaman al responsable y a su aseguradora. Lo que depende del municipio es la autoridad que elabora el informe (${a.nombre}) y quién administra la vía donde ocurrió. Antes de firmar acuerdos, reúne tus soportes y pide una revisión.`)}
  ${SITE.coverageConfirmed ? '' : pending(`confirmar con la firma que presta servicio en ${m.name}, la modalidad de atención y validar los datos locales de esta página.`)}
  ${a.candidato ? pending(`verificar en fuente oficial: ${a.candidato}.`) : ''}
  <section id="contexto" class="scroll-mt-28 grid lg:grid-cols-[1.4fr_1fr] gap-10"><div><h2 class="${h2c}">Accidentes en ${esc(m.name)}: contexto útil</h2><p class="leading-relaxed mb-4">${tipify(esc(m.p1))}</p><p class="leading-relaxed mb-4">${tipify(esc(m.p2))}</p><p class="leading-relaxed">${tipify(esc(m.p3))}</p></div>
    <aside class="bg-white border border-slate-200 rounded-2xl p-6 text-sm space-y-3 self-start"><p class="font-semibold text-navy-900">Datos de referencia</p><dl class="space-y-2"><div><dt class="text-slate-500">Zona</dt><dd class="font-medium text-navy-900">${reg === 'oriente' ? 'Oriente antioqueño' : (m.zona === 'norte' ? 'Norte' : 'Sur') + ' del Valle de Aburrá'}</dd></div><div><dt class="text-slate-500">Corredores</dt><dd class="font-medium text-navy-900">${esc(m.vias)}</dd></div><div><dt class="text-slate-500">Transporte</dt><dd class="font-medium text-navy-900">${esc(m.transporte)}</dd></div>${near.length ? `<div><dt class="text-slate-500">Municipios cercanos</dt><dd class="font-medium text-navy-900">${near.map((n) => `<a class="underline" href="${muniUrl(n)}">${esc(n.name)}</a>`).join(', ')}${m.vecinos.includes('Medellín') ? ', <a class="underline" href="/">Medellín</a>' : ''}</dd></div>` : ''}</dl><p class="text-xs text-slate-500">Información general; verifica datos locales en fuentes oficiales.</p></aside></section>
  <section id="primeras-24-horas" class="scroll-mt-28"><h2 class="${h2c}">Primeras 24 horas si el accidente fue en ${esc(m.name)}</h2>
    <p class="leading-relaxed mb-5">Los pasos generales (atención médica, pruebas, datos del otro conductor y no firmar acuerdos) están en nuestra <a class="underline text-navy-900 font-medium" href="/blog/que-hacer-despues-accidente-transito/">guía de qué hacer después de un accidente</a>. Lo específico de ${esc(m.name)}:</p>
    ${bullets([`Pide el informe a la ${a.nombre} (${a.dir}). ${a.nota}`, `Anota la dirección exacta con nomenclatura y puntos de referencia: en ${m.name} esto define qué autoridad atendió y de quién es la vía.`, `Pide cuanto antes las cámaras de negocios y edificios de la zona, y deja constancia escrita de la solicitud.`, `Guarda la historia clínica de cada institución que te atienda y las facturas desde el primer día.`])}</section>
  <section id="escenarios" class="scroll-mt-28"><h2 class="${h2c}">Situaciones frecuentes en ${esc(m.name)} y qué se revisa</h2><div class="grid md:grid-cols-3 gap-5">${m.escenarios.map(([t, d]) => `<article class="bg-white border border-slate-200 rounded-2xl p-6"><h3 class="font-semibold text-navy-900">${esc(t)}</h3><p class="mt-2 text-sm leading-relaxed">${tipify(esc(d))}</p></article>`).join('')}</div></section>
  <section id="autoridad" class="scroll-mt-28"><h2 class="${h2c}">Autoridad de tránsito y recursos oficiales</h2>
    <div class="bg-white border border-slate-200 rounded-2xl p-6 grid md:grid-cols-2 gap-6 text-sm"><div><p class="font-semibold text-navy-900 text-base">${esc(a.titulo || a.nombre)}</p><dl class="mt-3 space-y-2"><div><dt class="text-slate-500">Dirección</dt><dd class="text-navy-900">${esc(a.dir)}</dd></div><div><dt class="text-slate-500">Teléfono</dt><dd class="text-navy-900">${esc(a.tel)}</dd></div></dl><p class="mt-3 text-slate-500">${esc(a.nota)}</p></div>
      <div><p class="font-semibold text-navy-900">Enlaces oficiales</p><ul class="mt-3 space-y-2"><li><a class="underline text-navy-900" href="${a.web}" target="_blank" rel="noopener">${esc(a.candidato ? 'Alcaldía de ' + m.name : a.nombre)}: sitio oficial</a></li>${extra.map(([l, u]) => `<li><a class="underline text-navy-900" href="${u}" target="_blank" rel="noopener">${esc(l)}</a></li>`).join('')}${reg === 'aburra' ? `<li><a class="underline text-navy-900" href="${DIRECTORIO_URL}" target="_blank" rel="noopener">Directorio oficial de secretarías de tránsito del Valle de Aburrá</a></li>` : ''}</ul><p class="mt-3 text-xs text-slate-500">Las direcciones y teléfonos cambian: confirma siempre en el canal oficial.</p></div></div></section>
  <section id="servicios" class="scroll-mt-28"><h2 class="${h2c}">Servicios más consultados desde ${esc(m.name)}</h2><div class="flex flex-wrap gap-3">${m.servicios.map((s) => `<a href="${svcUrl(s)}" class="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-gold-500 rounded-full px-5 py-3 text-navy-900 font-medium">${esc(SERVICES[s].short)}${ic('arrow', 'w-4 h-4 text-gold-700')}</a>`).join('')}</div></section>
  <section class="bg-white border border-slate-200 rounded-2xl p-6 grid sm:grid-cols-2 gap-6">${Object.entries(REGIONES).map(([k, R]) => `<div><p class="font-semibold text-navy-900">${R.titulo}</p><p class="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-2">${MUNICIPIOS.filter((x) => x !== m && regionOf(x) === k).map((x) => `<a class="underline text-navy-900" href="${muniUrl(x)}">${esc(x.name)}</a>`).join('')}${k === 'aburra' ? '<a class="underline text-navy-900" href="/">Medellín</a>' : ''}</p></div>`).join('')}<p class="sm:col-span-2 text-sm"><a class="underline text-navy-900 font-medium" href="/area-metropolitana/">Ver toda la cobertura</a></p></section>
  <p class="text-xs text-slate-500">Contenido informativo; no constituye asesoría jurídica ni garantiza resultados.</p>
</div>` + ctaFinal(`¿Tu accidente fue en ${m.name}?`, 'Cuéntanos qué pasó. Revisamos tu caso y te explicamos tus opciones, sin presiones.');
    render({ url, title: `Abogado de accidentes de tránsito en ${m.name} | ${SITE.name}`, desc: m.desc, body, crumbs,
      schema: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: `Abogado de accidentes de tránsito en ${m.name}`, url: SITE.url + url, inLanguage: 'es-CO', datePublished: SITE.published, dateModified: SITE.lastReview, about: { '@type': 'City', name: m.name, containedInPlace: { '@type': 'AdministrativeArea', name: (reg === 'oriente' ? 'Oriente antioqueño' : 'Valle de Aburrá') + ', Antioquia, Colombia' } }, isPartOf: { '@id': SITE.url + '/#website' } },
        { '@context': 'https://schema.org', '@type': 'Service', name: `Orientación jurídica por accidentes de tránsito en ${m.name}`, serviceType: 'Asesoría jurídica en accidentes de tránsito', provider: { '@id': SITE.url + '/#organization' }, areaServed: { '@type': 'City', name: m.name }, description: m.desc }],
      faq: { own: muniFaqs(m), pools: ['cobertura', 'primeros'], seed: m.slug, min: 8 } });
  }
}

// ---------- Calculadora orientativa ----------
const cMoney = (id, label, hint) => `<div><label for="${id}" class="block text-sm font-semibold text-navy-900 mb-1">${label}</label><input id="${id}" type="text" inputmode="numeric" data-money placeholder="0" autocomplete="off" class="${fIn}">${hint ? `<p class="mt-1 text-xs text-slate-500">${hint}</p>` : ''}</div>`;
const cNum = (id, label, hint, extra = '') => `<div><label for="${id}" class="block text-sm font-semibold text-navy-900 mb-1">${label}</label><input id="${id}" type="number" min="0" inputmode="decimal" placeholder="0" ${extra} class="${fIn}">${hint ? `<p class="mt-1 text-xs text-slate-500">${hint}</p>` : ''}</div>`;
const rRow = (id, label, bar) => `<div><div class="flex justify-between gap-3 text-sm"><span>${label}</span><strong id="${id}" class="text-navy-900">$ 0</strong></div>${bar ? `<div class="mt-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div id="${bar}" class="h-full w-0 bg-gold-500 transition-all duration-300"></div></div>` : ''}</div>`;

function calculadora() {
  const crumbs = [['Inicio', '/'], ['Calculadora de indemnización', '/calculadora-indemnizacion/']];
  const body = pageHero({ crumbs, h1: 'Calculadora orientativa de indemnización por accidente de tránsito', sub: 'Estima cómo influyen tus ingresos, la incapacidad y las secuelas en los perjuicios patrimoniales. Es una herramienta de orientación, no una oferta ni una predicción.', ctas: false }) + `
<div class="max-w-7xl mx-auto px-6 py-12 space-y-12">
  <div class="bg-amber-50 border border-amber-300 rounded-xl p-5 text-sm text-amber-900" role="note"><strong>Importante:</strong> esta calculadora es solo orientativa y está en revisión por un abogado. No incluye perjuicios morales ni otros extrapatrimoniales, no garantiza ningún monto y no reemplaza la revisión individual de tu caso. Los cálculos se hacen en tu navegador y no se envían a ningún servidor.</div>
  <div id="calc" class="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
    <form class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-8" onsubmit="return false" novalidate>
      <fieldset class="space-y-4"><legend class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 mb-1">1. Ingresos e incapacidad</legend>
        ${cMoney('c-ingreso', 'Ingreso mensual antes del accidente (COP)', 'Lo que recibías al mes; con soportes si es posible.')}
        <label class="flex items-center gap-2 text-sm"><input id="c-formal" type="checkbox" class="accent-yellow-600"> Trabajador con contrato formal (se suma un factor prestacional del 25 %)</label>
        <div class="grid sm:grid-cols-2 gap-4">${cNum('c-dias', 'Días de incapacidad', 'Según tus incapacidades médicas.')}${cNum('c-pcl', 'Pérdida de capacidad laboral (%)', 'Solo si existe calificación. Si no, déjalo en 0.', 'max="100"')}</div>
      </fieldset>
      <fieldset class="space-y-4"><legend class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 mb-1">2. Edad y años considerados</legend>
        <div class="grid sm:grid-cols-2 gap-4">${cNum('c-edad', 'Edad actual', '', 'max="100"')}${cNum('c-anios', 'Años de vida laboral a considerar', 'Se sugiere hasta los 65 años; puedes ajustarlo. Un abogado puede usar otros criterios.')}</div>
      </fieldset>
      <fieldset class="space-y-4"><legend class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 mb-1">3. Gastos soportados (daño emergente)</legend>
        ${cMoney('c-gastos', 'Gastos médicos y de transporte ya pagados por ti (COP)', 'Solo los que no te reembolsaron.')}
        ${cMoney('c-futuros', 'Gastos futuros con cotización o soporte médico (COP)', 'Cirugías, terapias, prótesis, etc.')}
        ${cMoney('c-otros', 'Otros daños materiales (COP)', 'Por ejemplo, moto, bicicleta o celular.')}
      </fieldset>
      <fieldset class="space-y-4"><legend class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700 mb-1">4. Ajustes</legend>
        ${cNum('c-culpa', 'Culpa estimada de la víctima (%)', 'Si el accidente tuvo culpas compartidas, la reparación puede reducirse proporcionalmente.', 'max="100"')}
        <details class="text-sm"><summary class="cursor-pointer font-semibold text-navy-900">Supuestos avanzados</summary><div class="mt-3">${cNum('c-tasa', 'Tasa de interés técnico anual (%)', 'Se usa para traer a valor presente el lucro cesante futuro. Valor por defecto: 6.', 'step="0.1" value="6"')}</div></details>
      </fieldset>
      <button type="button" id="c-reset" class="text-sm underline">Limpiar formulario</button>
    </form>
    <div class="space-y-4 lg:sticky lg:top-28">
      <div class="bg-white border border-slate-200 rounded-2xl p-6" aria-live="polite">
        <h2 class="text-xl font-semibold text-navy-900">Resultado orientativo</h2>
        <p id="c-empty" class="mt-3 text-sm text-slate-500">Completa los campos de la izquierda para ver el desglose.</p>
        <div id="c-result" class="hidden mt-4 space-y-4">
          ${rRow('r-emergente', 'Daño emergente', 'b-emergente')}${rRow('r-consolidado', 'Lucro cesante consolidado', 'b-consolidado')}${rRow('r-futuro', 'Lucro cesante futuro', 'b-futuro')}
          <div class="border-t border-slate-200 pt-3 space-y-2">${rRow('r-subtotal', 'Subtotal patrimonial')}${rRow('r-ajuste', 'Ajuste por concurrencia de culpa')}<div class="flex justify-between items-baseline gap-3 pt-2 border-t border-slate-200"><span class="font-semibold text-navy-900">Total patrimonial orientativo</span><strong id="r-total" class="text-2xl text-navy-900">$ 0</strong></div></div>
          <ul id="r-warn" class="text-xs text-amber-800 list-disc pl-5 space-y-1"></ul>
          <p class="text-xs text-slate-500">No incluye perjuicios morales, daño a la vida de relación ni otros extrapatrimoniales, que dependen de las pruebas y de la decisión del juez o del acuerdo.</p>
          <div class="flex flex-wrap gap-2 no-print"><button type="button" id="c-copy" class="border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-navy-900">Copiar resumen</button><button type="button" id="c-print" class="border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-navy-900">Imprimir</button><a id="c-wa" ${hasWA ? `data-wa="https://wa.me/${digits(SITE.whatsapp)}" target="_blank" rel="noopener"` : ''} href="/contacto/" class="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold rounded-lg px-4 py-2 text-sm">${ic('chat', 'w-4 h-4')}Que un abogado lo revise</a></div>
        </div>
      </div>
    </div>
  </div>
  <section id="como-funciona" class="scroll-mt-28"><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Cómo se calcula</h2>${tableHtml({ cap: 'Fórmulas usadas por la calculadora (orientativas, pendientes de validación jurídica)', head: ['Concepto', 'Fórmula', 'Supuestos'], rows: [['Daño emergente', 'Gastos pagados + gastos futuros soportados + otros daños materiales', 'Solo gastos con soporte'], ['Lucro cesante consolidado', 'Ingreso × (días de incapacidad ÷ 30)', 'Incapacidad total durante el período; factor prestacional opcional'], ['Lucro cesante futuro', 'Ingreso × % de pérdida de capacidad × [(1 − (1 + i)^−n) ÷ i]', 'n = meses de vida laboral considerados; i = tasa mensual equivalente a la tasa anual indicada'], ['Ajuste por culpa', 'Subtotal × (1 − % de culpa de la víctima)', 'Reducción proporcional'], ['Perjuicios extrapatrimoniales', 'No se calculan', 'Dependen de pruebas y decisión del juez o acuerdo']] })}</section>
  <section id="limites" class="scroll-mt-28"><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Límites de esta herramienta</h2>${bullets(['No predice lo que reconocerá una aseguradora o un juez.', 'No considera indexación, intereses moratorios ni costas.', 'No reemplaza la calificación de pérdida de capacidad laboral por entidades competentes.', 'La vida laboral y las tablas de supervivencia pueden analizarse con criterios distintos por un abogado.', 'No incluye el amparo del SOAT ni descuenta pagos ya recibidos.'])}</section>
  <section id="glosario" class="scroll-mt-28"><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Definiciones clave</h2>${glossHtml(['dano-emergente', 'lucro-cesante', 'pcl', 'concurrencia-culpas', 'dano-moral', 'dano-vida-relacion'])}</section>
  <section id="fuentes" class="scroll-mt-28"><h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">Fuentes de referencia</h2>${sourcesHtml(['suin', 'medicinalegal'])}</section>
</div>` + ctaFinal();
  render({ url: '/calculadora-indemnizacion/', title: 'Calculadora de indemnización por accidente de tránsito | Derechos con Dignidad', desc: 'Calculadora orientativa de perjuicios patrimoniales tras un accidente de tránsito: daño emergente, lucro cesante y ajuste por culpa. No es una oferta.', body, crumbs, scripts: ['/assets/calc.js'],
    faq: { pools: ['calculadora', 'lesiones', 'proceso'], min: 8 },
    schema: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Calculadora orientativa de indemnización', url: SITE.url + '/calculadora-indemnizacion/', inLanguage: 'es-CO', dateModified: SITE.lastReview }] });
}

// ---------- Landings de pauta (noindex, header mínimo, canonical a la página de servicio) ----------
const LANDINGS = [
  { slug: 'accidente-moto', service: 'accidentes-moto', h1: '¿Te lesionaste en un accidente de moto en Medellín?', sub: 'Cuéntanos qué pasó y te explicamos, sin presiones, qué puedes reclamar y con qué soportes.', bullets: ['El SOAT atiende tu atención médica inicial sin importar la culpa', 'Los demás perjuicios se reclaman al responsable y su aseguradora', 'No firmes acuerdos antes de conocer el alcance de tus lesiones'] },
  { slug: 'aseguradora-objeto-reclamacion', service: 'aseguradoras-no-pagan', h1: '¿La aseguradora objetó o no quiere pagar tu reclamación?', sub: 'Revisamos el motivo de la objeción y te explicamos las vías disponibles.', bullets: ['Pide la objeción por escrito y conserva toda la correspondencia', 'Una objeción no siempre es la última palabra', 'No firmes un finiquito sin entender sus efectos'] },
];
function landings() {
  for (const l of LANDINGS) {
    const s = SERVICES[l.service];
    const body = `<section class="relative bg-navy-900 text-white overflow-hidden"><div class="absolute inset-0 hero-grid opacity-40" aria-hidden="true"></div>
  <div class="relative max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
    <div><h1 class="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">${esc(l.h1)}</h1><p class="mt-5 text-lg text-slate-300">${esc(l.sub)}</p>
      <ul class="mt-6 space-y-3">${l.bullets.map((x) => `<li class="flex gap-3">${ic('check', 'w-5 h-5 text-gold-500 shrink-0 mt-0.5')}<span>${esc(x)}</span></li>`).join('')}</ul>
      <div class="mt-8 flex flex-wrap gap-3">${btnWA('Hablar por WhatsApp', '', 'landing')}${btnCall(undefined, '', 'landing')}</div>
      <p class="mt-6 text-sm text-slate-400">Más información: <a class="underline" href="${svcUrl(l.service)}">${esc(s.short)}</a></p></div>
    <div class="bg-white rounded-2xl p-6 text-slate-600 border-t-4 border-gold-500" id="formulario"><h2 class="text-xl font-semibold text-navy-900">Cuéntanos tu caso</h2>
      <form id="leadForm" class="mt-4 space-y-3" novalidate>
        <div><label for="f-nombre" class="block text-xs font-semibold uppercase text-navy-900 mb-1">Nombre</label><input id="f-nombre" name="nombre" required autocomplete="name" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900"></div>
        <div><label for="f-tel" class="block text-xs font-semibold uppercase text-navy-900 mb-1">Teléfono</label><input id="f-tel" name="telefono" type="tel" required autocomplete="tel" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900"></div>
        <input type="hidden" name="tipo" value="${esc(s.short)}">
        <label class="flex gap-3 items-start text-xs text-slate-500"><input type="checkbox" name="consent" required class="mt-0.5 w-4 h-4"><span>Autorizo el tratamiento de mis datos según la <a class="underline" href="/tratamiento-de-datos/">autorización de tratamiento de datos</a>.</span></label>
        <button type="submit" class="w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3.5 rounded-lg">Enviar consulta ${ic('arrow')}</button>
        <p id="formMsg" class="text-sm hidden" role="status"></p></form></div>
  </div></section>`;
    render({ url: `/lp/${l.slug}/`, title: `${l.h1} | ${SITE.name}`, desc: l.sub + ' Landing de campaña.', body, noindex: true, minimal: true, canonicalUrl: svcUrl(l.service) });
  }
}

// ---------- Recurso descargable: modelo de derecho de petición ----------
function recursos() {
  const modelo = `[Ciudad], [fecha]

Señores
[NOMBRE DE LA ASEGURADORA]
[Dirección o canal de radicación]

Asunto: Derecho de petición - Siniestro No. [número] - Póliza/SOAT No. [número]

Yo, [nombre completo], identificado(a) con cédula de ciudadanía No. [número], en ejercicio del derecho de petición consagrado en el artículo 23 de la Constitución Política, me permito solicitar lo siguiente:

HECHOS
1. El día [fecha] ocurrió un accidente de tránsito en [lugar], en el que resulté lesionado(a).
2. Presenté reclamación ante ustedes el [fecha], con radicado No. [número].
3. Mediante comunicación del [fecha], la aseguradora [objetó / no respondió] la reclamación, indicando [motivo].

PETICIONES
1. Que se me informe por escrito, de manera clara y completa, los fundamentos de hecho y de derecho de la decisión adoptada.
2. Que se me entregue copia de los documentos y soportes que sirvieron de base para esa decisión.
3. Que se reconsidere la decisión a la luz de los documentos que anexo.
4. Que se me indique el estado actual de mi reclamación y los pasos pendientes.

ANEXOS
- Copia de mi documento de identidad.
- Copia de la reclamación y de la respuesta de la aseguradora.
- Historia clínica, facturas e informe del accidente (IPAT).

NOTIFICACIONES
[Dirección], [correo electrónico], [teléfono].

Atentamente,
[Firma]
[Nombre y cédula]`;
  const body = pageHero({ crumbs: [['Inicio', '/'], ['Recursos', '/recursos/modelo-derecho-de-peticion/'], ['Modelo de derecho de petición', '/recursos/modelo-derecho-de-peticion/']], h1: 'Modelo de derecho de petición a una aseguradora', sub: 'Un punto de partida para pedir por escrito las razones de una objeción o el estado de tu reclamación.', ctas: false }) + `
<div class="max-w-4xl mx-auto px-6 py-14 space-y-10">
  ${answerBox('Un derecho de petición es una solicitud escrita a una entidad para obtener información o una decisión. Este modelo es genérico: adáptalo a tu caso y, si es posible, que un abogado lo revise antes de enviarlo.')}
  <section><h2 class="text-2xl font-semibold text-navy-900 mb-4">Modelo de texto</h2>
    <div class="relative"><button type="button" data-copy="#modelo" class="absolute right-3 top-3 text-xs font-semibold bg-navy-900 text-white px-3 py-1.5 rounded">Copiar</button>
    <pre id="modelo" class="whitespace-pre-wrap bg-white border border-slate-200 rounded-xl p-6 pt-12 text-sm leading-relaxed text-slate-700">${esc(modelo)}</pre></div></section>
  <section><h2 class="text-2xl font-semibold text-navy-900 mb-4">Consejos para enviarlo</h2>${bullets(['Radícalo por un canal que genere constancia (físico con sello o correo certificado).', 'Anexa copias, nunca originales.', 'Conserva el comprobante de radicación.', 'No lo uses para aceptar ofertas ni firmar finiquitos.', 'Verifica los plazos de respuesta aplicables en fuentes oficiales.'])}</section>
  <section><h2 class="text-2xl font-semibold text-navy-900 mb-4">Si no responden o niegan</h2><p class="leading-relaxed">Puedes presentar una queja ante la entidad de supervisión y evaluar con un abogado una reclamación formal. Lee nuestra guía sobre <a class="underline text-navy-900 font-medium" href="/blog/aseguradora-objeta-como-responder/">cómo responder a una objeción</a>.</p></section>
  <section><h2 class="text-2xl font-semibold text-navy-900 mb-4">Fuentes</h2>${sourcesHtml(['superfinanciera', 'senado'])}</section>
  <p class="text-xs text-slate-500">Modelo informativo. No constituye asesoría jurídica ni garantiza resultados.</p></div>` + ctaFinal();
  render({ url: '/recursos/modelo-derecho-de-peticion/', title: 'Modelo de derecho de petición a una aseguradora | Derechos con Dignidad', desc: 'Modelo editable de derecho de petición para pedir a una aseguradora las razones de una objeción o el estado de tu reclamación tras un accidente.', body,
    crumbs: [['Inicio', '/'], ['Recursos', '/recursos/modelo-derecho-de-peticion/'], ['Modelo de derecho de petición', '/recursos/modelo-derecho-de-peticion/']], faq: { pools: ['seguros', 'proceso', 'primeros'], min: 6 } });
}

// ---------- Páginas que solo existen con datos reales ----------
function datosReales() {
  if (SITE.lawyers.length) {
    const slug = (n) => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const crumbs = [['Inicio', '/'], ['Abogados', '/abogados/']];
    render({ url: '/abogados/', title: 'Abogados de accidentes de tránsito | Derechos con Dignidad', desc: 'Conoce a los abogados de Derechos con Dignidad: formación, tarjeta profesional y áreas de práctica en accidentes de tránsito.', crumbs,
      body: pageHero({ crumbs, h1: 'Nuestros abogados', ctas: false }) + `<div class="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-6">${SITE.lawyers.map((l) => `<a href="/abogados/${slug(l.name)}/" class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-gold-500"><p class="font-semibold text-navy-900 text-lg">${esc(l.name)}</p><p class="text-sm">T.P. ${esc(l.tp)}</p></a>`).join('')}</div>` + ctaFinal() });
    for (const l of SITE.lawyers) {
      const u = `/abogados/${slug(l.name)}/`; const c = [...crumbs, [l.name, u]];
      render({ url: u, title: `${l.name} | Abogado de accidentes de tránsito`, desc: `Perfil de ${l.name}, abogado de Derechos con Dignidad. Tarjeta profesional ${l.tp}. ${l.bio || ''}`.slice(0, 170), crumbs: c, og: 'profile',
        schema: [{ '@context': 'https://schema.org', '@type': 'Person', name: l.name, jobTitle: 'Abogado', worksFor: { '@id': SITE.url + '/#organization' }, description: l.bio || undefined }],
        body: pageHero({ crumbs: c, h1: l.name, sub: `Tarjeta profesional ${l.tp}`, ctas: false }) + `<div class="max-w-3xl mx-auto px-6 py-14"><p class="leading-relaxed">${esc(l.bio || '')}</p></div>` + ctaFinal() });
    }
  }
  if (SITE.cases.length) {
    const crumbs = [['Inicio', '/'], ['Casos', '/casos-de-exito/']];
    render({ url: '/casos-de-exito/', title: 'Casos documentados | Derechos con Dignidad', desc: 'Casos reales y autorizados de Derechos con Dignidad en accidentes de tránsito. Cada caso es distinto y los resultados anteriores no garantizan resultados futuros.', crumbs,
      body: pageHero({ crumbs, h1: 'Casos documentados', sub: 'Cada caso es distinto; los resultados anteriores no garantizan resultados futuros.', ctas: false }) + `<div class="max-w-4xl mx-auto px-6 py-14 space-y-5">${SITE.cases.map((c) => `<article class="bg-white border border-slate-200 rounded-2xl p-6"><h2 class="font-semibold text-navy-900 text-xl">${esc(c.title)}</h2><p class="mt-2">${esc(c.summary)}</p></article>`).join('')}</div>` + ctaFinal() });
  }
  if (SITE.testimonials.length) {
    const crumbs = [['Inicio', '/'], ['Testimonios', '/testimonios/']];
    render({ url: '/testimonios/', title: 'Testimonios de clientes | Derechos con Dignidad', desc: 'Testimonios reales y autorizados de clientes de Derechos con Dignidad. Cada experiencia es particular y no garantiza resultados.', crumbs,
      body: pageHero({ crumbs, h1: 'Testimonios', ctas: false }) + `<div class="max-w-4xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-5">${SITE.testimonials.map((t) => `<figure class="bg-white border border-slate-200 rounded-2xl p-6"><blockquote>${esc(t.text)}</blockquote><figcaption class="mt-3 font-semibold text-navy-900">${esc(t.name)}</figcaption></figure>`).join('')}</div>` + ctaFinal() });
  }
}

fs.rmSync(DIST, { recursive: true, force: true });
home(); servicesHub(); Object.keys(SERVICES).forEach(servicePage); otherPages(); blog(); glosario(); landings(); recursos(); municipios(); calculadora(); datosReales();
{
  const quick = [
    ['scale', 'Servicios', 'Todas las situaciones que orientamos', '/servicios/'],
    ['shield', 'SOAT y aseguradoras', 'Qué cubre y qué hacer si no pagan', '/servicios/#soat-aseguradoras'],
    ['file', 'Guías', 'Qué hacer, qué reclamar y qué evitar', '/blog/'],
    ['clock', 'Calculadora', 'Estimación orientativa de perjuicios', '/calculadora-indemnizacion/'],
    ['pin', 'Cobertura', 'Valle de Aburrá y Oriente antioqueño', '/area-metropolitana/'],
    ['phone', 'Contacto', 'Cuéntanos tu caso', '/contacto/'],
  ];
  const body = `<section class="relative bg-navy-900 text-white overflow-hidden"><div class="absolute inset-0 hero-grid opacity-40" aria-hidden="true"></div>
  <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true"></div>
  <div class="relative max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
    <p class="text-7xl md:text-8xl font-semibold tracking-tight text-gold-500" aria-hidden="true">404</p>
    <h1 class="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Esta página no existe o cambió de dirección</h1>
    <p class="mt-4 text-lg text-slate-300">Revisa que el enlace esté bien escrito o usa uno de estos accesos. Si tuviste un accidente, también puedes contactarnos directamente.</p>
    <div class="mt-8 flex flex-wrap gap-3 justify-center"><a href="/" class="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3.5 rounded-lg transition-colors">Volver al inicio</a>${btnCall(undefined, '', '404')}</div>
  </div></section>
  <section class="py-14"><div class="max-w-5xl mx-auto px-6"><h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-6 text-center">Quizás buscabas</h2>
  <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${quick.map(([i, t, x, u]) => `<li><a href="${u}" class="group flex gap-4 items-start bg-white border border-slate-200 hover:border-gold-500 rounded-xl p-5 h-full transition-colors"><span class="w-10 h-10 shrink-0 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center">${ic(i, 'w-5 h-5')}</span><span><span class="block font-semibold text-navy-900 group-hover:text-gold-700">${esc(t)}</span><span class="block text-sm text-slate-500 mt-1">${esc(x)}</span></span></a></li>`).join('')}</ul>
  <p class="mt-8 text-center text-sm text-slate-500">¿Llegaste aquí desde un enlace de nuestro sitio? <a class="underline text-navy-900" href="/contacto/">Avísanos</a> para corregirlo.</p></div></section>`;
  render({ url: '/no-encontrado/', title: 'Página no encontrada | Derechos con Dignidad', desc: 'La página que buscas no existe o fue movida. Vuelve al inicio o consulta los servicios para víctimas de accidentes de tránsito.', body, crumbs: [], noindex: true });
}
tech();
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/_pages.json', JSON.stringify(pageMeta, null, 1));
console.log('Páginas indexables:', pages.length);

