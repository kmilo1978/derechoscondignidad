// Bancos de preguntas frecuentes por tema. Cada sección/página completa al menos 6 con preguntas propias + estas.
// Respuestas prudentes: sin cifras, plazos ni promesas. Revisión jurídica obligatoria.

export const POOLS = {
  primeros: [
    ['¿Debo llamar a la autoridad de tránsito aunque el accidente parezca leve?', 'Sí cuando hay lesionados o desacuerdo. El informe de la autoridad (IPAT) es una prueba importante y conviene que se elabore en el lugar.'],
    ['¿Puedo moverme del lugar del accidente?', 'Si hay lesionados, la prioridad es la atención médica. Antes de mover los vehículos, toma fotos y videos de su posición, salvo que haya riesgo.'],
    ['¿Qué pasa si siento que no tengo nada pero luego me duele?', 'Algunas lesiones aparecen horas o días después. Consulta a un médico apenas notes síntomas y cuéntale del accidente para que quede en la historia clínica.'],
    ['¿Qué datos debo pedirle al otro conductor?', 'Nombre, documento, teléfono, placa del vehículo y aseguradora o número de SOAT. Si se niega, anota la placa y busca testigos.'],
    ['¿Es buena idea publicar el accidente en redes sociales?', 'No conviene. Lo que publiques puede usarse para cuestionar tu versión o la gravedad de tus lesiones.'],
    ['¿Debo guardar la ropa y los objetos dañados?', 'Sí, mientras no se haya resuelto el caso. Casco, ropa, celular o bicicleta dañados pueden servir como prueba de la fuerza del impacto y del valor de los daños.'],
    ['¿Cuándo debo consultar a un abogado?', 'Cuanto antes si hay lesiones importantes, una oferta de pago, un responsable sin seguro o desacuerdo sobre la culpa. Así se evitan errores que cuesta corregir.'],
    ['¿Qué hago si el conductor me ofrece pagarme en efectivo?', 'Puedes escuchar la oferta, pero no estás obligado a aceptarla ni a firmar nada. Aún no se conoce el alcance de tus lesiones ni tus gastos futuros.'],
  ],
  seguros: [
    ['¿El SOAT cubre aunque yo haya tenido la culpa?', 'Sí. El SOAT atiende a las víctimas de accidentes de tránsito sin importar quién fue responsable, dentro de sus amparos y topes.'],
    ['¿El SOAT cubre los daños al vehículo?', 'No. El SOAT atiende a las personas lesionadas o fallecidas, no los daños materiales de los vehículos.'],
    ['¿Quién me atiende si el vehículo no tenía SOAT?', 'La atención de urgencias no debe negarse. Los servicios de salud a víctimas pueden reclamarse a ADRES según la normativa vigente.'],
    ['¿Qué es una objeción de la aseguradora?', 'Es la respuesta formal con que la aseguradora rechaza o cuestiona una reclamación, indicando sus razones. No siempre es la última palabra.'],
    ['¿Debo firmar el finiquito que me envía la aseguradora?', 'No sin entender sus efectos. Muchos finiquitos incluyen una renuncia a reclamar más, y firmarlo puede ser difícil de revertir.'],
    ['¿Dónde puedo quejarme de una aseguradora?', 'Ante la propia aseguradora, su defensor del consumidor financiero y la Superintendencia Financiera, según el caso.'],
    ['¿Puedo reclamar el SOAT y además a la aseguradora del responsable?', 'En general son vías distintas con objetos distintos. Conviene planearlas con asesoría para evitar duplicidades y perder derechos.'],
    ['¿Cómo verifico si un vehículo tenía SOAT vigente?', 'Consultando la placa en el RUNT. Guarda una captura con fecha y hora como prueba.'],
  ],
  lesiones: [
    ['¿Qué documentos médicos son más importantes?', 'La historia clínica, la epicrisis, las órdenes médicas, las incapacidades y los dictámenes. Pide copia de todos y guárdalos.'],
    ['¿Qué es la pérdida de capacidad laboral?', 'Es el porcentaje que mide cuánto disminuye tu capacidad para trabajar por una lesión, calificado por las entidades competentes.'],
    ['¿Debo esperar a terminar el tratamiento para reclamar?', 'Reclamar con el pronóstico claro suele ser mejor, pero no debes dejar vencer plazos legales. Consulta cómo planear los tiempos.'],
    ['¿Qué hace Medicina Legal en mi caso?', 'Emite dictámenes médico-legales, como la incapacidad y las secuelas, que se usan en procesos penales y reclamaciones.'],
    ['¿Puedo reclamar si tenía una condición médica previa?', 'Sí. Se analiza cuánto agravó el accidente tu situación, con soporte médico.'],
    ['¿Cuentan las secuelas emocionales?', 'Sí, si están documentadas por profesionales de salud mental y se relacionan con el accidente.'],
    ['¿Qué pasa si no estoy de acuerdo con un dictamen?', 'Los dictámenes pueden controvertirse mediante los recursos que prevé la ley. Revisa los plazos con asesoría.'],
    ['¿Los tratamientos futuros se pueden reclamar?', 'Pueden analizarse como perjuicio futuro con soporte médico y cotizaciones.'],
  ],
  transporte: [
    ['¿Quién responde si iba de pasajero y el conductor causó el accidente?', 'Puede responder el conductor, el propietario, la empresa y sus aseguradoras, según las circunstancias y los seguros aplicables.'],
    ['¿Cómo pruebo que iba en el vehículo?', 'Con tiquetes, comprobantes de la app, testigos, fotos y el informe de la autoridad.'],
    ['¿El parrillero tiene cobertura del SOAT?', 'Sí. El SOAT del vehículo atiende a sus ocupantes, incluido el parrillero, dentro de sus amparos.'],
    ['¿Los peatones tienen prelación?', 'Los conductores tienen deberes de cuidado frente a los peatones. Cada caso se analiza con las pruebas del lugar y las circunstancias.'],
    ['¿Qué hago si el conductor huyó?', 'Denuncia de inmediato, busca cámaras y testigos y pide atención médica. Existen coberturas de atención para vehículos no identificados.'],
    ['¿Puedo reclamar los daños a mi bicicleta o moto?', 'Sí, como daño emergente, con soportes de su valor y de los daños.'],
    ['¿Una plataforma de transporte responde por el accidente?', 'Depende de sus términos, de las pólizas y de las circunstancias. Debe analizarse en cada caso.'],
    ['¿Y si no llevaba casco o cinturón?', 'Puede influir en el análisis de responsabilidad, pero no elimina automáticamente tus derechos.'],
  ],
  estado: [
    ['¿Contra quién se reclama si la vía estaba en mal estado?', 'Contra la entidad responsable de su mantenimiento: municipio, departamento, concesión u otra. Debe verificarse caso por caso.'],
    ['¿Qué pruebas ayudan en un accidente por hueco o señalización?', 'Fotos y videos con referencias del lugar, ubicación exacta, reportes previos del daño, testigos e IPAT.'],
    ['¿Los procesos contra entidades públicas tienen plazos especiales?', 'Sí, suelen tener requisitos previos y plazos propios. No los dejes vencer: consulta pronto.'],
    ['¿Puedo reclamar si el semáforo estaba dañado?', 'Puede analizarse la responsabilidad de la entidad a cargo si la falla causó el accidente y puede probarse.'],
    ['¿Sirve reportar el hueco después del accidente?', 'Sí. Un reporte oficial y fotos con fecha ayudan como prueba, aunque no reemplazan las pruebas del hecho.'],
    ['¿El SOAT cubre si la causa fue la vía?', 'Sí. El SOAT atiende a las víctimas sin importar la causa del accidente.'],
    ['¿Qué es la reparación directa?', 'Es el medio por el cual se reclama ante la jurisdicción contencioso-administrativa la reparación de daños causados por el Estado. Tiene reglas y plazos propios.'],
    ['¿Quién administra una vía concesionada?', 'El concesionario y la entidad contratante, según el contrato. Debe identificarse antes de reclamar.'],
  ],
  proceso: [
    ['¿Cuánto tarda una reclamación?', 'Depende de la vía elegida, la complejidad y la disposición de las partes. Un abogado responsable no promete tiempos.'],
    ['¿Es obligatorio ir a juicio?', 'No. Muchos casos se resuelven por reclamación directa o conciliación.'],
    ['¿Qué es la conciliación?', 'Un mecanismo para resolver un conflicto mediante acuerdo ante un conciliador; en muchos casos civiles es requisito antes de demandar.'],
    ['¿Qué pruebas pesan más en un caso?', 'Historia clínica, dictámenes, IPAT, videos, testigos y soportes de ingresos y gastos.'],
    ['¿Qué es la concurrencia de culpas?', 'Ocurre cuando ambas partes contribuyeron al accidente. Puede reducir el valor de la reparación, no necesariamente eliminarla.'],
    ['¿Puedo reclamar si el responsable no tiene seguro?', 'Sí, puede reclamarse directamente al conductor y al propietario, valorando la viabilidad de cobro.'],
    ['¿Qué es el lucro cesante?', 'Los ingresos que dejas de percibir por el accidente. Se distingue el consolidado (pasado) y el futuro.'],
    ['¿Cómo se prueban los perjuicios morales?', 'Con historia clínica, dictámenes, testimonios y soportes de la afectación. No hay montos automáticos.'],
  ],
  honorarios: [
    ['¿Cómo se cobran los honorarios?', 'Según lo pactado por escrito: valor fijo, porcentaje del resultado (cuota litis) o una combinación.'],
    ['¿Qué es la cuota litis?', 'Una modalidad en la que el abogado cobra un porcentaje de lo que se recupere. El porcentaje y las condiciones deben constar por escrito.'],
    ['¿Quién paga los gastos del proceso?', 'Depende del contrato. Aclara por escrito quién asume peritajes, copias, notificaciones y otros gastos.'],
    ['¿Existe un porcentaje único de cuota litis?', 'No. Desconfía de quien lo presente como tarifa universal.'],
    ['¿Qué pasa si no se obtiene resultado?', 'Debe estar definido en el contrato: si hay cobro, qué gastos se asumen y cómo termina la relación.'],
    ['¿Puedo cambiar de abogado?', 'En general sí, pero conviene revisar el contrato y lo pactado sobre honorarios.'],
    ['¿La primera consulta tiene costo?', 'No. La consulta inicial no tiene costo; los honorarios solo se acuerdan por escrito si decides contratarnos.'],
    ['¿Cómo verifico a un abogado?', 'Solicita su nombre completo y tarjeta profesional, y verifica en fuentes oficiales su vigencia y antecedentes.'],
  ],
  contacto: [
    ['¿Cuál es la forma más rápida de contactarlos?', 'Llamando al +57 (604) 557 5073. El formulario también sirve para dejar tu caso resumido y que te contactemos.'],
    ['¿Qué información debo tener a la mano?', 'Fecha y lugar del accidente, si hubo lesionados, si la autoridad hizo informe, datos del otro vehículo y los documentos médicos que tengas.'],
    ['¿La primera orientación compromete a algo?', 'No. Es una conversación inicial para entender tu caso y explicarte opciones, sin presiones.'],
    ['¿Mis datos están protegidos?', 'Tus datos se tratan conforme a la política de privacidad y a la autorización que aceptas. Puedes solicitar su actualización o supresión.'],
    ['¿Debo enviar documentos por el formulario?', 'No. Te indicaremos por qué canal enviarlos de forma segura cuando hablemos.'],
    ['¿Atienden a familiares de la víctima?', 'Sí. Un familiar puede consultar en nombre de la víctima, especialmente si ella no puede hacerlo.'],
    ['¿Hay atención las 24 horas?', 'Sí, la firma tiene disponibilidad 24/7. Si no te contestamos de inmediato, deja tu mensaje y te respondemos lo antes posible.'],
    ['¿Se puede consultar sin ir a una oficina?', 'Sí. La primera orientación puede hacerse por teléfono; si prefieres ir en persona, estamos en la Calle 53 # 45-112, Medellín.'],
  ],
  calculadora: [
    ['¿La calculadora me dice cuánto me van a pagar?', 'No. Es una herramienta orientativa que muestra cómo influyen variables como ingresos, incapacidad y secuelas. No es una oferta ni una predicción.'],
    ['¿Por qué no calcula el daño moral?', 'Porque no existe una fórmula única: depende de las pruebas y de la valoración del juez o del acuerdo.'],
    ['¿De dónde salen las fórmulas?', 'Se basan en conceptos de uso habitual (renta actualizada con interés técnico) y deben ser validadas por un abogado antes de usarse como referencia.'],
    ['¿Qué datos necesito para usarla?', 'Ingresos mensuales, días de incapacidad, porcentaje de pérdida de capacidad laboral (si existe), edad y gastos soportados.'],
    ['¿Qué pasa si no tengo calificación de pérdida de capacidad laboral?', 'Deja el campo en cero. La calificación la emiten entidades competentes; sin ella no es posible estimar el lucro cesante futuro.'],
    ['¿Puedo compartir el resultado con un abogado?', 'Sí. Puedes copiar el resumen o enviarlo por WhatsApp para que sea revisado.'],
    ['¿Se guardan mis datos?', 'Los cálculos se hacen en tu navegador. No se envían a ningún servidor a menos que decidas compartirlos.'],
    ['¿Por qué cambia el resultado al modificar la culpa?', 'Porque la concurrencia de culpas puede reducir la reparación proporcionalmente.'],
  ],
  cobertura: [
    ['¿Atienden casos de todo el Valle de Aburrá y del Oriente?', 'Orientamos a víctimas de accidentes en los diez municipios del Valle de Aburrá y en Rionegro, La Ceja, El Retiro y El Carmen de Viboral. Confirma la modalidad de atención al contactarnos.'],
    ['¿El SOAT cubre si el vehículo está matriculado en otro municipio?', 'Sí. El SOAT es un seguro de alcance nacional; no depende del municipio de matrícula.'],
    ['¿Dónde se hace el informe del accidente según el municipio?', 'Lo elabora la autoridad de tránsito competente en la vía donde ocurrió. Verifica el procedimiento en la entidad oficial del municipio.'],
    ['¿Quién responde por una vía nacional que cruza el municipio?', 'Depende de quién la administra (entidad nacional, concesión o municipio). Debe verificarse caso por caso.'],
    ['¿Puedo ser atendido en una clínica de otro municipio?', 'En urgencias, el centro más cercano. Después, la remisión depende de tu EPS y de las coberturas aplicables.'],
    ['¿Qué pasa si el accidente ocurrió en un límite entre municipios?', 'La competencia de la autoridad se define según el lugar exacto. Anota la dirección y referencias para precisarlo.'],
    ['¿Hay diferencias legales entre municipios?', 'La ley sustancial es nacional. Cambian la autoridad de tránsito local, el estado de las vías y los trámites administrativos.'],
    ['¿Atienden casos de Rionegro u otros municipios de Antioquia?', 'Escríbenos con los detalles y te indicamos si podemos orientarte.'],
  ],
};

