import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBody, PageHeader } from '@/components/site/PageParts';
import { formatDateLong } from '@/lib/dates';
import { getPublishedNewsBySlug } from '@/lib/queries';
import { sanitizeRichText } from '@/lib/sanitize';
import { fillTokens } from '@/lib/tokens';
import { JsonLd } from '@/components/seo/JsonLd';
import { newsArticle } from '@/lib/schema';
import { pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const n = await getPublishedNewsBySlug(params.slug);
  if (!n) return { title: 'Noticia no encontrada', robots: { index: false, follow: false } };
  return pageMeta({
    title: n.title,
    description: n.excerpt || `${n.title}. Novedades de Transgas para usuarios y cooperativas del sur de Córdoba.`,
    path: `/blog/${n.slug}`,
    image: n.coverImageUrl ?? undefined,
    type: 'article',
    publishedTime: n.publishedAt?.toISOString(),
    modifiedTime: n.updatedAt?.toISOString(),
  });
}

export default async function NewsDetailPage(props: Props) {
  const params = await props.params;
  const n = await getPublishedNewsBySlug(params.slug);
  if (!n) notFound();
  const body = await fillTokens(sanitizeRichText(n.body));

  return (
    <>
      <JsonLd data={newsArticle(n)} />
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
              <img src={n.coverImageUrl} alt={n.title} width={1000} height={667} fetchPriority="high" decoding="async" />
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
