import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';
import { LEAD_TYPES, LEAD_TYPE_LABEL, type LeadTypeKey } from '@/lib/leads/config';
import { LEAD_STATUSES, LEAD_STATUS_LABEL, leadWhere } from '@/lib/crm/leads';

export const metadata: Metadata = { title: 'Contactos' };

const PAGE_SIZE = 25;

export default async function LeadsPage({ searchParams }: { searchParams: { type?: string; status?: string; q?: string; page?: string } }) {
  const where = leadWhere(searchParams);
  const page = Math.max(1, Number.parseInt(searchParams.page ?? '1', 10) || 1);

  const [total, leads, counts] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.lead.groupBy({ by: ['status'], _count: true }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const count = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  const qs = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { type: searchParams.type, status: searchParams.status, q: searchParams.q, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `?${s}` : '';
  };
  const exportQs = qs({ page: undefined });

  return (
    <>
      <PageTitle
        title="Contactos"
        sub="Todos los formularios del sitio en una sola bandeja."
        action={
          <a className="cbtn s" href={`/crm/contactos/export${exportQs}`}>
            ⬇ Exportar CSV{exportQs ? ' (filtrado)' : ''}
          </a>
        }
      />

      <div className="crm-grid c3" style={{ marginBottom: 16 }}>
        {LEAD_STATUSES.map((s) => (
          <Link key={s} href={`/crm/contactos${qs({ status: s, page: undefined })}`} className="crm-card stat" style={{ textDecoration: 'none', padding: 16 }}>
            <small>{LEAD_STATUS_LABEL[s]}</small>
            <strong style={{ fontSize: '1.6rem' }}>{count(s)}</strong>
          </Link>
        ))}
      </div>

      <section className="crm-card">
        <form className="filters" method="get">
          <div className="fg">
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" defaultValue={searchParams.type ?? ''}>
              <option value="">Todos</option>
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {LEAD_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label htmlFor="status">Estado</label>
            <select id="status" name="status" defaultValue={searchParams.status ?? ''}>
              <option value="">Todos</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label htmlFor="q">Buscar</label>
            <input id="q" name="q" defaultValue={searchParams.q ?? ''} placeholder="Nombre, email, teléfono…" />
          </div>
          <button className="cbtn s sm" type="submit">
            Filtrar
          </button>
          {(searchParams.type || searchParams.status || searchParams.q) && (
            <Link className="cbtn s sm" href="/crm/contactos">
              Limpiar
            </Link>
          )}
          <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '.8rem' }}>{total} resultados</span>
        </form>

        {leads.length === 0 ? (
          <Empty>No hay contactos con esos filtros.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(l.createdAt)}</td>
                    <td>{LEAD_TYPE_LABEL[l.type as LeadTypeKey]}</td>
                    <td>
                      <Link href={`/crm/contactos/${l.id}`}>{l.name}</Link>
                    </td>
                    <td style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{[l.email, l.phone].filter(Boolean).join(' · ') || '—'}</td>
                    <td>
                      <Badge tone={l.status === 'NUEVO' ? 'nuevo' : l.status === 'EN_GESTION' ? 'gest' : 'ok'}>{LEAD_STATUS_LABEL[l.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, alignItems: 'center' }}>
            {page > 1 && (
              <Link className="cbtn s sm" href={`/crm/contactos${qs({ page: String(page - 1) })}`}>
                ← Anterior
              </Link>
            )}
            <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
              Página {page} de {pages}
            </span>
            {page < pages && (
              <Link className="cbtn s sm" href={`/crm/contactos${qs({ page: String(page + 1) })}`}>
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
