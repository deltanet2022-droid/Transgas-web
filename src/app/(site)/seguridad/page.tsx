import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import Link from 'next/link';
import { PageBody, PageHeader, SosBar } from '@/components/site/PageParts';

export const metadata: Metadata = staticMeta('/seguridad');

const CARDS = [
  {
    href: '/seguridad/monoxido-de-carbono',
    icon: '!',
    title: 'Monóxido de carbono',
    text: 'Cómo prevenir intoxicaciones, qué síntomas reconocer y qué hacer ante una sospecha.',
    danger: true,
  },
  {
    href: '/seguridad/uso-eficiente',
    icon: '◎',
    title: 'Uso eficiente del gas natural',
    text: 'Consejos simples para consumir mejor, cuidar tu factura y el ambiente.',
  },
  {
    href: '/seguridad/prevencion-de-danos',
    icon: '⚒',
    title: 'Prevención de daños',
    text: 'Qué hacer antes de excavar u obrar para no dañar las redes de gas.',
  },
  {
    href: '/profesionales/gasistas-matriculados',
    icon: '✓',
    title: 'Gasistas matriculados',
    text: 'Encontrá profesionales habilitados para instalar y revisar tus artefactos.',
  },
];

export default function SeguridadPage() {
  return (
    <>
      <PageHeader
        kicker="Seguridad primero"
        title="Seguridad en el uso del gas"
        sub="Información para prevenir accidentes y actuar rápido ante una emergencia."
        crumbs={[{ label: 'Seguridad' }]}
      />
      <PageBody>
        <SosBar title="Emergencias 24 horas" text="Si sentís olor a gas o sospechás una fuga, salí del lugar y llamá desde un sitio seguro." />
        <div className="hubgrid">
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} className={`card hubcard${c.danger ? ' danger' : ''}`}>
              <span className="ico">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="go">Ver más →</span>
            </Link>
          ))}
        </div>

        <div className="prose" style={{ marginTop: 44 }}>
          <h2>Ante una fuga de gas</h2>
          <ol className="steps">
            <li>
              <b>No accionés interruptores ni aparatos eléctricos</b>
              Ni luces, ni timbres, ni celulares dentro del ambiente: una chispa puede ser peligrosa.
            </li>
            <li>
              <b>No uses fuego</b>
              Apagá cigarrillos, velas y cualquier llama.
            </li>
            <li>
              <b>Ventilá y cerrá la llave de paso</b>
              Abrí puertas y ventanas y cerrá la llave de corte, solo si podés hacerlo con seguridad.
            </li>
            <li>
              <b>Salí y llamá</b>
              Alejate del lugar y llamá a emergencias desde un sitio abierto.
            </li>
          </ol>
        </div>
      </PageBody>
    </>
  );
}
