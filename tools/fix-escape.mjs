import fs from 'node:fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const re = /\\\$\{(answerBox|tableHtml)/g;
const n = (s.match(re) || []).length;
s = s.replace(re, '${$1');
fs.writeFileSync('build.mjs', s);
console.log('corregidas', n);
