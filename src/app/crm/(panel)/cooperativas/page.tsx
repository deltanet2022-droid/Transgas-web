import type { Metadata } from 'next';
import Link from 'next/link';
import { Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Cooperativas asociadas' };

export default async function CooperativesCrmPage() {
  const coops = await prisma.cooperative.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  return (
    <>
      <PageTitle title="Cooperativas asociadas" sub="Directorio público de /cooperativas." action={{ href: '/crm/cooperativas/nueva', label: '+ Nueva cooperativa' }} />
      <section className="crm-card">
        {coops.length === 0 ? (
          <Empty>Todavía no hay cooperativas.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Horario</th>
                </tr>
              </thead>
              <tbody>
                {coops.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/crm/cooperativas/${c.id}`}>{c.name}</Link>
                      {c.legalName && <div style={{ color: 'var(--muted)', fontSize: '.72rem' }}>{c.legalName}</div>}
                    </td>
                    <td>{c.address ?? <span style={{ color: 'var(--muted)' }}>Sin cargar</span>}</td>
                    <td>{c.phone ?? <span style={{ color: 'var(--muted)' }}>Sin cargar</span>}</td>
                    <td>{c.email ?? <span style={{ color: 'var(--muted)' }}>Sin cargar</span>}</td>
                    <td>{c.schedule ?? <span style={{ color: 'var(--muted)' }}>Sin cargar</span>}</td>
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
