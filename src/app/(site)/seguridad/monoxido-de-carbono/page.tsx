import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout, HelpAside, PageBody, PageHeader, SosBar, relatedSafety } from '@/components/site/PageParts';

export const metadata: Metadata = {
  title: 'Prevención de monóxido de carbono',
  description: 'El monóxido de carbono no se ve ni se huele. Cómo prevenir una intoxicación y qué hacer si sospechás una.',
};

export default function MonoxidoPage() {
  return (
    <>
      <PageHeader
        kicker="Seguridad"
        title="El monóxido de carbono mata. Se previene."
        sub="No tiene olor, color ni sabor. Conocé cómo prevenir una intoxicación y cómo actuar."
        crumbs={[{ label: 'Seguridad', href: '/seguridad' }, { label: 'Monóxido de carbono' }]}
        topSlot={
          <SosBar
            flush
            title="Ante una emergencia llamá YA al"
            text="Si hay síntomas de intoxicación, salí al aire libre y pedí ayuda médica de inmediato. Luego avisá a Transgas."
          />
        }
      />
      <PageBody aside={<HelpAside links={relatedSafety} title="Más sobre seguridad" />}>
        <div className="prose">
          <h2>¿Qué es y por qué es peligroso?</h2>
          <p>
            El monóxido de carbono (CO) es un gas tóxico que se produce cuando los artefactos a gas, a leña o a carbón no queman bien el
            combustible. No se ve ni se huele, por eso es tan peligroso: puede intoxicar a una persona sin que lo note.
          </p>

          <h2>Síntomas de intoxicación</h2>
          <ul>
            <li>Dolor de cabeza, mareos y somnolencia.</li>
            <li>Náuseas, vómitos y debilidad.</li>
            <li>Confusión, dificultad para respirar o pérdida del conocimiento en casos graves.</li>
          </ul>
          <Callout title="Si varias personas se sienten mal a la vez" tone="warn" icon="!">
            Salí de inmediato al aire libre con quienes estén con vos, llamá a emergencias médicas (911) y avisá a Transgas. No vuelvas a
            entrar hasta que un profesional revise la instalación.
          </Callout>

          <h2>Cómo prevenirlo</h2>
          <ul>
            <li>
              <strong>Ventilá siempre.</strong> Mantené rejillas de ventilación abiertas y no las tapes.
            </li>
            <li>
              <strong>Revisá tus artefactos</strong> con un <Link href="/profesionales/gasistas-matriculados">gasista matriculado</Link>,
              especialmente antes del invierno.
            </li>
            <li>
              <strong>Mirá la llama.</strong> Debe ser azul y estable. Una llama amarilla o anaranjada indica mala combustión.
            </li>
            <li>
              <strong>No uses hornallas ni el horno para calefaccionar</strong> ni braseros dentro de ambientes cerrados.
            </li>
            <li>
              <strong>Evitá los calefones y estufas sin salida al exterior</strong> en baños y dormitorios.
            </li>
            <li>
              <strong>Chimeneas y conductos limpios</strong> y sin obstrucciones.
            </li>
          </ul>

          <h2>Si sospechás que hay monóxido</h2>
          <ol className="steps">
            <li>
              <b>Salí al aire libre</b>
              Abrí puertas y ventanas al salir, si es posible.
            </li>
            <li>
              <b>Pedí ayuda médica</b>
              Aunque los síntomas parezcan leves, hacete atender.
            </li>
            <li>
              <b>Llamá a Transgas</b>
              Desde afuera, al número de emergencias. No vuelvas a usar el artefacto hasta que lo revise un profesional.
            </li>
          </ol>
        </div>
      </PageBody>
    </>
  );
}
