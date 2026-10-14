import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, relatedSafety } from '@/components/site/PageParts';

export const metadata: Metadata = {
  title: 'Uso eficiente del gas natural',
  description: 'Consejos para consumir gas natural de manera eficiente y segura.',
};

export default function UsoEficientePage() {
  return (
    <>
      <PageHeader
        kicker="Seguridad"
        title="Uso eficiente del gas natural"
        sub="Pequeños hábitos que reducen el consumo, cuidan tu bolsillo y el ambiente."
        crumbs={[{ label: 'Seguridad', href: '/seguridad' }, { label: 'Uso eficiente' }]}
      />
      <PageBody aside={<HelpAside links={relatedSafety} title="Más sobre seguridad" />}>
        <div className="prose">
          <h2>En la calefacción</h2>
          <ul>
            <li>Regulá la temperatura: unos grados menos hacen una diferencia grande en el consumo.</li>
            <li>Calefaccioná solo los ambientes que usás y cerrá las puertas de los que no.</li>
            <li>Evitá que se escape el calor: burletes en puertas y ventanas, cortinas gruesas de noche.</li>
            <li>Aprovechá el sol durante el día: abrí cortinas y cerralas al atardecer.</li>
            <li>Apagá o bajá la calefacción cuando salgas o te vayas a dormir.</li>
          </ul>

          <h2>En la cocina y el agua caliente</h2>
          <ul>
            <li>Usá ollas con tapa y del tamaño de la hornalla.</li>
            <li>No abras el horno innecesariamente mientras cocina.</li>
            <li>Regulá la temperatura del termotanque o calefón y arreglá las canillas que gotean.</li>
          </ul>

          <h2>Mantenimiento</h2>
          <p>
            Artefactos limpios y bien regulados consumen menos y son más seguros. Pedí una revisión periódica a un{' '}
            <Link href="/profesionales/gasistas-matriculados">gasista matriculado</Link>.
          </p>
          <Callout title="Eficiencia sin descuidar la seguridad" tone="warn">
            Ahorrar nunca debe significar tapar rejillas de ventilación ni cerrar del todo los ambientes con artefactos encendidos. Leé la guía de{' '}
            <Link href="/seguridad/monoxido-de-carbono">prevención de monóxido de carbono</Link>.
          </Callout>

          <h2>Controlá tu consumo</h2>
          <p>
            Revisá tu factura para ver cuánto consumís en cada período: <Link href="/ayuda/entender-tu-factura">guía para entenderla</Link>.
          </p>
        </div>
      </PageBody>
    </>
  );
}
