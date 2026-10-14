import Link from 'next/link';
import { site } from '@/lib/site';

/** Franja superior. Emergencias queda fijo en el código (no editable desde el CRM en la Fase 1). */
export function TopBar() {
  return (
    <div className="top">
      <div className="container topin">
        <div>
          <Link href="/estado-del-servicio">Estado del servicio</Link> · <Link href="/cooperativas">Cooperativas asociadas</Link> ·{' '}
          <Link href="/#infraestructura">Obras y redes</Link>
        </div>
        <a className="em" href={`tel:${site.emergencyPhoneTel}`}>
          Emergencias · {site.emergencyPhone}
        </a>
      </div>
    </div>
  );
}
