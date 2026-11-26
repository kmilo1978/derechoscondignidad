import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './src/config.mjs';
import { CATEGORIES, AREAS } from './src/areas.mjs';
import { ENTITIES, linkEntities, detectEntities } from './src/entities.mjs';
import { PRIVACIDAD, AUTORIZACION, TERMINOS, COOKIES, LEGAL_FAQ } from './src/legal.mjs';
import { PAGE_SEO, AREA_SEO, HOME_FAQ, areaFaqs } from './src/seo.mjs';

const DIST = 'dist';
const BUILD_V = Date.now().toString(36);
const pageMeta = [];
const pages = [];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const digits = (s) => String(s).replace(/\D/g, '');
const rich = (txt, dark = false) => linkEntities(esc(txt), dark);
const para = (p) => `<p class="leading-relaxed mb-4">${rich(p)}</p>`;

// ---------- Iconos SVG inline (misma línea de diseño, sin emoticones) ----------
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
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  award: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
};
const ic = (n, cls = 'w-5 h-5') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.scale}</svg>`;

// ---------- Logo ----------
const LOGO_CANDIDATES = ['logo.png', 'logo.webp', 'logo.jpg', 'logo.jpeg', 'logo.svg'];
const logoFile = LOGO_CANDIDATES.find((n) => fs.existsSync('src/assets/' + n));
const LOGO = { url: '/assets/' + logoFile, file: 'src/assets/' + logoFile, ext: path.extname(logoFile), w: 182, h: 50 };
const hasOG = fs.existsSync('src/assets/og-default.png');
const logoImg = (cls = 'h-10 w-auto') =>
  `<img src="${LOGO.url}" alt="${esc(SITE.name)}" width="${LOGO.w}" height="${LOGO.h}" class="${cls}" decoding="async">`;

// ---------- Contacto y botones ----------
const hasWA = !!digits(SITE.whatsapp);
const hasPhone = !!digits(SITE.phone);
const waLink = (msg = 'Hola, quisiera recibir orientación jurídica confidencial.') =>
  hasWA ? `https://wa.me/${digits(SITE.whatsapp)}?text=${encodeURIComponent(msg)}` : '/contacto/';
const telLink = hasPhone ? `tel:${SITE.phoneDial || '+' + digits(SITE.phone)}` : '/contacto/';
const pending = (txt) =>
  SITE.production
    ? ''
    : `<p class="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500" data-pendiente>Pendiente de la firma: ${esc(txt)}</p>`;

const goldBtn = 'inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3.5 rounded-lg transition-colors';
const outlineBtn = 'inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-lg transition-colors';

const btnWA = (label = 'Escríbenos por WhatsApp', cls = '', loc = 'cta') =>
  hasWA
    ? `<a href="${waLink()}" data-track="whatsapp" data-loc="${loc}" target="_blank" rel="noopener noreferrer" class="${goldBtn} ${cls}">${ic('chat')}${label}</a>`
    : `<a href="${telLink}" data-track="call" data-loc="${loc}" class="${goldBtn} ${cls}">${ic('phone')}${label === 'WhatsApp' ? 'Llamar' : 'Llamar ahora'}</a>`;

const btnCall = (label = hasPhone ? esc(SITE.phone) : 'Llamar', cls = '', loc = 'cta') =>
  hasWA
    ? `<a href="${telLink}" data-track="call" data-loc="${loc}" class="${outlineBtn} ${cls}">${ic('phone')}${label}</a>`
    : `<a href="/contacto/#formulario" data-track="form" data-loc="${loc}" class="${outlineBtn} ${cls}">${ic('mail')}Solicitar asesoría</a>`;

// ---------- Navegación ----------
const areaUrl = (slug) => `/areas-de-accion/${slug}/`;
const catById = (id) => CATEGORIES.find((c) => c.id === id);

const NAV = [
  {
    label: 'Áreas de acción',
    href: '/areas-de-accion/',
    cats: ['crimenes-estado', 'indemnizaciones-reparacion'],
  },
  {
    label: 'Procesos y demandas',
    href: '/procesos-y-demandas/',
    cats: ['procesos-demandas'],
  },
  { label: 'Nuestro equipo', href: '/nosotros/' },
  { label: 'Casos relevantes', href: '/casos/' },
  { label: 'Contacto', href: '/contacto/' },
];

function header() {
  const desk = NAV.map((n) => {
    if (!n.cats) {
      return `<a href="${n.href}" class="px-2.5 2xl:px-3 py-2 text-[13px] 2xl:text-[14.5px] font-medium rounded-lg hover:bg-white/5 text-white/90 hover:text-gold-500 focus-visible:text-gold-500 transition-colors whitespace-nowrap">${esc(n.label)}</a>`;
    }
    const slugs = n.cats.flatMap((id) => catById(id).items);
    const items = slugs
      .map(
        (slug) =>
          `<a href="${areaUrl(slug)}" class="block px-4 py-2 text-sm text-slate-700 hover:bg-navy-900 hover:text-gold-500 focus-visible:bg-navy-900 focus-visible:text-gold-500 transition-colors">${esc(AREAS[slug].short)}</a>`
      )
      .join('');
    return `<div class="relative group">
      <a href="${n.href}" class="px-2.5 2xl:px-3 py-2 text-[13px] 2xl:text-[14.5px] font-medium rounded-lg hover:bg-white/5 text-white/90 hover:text-gold-500 group-hover:text-gold-500 group-focus-within:text-gold-500 transition-colors inline-flex items-center gap-1 whitespace-nowrap">${esc(n.label)}${ic('down', 'w-4 h-4')}</a>
      <div class="absolute left-0 top-full hidden group-hover:block group-focus-within:block pt-2 w-80 z-50">
        <div class="bg-white rounded-xl shadow-xl border border-slate-200 py-2">
          ${items}
          <a href="${n.href}" class="block px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-900 hover:text-gold-500 transition-colors border-t border-slate-100">Ver todas las líneas</a>
        </div>
      </div>
    </div>`;
  }).join('');

  const mobLink = 'flex items-center justify-between py-3.5 text-base text-white/90 hover:text-gold-500 focus-visible:text-gold-500 transition-colors';
  const mob = NAV.map((n) => {
    if (!n.cats) {
      return `<li class="border-b border-white/10"><a href="${n.href}" class="${mobLink}">${esc(n.label)}</a></li>`;
    }
    const slugs = n.cats.flatMap((id) => catById(id).items);
    const items = slugs
      .map(
        (slug) =>
          `<li><a href="${areaUrl(slug)}" class="block py-2.5 pl-4 text-[15px] text-slate-300 hover:text-gold-500 border-l border-white/10 hover:border-gold-500 transition-colors">${esc(AREAS[slug].short)}</a></li>`
      )
      .join('');
    return `<li class="border-b border-white/10"><details class="group/m"><summary class="${mobLink} cursor-pointer list-none group-open/m:text-gold-500">${esc(n.label)}<span class="transition-transform group-open/m:rotate-180">${ic('down', 'w-5 h-5')}</span></summary><ul class="pb-3 space-y-0.5">${items}<li><a href="${n.href}" class="block py-2.5 pl-4 text-[15px] font-semibold text-gold-500 border-l border-gold-500">Ver sección completa</a></li></ul></details></li>`;
  }).join('');

  return `<header class="sticky top-0 z-40 bg-navy-900/95 backdrop-blur border-b border-white/10">
  <div class="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4 2xl:gap-8">
    <a href="/" class="flex items-center shrink-0" aria-label="${esc(SITE.name)} - Inicio"><span class="bg-white rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center">${logoImg('h-8 sm:h-10 w-auto')}</span></a>
    <nav class="hidden xl:flex flex-1 justify-center items-center gap-1 2xl:gap-2 min-w-0" aria-label="Principal">${desk}</nav>
    <div class="hidden xl:flex items-center gap-3 shrink-0">
      <button type="button" data-open-search class="inline-flex items-center justify-between gap-3 px-3.5 py-2 text-xs 2xl:text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-xl transition-all cursor-pointer w-48 2xl:w-56" aria-label="Buscar en el sitio (Ctrl+K)">
        <span class="flex items-center gap-2 text-slate-300 truncate">${ic('search', 'w-4 h-4 text-gold-500 shrink-0')}<span class="truncate">Buscar en el sitio...</span></span>
        <kbd class="px-1.5 py-0.5 text-[10px] bg-white/10 text-slate-300 rounded border border-white/15 font-mono shrink-0">Ctrl K</kbd>
      </button>
      ${btnWA('WhatsApp', '!py-2.5 !px-5 text-sm', 'header')}
    </div>
    <div class="flex xl:hidden items-center gap-1">
      <button type="button" data-open-search class="text-white w-11 h-11 inline-flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-gold-500 transition-colors cursor-pointer" aria-label="Buscar en el sitio">
        ${ic('search', 'w-6 h-6 text-gold-500')}
      </button>
      <button id="menuBtn" type="button" class="text-white w-11 h-11 -mr-2 inline-flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-gold-500 transition-colors" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileMenu">
        <span data-icon-open>${ic('menu', 'w-7 h-7')}</span><span data-icon-close class="hidden">${ic('x', 'w-7 h-7')}</span>
      </button>
    </div>
  </div>
  <div id="mobileMenu" class="hidden xl:hidden bg-navy-900 border-t border-white/10 px-6 pb-6 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
    <div class="pt-4 pb-2">
      <button type="button" data-open-search class="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-colors text-left cursor-pointer">
        ${ic('search', 'w-4 h-4 text-gold-500')}
        <span>Buscar áreas, procesos, JEP, CIDH...</span>
        <kbd class="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded text-slate-400 font-mono">Ctrl K</kbd>
      </button>
    </div>
    <nav aria-label="Menú móvil"><ul>${mob}</ul></nav>
    <div class="pt-5">${btnWA('Escríbenos por WhatsApp', 'w-full', 'menu')}</div>
  </div>
</header>`;
}

const LEGAL_LINKS = [
  ['Política de privacidad', '/politica-de-privacidad/'],
  ['Tratamiento de datos personales', '/tratamiento-de-datos/'],
  ['Términos de uso', '/terminos-de-uso/'],
  ['Política de cookies', '/politica-de-cookies/'],
];

