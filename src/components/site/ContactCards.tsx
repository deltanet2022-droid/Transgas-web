import Link from 'next/link';
import { site } from '@/lib/site';
import { getSettings, telDigits } from '@/lib/settings';
import { AlertIcon, ClockIcon, ListIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/Icons';

/** Cards de contacto y emergencia (mismas que la home de referencia). Se usan en / y /contacto. */
export async function ContactCards() {
  const s = await getSettings();
  return (
    <div className="contactgrid">
      <article className="card contact static">
        <h3>Atención general</h3>
        <p>Datos oficiales de contacto publicados por Transgas.</p>
        <div className="contactlist">
          <div className="contactitem">
            <span className="qico">
              <PinIcon />
            </span>
            <div>
              <b>Dirección</b>
              <span>{site.address}</span>
            </div>
          </div>
          <div className="contactitem">
            <span className="qico">
              <PhoneIcon />
            </span>
            <div>
              <b>Teléfono</b>
              <a href={`tel:${telDigits(s.attentionPhone)}`}>{s.attentionPhone}</a>
            </div>
          </div>
          <div className="contactitem">
            <span className="qico">
              <ClockIcon />
            </span>
            <div>
              <b>Horario de atención</b>
              <span>{site.schedule}</span>
            </div>
          </div>
          <div className="contactitem">
            <span className="qico">
              <MailIcon />
            </span>
            <div>
              <b>Contacto online</b>
              <Link href="/contacto">Escribinos desde el formulario →</Link>
            </div>
          </div>
        </div>
        <div className="mapbox">
          <iframe
            title="Ubicación de Transgas en General Levalle, Córdoba"
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="mapbar">
            <div>
              <strong>Transgas · General Levalle</strong>
              <span>Ruta Nacional Nº 7 km 541</span>
            </div>
            <a className="maplink" href={site.mapsLink} target="_blank" rel="noopener">
              Abrir en Google Maps ↗
            </a>
          </div>
        </div>
      </article>

      <article className="card contact emergency static">
        <h3>Emergencias y suministro</h3>
        <p>Canales prioritarios publicados por Transgas para situaciones que requieren atención.</p>
        <div className="emergency-box">
          <small>EMERGENCIAS</small>
          <a className="emergency-number" href={`tel:${telDigits(s.emergencyPhone)}`}>
            {s.emergencyPhone}
          </a>
          <small style={{ marginTop: 10 }}>También publicado por Transgas para emergencias</small>
        </div>
        <div className="emergency-box">
          <small>FALTA DE SUMINISTRO</small>
          <a className="supply-number" href={`tel:${telDigits(s.supplyPhone)}`}>
            {s.supplyPhone}
          </a>
        </div>
        <div className="contactlist">
          <div className="contactitem">
            <span className="qico alert">
              <AlertIcon />
            </span>
            <div>
              <b>Ante una fuga</b>
              <span>No accionar luces ni aparatos eléctricos, ventilar, cerrar la llave de corte si es seguro y llamar a emergencias.</span>
            </div>
          </div>
          <div className="contactitem">
            <span className="qico">
              <ListIcon />
            </span>
            <div>
              <b>Centros de atención</b>
              <Link href="/cooperativas">Ver directorio de cooperativas →</Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
