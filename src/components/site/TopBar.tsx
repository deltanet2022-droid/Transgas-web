import Link from 'next/link';
import { getSettings, telDigits } from '@/lib/settings';

/** Franja superior. El teléfono de emergencias se edita desde CRM → Configuración. */
export async function TopBar() {
  const s = await getSettings();
  return (
    <div className="top">
      <div className="container topin">
        <div>
          <Link href="/estado-del-servicio">Estado del servicio</Link> · <Link href="/cooperativas">Cooperativas asociadas</Link> ·{' '}
          <Link href="/#infraestructura">Obras y redes</Link>
        </div>
        <a className="em" href={`tel:${telDigits(s.emergencyPhone)}`}>
          Emergencias · {s.emergencyPhone}
        </a>
      </div>
    </div>
  );
}
