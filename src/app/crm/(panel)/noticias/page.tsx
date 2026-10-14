import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';

export const metadata: Metadata = { title: 'Noticias' };

export default async function NewsCrmPage() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <>
      <PageTitle title="Noticias" sub="Artículos del blog." action={{ href: '/crm/noticias/nueva', label: '+ Nueva noticia' }} />
      <section className="crm-card">
        {news.length === 0 ? (
          <Empty>Todavía no hay noticias.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Publicación</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <Link href={`/crm/noticias/${n.id}`}>{n.title}</Link>
                      <div style={{ color: 'var(--muted)', fontSize: '.72rem' }}>/blog/{n.slug}</div>
                    </td>
                    <td>{n.category ?? '—'}</td>
                    <td>
                      {n.status === 'PUBLISHED' ? (
                        n.publishedAt && n.publishedAt > new Date() ? (
                          <Badge tone="prog">Programada</Badge>
                        ) : (
                          <Badge tone="pub">Publicada</Badge>
                        )
                      ) : (
                        <Badge tone="draft">Borrador</Badge>
                      )}
                    </td>
                    <td>{n.publishedAt ? formatDateTime(n.publishedAt) : '—'}</td>
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
