/**
 * Rangos de consumo oficiales de cada categoría tarifaria (fuente: transgas.com.ar, "Categorías de usuarios", y segmentación de la Res. ENARGAS I-409/08 con la categoría R4 que la completa).
 * La categoría se determina con el consumo acumulado de los últimos seis bimestres; el equivalente
 * por bimestre es una aproximación (consumo anual ÷ 6) para orientar al usuario.
 *
 * Si en el CRM se completa el "Rango de consumo" de una categoría, ese texto tiene prioridad sobre este.
 */
type Range = { min: number; max: number | null };

const RANGES: Record<string, Range> = {
  R1: { min: 0, max: 500 },
  'R2-1': { min: 501, max: 650 },
  'R2-2': { min: 651, max: 800 },
  'R2-3': { min: 801, max: 1000 },
  'R3-1': { min: 1001, max: 1250 },
  'R3-2': { min: 1251, max: 1500 },
  'R3-3': { min: 1501, max: 1800 },
  'R3-4': { min: 1801, max: 3000 },
  R4: { min: 3001, max: null },
  SGP1: { min: 0, max: 12000 },
  SGP2: { min: 12001, max: 108000 },
  'SGP3-a': { min: 108001, max: 180000 },
  'SGP3-b': { min: 180001, max: null },
};

const nf = new Intl.NumberFormat('es-AR');
const norm = (code: string) => code.replace(/\s+/g, '').toLowerCase();
const KEYS = new Map(Object.keys(RANGES).map((k) => [norm(k), k]));

function lookup(code: string): Range | null {
  const k = KEYS.get(norm(code));
  return k ? RANGES[k] : null;
}

function label(r: Range): string {
  if (r.max === null) return `Más de ${nf.format(r.min - 1)} m³`;
  if (r.min === 0) return `Hasta ${nf.format(r.max)} m³`;
  return `De ${nf.format(r.min)} a ${nf.format(r.max)} m³`;
}

/** Texto del rango anual (ej. "De 501 a 650 m³"). null si la categoría no es una de las oficiales. */
export function annualRange(code: string, custom?: string | null): string | null {
  if (custom && custom.trim()) return custom.trim();
  const r = lookup(code);
  return r ? label(r) : null;
}

/** Equivalente aproximado por bimestre (consumo anual ÷ 6, redondeado). */
export function bimonthlyRange(code: string): string | null {
  const r = lookup(code);
  if (!r) return null;
  const min = Math.round(r.min / 6);
  if (r.max === null) return `Más de ${nf.format(Math.round((r.min - 1) / 6))} m³`;
  const max = Math.round(r.max / 6);
  if (r.min === 0) return `Hasta ${nf.format(max)} m³`;
  return `De ${nf.format(min)} a ${nf.format(max)} m³`;
}
