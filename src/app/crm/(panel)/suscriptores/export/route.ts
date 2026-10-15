import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { toCsv } from '@/lib/crm/leads';

export const dynamic = 'force-dynamic';

const iso = (d: Date | null) => (d ? d.toISOString() : '');

export async function GET() {
  await requireUser();
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
  const rows: unknown[][] = [['Correo', 'Nº de cliente', 'Estado', 'Alta', 'Confirmó', 'Baja', 'Consentimiento (UTC)', 'Versión de la política']];
  for (const s of subs) rows.push([s.email, s.clientNumber, s.unsubscribedAt ? 'Baja' : s.confirmedAt ? 'Activo' : 'Sin confirmar', iso(s.createdAt), iso(s.confirmedAt), iso(s.unsubscribedAt), iso(s.consentAt), s.consentVersion]);
  return new NextResponse(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="suscriptores-transgas-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
