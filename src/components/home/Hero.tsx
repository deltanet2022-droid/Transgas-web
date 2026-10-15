import Link from 'next/link';
import { site, images } from '@/lib/site';
import { getSettings, telDigits } from '@/lib/settings';
import { BuildingIcon, ChartIcon, ReceiptIcon, ShieldIcon } from '@/components/ui/Icons';

export async function Hero({ serviceAlert }: { serviceAlert: boolean }) {
  const s = await getSettings();
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.hero} alt="" aria-hidden width={1600} height={1067} fetchPriority="high" decoding="async" />
      </div>
      <div className="container hero-grid">
        <div>
          <span className="kicker">Energía · infraestructura · comunidad</span>
          <h1>
            Gas natural que conecta <span>territorios y personas.</span>
          </h1>
          <p>
            Transgas integra servicio, infraestructura y desarrollo de redes para acompañar a hogares, empresas, cooperativas y comunidades
            del sur de Córdoba.
          </p>
          <div className="actions">
            <Link className="btn primary" href="/autogestion">
              Gestionar mi servicio →
            </Link>
            <Link className="btn outline" href="/#infraestructura">
              Conocer obras y redes
            </Link>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Accesos rápidos del portal">
          <div className="paneltop">
            <b>¿Qué necesitás resolver?</b>
            <Link className={`status${serviceAlert ? ' warn' : ''}`} href="/estado-del-servicio">
              <i />
              {serviceAlert ? 'Aviso en curso' : 'Servicio sin avisos'}
            </Link>
          </div>
          <div className="paths">
            <a className="path featured" href={site.coopOnlineUrl} target="_blank" rel="noopener">
              <span className="ico">
                <ReceiptIcon />
              </span>
              <span>
                <strong>Mi cuenta y facturas</strong>
                <span>Ingresá a CoopOnline para consultar, descargar y gestionar tu servicio.</span>
              </span>
              <span className="path-arrow" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
            </a>
            <Link className="path" href="/#infraestructura">
              <span className="ico">
                <BuildingIcon />
              </span>
              <strong>Obras y redes</strong>
              <span>Infraestructura y desarrollo territorial</span>
            </Link>
            <Link className="path" href="/tarifas">
              <span className="ico">
                <ChartIcon />
              </span>
              <strong>Tarifas</strong>
              <span>Cuadro tarifario y categorías</span>
            </Link>
            <Link className="path" href="/seguridad">
              <span className="ico">
                <ShieldIcon />
              </span>
              <strong>Seguridad</strong>
              <span>Prevención y emergencias</span>
            </Link>
          </div>
          <div className="panelfoot">
            <small>{site.addressShort}</small>
            <a className="panic" href={`tel:${telDigits(s.emergencyPhone)}`}>
              Emergencias 24/7
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

export async function QuickBar() {
  const s = await getSettings();
  return (
    <div className="container quick">
      <div className="quickgrid">
        <a href={site.coopOnlineUrl} target="_blank" rel="noopener">
          <span className="qico">↗</span>
          <span>
            <strong>Ver y pagar factura</strong>
            <small>CoopOnline</small>
          </span>
        </a>
        <Link href="/autogestion">
          <span className="qico">＋</span>
          <span>
            <strong>Gestionar servicio</strong>
            <small>Altas y bajas</small>
          </span>
        </Link>
        <Link href="/ayuda/entender-tu-factura">
          <span className="qico">▤</span>
          <span>
            <strong>Entender tu factura</strong>
            <small>Guía de usuario</small>
          </span>
        </Link>
        <a href={`tel:${telDigits(s.supplyPhone)}`}>
          <span className="qico">↯</span>
          <span>
            <strong>Falta suministro</strong>
            <small>{s.supplyPhone}</small>
          </span>
        </a>
        <a href={`tel:${telDigits(s.emergencyPhone)}`}>
          <span className="qico">!</span>
          <span>
            <strong>Emergencias</strong>
            <small>{s.emergencyPhone}</small>
          </span>
        </a>
      </div>
    </div>
  );
}
