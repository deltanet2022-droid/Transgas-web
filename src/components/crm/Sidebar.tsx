'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '@/app/crm/login/actions';

const ITEMS = [
  { href: '/crm', label: 'Inicio', icon: '⌂', exact: true },
  { sep: 'Contenido' },
  { href: '/crm/tarifas', label: 'Tarifas', icon: '$' },
  { href: '/crm/noticias', label: 'Noticias', icon: '✎' },
  { href: '/crm/paginas', label: 'Páginas', icon: '❏' },
  { href: '/crm/vencimientos', label: 'Vencimientos', icon: '◷' },
  { href: '/crm/estado-servicio', label: 'Estado del servicio', icon: '⚠' },
  { sep: 'Atención' },
  { href: '/crm/contactos', label: 'Contactos', icon: '✉' },
  { href: '/crm/suscriptores', label: 'Suscriptores de avisos', icon: '✆' },
  { href: '/crm/faq', label: 'Preguntas frecuentes', icon: '?' },
  { href: '/crm/chatbot', label: 'Chatbot', icon: '☰' },
  { href: '/crm/estadisticas', label: 'Estadísticas de visitas', icon: '▥' },
  { sep: 'Directorios' },
  { href: '/crm/cooperativas', label: 'Cooperativas', icon: '⌘' },
  { href: '/crm/gasistas', label: 'Gasistas matriculados', icon: '✓' },
  { sep: 'Administración', adminOnly: true },
  { href: '/crm/configuracion', label: 'Configuración', icon: '⚙', adminOnly: true },
  { href: '/crm/usuarios', label: 'Usuarios del CRM', icon: '☺', adminOnly: true },
] as const;

type Item = (typeof ITEMS)[number];

export function Sidebar({ user }: { user: { email: string; name: string | null; role: 'ADMIN' | 'EDITOR' } }) {
  const pathname = usePathname();
  const isAdmin = user.role === 'ADMIN';
  const visible = ITEMS.filter((i: Item) => !('adminOnly' in i && i.adminOnly) || isAdmin);
  const [open, setOpen] = useState(false);

  // En el celular el menú es un panel que se abre con el botón: al elegir una sección se cierra solo.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
    <header className="crm-topbar">
      <Link className="brandrow" href="/crm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-transgas-white.png" alt="Transgas" width={104} height={30} />
        <span>CRM</span>
      </Link>
      <button type="button" className="crm-menubtn" aria-expanded={open} aria-controls="crm-side" onClick={() => setOpen((o) => !o)}>
        {open ? 'Cerrar ✕' : 'Menú ☰'}
      </button>
    </header>
    {open && <div className="crm-scrim" onClick={() => setOpen(false)} aria-hidden />}
    <aside className={`crm-side${open ? ' open' : ''}`} id="crm-side">
      <Link className="brandrow" href="/crm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-transgas-white.png" alt="Transgas" width={119} height={34} />
        <span>CRM</span>
      </Link>
      <nav aria-label="CRM">
        {visible.map((i, idx) =>
          'sep' in i ? (
            <div className="sep" key={`s${idx}`}>
              {i.sep}
            </div>
          ) : (
            <Link
              key={i.href}
              href={i.href}
              className={('exact' in i && i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`)) ? 'on' : ''}
            >
              <span aria-hidden style={{ width: 18, textAlign: 'center' }}>
                {i.icon}
              </span>
              {i.label}
            </Link>
          ),
        )}
      </nav>
      <div className="who">
        <b>{user.name || user.email}</b>
        {user.role === 'ADMIN' ? 'Administrador' : 'Editor'}
        <div>
          <Link href="/crm/cuenta" style={{ color: '#9fb8ca', fontSize: '.74rem' }}>
            Mi cuenta
          </Link>
          {' · '}
          <Link href="/" target="_blank" style={{ color: '#9fb8ca', fontSize: '.74rem' }}>
            Ver sitio ↗
          </Link>
        </div>
        <form action={signOut}>
          <button type="submit">Cerrar sesión</button>
        </form>
      </div>
    </aside>
    </>
  );
}
