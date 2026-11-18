# Especificación técnica

- **Arquitectura**: sitio estático generado con Node (`build.mjs`) + Tailwind CSS 3 compilado (sin CDN). Salida en `dist/`, desplegable en cualquier hosting estático/CDN con HTTPS.
- **Rendimiento**: sin JS de terceros por defecto; fuentes del sistema; iconos SVG inline; CSS minificado; sin imágenes pesadas. Medir Core Web Vitals (LCP, INP, CLS) con datos de campo tras publicar.
- **SEO on-page**: un H1 por página, title y meta únicos, canonical, breadcrumbs visibles con `BreadcrumbList`, enlaces internos contextuales, glosario y respuesta rápida al inicio de cada página.
- **Datos estructurados**: `LegalService` (solo datos reales configurados), `WebSite`, `WebPage`, `Service`, `Article`, `FAQPage`, `DefinedTermSet`, `Person` (solo si hay abogados). No se marcan reseñas, calificaciones ni resultados. Validar con las herramientas oficiales antes de publicar. No se promete resultado enriquecido de FAQ.
- **Rastreo e IA**: `robots.txt` con reglas separadas para `OAI-SearchBot` y `GPTBot` (decisión del titular), `sitemap.xml` solo con URLs canónicas indexables, `llms.txt` y `llms-full.txt`. IndexNow: evaluar; no garantiza indexación.
- **Landings de pauta**: `/lp/*`, noindex, header/footer mínimos, canonical a la página de servicio.
- **Analítica y eventos**: GA4 (si hay ID) y `dataLayer`: `click_whatsapp`, `click_call`, `form_submit` con ubicación. Configurar Search Console y marcar conversiones en GA4.
- **Accesibilidad**: skip link, foco visible, etiquetas de formulario, `prefers-reduced-motion`, tablas con encabezados, contraste revisado.
- **Seguridad**: HTTPS y cabeceras en el hosting (CSP, HSTS, X-Content-Type-Options), protección anti-spam en el endpoint del formulario cuando se conecte.
- **QA automático**: `npm run check` (enlaces rotos, títulos/metas únicos y longitud, H1, JSON-LD válido, anclas, páginas huérfanas).
- **Redirecciones/404**: `404.html` incluida; configurar 301 en el hosting si cambian URLs.
