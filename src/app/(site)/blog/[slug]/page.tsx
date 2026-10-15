import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBody, PageHeader } from '@/components/site/PageParts';
import { formatDateLong } from '@/lib/dates';
import { getPublishedNewsBySlug } from '@/lib/queries';
import { sanitizeRichText } from '@/lib/sanitize';
import { fillTokens } from '@/lib/tokens';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await getPublishedNewsBySlug(params.slug);
  if (!n) return { title: 'Noticia no encontrada' };
  return {
    title: n.title,
    description: n.excerpt ?? undefined,
    openGraph: { title: n.title, description: n.excerpt ?? undefined, images: n.coverImageUrl ? [n.coverImageUrl] : undefined },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const n = await getPublishedNewsBySlug(params.slug);
  if (!n) notFound();
  const body = await fillTokens(sanitizeRichText(n.body));

  return (
    <>
      <PageHeader
        kicker={n.category ?? 'Novedades'}
        title={n.title}
        sub={formatDateLong(n.publishedAt)}
        crumbs={[{ label: 'Novedades', href: '/blog' }, { label: n.title }]}
      />
      <PageBody>
        <article className="article">
          {n.coverImageUrl && (
            <div className="cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.coverImageUrl} alt="" />
            </div>
          )}
          {/* El HTML se sanitiza al guardar en el CRM y de nuevo acá (defensa en profundidad). */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
          <p style={{ marginTop: 36 }}>
            <Link className="btn soft" href="/blog">
              ← Volver a novedades
            </Link>
          </p>
        </article>
      </PageBody>
    </>
  );
}
