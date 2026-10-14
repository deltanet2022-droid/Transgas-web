import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';

export const metadata: Metadata = {
  title: 'Información para inquilinos',
  description: 'Qué tienen que saber los inquilinos sobre el servicio de gas natural: titularidad, trámites y seguridad.',
};

export default function InquilinosPage() {
  return (
    <>
      <PageHeader
        kicker="Ayuda"
        title="Información para inquilinos"
        sub="Si alquilás, estos son los puntos clave sobre el servicio de gas, la titularidad y tus responsabilidades."
        crumbs={[{ label: 'Ayuda' }, { label: 'Inquilinos' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="prose">
          {/* TODO(cliente): validar documentación requerida para el cambio de titularidad. */}
          <h2>¿A nombre de quién está el servicio?</h2>
          <p>
            El servicio de gas es del domicilio y queda registrado a nombre de un titular. Cuando cambia el inquilino, conviene actualizar
            la titularidad para que las facturas y los avisos lleguen a quien realmente usa el servicio.
          </p>

          <h2>Cambio de titularidad paso a paso</h2>
          <ol className="steps">
            <li>
              <b>Pedí el cambio</b>
              Completá el formulario de <Link href="/autogestion/abm-servicio">altas, bajas y modificaciones</Link> eligiendo «Cambio de titularidad».
            </li>
            <li>
              <b>Presentá la documentación</b>
              DNI del nuevo titular y documentación que acredite la ocupación del inmueble (por ejemplo, el contrato de alquiler).
            </li>
            <li>
              <b>Verificá las deudas</b>
              Antes de mudarte, confirmá que no queden facturas pendientes del período anterior.
            </li>
          </ol>

          <h2>Seguridad en una vivienda alquilada</h2>
          <p>
            Pedile al propietario que las instalaciones de gas estén revisadas por un{' '}
            <Link href="/profesionales/gasistas-matriculados">gasista matriculado</Link> y que haya ventilación adecuada para los artefactos.
            Leé la guía de <Link href="/seguridad/monoxido-de-carbono">prevención de monóxido de carbono</Link>.
          </p>
          <Callout title="¿Dudas sobre quién paga qué?">
            Eso se define en tu contrato de alquiler. Si necesitás aclarar un dato de la factura, escribinos desde{' '}
            <Link href="/contacto">contacto</Link>.
          </Callout>
        </div>
      </PageBody>
    </>
  );
}
