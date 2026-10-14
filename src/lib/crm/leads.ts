import type { LeadStatus, LeadType, Prisma } from '@prisma/client';
import { LEAD_TYPES } from '@/lib/leads/config';

export const LEAD_STATUSES = ['NUEVO', 'EN_GESTION', 'RESUELTO'] as const;
export const LEAD_STATUS_LABEL: Record<(typeof LEAD_STATUSES)[number], string> = {
  NUEVO: 'Nuevo',
  EN_GESTION: 'En gestión',
  RESUELTO: 'Resuelto',
};

/** Filtros de la bandeja, tomados de los query params (valida contra las listas permitidas). */
export function leadWhere(params: { type?: string; status?: string; q?: string }): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  if (params.type && (LEAD_TYPES as readonly string[]).includes(params.type)) where.type = params.type as LeadType;
  if (params.status && (LEAD_STATUSES as readonly string[]).includes(params.status)) where.status = params.status as LeadStatus;
  const q = params.q?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } },
      { message: { contains: q, mode: 'insensitive' } },
    ];
  }
  return where;
}

/** Evita que Excel/Sheets interpreten una celda como fórmula (CSV injection). */
function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv(rows: unknown[][]): string {
  // BOM para que Excel abra bien las tildes; CRLF como terminador de línea.
  return `﻿${rows.map((r) => r.map(csvCell).join(',')).join('\r\n')}\r\n`;
}
