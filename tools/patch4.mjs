import fs from 'node:fs';
let b = fs.readFileSync('build.mjs', 'utf8');
let miss = 0;
const rep = (a, c) => { if (!b.includes(a)) { miss++; console.log('NO ENCONTRADO:', a.slice(0, 90).replace(/\n/g, '⏎')); return; } b = b.replace(a, () => c); };
const cut = (start, endMarker, replacement) => { const i = b.indexOf(start); const j = b.indexOf(endMarker, i); if (i < 0 || j < 0) { miss++; console.log('NO ENCONTRADO (cut):', start.slice(0, 60)); return; } b = b.slice(0, i) + replacement + b.slice(j); };

// 1) Nombre "Guías" en navegación, migas y footer (la URL se mantiene en /blog/ según el brief)
b = b.split("['Blog', '/blog/']").join("['Guías', '/blog/']");
rep("{ label: 'Blog', href: '/blog/' },", "{ label: 'Guías', href: '/blog/' },");
rep('href="/blog/">Blog</a></li>', 'href="/blog/">Guías</a></li>');

// 2) Home: la sección de guías pasa a ser un enlace compacto
cut("    <div class=\"mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6\">${ARTICLES.map((a) => `<a href=\"/blog/${a.slug}/\"", "\n  </div>\n</section>",
  "    <div class=\"mt-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4\"><p class=\"max-w-2xl\">Reunimos <strong class=\"text-navy-900\">${ARTICLES.length} guías</strong> sobre qué hacer tras un accidente, SOAT, aseguradoras, honorarios, plazos y más, organizadas por tema para que las encuentres fácil.</p><a href=\"/blog/\" class=\"inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-lg\">Ir a las guías ${ic('arrow')}</a></div>");

// 3) Páginas de servicio: se quita la sección larga de guías; queda un recuadro breve en el lateral
rep("    ${arts.length ? sec('guias', 'Guías relacionadas', `<ul class=\"space-y-2\">${arts.map((a) => `<li><a class=\"text-navy-900 font-medium underline\" href=\"/blog/${a.slug}/\">${esc(a.title)}</a></li>`).join('')}</ul>`) : ''}\n", '');
rep('Más de ${esc(h.title)}</a></li></ul></div>', 'Más de ${esc(h.title)}</a></li></ul></div>\n    ${arts.length ? `<div class="bg-white border border-slate-200 rounded-2xl p-6"><p class="font-semibold text-navy-900">Guías relacionadas</p><ul class="mt-3 space-y-2 text-sm">${arts.slice(0, 3).map((a) => `<li><a class="hover:text-gold-600 flex gap-2 items-start" href="/blog/${a.slug}/">${ic(\'file\', \'w-4 h-4 mt-0.5 shrink-0 text-gold-600\')}${esc(SEO_TITLES[a.slug] || a.seo || a.title)}</a></li>`).join(\'\')}<li><a class="hover:text-gold-600 font-medium" href="/blog/">Ver todas las guías</a></li></ul></div>` : \'\'}');

