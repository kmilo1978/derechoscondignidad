import fs from 'node:fs';
let js = fs.readFileSync('src/app.js', 'utf8');
js = js.split("$('a[data-cluster]', gWrap)").join("$$('a[data-cluster]', gWrap)").split("$('[data-guide-filter]')").join("$$('[data-guide-filter]')");
fs.writeFileSync('src/app.js', js);
console.log((js.match(/[^$]\$\(/g) || []).length, 'usos sueltos de $( restantes');