function footer() {
  const featured = [
    'lideres-sociales-asesinados',
    'ejecuciones-extrajudiciales',
    'desaparicion-forzada',
    'privacion-injusta-libertad',
    'demandas-jep',
    'demandas-cidh',
  ];
  return `<footer class="bg-navy-900 text-slate-300 pt-16 pb-8">
  <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
    <div class="md:col-span-1">
      <a href="/" class="inline-flex bg-white rounded-lg px-3 py-2" aria-label="${esc(SITE.name)} - Inicio">${logoImg('h-10 w-auto')}</a>
      <p class="mt-4 text-sm text-slate-300 leading-relaxed">Defendemos sus derechos con valentía y compromiso. Justicia para las víctimas de crímenes de Estado.</p>
    </div>
    <div>
      <p class="text-white text-xs font-semibold uppercase tracking-widest mb-4">Áreas y procesos</p>
      <ul class="space-y-2 text-sm text-slate-400">
        ${featured.map((s) => `<li><a class="hover:text-gold-500" href="${areaUrl(s)}">${esc(AREAS[s].short)}</a></li>`).join('')}
        <li><a class="hover:text-gold-500 font-medium text-slate-200" href="/areas-de-accion/">Ver todas las áreas</a></li>
      </ul>
    </div>
    <div>
      <p class="text-white text-xs font-semibold uppercase tracking-widest mb-4">Institucional</p>
      <ul class="space-y-2 text-sm text-slate-400">
        <li><a class="hover:text-gold-500" href="/procesos-y-demandas/">Procesos y demandas</a></li>
        <li><a class="hover:text-gold-500" href="/nosotros/">Nuestro equipo</a></li>
        <li><a class="hover:text-gold-500" href="/casos/">Casos relevantes</a></li>
        <li><a class="hover:text-gold-500" href="/contacto/">Contacto y asesoría</a></li>
        <li><a class="hover:text-gold-500" href="/politica-de-privacidad/">Política de privacidad</a></li>
        <li><a class="hover:text-gold-500" href="/tratamiento-de-datos/">Tratamiento de datos</a></li>
      </ul>
    </div>
    <div>
      <p class="text-white text-xs font-semibold uppercase tracking-widest mb-4">Contacto</p>
      <ul class="space-y-3 text-sm text-slate-400">
        <li class="flex gap-2">${ic('pin', 'w-4 h-4 mt-0.5 text-gold-500 shrink-0')}<a href="/contacto/#mapa" class="hover:text-gold-500 underline underline-offset-2">${SITE.address ? esc(SITE.address) : 'Medellín, Antioquia'}</a></li>
        <li class="flex gap-2">${ic('external', 'w-4 h-4 mt-0.5 text-gold-500 shrink-0')}<a href="${esc(SITE.mapUrl)}" target="_blank" rel="noopener noreferrer" class="hover:text-gold-500 underline underline-offset-2">Ver mapa en Google Maps</a></li>
        <li class="flex gap-2">${ic('phone', 'w-4 h-4 mt-0.5 text-gold-500 shrink-0')}<a href="${telLink}" class="hover:text-gold-500" data-track="call" data-loc="footer">${hasPhone ? esc(SITE.phone) : 'Ver página de contacto'}</a></li>
        ${SITE.email ? `<li class="flex gap-2">${ic('mail', 'w-4 h-4 mt-0.5 text-gold-500 shrink-0')}<a href="mailto:${esc(SITE.email)}" class="hover:text-gold-500">${esc(SITE.email)}</a></li>` : ''}
      </ul>
      <div class="mt-5 rounded-xl bg-white/[0.04] border border-white/10 p-4">
        <p class="text-gold-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">${ic('clock', 'w-4 h-4 shrink-0')}Atención 24 Horas</p>
        <p class="mt-2 text-xs text-slate-300 leading-relaxed">Estamos disponibles para usted 24/7. Su primera consulta es completamente gratis y confidencial.</p>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-3">
      <p>© ${new Date().getFullYear()} ${esc(SITE.legalName || SITE.name)}. Todos los derechos reservados.</p>
      <ul class="flex flex-wrap gap-x-5 gap-y-2">${LEGAL_LINKS.map(([t, u]) => `<li><a class="hover:text-gold-500" href="${u}">${esc(t)}</a></li>`).join('')}</ul>
    </div>
  </div>
</footer>
<a href="${hasWA ? waLink() : telLink}" data-track="${hasWA ? 'whatsapp' : 'call'}" data-loc="flotante" ${hasWA ? 'target="_blank" rel="noopener noreferrer"' : ''} class="lg:hidden fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-4 py-3 rounded-full shadow-lg" aria-label="${hasWA ? 'Contactar por WhatsApp' : 'Llamar ahora'}">${ic(hasWA ? 'chat' : 'phone', 'w-6 h-6')}<span class="hidden sm:inline">${hasWA ? 'WhatsApp' : 'Llamar'}</span></a>`;
}

function searchModalHtml() {
  const chips = ['JEP', 'CIDH', 'Líderes sociales', 'Falsos positivos', 'Desaparición forzada', 'Unión Patriótica', 'Reparación'];
  return `<dialog id="searchDialog" aria-labelledby="searchModalTitle" class="fixed inset-0 m-auto p-0 border-0 bg-transparent max-w-2xl w-[calc(100%-2rem)] max-h-[85vh] z-50 text-slate-800 backdrop:bg-navy-950/80 backdrop:backdrop-blur-xs overscroll-contain">
  <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
    <div class="relative flex items-center border-b border-slate-200 px-4 py-3 bg-slate-50/70">
      <span class="text-gold-700 mr-3 shrink-0" aria-hidden="true">${ic('search', 'w-5 h-5')}</span>
      <h2 id="searchModalTitle" class="sr-only">Buscador del sitio</h2>
      <input id="siteSearchInput" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Buscar áreas de acción, JEP, CIDH, desaparición, reparación..." aria-label="Buscar en todo el sitio" class="w-full bg-transparent text-navy-900 placeholder:text-slate-400 text-base md:text-lg focus:outline-none pr-8">
      <button id="searchCloseBtn" type="button" class="text-slate-500 hover:text-navy-900 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer" aria-label="Cerrar buscador">${ic('x', 'w-5 h-5')}</button>
    </div>
    <div id="searchChips" class="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
      <span class="font-medium text-slate-500 mr-1">Sugerencias:</span>
      ${chips.map((c) => `<button type="button" data-search-chip="${esc(c)}" class="px-2.5 py-1 rounded-full bg-white hover:bg-gold-50 hover:text-navy-900 border border-slate-200 hover:border-gold-500 font-medium transition-colors cursor-pointer">${esc(c)}</button>`).join('')}
    </div>
    <div id="searchResults" role="listbox" aria-label="Resultados de búsqueda" class="overflow-y-auto overscroll-contain p-2 space-y-1 flex-1">
      <div id="searchEmptyState" class="py-12 px-6 text-center text-slate-500">
        <p class="text-sm font-medium">Escribe al menos 2 letras o haz clic en una sugerencia.</p>
        <p class="text-xs text-slate-400 mt-1">Busca entre áreas de acción, procesos ante la JEP o CIDH, indemnizaciones y equipo.</p>
      </div>
    </div>
    <div class="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
      <div class="hidden sm:flex items-center gap-3">
        <span><kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd> <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd> navegar</span>
        <span><kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd> abrir</span>
        <span><kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Esc</kbd> cerrar</span>
      </div>
      <div class="flex items-center gap-1.5 ml-auto">
        <span class="text-slate-500">¿Consulta urgente?</span>
        <a href="${hasWA ? waLink() : '/contacto/'}" ${hasWA ? 'target="_blank" rel="noopener noreferrer"' : ''} class="font-medium text-gold-700 hover:underline inline-flex items-center gap-1">${ic('chat', 'w-3.5 h-3.5')}Solicitar asesoría</a>
      </div>
    </div>
  </div>
</dialog>`;
}

// ---------- Migas de pan (Breadcrumbs) ----------
const crumbsBar = (c) => `<nav aria-label="Migas de pan" class="breadcrumb bg-white border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-6 py-3">
    <ol class="text-sm text-slate-600">
      ${c
        .map((x, i) => {
          const isLast = i === c.length - 1;
          if (isLast) {
            return `<li><a href="${x[1]}" aria-current="page" class="font-semibold text-navy-900 no-underline hover:underline underline-offset-2">${esc(x[0])}</a></li>`;
          }
          return `<li><a href="${x[1]}" class="inline-flex items-center gap-1.5 text-slate-600 hover:text-gold-700 hover:underline underline-offset-2">${i === 0 ? ic('home', 'w-4 h-4') : ''}${esc(x[0])}</a></li>`;
        })
        .join('')}
    </ol>
  </div>
</nav>`;

// ---------- Hero & Helpers ----------
function heroBgFor(url) {
  if (url === '/') return '/assets/hero/hero-home.webp';
  if (url.includes('nosotros') || url.includes('equipo')) return '/assets/hero/hero-equipo.webp';
  if (url.includes('contacto')) return '/assets/hero/hero-contacto.webp';
  if (url.includes('privacidad') || url.includes('datos') || url.includes('terminos') || url.includes('cookies')) return '/assets/hero/hero-legal.webp';
  if (url.includes('procesos') || url.includes('jep') || url.includes('cidh') || url.includes('demandas')) return '/assets/hero/hero-penal.webp';
  return '/assets/hero/hero-home.webp';
}

function heroAltFor(url, h1) {
  if (PAGE_SEO[url]?.heroAlt) return PAGE_SEO[url].heroAlt;
  const slug = url.replace(/^\/areas-de-accion\/|\/$/g, '');
  if (AREA_SEO[slug]?.heroAlt) return AREA_SEO[slug].heroAlt;
  return `${h1 || SITE.name} - Defensa jurídica de derechos humanos en Colombia`;
}

const pageHero = ({ url = '', h1, sub, ctas = true }) => {
  const bg = heroBgFor(url);
  const alt = heroAltFor(url, h1);
  return `<section class="relative bg-[#003854] text-white overflow-hidden">
  <div class="absolute inset-0">
    <img src="${bg}" alt="${esc(alt)}" width="1400" height="700" loading="eager" fetchpriority="high" decoding="async" class="w-full h-full object-cover object-center" />
    <div class="absolute inset-0 bg-gradient-to-r from-[#070d1a]/85 via-[#0f172a]/70 to-[#0f172a]/55" aria-hidden="true"></div>
  </div>
  <div class="relative max-w-7xl mx-auto px-6 py-10 sm:py-14 md:py-20">
    <h1 class="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight max-w-4xl leading-tight text-white">${esc(h1)}</h1>
    ${sub ? `<p class="mt-4 sm:mt-5 text-base sm:text-lg text-white max-w-3xl leading-relaxed">${rich(sub, true)}</p>` : ''}
    ${ctas ? `<div class="mt-6 sm:mt-8 flex flex-wrap gap-3">${btnWA('Hablar por WhatsApp', '', 'hero')}${btnCall(undefined, '', 'hero')}</div>` : ''}
  </div>
</section>`;
};

const answerBox = (text) =>
  `<div class="bg-gold-500/10 border-l-4 border-gold-500 rounded-r-xl p-5" data-respuesta><p class="text-xs font-semibold uppercase tracking-wider text-gold-700">Respuesta directa</p><p class="mt-2 text-navy-900 leading-relaxed">${rich(text)}</p></div>`;

const faqHtml = (faqs) =>
  `<div data-faq class="space-y-3">${faqs
    .map(
      ([q, a]) =>
        `<details class="group bg-white border border-slate-200 rounded-xl p-5"><summary class="flex justify-between items-center gap-4 cursor-pointer font-semibold text-navy-900 list-none">${esc(q)}<span class="shrink-0 transition-transform group-open:rotate-180">${ic('down')}</span></summary><p class="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">${rich(a)}</p></details>`
    )
    .join('')}</div>`;

const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

