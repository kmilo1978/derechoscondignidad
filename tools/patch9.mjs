import fs from 'node:fs';
let miss = 0;
let a = fs.readFileSync('src/articles-extra.mjs', 'utf8').replace('tramites, coberturas', 'trámites, coberturas');
fs.writeFileSync('src/articles-extra.mjs', a);

let b = fs.readFileSync('build.mjs', 'utf8');
const rep = (x, y) => { if (!b.includes(x)) { miss++; console.log('NO ENCONTRADO:', x.slice(0, 90)); return; } b = b.replace(x, () => y); };

// Fusionar secciones adicionales de las guías
rep("ARTICLES.push(...ARTICLES2);", "ARTICLES.push(...ARTICLES2);\nfor (const art of ARTICLES) if (EXTRA_SECTIONS[art.slug]) art.sections.push(...EXTRA_SECTIONS[art.slug]);");
rep("import { ARTICLES2, SEO_TITLES } from './src/articles2.mjs';", "import { ARTICLES2, SEO_TITLES } from './src/articles2.mjs';\nimport { EXTRA_SECTIONS } from './src/articles-extra.mjs';");

// Honorarios: contenido adicional útil
rep("    <section>${h2('Modelo de la firma')}", `    <section>\${h2('Qué incluye la consulta inicial sin costo')}\${prose(['La consulta inicial no tiene costo. En ella revisamos tu caso y te explicamos tus opciones antes de cualquier decisión sobre honorarios.'])}<div class="mt-5">\${recibeHtml()}</div></section>
    <section>\${h2('Cómo comparar propuestas de honorarios')}\${tableHtml({ cap: 'Aspectos para comparar dos propuestas', head: ['Aspecto', 'Qué preguntar', 'Por qué importa'], rows: [['Base de cálculo', '¿Se calcula sobre el valor recuperado, sobre el total o sobre otra base?', 'Cambia el valor final que recibes'], ['Momento de pago', '¿Se paga al inicio, por etapas o al final?', 'Afecta tu liquidez durante el proceso'], ['Gastos del proceso', '¿Quién los adelanta y cómo se rinden cuentas?', 'Evita sorpresas durante el caso'], ['Alcance del servicio', '¿Incluye reclamación, conciliación y proceso judicial?', 'Define qué cubre el contrato'], ['Terminación anticipada', '¿Qué ocurre si cambias de abogado o terminas antes?', 'Previene conflictos futuros']] })}</section>
    <section>\${h2('Gastos del proceso: de qué hablamos')}\${prose(['Los gastos no son honorarios: son costos necesarios para tramitar el caso. Pregunta cuáles se prevén y cómo se manejarán.'])}\${bullets(['Copias y certificados de historias clínicas e informes.', 'Notificaciones y trámites ante autoridades.', 'Dictámenes y peritajes cuando sean necesarios.', 'Desplazamientos a audiencias o valoraciones.', 'Costos de pruebas específicas, según el caso.'])}</section>
    <section>\${h2('Señales de alerta antes de firmar')}\${bullets(['Promesas de resultados o de montos garantizados.', 'Presión para firmar el mismo día.', 'Ausencia de contrato escrito o cláusulas que no te explican.', 'Cobros por adelantado sin explicar a qué corresponden.', 'No identificar al abogado responsable ni su tarjeta profesional.'], 'shield')}<p class="mt-4 text-sm text-slate-500">Los abogados en Colombia están sujetos al Código Disciplinario del Abogado (Ley 1123 de 2007). Verifica su vigencia en fuentes oficiales.</p></section>
    <section>\${h2('Modelo de la firma')}`);

// Nosotros: contenido adicional
rep("    <section>${h2('Equipo')}${trustBlock('Equipo')}</section>", `    <section>\${h2('Qué hacemos y qué no hacemos')}<div class="grid md:grid-cols-2 gap-6"><div><h3 class="font-semibold text-navy-900 mb-3">Lo que sí hacemos</h3>\${bullets(['Orientar a víctimas de accidentes de tránsito y a sus familias.', 'Explicar el SOAT, las aseguradoras y la responsabilidad civil en lenguaje claro.', 'Revisar documentos y definir una ruta jurídica.', 'Acompañar la reclamación o el proceso, según el caso.'])}</div><div><h3 class="font-semibold text-navy-900 mb-3">Lo que no hacemos</h3>\${bullets(['Prometer resultados o montos de indemnización.', 'Presionar para firmar contratos o acuerdos.', 'Publicar testimonios o casos sin autorización.', 'Dar diagnósticos médicos.'], 'shield')}</div></div></section>
    <section>\${h2('Cómo trabajamos')}\${prose(['Trabajamos con cuatro principios: claridad, para que entiendas tu situación sin tecnicismos; prudencia, para no prometer lo que no podemos garantizar; transparencia, con honorarios y condiciones por escrito; y respeto por el momento difícil que atraviesa quien ha sufrido un accidente.', 'Toda la información de este sitio es orientativa y se apoya en fuentes oficiales; antes de actuar en tu caso concreto se requiere una revisión individual.'])}</section>
    <section>\${h2('Cómo atendemos')}\${bullets([\`Atención telefónica al \${SITE.phone}.\`, \`Oficina en \${SITE.address}.\`, 'Disponibilidad 24/7: si no te contestamos de inmediato, deja tu mensaje y te respondemos.', 'Consulta inicial sin costo.', 'Orientación a víctimas en Medellín y en los municipios del Valle de Aburrá.'])}<p class="mt-4">Consulta <a class="underline text-navy-900 font-medium" href="/area-metropolitana/">nuestra cobertura en el área metropolitana</a> o escríbenos desde la <a class="underline text-navy-900 font-medium" href="/contacto/">página de contacto</a>.</p></section>
    <section>\${h2('Qué esperar de tu primera consulta')}<div class="mt-2">\${recibeHtml()}</div></section>
    <section>\${h2('Equipo')}\${trustBlock('Equipo')}</section>`);

fs.writeFileSync('build.mjs', b);
console.log('patch9 listo. Anclas no encontradas:', miss);
