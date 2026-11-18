// Municipios del Valle de Aburrá (área metropolitana). Medellín es la sede principal (Home).
// Autoridades y direcciones: tomadas del directorio oficial publicado por la Secretaría de Movilidad de Itagüí
// (transitoitagui.gov.co) y de los sitios de cada alcaldía. Verificar vigencia antes de publicar y cada cierto tiempo.
// Cobertura de la firma: confirmar (SITE.coverageConfirmed).

export const DIRECTORIO_URL = 'https://www.transitoitagui.gov.co/transparencia-y-acceso-a-informacion-publica/informacion-de-la-entidad/directorio-de-entidades/';

export const MUNICIPIOS = [
  {
    slug: 'bello', name: 'Bello', zona: 'norte', vecinos: ['Copacabana', 'Medellín'],
    vias: 'la Autopista Norte y el corredor del río Aburrá', transporte: 'Metro de Medellín (Línea A, con terminal norte en Niquía) y rutas de buses urbanos e intermunicipales',
    hook: 'Autopista Norte, calles de ladera y trámites ante la Secretaría de Movilidad de Bello.',
    desc: 'Si sufriste un accidente de tránsito en Bello: dónde pedir el IPAT, qué hacer en las primeras 24 horas y cómo reclamar SOAT y perjuicios.',
    autoridad: { nombre: 'Secretaría de Movilidad de Bello', dir: 'Diagonal 50A # 42-95, Bello', tel: '(604) 481 2500', web: 'https://bello.gov.co/NuestraAlcaldia/Dependencias/Paginas/Secretaria-de-Movilidad.aspx', nota: 'Según el directorio oficial. Confirma el canal de atención vigente antes de ir.' },
    p1: 'Bello es uno de los municipios más poblados del Valle de Aburrá y funciona como puerta de entrada al norte del área metropolitana. La Autopista Norte y los corredores paralelos al río concentran buena parte del tráfico que va y viene de Medellín. En Niquía termina la Línea A del Metro, así que muchas personas combinan metro, bus y moto en un mismo desplazamiento diario.',
    p2: 'Buena parte del territorio se extiende por laderas, con calles estrechas, pendientes y poca visibilidad en curvas. En ese tipo de vías los accidentes de moto y los atropellos suelen ocurrir a baja velocidad pero con lesiones importantes por la caída o el golpe contra andenes y muros. La dirección exacta del lugar y las fotos de la pendiente, el ancho de la calle y la señalización ayudan a reconstruir lo ocurrido.',
    p3: 'Bello limita con Medellín por el sur y con Copacabana por el norte. Cuando el accidente ocurre cerca de un límite, vale la pena confirmar qué autoridad atendió el caso y qué dirección quedó registrada, porque de eso depende dónde se solicita la copia del informe y qué entidad administra la vía.',
    escenarios: [
      ['Choque de moto en la Autopista Norte', 'Se revisa quién administra el tramo, la velocidad y la maniobra del otro conductor, su SOAT y su póliza de responsabilidad civil. Las cámaras de comercios y estaciones de servicio cercanas suelen conservar las imágenes pocos días.'],
      ['Atropello en una calle de ladera', 'Pesan la visibilidad, el estado del andén y la velocidad del vehículo. Los vecinos y los negocios de la cuadra pueden ser testigos clave, y conviene anotar sus datos de inmediato.'],
      ['Accidente cerca del límite con Medellín o Copacabana', 'Hay que precisar la autoridad que atendió y el lugar exacto. Si hubo dos autoridades en el sitio, pide copia de ambos registros para evitar contradicciones.'],
    ],
    servicios: ['accidentes-moto', 'accidentes-peatones', 'lesiones-parrillero-moto', 'accidentes-pasajeros-transporte-publico', 'accidentes-vias-mal-estado', 'soat'],
    faqs: [
      ['¿Dónde pido la copia del informe de un accidente ocurrido en Bello?', 'Según el directorio oficial, la Secretaría de Movilidad de Bello atiende en la Diagonal 50A # 42-95. Verifica en su sitio web el procedimiento y los canales vigentes, y lleva la fecha, la hora y el lugar exacto del accidente.'],
      ['¿Qué hago si el accidente fue en la Autopista Norte a la altura de Bello?', 'Anota el kilómetro o la referencia más cercana y pregunta qué autoridad atendió. El administrador del tramo puede ser distinto del municipio, algo importante si el estado de la vía influyó.'],
      ['¿Sirven las cámaras de los negocios en Bello?', 'Sí, pueden ser decisivas. Pide cuanto antes que conserven la grabación y deja constancia escrita de la solicitud, porque muchos sistemas sobrescriben las imágenes en pocos días.'],
      ['Me caí en moto en una calle de ladera sin otro vehículo. ¿Tengo opciones?', 'El SOAT de tu moto cubre la atención médica inicial. Si la causa fue el mal estado de la vía o la falta de señalización, puede analizarse la responsabilidad de la entidad que la administra; documenta el lugar con fotos.'],
    ],
  },
  {
    slug: 'itagui', name: 'Itagüí', zona: 'sur', vecinos: ['Envigado', 'La Estrella', 'Sabaneta', 'Medellín'],
    vias: 'la Autopista Sur y las avenidas que conectan con Medellín y Envigado', transporte: 'Metro de Medellín (Línea A, con estaciones en Itagüí y Santa María) y rutas de buses',
    hook: 'Zona industrial y comercial del sur del Valle: vehículos de carga, motos de trabajo y reclamaciones a empresas.',
    desc: 'Accidente de tránsito en Itagüí: dónde se tramita el informe, qué cambia si el vehículo es de una empresa o si ibas trabajando, y cómo reclamar.',
    autoridad: { nombre: 'Secretaría de Movilidad de Itagüí', dir: 'sede principal en la Calle 50 # 43-34, Itagüí (hay una segunda sede en Capricentro)', tel: '(604) 540 4090', web: 'https://www.transitoitagui.gov.co/', nota: 'Datos de la alcaldía y de su sitio oficial; confirma la sede que atiende cada trámite.' },
    p1: 'Itagüí es un municipio con fuerte actividad industrial y comercial en el sur del Valle de Aburrá, conurbado con Medellín. Eso se traduce en un flujo constante de vehículos de carga, camiones de reparto, vehículos de empresas y motociclistas que se desplazan a diario hacia fábricas, bodegas y zonas comerciales.',
    p2: 'La Autopista Sur y las avenidas principales mezclan tráfico pesado con motos y peatones, y el Metro (estaciones Itagüí y Santa María) genera movimiento constante alrededor de las estaciones. En accidentes con vehículos de carga las lesiones suelen ser más graves y la reclamación más compleja, porque intervienen empresas, propietarios y aseguradoras distintas.',
    p3: 'Cuando el vehículo que causó el accidente pertenece a una empresa, conviene identificar desde el primer momento la placa, la razón social y la aseguradora. Si además la víctima iba trabajando, puede entrar la ARL en el análisis, y las coberturas y reclamaciones se coordinan entre sí.',
    escenarios: [
      ['Choque con un camión o una volqueta', 'Se identifica al propietario, a la empresa que responde por el conductor y las pólizas vigentes. Una foto de la placa y del nombre de la empresa en la puerta puede ahorrar semanas de búsqueda.'],
      ['Accidente de un trabajador o domiciliario en moto', 'Hay que revisar si fue accidente de trabajo (ARL), el SOAT y la responsabilidad del otro conductor. Son vías distintas que pueden coexistir.'],
      ['Atropello cerca de una zona comercial', 'Las cámaras de los locales y los testigos suelen ser abundantes; la clave es pedirlas pronto y registrar el nombre del establecimiento.'],
    ],
    servicios: ['accidentes-carro', 'accidentes-moto', 'responsabilidad-civil', 'accidente-in-itinere', 'accidentes-plataformas', 'lesiones-graves'],
    faqs: [
      ['¿Dónde se tramita el informe de un accidente en Itagüí?', 'La Secretaría de Movilidad de Itagüí tiene su sede principal en la Calle 50 # 43-34 y otra sede en Capricentro, según su sitio oficial. Verifica cuál atiende el trámite que necesitas.'],
      ['El vehículo que me chocó era de una empresa. ¿A quién se reclama?', 'Puede reclamarse al conductor, al propietario, a la empresa y a las aseguradoras que correspondan. Reúne la placa, la razón social y el número de póliza si lo tienes.'],
      ['Iba al trabajo cuando me chocaron. ¿Cambia algo?', 'Puede cambiar la cobertura: si se califica como accidente de trabajo interviene la ARL, además del SOAT y de la reclamación al responsable. Cada caso se revisa con los hechos.'],
      ['¿El SOAT de un camión cubre igual que el de un carro?', 'El SOAT atiende a las víctimas de todo vehículo automotor dentro de sus amparos. Lo que cambia es que los vehículos de carga suelen tener además pólizas de responsabilidad civil que conviene verificar.'],
    ],
  },
  {
    slug: 'envigado', name: 'Envigado', zona: 'sur', vecinos: ['Medellín', 'Itagüí', 'Sabaneta'],
    vias: 'corredores del sur como la Avenida Las Vegas y la Autopista Sur', transporte: 'Metro de Medellín (estación Envigado) y rutas de buses y alimentadores',
    hook: 'Ciclistas, peatones y motos en corredores urbanos de alto flujo, y cruces con semáforo en el sur del Valle.',
    desc: 'Accidente en Envigado: cómo solicitar el informe, qué pruebas guardar en cruces y semáforos y cómo reclamar si eras ciclista, peatón o motociclista.',
    autoridad: { nombre: 'Secretaría de Movilidad de Envigado', dir: 'Calle 49 Sur # 48-28, Envigado', tel: '(604) 339 4081', web: 'https://movilidad.envigado.gov.co/portal-servicios/modulos/home-public/home-public.html', nota: 'Algunos trámites se gestionan con cita; verifica el portal de servicios antes de ir.' },
    p1: 'Envigado está conurbado con Medellín e Itagüí y combina zonas residenciales y comerciales de alto flujo con áreas de ladera hacia el sector rural. Sus corredores principales, como la Avenida Las Vegas, mezclan carros, motos, bicicletas y mucho tránsito peatonal a todas horas.',
    p2: 'Con tantos cruces semaforizados y glorietas, las discusiones sobre quién tenía la vía son frecuentes. Los videos de cámaras de comercios y edificios, la hora exacta y el estado del semáforo son pruebas centrales. Si la señalización estaba dañada o apagada, también puede analizarse la responsabilidad de la entidad a cargo.',
    p3: 'En Envigado es muy común el ciclismo urbano y deportivo. Un ciclista atropellado puede reclamar por sus lesiones y por los daños a la bicicleta y accesorios (casco, luces, computador de ruta); guardar las facturas y los registros de la aplicación de ciclismo ayuda a probar el recorrido y el valor.',
    escenarios: [
      ['Ciclista atropellado en un corredor urbano', 'Se analiza la distancia lateral, la velocidad y el cumplimiento de las normas por ambas partes. Los datos de la aplicación de ciclismo pueden confirmar hora, velocidad y recorrido.'],
      ['Choque en un cruce con semáforo', 'Es clave determinar el estado del semáforo y la fase en que ocurrió el choque. Las cámaras de la zona y los testigos pesan mucho; conviene pedirlas el mismo día.'],
      ['Accidente en una vía de ladera', 'Se revisan visibilidad, señalización y estado de la vía. Si influyó el mal estado, se identifica la entidad que la administra.'],
    ],
    servicios: ['accidentes-ciclistas', 'accidentes-peatones', 'accidentes-senalizacion-semaforos', 'accidentes-carro', 'lesiones-graves', 'soat'],
    faqs: [
      ['¿Dónde se solicita el informe de un accidente ocurrido en Envigado?', 'La Secretaría de Movilidad de Envigado atiende en la Calle 49 Sur # 48-28, según el directorio oficial. Algunos trámites se manejan con cita; revisa el portal de servicios.'],
      ['Soy ciclista y me atropellaron. ¿Cubren también la bicicleta?', 'Los daños a la bicicleta y a los accesorios pueden reclamarse como daño emergente, con facturas, fotos y cotizaciones. El SOAT cubre tu atención médica, no la bicicleta.'],
      ['¿Qué hago si el semáforo estaba apagado cuando ocurrió el choque?', 'Documenta con fotos o video, anota la hora y pide el informe de la autoridad. Si la falla de señalización influyó, puede analizarse la responsabilidad de la entidad a cargo.'],
      ['Mi accidente fue en la Avenida Las Vegas, ¿pertenece a Envigado?', 'Depende del tramo exacto, porque esa avenida atraviesa varios municipios. Anota la dirección y los puntos de referencia para precisar la autoridad competente.'],
    ],
  },
  {
    slug: 'sabaneta', name: 'Sabaneta', zona: 'sur', vecinos: ['Envigado', 'Itagüí', 'La Estrella'],
    vias: 'la Avenida Las Vegas y las vías que conectan con Envigado, Itagüí y La Estrella', transporte: 'Metro de Medellín (estación Sabaneta) y rutas locales',
    hook: 'El municipio más pequeño de Colombia, con tráfico denso: peatones, motos y accidentes cerca de límites municipales.',
    desc: 'Accidente en Sabaneta: autoridad de tránsito, observatorio municipal de accidentalidad, qué hacer cerca de los límites con Envigado e Itagüí y cómo reclamar.',
    autoridad: { nombre: 'Secretaría de Tránsito de Sabaneta', dir: 'Carrera 46 # 75 Sur 36, Sabaneta (el directorio oficial registra la zona de la Carrera 45 con Calle 75 Sur)', tel: '(604) 288 1838', web: 'https://sabaneta.gov.co/directorio/entidades/', nota: 'Las fuentes oficiales difieren levemente en el número de la dirección; confirma antes de ir.' },
    p1: 'Sabaneta es el municipio de menor extensión territorial de Colombia y, al mismo tiempo, uno de los más densamente poblados. En un territorio tan compacto, los mismos cruces y vías de entrada soportan mucho tráfico, y gran parte de los accidentes ocurre en tramos urbanos con alta presencia de peatones y motos.',
    p2: 'Al estar rodeado de Envigado, Itagüí y La Estrella, es frecuente que un accidente ocurra a pocas cuadras de un límite municipal. Anotar la dirección exacta, la nomenclatura de la calle y puntos de referencia permite precisar qué autoridad debe atender y cómo solicitar luego la copia del informe.',
    p3: 'El municipio publica un observatorio con cifras de movilidad y accidentalidad que sirve como contexto general de los puntos críticos. Esas estadísticas no prueban lo ocurrido en tu caso, pero pueden ayudar a entender qué tramos concentran más incidentes y a documentar que una situación de riesgo ya era conocida.',
    escenarios: [
      ['Peatón atropellado en una vía urbana', 'Se evalúa si el cruce estaba señalizado, la velocidad del vehículo y la visibilidad. Los comercios de la cuadra suelen tener cámaras; pídelas el mismo día.'],
      ['Choque en el límite con otro municipio', 'Hay que precisar el lugar exacto y qué autoridad atendió. Si dos entidades intervinieron, solicita ambos registros.'],
      ['Accidente de moto en hora pico', 'En tráfico denso son comunes los choques por alcance y los cierres de carril; los testigos y las cámaras ayudan a reconstruir la secuencia.'],
    ],
    servicios: ['accidentes-peatones', 'accidentes-moto', 'lesiones-parrillero-moto', 'accidentes-ciclistas', 'accidentes-carro', 'aseguradoras-no-pagan'],
    faqs: [
      ['¿Dónde se pide el informe de un accidente en Sabaneta?', 'En la Secretaría de Tránsito de Sabaneta, que según su sitio atiende en la Carrera 46 # 75 Sur 36. Verifica la dirección y los canales vigentes antes de ir.'],
      ['¿Qué es el observatorio municipal de Sabaneta?', 'Es un portal de la alcaldía con estadísticas de movilidad y accidentalidad. Sirve de contexto, pero no reemplaza las pruebas de tu caso.'],
      ['Mi accidente fue casi en el límite con Envigado. ¿Qué autoridad corresponde?', 'La que tenga competencia sobre el punto exacto. Pide copia del informe de quien atendió y anota la dirección y los puntos de referencia.'],
      ['¿Un conductor de otro municipio responde igual que uno de Sabaneta?', 'Sí. La responsabilidad civil y el SOAT son de alcance nacional; no dependen del municipio de residencia del conductor.'],
    ],
  },
  {
    slug: 'la-estrella', name: 'La Estrella', zona: 'sur', vecinos: ['Sabaneta', 'Itagüí', 'Caldas'],
    vias: 'los corredores del sur del Valle y las vías hacia sus zonas rurales', transporte: 'Metro de Medellín (estación La Estrella, terminal sur) y rutas de buses',
    hook: 'Carreteras de montaña, veredas y un tránsito operado por EMTRASUR: qué cambia cuando el accidente es en zona rural.',
    desc: 'Accidente en La Estrella: autoridad y operador de tránsito, qué hacer en vías rurales y de montaña y cómo reclamar por estado de la vía o vehículo que huye.',
    autoridad: { nombre: 'Secretaría de Tránsito de La Estrella', dir: 'Centro Administrativo, Calle 80 Sur # 58-78, La Estrella', tel: '(604) 540 7444', web: 'https://laestrella.gov.co', nota: 'Los trámites de tránsito los opera EMTRASUR (emtrasur.com.co); confirma con cuál entidad debes tramitar.' },
    p1: 'La Estrella combina un casco urbano conurbado con el sur del Valle de Aburrá y amplias zonas rurales y de ladera. En la estación La Estrella termina la Línea A del Metro, lo que concentra tráfico de buses, motos y peatones en el entorno del centro del municipio.',
    p2: 'Fuera del casco urbano abundan las carreteras de montaña, con curvas cerradas, poca iluminación y tramos sin andén. En ese contexto, la señalización, la visibilidad y el mantenimiento pesan mucho en el análisis de un accidente, y probar el estado de la vía exige fotos y ubicación precisa.',
    p3: 'Una particularidad del municipio es que los servicios de tránsito se prestan a través de un operador (EMTRASUR). Para solicitar documentos o copias de informes conviene confirmar con cuál entidad se hace el trámite y guardar la constancia de cada solicitud.',
    escenarios: [
      ['Accidente de moto en una vereda', 'Se documentan la pendiente, las curvas, la iluminación y el estado del pavimento. Si no hay testigos, las huellas de frenado y los daños de los vehículos cobran importancia.'],
      ['Vehículo que huye en una vía poco transitada', 'Hay menos cámaras en zonas rurales: denuncia de inmediato, busca fincas y negocios con cámaras y reúne cualquier dato de placa o color. Existen coberturas de atención para vehículos no identificados.'],
      ['Accidente en una vía departamental o nacional que cruza el municipio', 'Antes de reclamar por el estado de la vía hay que identificar quién la administra; puede no ser el municipio.'],
    ],
    servicios: ['accidentes-vias-mal-estado', 'vehiculo-fantasma', 'accidentes-moto', 'accidentes-senalizacion-semaforos', 'soat', 'lesiones-graves'],
    faqs: [
      ['¿Quién atiende los trámites de tránsito en La Estrella?', 'La Secretaría de Tránsito atiende en el Centro Administrativo (Calle 80 Sur # 58-78), y los servicios son operados por EMTRASUR. Confirma cuál entidad hace el trámite que necesitas.'],
      ['Me accidenté en una carretera rural sin alumbrado. ¿Puedo reclamar?', 'Puede analizarse la responsabilidad del conductor o del administrador de la vía, según la causa. Documenta el lugar con fotos de día y de noche y anota la ubicación exacta.'],
      ['El conductor huyó y no hay cámaras. ¿Qué hago?', 'Presenta la denuncia el mismo día, recoge cualquier dato (color, marca, placa parcial) y busca testigos. La atención médica puede apoyarse en las coberturas para vehículos no identificados.'],
      ['¿Cómo se prueba el mal estado de una vía rural?', 'Con fotos y videos fechados, ubicación exacta, testigos y reportes previos a la autoridad. Si existen quejas anteriores de la comunidad, pueden servir como antecedente.'],
    ],
  },
  {
    slug: 'caldas', name: 'Caldas', zona: 'sur', vecinos: ['La Estrella'],
    vias: 'el corredor vial que conecta el Valle de Aburrá con el suroeste antioqueño', transporte: 'buses urbanos e intermunicipales y transporte de carga',
    hook: 'Corredor hacia el suroeste antioqueño: buses intermunicipales, carga pesada y reclamaciones a empresas de transporte.',
    desc: 'Accidente en Caldas, Antioquia: dónde pedir el informe, cómo reclamar a empresas de transporte y qué hacer si hubo un vehículo pesado o un bus.',
    autoridad: { nombre: 'Secretaría de Movilidad de Caldas', dir: 'Carrera 49 # 129 Sur 84, Caldas (según el directorio oficial)', tel: '(604) 378 8500 ext. 200', web: 'https://caldasantioquia.gov.co/Transparencia/Paginas/Secretaria-de-Movilidad.aspx', nota: 'Correo publicado por la alcaldía: movilidad@caldasantioquia.gov.co. Confirma canales vigentes.' },
    p1: 'Caldas ocupa el extremo sur del Valle de Aburrá y es paso obligado hacia el suroeste antioqueño. Por su corredor circulan buses intermunicipales, vehículos de carga y particulares que salen o entran del área metropolitana, con picos en fines de semana y festivos.',
    p2: 'La presencia constante de vehículos pesados cambia el perfil de los accidentes: choques por alcance, pérdida de control en bajadas y colisiones con motociclistas pueden dejar lesiones graves. En estos casos importa mucho la velocidad, el estado de los frenos y las horas de conducción del conductor profesional.',
    p3: 'Si el vehículo es de una empresa de transporte, la reclamación puede dirigirse a la empresa, al propietario, al conductor y a sus aseguradoras. Los pasajeros de buses además cuentan con el SOAT del vehículo, y las empresas suelen tener pólizas de responsabilidad que conviene solicitar por escrito.',
    escenarios: [
      ['Choque con un bus intermunicipal', 'Se identifican empresa, ruta, placa y póliza. Si eras pasajero, guarda el tiquete; si eras otro conductor, registra la placa y el nombre de la empresa.'],
      ['Colisión entre una moto y un vehículo pesado', 'Las lesiones suelen ser graves; se revisan la maniobra, las condiciones de la vía y los registros del vehículo. Pide pronto las cámaras de negocios cercanos.'],
      ['Accidente con muerte de un familiar', 'Además del SOAT por muerte y gastos funerarios, pueden analizarse perjuicios morales y económicos de los familiares contra el responsable y su aseguradora.'],
    ],
    servicios: ['accidentes-pasajeros-transporte-publico', 'accidentes-carro', 'accidentes-moto', 'responsabilidad-civil', 'accidente-mortal', 'lesiones-graves'],
    faqs: [
      ['¿Dónde se tramita el informe de un accidente en Caldas?', 'La Secretaría de Movilidad de Caldas aparece en el directorio oficial en la Carrera 49 # 129 Sur 84 y la alcaldía publica el teléfono (604) 378 8500 ext. 200. Verifica los canales vigentes.'],
      ['Iba en un bus intermunicipal que sufrió un accidente. ¿Qué hago?', 'Busca atención médica, guarda el tiquete y anota la empresa, la ruta y la placa. El SOAT del bus cubre tu atención inicial y las empresas suelen tener pólizas de responsabilidad.'],
      ['¿Puedo reclamar a la empresa dueña del camión que causó el accidente?', 'Sí, puede dirigirse la reclamación a la empresa, al propietario, al conductor y a sus aseguradoras, según la relación con el vehículo. Reúne placa, razón social y pólizas.'],
      ['¿Qué pasa si el accidente fue en una carretera nacional?', 'Hay que identificar quién administra el tramo (entidad nacional, concesión o municipio) antes de reclamar por el estado de la vía.'],
    ],
  },
  {
    slug: 'copacabana', name: 'Copacabana', zona: 'norte', vecinos: ['Bello', 'Girardota'],
    vias: 'la Autopista Norte y sus vías de acceso al casco urbano', transporte: 'buses urbanos e intermunicipales',
    hook: 'Accesos a la Autopista Norte, choques por alcance en hora pico y peatones en pasos de la vía principal.',
    desc: 'Accidente en Copacabana: autoridad de tránsito, latigazo cervical y choques por alcance, peatones en la autopista y cómo reclamar SOAT y perjuicios.',
    autoridad: { nombre: 'Secretaría de Tránsito de Copacabana', dir: 'Palacio Municipal, Calle 50 # 50-15, Copacabana', tel: '(604) 274 0069', web: DIRECTORIO_URL, nota: 'Datos del directorio oficial; el municipio no tiene aquí un enlace verificado propio, por eso se remite al directorio.' },
    p1: 'Copacabana está en el norte del Valle de Aburrá, entre Bello y Girardota, y se conecta con el resto del área metropolitana principalmente por la Autopista Norte. Muchos de sus habitantes viajan a diario a Medellín en moto, bus o carro, con mucho tráfico en las primeras y últimas horas del día.',
    p2: 'Los accesos a la autopista y los tramos congestionados favorecen los choques por alcance. Aunque a veces no parezcan graves, pueden causar lesiones de cuello y espalda como el latigazo cervical, cuyos síntomas a veces aparecen horas o días después. Consultar al médico de inmediato y dejar constancia del accidente es fundamental.',
    p3: 'Los peatones que cruzan o caminan cerca de la vía principal están especialmente expuestos. Si la víctima era peatón, importa documentar el paso peatonal, la señalización y la iluminación, además de la velocidad y la maniobra del conductor.',
    escenarios: [
      ['Choque por alcance en hora pico', 'Aunque no haya fracturas, el latigazo cervical y las lesiones lumbares son frecuentes. Pide valoración médica el mismo día y guarda la historia clínica.'],
      ['Peatón atropellado cerca de la autopista', 'Se revisan pasos peatonales, puentes, iluminación y velocidad. Anota la hora exacta y busca testigos y cámaras de negocios.'],
      ['Moto que accede a la autopista', 'Las incorporaciones son puntos de conflicto: se analizan la prelación, la señalización y la visibilidad del acceso.'],
    ],
    servicios: ['latigazo-cervical', 'accidentes-moto', 'accidentes-peatones', 'accidentes-carro', 'accidentes-vias-mal-estado', 'soat'],
    faqs: [
      ['¿Dónde se solicita el informe de un accidente en Copacabana?', 'El directorio oficial ubica la Secretaría de Tránsito de Copacabana en el Palacio Municipal, Calle 50 # 50-15. Verifica los canales y horarios vigentes.'],
      ['Me chocaron por detrás y al otro día me duele el cuello. ¿Cuenta?', 'Sí. El latigazo cervical puede aparecer horas o días después. Consulta a un médico, cuéntale del accidente y guarda toda la documentación.'],
      ['¿Qué pasa si fui atropellado en la Autopista Norte?', 'Busca atención médica, denuncia y precisa el tramo: quién administra la vía puede ser relevante, además del conductor responsable y su aseguradora.'],
      ['¿La compañía de seguros del otro conductor puede ofrecerme un pago rápido?', 'Puede hacerlo, pero no estás obligado a aceptar ni a firmar un finiquito sin entender sus efectos. Es preferible que alguien lo revise primero.'],
    ],
  },
  {
    slug: 'girardota', name: 'Girardota', zona: 'norte', vecinos: ['Copacabana', 'Barbosa'],
    vias: 'la Autopista Norte y las vías que conectan con Barbosa y las zonas rurales', transporte: 'buses urbanos e intermunicipales',
    hook: 'Tráfico de carga y de paso hacia el norte de Antioquia, y accidentes en el entorno del Centro Industrial del Norte.',
    desc: 'Accidente en Girardota: dónde se tramita el informe, qué hacer con vehículos de paso o de carga y cómo reclamar si ibas al trabajo.',
    autoridad: { nombre: 'Secretaría de Tránsito de Girardota', dir: 'Km 25, vereda El Paraíso, Centro Industrial del Norte, Local 202', tel: '(604) 405 2590 ext. 108', web: DIRECTORIO_URL, nota: 'Datos del directorio oficial; confirma la sede y los canales de atención vigentes.' },
    p1: 'Girardota se ubica en el norte del Valle de Aburrá y conecta el área metropolitana con el norte y el nordeste de Antioquia. Su corredor principal recibe tráfico de paso, incluidos vehículos de carga pesada y buses intermunicipales, además del movimiento propio de una zona industrial.',
    p2: 'El Centro Industrial del Norte, donde también se ubica la Secretaría de Tránsito según el directorio oficial, atrae a trabajadores que se desplazan en moto o bus. Si el accidente ocurre en el trayecto al trabajo o durante una labor, pueden intervenir la ARL y otras coberturas además del SOAT.',
    p3: 'Muchos de los vehículos que circulan por Girardota no son del municipio: sus propietarios y aseguradoras pueden estar en otras ciudades. Por eso es importante registrar la placa y consultarla en el RUNT para identificar al propietario, el SOAT y los demás datos del vehículo.',
    escenarios: [
      ['Choque con un vehículo de carga de paso', 'Se identifica al propietario y a la empresa por la placa, y se verifican SOAT y pólizas. Las cámaras de peajes y estaciones de servicio sobre la vía pueden aportar imágenes.'],
      ['Accidente de un trabajador en el Centro Industrial del Norte', 'Hay que determinar si fue accidente de trabajo y coordinar la ARL con la reclamación al tercero responsable, si existe.'],
      ['Conductor que huye por la autopista', 'Denuncia el mismo día, aporta la descripción del vehículo y pide a negocios y peajes cercanos que conserven las imágenes.'],
    ],
    servicios: ['accidentes-carro', 'accidente-in-itinere', 'vehiculo-fantasma', 'responsabilidad-civil', 'lesiones-graves', 'aseguradoras-no-pagan'],
    faqs: [
      ['¿Dónde se tramita el informe de un accidente en Girardota?', 'El directorio oficial ubica la Secretaría de Tránsito en el Km 25, vereda El Paraíso, Centro Industrial del Norte, Local 202. Confirma los canales vigentes.'],
      ['El otro vehículo era de otra ciudad. ¿Cómo lo identifico?', 'Con la placa puedes consultar el RUNT para ver el propietario, el SOAT y otros datos públicos del vehículo. Guarda una captura con fecha y hora.'],
      ['Iba hacia mi trabajo en moto y me chocaron. ¿Interviene la ARL?', 'Puede intervenir si el hecho se califica como accidente de trabajo. El SOAT y la reclamación al responsable siguen siendo vías posibles; conviene revisarlo con los hechos concretos.'],
      ['¿Qué pruebas ayudan cuando el conductor huyó por la autopista?', 'La descripción del vehículo, cualquier dato de placa, las cámaras de negocios y peajes, los testigos y la denuncia presentada de inmediato.'],
    ],
  },
  {
    slug: 'barbosa', name: 'Barbosa', zona: 'norte', vecinos: ['Girardota'],
    vias: 'el corredor de la Autopista Norte hacia el norte y el nordeste de Antioquia', transporte: 'buses intermunicipales y transporte de carga',
    hook: 'Extremo norte del Valle de Aburrá: vías rurales, traslados a centros de mayor complejidad y vehículos sin seguro.',
    desc: 'Accidente en Barbosa, Antioquia: informe de tránsito, remisión a clínicas de Medellín, gastos que superan el SOAT y qué hacer si el vehículo no tenía seguro.',
    autoridad: { nombre: 'Secretaría de Tránsito de Barbosa', dir: 'Calle 15 # 14-48, Barbosa', tel: 'conmutador (604) 454 8300', web: 'https://www.barbosa.gov.co', nota: 'Datos del directorio oficial y del sitio de la alcaldía; confirma canales vigentes.' },
    p1: 'Barbosa es el municipio más septentrional del Valle de Aburrá y funciona como puerta de salida hacia el norte y el nordeste de Antioquia. Combina un casco urbano con extensas zonas rurales y vías de montaña, y recibe tráfico de paso de carga y pasajeros.',
    p2: 'La distancia respecto de los grandes centros de atención del área metropolitana hace que, en lesiones graves, la víctima suela ser trasladada a clínicas de Medellín. Documentar el primer centro de atención, el traslado y la remisión es esencial, porque la historia clínica completa es la base de cualquier reclamación.',
    p3: 'En tratamientos prolongados o complejos es habitual que el tope del SOAT se agote. Conviene guardar facturas y certificaciones de cada etapa y consultar pronto qué alternativas existen para continuar la atención y reclamar luego al responsable.',
    escenarios: [
      ['Accidente en una vía rural', 'Se documentan las condiciones del camino, la iluminación y la señalización; los vecinos y fincas cercanas pueden aportar testimonios y cámaras.'],
      ['Víctima remitida a Medellín por gravedad', 'Pide copia de la historia clínica de cada institución, del traslado y de la remisión. Sin esos documentos es difícil probar la secuencia de la atención.'],
      ['Vehículo sin SOAT o sin seguro', 'La atención médica puede apoyarse en ADRES según la normativa vigente, y la reclamación por los perjuicios se dirige al conductor y al propietario.'],
    ],
    servicios: ['vehiculo-sin-soat', 'gastos-medicos-superan-soat', 'accidentes-vias-mal-estado', 'lesiones-graves', 'accidente-mortal', 'soat'],
    faqs: [
      ['¿Dónde se tramita el informe de un accidente en Barbosa?', 'El directorio oficial ubica la Secretaría de Tránsito de Barbosa en la Calle 15 # 14-48 y la alcaldía publica el conmutador (604) 454 8300. Verifica los canales vigentes.'],
      ['Me remitieron a una clínica de Medellín. ¿Qué documentos debo guardar?', 'Las historias clínicas de cada institución, la orden de remisión, el registro del traslado y todas las facturas. Piden copia en admisiones o archivo clínico.'],
      ['El SOAT se agotó durante el tratamiento. ¿Qué hago?', 'No suspendas el tratamiento. Solicita la certificación del agotamiento, documenta los gastos y consulta qué otras coberturas aplican y cómo reclamar al responsable.'],
      ['¿Qué pasa si el vehículo que causó el accidente no tenía SOAT?', 'La atención médica de la víctima puede reclamarse a ADRES según la normativa vigente, y los demás perjuicios se dirigen al conductor y al propietario.'],
    ],
  },
];

