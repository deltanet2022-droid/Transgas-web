import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import { HelpAside, PageBody, PageHeader } from '@/components/site/PageParts';
import { getCooperatives } from '@/lib/queries';
import { splitPhones } from '@/lib/phones';
import { JsonLd } from '@/components/seo/JsonLd';
import { cooperativesList } from '@/lib/schema';

export const metadata: Metadata = staticMeta('/cooperativas');

export default async function CooperativasPage() {
  const coops = await getCooperatives();
  return (
    <>
      {coops.length > 0 && <JsonLd data={cooperativesList(coops)} />}
      <PageHeader
        kicker="Red cooperativa"
        title="Cooperativas asociadas"
        sub="Una red de localidades que trabaja en conjunto. Encontrá la oficina más cercana."
        crumbs={[{ label: 'Cooperativas' }]}
      />
      <PageBody aside={<HelpAside links={[{ label: 'Gasistas matriculados', href: '/profesionales/gasistas-matriculados' }, { label: 'Contacto', href: '/contacto' }, { label: 'Autogestión', href: '/autogestion' }]} title="Atajos" />}>
        {coops.length === 0 ? (
          <div className="empty">Pronto vas a encontrar acá el directorio de cooperativas.</div>
        ) : (
          <div className="stack">
            {coops.map((c) => {
              const phones = splitPhones(c.phone);
              return (
                <article key={c.id} className="card static" style={{ padding: 22 }} id={c.name.toLowerCase().replace(/\s+/g, '-')}>
                  <h3 style={{ fontSize: '1.15rem' }}>{c.name}</h3>
                  {c.legalName && <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: 4 }}>{c.legalName}</p>}
                  <div className="meta" style={{ marginTop: 12 }}>
                    {c.address && (
                      <span>
                        <b>Dirección:</b> {c.address}
                      </span>
                    )}
                    {phones.length > 0 && (
                      <span>
                        <b>Teléfono:</b>{' '}
                        {phones.map((p, i) => (
                          <span key={p.tel}>
                            {i > 0 && ' · '}
                            <a href={`tel:${p.tel}`}>{p.label}</a>
                          </span>
                        ))}
                      </span>
                    )}
                    {c.email && (
                      <span>
                        <b>Correo:</b> <a href={`mailto:${c.email}`}>{c.email}</a>
                      </span>
                    )}
                    {c.schedule && (
                      <span>
                        <b>Horario:</b> {c.schedule}
                      </span>
                    )}
                    {!c.address && !c.phone && !c.email && !c.schedule && <span>Consultá los datos de atención por el teléfono general de Transgas.</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
