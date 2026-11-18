import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('no encontrado: ' + a.slice(0, 60)); s = s.split(a).join(b); };

// 1) Menú móvil: acordeones por sección + enlaces directos
const start = s.indexOf('  const mob = [');
const end = s.indexOf("join('');", s.indexOf('].map((n) => `<a href="${n.href}" class="block py-3', start)) + "join('');".length;
if (start < 0 || end < start) throw new Error('bloque mob');
s = s.slice(0, start) + `  const mobLink = 'flex items-center justify-between py-3.5 text-base text-white/90 hover:text-gold-500 focus-visible:text-gold-500 transition-colors';
  const mob = NAV.map((n) => {
    if (n.href) return \`<li class="border-b border-white/10"><a href="\${n.href}" class="\${mobLink}">\${n.label}</a></li>\`;
    const items = n.hubs.flatMap((id) => hub(id).items).map((sv) => \`<li><a href="\${svcUrl(sv)}" class="block py-2.5 pl-4 text-[15px] text-slate-300 hover:text-gold-500 border-l border-white/10 hover:border-gold-500 transition-colors">\${esc(SERVICES[sv].short)}</a></li>\`).join('');
    return \`<li class="border-b border-white/10"><details class="group/m"><summary class="\${mobLink} cursor-pointer list-none group-open/m:text-gold-500">\${n.label}<span class="transition-transform group-open/m:rotate-180">\${ic('down', 'w-5 h-5')}</span></summary><ul class="pb-3 space-y-0.5">\${items}<li><a href="/servicios/#\${n.hubs[0]}" class="block py-2.5 pl-4 text-[15px] font-semibold text-gold-500 border-l border-gold-500">Ver toda la sección</a></li></ul></details></li>\`;
  }).join('');` + s.slice(end);

// 2) Botón con icono que cambia (hamburguesa / X)
r(`<button id="menuBtn" class="xl:hidden text-white p-2" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileMenu">\${ic('menu', 'w-7 h-7')}</button>`,
  `<button id="menuBtn" type="button" class="xl:hidden text-white w-11 h-11 -mr-2 inline-flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-gold-500 transition-colors" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileMenu"><span data-icon-open>\${ic('menu', 'w-7 h-7')}</span><span data-icon-close class="hidden">\${ic('x', 'w-7 h-7')}</span></button>`);

// 3) Panel: lista, scroll interno y botón de llamada
r(`<div id="mobileMenu" class="hidden xl:hidden bg-navy-900 px-6 pb-6 max-h-[80vh] overflow-y-auto"><nav aria-label="Móvil">\${mob}</nav>`,
  `<div id="mobileMenu" class="hidden xl:hidden bg-navy-900 border-t border-white/10 px-6 pb-6 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"><nav aria-label="Menú móvil"><ul>\${mob}</ul></nav>`);

// 4) Evitar caché antigua de CSS/JS
r('<link rel="stylesheet" href="/assets/style.css">', '<link rel="stylesheet" href="/assets/style.css?v=${BUILD_V}">');
r('<script src="/assets/app.js" defer></script>', '<script src="/assets/app.js?v=${BUILD_V}" defer></script>');
if (!s.includes('const BUILD_V')) s = s.replace('// ---------- Iconos', 'const BUILD_V = Date.now().toString(36);\n// ---------- Iconos');
fs.writeFileSync('build.mjs', s);
console.log('ok');
