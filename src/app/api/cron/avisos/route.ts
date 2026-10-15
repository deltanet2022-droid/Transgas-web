import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { dueDatesToNotify, sendDueNotices } from '@/lib/subscribers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const url = new URL(req.url);
  const given = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? url.searchParams.get('secret') ?? '';
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * GET /api/cron/avisos?secret=CRON_SECRET
 * Pensado para el "Cron Job" de Hostinger (una vez por hora o por día): envía los avisos pendientes de los
 * vencimientos que están a N días o menos (Configuración → días de anticipación). Reanudable y sin duplicados.
 */
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) return NextResponse.json({ ok: false, error: 'CRON_SECRET no está configurado.' }, { status: 503 });
  if (!authorized(req)) return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });

  const limit = Math.max(1, Number(process.env.NOTICE_BATCH || 100));
  let remaining = limit;
  const results: Record<string, unknown>[] = [];
  for (const due of await dueDatesToNotify()) {
    if (remaining <= 0) break;
    const r = await sendDueNotices(due.id, remaining);
    remaining -= r.sent + r.failed;
    results.push({ dueDateId: due.id, dueDate: due.dueDate.toISOString().slice(0, 10), ...r });
    if (r.reason === 'not_configured') break;
  }
  return NextResponse.json({ ok: true, processed: results });
}
