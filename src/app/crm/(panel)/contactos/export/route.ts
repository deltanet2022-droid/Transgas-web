import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { LEAD_TYPE_LABEL, extraFieldLabel, type LeadTypeKey } from '@/lib/leads/config';
import { LEAD_STATUS_LABEL, leadWhere, toCsv } from '@/lib/crm/leads';

export const dynamic = 'force-dynamic';

/** GET /crm/contactos/export?type=&status=&q= → CSV con los contactos filtrados. */
export async function GET(req: Request) {
  await requireUser();
  const sp = new URL(req.url).searchParams;
  const leads = await prisma.lead.findMany({
    where: leadWhere({ type: sp.get('type') ?? undefined, status: sp.get('status') ?? undefined, q: sp.get('q') ?? undefined }),
    orderBy: { createdAt: 'desc' },
    take: 20_000,
  });

  const rows: unknown[][] = [['ID', 'Fecha', 'Tipo', 'Estado', 'Nombre', 'Email', 'Teléfono', 'Mensaje', 'Datos adicionales', 'Notas internas']];
  for (const l of leads) {
    const extra = Object.entries((l.extraData ?? {}) as Record<string, unknown>)
      .map(([k, v]) => `${extraFieldLabel(l.type as LeadTypeKey, k)}: ${typeof v === 'boolean' ? (v ? 'Sí' : 'No') : v}`)
      .join(' | ');
    rows.push([
      l.id,
      l.createdAt.toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' }),
      LEAD_TYPE_LABEL[l.type as LeadTypeKey],
      LEAD_STATUS_LABEL[l.status],
      l.name,
      l.email,
      l.phone,
      l.message,
      extra,
      l.internalNotes,
    ]);
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="contactos-transgas-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
