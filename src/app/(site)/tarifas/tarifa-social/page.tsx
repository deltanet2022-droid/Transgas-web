import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';

export const metadata: Metadata = {
  title: 'Tarifa social',
  description: 'Quiénes pueden acceder a la tarifa social de gas natural, requisitos y cómo tramitarla.',
};

export default function TarifaSocialPage() {
  return (
    <>
      <PageHeader
        kicker="Beneficio"
        title="Tarifa social"
        sub="Un beneficio para los hogares que más lo necesitan. Te contamos quiénes pueden acceder y cómo se tramita."
        crumbs={[{ label: 'Tarifas', href: '/tarifas' }, { label: 'Tarifa social' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="prose">
          {/* TODO(cliente): reemplazar por los requisitos y el procedimiento vigentes publicados por el ente regulador. */}
          <h2>¿Qué es?</h2>
          <p>
            La tarifa social es un régimen de bonificación sobre el consumo de gas natural para usuarios residenciales que cumplen ciertas
            condiciones socioeconómicas. Se aplica directamente en tu factura una vez aprobada la solicitud.
          </p>

          <h2>¿Quiénes pueden acceder?</h2>
          <p>Por lo general, pueden solicitarla hogares que se encuentren en alguna de estas situaciones:</p>
          <ul>
            <li>Titulares de programas sociales o jubilaciones y pensiones por debajo de los topes establecidos.</li>
            <li>Personas con certificado de discapacidad o con necesidades especiales de consumo.</li>
            <li>Hogares inscriptos en los registros de beneficiarios correspondientes.</li>
          </ul>
          <Callout title="Los requisitos pueden cambiar" tone="warn">
            Las condiciones se actualizan según la normativa vigente. Antes de iniciar el trámite, confirmalas con nuestro equipo.
          </Callout>

          <h2>¿Cómo se tramita?</h2>
          <ol className="steps">
            <li>
              <b>Reuní la documentación</b>
              DNI del titular, última factura de gas y la constancia que acredite el beneficio que corresponda.
            </li>
            <li>
              <b>Presentá la solicitud</b>
              Acercate a la oficina de tu cooperativa o a Transgas, o consultá por <Link href="/contacto">contacto</Link>.
            </li>
            <li>
              <b>Esperá la confirmación</b>
              Verificamos los datos y, si se aprueba, el beneficio se aplica en tus próximas facturas.
            </li>
          </ol>
          <p>
            ¿Tenés dudas? Escribinos desde <Link href="/contacto">contacto</Link> o consultá el <Link href="/tarifas/categorias">detalle de categorías</Link>.
          </p>
        </div>
      </PageBody>
    </>
  );
}
