import fs from 'node:fs';
let css = fs.readFileSync('src/input.css', 'utf8');
css = css.replace(/\/\* Rendimiento: no pintar[^\n]*\n[^\n]*content-visibility[^\n]*\n\n/, '');
fs.writeFileSync('src/input.css', css);
console.log('content-visibility restante:', (css.match(/content-visibility/g) || []).length);
