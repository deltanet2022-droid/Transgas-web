import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import { Callout, HelpAside, PageBody, PageHeader, relatedSafety } from '@/components/site/PageParts';
import { getActiveInstallers } from '@/lib/queries';
import { splitPhones } from '@/lib/phones';

export const metadata: Metadata = staticMeta('/profesionales/gasistas-matriculados');

export default async function GasistasPage() {
  const installers = await getActiveInstallers();

  // Agrupados por localidad, en orden alfabético.
  const byLocality = new Map<string, typeof installers>();
  for (const i of installers) byLocality.set(i.locality, [...(byLocality.get(i.locality) ?? []), i]);
  const localities = [...byLocality.keys()].sort((a, b) => a.localeCompare(b, 'es'));

  return (
    <>
      <PageHeader
        kicker="Profesionales"
        title="Gasistas matriculados"
        sub="Instalaciones y revisiones siempre con profesionales habilitados."
        crumbs={[{ label: 'Profesionales' }, { label: 'Gasistas matriculados' }]}
      />
      <PageBody aside={<HelpAside links={relatedSafety} title="Más sobre seguridad" />}>
        <Callout title="Elegí siempre un profesional matriculado">
          Una instalación mal hecha pone en riesgo a tu familia. Pedí que te muestren la matrícula antes de contratar.
        </Callout>
        {installers.length === 0 ? (
          <div className="empty" style={{ marginTop: 20 }}>
            El listado de gasistas se está actualizando. Consultanos por el teléfono de atención.
          </div>
        ) : (
          localities.map((loc) => (
            <section key={loc} style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>{loc}</h2>
              <div className="listgrid">
                {byLocality.get(loc)!.map((g) => (
                  <article key={g.id} className="card person static">
                    <h3>{g.name}</h3>
                    <span className="lic">Matrícula {g.license}</span>
                    <p>
                      {g.address && <>{g.address}<br /></>}
                      {splitPhones(g.phone).map((p, i) => (
                        <span key={p.tel}>
                          {i > 0 && ' · '}
                          <a href={`tel:${p.tel}`}>{p.label}</a>
                        </span>
                      ))}
                      {g.email && (
                        <>
                          <br />
                          <a href={`mailto:${g.email}`}>{g.email}</a>
                        </>
                      )}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </PageBody>
    </>
  );
}
