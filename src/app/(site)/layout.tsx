import { SiteShell } from '@/components/site/SiteShell';

// El sitio lee tarifas, avisos, vencimientos y noticias de la base: se renderiza en cada
// request (así los cambios del CRM se ven al instante y el build no necesita la base).
export const dynamic = 'force-dynamic';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
