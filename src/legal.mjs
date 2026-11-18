// Textos legales. Borrador técnico basado en la Ley 1581 de 2012 y el Decreto 1377 de 2013
// (compilado en el Decreto Único 1074 de 2015). Debe revisarlo y aprobarlo el abogado responsable.
import { SITE } from './config.mjs';

const nombre = SITE.legalName || SITE.name;
const nit = SITE.nit || '[NIT pendiente]';
const correo = SITE.email || '[correo de atención de datos pendiente]';
const dir = SITE.address || 'Medellín, Antioquia';
const tel = SITE.phone || '[teléfono pendiente]';

export const RESPONSABLE = {
  cap: 'Datos del responsable del tratamiento',
  head: ['Dato', 'Información'],
  rows: [
    ['Responsable', nombre],
    ['NIT', nit],
    ['Dirección', dir],
    ['Teléfono', tel],
    ['Correo para asuntos de datos', correo],
    ['Sitio web', SITE.url],
  ],
};

export const PRIVACIDAD = [
  ['Quién es el responsable de tus datos', [
    `${nombre} es responsable del tratamiento de los datos personales que se recogen a través de este sitio web, de los formularios, de las llamadas y de los demás canales de contacto publicados.`,
    { table: RESPONSABLE },
  ]],
  ['Marco legal', [
    'Esta política se rige por el artículo 15 de la Constitución Política, la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único Reglamentario 1074 de 2015) y las demás normas que los modifiquen o complementen. La autoridad de protección de datos en Colombia es la Superintendencia de Industria y Comercio (SIC).',
  ]],
  ['Qué datos recogemos', [
    { ul: [
      'Datos de identificación y contacto: nombre, teléfono, correo electrónico y municipio.',
      'Información sobre tu consulta: fecha y lugar del accidente, tipo de vehículo, tu papel en el accidente (conductor, parrillero, pasajero o peatón) y el relato que decidas compartir.',
      'Datos de salud, si tú los suministras: lesiones, incapacidades, atención médica o calificación de pérdida de capacidad laboral. Son datos sensibles.',
      'Datos técnicos de navegación (dirección IP, tipo de dispositivo, páginas visitadas y clics en botones de contacto), solo si el sitio activa una herramienta de analítica. Consulta la política de cookies.',
    ] },
    'La calculadora orientativa de indemnización funciona en tu navegador: los valores que escribes no se envían ni se guardan en nuestros servidores.',
  ]],
  ['Para qué usamos tus datos', [
    { ul: [
      'Responder tu consulta y contactarte por el canal que elegiste.',
      'Hacer una revisión inicial de tu caso y explicarte la ruta jurídica que podría aplicar.',
      'Preparar, si decides contratar, la propuesta de servicios y el contrato.',
      'Hacer seguimiento a tu solicitud y llevar registro de las comunicaciones.',
      'Cumplir obligaciones legales, contables y de atención de requerimientos de autoridades.',
      'Medir de forma agregada el uso del sitio para mejorarlo, cuando exista analítica activa.',
    ] },
    'No vendemos ni alquilamos tus datos. No los usamos para enviarte publicidad de terceros.',
  ]],
  ['Datos sensibles y datos de menores de edad', [
    'Los datos sobre tu salud son sensibles. No estás obligado a entregarlos y puedes negarte a responder preguntas sobre ellos. Si los compartes, solo los usamos para analizar tu caso, con tu autorización expresa y con medidas reforzadas de confidencialidad.',
    'Si la consulta se refiere a un menor de edad, los datos deben entregarlos sus padres o representante legal. Se tratarán respetando el interés superior del menor y sus derechos fundamentales.',
  ]],
  ['Tus derechos como titular', [
    'De acuerdo con el artículo 8 de la Ley 1581 de 2012, tienes derecho a:',
    { ul: [
      'Conocer, actualizar y rectificar tus datos personales.',
      'Pedir prueba de la autorización que otorgaste.',
      'Ser informado sobre el uso que se ha dado a tus datos.',
      'Presentar quejas ante la Superintendencia de Industria y Comercio, después de haber hecho tu consulta o reclamo ante nosotros.',
      'Revocar la autorización o pedir que se eliminen tus datos, cuando no exista un deber legal o contractual de conservarlos.',
      'Acceder gratuitamente a tus datos personales.',
    ] },
  ]],
  ['Cómo ejercer tus derechos', [
    `Escríbenos a ${correo}, llama al ${tel} o envía una comunicación escrita a ${dir}. Indica tu nombre, un medio de respuesta, qué solicitas y, si es un reclamo, los hechos y los documentos que quieras aportar.`,
    { table: { cap: 'Plazos de respuesta según la Ley 1581 de 2012', head: ['Tipo de solicitud', 'Plazo máximo', 'Prórroga'], rows: [
      ['Consulta (conocer qué datos tenemos)', '10 días hábiles desde que la recibimos', 'Hasta 5 días hábiles más, avisándote el motivo'],
      ['Reclamo (corregir, actualizar, suprimir o revocar)', '15 días hábiles desde el día siguiente a recibirlo', 'Hasta 8 días hábiles más, avisándote el motivo'],
    ] } },
    'Si un reclamo llega incompleto, te pediremos completarlo dentro de los 5 días siguientes. Si pasan 2 meses sin que lo completes, se entenderá que desististe.',
  ]],
  ['Con quién compartimos tus datos', [
    'Solo compartimos datos cuando es necesario para atender tu caso o para operar el sitio, por ejemplo con proveedores de alojamiento web, correo, telefonía, mensajería o analítica. Estos proveedores actúan como encargados y deben proteger la información.',
    'Algunos de estos proveedores pueden almacenar datos fuera de Colombia. En ese caso se exigirán garantías de protección acordes con la ley colombiana.',
    'También podemos entregar datos a autoridades judiciales o administrativas cuando una norma o una orden lo exija, o a aseguradoras y entidades del proceso solo cuando tú lo autorices para tramitar tu reclamación.',
  ]],
  ['Seguridad y confidencialidad', [
    'Aplicamos medidas técnicas, humanas y administrativas razonables para evitar el acceso no autorizado, la pérdida o el uso indebido de la información. La información de tu caso también está protegida por el secreto profesional que deben guardar los abogados.',
    'Ningún sistema es completamente seguro. Si detectamos un incidente que afecte tus datos, lo informaremos según exige la ley.',
  ]],
  ['Cuánto tiempo conservamos tus datos', [
    'Conservamos los datos mientras sean necesarios para atender tu consulta o ejecutar el contrato de servicios, y después durante el tiempo que exijan las normas legales, contables o de prescripción aplicables. Cumplido ese plazo, se eliminan o se anonimizan.',
  ]],
  ['Cambios a esta política', [
    'Podemos actualizar esta política. Publicaremos la nueva versión en esta página con su fecha. Si el cambio afecta las finalidades para las que autorizaste el tratamiento, te pediremos una nueva autorización.',
  ]],
];

