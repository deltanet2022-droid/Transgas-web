import type { Metadata } from 'next';
import { Callout, HelpAside, PageBody, PageHeader, relatedSafety } from '@/components/site/PageParts';
import { getActiveInstallers } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Gasistas matriculados',
  description: 'Listado de gasistas matriculados con matrícula, localidad y datos de contacto.',
};

export default async function GasistasPage() {
  const installers = await getActiveInstallers();
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
          <div className="listgrid" style={{ marginTop: 20 }}>
            {installers.map((g) => (
              <article key={g.id} className="card person static">
                <h3>{g.name}</h3>
                <span className="lic">Matrícula {g.license}</span>
                <p>
                  <b>{g.locality}</b>
                  {g.phone && (
                    <>
                      <br />
                      <a href={`tel:${g.phone.replace(/[^\d+]/g, '')}`}>{g.phone}</a>
                    </>
                  )}
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
        )}
      </PageBody>
    </>
  );
}
