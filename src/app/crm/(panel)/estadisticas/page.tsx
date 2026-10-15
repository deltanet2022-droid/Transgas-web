import type { Metadata } from 'next';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Estadísticas de visitas' };

const PERIODS = [7, 30, 90] as const;
const DEVICE_LABEL: Record<string, string> = { desktop: 'Computadora', mobile: 'Celular', tablet: 'Tablet' };

export default async function StatsPage({ searchParams }: { searchParams: { d?: string } }) {
  const days = PERIODS.find((p) => String(p) === searchParams.d) ?? 30;
  const since = new Date(Date.now() - days * 86_400_000);

  const [daily, pages, referrers, devices] = await Promise.all([
    // Día en horario de Argentina (UTC-3 fijo)
    prisma.$queryRaw<{ d: Date; views: number; visitors: number }[]>(Prisma.sql`
      SELECT (("createdAt" - interval '3 hours')::date) AS d, count(*)::int AS views, count(DISTINCT "visitorHash")::int AS visitors
      FROM page_views WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 1`),
    prisma.$queryRaw<{ path: string; views: number; visitors: number }[]>(Prisma.sql`
      SELECT path, count(*)::int AS views, count(DISTINCT "visitorHash")::int AS visitors
      FROM page_views WHERE "createdAt" >= ${since} GROUP BY path ORDER BY 2 DESC LIMIT 15`),
    prisma.$queryRaw<{ host: string; views: number }[]>(Prisma.sql`
      SELECT "referrerHost" AS host, count(*)::int AS views
      FROM page_views WHERE "createdAt" >= ${since} AND "referrerHost" IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 10`),
    prisma.$queryRaw<{ device: string; views: number }[]>(Prisma.sql`
      SELECT device, count(*)::int AS views FROM page_views WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 2 DESC`),
  ]);

  const totalViews = daily.reduce((a, r) => a + r.views, 0);
  const totalVisitors = daily.reduce((a, r) => a + r.visitors, 0);
  const maxDay = Math.max(1, ...daily.map((r) => r.views));
  const totalDevices = devices.reduce((a, r) => a + r.views, 0) || 1;
  const fmtDay = (d: Date) => new Date(d).toLocaleDateString('es-AR', { timeZone: 'UTC', day: '2-digit', month: '2-digit' });

  return (
    <>
      <PageTitle title="Estadísticas de visitas" sub="Medición propia, anónima y sin cookies: no se guarda la IP ni se puede seguir a una persona. No cuenta bots ni a quienes activan «No rastrear»." />

      <div className="filters">
        {PERIODS.map((p) => (
          <Link key={p} href={`/crm/estadisticas?d=${p}`} className={`cbtn sm ${p === days ? 'p' : 's'}`}>
            Últimos {p} días
          </Link>
        ))}
      </div>

      <div className="crm-grid c3" style={{ marginBottom: 16 }}>
        <div className="crm-card stat">
          <small>Páginas vistas</small>
          <strong>{totalViews}</strong>
          <span>en {days} días</span>
        </div>
        <div className="crm-card stat">
          <small>Visitantes</small>
          <strong>{totalVisitors}</strong>
          <span>suma de visitantes únicos de cada día</span>
        </div>
        <div className="crm-card stat">
          <small>Promedio diario</small>
          <strong>{Math.round(totalViews / days)}</strong>
          <span>páginas vistas por día</span>
        </div>
      </div>

      <section className="crm-card" style={{ marginBottom: 16 }}>
        <h2>Visitas por día</h2>
        {daily.length === 0 ? (
          <Empty>Todavía no hay datos. Empiezan a juntarse cuando alguien navega el sitio.</Empty>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 150, overflowX: 'auto' }} role="img" aria-label="Gráfico de visitas por día">
            {daily.map((r) => (
              <div key={String(r.d)} title={`${fmtDay(r.d)}: ${r.views} vistas, ${r.visitors} visitantes`} style={{ flex: '1 0 14px', display: 'grid', alignContent: 'end', gap: 4, height: '100%' }}>
                <div style={{ height: `${Math.max(3, (r.views / maxDay) * 120)}px`, borderRadius: '6px 6px 2px 2px', background: 'linear-gradient(180deg, var(--c), var(--b))' }} />
                <small style={{ fontSize: '.58rem', color: 'var(--muted)', textAlign: 'center' }}>{fmtDay(r.d).slice(0, 5)}</small>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="crm-grid c2" style={{ alignItems: 'start' }}>
        <section className="crm-card">
          <h2>Páginas más visitadas</h2>
          {pages.length === 0 ? (
            <Empty>Sin datos.</Empty>
          ) : (
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Página</th>
                  <th>Vistas</th>
                  <th>Visitantes</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.path}>
                    <td>
                      <a href={p.path} target="_blank" rel="noopener">
                        {p.path}
                      </a>
                    </td>
                    <td>{p.views}</td>
                    <td>{p.visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <div className="crm-grid">
          <section className="crm-card">
            <h2>Dispositivos</h2>
            {devices.length === 0 ? (
              <Empty>Sin datos.</Empty>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {devices.map((d) => (
                  <div key={d.device} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.86rem' }}>
                    <span>{DEVICE_LABEL[d.device] ?? d.device}</span>
                    <b>{Math.round((d.views / totalDevices) * 100)}%</b>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="crm-card">
            <h2>De dónde llegan</h2>
            {referrers.length === 0 ? (
              <Empty>Sin datos externos todavía (visitas directas o sin origen informado).</Empty>
            ) : (
              <table className="crm-table">
                <tbody>
                  {referrers.map((r) => (
                    <tr key={r.host}>
                      <td>{r.host}</td>
                      <td style={{ textAlign: 'right' }}>{r.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
