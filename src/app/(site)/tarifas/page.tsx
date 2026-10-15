import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';
import { formatDateOnly } from '@/lib/dates';
import { getActiveTariffs, getCurrentTariffDocument } from '@/lib/queries';
import { annualRange, bimonthlyRange } from '@/lib/tariffRanges';

export const metadata: Metadata = {
  title: 'Tarifas',
  description: 'Cuadro tarifario vigente de Transgas y categorías de usuarios residenciales y SGP.',
};

export default async function TarifasPage() {
  const [doc, tariffs] = await Promise.all([getCurrentTariffDocument(), getActiveTariffs()]);
  const typeLabel = { RESIDENCIAL: 'Residencial', SGP: 'SG-P' } as const;

  return (
    <>
      <PageHeader
        kicker="Transparencia tarifaria"
        title="Cuadro tarifario vigente"
        sub="Publicamos el documento oficial para que nunca veas importes desactualizados."
        crumbs={[{ label: 'Tarifas' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="stack">
          <article className="card static" style={{ padding: 26 }}>
            <span className="kicker">Documento oficial</span>
            {doc ? (
              <>
                <h2 style={{ fontSize: '1.5rem', marginTop: 10 }}>{doc.title}</h2>
                <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: '.88rem' }}>Vigente desde el {formatDateOnly(doc.validFrom)}.</p>
                <div className="actions" style={{ marginTop: 18 }}>
                  <a className="btn primary" href={doc.fileUrl} target="_blank" rel="noopener">
                    Abrir cuadro tarifario (PDF) ↗
                  </a>
                  <Link className="btn soft" href="/tarifas/categorias">
                    ¿En qué categoría estoy?
                  </Link>
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--muted)', marginTop: 10 }}>
                El cuadro tarifario vigente todavía no está publicado. Consultá por teléfono o desde el formulario de{' '}
                <Link href="/contacto" style={{ color: 'var(--b)', fontWeight: 700 }}>
                  contacto
                </Link>
                .
              </p>
            )}
          </article>

          <div>
            <h2 style={{ fontSize: '1.4rem', margin: '10px 0 14px' }}>Categorías tarifarias</h2>
            <div className="tablewrap tarifftable-lg">
              <table>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>Consumo anual</th>
                    <th>Aprox. por bimestre</th>
                  </tr>
                </thead>
                <tbody>
                  {tariffs.length ? (
                    tariffs.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <b>{t.code}</b>
                        </td>
                        <td>{typeLabel[t.type]}</td>
                        <td>
                          {t.name}
                          {t.description && <div style={{ color: 'var(--muted)', fontSize: '.72rem', marginTop: 2 }}>{t.description}</div>}
                        </td>
                        <td>{annualRange(t.code, t.consumptionRange) ?? 'Según cuadro tarifario'}</td>
                        <td>{bimonthlyRange(t.code) ?? '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Las categorías se publican en el cuadro tarifario vigente.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: 12 }}>
              Los importes de cada categoría figuran en el cuadro tarifario (PDF). Para entender cómo se compone tu factura, mirá la{' '}
              <Link href="/ayuda/entender-tu-factura" style={{ color: 'var(--b)', fontWeight: 700 }}>
                guía de lectura de factura
              </Link>
              .
            </p>
          </div>
        </div>
      </PageBody>
    </>
  );
}
