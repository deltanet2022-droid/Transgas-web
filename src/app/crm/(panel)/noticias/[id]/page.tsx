import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { NewsForm } from '@/components/crm/NewsForm';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { deleteNews } from '../actions';

export const metadata: Metadata = { title: 'Editar noticia' };

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const news = await prisma.news.findUnique({ where: { id: params.id } });
  if (!news) notFound();
  return (
    <>
      <BackLink href="/crm/noticias">Noticias</BackLink>
      <PageTitle
        title="Editar noticia"
        action={
          <span style={{ display: 'inline-flex', gap: 8 }}>
            {news.status === 'PUBLISHED' && (
              <Link className="cbtn s" href={`/blog/${news.slug}`} target="_blank">
                Ver en el sitio ↗
              </Link>
            )}
            <form action={deleteNews}>
              <input type="hidden" name="id" value={news.id} />
              <ConfirmButton message="¿Eliminar esta noticia? No se puede deshacer." className="cbtn d">
                Eliminar
              </ConfirmButton>
            </form>
          </span>
        }
      />
      <div className="crm-card" style={{ maxWidth: 900 }}>
        <NewsForm news={news} />
      </div>
    </>
  );
}
