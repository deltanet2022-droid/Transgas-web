import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Gasistas matriculados' };

export default async function InstallersCrmPage() {
  const items = await prisma.licensedInstaller.findMany({ orderBy: [{ locality: 'asc' }, { name: 'asc' }] });
  return (
    <>
      <PageTitle title="Gasistas matriculados" sub="Listado público de /profesionales/gasistas-matriculados." action={{ href: '/crm/gasistas/nueva', label: '+ Agregar gasista' }} />
      <section className="crm-card">
        {items.length === 0 ? (
          <Empty>Todavía no hay gasistas cargados.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Matrícula</th>
                  <th>Domicilio</th>
                  <th>Localidad</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <Link href={`/crm/gasistas/${g.id}`}>{g.name}</Link>
                    </td>
                    <td>{g.license}</td>
                    <td>{g.address ?? '—'}</td>
                    <td>{g.locality}</td>
                    <td>{[g.phone, g.email].filter(Boolean).join(' · ') || '—'}</td>
                    <td>{g.active ? <Badge tone="ok">Visible</Badge> : <Badge>Oculto</Badge>}</td>
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
