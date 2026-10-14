import type { Metadata } from 'next';
import { HelpAside, PageBody, PageHeader } from '@/components/site/PageParts';
import { getCooperatives } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Cooperativas asociadas',
  description: 'Directorio de cooperativas asociadas a Transgas: dirección, teléfono y horario de atención.',
};

export default async function CooperativasPage() {
  const coops = await getCooperatives();
  return (
    <>
      <PageHeader
        kicker="Red cooperativa"
        title="Cooperativas asociadas"
        sub="Una red de localidades que trabaja en conjunto. Encontrá la oficina más cercana."
        crumbs={[{ label: 'Cooperativas' }]}
      />
      <PageBody aside={<HelpAside links={[{ label: 'Contacto', href: '/contacto' }, { label: 'Autogestión', href: '/autogestion' }]} title="Atajos" />}>
        {coops.length === 0 ? (
          <div className="empty">Pronto vas a encontrar acá el directorio de cooperativas.</div>
        ) : (
          <div className="stack">
            {coops.map((c) => (
              <article key={c.id} className="card static" style={{ padding: 22 }}>
                <h3 style={{ fontSize: '1.15rem' }}>{c.name}</h3>
                {c.legalName && <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 4 }}>{c.legalName}</p>}
                <div className="meta" style={{ marginTop: 12 }}>
                  {c.address && (
                    <span>
                      <b>Dirección:</b> {c.address}
                    </span>
                  )}
                  {c.phone && (
                    <span>
                      <b>Teléfono:</b> <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}>{c.phone}</a>
                    </span>
                  )}
                  {c.schedule && (
                    <span>
                      <b>Horario:</b> {c.schedule}
                    </span>
                  )}
                  {!c.address && !c.phone && !c.schedule && <span>Consultá los datos de atención por el teléfono general de Transgas.</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