const ctaFinal = (
  title = '¿Necesitas orientación jurídica confidencial?',
  text = 'Cuéntanos tu caso. Nuestro equipo analiza los hechos y te explica las rutas legales disponibles, con trato humano y reserva absoluta.'
) => `<section class="relative bg-navy-900 text-white overflow-hidden">
  <div class="absolute inset-0 cta-diag" aria-hidden="true"></div>
  <div class="relative max-w-3xl mx-auto px-6 py-20 text-center">
    <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">${esc(title)}</h2>
    <p class="mt-4 text-slate-300 text-lg">${esc(text)}</p>
    <div class="mt-8 flex flex-wrap gap-3 justify-center">${btnWA('Hablar por WhatsApp', '', 'cta-final')}${btnCall(undefined, '', 'cta-final')}</div>
  </div>
</section>`;

const h2 = (t) => `<h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-5">${esc(t)}</h2>`;

// ---------- Render base ----------
function render({ url, title, desc, body, crumbs = [], schema = [], noindex = false }) {
  const crumbBar = crumbs.length ? crumbsBar(crumbs) : '';
  const canonical = SITE.url + url;
  pageMeta.push({
    url,
    title,
    desc,
    noindex,
    h1: ((body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim(),
    h2: [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()),
    crumbs: crumbs.map((c) => c[0]),
  });

  const bc = crumbs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c[0],
          item: SITE.url + c[1],
        })),
      }
    : null;

  const org = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': SITE.url + '/#organization',
    name: SITE.legalName || SITE.name,
    url: SITE.url,
    logo: SITE.url + LOGO.url,
    image: SITE.url + (hasOG ? '/assets/og-default.png' : LOGO.url),
    description: 'Firma de abogados especializada en defensa de derechos humanos, crímenes de Estado, procesos ante la JEP y la CIDH y reparación integral en Colombia.',
    areaServed: { '@type': 'Country', name: 'Colombia' },
    knowsLanguage: 'es',
    knowsAbout: [
      'Derechos Humanos',
      'Crímenes de Estado',
      'Jurisdicción Especial para la Paz (JEP)',
      'Comisión Interamericana de Derechos Humanos (CIDH)',
      'Corte Interamericana de Derechos Humanos',
      'Reparación directa',
      'Desaparición forzada',
      'Ejecuciones extrajudiciales',
      'Unión Patriótica',
      'Privación injusta de la libertad',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    ...(hasPhone ? { telephone: SITE.phoneDial || SITE.phone, contactPoint: { '@type': 'ContactPoint', contactType: 'legal orientation', telephone: SITE.phoneDial || SITE.phone, areaServed: 'CO', availableLanguage: 'es' } } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
    ...(SITE.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: SITE.street || SITE.address,
            addressLocality: 'Medellín',
            addressRegion: 'Antioquia',
            addressCountry: 'CO',
          },
        }
      : {}),
    ...(TEAM.length
      ? {
          employee: TEAM.map((m) => ({
            '@type': 'Person',
            name: m.name,
            jobTitle: m.role,
          })),
        }
      : {}),
  };

  const ld = [org, bc, ...schema]
    .filter(Boolean)
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n');

  const heroMatch = body.match(/<img\s+[^>]*src="(\/assets\/hero\/[^"]+)"[^>]*alt="([^"]*)"/);
  const preloadHero = heroMatch ? `<link rel="preload" as="image" href="${heroMatch[1]}" fetchpriority="high">` : '';

  const html = `<!DOCTYPE html>
<html lang="es-CO" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta property="og:type" content="website"><meta property="og:locale" content="es_CO"><meta property="og:site_name" content="${esc(SITE.name)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
${hasOG ? `<meta property="og:image" content="${SITE.url}/assets/og-default.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(SITE.name)} - Defensa de víctimas del Estado">` : ''}
<meta name="twitter:card" content="${hasOG ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">${hasOG ? `<meta name="twitter:image" content="${SITE.url}/assets/og-default.png">` : ''}
<meta name="theme-color" content="#0f172a">
<link rel="icon" href="/assets/favicon.ico" sizes="any">
<link rel="icon" href="/assets/favicon.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/assets/site.webmanifest">
${preloadHero}
<link rel="preload" as="style" href="/assets/style.css?v=${BUILD_V}">
<link rel="stylesheet" href="/assets/style.css?v=${BUILD_V}">
${ld}
</head>
<body class="bg-slate-50 text-slate-600 font-sans antialiased selection:bg-gold-500 selection:text-white">
<div id="readProgress" class="fixed top-0 left-0 h-1 bg-gold-500 z-[60] w-0" aria-hidden="true"></div>
<a href="#contenido" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-navy-900 focus:px-4 focus:py-2 focus:rounded">Saltar al contenido</a>
${header()}
<main id="contenido">
${crumbBar}${body}
</main>
${footer()}
<button id="toTop" type="button" aria-label="Volver arriba" class="fixed bottom-20 right-5 z-40 w-11 h-11 rounded-full bg-navy-900 text-white shadow-lg flex items-center justify-center opacity-0 pointer-events-none transition-opacity">${ic('down', 'w-5 h-5 rotate-180')}</button>
${searchModalHtml()}
<script src="/assets/app.js?v=${BUILD_V}" defer></script>
</body>
</html>
`;

  const out = path.join(DIST, url === '/' ? '' : url, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (!noindex) {
    pages.push({
      url,
      heroImg: heroMatch ? heroMatch[1] : null,
      heroAlt: heroMatch ? heroMatch[2] : null,
    });
  }
}

// ---------- Equipo y Casos ----------
const TEAM = SITE.team || [];
const teamPhoto = (m) => (m.photo && fs.existsSync(`src/assets/team/${m.photo}.webp`) ? `/assets/team/${m.photo}.webp` : '');
const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const teamHtml = () => `<section id="equipo" class="scroll-mt-28 bg-navy-900 text-white rounded-3xl px-5 py-10 md:p-10" aria-labelledby="h-equipo">
  <h2 id="h-equipo" class="text-2xl md:text-3xl font-semibold tracking-tight">Nuestro equipo</h2>
  <p class="mt-2 text-slate-300 leading-relaxed max-w-3xl">${esc(SITE.teamIntro || '')}</p>
  <ul class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    ${TEAM.map((m) => {
      const ph = teamPhoto(m);
      return `<li class="group bg-white/[0.04] border border-white/10 hover:border-gold-500/60 rounded-2xl px-4 py-6 text-center transition-colors flex flex-col items-center">
        ${ph ? `<img src="${ph}" alt="Foto de ${esc(m.name)}" width="112" height="112" loading="lazy" decoding="async" class="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/15 group-hover:ring-gold-500 transition">` : `<span class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 ring-2 ring-white/15 flex items-center justify-center text-2xl font-semibold text-gold-500" aria-hidden="true">${initials(m.name)}</span>`}
        <p class="mt-4 font-semibold leading-snug text-white">${esc(m.name)}</p>
        <p class="mt-1 text-sm text-gold-500 leading-snug">${esc(m.role)}</p>
        ${m.bio ? `<p class="mt-2 text-xs text-slate-300 leading-relaxed">${esc(m.bio)}</p>` : ''}
        ${m.linkedin ? `<a href="${esc(m.linkedin)}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1 text-xs text-slate-300 hover:text-gold-500 underline underline-offset-2">LinkedIn ${ic('external', 'w-3.5 h-3.5')}</a>` : ''}
      </li>`;
    }).join('')}
  </ul>
</section>`;

const casesBlock = () =>
  SITE.cases && SITE.cases.length
    ? `<div class="space-y-6 md:space-y-8">${SITE.cases
        .slice(0, 5)
        .map(
          (c, idx) => `<article id="${esc(c.slug)}" class="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 md:p-8 shadow-xs">
            <div class="flex flex-wrap items-start justify-between gap-4 pb-4 sm:pb-5 border-b border-slate-100">
              <div class="space-y-2 max-w-4xl min-w-0">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-navy-900 text-gold-500 text-xs font-semibold shrink-0">0${idx + 1}</span>
                  ${c.type ? `<span class="text-xs font-semibold uppercase tracking-wider text-gold-700">${esc(c.type)}</span>` : ''}
                </div>
                <h3 class="text-xl sm:text-2xl md:text-3xl font-semibold text-navy-900 leading-snug">${esc(c.title)}</h3>
                ${c.instance ? `<p class="text-sm font-medium text-slate-600">Instancia: ${rich(c.instance)}</p>` : ''}
              </div>
            </div>
            <div class="pt-5 sm:pt-6 grid lg:grid-cols-[1.35fr_0.65fr] gap-6 lg:gap-8 items-start">
              <div class="space-y-4">
                ${c.context ? `<div><p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Contexto del proceso</p><p class="text-base text-slate-600 leading-relaxed">${rich(c.context)}</p></div>` : ''}
                ${c.work ? `<div><p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Rol de Derechos con Dignidad</p><p class="text-base text-slate-600 leading-relaxed">${rich(c.work)}</p></div>` : ''}
              </div>
              <div class="space-y-5">
                ${c.result ? `<div class="bg-slate-50 border-l-4 border-gold-500 rounded-r-xl p-4"><p class="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1">Resultado y estado</p><p class="text-sm text-navy-900 leading-relaxed font-medium">${rich(c.result)}</p></div>` : ''}
                ${
                  c.sources && c.sources.length
                    ? `<div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2.5">Fuentes y documentos oficiales</p>
                        <ul class="space-y-2 text-xs">
                          ${c.sources
                            .map(
                              ([label, url]) =>
                                `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-navy-900 hover:text-gold-700 underline decoration-gold-600/60 underline-offset-2 font-medium">${esc(label)} ${ic('external', 'w-3.5 h-3.5 shrink-0')}</a></li>`
                            )
                            .join('')}
                        </ul>
                      </div>`
                    : ''
                }
              </div>
            </div>
          </article>`
        )
        .join('')}</div>`
    : pending('casos relevantes documentados y autorizados (máximo 5 casos), respetando la confidencialidad de las personas involucradas.');

const casesTeaser = () =>
  SITE.cases && SITE.cases.length
    ? `<div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div class="space-y-4 max-w-3xl">
          <p class="text-slate-600 leading-relaxed">${rich('Nuestra trayectoria incluye representación judicial de víctimas y litigio de interés público ante instancias nacionales e internacionales, como la Corte Interamericana de Derechos Humanos y la Jurisdicción Especial para la Paz (JEP).')}</p>
          <ul class="space-y-2 text-sm">
            ${SITE.cases
              .slice(0, 5)
              .map(
                (c) => `<li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-gold-500 mt-2 shrink-0" aria-hidden="true"></span><a href="/casos/#${esc(c.slug)}" class="text-navy-900 hover:text-gold-700 font-medium underline decoration-slate-300 underline-offset-2">${esc(c.title)}</a></li>`
              )
              .join('')}
          </ul>
        </div>
        <div class="shrink-0">
          <a href="/casos/" class="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors">Explorar casos relevantes ${ic('arrow', 'w-4 h-4')}</a>
        </div>
      </div>`
    : pending('casos relevantes documentados y autorizados.');

// ---------- Bloque de estamentos externos ----------
function entitiesSection(list, title = 'Estamentos y organismos de referencia') {
  if (!list.length) return '';
  return `<section id="estamentos" class="scroll-mt-28 bg-slate-100 border border-slate-200 rounded-2xl p-6" aria-labelledby="h-estamentos">
    <h2 id="h-estamentos" class="text-xl font-semibold text-navy-900 tracking-tight">${esc(title)}</h2>
    <p class="mt-1 text-sm text-slate-600">Enlaces externos a portales oficiales de los estamentos del Estado y organismos internacionales mencionados:</p>
    <ul class="mt-4 grid sm:grid-cols-2 gap-3">
      ${list
        .map(
          (e) => `<li>
            <a href="${e.url}" target="_blank" rel="noopener noreferrer" class="group flex items-start justify-between gap-3 bg-white border border-slate-200 hover:border-gold-500 rounded-xl p-4 h-full transition-colors">
              <span>
                <span class="block font-semibold text-navy-900 group-hover:text-gold-700 text-sm">${esc(e.name)}</span>
                <span class="block text-xs text-slate-600 mt-1 leading-relaxed">${esc(e.desc)}</span>
              </span>
              <span class="text-gold-700 shrink-0 mt-0.5">${ic('external', 'w-4 h-4')}</span>
            </a>
          </li>`
        )
        .join('')}
    </ul>
  </section>`;
}

// ---------- Formulario de contacto ----------
function leadSelectOpts() {
  return Object.values(AREAS).map((a) => `<option value="${esc(a.short)}">${esc(a.short)}</option>`).join('') + '<option value="Otro caso">Otro caso</option>';
}

function contactFormHtml() {
  return `<div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8" id="formulario">
  <h2 class="text-2xl font-semibold text-navy-900 tracking-tight">Solicita una orientación jurídica confidencial</h2>
  <p class="mt-1 text-sm text-slate-600">Tu consulta inicial es gratuita y reservada. Los campos con <span class="text-red-600" aria-hidden="true">*</span> son obligatorios.</p>
  <form data-lead data-loc="contacto" class="mt-6 space-y-5" novalidate>
    <div class="grid sm:grid-cols-2 gap-4">
      <div><label for="k-nombre" class="block text-sm font-semibold text-navy-900 mb-1.5">Nombre completo <span class="text-red-600" aria-hidden="true">*</span></label><input id="k-nombre" name="nombre" required autocomplete="name" placeholder="Tu nombre" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></div>
      <div><label for="k-tel" class="block text-sm font-semibold text-navy-900 mb-1.5">Teléfono o WhatsApp <span class="text-red-600" aria-hidden="true">*</span></label><input id="k-tel" name="telefono" type="tel" required autocomplete="tel" placeholder="300 000 0000" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></div>
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      <div><label for="k-correo" class="block text-sm font-semibold text-navy-900 mb-1.5">Correo electrónico (opcional)</label><input id="k-correo" name="correo" type="email" autocomplete="email" placeholder="tu@correo.com" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></div>
      <div><label for="k-area" class="block text-sm font-semibold text-navy-900 mb-1.5">Área o tipo de proceso</label><select id="k-area" name="tipo" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"><option value="">Selecciona una opción...</option>${leadSelectOpts()}</select></div>
    </div>
    <div><label for="k-desc" class="block text-sm font-semibold text-navy-900 mb-1.5">Breve descripción de los hechos</label><textarea id="k-desc" name="descripcion" rows="4" placeholder="Cuéntanos qué ocurrió, en qué lugar y qué acompañamiento necesitas." class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></textarea></div>
    <label class="flex gap-3 items-start text-xs text-slate-600"><input type="checkbox" name="consent" required class="mt-0.5 w-4 h-4 accent-yellow-600"><span>Autorizo el tratamiento de mis datos personales para recibir orientación jurídica, según la <a class="underline text-navy-900" href="/tratamiento-de-datos/">política de tratamiento de datos personales</a> y la <a class="underline text-navy-900" href="/politica-de-privacidad/">política de privacidad</a>.</span></label>
    <input type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">
    <button type="submit" class="w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-4 rounded-lg transition-colors">Enviar solicitud confidencial ${ic('arrow')}</button>
    <p role="status" class="text-sm" aria-live="polite"></p>
  </form>
  <div data-success class="hidden">
    <div class="flex items-center gap-3 text-green-700"><span class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">${ic('check')}</span><h3 class="text-xl font-semibold text-navy-900">Resumen de tu solicitud</h3></div>
    <p class="mt-3 text-sm text-slate-600">Revisa el resumen. ${hasWA ? 'Puedes enviarlo directamente por WhatsApp.' : 'Puedes copiar este resumen mientras se configura el canal directo de WhatsApp.'}</p>
    <pre data-summary class="mt-4 whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700"></pre>
    <div class="mt-5 flex flex-wrap gap-3"><a data-wa-link target="_blank" rel="noopener noreferrer" class="hidden inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-5 py-3 rounded-lg">${ic('chat')}Enviar por WhatsApp</a><button type="button" data-copy-summary class="border border-slate-300 px-5 py-3 rounded-lg font-medium text-navy-900">Copiar resumen</button><button type="button" data-again class="px-5 py-3 text-sm underline text-navy-900">Enviar otra consulta</button></div>
  </div>
