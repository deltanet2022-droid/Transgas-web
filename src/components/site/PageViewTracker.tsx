'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Cuenta cada página vista (sin cookies, sin IP; ver /api/track y la Política de Privacidad). */
export function PageViewTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (navigator.doNotTrack === '1') return;
    // document.referrer solo es válido en la primera carga; en la navegación interna el origen es el propio sitio.
    const payload = JSON.stringify({ path: pathname, referrer: first.current ? document.referrer : '' });
    first.current = false;
    try {
      if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      else fetch('/api/track', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    } catch {
      /* las estadísticas nunca deben romper el sitio */
    }
  }, [pathname]);

  return null;
}
