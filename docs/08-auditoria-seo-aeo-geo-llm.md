# Auditoría integral SEO + AEO + GEO + LLM — Derechos con Dignidad

**Alcance:** build local del sitio (`dist/`, 76 archivos HTML, 73 URLs en el sitemap) con rastreo propio y Lighthouse (móvil simulado).
**Fecha:** 17-nov-2026. **Dominio previsto:** indemnizavial.co.

## 0. Límites de esta auditoría (leer primero)

El sitio **todavía no está publicado**. Por eso no se pudo medir y NO se afirma nada sobre:
indexación real en Google, posiciones, tráfico, datos de campo de Core Web Vitals (CrUX), backlinks, Google Business Profile, reseñas, SERPs ni citaciones reales en ChatGPT/Gemini/Perplexity.
Todo lo medido es del código y de pruebas de laboratorio. Las puntuaciones de abajo son **estimaciones de madurez** basadas en esa evidencia, no mediciones oficiales.

## 1. Resumen ejecutivo

| Área | Madurez estimada | Veredicto |
|---|---|---|
| SEO técnico on-site | 85 / 100 | Muy sólido: HTML estático, canonical y breadcrumbs en todas las páginas, 0 enlaces rotos, 0 huérfanas, Lighthouse SEO 100 |
| Contenido y semántica | 70 / 100 | Buena cobertura temática; páginas finas, municipios con similitud alta y varias oportunidades de consolidación |
| AEO / GEO / LLM | 72 / 100 | Estructura muy "citable" (respuesta rápida, FAQ, tablas, glosario, llms.txt); falta declarar la entidad con claridad y fuentes propias |
| E-E-A-T / YMYL | 30 / 100 | **Mayor debilidad:** sin abogado identificado, sin tarjeta profesional, sin casos ni testimonios, revisión jurídica "pendiente" visible |
| SEO local / Maps | 40 / 100 | NAP ya correcto (Calle 53 # 45-112, (604) 557 5073); faltan mapa, GBP, reseñas y señales locales |
| Off-page / autoridad | sin datos | No evaluable sin dominio publicado |

### Las 10 prioridades, en orden
1. **Quitar o condicionar los 47 avisos "Pendiente de la firma"** visibles en 45 páginas (hoy dañan confianza y calidad percibida).
2. **Identificar a los abogados** (nombre, tarjeta profesional, bio, foto) y mostrarlos como autor y revisor de cada contenido (Person + `author` en Article).
3. **Definir la entidad en una frase** en la home y en `/nosotros/` (quién es, qué hace, dónde, para quién) y reflejarla en `LegalService`.
4. **Ampliar `LegalService`** con `sameAs`, `openingHoursSpecification` (24/7), `geo`, `hasMap`, `priceRange` (o texto "consulta sin costo"), `contactPoint`.
5. **Diferenciar de verdad las 9 páginas de municipios** (similitud media 46,5 %) o dejarlas `noindex` hasta tener contenido local verificable.
6. **Corregir el contraste** del texto dorado pequeño (ratio 2,6–2,9; mínimo 4,5) — es el único fallo de accesibilidad relevante.
7. **Reducir el TBT** (450–520 ms en laboratorio): menos DOM por página, `content-visibility`, scroll con `requestAnimationFrame`.
8. **Ampliar las 9 páginas finas** (<600 palabras) y crear las páginas faltantes (§7).
9. **Añadir `lastmod`** al sitemap y publicar en Search Console, Bing y IndexNow.
10. **Publicar y medir**: Search Console, GA4, Google Business Profile y ficha en directorios con NAP idéntico.

## 2. SEO técnico

### Lo que está bien (evidencia)
- Una sola `h1` por página indexable; `lang="es-CO"`; canonical autorreferente en todas (el único "sin canonical" es la 404, que es noindex).
- `title` único en las 73 URLs indexables; 0 títulos >70 caracteres (13 entre 61 y 68).
- Breadcrumbs visibles y `BreadcrumbList` en 72 páginas; profundidad máxima de clics 2.
- 0 enlaces internos rotos; 0 páginas huérfanas; promedio de 70 enlaces internos por página.
- `robots.txt` correcto (no bloquea nada, separa `OAI-SearchBot` y `GPTBot`); landings de pauta `noindex, follow` con canonical a la página de servicio.
- Sin imágenes pesadas, sin fuentes web, CSS 25 KB, JS propio 11 KB, 0 dependencias de terceros.
- Lighthouse (móvil simulado): **SEO 100, Buenas prácticas 100, Accesibilidad 96, Rendimiento 86–89**; LCP 1,1–1,6 s, **CLS 0**.
- Open Graph y Twitter Card ya en las 76 páginas (se añadieron con la imagen social).

### Hallazgos y soluciones

| # | Hallazgo | Impacto | Solución | Prioridad |
|---|---|---|---|---|
| T1 | Sitemap sin `<lastmod>` (0 de 73) | Rastreo menos eficiente; sin señal de frescura | Generar `lastmod` real desde `SITE.lastReview` o por página; reenviar en GSC/Bing | Alta |
| T2 | TBT 450–520 ms en laboratorio; el JS propio solo ocupa ~15 ms, el coste está en *Style & Layout* (1,1 s) y reflujo forzado en `app.js` línea 32 | Riesgo para INP en móviles lentos | `content-visibility:auto` en secciones bajo el pliegue; leer `scrollHeight` una vez y throttlear con `requestAnimationFrame`; reducir DOM de home/servicios | Media |
| T3 | CSS bloqueante (~160 ms estimados) y 52 % sin usar por página | LCP/FCP algo peores | Inyectar el CSS crítico en línea o partir el CSS por plantilla; `preload` del stylesheet | Media |
| T4 | Contraste insuficiente del color `gold-600` (#b4941f) en textos pequeños: 2,61–2,91:1 | Accesibilidad (WCAG AA) y señal de calidad | Usar un dorado oscuro (p. ej. #8a6d12) para texto, y el dorado actual solo en fondos/bordes | Alta |
| T5 | Hay 3 páginas con saltos de nivel de encabezado: privacidad y tratamiento de datos (indexables) y la 404 | Menor, accesibilidad | Corregir la plantilla `simple()` para no saltar de h1 a h3 | Baja |
| T6 | 7 descripciones <120 caracteres y 3 >160 | CTR/truncado | Reescribir a 130–155 caracteres con intención y llamada a la acción | Baja |
| T7 | Sin favicon PNG/apple-touch-icon ni `manifest` | Menor | Generar 180×180 y 512×512 desde el logo | Baja |
| T8 | No verificable en local: HTTPS, redirección www/no-www, HSTS, cabeceras, compresión Brotli, caché | Rastreo y seguridad | Checklist de despliegue: 301 a una sola versión, HSTS, `Cache-Control` largo para `/assets/`, CSP | Alta (al publicar) |
| T9 | `hreflang` no definido | Solo relevante si habrá otros idiomas/países | Mantener `es-CO` único; añadir `x-default` solo si hay variantes | Baja |
| T10 | Páginas por municipio y landings: la señal `noindex` en `/lp/` es correcta; **no** añadirles `Disallow` en robots (impediría ver el noindex) | — | Mantener como está | — |

## 3. Auditoría semántica y de contenido

### ¿Pueden Google y los LLM entender la entidad?
| Pregunta | Estado | Evidencia / brecha |
|---|---|---|
| ¿Quién es? | **Parcial** | El nombre ya es "Derechos con Dignidad", pero no hay una definición explícita ("Derechos con Dignidad es una firma de abogados especializada en…") ni razón social, NIT ni equipo |
| ¿Qué servicios ofrece? | Bien | 29 páginas de servicio + hubs + glosario |
| ¿A quién se dirige? | Bien | Víctimas y familiares; selector de situaciones |
| ¿Dónde? | Bien | Calle 53 # 45-112, Medellín; Valle de Aburrá; páginas de municipios |
| ¿Qué problemas resuelve? | Muy bien | Cada servicio tiene "entender el problema", perjuicios, escenarios, errores |
| ¿Diferenciales? | **Débil** | "Atención humana, consulta sin costo, defensa experta, 24/7" son afirmaciones sin prueba; `/nosotros/` tiene solo 322 palabras |
| ¿Qué experiencia/autoridad la respalda? | **Muy débil** | Sin abogados, tarjetas, casos, reseñas ni publicaciones firmadas |

### Cobertura y profundidad
- **Cobertura de intención:** transaccional (home, 29 servicios), informacional (22 guías, glosario), comparativa (SOAT vs demanda civil), herramienta (calculadora), local (hub + 9 municipios). Muy completa para el nicho.
- **Longitud:** mediana 838 palabras; máximo 1.426. **11 páginas bajo 600 palabras:** 7 guías (533–568), `/honorarios-cuota-litis/` (391), `/nosotros/` (322) y las 2 políticas legales (no necesitan ampliarse).
- **Duplicidad (similitud de 6-gramas):** servicios 27,6 % medio (aceptable); guías 9,1 % (excelente); **municipios 46,5 % medio, máx. 49,9 %** (riesgo de *doorway pages*).
- **Preguntas repetidas:** 285 distintas, pero 5 aparecen en más de 8 páginas (p. ej. "¿El SOAT cubre aunque yo haya tenido la culpa?" en 12). Es contenido compartido, no tóxico, pero conviene variar la redacción por contexto.

### Canibalización probable (y rol recomendado)
| Grupo | URLs | Riesgo | Recomendación |
|---|---|---|---|
| SOAT | `/servicios/soat/`, `/blog/soat-cuanto-cubre/`, `/blog/reclamar-soat-paso-a-paso/` (similitud 30 %), `/servicios/gastos-medicos-superan-soat/` | Alto | Servicio = transaccional; guías = informacional con consultas distintas. Fusionar "reclamar paso a paso" dentro de "cuánto cubre" **o** diferenciarla claramente (solo trámite y documentos) |
| Lesiones | `/servicios/lesiones-personales/` vs `/servicios/lesiones-graves/` | Medio | `lesiones-personales` como pilar/índice; `lesiones-graves` solo secuelas permanentes |
| Plataformas | `/servicios/accidentes-plataformas/` vs `/blog/domiciliarios-plataformas-accidente/` | Medio | Servicio para pasajeros; guía para domiciliarios, con enlaces cruzados |
| Actores viales | `/blog/guia-motociclista-lesionado/` vs `/servicios/accidentes-moto/` | Bajo-medio | Mantener rol informacional vs comercial |
| Vía/Estado | `/servicios/accidentes-vias-mal-estado/` y `/servicios/accidentes-senalizacion-semaforos/` (39,5 %) | Medio | Distinguir mantenimiento (huecos) de fallas de control (semáforos) o fusionar |
| Municipios | 9 títulos con el mismo patrón | Medio | Títulos y H1 con ángulo local propio (vía, autoridad, hospitales) |

## 4. AEO / GEO / LLM

### Fortalezas verificadas
- **Respuesta directa al inicio** de cada servicio, guía, municipio, hub, calculadora y recurso ("Respuesta rápida" / "En resumen").
- **Estructura pregunta-respuesta:** ≥ 6 preguntas en todas las páginas de contenido (71 con `FAQPage` coherente con lo visible).
- **Tablas comparativas con `caption`**, listas y pasos numerados, glosario con 25 términos y `DefinedTermSet`.
- **Fuentes oficiales** enlazadas (ADRES, Superfinanciera, Medicina Legal, RUNT, Senado, SUIN) con aviso de verificar vigencia.
- **Rastreo para IA:** `robots.txt` con `OAI-SearchBot` y `GPTBot` separados; `llms.txt` y `llms-full.txt` (95 KB de contenido en Markdown).
- **Prudencia en afirmaciones jurídicas:** sin cifras, plazos ni resultados, lo que reduce el riesgo de que un modelo cite datos falsos.

### Brechas y soluciones
| # | Brecha | Por qué importa a un LLM | Solución |
|---|---|---|---|
| A1 | No hay una **definición de la entidad** en lenguaje natural ni triples SPO consistentes | Los modelos citan entidades que pueden describir en una frase | Añadir en home, `/nosotros/` y `llms.txt`: *"Derechos con Dignidad (sujeto) es una firma de abogados (predicado) especializada en accidentes de tránsito en Medellín y el Valle de Aburrá (objeto)"*, más: "atiende en la Calle 53 # 45-112", "ofrece consulta inicial sin costo", "está disponible 24/7" |
| A2 | `LegalService` sin `sameAs`, `openingHoursSpecification`, `geo`, `hasMap`, `priceRange`, `contactPoint`, `founder/employee` | Faltan atributos que los motores usan para desambiguar la entidad | Completar con datos reales (ver §6) |
| A3 | `Article` con `author` = organización, sin `Person` ni `reviewedBy` | Señal débil de autoría en contenido YMYL | Crear `Person` por abogado y usar `author` y `reviewedBy` |
| A4 | Consultas conversacionales sin respuesta clara: **"¿cuánto cuesta?"** (solo "consulta sin costo"), **"¿qué abogado lo atiende?"**, **"¿en cuánto tiempo?"** | Un asistente no puede responderlas con este sitio | Publicar: política de honorarios real (en la página de honorarios), nombres/roles, y un cronograma de etapas con rangos validados por la firma |
| A5 | Los "tiempos estimados" prometidos en "¿Qué recibes?" no están respaldados por contenido | Incoherencia entre promesa y evidencia | Añadir una sección "Etapas y tiempos orientativos" validada, o retirar la promesa |
| A6 | Las afirmaciones "Defensa experta", "Consulta sin costo", "24/7" no tienen prueba ni condiciones | Los modelos tienden a no citar afirmaciones sin sustento; además hay riesgo de publicidad engañosa | Añadir condiciones ("qué incluye la consulta sin costo") y pruebas (experiencia, casos autorizados) |
| A7 | Sin contenido original verificable (datos propios, casos, entrevistas) | Los modelos prefieren fuentes primarias | Publicar casos documentados y autorizados, y datos de siniestralidad **con fuente oficial** (guía pendiente del plan) |
| A8 | FAQ repetida entre páginas | Dilución | Variar respuestas por contexto |

### Coherencia contenido visible ↔ datos estructurados
Correcta: el `FAQPage` se genera de la misma lista que se muestra; `Service`, `WebPage`, `Article` y `BreadcrumbList` coinciden con el contenido. **No se recomienda** añadir `Review`, `AggregateRating`, `Offer` con precios ni `Attorney` con credenciales mientras no existan datos reales y visibles. Tampoco se debe esperar rich result de FAQ (Google lo restringe a ciertos sitios): el valor está en estructura y comprensión.

### Prueba conversacional (¿puede un asistente responder con este sitio?)
| Consulta | ¿Se puede responder hoy? |
|---|---|
| ¿Qué servicios ofrece Derechos con Dignidad? | Sí (home, hubs, llms.txt) |
| ¿Dónde se encuentra? | Sí (dirección y teléfono en pie, contacto y schema) |
| ¿Cuánto cuesta el servicio? | **Parcial:** "consulta sin costo", pero no los honorarios |
| ¿Quién atiende mi caso? | **No** |
| ¿Qué lo diferencia de otras opciones? | **Débil** |
| ¿Qué hago si el SOAT se agotó? | **Sí, muy bien** |
| ¿Cuánto me pagarán? | Responde correctamente que no hay montos fijos; calculadora orientativa |

## 5. E-E-A-T y contenido YMYL (legal)

Es la mayor brecha y la que más puede limitar el posicionamiento en un nicho legal.
- 47 avisos "Pendiente de la firma" **visibles** en 45 páginas (revisión jurídica, abogado responsable, mapa, honorarios).
- Sin abogados, tarjeta profesional, fotos reales, casos ni testimonios.
- Contenido jurídico **sin revisión por abogado** (el propio sitio lo declara).
- Logo provisional (recreación en SVG).

**Solución:** no publicar hasta que (1) un abogado revise y firme el contenido, (2) existan perfiles reales de abogados, (3) se oculten los avisos en producción (flag `production`), (4) haya al menos 3–5 casos autorizados o reseñas verificables.

## 6. SEO local y Google Maps

| Elemento | Estado | Acción |
|---|---|---|
| NAP en sitio y schema | ✔ Calle 53 # 45-112, Medellín · (604) 557 5073 | Mantener idéntico en GBP y directorios |
| Google Business Profile | Sin verificar (fuera del sitio) | Crear/verificar; categoría "Abogado" / "Abogado especialista en lesiones personales"; horario 24/7 real; servicios y área de servicio |
| Mapa embebido | Pendiente (`mapEmbed` vacío) | Añadir en `/contacto/` y home |
| Reseñas | Sin datos | Solicitar a clientes reales, sin incentivos ni guiones |
| `geo`, `hasMap`, `openingHoursSpecification` | Faltan | Añadir al `LegalService` |
| Fotos reales (oficina, equipo) | Faltan | Subir al sitio (con `alt`) y a GBP |
| WhatsApp | Sin número | Con WhatsApp aumenta la conversión local; hoy los CTA son llamada y formulario |
| Páginas de municipios | 9 creadas, cobertura sin confirmar | Confirmar cobertura (`coverageConfirmed`) y diferenciar el contenido (§3) |
| Citas locales (directorios) | Sin datos | Colegio de abogados, directorios jurídicos, cámaras de comercio, con NAP idéntico |

## 7. Páginas que deberían existir y no están

**Alta prioridad (afectan a conversión y confianza):**
- `/abogados/` y un perfil por abogado (Person).
- `/casos-de-exito/` y `/testimonios/` (solo reales y autorizados; el generador ya las crea cuando hay datos).
- Página de **incapacidad permanente / pérdida de capacidad laboral** (figura en el brief y no existe como servicio).
- Sección **"Etapas y tiempos"** (o ampliar `/honorarios-cuota-litis/` a ≥1.000 palabras con política real).

**Media:**
- Landing de **Medicina Legal y valoración** (hoy solo guía) y de **Junta de Calificación**.
- Guías pendientes del plan: *Cuánto pagan por fractura* ya existe; faltan **siniestralidad en Medellín (con datos oficiales)**, **cuánto cuesta demandar**, **qué hacer si me chocan en moto** (hoy cubierto de forma general), **la EPS y el accidente de tránsito**.
- Servicios por lesión diferenciales: rodilla/ligamentos, hombro, tobillo/pie, costillas, mano/dedos (Excel; hoy consolidados).
- Menores y adultos mayores; patinetas eléctricas; vehículos pesados (prioridad baja).

**Baja / condicionadas:**
- Rionegro y otros municipios fuera del Valle de Aburrá (no están en la zona metropolitana).
- Calculadora v2 con metodología validada por abogado.

## 8. Plan de acción

### Días 1–30 (antes de publicar)
1. Revisión jurídica y flag `production` que oculte los avisos y bloquee la publicación si faltan datos clave.
2. Perfiles de abogados + `Person` + `author`/`reviewedBy`.
3. Definición de entidad (home, nosotros, llms.txt) y `LegalService` ampliado.
4. Contraste del dorado, `lastmod` en sitemap, reflujo del scroll.
5. Ampliar honorarios y nosotros; reescribir 7 meta descriptions.
6. Logo definitivo (original en `src/assets/logo.png`) y fotos reales.

### Días 31–60
7. Diferenciar o poner `noindex` temporal a municipios sin contenido local propio.
8. Resolver canibalizaciones SOAT/lesiones/plataformas (§3).
9. Página de incapacidad permanente y de etapas/tiempos; casos y testimonios reales.
10. GBP, mapa, reseñas y citas locales; Search Console, Bing Webmaster, GA4 y IndexNow.

### Días 61–90
11. Medir: impresiones, CTR y posiciones por URL/cluster; Core Web Vitals de campo; conversiones (llamada, formulario).
12. Guías con datos oficiales de siniestralidad y estudios de caso.
13. Pruebas conversacionales mensuales en ChatGPT, Gemini y Perplexity con las consultas de la §4 y registro de citaciones.

## 9. KPIs de seguimiento
Search Console (impresiones, clics, CTR, posición por URL), indexación y errores, Core Web Vitals de campo, clics a llamada/formulario, calidad de leads, y apariciones/citaciones en respuestas de IA (registro manual mensual).

---
*Informe orientativo. Basado en la evidencia disponible localmente; no sustituye una auditoría con el sitio publicado y datos de Search Console.*


---

## 10. Estado de implementación (actualización)

Aplicado tras la auditoría (excluye E-E-A-T y la información de precios/abogados/tiempos, que se resolverán después):

| Hallazgo | Estado | Resultado medido |
|---|---|---|
| Municipios casi duplicados (similitud 46,5 %) | **Resuelto** | Similitud media **16,4 %** (máx. 22,8 %); 947–1.070 palabras por página. Datos locales verificados: autoridad de tránsito, dirección y enlaces oficiales de cada municipio, escenarios locales y preguntas propias |
| Páginas bajo 600 palabras | **Resuelto** | 7 guías, honorarios y nosotros ampliados. Solo quedan bajo 600 las 2 páginas legales (privacidad y tratamiento de datos), que por naturaleza son breves |
| T1 Sitemap sin `lastmod` | **Resuelto** | 73 de 73 URLs con `lastmod` |
| T4 Contraste del dorado y grises | **Resuelto** | Accesibilidad Lighthouse **100** en home y servicio |
| T2/T3 TBT y rendimiento | **Mejorado** | Servicio: rendimiento 87 → **97** (TBT 710 → 180 ms); home 86 → **91**; LCP 1,1–1,2 s; CLS 0 |
| T5 Saltos de encabezados | **Resuelto** | 0 saltos (los títulos del pie ya no son encabezados) |
| T6 Meta descriptions fuera de rango | **Resuelto** | 0 menores de 120 o mayores de 160 caracteres |
| T7 Iconos PNG / manifest | **Resuelto** | `apple-touch-icon.png`, `icon-512.png` y `site.webmanifest` |
| OG / Twitter Card | **Resuelto** | 76 de 76 páginas con imagen social |
| A1 Definición de la entidad | **Resuelto** | Bloque "¿Quiénes somos?" en la home, `llms.txt` y schema con descripción |
| A2 `LegalService` ampliado | **Parcial** | Añadidos descripción, `openingHoursSpecification` 24/7, `contactPoint`, `areaServed` (Medellín + 9 municipios), logo e imagen. **Pendiente**: `geo`, `hasMap`, `sameAs`, `priceRange` (requieren datos reales) |
| Avisos "pendiente" visibles | **Preparado** | Bandera `SITE.production`: al ponerla en `true` se ocultan. Se deja en `false` mientras faltan los datos |

**Sobre la longitud:** Google indica que no existe una longitud ideal y que importa aportar valor y completitud; las guías del sector sitúan consultas simples entre 700 y 1.200 palabras y las competitivas entre 1.500 y 2.500. Estado actual: servicios 983–1.428, municipios 947–1.070, guías 603–999 (mediana 747). Las guías más cortas son las candidatas a ampliar con datos propios cuando existan (casos, cifras oficiales).

**Pendiente a propósito:** E-E-A-T (abogados, tarjeta profesional, casos, testimonios), respuestas a "¿cuánto cuesta?", "¿quién me atiende?" y "tiempos estimados", mapa y Google Business Profile, `geo`/`sameAs`, y la resolución de canibalización SOAT/lesiones/plataformas.