</div>`;
}

// ---------- HOME ----------
function home() {
  const crimenes = catById('crimenes-estado');
  const procesos = catById('procesos-demandas');
  const indem = catById('indemnizaciones-reparacion');

  const body = `
<section class="relative bg-[#003854] text-white overflow-hidden">
  <div class="absolute inset-0">
    <img src="/assets/hero/hero-home.webp" alt="${esc(PAGE_SEO['/'].heroAlt)}" width="1400" height="700" loading="eager" fetchpriority="high" decoding="async" class="w-full h-full object-cover object-center" />
    <div class="absolute inset-0 bg-gradient-to-r from-[#070d1a]/88 via-[#0f172a]/75 to-[#0f172a]/60" aria-hidden="true"></div>
  </div>
  <div class="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 md:py-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
    <div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-white">Defendemos a Víctimas del Estado y Luchamos por su Reparación Integral</h1>
      <p class="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white leading-relaxed max-w-2xl">${rich('Especialistas en Derechos Humanos, CIDH, JEP y crímenes de lesa humanidad.', true)}</p>
      <div class="mt-9 flex flex-wrap gap-3">${btnWA('Hablar por WhatsApp', '', 'hero')}<a href="#areas" class="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-lg transition-colors">Explorar áreas de acción ${ic('down')}</a></div>
      <ul class="mt-12 pt-8 border-t border-white/10 grid sm:grid-cols-2 gap-6 text-sm">
        <li class="flex gap-3">${ic('gavel', 'w-5 h-5 text-gold-500 shrink-0')}<span><strong class="block text-white">Defensa Experta</strong>Abogados especializados en litigio contra el Estado.</span></li>
        <li class="flex gap-3">${ic('users', 'w-5 h-5 text-gold-500 shrink-0')}<span><strong class="block text-white">Atención Humana</strong>Acompañamiento empático y personalizado en cada paso.</span></li>
        <li class="flex gap-3">${ic('shield', 'w-5 h-5 text-gold-500 shrink-0')}<span><strong class="block text-white">Consulta Sin Costo</strong>Evaluamos su caso de forma gratuita y confidencial.</span></li>
        <li class="flex gap-3">${ic('clock', 'w-5 h-5 text-gold-500 shrink-0')}<span><strong class="block text-white">Disponibilidad 24/7</strong>Estamos a su lado cuando más nos necesita.</span></li>
      </ul>
    </div>
    <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-t-4 border-gold-500 text-slate-600" id="formulario">
      <h2 class="text-2xl font-semibold text-navy-900 tracking-tight">Evaluación confidencial de tu caso</h2>
      <p class="text-sm text-slate-600 mt-1">Primera consulta gratuita y privada. Un abogado especialista revisará tu situación.</p>
      <form id="leadForm" class="mt-6 space-y-4" novalidate>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label for="f-nombre" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">Nombre</label><input id="f-nombre" name="nombre" required autocomplete="name" placeholder="Tu nombre" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></div>
          <div><label for="f-tel" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">Teléfono</label><input id="f-tel" name="telefono" required type="tel" autocomplete="tel" placeholder="300 000 0000" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></div>
        </div>
        <div><label for="f-tipo" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">Área o proceso</label><select id="f-tipo" name="tipo" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"><option value="">Selecciona una opción...</option>${leadSelectOpts()}</select></div>
        <div><label for="f-desc" class="block text-xs font-semibold uppercase tracking-wide text-navy-900 mb-1.5">Breve descripción</label><textarea id="f-desc" name="descripcion" rows="3" placeholder="¿Qué ocurrió y en qué podemos orientarte?" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"></textarea></div>
        <label class="flex gap-3 items-start text-xs text-slate-600"><input type="checkbox" name="consent" required class="mt-0.5 w-4 h-4 accent-yellow-600"><span>Autorizo el tratamiento de mis datos personales según la <a class="underline text-navy-900" href="/tratamiento-de-datos/">política de tratamiento de datos</a> y la <a class="underline text-navy-900" href="/politica-de-privacidad/">política de privacidad</a>.</span></label>
        <button type="submit" class="w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-4 rounded-lg transition-colors">Enviar consulta ${ic('arrow')}</button>
        <p id="formMsg" class="text-sm hidden" role="status"></p>
      </form>
    </div>
  </div>
</section>

