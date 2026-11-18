import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error(a); s = s.split(a).join(b); };
r('px-2 py-2 text-[13px] font-medium', 'px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5');
r('class="hidden xl:flex items-center" aria-label="Principal"', 'class="hidden xl:flex items-center gap-1" aria-label="Principal"');
r('h-20 flex items-center justify-between gap-6', 'h-20 flex items-center justify-between gap-8');
fs.writeFileSync('build.mjs', s);
