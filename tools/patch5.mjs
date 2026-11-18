import fs from 'node:fs';
let b = fs.readFileSync('build.mjs', 'utf8');
let miss = 0;
const rep = (a, c, all = false) => { if (!b.includes(a)) { miss++; console.log('NO ENCONTRADO:', a.slice(0, 90)); return; } b = all ? b.split(a).join(c) : b.replace(a, () => c); };

// Menú: una sola línea, desktop desde xl, subtítulo del logo solo en pantallas muy anchas
rep('class="hidden lg:flex items-center" aria-label="Principal"', 'class="hidden xl:flex items-center" aria-label="Principal"');
rep('<div class="hidden lg:block">${btnWA(', '<div class="hidden xl:block">${btnWA(');
rep('class="lg:hidden text-white p-2"', 'class="xl:hidden text-white p-2"');
rep('id="mobileMenu" class="hidden lg:hidden', 'id="mobileMenu" class="hidden xl:hidden');
rep('class="px-2.5 py-2 text-sm font-medium text-white/90 hover:text-gold-500 transition-colors">${n.label}</a>`;', 'class="px-2 py-2 text-[13px] font-medium text-white/90 hover:text-gold-500 transition-colors whitespace-nowrap">${n.label}</a>`;');
rep('class="px-3 py-2 text-sm font-medium text-white/90 hover:text-gold-500 transition-colors inline-flex items-center gap-1">', 'class="px-2 py-2 text-[13px] font-medium text-white/90 hover:text-gold-500 transition-colors inline-flex items-center gap-1 whitespace-nowrap">');
rep('<span class="block text-[10px] tracking-[0.2em] uppercase text-slate-400">Accidentes de tránsito</span>', '<span class="hidden 2xl:block text-[10px] tracking-[0.2em] uppercase text-slate-400">Accidentes de tránsito</span>');

// Guías: Pilar primero y tiempo de lectura realista (incluye FAQ, glosario y fuentes que se muestran en la guía)
rep("const clusters = [...new Set(ARTICLES.map((a) => a.cluster))];", "const clusters = [...new Set(ARTICLES.map((a) => a.cluster))].sort((p, q) => (q === 'Pilar') - (p === 'Pilar'));");
rep(".split(/\\s+/).length / 200));", ".split(/\\s+/).length + 380) / 200));");
rep("const readMins = (a) => Math.max(2, Math.round((a.resumen", "const readMins = (a) => Math.max(2, Math.round(((a.resumen");
fs.writeFileSync('build.mjs', b);

// Clusters coherentes
let a2 = fs.readFileSync('src/articles2.mjs', 'utf8');
a2 = a2.split("cluster: 'Actores',").join("cluster: 'Actores viales',");
fs.writeFileSync('src/articles2.mjs', a2);
let f = fs.readFileSync('src/faqs.mjs', 'utf8');
if (!f.includes("'Actores viales':")) f = f.replace("  Actores: ['transporte', 'primeros', 'seguros'],", "  Actores: ['transporte', 'primeros', 'seguros'],\n  'Actores viales': ['transporte', 'primeros', 'seguros'],");
fs.writeFileSync('src/faqs.mjs', f);
console.log('patch5 listo. Anclas no encontradas:', miss);