// ---------- Oriente antioqueño ----------
// Rionegro: datos del portal oficial movilidad.rionegro.gov.co (Contáctenos).
// La Ceja y El Carmen de Viboral: nombre de la autoridad confirmado (sitio de la alcaldía y prensa regional);
// la dirección solo aparece en directorios no oficiales, por eso se marca como pendiente (candidato).
// El Retiro: no se verificó qué organismo de tránsito lo atiende; se orienta a confirmarlo con la alcaldía.
MUNICIPIOS.push(
  {
    slug: 'rionegro', name: 'Rionegro', region: 'oriente', zona: 'oriente', vecinos: ['La Ceja', 'El Carmen de Viboral', 'El Retiro'],
    vias: 'la autopista Medellín–Bogotá, las vías hacia el aeropuerto José María Córdova y las conexiones con Medellín por Las Palmas y el Túnel de Oriente', transporte: 'buses intermunicipales hacia Medellín y el Oriente, taxis, transporte especial al aeropuerto y vehículos de carga',
    hook: 'Aeropuerto, zona industrial y autopista Medellín–Bogotá: pasajeros, carga y motos en el principal centro urbano del Oriente.',
    desc: 'Accidente de tránsito en Rionegro, Antioquia: dónde pedir el informe, qué hacer si ibas de pasajero o te chocó un vehículo de carga y cómo reclamar.',
    autoridad: { nombre: 'Subsecretaría de Movilidad de Rionegro', dir: 'sede administrativa en la Carrera 49 # 48-12 (antiguo Carulla); sede operativa en la Carrera 47 # 62-50', tel: '(604) 520 40 60 (sede administrativa) · (604) 562 17 17 (sede operativa)', web: 'https://movilidad.rionegro.gov.co/web/contactenos/', nota: 'Datos del portal oficial de Movilidad Rionegro. Confirma qué sede atiende tu trámite y su horario.' },
    p1: 'Rionegro es el principal centro urbano del Oriente antioqueño y uno de los municipios de mayor crecimiento del departamento. Allí funciona el Aeropuerto Internacional José María Córdova, que mueve a diario taxis, vehículos de transporte especial, buses y carros particulares que van y vienen de Medellín y de otros municipios del Oriente.',
    p2: 'Por su territorio pasa la autopista Medellín–Bogotá y llegan las conexiones con Medellín por Las Palmas y por el Túnel de Oriente. Son corredores de alta velocidad donde se mezclan vehículos de carga, buses intermunicipales, motos y ciclistas. En los accidentes a alta velocidad las lesiones suelen ser graves, y desde el primer día conviene saber quién administra el tramo: el municipio, una entidad nacional o una concesión.',
    p3: 'Con la expansión de urbanizaciones, zonas comerciales e industriales, también crecen el tráfico local y los desplazamientos en moto. Si el vehículo que causó el accidente era de una empresa de transporte, de un servicio especial o de carga, hay que identificar la placa, la empresa afiliadora y las pólizas, porque esos vehículos suelen tener seguros de responsabilidad civil además del SOAT.',
    escenarios: [
      ['Pasajero lesionado en un taxi o vehículo de transporte especial', 'Se revisan el SOAT del vehículo, la responsabilidad de la empresa transportadora y sus pólizas. Guarda el recibo o la constancia del viaje, la placa y los datos del conductor.'],
      ['Choque con un vehículo de carga en la autopista', 'Se identifican el propietario, la empresa que despacha la carga y las aseguradoras. Anota la referencia del kilómetro o del sector y pide que conserven las imágenes de peajes y estaciones de servicio.'],
      ['Accidente de moto en vías urbanas en crecimiento', 'Pesan la señalización, las obras en la vía y la velocidad. Fotografía el lugar, incluidas las desviaciones o cierres temporales, porque pueden cambiar en pocos días.'],
    ],
    servicios: ['accidentes-pasajeros-transporte-publico', 'accidentes-carro', 'accidentes-moto', 'responsabilidad-civil', 'lesiones-graves', 'soat'],
    faqs: [
      ['¿Dónde se pide el informe de un accidente ocurrido en Rionegro?', 'El portal oficial de Movilidad Rionegro publica una sede administrativa en la Carrera 49 # 48-12 y una sede operativa en la Carrera 47 # 62-50. Confirma cuál atiende la solicitud y lleva la fecha, la hora y el lugar exacto del accidente.'],
      ['Me accidenté en un taxi que iba al aeropuerto. ¿A quién reclamo?', 'El SOAT del vehículo cubre tu atención médica inicial. Los demás perjuicios pueden reclamarse al responsable del accidente y, si aplica, a la empresa transportadora y a sus aseguradoras.'],
      ['El accidente fue en la autopista Medellín–Bogotá. ¿Cambia algo?', 'Cambia quién administra la vía y, a veces, qué autoridad atiende. Anota la referencia del sector o kilómetro y pregunta en el sitio qué autoridad hizo el informe.'],
      ['¿Puedo reclamar si el responsable es un vehículo de carga de otra ciudad?', 'Sí. Con la placa puedes consultar en el RUNT el propietario y el SOAT. La reclamación se dirige al conductor, al propietario, a la empresa y a sus aseguradoras, sin importar dónde estén registrados.'],
    ],
  },
  {
    slug: 'la-ceja', name: 'La Ceja', region: 'oriente', zona: 'oriente', vecinos: ['Rionegro', 'El Carmen de Viboral', 'El Retiro'],
    vias: 'la vía Rionegro–La Ceja, con ciclorruta en parte del trayecto, y las vías hacia La Unión y El Retiro', transporte: 'buses intermunicipales, motos, bicicletas y transporte de trabajadores de cultivos y empresas',
    hook: 'Ciclistas en la vía Rionegro–La Ceja, motos y desplazamientos de trabajadores en el Altiplano del Oriente.',
    desc: 'Accidente de tránsito en La Ceja, Antioquia: cómo pedir el informe a la Secretaría de Movilidad, qué hacer si eras ciclista o motociclista y cómo reclamar al responsable.',
    autoridad: { nombre: 'Secretaría de Movilidad de La Ceja', dir: 'confirma la sede vigente en el sitio oficial de la alcaldía', tel: 'conmutador de la alcaldía (604) 553 14 14', web: 'https://www.laceja-antioquia.gov.co/', nota: 'La alcaldía publica actos y notificaciones de esta secretaría en su sitio oficial; confirma allí la sede y los canales de atención.', candidato: 'dirección Carrera 17 # 21-54, Central Integradora de Transportes, que figura en un directorio no oficial' },
    p1: 'La Ceja del Tambo está en el Altiplano del Oriente antioqueño, cerca de Rionegro. Es un municipio con un casco urbano compacto y una zona rural amplia, donde muchas personas se desplazan en moto o en bicicleta hacia el trabajo, el estudio o los municipios vecinos.',
    p2: 'La vía Rionegro–La Ceja es uno de los corredores más usados del Altiplano y cuenta con ciclorruta en parte del trayecto. Allí conviven ciclistas deportivos y urbanos, motos, buses y vehículos de carga, incluidos tractocamiones. Cuando un ciclista o un motociclista resulta lesionado, la posición de cada vehículo en la vía, el uso de la berma y la ciclorruta y la maniobra de adelantamiento son puntos centrales del análisis.',
    p3: 'En el casco urbano, la alcaldía ha instalado semáforos en cruces identificados como de mayor accidentalidad y circulación de peatones. Si el accidente ocurrió en una intersección, la hora exacta, el estado del semáforo y las cámaras de los negocios cercanos ayudan a reconstruir lo que pasó.',
    escenarios: [
      ['Ciclista lesionado en la vía Rionegro–La Ceja', 'Se revisan la distancia lateral, el adelantamiento, el uso de la ciclorruta o la berma y la velocidad. Los registros de la aplicación de ciclismo y los videos de otros ciclistas o vehículos pueden ser decisivos.'],
      ['Trabajador accidentado en moto camino al trabajo', 'Puede tratarse de un accidente de trabajo. Se coordinan la ARL, el SOAT y la reclamación al tercero responsable, si lo hay.'],
      ['Choque en un cruce del casco urbano', 'Importan la fase del semáforo, la prelación y la visibilidad. Pide pronto las cámaras de los locales y anota los datos de los testigos.'],
    ],
    servicios: ['accidentes-ciclistas', 'accidentes-moto', 'accidente-in-itinere', 'accidentes-senalizacion-semaforos', 'lesiones-graves', 'soat'],
    faqs: [
      ['¿Dónde pido el informe de un accidente ocurrido en La Ceja?', 'Lo tramita la Secretaría de Movilidad de La Ceja. Confirma su sede y sus canales vigentes en el sitio oficial de la alcaldía antes de ir, y lleva la fecha, la hora y el lugar exacto.'],
      ['Me atropellaron en bicicleta en la vía a Rionegro. ¿Qué puedo reclamar?', 'Puedes reclamar por tus lesiones y por los daños a la bicicleta y los accesorios, con facturas y fotos. El SOAT del vehículo cubre tu atención médica inicial.'],
      ['El accidente ocurrió en un tramo que no es de La Ceja. ¿Importa?', 'Sí. Parte de la vía Rionegro–La Ceja pasa por otros municipios. Pregunta qué autoridad atendió y en qué jurisdicción quedó registrado el hecho, porque allí se pide el informe.'],
      ['¿Qué hago si un tractocamión me rozó y siguió su camino?', 'Anota cualquier dato de la placa o de la empresa, denuncia el mismo día y pide a estaciones de servicio y negocios cercanos que conserven sus videos.'],
    ],
  },
  {
    slug: 'el-carmen-de-viboral', name: 'El Carmen de Viboral', region: 'oriente', zona: 'oriente', vecinos: ['Rionegro', 'La Ceja'],
    vias: 'las vías que lo comunican con Rionegro y La Ceja, un tramo de la vía Rionegro–La Ceja y una extensa red de vías veredales', transporte: 'buses y transporte colectivo urbano y rural, motos y bicicletas',
    hook: 'Vías veredales, motos y tramos compartidos con la vía Rionegro–La Ceja en el municipio de la cerámica.',
    desc: 'Accidente de tránsito en El Carmen de Viboral: cómo pedir el informe a la Secretaría de Movilidad, Tránsito y Transporte, qué pruebas guardar en vías rurales y cómo reclamar.',
    autoridad: { nombre: 'Secretaría de Movilidad, Tránsito y Transporte de El Carmen de Viboral', dir: 'confirma la sede vigente en el sitio oficial de la alcaldía', tel: 'consulta el canal vigente en el sitio oficial de la alcaldía', web: 'https://www.elcarmendeviboral.gov.co/', nota: 'El nombre de la secretaría figura en comunicaciones de la alcaldía; confirma su sede y teléfono en el sitio oficial.', candidato: 'dirección Calle 31 # 30-06, Parque Principal, que figura en un directorio no oficial' },
    p1: 'El Carmen de Viboral, conocido por su tradición en cerámica artesanal, está en el Oriente antioqueño, muy cerca de Rionegro y La Ceja. Combina un casco urbano activo con una zona rural extensa, donde buena parte de la población se mueve en moto, en bicicleta o en transporte colectivo.',
    p2: 'Un tramo de la vía Rionegro–La Ceja está en jurisdicción de El Carmen de Viboral. Por eso, un accidente que la víctima recuerda como "en la vía a La Ceja" puede haber quedado registrado ante la autoridad de El Carmen. Precisar el sector y la autoridad que atendió evita perder tiempo pidiendo el informe en el lugar equivocado.',
    p3: 'En las vías veredales son frecuentes las curvas cerradas, las pendientes, la poca iluminación y los tramos sin berma. Si el estado de la vía influyó en el accidente (huecos, derrumbes, falta de señalización), además del conductor responsable puede analizarse la responsabilidad de la entidad que la administra.',
    escenarios: [
      ['Accidente de moto en una vía veredal', 'Se documentan la curva, la pendiente, la iluminación y el estado de la calzada con fotos y referencias. Los vecinos de la vereda suelen ser testigos clave.'],
      ['Choque en el tramo de la vía Rionegro–La Ceja', 'Primero se confirma la jurisdicción y la autoridad que atendió. Después se analizan la maniobra, la velocidad y las pólizas de los vehículos involucrados.'],
      ['Caída por un hueco o un derrumbe sin señalizar', 'Fotografía el punto exacto con una referencia de tamaño y la fecha. Se identifica la entidad a cargo de la vía para evaluar su responsabilidad.'],
    ],
    servicios: ['accidentes-moto', 'accidentes-vias-mal-estado', 'accidentes-ciclistas', 'lesiones-parrillero-moto', 'gastos-medicos-superan-soat', 'soat'],
    faqs: [
      ['¿Dónde pido el informe de un accidente en El Carmen de Viboral?', 'Lo tramita la Secretaría de Movilidad, Tránsito y Transporte del municipio. Confirma su sede y sus canales vigentes en el sitio oficial de la alcaldía.'],
      ['El accidente fue en la vía Rionegro–La Ceja. ¿Le toca a El Carmen?', 'Puede ser. Un tramo de esa vía está en jurisdicción de El Carmen de Viboral. Pregunta qué autoridad atendió y revisa la jurisdicción anotada en el informe.'],
      ['Me caí en moto por un hueco en una vía rural. ¿Puedo reclamar?', 'El SOAT de tu moto cubre la atención médica inicial. Si el mal estado de la vía causó el accidente, puede analizarse la responsabilidad de la entidad que la administra; documenta el lugar con fotos.'],
      ['Me trasladaron a una clínica de Rionegro o Medellín. ¿Qué guardo?', 'La historia clínica de cada institución, la orden de remisión, el registro del traslado y todas las facturas. Son la base de la reclamación.'],
    ],
  },
  {
    slug: 'el-retiro', name: 'El Retiro', region: 'oriente', zona: 'oriente', vecinos: ['Rionegro', 'La Ceja'],
    vias: 'vías de montaña que lo comunican con Medellín, Rionegro y La Ceja, con curvas, pendientes y neblina', transporte: 'buses intermunicipales, carros particulares de turismo y fin de semana, motos y ciclistas recreativos',
    hook: 'Vías de montaña, turismo de fin de semana y ciclistas recreativos entre Medellín y el Oriente.',
    desc: 'Accidente de tránsito en El Retiro, Antioquia: cómo identificar la autoridad que hizo el informe, qué pruebas guardar en vías de montaña y cómo reclamar SOAT y perjuicios.',
    autoridad: { nombre: 'autoridad de tránsito que atendió el accidente', titulo: 'Autoridad de tránsito en El Retiro', dir: 'confirma con la alcaldía de El Retiro qué autoridad es competente y dónde atiende', tel: 'consulta el canal vigente en el sitio oficial de la alcaldía', web: 'https://elretiro.gov.co/', nota: 'En vías nacionales o departamentales también puede atender la Policía de Tránsito y Transporte. Pregunta en el lugar quién hizo el informe y pide su número.', candidato: 'identificar el organismo de tránsito competente en El Retiro, su dirección y su teléfono' },
    p1: 'El Retiro está en el Oriente antioqueño, cerca de Medellín, y es un destino frecuente de descanso y turismo de fin de semana. Sus vías de montaña reciben carros particulares, buses intermunicipales, motos y una cantidad importante de ciclistas recreativos.',
    p2: 'Las curvas, las pendientes, la neblina y la lluvia hacen que la visibilidad cambie rápido. En este tipo de vías los accidentes por invasión de carril, pérdida de control o adelantamientos en curva son comunes, y las pruebas desaparecen pronto: marcas de frenado, restos de los vehículos y huellas en la berma. Fotografiar todo antes de mover los vehículos, si es seguro hacerlo, ayuda mucho.',
    p3: 'Dependiendo de la vía, el accidente puede atenderlo una autoridad municipal o la Policía de Tránsito y Transporte. Lo práctico es preguntar en el lugar quién hizo el informe, anotar el nombre y el número del agente y pedir el número del informe. Con esos datos se solicita la copia y se identifica quién administra el tramo.',
    escenarios: [
      ['Ciclista lesionado en una vía de montaña', 'Se analizan la distancia lateral, el adelantamiento en curva y la velocidad. Los datos de la aplicación de ciclismo y los videos de cámaras del casco o de otros vehículos pueden confirmar lo ocurrido.'],
      ['Choque por invasión de carril en una curva', 'Las marcas en la vía, la posición final de los vehículos y los daños muestran quién invadió el carril. Fotografíalas antes de que se pierdan.'],
      ['Accidente con lluvia o neblina', 'Se revisan la velocidad, las luces, la señalización y el estado de la vía. Anota la hora y el clima; pueden pesar en el análisis de responsabilidad.'],
    ],
    servicios: ['accidentes-ciclistas', 'accidentes-carro', 'accidentes-moto', 'accidentes-vias-mal-estado', 'lesiones-graves', 'accidente-mortal'],
    faqs: [
      ['¿Quién hace el informe de un accidente en El Retiro?', 'Depende de la vía: puede ser la autoridad de tránsito municipal o la Policía de Tránsito y Transporte. Pregunta en el lugar quién lo elaboró y confirma con la alcaldía dónde pedir la copia.'],
      ['Me accidenté en bicicleta un domingo en la vía de montaña. ¿Qué hago?', 'Busca atención médica, fotografía el lugar y tu bicicleta, guarda los datos del vehículo involucrado y de los testigos y exporta el registro de tu aplicación de ciclismo.'],
      ['¿Sirven los videos de otros conductores o ciclistas?', 'Sí. Las cámaras de casco, de tablero o de celular pueden ser decisivas. Pide una copia cuanto antes y guarda los datos de quien la grabó.'],
      ['El accidente fue con neblina. ¿El otro conductor puede alegar que no me vio?', 'Puede alegarlo, pero la neblina exige reducir la velocidad y usar luces. Cada caso se analiza con las pruebas de velocidad, luces y visibilidad.'],
    ],
  },
);

export const REGIONES = {
  aburra: { label: 'Valle de Aburrá', titulo: 'Municipios del Valle de Aburrá' },
  oriente: { label: 'Oriente antioqueño', titulo: 'Municipios del Oriente antioqueño' },
};
export const regionOf = (m) => m.region || 'aburra';

// Preguntas comunes a todas las páginas locales (se suman a las propias de cada municipio)
export const muniFaqs = (m) => [
  [`¿Atienden consultas de víctimas de accidentes en ${m.name}?`, `Sí, orientamos a personas lesionadas en ${m.name}, en el resto del ${REGIONES[regionOf(m)].label} y en Medellín. La primera orientación puede hacerse por teléfono, sin necesidad de desplazarte.`],
  ...m.faqs,
];

// Recursos locales adicionales (fuentes oficiales o del operador de tránsito)
export const RECURSOS = {
  sabaneta: [['Observatorio municipal de Sabaneta: movilidad y accidentalidad', 'https://observatorio.sabaneta.gov.co/estadisticas/habitat-y-territorio/movilidad-y-transporte/']],
  'la-estrella': [['EMTRASUR: operador de los servicios de tránsito de La Estrella', 'https://emtrasur.com.co/tramites-de-transito/']],
};
