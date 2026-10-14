/** minúsculas, sin tildes, sin signos, espacios colapsados. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set(
  (
    'de la el los las un una unos unas y o a en que por para con mi mis tu tus su sus se me te lo le al del es son ' +
    'esta este eso esto ese esa quiero quisiera necesito puedo podria podrian tengo tienen tiene hay saber ' +
    'favor porfa pregunta duda'
  ).split(' '),
);

/**
 * Sinónimos simples → forma canónica. Se aplica igual a lo que escribe la persona y a las
 * palabras clave de cada FAQ, así que "boleta" y "factura" quedan equivalentes.
 */
const SYNONYMS: Record<string, string> = {
  boleta: 'factura',
  boletas: 'factura',
  resumen: 'factura',
  abonar: 'pago',
  abono: 'pago',
  pagar: 'pago',
  pagos: 'pago',
  pague: 'pago',
  pagando: 'pago',
  pagado: 'pago',
  cancelar: 'baja',
  perdida: 'fuga',
  escape: 'fuga',
  filtracion: 'fuga',
  pierde: 'fuga',
  huele: 'olor',
  oler: 'olor',
  olores: 'olor',
  olfato: 'olor',
  hedor: 'olor',
  intoxicacion: 'monoxido',
  co: 'monoxido',
  humano: 'persona',
  operador: 'persona',
  agente: 'persona',
  asesor: 'persona',
  empleado: 'persona',
  telefono: 'telefono',
  llamar: 'telefono',
  celular: 'telefono',
  whatsapp: 'whatsapp',
  wasap: 'whatsapp',
  wsp: 'whatsapp',
  demora: 'tarda',
  demorar: 'tarda',
  demoran: 'tarda',
  tardan: 'tarda',
  tardar: 'tarda',
  tarda: 'tarda',
  tiempo: 'tarda',
  plazo: 'tarda',
  cuesta: 'costo',
  precio: 'costo',
  precios: 'costo',
  valor: 'costo',
  cobran: 'costo',
  cobro: 'costo',
  importe: 'costo',
  conexion: 'alta',
  conectar: 'alta',
  instalar: 'alta',
  instalacion: 'alta',
  contratar: 'alta',
  desconectar: 'baja',
  darme: 'baja',
  corte: 'corte',
  cortaron: 'corte',
  cortado: 'corte',
  falta: 'corte',
  sinsuministro: 'corte',
  gasista: 'gasista',
  instalador: 'gasista',
  plomero: 'gasista',
  matriculado: 'matricula',
  matriculados: 'matricula',
  medidor: 'medidor',
  contador: 'medidor',
  reloj: 'medidor',
  lectura: 'lectura',
  inquilino: 'inquilino',
  alquilo: 'inquilino',
  alquiler: 'inquilino',
  alquilar: 'inquilino',
  inquilinos: 'inquilino',
  cooperativa: 'cooperativa',
  coop: 'cooperativa',
  chau: 'chau',
  adios: 'chau',
  hasta: 'hasta',
  gracias: 'gracias',
  muchas: 'muchas',
  genial: 'gracias',
  perfecto: 'gracias',
  buenas: 'hola',
  hola: 'hola',
  holis: 'hola',
  buenos: 'hola',
  buen: 'hola',
  ayuda: 'ayuda',
  ayudame: 'ayuda',
  ayudar: 'ayuda',
};

/** Plural → singular muy simple (facturas → factura). */
function stem(t: string): string {
  if (t.length >= 6 && t.endsWith('es')) return t.slice(0, -2);
  if (t.length >= 4 && t.endsWith('s')) return t.slice(0, -1);
  return t;
}

/** conectarme → conectar, pagarlo → pagar (infinitivo + pronombre). */
function stripClitic(t: string): string {
  const m = /^(.{3,}(?:ar|er|ir))(?:me|te|se|lo|la|le|nos)$/.exec(t);
  return m ? m[1] : t;
}

/** Verbos frecuentes → forma canónica (conectar/conectan/conectaron → alta, etc.). */
function verbCanon(t: string): string | undefined {
  if (/^(conect|instal|contrat)(ar|an|en|aron|amos|o)$/.test(t)) return 'alta';
  return undefined;
}

/** normaliza → tokens sin stopwords → canónicos (sinónimos + singular). */
export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const raw of normalize(text).split(' ')) {
    if (!raw || STOPWORDS.has(raw)) continue;
    const t = stripClitic(raw);
    const canon = SYNONYMS[t] ?? SYNONYMS[stem(t)] ?? verbCanon(t) ?? stem(t);
    out.push(canon);
  }
  return out;
}

function levenshtein1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** Coincidencia aproximada entre dos tokens canónicos (typos y variantes de conjugación). */
export function fuzzyEqual(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 5 || b.length < 5) return false;
  if (levenshtein1(a, b)) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 5 && long.startsWith(short.slice(0, Math.max(5, short.length - 1)));
}
