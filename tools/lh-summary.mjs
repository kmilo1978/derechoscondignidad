import fs from 'node:fs';
for (const n of ['home', 'servicio', 'guia']) {
  const j = JSON.parse(fs.readFileSync(`../sitio/lh-${n}.json`, 'utf8'));
  const c = j.categories, a = j.audits;
  const sc = (k) => Math.round((c[k]?.score ?? 0) * 100);
  console.log(`\n[${n}] Rendimiento ${sc('performance')} | Accesibilidad ${sc('accessibility')} | Buenas prácticas ${sc('best-practices')} | SEO ${sc('seo')}`);
  console.log('  LCP', a['largest-contentful-paint'].displayValue, '| CLS', a['cumulative-layout-shift'].displayValue, '| TBT', a['total-blocking-time'].displayValue, '| FCP', a['first-contentful-paint'].displayValue, '| SI', a['speed-index'].displayValue);
  const fails = Object.values(a).filter((x) => x.score !== null && x.score < 1 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable' && x.scoreDisplayMode !== 'manual');
  console.log('  Auditorías no superadas:', fails.map((x) => `${x.id}(${Math.round(x.score * 100)})`).join(', ') || 'ninguna');
}
