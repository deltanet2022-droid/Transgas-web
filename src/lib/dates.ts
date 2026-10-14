// Argentina no usa horario de verano: UTC-3 fijo.
export const TZ = 'America/Argentina/Cordoba';

/** Hoy (en Argentina) como fecha a medianoche UTC, comparable con campos "solo fecha". */
export function todayAR(): Date {
  const s = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
  return new Date(`${s}T00:00:00.000Z`);
}

/** "2026-03-15" → Date (medianoche UTC). null si es inválida. */
export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dateOnlyInput(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : '';
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}

/** Fecha sin hora (campos "solo fecha"). */
export function formatDateOnly(d: Date | null | undefined, style: 'long' | 'short' = 'long'): string {
  if (!d) return '—';
  return d.toLocaleDateString('es-AR', {
    timeZone: 'UTC',
    day: 'numeric',
    month: style === 'long' ? 'long' : '2-digit',
    year: 'numeric',
  });
}

/** Fecha y hora real (instantes), mostrada en horario de Argentina. */
export function formatDateTime(d: Date | null | undefined): string {
  if (!d) return '—';
  return d.toLocaleString('es-AR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateLong(d: Date | null | undefined): string {
  if (!d) return '—';
  return d.toLocaleDateString('es-AR', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' });
}

/** "2026-03-15T10:30" (hora de Argentina) → Date */
export function parseArgDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const v = value.length === 16 ? `${value}:00` : value;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(v)) return null;
  const d = new Date(`${v}-03:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Date → valor para <input type="datetime-local"> en hora de Argentina. */
export function argDateTimeInput(d: Date | null | undefined): string {
  if (!d) return '';
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(d);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}
