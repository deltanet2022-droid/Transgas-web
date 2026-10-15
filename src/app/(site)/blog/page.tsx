import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import Link from 'next/link';
import { PageBody, PageHeader } from '@/components/site/PageParts';
import { formatDateLong } from '@/lib/dates';
import { getPublishedNews } from '@/lib/queries';

export const metadata: Metadata = staticMeta('/blog');

export default async function BlogPage() {
  const news = await getPublishedNews();
  return (
    <>
      <PageHeader kicker="Actualidad" title="Novedades de Transgas" sub="Noticias, obras y comunicaciones institucionales." crumbs={[{ label: 'Novedades' }]} />
      <PageBody>
        {news.length === 0 ? (
          <div className="empty">Todavía no hay noticias publicadas.</div>
        ) : (
          <div className="newsgrid">
            {news.map((n) => (
              <Link key={n.id} href={`/blog/${n.slug}`} className="card newscard">
                <div className="cover">
                  {n.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.coverImageUrl} alt="" width={1000} height={667} loading="lazy" decoding="async" />
                  ) : (
                    <span>Transgas</span>
                  )}
                </div>
                <div className="nb">
                  {n.category && <span className="cat">{n.category}</span>}
                  <h3>{n.title}</h3>
                  {n.excerpt && <p>{n.excerpt}</p>}
                  <time dateTime={n.publishedAt?.toISOString()}>{formatDateLong(n.publishedAt)}</time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
