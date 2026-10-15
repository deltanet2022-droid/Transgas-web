import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import Link from 'next/link';
import { PageBody, PageHeader } from '@/components/site/PageParts';
import { site } from '@/lib/site';

export const metadata: Metadata = staticMeta('/autogestion');

const ITEMS = [
  { href: '/autogestion/factura-electronica', icon: '✉', title: 'Factura electrónica', text: 'Recibí tu factura por correo y simplificá la gestión.' },
  { href: '/autogestion/informar-pago', icon: '$', title: 'Informar un pago', text: 'Avisanos de un pago realizado para que lo acreditemos.' },
  { href: '/autogestion/informar-medidor', icon: '◴', title: 'Informar estado de medidor', text: 'Comunicá una lectura o una anomalía de tu medidor.' },
  { href: '/autogestion/abm-servicio', icon: '⇄', title: 'Altas, bajas y modificaciones', text: 'Cambios de titularidad, datos y bajas del servicio.' },
  { href: '/autogestion/nuevo-servicio', icon: '＋', title: 'Nuevo servicio', text: 'Pedí la conexión de un nuevo servicio de gas natural.' },
];

export default function AutogestionPage() {
  return (
    <>
      <PageHeader
        kicker="Autogestión"
        title="Las gestiones que más necesitás, a un clic"
        sub="Resolvé tus trámites online, sin filas ni esperas."
        crumbs={[{ label: 'Autogestión' }]}
      />
      <PageBody>
        <div className="hubgrid">
          <a className="card hubcard" href={site.coopOnlineUrl} target="_blank" rel="noopener">
            <span className="ico">▤</span>
            <h3>Ver y pagar facturas</h3>
            <p>Ingresá a CoopOnline para consultar, descargar y pagar tus facturas.</p>
            <span className="go">Entrar a CoopOnline ↗</span>
          </a>
          {ITEMS.map((i) => (
            <Link key={i.href} href={i.href} className="card hubcard">
              <span className="ico">{i.icon}</span>
              <h3>{i.title}</h3>
              <p>{i.text}</p>
              <span className="go">Iniciar gestión →</span>
            </Link>
          ))}
        </div>
      </PageBody>
    </>
  );
}
