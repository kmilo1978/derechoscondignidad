import fs from 'node:fs';
let miss = 0;
const rep = (s, a, c) => { if (!s.includes(a)) { miss++; console.log('NO ENCONTRADO:', a.slice(0, 90).replace(/\n/g, '⏎')); return s; } return s.replace(a, () => c); };
const NEW = 'Derechos con Dignidad';

// 1) Renombrar la marca (el dominio en minúsculas indemnizavial.co no se toca)
for (const f of ['build.mjs', 'src/config.mjs', 'src/content.mjs', 'src/articles.mjs', 'src/articles2.mjs', 'src/extra.mjs', 'src/services2.mjs', 'src/municipios.mjs', 'src/faqs.mjs']) {
  const s = fs.readFileSync(f, 'utf8');
  if (s.includes('IndemnizaVial')) { fs.writeFileSync(f, s.split('IndemnizaVial').join(NEW)); console.log('renombrado en', f); }
}

let b = fs.readFileSync('build.mjs', 'utf8');

// 2) Resolver el logo: se usa el archivo original si existe (png/webp/jpg), si no la recreación SVG
b = rep(b, "// ---------- Contacto ----------", `// ---------- Logo ----------
const LOGO_CANDIDATES = ['logo.png', 'logo.webp', 'logo.jpg', 'logo.jpeg', 'logo.svg'];
const logoFile = LOGO_CANDIDATES.find((n) => fs.existsSync('src/assets/' + n));
const LOGO = { url: '/assets/' + logoFile, file: 'src/assets/' + logoFile, ext: path.extname(logoFile), w: 150, h: 50 };
const hasOG = fs.existsSync('src/assets/og-default.png');
const logoImg = (cls = 'h-10 w-auto') => \`<img src="\${LOGO.url}" alt="\${esc(SITE.name)}" width="\${LOGO.w}" height="\${LOGO.h}" class="\${cls}" decoding="async">\`;

// ---------- Contacto ----------`);

// 3) Encabezado, encabezado mínimo y pie con el logo (sobre una pastilla blanca para que se lea sobre el fondo oscuro)
b = rep(b, `<a href="/" class="flex items-center gap-3" aria-label="\${esc(SITE.name)} - Inicio">
      <span class="w-10 h-10 bg-gold-500 text-navy-900 rounded flex items-center justify-center">\${ic('scale', 'w-6 h-6')}</span>
      <span class="leading-tight"><span class="block text-white font-semibold text-lg tracking-tight">\${esc(SITE.name)}</span><span class="hidden 2xl:block text-[10px] tracking-[0.2em] uppercase text-slate-400">Accidentes de tránsito</span></span>
    </a>`, `<a href="/" class="flex items-center" aria-label="\${esc(SITE.name)} - Inicio"><span class="bg-white rounded-lg px-3 py-1.5 flex items-center">\${logoImg('h-10 w-auto')}</span></a>`);
b = rep(b, `<a href="/" class="flex items-center gap-2 text-white font-semibold"><span class="w-8 h-8 bg-gold-500 text-navy-900 rounded flex items-center justify-center">\${ic('scale', 'w-5 h-5')}</span>\${esc(SITE.name)}</a>`, `<a href="/" class="flex items-center" aria-label="\${esc(SITE.name)} - Inicio"><span class="bg-white rounded-lg px-2.5 py-1 flex items-center">\${logoImg('h-8 w-auto')}</span></a>`);
b = rep(b, `<div class="flex items-center gap-3 text-white font-semibold"><span class="w-9 h-9 bg-gold-500 text-navy-900 rounded flex items-center justify-center">\${ic('scale')}</span>\${esc(SITE.name)}</div>`, `<a href="/" class="inline-flex bg-white rounded-lg px-3 py-2" aria-label="\${esc(SITE.name)} - Inicio">\${logoImg('h-10 w-auto')}</a>`);

// 4) Favicon, imagen social (og:image / twitter) y logo en datos estructurados
b = rep(b, '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">', `<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
\${hasOG ? \`<meta property="og:image" content="\${SITE.url}/assets/og-default.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="\${esc(SITE.name)}">\` : ''}
<meta name="twitter:card" content="\${hasOG ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="\${esc(title)}"><meta name="twitter:description" content="\${esc(desc)}">\${hasOG ? \`<meta name="twitter:image" content="\${SITE.url}/assets/og-default.png">\` : ''}`);
b = rep(b, "areaServed: { '@type': 'City', name: 'Medellín' },\n    ...(hasPhone", "areaServed: { '@type': 'City', name: 'Medellín' }, logo: SITE.url + LOGO.url, image: SITE.url + (hasOG ? '/assets/og-default.png' : LOGO.url),\n    ...(hasPhone");

// 5) Título: si con la marca supera 68 caracteres, se omite el sufijo para no truncarlo en Google
b = rep(b, "  const canonical = SITE.url + (canonicalUrl || url);", "  { const suf = ' | ' + SITE.name; if (title.endsWith(suf) && title.length > 68) title = title.slice(0, -suf.length); }\n  const canonical = SITE.url + (canonicalUrl || url);");

// 6) Copiar logo, favicon y OG a dist
b = rep(b, "  w('assets/favicon.svg',", "  fs.copyFileSync(LOGO.file, path.join(DIST, 'assets', 'logo' + LOGO.ext));\n  if (hasOG) fs.copyFileSync('src/assets/og-default.png', path.join(DIST, 'assets', 'og-default.png'));\n  if (fs.existsSync('src/assets/favicon.svg')) fs.copyFileSync('src/assets/favicon.svg', path.join(DIST, 'assets', 'favicon.svg')); else w('assets/favicon.svg',");
fs.writeFileSync('build.mjs', b);
console.log('patch7 listo. Anclas no encontradas:', miss);
