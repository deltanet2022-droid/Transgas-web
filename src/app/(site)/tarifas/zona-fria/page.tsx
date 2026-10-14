import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';

export const metadata: Metadata = {
  title: 'Régimen de zona fría',
  description: 'Información sobre el régimen de zona fría y cómo puede alcanzar a los usuarios de Transgas.',
};

export default function ZonaFriaPage() {
  return (
    <>
      <PageHeader
        kicker="Normativa"
        title="Régimen de zona fría"
        sub="Información sobre el régimen que alcanza a distintas localidades del país por sus condiciones climáticas."
        crumbs={[{ label: 'Tarifas', href: '/tarifas' }, { label: 'Zona fría' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="prose">
          {/* TODO(cliente): completar con la normativa vigente, localidades alcanzadas y trámite de adhesión. */}
          <h2>¿De qué se trata?</h2>
          <p>
            El régimen de zona fría establece condiciones especiales para el consumo de gas natural en localidades con temperaturas bajas
            durante gran parte del año. Su objetivo es que el costo de la calefacción no pese de manera desigual entre regiones.
          </p>

          <h2>¿Me alcanza?</h2>
          <p>
            Depende de la localidad donde esté el servicio y de la normativa vigente en cada momento. En tu factura vas a ver reflejado el
            beneficio si corresponde a tu domicilio.
          </p>
          <Callout title="Consultá antes de dar nada por hecho">
            La normativa puede modificarse. Para saber si tu domicilio está alcanzado, escribinos desde <Link href="/contacto">contacto</Link> o
            llamá al teléfono de atención.
          </Callout>

          <h2>Recursos útiles</h2>
          <ul>
            <li>
              <Link href="/ayuda/entender-tu-factura">Cómo leer tu factura</Link> y encontrar los conceptos asociados.
            </li>
            <li>
              <Link href="/tarifas">Cuadro tarifario vigente</Link>.
            </li>
            <li>
              <Link href="/usuarios/derechos">Tus derechos como usuario</Link>.
            </li>
          </ul>
        </div>
      </PageBody>
    </>
  );
}