<section class="py-12 md:py-16 bg-white border-b border-slate-200" id="quienes-somos">
  <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center">
    <div>
      <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">${rich('Especialistas en Derechos Humanos, CIDH, JEP y crímenes de lesa humanidad.')}</p>
      <h2 class="mt-2 text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">Has venido al lugar correcto</h2>
      <p class="mt-4 leading-relaxed text-slate-600">Representamos los intereses de cientos de personas y familias que han sufrido daños por el actuar del Estado colombiano.</p>
      <p class="mt-3 leading-relaxed text-slate-600">${rich('Actuamos ante la Corte Interamericana de Derechos Humanos, el Consejo de Estado, Corte Constitucional, tribunales y juzgados de la jurisdicción contencioso administrativa y como representantes de víctimas ante la Fiscalía General de la Nación y jueces penales.')}</p>
      <p class="mt-3 leading-relaxed text-slate-600">Desde nuestra sede principal en Medellín, adelantamos procesos en todo el país y ante instancias internacionales.</p>
      <div class="mt-6">
        <a href="/nosotros/" class="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-gold-500 text-navy-900 font-semibold px-5 py-3 rounded-lg transition-colors">Conocer al equipo ${ic('arrow', 'w-4 h-4')}</a>
      </div>
    </div>
    <div class="grid gap-4">
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-4">
        <span class="w-11 h-11 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">${ic('shield', 'w-6 h-6')}</span>
        <div>
          <p class="font-semibold text-navy-900 text-lg">Años de experiencia certificados.</p>
          <p class="mt-1 text-sm text-slate-600">Trayectoria comprobada en litigio contra el Estado y defensa de los derechos humanos.</p>
        </div>
      </div>
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-4">
        <span class="w-11 h-11 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">${ic('check', 'w-6 h-6')}</span>
        <div>
          <p class="font-semibold text-navy-900 text-lg">Casos ganados exitosos durante nuestro trayecto.</p>
          <p class="mt-1 text-sm text-slate-600">Representación comprometida ante tribunales nacionales e internacionales.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="areas" class="py-12 md:py-20 bg-slate-50 scroll-mt-24">
  <div class="max-w-7xl mx-auto px-6 space-y-16">
    <div class="max-w-3xl">
      <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Especialidades jurídicas</p>
      <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight mt-2">Áreas de acción, procesos y demandas</h2>
      <p class="mt-3 text-slate-600 leading-relaxed">Selecciona el área o tipo de proceso para conocer a quiénes representamos, qué acciones jurídicas adelantamos y los estamentos competentes.</p>
    </div>

    <div>
      <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <span class="w-11 h-11 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">${ic(crimenes.icon, 'w-6 h-6')}</span>
          <div>
            <h3 class="text-2xl font-semibold text-navy-900">${esc(crimenes.title)}</h3>
            <p class="text-sm text-slate-600">${esc(crimenes.desc)}</p>
          </div>
        </div>
        <a href="/areas-de-accion/" class="text-sm font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-1">Ver resumen de áreas ${ic('arrow', 'w-4 h-4')}</a>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${crimenes.items
          .map((slug) => {
            const a = AREAS[slug];
            return `<a href="${areaUrl(slug)}" class="group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all flex flex-col justify-between">
              <div>
                <span class="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-navy-900 group-hover:bg-gold-500 transition-colors">${ic(a.icon, 'w-5 h-5')}</span>
                <h4 class="mt-4 text-lg font-semibold text-navy-900">${esc(a.short)}</h4>
                <p class="mt-2 text-sm text-slate-600 leading-relaxed">${esc(a.sub)}</p>
              </div>
              <span class="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900 group-hover:text-gold-700">Ver información completa ${ic('arrow', 'w-4 h-4')}</span>
            </a>`;
          })
          .join('')}
      </div>
    </div>

    <div>
      <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <span class="w-11 h-11 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">${ic(procesos.icon, 'w-6 h-6')}</span>
          <div>
            <h3 class="text-2xl font-semibold text-navy-900">${esc(procesos.title)}</h3>
            <p class="text-sm text-slate-600">${rich(procesos.desc)}</p>
          </div>
        </div>
        <a href="/procesos-y-demandas/" class="text-sm font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-1">Ver procesos y demandas ${ic('arrow', 'w-4 h-4')}</a>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        ${procesos.items
          .map((slug) => {
            const a = AREAS[slug];
            return `<a href="${areaUrl(slug)}" class="group bg-white border border-slate-200 hover:border-gold-500 rounded-xl p-5 transition-colors flex items-start justify-between gap-4">
              <div>
                <h4 class="font-semibold text-navy-900 group-hover:text-gold-700">${esc(a.title)}</h4>
                <p class="mt-1.5 text-sm text-slate-600 leading-relaxed">${esc(a.sub)}</p>
              </div>
              <span class="text-gold-700 shrink-0 mt-1">${ic('arrow', 'w-4 h-4')}</span>
            </a>`;
          })
          .join('')}
      </div>
    </div>

    <div>
      <div class="bg-navy-900 text-white rounded-3xl p-8 md:p-10 grid lg:grid-cols-[1.2fr_auto] gap-8 items-center">
        <div>
          <p class="text-gold-500 text-xs font-semibold uppercase tracking-[0.2em]">${esc(indem.title)}</p>
          <h3 class="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">${esc(AREAS['indemnizaciones-victimas-estado'].title)}</h3>
          <p class="mt-3 text-slate-300 leading-relaxed max-w-2xl">${esc(AREAS['indemnizaciones-victimas-estado'].sub)}</p>
        </div>
        <a href="${areaUrl('indemnizaciones-victimas-estado')}" class="${goldBtn} shrink-0">Conocer cómo gestionamos tu reparación ${ic('arrow', 'w-4 h-4')}</a>
      </div>
    </div>
  </div>
</section>

<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    ${teamHtml()}
    <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
      ${pending('perfiles detallados, tarjeta profesional y enlaces de LinkedIn de cada integrante del equipo.')}
      <a href="/nosotros/" class="text-sm font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-1">Ver página del equipo ${ic('arrow', 'w-4 h-4')}</a>
    </div>
  </div>
</section>

<section class="py-16 bg-slate-50 border-y border-slate-200" id="casos">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Experiencia jurídica</p>
        <h2 class="text-3xl font-semibold text-navy-900 tracking-tight mt-2">Casos relevantes</h2>
      </div>
      <a href="/casos/" class="text-sm font-semibold text-navy-900 hover:text-gold-700 inline-flex items-center gap-1">Ver sección de casos ${ic('arrow', 'w-4 h-4')}</a>
    </div>
    ${casesTeaser()}
  </div>
</section>

<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    ${entitiesSection(ENTITIES.filter((e) => ['jep', 'cidh', 'corte-idh', 'consejo-estado', 'corte-constitucional', 'fiscalia'].includes(e.id)), 'Estamentos del Estado y organismos internacionales')}
  </div>
</section>

<section class="py-12 md:py-16 bg-slate-50 border-t border-slate-200" id="preguntas-frecuentes">
  <div class="max-w-4xl mx-auto px-6">
    <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Orientación inicial</p>
    <h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mt-2 mb-6">Preguntas frecuentes</h2>
    ${faqHtml(HOME_FAQ)}
  </div>
</section>

