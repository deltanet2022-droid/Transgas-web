'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Elementos que aparecen con una animación suave al entrar en pantalla. */
const TARGETS = [
  '.section .headline',
  '.photo',
  '.split > div:last-child',
  '.infra-main',
  '.mini',
  '.cards4 > *',
  '.portalgrid > *',
  '.tariffbox',
  '.coop',
  '.coopfoot',
  '.twocol > *',
  '.safety',
  '.contactgrid > *',
  '.newsletter',
  '.hubgrid > *',
  '.listgrid > *',
  '.newsgrid > *',
  '.svcitem',
  '.stack > *',
  '.formcard',
  '.callout',
  '.sos',
  '.prose > h2',
  '.prose > p',
  '.prose > ul',
  '.prose > ol',
  '.prose .steps li',
  '.tablewrap',
  '.aside > *',
  '.footgrid > *',
].join(',');

/**
 * Revelado al hacer scroll sin tocar cada componente: oculta los elementos que todavía no se ven
 * y los muestra (con escalonado entre hermanos) cuando entran en pantalla.
 *
 * - Lo que ya está en pantalla al cargar no se oculta (sin parpadeos).
 * - Usa el evento scroll y no IntersectionObserver, para que el contenido NUNCA quede oculto
 *   aunque el navegador no lo soporte; además hay un "seguro" a los pocos segundos.
 * - Respeta prefers-reduced-motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let pending: HTMLElement[] = [];
    const timers: number[] = [];
    let debounce = 0;
    let poll = 0;

    const show = (el: HTMLElement) => {
      el.classList.add('in');
      const delay = Number.parseInt(el.style.getPropertyValue('--rd') || '0', 10) || 0;
      // Terminada la entrada se limpian las clases, para que el hover de las cards vuelva a funcionar.
      timers.push(
        window.setTimeout(() => {
          el.classList.remove('reveal', 'in', 'rv-left', 'rv-right', 'rv-zoom');
          el.style.removeProperty('--rd');
        }, 900 + delay),
      );
    };

    const check = () => {
      const limit = window.innerHeight * 0.92;
      pending = pending.filter((el) => {
        if (!el.isConnected) return false;
        if (el.getBoundingClientRect().top < limit) {
          show(el);
          return false;
        }
        return true;
      });
    };

    const schedule = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(check, 40);
    };

    const start = window.setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter((el) => !el.closest('.hero, .pagehead, .chatpanel, header'));
      const fold = window.innerHeight * 0.94;
      for (const el of els) {
        if (el.getBoundingClientRect().top < fold) continue; // ya visible al cargar
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const i = Math.max(0, siblings.indexOf(el));
        el.style.setProperty('--rd', `${Math.min(i, 6) * 80}ms`);
        el.classList.add('reveal');
        if (el.matches('.photo')) el.classList.add('rv-left');
        if (el.matches('.split > div:last-child')) el.classList.add('rv-right');
        if (el.matches('.safety, .tariffbox, .newsletter')) el.classList.add('rv-zoom');
        pending.push(el);
      }
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      check();
      // Seguro: revisa cada 700 ms mientras quede algo oculto (por si el navegador no emite eventos de
      // scroll, por ejemplo con la pestaña en segundo plano). Se detiene solo al terminar.
      poll = window.setInterval(() => {
        check();
        if (!pending.length) window.clearInterval(poll);
      }, 700);
    }, 60);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(poll);
      window.clearTimeout(debounce);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      // Al cambiar de página, lo que quedó oculto no debe quedar así
      pending.forEach((el) => el.classList.remove('reveal', 'rv-left', 'rv-right', 'rv-zoom'));
    };
  }, [pathname]);

  return null;
}
