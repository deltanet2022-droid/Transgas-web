import Link from 'next/link';
import { prisma, safe } from '@/lib/db';
import { formatDateOnly, todayAR } from '@/lib/dates';

/** Franjas superiores: vencimiento vigente hoy (tabla due_dates) y aviso de servicio en curso. */
export async function SiteBanners() {
  const today = todayAR();
  const [due, active] = await Promise.all([
    safe(
      () =>
        prisma.dueDate.findFirst({
          where: { showFrom: { lte: today }, dueDate: { gte: today } },
          orderBy: { dueDate: 'asc' },
          include: { tariff: { select: { code: true } } },
        }),
      null,
    ),
    safe(
      () => prisma.serviceStatus.findFirst({ where: { status: 'EN_CURSO' }, orderBy: { startsAt: 'desc' } }),
      null,
    ),
  ]);

  return (
    <>
      {due && (
        <div className="strip due" role="status">
          <div className="container">
            <span className="pillmini">Vencimiento {formatDateOnly(due.dueDate, 'short')}</span>
            <span>
              {due.tariff ? <b>Categoría {due.tariff.code}: </b> : null}
              {due.message}
            </span>
            <a href="https://www.cooponlineweb.com.ar/TRANSGAS/Login" target="_blank" rel="noopener">
              Pagar en CoopOnline ↗
            </a>
          </div>
        </div>
      )}
      {active && (
        <div className="strip svc" role="status">
          <div className="container">
            <span className="pillmini">Aviso en curso</span>
            <span>
              <b>{active.title}</b> · {active.zone}
            </span>
            <Link href="/estado-del-servicio">Ver estado del servicio →</Link>
          </div>
        </div>
      )}
    </>
  );
}
