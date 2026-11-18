import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('no: ' + a); s = s.split(a).join(b); };
r('px-2.5 2xl:px-3.5 py-2 text-[13.5px] 2xl:text-[15px] font-medium rounded-lg hover:bg-white/5', 'px-2 2xl:px-3 py-2 text-[13px] 2xl:text-[14.5px] font-medium rounded-lg hover:bg-white/5');
r('class="hidden xl:flex flex-1 justify-center items-center gap-1 2xl:gap-2 min-w-0" aria-label="Principal"', 'class="hidden xl:flex flex-1 justify-center items-center gap-1 2xl:gap-1.5 min-w-0" aria-label="Principal"');
fs.writeFileSync('build.mjs', s);
console.log('ok');
