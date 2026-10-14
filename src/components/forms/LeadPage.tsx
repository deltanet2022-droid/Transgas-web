import Link from 'next/link';
import { LEAD_FORMS, type LeadTypeKey } from '@/lib/leads/config';
import { LeadForm } from './LeadForm';
import { PageBody, PageHeader } from '@/components/site/PageParts';

const LINKS = [
  { label: 'Factura electrónica', href: '/autogestion/factura-electronica' },
  { label: 'Informar un pago', href: '/autogestion/informar-pago' },
  { label: 'Informar estado de medidor', href: '/autogestion/informar-medidor' },
  { label: 'Altas, bajas y modificaciones', href: '/autogestion/abm-servicio' },
  { label: 'Nuevo servicio', href: '/autogestion/nuevo-servicio' },
];

/** Página de autogestión: encabezado + formulario del tipo indicado (el tipo lo fija la página). */
export function LeadPage({ type }: { type: LeadTypeKey }) {
  const config = LEAD_FORMS[type];
  return (
    <>
      <PageHeader
        kicker={config.kicker}
        title={config.title}
        sub={config.intro}
        crumbs={[{ label: 'Autogestión', href: '/autogestion' }, { label: config.title }]}
      />
      <PageBody
        aside={
          <div className="card static">
            <h3>Otras gestiones</h3>
            <div className="sidelinks">
              {LINKS.filter((l) => l.href !== config.path).map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        }
      >
        <LeadForm config={config} />
      </PageBody>
    </>
  );
}
