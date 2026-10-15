import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbList } from '@/lib/schema';
import { site } from '@/lib/site';
import { getSettings, telDigits } from '@/lib/settings';

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  kicker,
  title,
  sub,
  crumbs,
  topSlot,
}: {
  kicker: string;
  title: string;
  sub?: string;
  crumbs?: Crumb[];
  /** Contenido destacado arriba de todo (por ejemplo, la barra de emergencias). */
  topSlot?: React.ReactNode;
}) {
  return (
    <section className="pagehead">
      <JsonLd data={breadcrumbList(crumbs ?? [])} />
      <div className="container">
        {topSlot && <div style={{ marginBottom: 26 }}>{topSlot}</div>}
        <nav className="crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          {crumbs?.map((c) => (
            <span key={c.label}>
              ›{' '}
              {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
            </span>
          ))}
        </nav>
        <span className="kicker">{kicker}</span>
        <h1>{title}</h1>
        {sub && <p className="sub">{sub}</p>}
      </div>
    </section>
  );
}

/** Cuerpo de página interna: contenido + columna lateral opcional. */
export function PageBody({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="pagebody">
      <div className="container">
        {aside ? (
          <div className="pagegrid">
            <div>{children}</div>
            <aside className="aside">{aside}</aside>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/** Barra de emergencias, bien visible (se usa sobre todo en las páginas de seguridad). */
export async function SosBar({ title = 'Ante una emergencia, llamá al', text, flush }: { title?: string; text?: string; flush?: boolean }) {
  const s = await getSettings();
  return (
    <div className="sos" role="alert" style={flush ? { marginBottom: 0 } : undefined}>
      <div>
        <b>{title}</b>
        <span>{text ?? 'Línea de emergencias de Transgas, las 24 horas. Hacelo desde un lugar seguro y abierto.'}</span>
      </div>
      <a className="big" href={`tel:${telDigits(s.emergencyPhone)}`}>
        {s.emergencyPhone}
      </a>
    </div>
  );
}

export function Callout({
  title,
  children,
  tone = 'info',
  icon,
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'info' | 'warn';
  icon?: string;
}) {
  return (
    <div className={`callout${tone === 'warn' ? ' warn' : ''}`}>
      <span className="ci">{icon ?? (tone === 'warn' ? '!' : 'i')}</span>
      <div>
        <b>{title}</b>
        <p>{children}</p>
      </div>
    </div>
  );
}

/** Columna lateral estándar: ayuda + enlaces relacionados. */
export function HelpAside({ links, title = 'Páginas relacionadas' }: { links: { label: string; href: string }[]; title?: string }) {
  return (
    <>
      <div className="card static">
        <h2>¿Necesitás ayuda?</h2>
        <p>Nuestro equipo te responde de {site.schedule.replace('Lunes a viernes · ', 'lunes a viernes, ')}.</p>
        <Link className="btn primary" href="/contacto">
          Escribinos →
        </Link>
      </div>
      <div className="card static">
        <h2>{title}</h2>
        <div className="sidelinks">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const relatedUsers = [
  { label: 'Entender tu factura', href: '/ayuda/entender-tu-factura' },
  { label: 'Categorías de usuarios', href: '/tarifas/categorias' },
  { label: 'Tarifa social', href: '/tarifas/tarifa-social' },
  { label: 'Zona fría', href: '/tarifas/zona-fria' },
  { label: 'Derechos de usuarios', href: '/usuarios/derechos' },
  { label: 'Inquilinos', href: '/ayuda/inquilinos' },
];

export const relatedSafety = [
  { label: 'Monóxido de carbono', href: '/seguridad/monoxido-de-carbono' },
  { label: 'Uso eficiente del gas', href: '/seguridad/uso-eficiente' },
  { label: 'Prevención de daños', href: '/seguridad/prevencion-de-danos' },
  { label: 'Gasistas matriculados', href: '/profesionales/gasistas-matriculados' },
];
