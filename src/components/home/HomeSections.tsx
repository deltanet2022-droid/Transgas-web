import Link from 'next/link';
import type { Cooperative, Tariff, TariffDocument } from '@prisma/client';
import { site } from '@/lib/site';
import { Photo } from '@/components/ui/Photo';
import { annualRange, bimonthlyRange } from '@/lib/tariffRanges';
import { ContactCards } from '@/components/site/ContactCards';

export function Headline({
  kicker,
  title,
  children,
  center,
}: {
  kicker: string;
  title: string;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`headline${center ? ' center' : ''}`}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export function About() {
  return (
    <section className="section" id="nosotros">
      <div className="container split">
        <div className="photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Photo base="/images/about" smallWidth={560} largeWidth={1000} height={667} alt="Obra en construcción con personal trabajando sobre una estructura" sizes="(max-width: 980px) 92vw, 520px" />
          <div className="float">
            <b>Servicio + infraestructura</b>
            <p>Una identidad institucional que une la atención al usuario con el desarrollo de redes y el trabajo técnico.</p>
          </div>
        </div>
        <div>
          <span className="kicker">Quiénes somos</span>
          <h2>Una cooperativa que piensa más allá del suministro.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            Transgas comunica suministro de gas natural para hogares, comercios y empresas, junto con desarrollo de redes de distribución y
            una red de cooperativas asociadas.
          </p>
          <ul className="features">
            <li>
              <span className="tick">✓</span>
              <span>
                <b>Atención cercana</b>
                <span>Gestiones digitales, información y canales de contacto.</span>
              </span>
            </li>
            <li>
              <span className="tick">✓</span>
              <span>
                <b>Infraestructura para crecer</b>
                <span>Desarrollo de redes y distribución eficiente.</span>
              </span>
            </li>
            <li>
              <span className="tick">✓</span>
              <span>
                <b>Seguridad como prioridad</b>
                <span>Gasistas matriculados, prevención y emergencias.</span>
              </span>
            </li>
          </ul>
          <Link className="btn navy" href="/cooperativas">
            Ver cooperativas asociadas →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Infrastructure() {
  return (
    <section className="section infrastructure" id="infraestructura">
      <div className="container">
        <Headline kicker="Infraestructura & obras" title="Redes que preparan a las comunidades para crecer.">
          El desarrollo de redes y la distribución eficiente son uno de los servicios centrales de Transgas. Esa capacidad es una unidad de
          negocio visible, con proyectos, obras y trabajo conjunto con cooperativas y comunidades.
        </Headline>
        <div className="infra">
          <article className="infra-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Photo base="/images/infra" smallWidth={560} largeWidth={1000} height={667} alt="Operario con casco y máscara de protección durante una tarea industrial" sizes="(max-width: 980px) 92vw, 560px" />
            <div className="infra-copy">
              <h3>Diseño y desarrollo de redes de distribución</h3>
              <p>
                Espacio institucional para comunicar proyectos, obras, infraestructura, seguridad y articulación con cooperativas y
                comunidades.
              </p>
              <Link className="btn white" href="/contacto">
                Hablar con Transgas →
              </Link>
            </div>
          </article>
          <div className="infra-side">
            <article className="mini">
              <em>01</em>
              <h4>Planificación</h4>
              <p>Alcance, necesidades y objetivos de cada proyecto.</p>
              <Link href="/contacto">Consultar →</Link>
            </article>
            <article className="mini">
              <em>02</em>
              <h4>Ingeniería y red</h4>
              <p>Presentación técnica de la solución de distribución.</p>
              <Link href="/profesionales/gasistas-matriculados">Profesionales →</Link>
            </article>
            <article className="mini">
              <em>03</em>
              <h4>Seguridad</h4>
              <p>Prevención, control y buenas prácticas.</p>
              <Link href="/seguridad">Conocer →</Link>
            </article>
            <article className="mini">
              <em>04</em>
              <h4>Comunidad</h4>
              <p>Trabajo articulado con cooperativas y localidades.</p>
              <Link href="/cooperativas">Ver red →</Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Autogestion() {
  return (
    <section className="section" id="autogestion">
      <div className="container">
        <Headline center kicker="Autogestión" title="Las gestiones que más necesitás, a un clic.">
          Accesos principales para gestionar el servicio, las facturas, la factura electrónica y el estado del medidor.
        </Headline>
        <div className="cards4">
          <article className="card service">
            <span className="ico">＋</span>
            <h3>Gestionar servicio de gas</h3>
            <p>Acceso para iniciar altas, bajas y consultas relacionadas con el servicio.</p>
            <Link href="/autogestion">Ir a Autogestión →</Link>
          </article>
          <article className="card service">
            <span className="ico">▤</span>
            <h3>Ver y pagar facturas</h3>
            <p>Consultá consumo, comprobantes y gestiones online.</p>
            <a href={site.coopOnlineUrl} target="_blank" rel="noopener">
              Entrar a CoopOnline ↗
            </a>
          </article>
          <article className="card service">
            <span className="ico">✉</span>
            <h3>Factura electrónica</h3>
            <p>Recibí tu factura por correo y simplificá la gestión.</p>
            <Link href="/autogestion/factura-electronica">Adherirme →</Link>
          </article>
          <article className="card service">
            <span className="ico">◴</span>
            <h3>Informar estado de medidor</h3>
            <p>Canal para comunicar una lectura o anomalía.</p>
            <Link href="/autogestion/informar-medidor">Informar →</Link>
          </article>
        </div>
      </div>
    </section>
  );
}

const INFO_CARDS = [
  { tag: 'Usuarios', title: 'Entender tu factura', text: 'Guía para comprender consumos, períodos y conceptos.', cta: 'Abrir guía →', href: '/ayuda/entender-tu-factura' },
  { tag: 'Tarifa', title: 'Categorías de usuarios', text: 'Categorías residenciales y SGP según consumo.', cta: 'Ver categorías →', href: '/tarifas/categorias' },
  { tag: 'Beneficio', title: 'Tarifa Social', text: 'Quiénes pueden acceder, requisitos y trámite.', cta: 'Consultar →', href: '/tarifas/tarifa-social' },
  { tag: 'Derechos', title: 'Derechos de usuarios', text: 'Información institucional y normativa.', cta: 'Ver información →', href: '/usuarios/derechos' },
  { tag: 'Prevención', title: 'Plan de prevención de daños', text: 'Información para proteger la infraestructura.', cta: 'Consultar →', href: '/seguridad/prevencion-de-danos' },
  { tag: 'Zona fría', title: 'Régimen de zona fría', text: 'Información sobre el régimen y cómo te alcanza.', cta: 'Leer más →', href: '/tarifas/zona-fria' },
];

export function InfoPortal() {
  return (
    <section className="section infosec" id="portal">
      <div className="container">
        <Headline kicker="Centro de información" title="Un portal para entender, decidir y actuar.">
          Además de gestionar, el usuario necesita comprender tarifas, categorías, derechos, beneficios y seguridad.
        </Headline>
        <div className="portalgrid">
          {INFO_CARDS.map((c) => (
            <article key={c.title} className="card portalcard">
              <span className="tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <Link href={c.href}>{c.cta}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TariffSection({ tariffs, doc }: { tariffs: Tariff[]; doc: TariffDocument | null }) {
  return (
    <section className="section tariff" id="tarifas">
      <div className="container">
        <div className="tariffbox">
          <div>
            <span className="kicker">Transparencia tarifaria</span>
            <h2>Tarifas y categorías, sin letra chica.</h2>
            <p>Se prioriza el documento oficial vigente en lugar de mostrar importes que puedan quedar desactualizados.</p>
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 18 }}>
              {doc ? (
                <a className="btn primary" href={doc.fileUrl} target="_blank" rel="noopener">
                  Abrir cuadro tarifario ↗
                </a>
              ) : (
                <Link className="btn primary" href="/tarifas">
                  Ver tarifas →
                </Link>
              )}
              <Link className="btn soft" href="/tarifas/categorias">
                Ver categorías →
              </Link>
            </div>
          </div>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Consumo anual</th>
                  <th>Aprox. por bimestre</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.length ? (
                  tariffs.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <b>{t.code}</b>
                        <div style={{ color: 'var(--muted)', fontSize: '.75rem' }}>{t.type === 'SGP' ? 'Servicio general P' : 'Residencial'}</div>
                      </td>
                      <td>{annualRange(t.code, t.consumptionRange) ?? 'Según cuadro tarifario'}</td>
                      <td>{bimonthlyRange(t.code) ?? '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Las categorías se publican en el cuadro tarifario vigente.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <p style={{ color: 'var(--muted)', fontSize: '.75rem', margin: '10px 4px 2px' }}>
              Tu categoría se define según el consumo acumulado de los últimos seis bimestres. Valores en m³.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Coops({ coops }: { coops: Cooperative[] }) {
  return (
    <section className="section coops" id="cooperativas">
      <div className="container">
        <div className="headline">
          <span className="kicker" style={{ color: 'var(--c)' }}>
            Red cooperativa
          </span>
          <h2>Una red de localidades que trabaja en conjunto.</h2>
          <p className="lead">Las cooperativas asociadas publican su dirección, teléfonos y horarios de atención en el directorio.</p>
        </div>
        <div className="coopgrid">
          {coops.map((c) => (
            <div className="coop" key={c.id}>
              <b>{c.name}</b>
              {c.legalName && <span>{c.legalName}</span>}
            </div>
          ))}
        </div>
        <div className="coopfoot">
          <small>Directorio con datos específicos de cada localidad.</small>
          <Link className="btn white" href="/cooperativas">
            Directorio completo →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProfessionalsDocs() {
  return (
    <section className="section">
      <div className="container">
        <div className="twocol">
          <article className="card simple">
            <span className="kicker">Profesionales</span>
            <h3>Gasistas matriculados</h3>
            <p>Listado publicado por Transgas con matrícula, localidad y datos de contacto.</p>
            <Link href="/profesionales/gasistas-matriculados">Consultar listado →</Link>
          </article>
          <article className="card simple">
            <span className="kicker">Documentación</span>
            <h3>Contratistas y reglamentación</h3>
            <p>Accesos institucionales para contratistas, reglamento y documentación de servicio.</p>
            <a
              href="https://transgas.com.ar/wp-content/uploads/2023/08/reglamento-servicio-distribucion-2021_compressed.pdf"
              target="_blank"
              rel="noopener"
            >
              Ver reglamento ↗
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

export function SafetySection() {
  return (
    <section className="section" id="seguridad">
      <div className="container">
        <div className="safety">
          <div className="safetycopy">
            <span className="kicker" style={{ color: 'var(--c)' }}>
              Seguridad primero
            </span>
            <h2>El monóxido de carbono se previene con información.</h2>
            <p>Transgas dedica un espacio específico a la prevención de accidentes y al manejo responsable del gas.</p>
            <ul className="safetylist">
              <li>
                <b>✓</b>
                <span>No accionar llaves de luz ni aparatos eléctricos ante una sospecha de fuga.</span>
              </li>
              <li>
                <b>✓</b>
                <span>Revisar artefactos y conexiones con profesionales habilitados.</span>
              </li>
              <li>
                <b>✓</b>
                <span>Ante una emergencia, utilizar el canal oficial correspondiente.</span>
              </li>
            </ul>
            <Link className="btn white" href="/seguridad/monoxido-de-carbono">
              Ver guía completa →
            </Link>
          </div>
          <div className="safetyimg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Photo base="/images/safety" smallWidth={560} largeWidth={1000} height={667} alt="Llama azul de una hornalla de cocina a gas natural" sizes="(max-width: 980px) 92vw, 560px" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="section" id="contacto">
      <div className="container">
        <Headline kicker="Contacto" title="Todo lo importante, visible y a un toque de distancia.">
          La dirección, los teléfonos y los canales de emergencia quedan separados visualmente para que nadie tenga que buscar la
          información cuando más la necesita.
        </Headline>
        <ContactCards />
        <div className="newsletter">
          <div>
            <h3>Actualidad Transgas</h3>
            <p>Novedades, obras y comunicaciones institucionales. Y recordatorios de vencimiento por mail.</p>
          </div>
          <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn white" href="/blog">
              Ver novedades →
            </Link>
            <Link className="btn outline" href="/avisos">
              Avisos de vencimiento
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