<section class="py-16 md:py-20 bg-white" id="contacto-home">
  <div class="max-w-5xl mx-auto px-6 text-center">
    <h2 class="text-3xl md:text-4xl font-semibold text-navy-900 tracking-tight">Contacto y solicitud de asesoría</h2>
    <p class="mt-3 text-slate-600 max-w-2xl mx-auto">Atención confidencial y gratuita para víctimas y familiares en todo el país, con sede en Medellín.</p>
    <div class="mt-8 grid sm:grid-cols-3 gap-6 text-left">
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('chat', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">WhatsApp</p><p class="text-sm mt-1 text-slate-600">${hasWA ? esc(SITE.whatsapp) : 'Número por confirmar'}</p></div>
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('phone', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Teléfono</p><p class="text-sm mt-1 text-slate-600">${hasPhone ? esc(SITE.phone) : 'Número por confirmar'}</p></div>
      <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('pin', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Oficina y horario</p><p class="text-sm mt-1 text-slate-600">${esc(SITE.address)} · ${esc(SITE.hours)}</p></div>
    </div>
    <p class="mt-8"><a href="/contacto/" class="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors">Ir a contacto y formulario ${ic('arrow', 'w-4 h-4')}</a></p>
  </div>
</section>
${ctaFinal()}`;

  render({
    url: '/',
    title: PAGE_SEO['/'].title,
    desc: PAGE_SEO['/'].desc,
    body,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': SITE.url + '/#website',
        name: SITE.name,
        url: SITE.url,
        inLanguage: 'es-CO',
      },
      faqSchema(HOME_FAQ),
    ],
  });
}

// ---------- PÁGINA ÍNDICE DE ÁREAS DE ACCIÓN ----------
function areasIndex() {
  const crumbs = [['Inicio', '/'], ['Áreas de acción', '/areas-de-accion/']];
  const body =
    pageHero({
      url: '/areas-de-accion/',
      h1: 'Áreas de acción e indemnizaciones',
      sub: 'Representación legal para víctimas de crímenes de Estado, violaciones de derechos humanos y reparación integral en Colombia.',
    }) +
    `<section class="py-16"><div class="max-w-7xl mx-auto px-6 space-y-14">
      ${CATEGORIES.map(
        (cat) => `<div id="${cat.id}" class="scroll-mt-28">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-11 h-11 bg-navy-900 text-gold-500 rounded-lg flex items-center justify-center shrink-0">${ic(cat.icon, 'w-6 h-6')}</span>
            <div><h2 class="text-2xl md:text-3xl font-semibold text-navy-900">${esc(cat.title)}</h2><p class="text-sm text-slate-600">${rich(cat.desc)}</p></div>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${cat.items
              .map((slug) => {
                const a = AREAS[slug];
                return `<a href="${areaUrl(slug)}" class="group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all flex flex-col justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-navy-900 group-hover:text-gold-700">${esc(a.title)}</h3>
                    <p class="mt-2 text-sm text-slate-600 leading-relaxed">${esc(a.sub)}</p>
                  </div>
                  <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900">Ver detalle ${ic('arrow', 'w-4 h-4')}</span>
                </a>`;
              })
              .join('')}
          </div>
        </div>`
      ).join('')}
    </div></section>` +
    ctaFinal();

  render({
    url: '/areas-de-accion/',
    title: PAGE_SEO['/areas-de-accion/'].title,
    desc: PAGE_SEO['/areas-de-accion/'].desc,
    body,
    crumbs,
  });
}

// ---------- PÁGINA ÍNDICE DE PROCESOS Y DEMANDAS ----------
function procesosIndex() {
  const cat = catById('procesos-demandas');
  const crumbs = [['Inicio', '/'], ['Procesos y demandas', '/procesos-y-demandas/']];
  const body =
    pageHero({
      url: '/procesos-y-demandas/',
      h1: 'Procesos y demandas contra el Estado',
      sub: 'Representación ante la JEP, el Consejo de Estado, la CIDH y la Corte Interamericana de Derechos Humanos.',
    }) +
    `<section class="py-16"><div class="max-w-7xl mx-auto px-6 space-y-10">
      <div class="grid md:grid-cols-2 gap-6">
        ${cat.items
          .map((slug) => {
            const a = AREAS[slug];
            return `<a href="${areaUrl(slug)}" class="group bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all flex flex-col justify-between">
              <div>
                <span class="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-navy-900 group-hover:bg-gold-500 flex items-center justify-center transition-colors">${ic(a.icon, 'w-5 h-5')}</span>
                <h2 class="mt-4 text-xl font-semibold text-navy-900 group-hover:text-gold-700">${esc(a.title)}</h2>
                <p class="mt-2 text-sm text-slate-600 leading-relaxed">${esc(a.sub)}</p>
              </div>
              <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900">Ver proceso ${ic('arrow', 'w-4 h-4')}</span>
            </a>`;
          })
          .join('')}
      </div>
      ${entitiesSection(ENTITIES.filter((e) => ['jep', 'cidh', 'corte-idh', 'oea', 'consejo-estado', 'fiscalia', 'onu'].includes(e.id)))}
    </div></section>` +
    ctaFinal();

  render({
    url: '/procesos-y-demandas/',
    title: PAGE_SEO['/procesos-y-demandas/'].title,
    desc: PAGE_SEO['/procesos-y-demandas/'].desc,
    body,
    crumbs,
  });
}

// ---------- PÁGINA INDIVIDUAL DE CADA ÁREA / PROCESO ----------
function areaPage(slug) {
  const a = AREAS[slug];
  const cat = catById(a.cat);
  const parentCrumb =
    a.cat === 'procesos-demandas'
      ? ['Procesos y demandas', '/procesos-y-demandas/']
      : ['Áreas de acción', '/areas-de-accion/'];
  const crumbs = [['Inicio', '/'], parentCrumb, [a.short, areaUrl(slug)]];

  const allText = [
    a.title,
    a.sub,
    ...(a.intro || []),
    ...(a.listItems || []),
    ...(a.services || []).flat(),
    ...(a.extraListItems || []),
    ...(a.closingText || []),
  ].join(' ');
  const linkedEntities = detectEntities(allText);

  const seo = AREA_SEO[slug] || {};
  const faqs = areaFaqs(slug, a);

  const toc = [
    ...(seo.answer ? [['respuesta', 'Respuesta directa']] : []),
    ['contexto', 'Contexto del caso'],
    ...(a.listTitle ? [['quienes', a.listTitle]] : []),
    ['servicios', a.servicesTitle],
    ...(a.extraListTitle ? [['casos-frecuentes', a.extraListTitle]] : []),
    ...(a.closingTitle ? [['cierre', a.closingTitle]] : []),
    ['faq', 'Preguntas frecuentes'],
    ...(linkedEntities.length ? [['estamentos', 'Estamentos externos']] : []),
  ];

  const related = cat.items.filter((s) => s !== slug).slice(0, 4);

  const body =
    pageHero({ url: areaUrl(slug), h1: a.title, sub: a.sub }) +
    `<div class="max-w-7xl mx-auto px-6 py-12 md:py-14 grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12">
      <article class="space-y-12 min-w-0">
        ${seo.answer ? `<div id="respuesta" class="scroll-mt-28">${answerBox(seo.answer)}</div>` : ''}
        <section id="contexto" class="scroll-mt-28">
          <h2 class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-4">Contexto jurídico y humanitario</h2>
          ${a.intro.map(para).join('')}
        </section>

        ${
          a.listTitle
            ? `<section id="quienes" class="scroll-mt-28">
                <h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-4">${esc(a.listTitle)}</h2>
                <ul class="space-y-3">
                  ${a.listItems.map((item) => `<li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-gold-500 mt-2.5 shrink-0" aria-hidden="true"></span><span>${rich(item)}</span></li>`).join('')}
                </ul>
                ${a.listFootnote ? `<p class="mt-4 bg-gold-500/10 border-l-4 border-gold-500 rounded-r-xl p-4 text-sm text-navy-900">${rich(a.listFootnote)}</p>` : ''}
              </section>`
            : ''
        }

        <section id="servicios" class="scroll-mt-28">
          <h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-5">${esc(a.servicesTitle)}</h2>
          <div class="grid sm:grid-cols-2 gap-5">
            ${a.services
              .map(
                ([t, d]) => `<div class="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 class="font-semibold text-navy-900 text-lg">${rich(t)}</h3>
                  <p class="mt-2 text-sm text-slate-600 leading-relaxed">${rich(d)}</p>
                </div>`
              )
              .join('')}
          </div>
        </section>

        ${
          a.extraListTitle
            ? `<section id="casos-frecuentes" class="scroll-mt-28">
                <h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-4">${esc(a.extraListTitle)}</h2>
                <ul class="space-y-3">
                  ${a.extraListItems.map((item) => `<li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-gold-500 mt-2.5 shrink-0" aria-hidden="true"></span><span>${rich(item)}</span></li>`).join('')}
                </ul>
              </section>`
            : ''
        }

        ${
          a.closingTitle
            ? `<section id="cierre" class="scroll-mt-28">
                <h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-4">${esc(a.closingTitle)}</h2>
                ${a.closingText.map(para).join('')}
              </section>`
            : ''
        }

        <blockquote class="bg-navy-900 text-white rounded-2xl p-6 md:p-8 border-l-4 border-gold-500">
          <p class="text-lg md:text-xl font-medium leading-relaxed">"${esc(a.quote)}"</p>
          <footer class="mt-3 text-sm text-slate-300">${esc(a.ctaNote)}</footer>
        </blockquote>

        <section id="faq" class="scroll-mt-28">
          <h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-4">Preguntas frecuentes</h2>
          ${faqHtml(faqs)}
        </section>

        ${entitiesSection(linkedEntities)}
      </article>

      <aside class="space-y-6 lg:sticky lg:top-28 self-start">
        <div class="bg-navy-900 text-white rounded-2xl p-6">
          <p class="font-semibold text-lg">¿Necesitas que revisemos tu caso?</p>
          <p class="text-sm text-slate-300 mt-2">Consulta inicial gratuita y confidencial con nuestro equipo jurídico.</p>
          <div class="mt-5 space-y-3">${btnWA('WhatsApp', 'w-full', 'aside')}${btnCall(undefined, 'w-full', 'aside')}</div>
        </div>
        ${
          related.length
            ? `<div class="bg-white border border-slate-200 rounded-2xl p-6">
                <p class="font-semibold text-navy-900">Otras líneas relacionadas</p>
                <ul class="mt-3 space-y-2 text-sm">
                  ${related.map((r) => `<li><a class="hover:text-gold-700 flex gap-2 items-start" href="${areaUrl(r)}">${ic('arrow', 'w-4 h-4 mt-0.5 shrink-0 text-gold-700')}${esc(AREAS[r].short)}</a></li>`).join('')}
                  <li><a class="hover:text-gold-700 font-medium text-navy-900" href="${parentCrumb[1]}">Ver toda la categoría</a></li>
                </ul>
              </div>`
            : ''
        }
        <nav data-toc aria-label="En esta página" class="bg-white border border-slate-200 rounded-2xl p-6 text-sm">
          <p class="font-semibold text-navy-900">En esta página</p>
          <ul class="mt-3 space-y-2">${toc.map(([id, label]) => `<li><a class="hover:text-gold-700" href="#${id}">${esc(label)}</a></li>`).join('')}</ul>
        </nav>
      </aside>
    </div>` +
    ctaFinal();

  render({
    url: areaUrl(slug),
    title: seo.title || `${a.title} | ${SITE.name}`,
    desc: seo.desc || a.sub,
    body,
    crumbs,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: a.title,
        url: SITE.url + areaUrl(slug),
        inLanguage: 'es-CO',
        datePublished: SITE.published,
        dateModified: SITE.lastReview,
        isPartOf: { '@id': SITE.url + '/#website' },
        about: a.short,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: a.short,
        serviceType: 'Defensa jurídica en derechos humanos y crímenes de Estado',
        provider: { '@id': SITE.url + '/#organization' },
        areaServed: { '@type': 'Country', name: 'Colombia' },
        description: seo.desc || a.sub,
      },
      faqSchema(faqs),
    ],
  });
}

// ---------- NOSOTROS / EQUIPO ----------
function nosotrosPage() {
  const crumbs = [['Inicio', '/'], ['Nuestro equipo', '/nosotros/']];
  const body =
    pageHero({
      url: '/nosotros/',
      h1: 'Nuestro equipo',
      sub: 'Profesionales comprometidos con la defensa de las víctimas, la verdad, la justicia y la reparación integral.',
      ctas: false,
    }) +
    `<div class="max-w-7xl mx-auto px-6 py-14 space-y-12">
      <section class="max-w-3xl">
        ${h2('Enfoque de Derechos con Dignidad')}
        <p class="leading-relaxed text-slate-600">${rich(`En ${SITE.name} acompañamos a víctimas de crímenes de Estado y violaciones graves de derechos humanos con rigor probatorio, absoluta confidencialidad y respeto humano. Representamos casos ante la jurisdicción contencioso-administrativa, el Consejo de Estado, la Corte Constitucional, la Fiscalía General de la Nación, la JEP y el Sistema Interamericano de Derechos Humanos (CIDH y Corte IDH).`)}</p>
      </section>
      ${teamHtml()}
      ${pending('descripción de experiencia profesional, tarjeta profesional y enlaces a LinkedIn de cada integrante.')}
    </div>` +
    ctaFinal();

  render({
    url: '/nosotros/',
    title: PAGE_SEO['/nosotros/'].title,
    desc: PAGE_SEO['/nosotros/'].desc,
    body,
    crumbs,
    schema: TEAM.map((m) => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
      worksFor: { '@id': SITE.url + '/#organization' },
      ...(teamPhoto(m) ? { image: SITE.url + teamPhoto(m) } : {}),
    })),
  });
}

// ---------- CASOS RELEVANTES ----------
function casosPage() {
  const crumbs = [['Inicio', '/'], ['Casos relevantes', '/casos/']];
  const rutas = [
    ['01', 'Vía penal', 'Denuncia e intervención como representantes de víctimas ante la Fiscalía General de la Nación y jueces penales para impulsar el esclarecimiento de los hechos.'],
    ['02', 'Reparación directa', 'Demanda ante los juzgados y tribunales contencioso-administrativos y el Consejo de Estado para exigir la declaratoria de responsabilidad e indemnización estatal.'],
    ['03', 'Justicia transicional', 'Acreditación de víctimas, presentación de informes y observaciones territoriales en macrocasos ante la JEP en busca de verdad y sanción.'],
    ['04', 'Sistema interamericano', 'Escalamiento internacional ante la CIDH y la Corte Interamericana de Derechos Humanos cuando la justicia interna no brinda respuesta efectiva.'],
  ];
  const body =
    pageHero({
      url: '/casos/',
      h1: 'Casos relevantes y trayectoria jurídica',
      sub: 'Litigio de interés público, representación de víctimas y articulación ante tribunales nacionales, la JEP y el sistema interamericano.',
      ctas: false,
    }) +
    `<div class="max-w-7xl mx-auto px-6 py-14 space-y-14">
      <section class="max-w-3xl space-y-4">
        ${h2('Litigio colectivo y representación judicial de víctimas')}
        <p class="leading-relaxed text-slate-600">${rich('Derechos con Dignidad actúa como representante judicial de víctimas y litigante de interés público ante la Corte Interamericana de Derechos Humanos, el Consejo de Estado, la Corte Constitucional, la jurisdicción contencioso-administrativa, la Fiscalía General de la Nación y la JEP.')}</p>
        <p class="leading-relaxed text-slate-600">Los siguientes procesos documentados reflejan nuestra labor real en litigio colectivo, acreditación de víctimas y defensa de derechos humanos, con respeto absoluto por las personas involucradas y respaldo en fuentes oficiales.</p>
      </section>

      <section aria-labelledby="h-casos-doc">
        <h2 id="h-casos-doc" class="text-2xl md:text-3xl font-semibold text-navy-900 tracking-tight mb-6">Procesos documentados</h2>
        ${casesBlock()}
      </section>

      <section class="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 md:p-10" aria-labelledby="h-modelo-litigio">
        <p class="text-gold-500 text-xs font-semibold uppercase tracking-[0.2em]">Estrategia procesal</p>
        <h2 id="h-modelo-litigio" class="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Modelo de litigio multinivel</h2>
        <p class="mt-3 text-slate-300 max-w-3xl leading-relaxed">Dependiendo de la naturaleza del crimen de Estado o la violación de derechos humanos, estructuramos rutas paralelas y complementarias para proteger la verdad, la justicia y la reparación integral:</p>
        <ol class="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${rutas
            .map(
              ([num, t, d]) => `<li class="border-t-2 border-gold-500 pt-4">
                <span class="text-gold-500 font-semibold">${num}</span>
                <h3 class="mt-1 text-lg font-semibold text-white">${esc(t)}</h3>
                <p class="mt-2 text-sm text-slate-300 leading-relaxed">${rich(d, true)}</p>
              </li>`
            )
            .join('')}
        </ol>
      </section>

      ${entitiesSection(ENTITIES.filter((e) => ['corte-idh', 'cidh', 'jep', 'consejo-estado', 'corte-constitucional', 'fiscalia', 'minjusticia', 'defensoria'].includes(e.id)), 'Estamentos del Estado y organismos oficiales')}
    </div>` +
    ctaFinal();

  render({
    url: '/casos/',
    title: PAGE_SEO['/casos/'].title,
    desc: PAGE_SEO['/casos/'].desc,
    body,
    crumbs,
  });
}

