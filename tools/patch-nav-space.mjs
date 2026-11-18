import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('no: ' + a); s = s.split(a).join(b); };
// Enlaces: tamaño uniforme; un poco más de aire en pantallas grandes
r('px-2 2xl:px-3 py-2.5 text-[13px] 2xl:text-sm font-medium rounded-lg hover:bg-white/5', 'px-2.5 2xl:px-3.5 py-2 text-[13.5px] 2xl:text-[15px] font-medium rounded-lg hover:bg-white/5');
// Menú centrado entre logo y botón, con separación regular
r('class="hidden xl:flex items-center gap-0.5 2xl:gap-1 min-w-0" aria-label="Principal"', 'class="hidden xl:flex flex-1 justify-center items-center gap-1 2xl:gap-2 min-w-0" aria-label="Principal"');
// Contenedor del encabezado más ancho en pantallas grandes
r('<div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4 2xl:gap-8">', '<div class="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-6 2xl:gap-10">');
r('<a href="/" class="flex items-center" aria-label="${esc(SITE.name)} - Inicio"><span class="bg-white rounded-lg px-3 py-1.5 flex items-center">${logoImg(\'h-10 w-auto\')}</span></a>\n    <nav', '<a href="/" class="flex items-center shrink-0" aria-label="${esc(SITE.name)} - Inicio"><span class="bg-white rounded-lg px-3 py-1.5 flex items-center">${logoImg(\'h-10 w-auto\')}</span></a>\n    <nav');
fs.writeFileSync('build.mjs', s);
console.log('ok');
