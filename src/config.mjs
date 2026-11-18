// DATOS REALES DE LA FIRMA. Rellenar antes de publicar.
// Mientras un campo esté vacío, el sitio no inventa nada: los botones apuntan a /contacto/
// y se muestran avisos "pendiente" en los bloques de confianza.
export const SITE = {
  url: 'https://indemnizavial.co',
  name: 'Derechos con Dignidad',
  legalName: '', // razón social real
  phone: '(604) 557 5073', // se muestra tal cual
  phoneDial: '+576045575073', // formato internacional para enlaces tel:
  whatsapp: '', // solo dígitos con indicativo, ej. '573001234567'
  email: '',
  street: 'Calle 53 # 45-112', // para datos estructurados
  address: 'Calle 53 # 45-112, Medellín, Antioquia',
  hours: 'Disponibilidad 24/7',
  mapEmbed: '', // URL de embed de Google Maps
  lawyers: [], // [{ name, tp: 'tarjeta profesional', bio, photo }]
  // Equipo publicado en "Nosotros" (datos entregados por la firma). Fotos provisionales recortadas de una captura:
  // reemplazar por los originales en src/assets/team/<slug>.webp (cuadradas, mínimo 400 × 400 px).
  teamIntro: 'Profesionales con experiencia en litigio contra el Estado y enfoque en derechos humanos.',
  team: [
    { name: 'Andrés Restrepo', role: 'Derechos Humanos · Litigio', photo: 'andres-restrepo' },
    { name: 'Alejandro Botero', role: 'Reparación directa', photo: 'alejandro-botero' },
    { name: 'Yudy Elena Moreno', role: 'Acompañamiento a víctimas', photo: 'yudy-elena-moreno' },
    { name: 'Juan Esteban Montoya', role: 'Procesos y demandas', photo: 'juan-esteban-montoya' },
    { name: 'Daniel Montoya', role: 'Defensa penal y DD.HH.', photo: 'daniel-montoya' },
  ],
  testimonials: [], // [{ name, text }] solo reales y autorizados
  cases: [], // [{ slug, title, summary }] solo documentados y autorizados
  gscVerification: '', // código de verificación de Search Console
  coverageConfirmed: false, // poner true cuando la firma confirme cobertura en cada municipio
  ga4: '', // ej. 'G-XXXXXXXXXX'
  published: '2026-11-17',
  lastReview: '2026-11-17',
};
