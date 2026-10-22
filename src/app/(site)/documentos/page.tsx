import type { Metadata } from 'next';
import { HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';
import { DOCUMENTS } from '@/content/documents';
import { staticMeta } from '@/lib/seo';

export const metadata: Metadata = staticMeta('/documentos');

export default function DocumentosPage() {
  return (
    <>
      <PageHeader
        kicker="Descargas"
        title="Documentos y manuales"
        sub="Cuadros tarifarios, reglamento, manual de emergencias e instructivos en PDF."
        crumbs={[{ label: 'Documentos' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="stack">
          {DOCUMENTS.map((g) => (
            <section key={g.title} className="docgroup" aria-labelledby={`dg-${g.title}`}>
              <h2 id={`dg-${g.title}`}>{g.title}</h2>
              <p className="docintro">{g.intro}</p>
              <ul className="doclist">
                {g.items.map((d) => (
                  <li key={d.file}>
                    <a href={d.file} target="_blank" rel="noopener">
                      <span className="docico" aria-hidden>
                        PDF
                      </span>
                      <span className="doctxt">
                        <strong>{d.title}</strong>
                        <small>{d.description}</small>
                      </span>
                      <span className="docsize">{d.size}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </PageBody>
    </>
  );
}
