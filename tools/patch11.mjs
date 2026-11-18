import fs from 'node:fs';
let b = fs.readFileSync('build.mjs', 'utf8');
const n = (b.match(/text-xs text-slate-400/g) || []).length;
b = b.split('text-xs text-slate-400').join('text-xs text-slate-500');
fs.writeFileSync('build.mjs', b);
console.log('notas con contraste corregido:', n);

let css = fs.readFileSync('src/input.css', 'utf8');
if (!css.includes('content-visibility')) {
  css = css.replace('@media print {', `/* Rendimiento: solo secciones CLARAS sin fondos oscuros dentro (evita falsos fallos de contraste en auditorías) */
#quienes-somos, #situaciones, #que-recibes, #esencial, #contacto-home, #faq, #glosario, #fuentes, section[aria-labelledby="h-faq-auto"] { content-visibility: auto; contain-intrinsic-size: auto 600px; }

@media print {`);
  fs.writeFileSync('src/input.css', css);
}
console.log('content-visibility reglas:', (css.match(/content-visibility/g) || []).length);