// 4) Página de guías: buscador, filtros por tema y tiempo de lectura
const mins = "const readMins = (a) => Math.max(2, Math.round((a.resumen.join(' ') + ' ' + a.sections.map(([t, bl]) => t + ' ' + blocksToText(bl)).join(' ')).split(/\\s+/).length / 200));\n";
cut("  const body = pageHero({ crumbs: [['Inicio', '/'], ['Guías', '/blog/']], h1: 'Guías para víctimas", "  render({ url: '/blog/', title:", `  const sorted = [...ARTICLES].sort((p, q) => (q.cluster === 'Pilar') - (p.cluster === 'Pilar'));
  const chip = (label, key, on) => \`<button type="button" data-guide-filter="\${esc(key)}" aria-pressed="\${on}" class="px-4 py-2 rounded-full text-sm font-medium border \${on ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-900 border-slate-200 hover:border-gold-500'}">\${esc(label)}</button>\`;
  const body = pageHero({ crumbs: [['Inicio', '/'], ['Guías', '/blog/']], h1: 'Guías para víctimas de accidentes de tránsito', sub: 'Información clara sobre qué hacer, qué reclamar y qué evitar. Busca por palabra o filtra por tema.', ctas: false }) +
    \`<section class="py-12" id="guias"><div class="max-w-7xl mx-auto px-6">
      <div class="grid gap-4">
        <label for="guide-search" class="sr-only">Buscar guías</label>
        <input id="guide-search" data-guide-search type="search" placeholder="Buscar una guía: SOAT, IPAT, aseguradora, honorarios…" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500">
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar guías por tema">\${chip(\\\`Todas (\\\${ARTICLES.length})\\\`, 'all', true)}\${clusters.map((c) => chip(\\\`\\\${c} (\\\${ARTICLES.filter((a) => a.cluster === c).length})\\\`, c, false)).join('')}</div>
      </div>
      <h2 class="mt-10 text-2xl font-semibold text-navy-900 tracking-tight">Todas las guías</h2>
      <p data-guide-count class="mt-1 text-sm text-slate-500" aria-live="polite">\${ARTICLES.length} guías</p>
      <div data-guides class="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">\${sorted.map((a) => \`<a href="/blog/\${a.slug}/" data-cluster="\${esc(a.cluster)}" data-text="\${esc((a.title + ' ' + a.desc + ' ' + a.kw).toLowerCase())}" class="group flex flex-col bg-white border border-slate-200 hover:border-gold-500 hover:shadow-glow rounded-2xl p-6 transition-all"><div class="flex items-center justify-between gap-2 text-xs"><span class="uppercase tracking-wide text-gold-600 font-semibold">\${esc(a.cluster)}</span><span class="inline-flex items-center gap-1 text-slate-500">\${ic('clock', 'w-3.5 h-3.5')}\${readMins(a)} min</span></div><h3 class="mt-3 text-lg font-semibold text-navy-900 leading-snug">\${esc(a.title)}</h3><p class="mt-2 text-sm flex-1">\${esc(a.desc)}</p><span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-900">Leer guía \${ic('arrow', 'w-4 h-4')}</span></a>\`).join('')}</div>
      <p data-guide-empty class="hidden mt-6 text-slate-500">No encontramos guías con ese término. Prueba con otra palabra o <a class="underline text-navy-900" href="/contacto/">escríbenos tu duda</a>.</p>
      <p class="mt-10 text-sm">¿Buscas una definición? Consulta el <a class="underline text-navy-900 font-medium" href="/glosario/">glosario de términos</a>.</p></div></section>\` + ctaFinal();
`);
rep("function blog() {\n  const clusters", mins + "function blog() {\n  const clusters");
rep("title: 'Blog: guías sobre accidentes de tránsito en Colombia | IndemnizaVial'", "title: 'Guías sobre accidentes de tránsito en Colombia | IndemnizaVial'");

fs.writeFileSync('build.mjs', b);

// JS del filtro de guías
let js = fs.readFileSync('src/app.js', 'utf8');
if (!js.includes('data-guide-filter')) {
  js = js.replace("  // ---------- Lista de documentos interactiva", `  // ---------- Página de guías: buscador y filtros por tema ----------
  var gWrap = document.querySelector('[data-guides]');
  if (gWrap) {
    var cards = $$('a[data-cluster]', gWrap), chips = $$('[data-guide-filter]'), gSearch = document.querySelector('[data-guide-search]');
    var gCount = document.querySelector('[data-guide-count]'), gEmpty = document.querySelector('[data-guide-empty]');
    var topic = 'all';
    var applyGuides = function () {
      var q = (gSearch.value || '').toLowerCase().trim(), n = 0;
      cards.forEach(function (c) {
        var ok = (topic === 'all' || c.getAttribute('data-cluster') === topic) && (!q || c.getAttribute('data-text').indexOf(q) !== -1);
        c.classList.toggle('hidden', !ok); if (ok) n++;
      });
      gCount.textContent = n + (n === 1 ? ' guía' : ' guías');
      gEmpty.classList.toggle('hidden', n > 0);
    };
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        topic = ch.getAttribute('data-guide-filter');
        chips.forEach(function (x) {
          var on = x === ch; x.setAttribute('aria-pressed', String(on));
          x.classList.toggle('bg-navy-900', on); x.classList.toggle('text-white', on); x.classList.toggle('border-navy-900', on);
          x.classList.toggle('bg-white', !on); x.classList.toggle('text-navy-900', !on); x.classList.toggle('border-slate-200', !on);
        });
        applyGuides();
      });
    });
    gSearch.addEventListener('input', applyGuides);
    var hash = decodeURIComponent(location.hash.slice(1));
    if (hash && hash !== 'guias') { chips.forEach(function (ch) { if (ch.getAttribute('data-guide-filter') === hash) ch.click(); }); }
  }

  // ---------- Lista de documentos interactiva`);
  fs.writeFileSync('src/app.js', js);
}
console.log('patch4 listo. Anclas no encontradas:', miss);
