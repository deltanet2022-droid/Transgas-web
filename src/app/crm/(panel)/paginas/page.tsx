import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, PageTitle } from '@/components/crm/ui';
import { PAGE_DEFS } from '@/content/pages';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';

export const metadata: Metadata = { title: 'Páginas' };

export default async function PagesCrmPage() {
  const rows = await prisma.page.findMany();
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return (
    <>
      <PageTitle title="Páginas informativas" sub="Editá el texto de tarifa social, zona fría, seguridad, privacidad y más, sin tocar código. Los cambios se ven al instante." />
      <section className="crm-card">
        <div className="tablescroll">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Página</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Última edición</th>
              </tr>
            </thead>
            <tbody>
              {PAGE_DEFS.map((p) => {
                const row = bySlug.get(p.slug);
                return (
                  <tr key={p.slug}>
                    <td>
                      <Link href={`/crm/paginas/${p.slug}`}>{row?.title ?? p.title}</Link>
                    </td>
                    <td>
                      <a href={p.path} target="_blank" rel="noopener">
                        {p.path} ↗
                      </a>
                    </td>
                    <td>{row ? <Badge tone="gest">Editada</Badge> : <Badge>Contenido original</Badge>}</td>
                    <td>{row ? `${formatDateTime(row.updatedAt)}${row.updatedBy ? ` · ${row.updatedBy}` : ''}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
