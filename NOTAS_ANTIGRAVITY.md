# Notas de proyecto - Derechos con Dignidad

## Nueva sesión
- Fecha: 2026-11-26
- Solicitud: Clonar plantilla base en carpeta nueva, desvincular repositorio anterior, conectar nuevo GitHub (`kmilo1978/derechoscondignidad`), adaptar estructura y contenidos de Áreas de Acción y Procesos y Demandas sin emoticones, con enlaces externos a estamentos del Estado y migas de pan.
- Decisiones clave:
  - Se conservó la paleta de colores (`navy` y `gold`), el logotipo (`src/assets/logo.svg`) y los iconos SVG de la plantilla.
  - Se unificaron los contenidos duplicados (Ejecuciones extrajudiciales, Unión Patriótica e Indemnizaciones estables) en 15 páginas de áreas y procesos organizadas en 3 categorías (`src/areas.mjs`).
  - Se creó `src/entities.mjs` para enlazar externamente (`target="_blank" rel="noopener noreferrer"`) las menciones a estamentos del Estado y organismos internacionales (JEP, CIDH, Corte IDH, OEA, Consejo de Estado, Fiscalía, ARN, Ejército, Policía, Fuerza Pública, ONU, SIC).
  - Se implementaron migas de pan accesibles (`nav[aria-label="Migas de pan"]`) en todas las páginas interiores y de detalle.
  - Se dejaron pendientes los datos reales de WhatsApp, correo, mapa de Google Maps, perfiles ampliados del equipo y hasta 5 casos relevantes autorizados.
- Pendientes:
  - Recibir perfiles detallados del equipo, casos relevantes, datos finales de contacto y optimización SEO para una siguiente fase.

## Validación completada
- Fecha: 2026-11-26
- Resultado: Aprobado (build, check-links, check-seo y verificación en navegador en escritorio y móvil sin errores).
- Observaciones: Corregido el selector CSS `.breadcrumb ol` en `src/input.css` tras detectar en navegador que inicialmente apilaba en vertical; verificado posteriormente en una sola línea horizontal.

## Validación completada (SEO On-Page, LLM, Imágenes, Velocidad y Favicon)
- Fecha: 2026-11-26
- Resultado: Aprobado (0 enlaces rotos, 0 problemas SEO/técnicos en 26 archivos HTML).
- Observaciones: Se generaron `favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `icon-512.png`, `og-default.png` actualizado, foto del equipo convertida a WebP (`28.4 KB`), precarga de imagen hero LCP, `sitemap.xml`, `robots.txt`, `.htaccess`, `llms.txt` y `llms-full.txt`, además de bloques de respuesta directa y FAQPage JSON-LD.
