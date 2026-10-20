import Link from 'next/link';
import { site } from '@/lib/site';
import { getSettings, telDigits } from '@/lib/settings';

export async function Footer() {
  const s = await getSettings();
  return (
    <footer className="site-footer">
      <div className="container footgrid">
        <div>
          <span className="footlogo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-transgas-white.png" alt="Grupo Transgas" width={175} height={50} loading="lazy" decoding="async" />
          </span>
          <p>{site.legalName} Servicio, infraestructura, información y comunidad.</p>
          <div className="footreg">
            <span>Organismo regulador y de control</span>
            <a
              href="https://www.enargas.gob.ar/"
              target="_blank"
              rel="noopener"
              aria-label="Ente Nacional Regulador del Gas y la Electricidad (ENReGE): ir al sitio del ente"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/enrege-negativo.png"
                alt="ENReGE, Ente Nacional Regulador del Gas y la Electricidad"
                width={250}
                height={93}
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>
        <div className="foot">
          <h2>Usuarios</h2>
          <Link href="/autogestion">Autogestión</Link>
          <a href={site.coopOnlineUrl} target="_blank" rel="noopener">
            Mi cuenta
          </a>
          <Link href="/tarifas">Tarifas</Link>
          <Link href="/ayuda/entender-tu-factura">Entender tu factura</Link>
          <Link href="/usuarios/derechos">Derechos de usuarios</Link>
          <Link href="/avisos">Avisos de vencimiento</Link>
          <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
          <Link href="/privacidad">Política de privacidad</Link>
        </div>
        <div className="foot">
          <h2>Infraestructura</h2>
          <Link href="/#infraestructura">Obras y redes</Link>
          <Link href="/profesionales/gasistas-matriculados">Gasistas</Link>
          <Link href="/cooperativas">Cooperativas</Link>
          <Link href="/blog">Novedades</Link>
          <a
            href="https://transgas.com.ar/wp-content/uploads/2023/08/reglamento-servicio-distribucion-2021_compressed.pdf"
            target="_blank"
            rel="noopener"
          >
            Reglamento
          </a>
        </div>
        <div className="foot">
          <h2>Emergencias</h2>
          <a href={`tel:${telDigits(s.emergencyPhone)}`}>{s.emergencyPhone}</a>
          <a href={`tel:${telDigits(s.supplyPhone)}`}>{s.supplyPhone} (falta de suministro)</a>
          <Link href="/seguridad">Seguridad</Link>
          <Link href="/estado-del-servicio">Estado del servicio</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>
      <div className="container footbottom">
        <span>© {new Date().getFullYear()} Transgas Ltda.</span>
        <span>
          Sitio desarrollado por{' '}
          <a href="https://delta.net.ar" target="_blank" rel="noopener">
            DELTA - Sistemas y Automatizaciones
          </a>
        </span>
      </div>
    </footer>
  );
}
