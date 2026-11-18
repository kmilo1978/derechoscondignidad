import fs from 'fs';
let s = fs.readFileSync('build.mjs', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('no: ' + a.slice(0, 90)); s = s.split(a).join(b); };

// Componentes de equipo (antes de HOME)
const TEAM = `
// ---------- Equipo ----------
const TEAM = SITE.team || [];
const teamPhoto = (m) => m.photo && fs.existsSync(\`src/assets/team/\${m.photo}.webp\`) ? \`/assets/team/\${m.photo}.webp\` : '';
const initials = (n) => n.split(/\\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const teamHtml = () => \`<section id="equipo" class="scroll-mt-28 bg-navy-900 text-white rounded-3xl px-5 py-8 md:p-10 -mx-1 md:-mx-6" aria-labelledby="h-equipo">
  <h2 id="h-equipo" class="text-2xl md:text-3xl font-semibold tracking-tight">Conoce nuestro equipo</h2>
  <p class="mt-2 text-slate-300 leading-relaxed">\${esc(SITE.teamIntro || '')}</p>
  <ul class="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">\${TEAM.map((m) => { const ph = teamPhoto(m); return \`<li class="group bg-white/[0.04] border border-white/10 hover:border-gold-500/60 rounded-2xl px-3 py-6 text-center transition-colors">
    \${ph ? \`<img src="\${ph}" alt="Foto de \${esc(m.name)}" width="112" height="112" loading="lazy" decoding="async" class="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/15 group-hover:ring-gold-500 transition">\` : \`<span class="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 ring-2 ring-white/15 flex items-center justify-center text-2xl font-semibold text-gold-500" aria-hidden="true">\${initials(m.name)}</span>\`}
    <p class="mt-4 font-semibold leading-snug">\${esc(m.name)}</p>
    <p class="mt-1 text-sm text-slate-300 leading-snug">\${esc(m.role)}</p></li>\`; }).join('')}</ul>
</section>\`;
const teamSchema = () => TEAM.map((m) => ({ '@context': 'https://schema.org', '@type': 'Person', name: m.name, description: m.role, worksFor: { '@id': SITE.url + '/#organization' }, ...(teamPhoto(m) ? { image: SITE.url + teamPhoto(m) } : {}) }));
`;
r('// ---------- HOME ----------', TEAM + '\n// ---------- HOME ----------');

// Nosotros: sección de equipo + aviso de datos que faltan
r("<section>${h2('Equipo')}${trustBlock('Equipo')}</section>",
  "${TEAM.length ? teamHtml() + pending('tarjeta profesional, formación y una breve biografía de cada integrante del equipo, y fotos originales en mejor resolución.') : `<section>${h2('Equipo')}${trustBlock('Equipo')}</section>`}");
r("simple({ url: '/nosotros/', title: 'Nosotros | Derechos con Dignidad',", "simple({ url: '/nosotros/', schema: teamSchema(), title: 'Nosotros | Derechos con Dignidad',");

// Copiar fotos al build
r("if (hasOG) fs.copyFileSync('src/assets/og-default.png', path.join(DIST, 'assets', 'og-default.png'));",
  "if (hasOG) fs.copyFileSync('src/assets/og-default.png', path.join(DIST, 'assets', 'og-default.png'));\n  if (fs.existsSync('src/assets/team')) fs.cpSync('src/assets/team', path.join(DIST, 'assets', 'team'), { recursive: true });");

// LLM: equipo
r("    '## Sobre la firma',\n    [`- [Nosotros](${SITE.url}/nosotros/)`, `- [Contacto](${SITE.url}/contacto/)`].join('\\n'),",
  "    '## Sobre la firma',\n    [`- [Nosotros](${SITE.url}/nosotros/)`, `- [Contacto](${SITE.url}/contacto/)`].join('\\n'),\n    ...(TEAM.length ? ['## Equipo', (SITE.teamIntro ? SITE.teamIntro + '\\n' : '') + TEAM.map((m) => `- ${m.name}: ${m.role}`).join('\\n')] : []),");
r("'## Preguntas frecuentes generales', FAQ_GENERAL",
  "...(TEAM.length ? ['## Equipo', (SITE.teamIntro || '') + '\\n' + TEAM.map((m) => '- ' + m.name + ': ' + m.role).join('\\n')] : []),\n    '## Preguntas frecuentes generales', FAQ_GENERAL");
fs.writeFileSync('build.mjs', s);
console.log('ok');
