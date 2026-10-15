import type { Metadata } from 'next';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { Badge, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';
import { deleteSubscriber } from './actions';

export const metadata: Metadata = { title: 'Suscriptores' };

export default async function SubscribersPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? '').trim();
  const [subs, active, pending, gone] = await Promise.all([
    prisma.subscriber.findMany({
      where: q ? { OR: [{ email: { contains: q, mode: 'insensitive' } }, { clientNumber: { contains: q } }] } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 500,
    }),
    prisma.subscriber.count({ where: { confirmedAt: { not: null }, unsubscribedAt: null } }),
    prisma.subscriber.count({ where: { confirmedAt: null, unsubscribedAt: null } }),
    prisma.subscriber.count({ where: { unsubscribedAt: { not: null } } }),
  ]);

  return (
    <>
      <PageTitle
        title="Suscriptores de avisos"
        sub="Personas que pidieron recibir recordatorios de vencimiento por mail. Solo reciben avisos quienes confirmaron su correo."
        action={
          <a className="cbtn s" href="/crm/suscriptores/export">
            ⬇ Exportar CSV
          </a>
        }
      />
      <div className="crm-grid c3" style={{ marginBottom: 16 }}>
        <div className="crm-card stat">
          <small>Activos (reciben avisos)</small>
          <strong>{active}</strong>
        </div>
        <div className="crm-card stat">
          <small>Pendientes de confirmar</small>
          <strong>{pending}</strong>
        </div>
        <div className="crm-card stat">
          <small>Dados de baja</small>
          <strong>{gone}</strong>
        </div>
      </div>
      <section className="crm-card">
        <form className="filters" method="get">
          <div className="fg">
            <label htmlFor="q">Buscar</label>
            <input id="q" name="q" defaultValue={q} placeholder="Correo o nº de cliente" />
          </div>
          <button className="cbtn s sm" type="submit">
            Buscar
          </button>
        </form>
        {subs.length === 0 ? (
          <Empty>No hay suscriptores.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Nº cliente</th>
                  <th>Estado</th>
                  <th>Consentimiento</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td>{s.email}</td>
                    <td>{s.clientNumber ?? '—'}</td>
                    <td>{s.unsubscribedAt ? <Badge tone="red">Baja</Badge> : s.confirmedAt ? <Badge tone="ok">Activo</Badge> : <Badge tone="warn">Sin confirmar</Badge>}</td>
                    <td style={{ fontSize: '.76rem', color: 'var(--muted)' }}>
                      {formatDateTime(s.consentAt)} · política v{s.consentVersion}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <form action={deleteSubscriber}>
                        <input type="hidden" name="id" value={s.id} />
                        <ConfirmButton message={`¿Eliminar definitivamente a ${s.email}? Es el «derecho de supresión» y no se puede deshacer.`}>Eliminar</ConfirmButton>
                      </form>
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
