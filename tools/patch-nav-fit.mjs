import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('no: ' + a); s = s.split(a).join(b); };
r('px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5', 'px-2 2xl:px-3 py-2.5 text-[13px] 2xl:text-sm font-medium rounded-lg hover:bg-white/5');
r('class="hidden xl:flex items-center gap-1" aria-label="Principal"', 'class="hidden xl:flex items-center gap-0.5 2xl:gap-1 min-w-0" aria-label="Principal"');
r('h-20 flex items-center justify-between gap-8', 'h-20 flex items-center justify-between gap-4 2xl:gap-8');
r('<div class="hidden xl:block">${btnWA(', '<div class="hidden xl:block shrink-0">${btnWA(');
fs.writeFileSync('build.mjs', s);
console.log('ok');
