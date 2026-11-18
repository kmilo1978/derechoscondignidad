import fs from 'node:fs';
for (const n of ['home', 'servicio']) {
  const j = JSON.parse(fs.readFileSync(`../sitio/lh-${n}.json`, 'utf8'));
  const a = j.audits;
  console.log(`\n=== ${n} ===`);
  const cc = a['color-contrast']?.details?.items || [];
  console.log('color-contrast fallos:', cc.length);
  cc.slice(0, 6).forEach((i) => console.log('  ', (i.node?.snippet || '').slice(0, 100).replace(/\s+/g, ' '), '|', (i.node?.explanation || '').replace(/\s+/g, ' ').slice(40, 190)));
  const mw = a['mainthread-work-breakdown']?.details?.items || [];
  console.log('main thread:', mw.map((x) => `${x.groupLabel} ${Math.round(x.duration)}ms`).join(' | '));
  const lt = a['long-tasks']?.details?.items || [];
  console.log('long tasks:', lt.slice(0, 5).map((x) => `${Math.round(x.duration)}ms ${(x.url || '').split('/').pop()}`).join(' | '));
  console.log('DOM:', a['dom-size']?.displayValue, '| bytes:', a['total-byte-weight']?.displayValue);
}
