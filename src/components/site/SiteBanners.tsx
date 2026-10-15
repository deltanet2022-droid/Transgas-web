import Link from 'next/link';
import { prisma, safe } from '@/lib/db';
import { formatDateOnly, todayAR } from '@/lib/dates';
import { getSettings, isBannerActive } from '@/lib/settings';

/** Franjas superiores: aviso importante (CRM → Configuración), vencimiento vigente hoy y aviso de servicio en curso. */
export async function SiteBanners() {
  const today = todayAR();
  const [settings, due, active] = await Promise.all([
    getSettings(),
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

  const banner = settings.alertBanner;
  const showAlert = isBannerActive(banner, new Date(today));
  const external = /^https?:/i.test(banner.linkUrl);

  return (
    <>
      {showAlert && (
        <div className={`strip alert ${banner.tone === 'info' ? 'alert-info' : 'alert-danger'}`} role="alert">
          <div className="container">
            <span className="pillmini">Aviso importante</span>
            <span>{banner.message}</span>
            {banner.linkUrl && banner.linkLabel && (
              <a href={banner.linkUrl} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
                {banner.linkLabel}
              </a>
            )}
          </div>
        </div>
      )}
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
