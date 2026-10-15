'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

interface NavLeaf {
  label: string;
  href: string;
}
interface NavItem {
  label: string;
  href?: string;
  /** Prefijos de ruta que marcan el ítem como activo. */
  match?: string[];
  children?: NavLeaf[];
}

const NAV: NavItem[] = [
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Obras y redes', href: '/#infraestructura' },
  { label: 'Autogestión', href: '/autogestion', match: ['/autogestion'] },
  { label: 'Tarifas', href: '/tarifas', match: ['/tarifas'] },
  { label: 'Seguridad', href: '/seguridad', match: ['/seguridad'] },
  {
    label: 'Información',
    match: ['/ayuda', '/usuarios', '/profesionales', '/blog', '/estado-del-servicio'],
    children: [
      { label: 'Entender tu factura', href: '/ayuda/entender-tu-factura' },
      { label: 'Inquilinos', href: '/ayuda/inquilinos' },
      { label: 'Derechos de usuarios', href: '/usuarios/derechos' },
      { label: 'Gasistas matriculados', href: '/profesionales/gasistas-matriculados' },
      { label: 'Estado del servicio', href: '/estado-del-servicio' },
      { label: 'Novedades', href: '/blog' },
    ],
  },
  { label: 'Cooperativas', href: '/cooperativas', match: ['/cooperativas'] },
  { label: 'Contacto', href: '/contacto', match: ['/contacto'] },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (item: NavItem) => !!item.match?.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container head">
        <Link className="brand" href="/" aria-label="Transgas inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo" src="/brand/logo-transgas.png" alt="Grupo Transgas" width={161} height={46} />
          <span className="brandtxt">
            <small>{site.legalName}</small>
          </span>
        </Link>
        <button className="menub" aria-expanded={open} aria-controls="nav" aria-label="Menú" onClick={() => setOpen((o) => !o)}>
          {open ? '✕' : '☰'}
        </button>
        <nav className={`nav${open ? ' open' : ''}`} id="nav" aria-label="Principal">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className={`navdrop${isActive(item) ? ' active' : ''}`}>
                <button type="button" aria-haspopup="true">
                  {item.label} ▾
                </button>
                <div className="navmenu">
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className={pathname === c.href ? 'active' : ''} aria-current={pathname === c.href ? 'page' : undefined}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href!} className={isActive(item) ? 'active' : ''} aria-current={isActive(item) ? 'page' : undefined}>
                {item.label}
              </Link>
            ),
          )}
          <a className="navcta" href={site.coopOnlineUrl} target="_blank" rel="noopener">
            Mi cuenta ↗
          </a>
        </nav>
        <div className="headcta">
          <a className="btn navy" href={site.coopOnlineUrl} target="_blank" rel="noopener">
            Mi cuenta ↗
          </a>
        </div>
      </div>
    </header>
  );
}
