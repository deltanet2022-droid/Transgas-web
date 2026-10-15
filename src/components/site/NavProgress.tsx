'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Barra de carga fina arriba de la pantalla: aparece al tocar un enlace interno y desaparece cuando llega la página nueva. */
export function NavProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => setLoading(false), [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      setLoading(true);
      window.setTimeout(() => setLoading(false), 8000); // por las dudas, nunca queda colgada
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return loading ? (
    <div className="navprog" role="progressbar" aria-label="Cargando página">
      <span />
    </div>
  ) : null;
}
