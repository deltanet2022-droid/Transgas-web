'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/crm/login/actions';

const ITEMS = [
  { href: '/crm', label: 'Inicio', icon: '⌂', exact: true },
  { sep: 'Contenido' },
  { href: '/crm/tarifas', label: 'Tarifas', icon: '$' },
  { href: '/crm/noticias', label: 'Noticias', icon: '✎' },
  { href: '/crm/vencimientos', label: 'Vencimientos', icon: '◷' },
  { href: '/crm/estado-servicio', label: 'Estado del servicio', icon: '⚠' },
  { sep: 'Atención' },
  { href: '/crm/contactos', label: 'Contactos', icon: '✉' },
  { href: '/crm/faq', label: 'Preguntas frecuentes', icon: '?' },
  { href: '/crm/chatbot', label: 'Historial del chatbot', icon: '☰' },
  { sep: 'Directorios' },
  { href: '/crm/cooperativas', label: 'Cooperativas', icon: '⌘' },
  { href: '/crm/gasistas', label: 'Gasistas matriculados', icon: '✓' },
  { sep: 'Administración', adminOnly: true },
  { href: '/crm/usuarios', label: 'Usuarios del CRM', icon: '☺', adminOnly: true },
] as const;

type Item = (typeof ITEMS)[number];

export function Sidebar({ user }: { user: { email: string; name: string | null; role: 'ADMIN' | 'EDITOR' } }) {
  const pathname = usePathname();
  const isAdmin = user.role === 'ADMIN';
  const visible = ITEMS.filter((i: Item) => !('adminOnly' in i && i.adminOnly) || isAdmin);

  return (
    <aside className="crm-side">
      <Link className="brandrow" href="/crm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-transgas.png" alt="Transgas" width={119} height={34} />
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
          <Link href="/" target="_blank" style={{ color: '#9fb8ca', fontSize: '.74rem' }}>
            Ver sitio ↗
          </Link>
        </div>
        <form action={signOut}>
          <button type="submit">Cerrar sesión</button>
        </form>
      </div>
    </aside>
  );
}
