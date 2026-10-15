import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageBody, PageHeader, SosBar } from '@/components/site/PageParts';
import { PUBLIC_FAQ } from '@/content/faq-public';
import { getCooperatives } from '@/lib/queries';
import { faqPage } from '@/lib/schema';
import { staticMeta } from '@/lib/seo';
import { fillTokens } from '@/lib/tokens';

export const metadata: Metadata = staticMeta('/preguntas-frecuentes');

/** "A, B y C" */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export default async function FaqPage() {
  const coops = await getCooperatives();
  const localidades = joinList(['General Levalle', ...coops.map((c) => c.name)]);

  const groups = await Promise.all(
    PUBLIC_FAQ.map(async (g) => ({
      title: g.title,
      items: await Promise.all(g.items.map(async (i) => ({ ...i, a: await fillTokens(i.a.replace('{{localidades}}', localidades)) }))),
    })),
  );

  return (
    <>
      <JsonLd data={faqPage(groups.flatMap((g) => g.items.map((i) => ({ q: i.q, a: i.a }))))} />
      <PageHeader
        kicker="Ayuda"
        title="Preguntas frecuentes"
        sub="Respuestas rápidas sobre tu factura, tus trámites, la seguridad y la atención de Transgas."
        crumbs={[{ label: 'Preguntas frecuentes' }]}
      />
      <PageBody>
        <SosBar />
        <div className="faqpage">
          {groups.map((g) => (
            <section key={g.title} aria-labelledby={`g-${g.title}`}>
              <h2 id={`g-${g.title}`}>{g.title}</h2>
              {g.items.map((i) => (
                <article className="faqitem" key={i.q}>
                  <h3>{i.q}</h3>
                  <p>{i.a}</p>
                  {i.links && (
                    <p className="faqlinks">
                      {i.links.map((l) =>
                        l.href.startsWith('http') ? (
                          <a key={l.href} href={l.href} target="_blank" rel="noopener">
                            {l.label} ↗
                          </a>
                        ) : (
                          <Link key={l.href} href={l.href}>
                            {l.label} →
                          </Link>
                        ),
                      )}
                    </p>
                  )}
                </article>
              ))}
            </section>
          ))}
        </div>
        <p style={{ marginTop: 28, color: 'var(--muted)', fontSize: '.88rem' }}>
          ¿No encontraste lo que buscabas? Escribinos desde{' '}
          <Link href="/contacto" style={{ color: 'var(--b)', fontWeight: 700 }}>
            contacto
          </Link>{' '}
          o consultale a Lu, nuestra asistente virtual, desde el botón de la esquina.
        </p>
      </PageBody>
    </>
  );
}
