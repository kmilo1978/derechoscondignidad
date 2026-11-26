// DATOS REALES DE LA FIRMA. Rellenar antes de publicar.
// Mientras un campo esté vacío, el sitio no inventa nada: los botones apuntan a /contacto/
// y se muestran avisos "Pendiente de la firma" en los bloques correspondientes.
export const SITE = {
  url: 'https://derechoscondignidad.co',
  name: 'Derechos con Dignidad',
  legalName: '', // razón social real
  nit: '',
  phone: '(604) 557 5073',
  phoneDial: '+576045575073',
  whatsapp: '', // solo dígitos con indicativo, ej. '573001234567'
  email: '',
  street: 'Calle 53 # 45-112',
  address: 'Calle 53 # 45-112, Medellín, Antioquia',
  hours: 'Disponibilidad 24/7',
  mapEmbed: '', // URL de embed de Google Maps
  lawyers: [], // [{ name, tp: 'tarjeta profesional', bio, photo }]
  teamIntro: 'Profesionales con experiencia en litigio contra el Estado y defensa de los derechos humanos.',
  team: [
    { name: 'Andrés Restrepo', role: 'Derechos Humanos · Litigio', photo: 'andres-restrepo', bio: '', linkedin: '' },
    { name: 'Alejandro Botero', role: 'Reparación directa', photo: 'alejandro-botero', bio: '', linkedin: '' },
    { name: 'Yudy Elena Moreno', role: 'Acompañamiento a víctimas', photo: 'yudy-elena-moreno', bio: '', linkedin: '' },
    { name: 'Juan Esteban Montoya', role: 'Procesos y demandas', photo: 'juan-esteban-montoya', bio: '', linkedin: '' },
    { name: 'Daniel Montoya', role: 'Defensa penal y DD.HH.', photo: 'daniel-montoya', bio: '', linkedin: '' },
  ],
  testimonials: [], // [{ name, text }] solo reales y autorizados
  cases: [], // [{ slug, type, context, title, summary, work, result }] solo reales y autorizados
  gscVerification: '',
  ga4: '',
  production: false,
  published: '2026-11-26',
  lastReview: '2026-11-26',
};
