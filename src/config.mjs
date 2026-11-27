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
  mapEmbed: 'https://maps.google.com/maps?q=6.250307,-75.563698+(Derechos%20con%20Dignidad)&hl=es&z=17&output=embed',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Calle+53+%23+45-112,+Medellin,+Antioquia',
  lawyers: [], // [{ name, tp: 'tarjeta profesional', bio, photo }]
  teamIntro: 'Profesionales con experiencia en litigio contra el Estado y defensa de los derechos humanos.',
  team: [
    { name: 'Andrés Restrepo', role: 'Derechos Humanos · Litigio', photo: 'andres-restrepo', bio: '', linkedin: '', email: '' },
    { name: 'Alejandro Botero', role: 'Reparación directa', photo: 'alejandro-botero', bio: '', linkedin: '', email: '' },
    { name: 'Yudy Elena Moreno', role: 'Acompañamiento a víctimas', photo: 'yudy-elena-moreno', bio: '', linkedin: '', email: '' },
    { name: 'Juan Esteban Montoya', role: 'Procesos y demandas', photo: 'juan-esteban-montoya', bio: '', linkedin: '', email: '' },
    { name: 'Daniel Montoya', role: 'Defensa penal y DD.HH.', photo: 'daniel-montoya', bio: '', linkedin: '', email: '' },
    { name: 'Leydy', role: 'Ayudante jurídico', photo: 'leydy', bio: '', linkedin: '', email: '' },
    { name: 'Mariana', role: 'Ayudante jurídico', photo: 'mariana', bio: '', linkedin: '', email: '' },
    { name: 'Sandra', role: 'Ayudante jurídico', photo: 'sandra', bio: '', linkedin: '', email: '' },
    { name: 'Juan Andrés', role: 'Ayudante jurídico', photo: 'juan-andres', bio: '', linkedin: '', email: '' },
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
    {
      slug: 'sentencia-su-168-2023-arboleda-chaverra-cidh',
      type: 'CIDH y Corte Constitucional · Precedente estructural',
      instance: 'Corte Constitucional de Colombia y Comisión Interamericana de Derechos Humanos (Caso 11.227)',
      title: 'Benjamín Artemio Arboleda Chaverra y Robinson Martínez Moya (Sentencia SU-168 de 2023)',
      context:
        'Tras declararse en 2021 la caducidad de la acción de reparación directa ante el Consejo de Estado, la firma acompañó a los familiares mediante tutela constitucional y litigio internacional en el Caso 11.227 ante la CIDH, buscando proteger el acceso efectivo a la reparación directa para víctimas del exterminio de la Unión Patriótica.',
      work:
        'Organización peticionaria y representante judicial de las víctimas ante la CIDH y la Corte Constitucional frente al obstáculo procesal de la caducidad en graves violaciones de derechos humanos.',
      result:
        'La Sentencia SU-168 de 2023 de la Corte Constitucional unificó reglas más favorables sobre la caducidad de la reparación directa para víctimas del exterminio de la Unión Patriótica, abriendo la vía judicial interna a cientos de familias en todo el país.',
      sources: [
        ['Sentencia SU-168 de 2023 - Corte Constitucional', 'https://www.corteconstitucional.gov.co/relatoria/2023/su168-23.htm'],
        ['Informe de Fondo Caso 11.227 - CIDH / OEA', 'https://www.oas.org/es/cidh/decisiones/corte/2018/11227FondoEs.pdf'],
      ],
    },
    {
      slug: 'macrocaso-03-falsos-positivos-subcaso-antioquia-jep',
      type: 'JEP · Ejecuciones extrajudiciales',
      instance: 'Jurisdicción Especial para la Paz (Sala de Reconocimiento, Subcaso Antioquia)',
      title: 'Falsos positivos: Macrocaso 03, subcaso Antioquia',
      context:
        'Investigación de ejecuciones extrajudiciales cometidas por agentes del Estado presentadas falsamente como bajas en combate en el departamento de Antioquia dentro del Caso 03 de la JEP.',
      work:
        'Representación judicial de víctimas acreditadas ante la Sala de Reconocimiento de Verdad, participación en diligencias y presentación de observaciones a versiones voluntarias.',
      result:
        'Participación reconocida en las actuaciones oficiales del subcaso Antioquia; además, la JEP inició trámite de medida cautelar de protección a favor de los abogados representantes de víctimas del Caso 03.',
      sources: [
        ['Estado No. 1014 de 2023 Subcaso Antioquia - JEP', 'https://www.jep.gov.co/Notificaciones/Estado%20No.1014.2023%20SRVR%20Caso%2003%20Auto%20SUB%20D-SUBCASO%20ANTIOQUIA-062%20de%202023.pdf'],
        ['Medida cautelar de protección - Sala de Prensa JEP', 'https://www.jep.gov.co/Sala-de-Prensa/Paginas/JEP%20inicia%20tr%C3%A1mite%20de%20medida%20cautelar%20de%20protecci%C3%B3n%20a%20abogados%20que%20representan%20a%20las%20v%C3%ADctimas%20en%20el%20caso%2003.aspx'],
      ],
    },
  ],
  gscVerification: '',
  ga4: '',
  production: false,
  published: '2026-11-26',
  lastReview: '2026-11-26',
};