export const AUTORIZACION = [
  ['Texto de la autorización', [
    `Al marcar la casilla de autorización en un formulario de este sitio, o al aceptarlo de forma expresa por otro canal, declaro que he sido informado y autorizo a ${nombre} (NIT ${nit}), como responsable, para recolectar, almacenar, usar, circular y suprimir mis datos personales con las finalidades descritas a continuación.`,
  ]],
  ['Finalidades autorizadas', [
    { ol: [
      'Atender mi consulta sobre un accidente de tránsito y contactarme por teléfono, WhatsApp o correo.',
      'Analizar la información de mi caso y darme una orientación jurídica inicial.',
      'Enviarme la propuesta de servicios y, si la acepto, ejecutar el contrato.',
      'Hacer seguimiento a mi solicitud y conservar el registro de comunicaciones.',
      'Cumplir obligaciones legales y atender requerimientos de autoridades competentes.',
    ] },
  ]],
  ['Datos sensibles', [
    'Entiendo que los datos sobre mi salud son sensibles, que no estoy obligado a suministrarlos y que, si lo hago, solo se usarán para analizar mi caso. Si entrego datos de un menor de edad, declaro que soy su padre, madre o representante legal.',
  ]],
  ['Mis derechos', [
    'Conozco que puedo conocer, actualizar, rectificar y suprimir mis datos, pedir prueba de esta autorización, ser informado sobre su uso, revocarla y presentar quejas ante la Superintendencia de Industria y Comercio, en los términos de la Ley 1581 de 2012.',
    `Para ejercer estos derechos puedo escribir a ${correo}, llamar al ${tel} o dirigirme a ${dir}.`,
  ]],
  ['Vigencia y revocación', [
    'Esta autorización está vigente mientras sea necesaria para las finalidades indicadas. Puedo revocarla en cualquier momento, salvo que exista un deber legal o contractual de conservar la información.',
    'El tratamiento se hará según la política de privacidad publicada en este sitio.',
  ]],
];

