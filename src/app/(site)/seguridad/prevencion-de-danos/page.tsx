import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, SosBar, relatedSafety } from '@/components/site/PageParts';

export const metadata: Metadata = {
  title: 'Plan de prevención de daños',
  description: 'Cómo proteger las redes e instalaciones de gas natural antes de excavar, perforar u obrar.',
};

export default function PrevencionDanosPage() {
  return (
    <>
      <PageHeader
        kicker="Seguridad"
        title="Plan de prevención de daños"
        sub="Las cañerías de gas están bajo tierra. Antes de excavar, consultá."
        crumbs={[{ label: 'Seguridad', href: '/seguridad' }, { label: 'Prevención de daños' }]}
      />
      <PageBody aside={<HelpAside links={relatedSafety} title="Más sobre seguridad" />}>
        <SosBar title="Si dañaste una cañería de gas, llamá YA al" text="Alejate del lugar, no uses fuego ni equipos eléctricos y avisá desde un lugar seguro." />
        <div className="prose">
          {/* TODO(cliente): completar con el plan oficial, formularios de consulta previa y contactos de la unidad responsable. */}
          <h2>¿Por qué es importante?</h2>
          <p>
            Un golpe con una pala, una retroexcavadora o una perforadora puede dañar una cañería de gas aunque no se note a simple vista. Las
            consecuencias pueden ser fugas, interrupciones del servicio a toda una zona y accidentes graves.
          </p>

          <h2>Antes de excavar u obrar</h2>
          <ol className="steps">
            <li>
              <b>Consultá la ubicación de las redes</b>
              Comunicate con Transgas desde <Link href="/contacto">contacto</Link> indicando el domicilio y el tipo de obra.
            </li>
            <li>
              <b>Respetá las señalizaciones</b>
              Mojones, placas y cintas de advertencia indican la presencia de cañerías.
            </li>
            <li>
              <b>Excavá con cuidado</b>
              Cerca de la red, hacelo a mano y no uses maquinaria pesada.
            </li>
            <li>
              <b>Protegé la instalación</b>
              No dejes cañerías expuestas ni apoyes cargas sobre ellas.
            </li>
          </ol>

          <Callout title="Una obra, un aviso" tone="warn">
            Empresas constructoras, municipios, contratistas y vecinos: avisar antes de excavar evita riesgos y costos.
          </Callout>

          <h2>Si hay un daño</h2>
          <ul>
            <li>No intentes taparlo ni repararlo vos.</li>
            <li>Alejá a las personas, evitá chispas y llamas.</li>
            <li>Llamá de inmediato a emergencias, aunque el daño parezca menor.</li>
          </ul>
        </div>
      </PageBody>
    </>
  );
}
