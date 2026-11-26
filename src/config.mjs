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
  email: 'contacto@tu-dominio.com',
  street: 'Calle 53 # 45-112',
  address: 'Calle 53 # 45-112, Edificio Centro Colseguros, Medellín, Antioquia',
  hours: 'Disponibilidad 24/7',
  mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=-75.5677%2C6.2478%2C-75.5597%2C6.2528&layer=mapnik&marker=6.250307%2C-75.563698',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Calle+53+%23+45-112,+Medellin,+Antioquia',
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
  cases: [
    {
      slug: 'union-patriotica-corte-idh',
      type: 'Corte IDH · Litigio internacional',
      instance: 'Corte Interamericana de Derechos Humanos',
      title: 'Integrantes y Militantes de la Unión Patriótica vs. Colombia',
      context:
        'Proceso internacional por la persecución sistemática y las violaciones graves de derechos humanos cometidas desde 1984 y durante más de veinte años contra más de 6.000 integrantes y simpatizantes de la Unión Patriótica, incluidas afectaciones a la vida, la libertad personal, las garantías judiciales, la honra y la protección judicial.',
      work:
        'Derechos con Dignidad actuó como interviniente común junto al Centro Jurídico de Derechos Humanos y fue reconocida expresamente como peticionaria por la Corte Interamericana de Derechos Humanos, participando también en las resoluciones de supervisión de cumplimiento y en la sentencia de interpretación de 2024.',
      result:
        'Mediante sentencia del 27 de julio de 2022, la Corte IDH declaró la responsabilidad internacional del Estado colombiano y ordenó 17 medidas de reparación integral.',
      sources: [
        ['Resumen oficial - Ministerio de Justicia', 'https://www.minjusticia.gov.co/Sala-de-prensa/Documents/resumen-455-esp.pdf'],
        ['Compilación - Defensoría del Pueblo', 'https://forseti.defensoria.gov.co/gestor/compilacion/docs/DTO_CIDH_07-27_2022.htm'],
        ['Resolución - Jurisprudencia Corte IDH', 'https://jurisprudencia.corteidh.or.cr/pdf_viewer/972647611'],
      ],
    },
    {
      slug: 'macrocaso-06-union-patriotica-jep',
      type: 'JEP · Justicia transicional',
      instance: 'Jurisdicción Especial para la Paz (Sala de Reconocimiento)',
      title: 'Macrocaso 06: Victimización de miembros de la Unión Patriótica',
      context:
        'Macrocaso abierto en 2019 en el que la JEP ha determinado un universo de 5.733 víctimas de la Unión Patriótica, con más de 212 víctimas individuales acreditadas y el reconocimiento de la UP, el Partido Comunista Colombiano (PCC) y Sintramienergética como sujetos colectivos.',
      work:
        'Representación judicial de víctimas, acompañamiento para su acreditación y aporte al escrito de observaciones del subcaso Urabá, en articulación con organizaciones como CAJAR, Forjando Futuros y el Comité Permanente por la Defensa de los Derechos Humanos.',
      result:
        'La Sala de Reconocimiento calificó el ataque contra la Unión Patriótica como genocidio e imputó responsabilidad penal a cinco altos mandos retirados del Ejército por el exterminio del partido.',
      sources: [
        ['Macrocaso 06 - JEP', 'https://www.jep.gov.co/macrocasos/caso06.html'],
        ['Comunicado oficial - JEP', 'https://www.jep.gov.co/Sala-de-Prensa/Paginas/-la-jep-califica-el-ataque-contra-la-union-patriotica-up-como-genocidio-e-imputa-responsabilidad-penal-a-cinco-altos-mandos.aspx'],
      ],
    },
    {
      slug: 'masacre-el-topacio-san-rafael',
      type: 'JEP · Impulso de casos en impunidad',
      instance: 'Jurisdicción Especial para la Paz',
      title: 'Masacre de El Topacio: 14 mineros en San Rafael, Antioquia',
      context:
        'Masacre de 14 mineros en San Rafael, Antioquia, que acumulaba más de tres décadas sin justicia efectiva y no figuraba entre los siete casos inicialmente priorizados por la JEP.',
      work:
        'El abogado Andrés Restrepo representa a las víctimas del caso. En 2020 se presentó un informe ante la JEP solicitando la investigación formal de los hechos y argumentando que la masacre se enmarca en el exterminio contra la Unión Patriótica.',
      result:
        'Caso documentado e impulsado ante la justicia transicional para exigir verdad, investigación judicial y reconocimiento de las víctimas.',
      sources: [
        ['Informe de prensa sobre el caso', 'https://www.eltiempo.com/justicia/investigacion/masacre-de-14-mineros-en-san-rafael-antioquia-lleva-32-anos-sin-justicia-506460'],
      ],
    },
  ],
  gscVerification: '',
  ga4: '',
  production: false,
  published: '2026-11-26',
  lastReview: '2026-11-26',
};
