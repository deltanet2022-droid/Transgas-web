import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';
import { getActiveTariffs } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Categorías de usuarios',
  description: 'Cómo se agrupan los usuarios residenciales y SGP según su consumo anual.',
};

export default async function CategoriasPage() {
  const tariffs = await getActiveTariffs();
  const res = tariffs.filter((t) => t.type === 'RESIDENCIAL');
  const sgp = tariffs.filter((t) => t.type === 'SGP');

  return (
    <>
      <PageHeader
        kicker="Tarifas"
        title="Categorías de usuarios"
        sub="Tu categoría define qué cuadro tarifario se aplica a tu factura y depende de tu consumo anual."
        crumbs={[{ label: 'Tarifas', href: '/tarifas' }, { label: 'Categorías' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="prose">
          {/* TODO(cliente): validar rangos de consumo y definiciones con el cuadro tarifario vigente. */}
          <h2>¿Cómo se asigna una categoría?</h2>
          <p>
            Los usuarios del servicio de gas natural se agrupan en categorías según el tipo de uso (residencial o servicio general) y su
            consumo durante el último año. Cada categoría tiene su propio cargo fijo y precio por consumo, que se detallan en el{' '}
            <Link href="/tarifas">cuadro tarifario vigente</Link>.
          </p>
          <Callout title="¿Cómo sé cuál es la mía?">
            La categoría figura en tu factura. Si tenés dudas o creés que no te corresponde, escribinos desde <Link href="/contacto">contacto</Link>.
          </Callout>

          <h2>Categorías residenciales</h2>
          <p>
            Para hogares. Se subdividen según el consumo anual:{' '}
            <strong>{res.length ? res.map((t) => t.code).join(' · ') : 'R1 · R2 · R3'}</strong>.
          </p>
          <ul>
            <li>
              <strong>R1:</strong> consumos más bajos.
            </li>
            <li>
              <strong>R2 (subcategorías 1 a 3):</strong> consumos medios.
            </li>
            <li>
              <strong>R3 (subcategorías 1 a 4):</strong> consumos más altos.
            </li>
          </ul>

          <h2>Servicio General P (SGP)</h2>
          <p>
            Para comercios, oficinas y pequeñas industrias. Incluye las subcategorías{' '}
            <strong>{sgp.length ? sgp.map((t) => t.code).join(' · ') : 'SGP1 · SGP2 · SGP3-a · SGP3-b'}</strong>, también según el consumo
            anual.
          </p>

          <h2>¿Puede cambiar mi categoría?</h2>
          <p>
            Sí. Como la categoría depende del consumo de los últimos doce meses, puede actualizarse si tu consumo cambia de manera sostenida.
            El cambio se refleja en tus próximas facturas.
          </p>
        </div>
      </PageBody>
    </>
  );
}
