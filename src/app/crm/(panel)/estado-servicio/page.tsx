import type { Metadata } from 'next';
import Link from 'next/link';
import type { ServiceState } from '@prisma/client';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { Badge, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';
import { resolveServiceStatus } from './actions';

export const metadata: Metadata = { title: 'Estado del servicio' };

const FILTERS: { value: '' | ServiceState; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'EN_CURSO', label: 'En curso' },
  { value: 'PROGRAMADO', label: 'Programados' },
  { value: 'RESUELTO', label: 'Resueltos' },
];

export default async function ServiceStatusPage(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams;
  const status = FILTERS.some((f) => f.value === searchParams.status && f.value) ? (searchParams.status as ServiceState) : undefined;
  const items = await prisma.serviceStatus.findMany({ where: status ? { status } : undefined, orderBy: { startsAt: 'desc' } });
  const rank = { EN_CURSO: 0, PROGRAMADO: 1, RESUELTO: 2 } as const;
  items.sort((a, b) => rank[a.status] - rank[b.status] || b.startsAt.getTime() - a.startsAt.getTime());

  return (
    <>
      <PageTitle title="Estado del servicio" sub="Cortes programados y avisos por zona." action={{ href: '/crm/estado-servicio/nuevo', label: '+ Nuevo aviso' }} />
      <section className="crm-card">
        <div className="filters">
          {FILTERS.map((f) => (
            <Link key={f.label} href={f.value ? `/crm/estado-servicio?status=${f.value}` : '/crm/estado-servicio'} className={`cbtn sm ${(status ?? '') === f.value ? 'p' : 's'}`}>
              {f.label}
            </Link>
          ))}
        </div>
        {items.length === 0 ? (
          <Empty>No hay avisos con ese filtro.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Aviso</th>
                  <th>Zona</th>
                  <th>Inicio</th>
                  <th>Fin estimado</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <Link href={`/crm/estado-servicio/${i.id}`}>{i.title}</Link>
                    </td>
                    <td>{i.zone}</td>
                    <td>{formatDateTime(i.startsAt)}</td>
                    <td>{formatDateTime(i.estimatedEndAt)}</td>
                    <td>
                      <Badge tone={i.status === 'EN_CURSO' ? 'warn' : i.status === 'PROGRAMADO' ? 'prog' : 'ok'}>
                        {i.status === 'EN_CURSO' ? 'En curso' : i.status === 'PROGRAMADO' ? 'Programado' : 'Resuelto'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {i.status !== 'RESUELTO' && (
                        <form action={resolveServiceStatus}>
                          <input type="hidden" name="id" value={i.id} />
                          <ConfirmButton className="cbtn s sm" message="¿Marcar este aviso como resuelto?">
                            Marcar resuelto
                          </ConfirmButton>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
