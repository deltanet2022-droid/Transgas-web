import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Entender tu factura',
  description: 'Guía para leer tu factura de gas natural: consumos, períodos, cargos y vencimientos.',
};

export default function EntenderFacturaPage() {
  return (
    <>
      <PageHeader
        kicker="Guía de usuario"
        title="Entender tu factura"
        sub="Una guía simple para leer cada parte de tu factura de gas y saber qué estás pagando."
        crumbs={[{ label: 'Ayuda' }, { label: 'Entender tu factura' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="prose">
          {/* TODO(cliente): reemplazar por una imagen anotada de la factura real y validar los conceptos. */}
          <h2>Las partes de tu factura</h2>
          <ol className="steps">
            <li>
              <b>Datos del usuario</b>
              Nombre del titular, domicilio del servicio, número de cliente y categoría tarifaria.
            </li>
            <li>
              <b>Período y lecturas</b>
              Fechas que abarca la factura y las lecturas del medidor (anterior y actual). La diferencia es tu consumo en m³.
            </li>
            <li>
              <b>Cargo fijo y cargo por consumo</b>
              El cargo fijo se paga aunque no consumas; el cargo por consumo depende de los m³ usados y de tu categoría.
            </li>
            <li>
              <b>Impuestos y tasas</b>
              Conceptos que se suman al servicio según la normativa nacional, provincial y municipal.
            </li>
            <li>
              <b>Fecha de vencimiento y total a pagar</b>
              El importe final y la fecha límite para abonarlo.
            </li>
          </ol>

          <h2>¿Dónde veo y pago mi factura?</h2>
          <p>
            Desde <a href={site.coopOnlineUrl} target="_blank" rel="noopener">CoopOnline</a> podés consultar el detalle, descargar el
            comprobante y pagar. También podés recibirla por correo con la{' '}
            <Link href="/autogestion/factura-electronica">factura electrónica</Link>.
          </p>

          <Callout title="Si el consumo te parece raro" tone="warn">
            Una lectura estimada o un cambio de estación pueden explicar un importe más alto. Podés{' '}
            <Link href="/autogestion/informar-medidor">informar la lectura real de tu medidor</Link> para que se tenga en cuenta.
          </Callout>

          <h2>¿Pagaste y no figura?</h2>
          <p>
            Informá el pago desde <Link href="/autogestion/informar-pago">Informar pago</Link> con la fecha, el monto y el comprobante, y lo
            acreditamos.
          </p>

          <h2>¿Algo no cierra?</h2>
          <p>
            Revisá el <Link href="/tarifas">cuadro tarifario</Link> y tu <Link href="/tarifas/categorias">categoría</Link>. Si la duda
            continúa, escribinos desde <Link href="/contacto">contacto</Link>.
          </p>
        </div>
      </PageBody>
    </>
  );
}
