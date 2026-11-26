// Estamentos del Estado colombiano y organismos internacionales de derechos humanos.
// Todas las URLs corresponden a portales oficiales verificados.

export const ENTITIES = [
  {
    id: 'jep',
    name: 'Jurisdicción Especial para la Paz (JEP)',
    url: 'https://www.jep.gov.co/',
    desc: 'Componente de justicia del Sistema Integral de Verdad, Justicia, Reparación y No Repetición.',
    patterns: [
      /\bJurisdicción Especial para la Paz \(JEP\)/g,
      /\bJurisdicción Especial para la Paz\b/g,
      /\bJEP\b/g,
    ],
  },
  {
    id: 'cidh',
    name: 'Comisión Interamericana de Derechos Humanos (CIDH)',
    url: 'https://www.oas.org/es/cidh/',
    desc: 'Órgano principal y autónomo de la OEA encargado de la promoción y protección de los derechos humanos.',
    patterns: [
      /\bComisión Interamericana de Derechos Humanos \(CIDH\)/g,
      /\bComisión Interamericana de Derechos Humanos\b/g,
      /\bCIDH\b/g,
    ],
  },
  {
    id: 'corte-idh',
    name: 'Corte Interamericana de Derechos Humanos (Corte IDH)',
    url: 'https://www.corteidh.or.cr/',
    desc: 'Institución judicial autónoma del sistema interamericano encargada de juzgar violaciones de derechos humanos.',
    patterns: [
      /\bCorte Interamericana de Derechos Humanos \(Corte IDH\)/g,
      /\bCorte Interamericana de Derechos Humanos\b/g,
      /\bCorte Interamericana\b/g,
      /\bCorte IDH\b/g,
    ],
  },
  {
    id: 'oea',
    name: 'Organización de los Estados Americanos (OEA)',
    url: 'https://www.oas.org/es/',
    desc: 'Organismo regional del que hace parte el Sistema Interamericano de Derechos Humanos.',
    patterns: [
      /\bOEA\b/g,
    ],
  },
  {
    id: 'consejo-estado',
    name: 'Consejo de Estado de Colombia',
    url: 'https://www.consejodeestado.gov.co/',
    desc: 'Máximo tribunal de la jurisdicción contencioso-administrativa en Colombia, competente en demandas de reparación directa.',
    patterns: [
      /\bConsejo de Estado\b/g,
    ],
  },
  {
    id: 'fiscalia',
    name: 'Fiscalía General de la Nación',
    url: 'https://www.fiscalia.gov.co/colombia/',
    desc: 'Entidad encargada de investigar los delitos y acusar a los presuntos responsables ante los jueces.',
    patterns: [
      /\bFiscalía General de la Nación\b/g,
      /\b[Ff]iscalía\b/g,
    ],
  },
  {
    id: 'arn',
    name: 'Agencia para la Reincorporación y la Normalización (ARN)',
    url: 'https://www.reincorporacion.gov.co/',
    desc: 'Entidad estatal encargada de gestionar la reincorporación de excombatientes firmantes del Acuerdo de Paz.',
    patterns: [
      /\bARN\b/g,
    ],
  },
  {
    id: 'ejercito',
    name: 'Ejército Nacional de Colombia',
    url: 'https://www.ejercito.mil.co/',
    desc: 'Fuerza militar del Estado colombiano.',
    patterns: [
      /\bEjército Nacional\b/g,
      /\bEjército\b/g,
    ],
  },
  {
    id: 'policia',
    name: 'Policía Nacional de Colombia',
    url: 'https://www.policia.gov.co/',
    desc: 'Cuerpo armado de naturaleza civil perteneciente a la Fuerza Pública.',
    patterns: [
      /\bPolicía Nacional\b/g,
      /\b[Pp]olicía\b/g,
    ],
  },
  {
    id: 'mindefensa',
    name: 'Ministerio de Defensa Nacional (Fuerza Pública)',
    url: 'https://www.mindefensa.gov.co/',
    desc: 'Ministerio del sector defensa y dirección institucional de la Fuerza Pública en Colombia.',
    patterns: [
      /\b[Ff]uerza [Pp]ública\b/g,
    ],
  },
  {
    id: 'onu',
    name: 'Naciones Unidas - Derechos Humanos (ACNUDH)',
    url: 'https://www.ohchr.org/es',
    desc: 'Oficina del Alto Comisionado de las Naciones Unidas para los Derechos Humanos.',
    patterns: [
      /\bConvención contra la Tortura de la ONU\b/g,
      /\bONU\b/g,
    ],
  },
  {
    id: 'sic',
    name: 'Superintendencia de Industria y Comercio (SIC)',
    url: 'https://www.sic.gov.co/',
    desc: 'Autoridad nacional en materia de protección de datos personales en Colombia.',
    patterns: [
      /\bSuperintendencia de Industria y Comercio \(SIC\)/g,
      /\bSuperintendencia de Industria y Comercio\b/g,
    ],
  },
];

// Enlaza la primera o todas las menciones de estamentos en HTML ya escapado, evitando anidar <a>.
export function linkEntities(escapedHtml) {
  const tokens = [];
  let out = escapedHtml;
  const linkClass = 'underline decoration-gold-600/70 underline-offset-2 text-navy-900 font-medium hover:text-gold-700 transition-colors';

  for (const ent of ENTITIES) {
    for (const re of ent.patterns) {
      out = out.replace(re, (match) => {
        const idx = tokens.length;
        tokens.push(
          `<a href="${ent.url}" target="_blank" rel="noopener noreferrer" class="${linkClass}" title="Sitio oficial: ${ent.name} (se abre en una nueva pestaña)">${match}<span class="sr-only"> (enlace externo a ${ent.name})</span></a>`
        );
        return `\u0002${idx}\u0002`;
      });
    }
  }
  return out.replace(/\u0002(\d+)\u0002/g, (_, i) => tokens[+i]);
}

export function detectEntities(text) {
  const found = [];
  for (const ent of ENTITIES) {
    if (ent.patterns.some((re) => { re.lastIndex = 0; return re.test(text); })) {
      found.push(ent);
    }
  }
  return found;
}
