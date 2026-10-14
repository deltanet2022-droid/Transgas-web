import Link from 'next/link';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footgrid">
        <div>
          <div className="footbrand">Transgas</div>
          <p>{site.legalName} Servicio, infraestructura, información y comunidad.</p>
        </div>
        <div className="foot">
          <h4>Usuarios</h4>
          <Link href="/autogestion">Autogestión</Link>
          <a href={site.coopOnlineUrl} target="_blank" rel="noopener">
            Mi cuenta
          </a>
          <Link href="/tarifas">Tarifas</Link>
          <Link href="/ayuda/entender-tu-factura">Entender tu factura</Link>
          <Link href="/usuarios/derechos">Derechos de usuarios</Link>
        </div>
        <div className="foot">
          <h4>Infraestructura</h4>
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
          <h4>Emergencias</h4>
          <a href={`tel:${site.emergencyPhoneTel}`}>{site.emergencyPhone}</a>
          <a href={`tel:${site.supplyPhoneTel}`}>{site.supplyPhone} (falta de suministro)</a>
          <Link href="/seguridad">Seguridad</Link>
          <Link href="/estado-del-servicio">Estado del servicio</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>
      <div className="container footbottom">
        <span>© {new Date().getFullYear()} Transgas Ltda.</span>
        <span>
          {site.address} · <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
        </span>
      </div>
    </footer>
  );
}