export const TERMINOS = [
  ['Aceptación', [
    `Estos términos regulan el uso del sitio ${SITE.url}, de ${nombre}. Al navegar en el sitio aceptas estos términos. Si no estás de acuerdo, te pedimos no usarlo.`,
  ]],
  ['Información orientativa, no asesoría jurídica', [
    'Los contenidos del sitio (guías, preguntas frecuentes, glosario, tablas y modelos) son informativos y generales. No constituyen asesoría jurídica, no reemplazan la revisión de tu caso por un abogado y pueden no reflejar cambios recientes en normas, topes o trámites.',
    'Cada caso depende de sus pruebas y circunstancias. No garantizamos resultados, montos ni plazos.',
  ]],
  ['Cuándo existe una relación abogado-cliente', [
    'Enviar un formulario, llamar o escribir por WhatsApp no crea por sí solo una relación abogado-cliente. Esa relación empieza cuando ambas partes firman un contrato de prestación de servicios que define el alcance del encargo y los honorarios.',
    'Aun así, tratamos con confidencialidad la información que compartas en tu consulta inicial.',
  ]],
  ['Calculadora orientativa', [
    'La calculadora de indemnización da una estimación aproximada con base en los datos que escribes y en supuestos simplificados. No incluye perjuicios morales ni otros perjuicios extrapatrimoniales, no es una oferta ni una predicción y no compromete a ninguna parte.',
  ]],
  ['Uso permitido del sitio', [
    { ul: [
      'Usa el sitio de forma lícita y sin afectar su funcionamiento.',
      'No envíes información falsa ni datos de terceros sin su autorización.',
      'No intentes acceder a áreas restringidas ni extraer contenido de forma automatizada y masiva.',
    ] },
  ]],
  ['Propiedad intelectual', [
    `Los textos, el diseño, el logotipo y la marca ${SITE.name} pertenecen a ${nombre} o se usan con autorización. Puedes compartir enlaces y citar fragmentos breves indicando la fuente. Para cualquier otro uso necesitas autorización previa y por escrito.`,
    'El modelo de derecho de petición puede usarse libremente para tu propia reclamación.',
  ]],
  ['Enlaces a sitios de terceros', [
    'El sitio incluye enlaces a fuentes oficiales y a otras páginas para tu consulta. No controlamos su contenido ni respondemos por su disponibilidad, exactitud o políticas de privacidad.',
  ]],
  ['Disponibilidad y cambios', [
    'Procuramos que el sitio esté disponible y actualizado, pero puede haber interrupciones o errores. Podemos modificar los contenidos y estos términos en cualquier momento; la versión vigente es la publicada en esta página.',
  ]],
  ['Ley aplicable', [
    'Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se tratará primero de forma directa y, si no se resuelve, ante las autoridades competentes de Colombia.',
  ]],
];

export const COOKIES = [
  ['Qué son las cookies', [
    'Las cookies son pequeños archivos que un sitio guarda en tu navegador para recordar información sobre tu visita. Tecnologías parecidas, como el almacenamiento local del navegador, cumplen funciones similares.',
  ]],
  ['Qué usa este sitio hoy', [
    { table: { cap: 'Tecnologías de almacenamiento que puede usar este sitio', head: ['Tecnología', 'Para qué sirve', 'Duración', 'Estado'], rows: [
      ['Almacenamiento local (listas de verificación)', 'Recordar qué elementos marcaste en las listas de documentos de cada página. Se guarda solo en tu dispositivo y no se nos envía.', 'Hasta que borres los datos del navegador', 'Activo'],
      ['Cookies de analítica (Google Analytics 4: _ga y _ga_*)', 'Medir de forma agregada visitas y clics en botones de contacto.', 'Hasta 2 años', SITE.ga4 ? 'Activo' : 'No activo por ahora'],
      ['Cookies publicitarias', 'Mostrar anuncios personalizados.', 'No aplica', 'No se usan'],
    ] } },
    'Si en el futuro se agregan mapas, videos u otras herramientas de terceros, esos servicios pueden instalar sus propias cookies. Actualizaremos esta tabla cuando eso ocurra.',
  ]],
  ['Cómo controlar o borrar las cookies', [
    'Puedes bloquear o eliminar las cookies y el almacenamiento local desde la configuración de tu navegador (Chrome, Safari, Firefox, Edge u otros), normalmente en el apartado de privacidad o datos de sitios. Si los bloqueas, el sitio seguirá funcionando, pero las listas de verificación no recordarán lo que marcaste.',
  ]],
  ['Más información', [
    'El tratamiento de los datos que puedan obtenerse por estas tecnologías se rige por nuestra política de privacidad.',
  ]],
];

export const LEGAL_FAQ = {
  privacidad: [
    ['¿Tengo que dar mis datos de salud para que revisen mi caso?', 'No. Son datos sensibles y es opcional entregarlos. Sin ellos la orientación puede ser más general, pero nadie puede obligarte a suministrarlos.'],
    ['¿Pueden compartir mi información con la aseguradora?', 'Solo cuando tú lo autorices para tramitar tu reclamación, o cuando una ley u orden de autoridad lo exija.'],
    ['¿Cómo pido que borren mis datos?', 'Envía un reclamo por los canales indicados. Lo responderemos en máximo 15 días hábiles, salvo que exista un deber legal de conservar la información.'],
    ['¿Ante quién me quejo si no me responden?', 'Ante la Superintendencia de Industria y Comercio, después de haber presentado tu consulta o reclamo ante nosotros.'],
  ],
};