export const POOLS_BY_HUB = {
  'accidentes-lesiones': ['lesiones', 'primeros', 'proceso', 'seguros'],
  'victimas-transporte': ['transporte', 'seguros', 'primeros', 'proceso'],
  'soat-aseguradoras': ['seguros', 'proceso', 'primeros', 'lesiones'],
  'responsabilidad-estado': ['estado', 'proceso', 'seguros', 'lesiones'],
};
export const POOLS_BY_CLUSTER = {
  Pilar: ['primeros', 'seguros', 'proceso', 'lesiones'],
  'Primeras horas': ['primeros', 'seguros', 'proceso'],
  SOAT: ['seguros', 'proceso', 'primeros'],
  'Cuánto vale': ['proceso', 'lesiones', 'seguros'],
  'Plazos y proceso': ['proceso', 'estado', 'seguros'],
  Actores: ['transporte', 'primeros', 'seguros'],
  'Actores viales': ['transporte', 'primeros', 'seguros'],
  Estado: ['estado', 'proceso', 'primeros'],
  Aseguradoras: ['seguros', 'proceso', 'honorarios'],
  'Medicina Legal': ['lesiones', 'proceso', 'seguros'],
  Costo: ['honorarios', 'proceso', 'primeros'],
};

/** Devuelve una lista sin duplicados con al menos `min` preguntas (propias + banco rotado por semilla). */
export function faqsFor(own = [], pools = ['primeros'], seed = '', min = 6) {
  const seen = new Set();
  const out = [];
  const add = (qa) => { const k = qa[0].toLowerCase().trim(); if (!seen.has(k)) { seen.add(k); out.push(qa); } };
  own.forEach(add);
  const h = Math.abs([...String(seed)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7));
  const pool = pools.flatMap((p) => POOLS[p] || []);
  for (let i = 0; out.length < min && i < pool.length; i++) add(pool[(h + i) % pool.length]);
  return out;
}
