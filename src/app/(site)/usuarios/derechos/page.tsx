import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpAside, PageBody, PageHeader, relatedUsers } from '@/components/site/PageParts';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Derechos de usuarios',
  description: 'Derechos de los usuarios del servicio de gas natural y cómo presentar un reclamo.',
};

export default function DerechosPage() {
  return (
    <>
      <PageHeader
        kicker="Usuarios"
        title="Derechos de usuarios"
        sub="Como usuario del servicio de gas natural tenés derechos que conviene conocer."
        crumbs={[{ label: 'Usuarios' }, { label: 'Derechos' }]}
      />
      <PageBody aside={<HelpAside links={relatedUsers} />}>
        <div className="prose">
          {/* TODO(cliente): completar con la normativa y el texto institucional vigente (reglamento de servicio, marco regulatorio). */}
          <h2>Tus derechos</h2>
          <ul>
            <li>Recibir un servicio seguro, continuo y de calidad, en las condiciones previstas por la normativa.</li>
            <li>Recibir información clara, completa y veraz sobre el servicio, las tarifas y la facturación.</li>
            <li>Ser atendido con trato digno y respetuoso en todos los canales de contacto.</li>
            <li>Reclamar ante errores de facturación, interrupciones o cualquier incumplimiento, y obtener una respuesta.</li>
            <li>Ser informado con anticipación de cortes programados por mantenimiento u obras.</li>
            <li>Acceder, si cumplís los requisitos, a beneficios como la <Link href="/tarifas/tarifa-social">tarifa social</Link>.</li>
          </ul>

          <h2>Cómo presentar un reclamo</h2>
          <ol className="steps">
            <li>
              <b>Contactanos</b>
              Escribinos desde <Link href="/contacto">el formulario de contacto</Link> o llamá al <a href={`tel:${site.phoneTel}`}>{site.phone}</a> ({site.schedule}).
            </li>
            <li>
              <b>Detallá tu caso</b>
              Indicá tu número de cliente, el motivo del reclamo y, si podés, adjuntá los datos de la factura o del hecho.
            </li>
            <li>
              <b>Conservá tu número de consulta</b>
              Te lo damos al enviar el formulario; sirve para hacer el seguimiento.
            </li>
          </ol>

          <h2>Reglamento del servicio</h2>
          <p>
            El{' '}
            <a
              href="https://transgas.com.ar/wp-content/uploads/2023/08/reglamento-servicio-distribucion-2021_compressed.pdf"
              target="_blank"
              rel="noopener"
            >
              reglamento de servicio de distribución
            </a>{' '}
            establece las condiciones generales del servicio.
          </p>
        </div>
      </PageBody>
    </>
  );
}