// ---------- CONTACTO ----------
function contactoPage() {
  const crumbs = [['Inicio', '/'], ['Contacto', '/contacto/']];
  const body =
    pageHero({
      url: '/contacto/',
      h1: 'Contacto y solicitud de asesoría',
      sub: 'Primera orientación gratuita y confidencial. Atendemos con reserva total.',
      ctas: false,
    }) +
    `<div class="max-w-5xl mx-auto px-6 py-14 space-y-10">
      <div class="grid md:grid-cols-3 gap-5">
        <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('chat', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">WhatsApp</p>${hasWA ? `<p class="mt-3">${btnWA('Escribir', '!py-2.5', 'contacto')}</p>` : `<p class="mt-2 text-sm">${pending('número de WhatsApp.')}</p>`}</div>
        <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('phone', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Teléfono</p>${hasPhone ? `<p class="mt-2"><a class="underline text-navy-900" data-track="call" data-loc="contacto" href="${telLink}">${esc(SITE.phone)}</a></p>` : `<p class="mt-2 text-sm">${pending('teléfono.')}</p>`}</div>
        <div class="bg-white border border-slate-200 rounded-2xl p-6"><span class="text-gold-700">${ic('pin', 'w-6 h-6')}</span><p class="mt-3 font-semibold text-navy-900">Oficina en Medellín</p><p class="mt-2 text-sm text-slate-600">${esc(SITE.address)}</p><p class="mt-1 text-sm text-slate-500">${esc(SITE.hours)}</p></div>
      </div>
      <section class="bg-white border border-slate-200 rounded-2xl overflow-hidden grid md:grid-cols-2 items-center">
        <div class="p-6 md:p-8 space-y-4">
          <p class="text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]">Nuestro equipo en Medellín</p>
          <h2 class="text-2xl font-semibold text-navy-900 tracking-tight">Atención directa y confidencial</h2>
          <p class="text-sm text-slate-600 leading-relaxed">Nuestro equipo jurídico te escucha y acompaña con respeto y reserva absoluta desde nuestra sede principal en Medellín, adelantando procesos en todo el país y ante instancias internacionales.</p>
          <div class="pt-2 flex flex-wrap gap-3">
            <a href="/nosotros/" class="inline-flex items-center gap-2 border border-slate-300 hover:border-gold-500 text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">Conocer al equipo ${ic('arrow', 'w-4 h-4')}</a>
          </div>
        </div>
        <div class="h-full bg-slate-100">
          <img src="/assets/team/equipo-derechos-con-dignidad.webp" alt="Equipo jurídico de Derechos con Dignidad en su oficina de Medellín: Andrés Restrepo, Alejandro Botero, Yudy Elena Moreno, Juan Esteban Montoya y Daniel Montoya" width="585" height="480" loading="lazy" decoding="async" class="w-full h-full object-cover object-top" />
        </div>
      </section>
      ${SITE.mapEmbed
        ? `<section id="mapa" class="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 space-y-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-semibold text-navy-900">Ubicación de nuestra oficina en Medellín</h2><p class="text-sm text-slate-600 mt-1">${esc(SITE.address)}</p></div>${SITE.mapUrl ? `<a href="${esc(SITE.mapUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-700 underline underline-offset-2">Abrir en Google Maps ${ic('external', 'w-4 h-4')}</a>` : ''}</div><div class="map-frame bg-slate-100"><iframe title="Mapa de ubicación de Derechos con Dignidad en Medellín" src="${esc(SITE.mapEmbed)}" class="w-full h-80" loading="eager"></iframe></div></section>`
        : `<section class="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="text-xl font-semibold text-navy-900">Ubicación de nuestra oficina en Medellín</h2>${SITE.mapUrl ? `<a href="${esc(SITE.mapUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-700 underline underline-offset-2">Ver dirección en Google Maps ${ic('external', 'w-4 h-4')}</a>` : ''}</div><p class="text-sm text-slate-600">${esc(SITE.address)}</p>${pending('código o enlace de inserción (iframe) de Google Maps y correo electrónico de la firma.')}</section>`}
      ${contactFormHtml()}
    </div>`;

  render({
    url: '/contacto/',
    title: PAGE_SEO['/contacto/'].title,
    desc: PAGE_SEO['/contacto/'].desc,
    body,
    crumbs,
  });
}

// ---------- PÁGINAS LEGALES ----------
const renderBlocks = (blocks) =>
  blocks
    .map((b) => {
      if (typeof b === 'string') return para(b);
      if (b.ul)
        return `<ul class="space-y-2 mb-5">${b.ul.map((x) => `<li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full bg-gold-500 mt-2.5 shrink-0" aria-hidden="true"></span><span>${rich(x)}</span></li>`).join('')}</ul>`;
      if (b.ol)
        return `<ol class="space-y-2 mb-5 list-decimal pl-6 marker:text-gold-700 marker:font-semibold">${b.ol.map((x) => `<li class="pl-1">${rich(x)}</li>`).join('')}</ol>`;
      if (b.table) {
        const t = b.table;
        return `<div class="rtable max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white mb-6"><table class="w-full text-sm text-left"><caption class="px-4 py-3 text-left text-xs text-slate-500 caption-bottom">${esc(t.cap)}</caption><thead class="bg-slate-100 text-navy-900"><tr>${t.head.map((x) => `<th scope="col" class="px-4 py-3 font-semibold">${esc(x)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr class="border-t border-slate-200">${r.map((c, i) => (i === 0 ? `<th scope="row" data-label="${esc(t.head[0] || '')}" class="px-4 py-3 font-medium text-navy-900 align-top">${esc(c)}</th>` : `<td data-label="${esc(t.head[i] || '')}" class="px-4 py-3 align-top">${esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
      }
      return '';
    })
    .join('');

function legalPage({ url, title, desc, h1, sub, sections, note, faq }) {
  const crumbs = [['Inicio', '/'], [h1, url]];
  const inner = `
  ${pending(note)}
  <p class="text-sm text-slate-500">Última actualización: <time datetime="${SITE.lastReview}">${SITE.lastReview}</time></p>
  <nav aria-label="Contenido de la página" class="bg-white border border-slate-200 rounded-xl p-5">
    <p class="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-3">En esta página</p>
    <ol class="grid sm:grid-cols-2 gap-x-6 gap-y-2 list-decimal pl-5 text-sm marker:text-gold-700">
      ${sections.map(([t], i) => `<li><a class="text-navy-900 hover:text-gold-700 underline-offset-2 hover:underline" href="#l${i + 1}">${esc(t)}</a></li>`).join('')}
    </ol>
  </nav>
  ${sections.map(([t, bl], i) => `<section id="l${i + 1}" class="scroll-mt-28"><h2 class="text-xl md:text-2xl font-semibold text-navy-900 tracking-tight mb-4"><span class="text-gold-700 mr-2">${i + 1}.</span>${esc(t)}</h2>${renderBlocks(bl)}</section>`).join('')}
  ${faq ? `<section><h2 class="text-xl md:text-2xl font-semibold text-navy-900 tracking-tight mb-4">Preguntas frecuentes</h2><div class="space-y-3">${faq.map(([q, a]) => `<details class="group bg-white border border-slate-200 rounded-xl p-5"><summary class="flex justify-between items-center gap-4 cursor-pointer font-semibold text-navy-900 list-none">${esc(q)}<span class="shrink-0 transition-transform group-open:rotate-180">${ic('down')}</span></summary><p class="mt-3 text-slate-600 leading-relaxed">${rich(a)}</p></details>`).join('')}</div></section>` : ''}`;

  const body =
    pageHero({ url, h1, sub, ctas: false }) +
    `<div class="max-w-4xl mx-auto px-6 py-14 space-y-10">${inner}</div>` +
    ctaFinal();

  render({ url, title, desc, body, crumbs });
}

function legales() {
  legalPage({
    url: '/politica-de-privacidad/',
    title: PAGE_SEO['/politica-de-privacidad/'].title,
    desc: PAGE_SEO['/politica-de-privacidad/'].desc,
    h1: 'Política de privacidad',
    sub: 'Cómo recopilamos, protegemos y utilizamos los datos personales.',
    sections: PRIVACIDAD,
    note: 'validación jurídica de la política de privacidad, NIT, razón social y correo oficial de la firma.',
    faq: LEGAL_FAQ.privacidad,
  });
  legalPage({
    url: '/tratamiento-de-datos/',
    title: PAGE_SEO['/tratamiento-de-datos/'].title,
    desc: PAGE_SEO['/tratamiento-de-datos/'].desc,
    h1: 'Tratamiento de datos personales',
    sub: 'Autorización para el tratamiento de datos personales y datos sensibles.',
    sections: AUTORIZACION,
    note: 'validación jurídica de la política de tratamiento de datos personales por la firma.',
  });
  legalPage({
    url: '/terminos-de-uso/',
    title: PAGE_SEO['/terminos-de-uso/'].title,
    desc: PAGE_SEO['/terminos-de-uso/'].desc,
    h1: 'Términos de uso',
    sub: 'Condiciones de uso y alcance informativo del sitio.',
    sections: TERMINOS,
    note: 'validación jurídica de los términos de uso.',
  });
  legalPage({
    url: '/politica-de-cookies/',
    title: PAGE_SEO['/politica-de-cookies/'].title,
    desc: PAGE_SEO['/politica-de-cookies/'].desc,
    h1: 'Política de cookies',
    sub: 'Uso de cookies y tecnologías de almacenamiento.',
    sections: COOKIES,
    note: 'validación de herramientas de analítica o mapas embebidos.',
  });
}

// ---------- 404 ----------
function notFoundPage() {
  const quick = [
    ['shield', 'Áreas de acción', 'Crímenes de Estado, líderes sociales, Unión Patriótica e indemnizaciones.', '/areas-de-accion/'],
    ['gavel', 'Procesos y demandas', 'Demandas ante la JEP, CIDH, desaparición forzada y privación injusta.', '/procesos-y-demandas/'],
    ['users', 'Nuestro equipo', 'Conoce a los abogados especialistas en derechos humanos y litigio.', '/nosotros/'],
    ['scale', 'Casos relevantes', 'Trayectoria documentada ante la Corte IDH, JEP y litigio multinivel.', '/casos/'],
    ['pin', 'Contacto y ubicación', 'Atención 24/7 en Medellín, mapa interactivo y formulario confidencial.', '/contacto/'],
    ['file', 'Política de privacidad', 'Reserva profesional y tratamiento de datos personales (Ley 1581).', '/politica-de-privacidad/'],
  ];

  const body = `<section class="relative bg-[#003854] text-white overflow-hidden">
  <div class="absolute inset-0">
    <img src="/assets/hero/hero-no-encontrado.webp" alt="Página no encontrada en ${esc(SITE.name)}" width="1400" height="700" loading="eager" fetchpriority="high" decoding="async" class="w-full h-full object-cover object-center" />
    <div class="absolute inset-0 bg-gradient-to-r from-[#070d1a]/88 via-[#0f172a]/75 to-[#0f172a]/60" aria-hidden="true"></div>
  </div>
  <div class="relative max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
    <p class="text-7xl md:text-8xl font-semibold tracking-tight text-gold-500" aria-hidden="true">404</p>
    <h1 class="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-white">Esta página no existe o cambió de dirección</h1>
    <p class="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed">Revisa el enlace o usa el buscador y los accesos directos para encontrar el servicio o la información jurídica que necesitas.</p>
    <div class="mt-8 flex flex-wrap gap-3 justify-center">
      <a href="/" class="${goldBtn}">Volver al inicio</a>
      <button type="button" data-open-search class="${outlineBtn} cursor-pointer">${ic('search', 'w-5 h-5')}Buscar en el sitio</button>
      ${btnCall(undefined, '', '404')}
    </div>
  </div>
</section>
<section class="py-12 md:py-16 bg-slate-50">
  <div class="max-w-5xl mx-auto px-6">
    <h2 class="text-2xl font-semibold text-navy-900 tracking-tight mb-6 text-center">Quizás buscabas</h2>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${quick
        .map(
          ([i, t, x, u]) =>
            `<li><a href="${u}" class="group flex gap-4 items-start bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-xl p-5 h-full transition-all"><span class="w-10 h-10 shrink-0 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center">${ic(i, 'w-5 h-5')}</span><span class="min-w-0"><span class="block font-semibold text-navy-900 group-hover:text-gold-700">${esc(t)}</span><span class="block text-sm text-slate-600 mt-1 leading-relaxed">${esc(x)}</span></span></a></li>`
        )
        .join('')}
    </ul>
    <p class="mt-8 text-center text-sm text-slate-600">¿Necesitas orientación confidencial? <a class="underline text-navy-900 font-medium hover:text-gold-700" href="/contacto/">Escríbenos desde contacto</a>.</p>
  </div>
</section>`;

  render({
    url: '/no-encontrado/',
    title: 'Página no encontrada | Derechos con Dignidad',
    desc: 'La página solicitada no existe o cambió de dirección. Vuelve al inicio de Derechos con Dignidad o consulta nuestras áreas de acción y procesos.',
    body,
    noindex: true,
  });
}

// ---------- EJECUCIÓN DEL BUILD ----------
fs.rmSync(DIST, { recursive: true, force: true });
home();
areasIndex();
procesosIndex();
Object.keys(AREAS).forEach(areaPage);
nosotrosPage();
casosPage();
contactoPage();
legales();
notFoundPage();

const w = (f, c) => {
  const full = path.join(DIST, f);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, c);
};

// Copiar assets estáticos (solo las imágenes y favicons realmente usados para optimizar velocidad)
w('assets/logo' + LOGO.ext, fs.readFileSync(LOGO.file));
for (const ic2 of ['favicon.ico', 'favicon.png', 'apple-touch-icon.png', 'icon-512.png']) {
  if (fs.existsSync('src/assets/' + ic2)) fs.copyFileSync('src/assets/' + ic2, path.join(DIST, 'assets', ic2));
}
w(
  'assets/site.webmanifest',
  JSON.stringify({
    name: SITE.name,
    short_name: SITE.name,
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      { src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  })
);
if (hasOG) fs.copyFileSync('src/assets/og-default.png', path.join(DIST, 'assets', 'og-default.png'));
if (fs.existsSync('src/assets/team')) fs.cpSync('src/assets/team', path.join(DIST, 'assets', 'team'), { recursive: true });
for (const hImg of ['hero-home.webp', 'hero-equipo.webp', 'hero-contacto.webp', 'hero-legal.webp', 'hero-penal.webp', 'hero-no-encontrado.webp']) {
  if (fs.existsSync('src/assets/hero/' + hImg)) {
    fs.mkdirSync(path.join(DIST, 'assets', 'hero'), { recursive: true });
    fs.copyFileSync('src/assets/hero/' + hImg, path.join(DIST, 'assets', 'hero', hImg));
  }
}
w('assets/app.js', fs.readFileSync('src/app.js', 'utf8'));

// ---------- SEO técnico, sitemap, robots, .htaccess y posicionamiento LLM (llms.txt / llms-full.txt) ----------
function tech() {
  w(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map((p) => {
    const imgTag = p.heroImg
      ? `\n    <image:image>\n      <image:loc>${SITE.url}${p.heroImg}</image:loc>\n      <image:title>${esc(p.heroAlt || SITE.name)}</image:title>\n    </image:image>`
      : '';
    return `  <url>\n    <loc>${SITE.url}${p.url}</loc>\n    <lastmod>${SITE.lastReview}</lastmod>${imgTag}\n  </url>`;
  })
  .join('\n')}
</urlset>\n`
  );

  w(
    'robots.txt',
    `# Política de rastreo para buscadores y motores de IA - Derechos con Dignidad
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`
  );

  w(
    '.htaccess',
    `# Derechos con Dignidad - Optimización Apache / cPanel
DirectoryIndex index.html
Options -Indexes
ErrorDocument 404 /404.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript text/plain text/xml application/xml image/svg+xml application/json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 month"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
`
  );

  const legalMd = LEGAL_LINKS.map(([t, u]) => `- [${t}](${SITE.url}${u})`).join('\n');
  const entitiesMd = ENTITIES.map((e) => `- [${e.name}](${e.url}): ${e.desc}`).join('\n');

  w(
    'llms.txt',
    [
      `# ${SITE.name}`,
      `> ${SITE.name} es una firma jurídica colombiana con sede principal en Medellín (${SITE.address}, teléfono ${SITE.phone}), especializada en defensa de víctimas del Estado, derechos humanos, crímenes de lesa humanidad, litigio ante la JEP y el Sistema Interamericano (CIDH y Corte IDH), y demandas de reparación integral en toda Colombia. Primera consulta gratuita y confidencial; disponibilidad 24/7.`,
      `Última actualización: ${SITE.lastReview}. Idioma: español (Colombia).`,
      '## Datos clave',
      [
        `- Organización: ${SITE.name}`,
        `- Enfoque: Litigio de interés público y representación judicial de víctimas`,
        `- Sede principal: ${SITE.address}`,
        `- Teléfono: ${SITE.phone}`,
        `- Atención: ${SITE.hours} (primera consulta gratuita y confidencial)`,
        `- Cobertura: Toda Colombia e instancias internacionales`,
      ].join('\n'),
      '## Áreas de acción, procesos y demandas',
      ...CATEGORIES.map(
        (cat) =>
          `### ${cat.title}\n` +
          cat.items
            .map((slug) => {
              const a = AREAS[slug];
              const seo = AREA_SEO[slug];
              return `- [${a.title}](${SITE.url}${areaUrl(slug)}): ${seo?.answer || a.sub}`;
            })
            .join('\n')
      ),
      '## Casos relevantes documentados',
      SITE.cases
        .map((c) => `- **${c.title}** (${c.instance}): ${c.result} [Ver detalles](${SITE.url}/casos/#${c.slug})`)
        .join('\n'),
      '## Equipo jurídico',
      SITE.team.map((m) => `- ${m.name}: ${m.role}`).join('\n'),
      '## Estamentos del Estado y organismos oficiales',
      entitiesMd,
      '## Páginas institucionales y legales',
      [`- [Nuestro equipo](${SITE.url}/nosotros/)`, `- [Casos relevantes](${SITE.url}/casos/)`, `- [Contacto y asesoría](${SITE.url}/contacto/)`, legalMd].join('\n'),
      '## Documentación completa para asistentes de IA',
      `- [Contenido completo en Markdown](${SITE.url}/llms-full.txt)`,
    ].join('\n\n') + '\n'
  );

  const fullBlocks = [
    `# ${SITE.name} (Corpus completo para motores de búsqueda e IA)`,
    `> Defensa jurídica de víctimas del Estado, derechos humanos, crímenes de lesa humanidad, litigio ante la JEP, CIDH, Corte IDH y Consejo de Estado en Colombia. Sede: ${SITE.address}. Teléfono: ${SITE.phone}. Atención 24/7; primera consulta gratuita y confidencial. Última actualización: ${SITE.lastReview}.`,
    '## Preguntas frecuentes principales',
    HOME_FAQ.map(([q, a]) => `### ${q}\n${a}`).join('\n\n'),
    '## Áreas de acción, procesos y demandas (detalle)',
    ...Object.entries(AREAS).map(([slug, a]) => {
      const seo = AREA_SEO[slug];
      const parts = [
        `### ${a.title}`,
        `URL: ${SITE.url}${areaUrl(slug)}`,
        seo?.answer ? `**Respuesta directa:** ${seo.answer}` : '',
        ...(a.intro || []),
        a.listTitle ? `**${a.listTitle}**\n` + a.listItems.map((i) => `- ${i}`).join('\n') : '',
        a.servicesTitle ? `**${a.servicesTitle}**\n` + a.services.map(([t, d]) => `- **${t}:** ${d}`).join('\n') : '',
        a.extraListTitle ? `**${a.extraListTitle}**\n` + a.extraListItems.map((i) => `- ${i}`).join('\n') : '',
        ...(a.closingText || []),
      ].filter(Boolean);
      return parts.join('\n\n');
    }),
    '## Casos relevantes documentados y modelo de litigio',
    ...SITE.cases.map((c) =>
      [
        `### ${c.title}`,
        `Instancia: ${c.instance}`,
        `Contexto: ${c.context}`,
        `Rol de Derechos con Dignidad: ${c.work}`,
        `Resultado y estado: ${c.result}`,
        `Fuentes: ${(c.sources || []).map(([l, u]) => `[${l}](${u})`).join(' | ')}`,
      ].join('\n\n')
    ),
    '## Estamentos oficiales vinculados',
    entitiesMd,
  ];
  w('llms-full.txt', fullBlocks.join('\n\n') + '\n');
}
tech();

// 404.html en la raíz
w(
  '404.html',
  fs
    .readFileSync(path.join(DIST, 'no-encontrado', 'index.html'), 'utf8')
    .replace(/<link rel="canonical"[^>]*>/, '')
    .replace(/<meta property="og:url"[^>]*>/, '')
);
fs.rmSync(path.join(DIST, 'no-encontrado'), { recursive: true, force: true });

// Search index
const searchIndex = pageMeta
  .filter((p) => !p.noindex && p.url !== '/no-encontrado/')
  .map((p) => {
    let cat = 'Institucional';
    if (p.url.startsWith('/areas-de-accion/')) {
      const slug = p.url.replace(/^\/areas-de-accion\/|\/$/g, '');
      const area = AREAS[slug];
      if (area?.cat === 'procesos-demandas') cat = 'Procesos y Demandas';
      else if (area?.cat === 'indemnizaciones-reparacion') cat = 'Indemnizaciones';
      else cat = 'Áreas de Acción';
    } else if (p.url.startsWith('/procesos-y-demandas')) cat = 'Procesos y Demandas';
    else if (/privacidad|datos|terminos|cookies/.test(p.url)) cat = 'Legales';

    return {
      t: p.title.replace(/\s*\|\s*Derechos con Dignidad.*$/i, '').trim(),
      u: p.url,
      c: cat,
      d: p.desc || '',
      k: `${p.h1 || ''} ${(p.h2 || []).join(' ')} ${(p.crumbs || []).join(' ')}`.toLowerCase(),
    };
  });

w('assets/search-index.json', JSON.stringify(searchIndex));
fs.writeFileSync('src/assets/search-index.json', JSON.stringify(searchIndex));

console.log('Páginas generadas:', pages.length, '| Índice de búsqueda:', searchIndex.length);
