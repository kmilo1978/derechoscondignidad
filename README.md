# Derechos con Dignidad — sitio web

Sitio estático para la firma **Derechos con Dignidad**: orientación jurídica a víctimas de accidentes de tránsito en Medellín, el Valle de Aburrá y el Oriente antioqueño.

- Dominio previsto: `https://indemnizavial.co`
- Generador propio en Node (`build.mjs`) + Tailwind CSS 3.
- Salida: carpeta `dist/` (HTML estático, listo para Netlify, Vercel, Cloudflare Pages o cualquier hosting).

## Requisitos

- Node.js 20 o superior

## Comandos

```bash
npm install        # instala dependencias (solo la primera vez)
npm run build      # genera el sitio en dist/ y los documentos en docs/
npm run check      # revisa enlaces rotos y SEO básico
npm run serve      # sirve dist/ en http://localhost:5174
```

## Estructura

| Ruta | Contenido |
|---|---|
| `build.mjs` | Generador: plantillas, páginas, schema, sitemap, robots, llms.txt |
| `src/config.mjs` | Datos de la firma: nombre, teléfono, dirección, equipo, banderas (`production`, `coverageConfirmed`) |
| `src/content.mjs`, `src/services2.mjs` | Servicios (29) |
| `src/articles*.mjs` | Guías del blog (22) |
| `src/municipios.mjs` | Páginas locales (Valle de Aburrá y Oriente antioqueño) |
| `src/legal.mjs` | Política de privacidad, autorización de datos, términos y cookies |
| `src/faqs.mjs`, `src/extra.mjs` | Preguntas frecuentes, glosario, fuentes |
| `src/app.js`, `src/calc.js` | JavaScript del sitio y de la calculadora |
| `src/input.css`, `tailwind.config.js` | Estilos |
| `src/assets/` | Logo, iconos, imagen OG y fotos del equipo |
| `docs/` | Entregables SEO y auditoría (se regeneran en cada build) |
| `tools/` | Scripts de auditoría, capturas y pruebas |

## Antes de publicar

1. Completar en `src/config.mjs`: WhatsApp, correo, razón social, NIT, datos de abogados (tarjeta profesional) y GA4 si aplica.
2. Revisión jurídica de todos los textos, en especial las páginas legales.
3. Confirmar los datos de autoridades marcados como pendientes (La Ceja, El Carmen de Viboral, El Retiro).
4. Cambiar `production: true` y `coverageConfirmed: true` en `src/config.mjs` para ocultar los avisos "Pendiente de la firma".
5. `npm run build && npm run check` y publicar la carpeta `dist/`.

El contenido es informativo y no constituye asesoría jurídica.
