import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Transgas | Gas natural, infraestructura y redes', template: '%s | Transgas' },
  description:
    'Portal institucional de Transgas: gas natural, autogestión, infraestructura y redes, seguridad, tarifas, cooperativas asociadas e información para usuarios.',
  openGraph: { siteName: 'Transgas', locale: 'es_AR', type: 'website' },
  // Sin ALLOW_INDEXING=true (dominio de prueba) se pide a Google que no indexe el sitio.
  ...(process.env.ALLOW_INDEXING === 'true' ? {} : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = { themeColor: '#0B2A4E' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
