import type { Metadata, Viewport } from 'next';
import './globals.css';
import './motion.css';
import { GEO } from '@/lib/seo';
import { site } from '@/lib/site';

const indexable = process.env.ALLOW_INDEXING === 'true';

const DEFAULT_TITLE = 'Transgas | Gas natural en el sur de Córdoba';
const DEFAULT_DESCRIPTION =
  'Transgas distribuye gas natural en el sur de Córdoba desde General Levalle. Pagá tu factura, consultá tarifas y categorías, seguridad y emergencias las 24 horas.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: DEFAULT_TITLE, template: '%s | Transgas' },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'Transgas',
  keywords: [
    'Transgas',
    'gas natural',
    'gas natural Córdoba',
    'General Levalle',
    'distribuidora de gas',
    'cooperativas de gas',
    'factura de gas',
    'tarifas de gas',
    'emergencias de gas',
    'gasistas matriculados',
  ],
  authors: [{ name: 'Transgas', url: site.url }],
  creator: 'DELTA - Sistemas y Automatizaciones',
  publisher: 'Transgas',
  category: 'utilities',
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: { siteName: 'Transgas', locale: 'es_AR', type: 'website', title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  twitter: { card: 'summary_large_image', title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  // SEO local: ubicación del negocio para buscadores y mapas.
  other: {
    'geo.region': GEO.region,
    'geo.placename': GEO.place,
    'geo.position': `${site.lat};${site.lng}`,
    ICBM: `${site.lat}, ${site.lng}`,
  },
  // Sin ALLOW_INDEXING=true (dominio de prueba) se pide a Google que no indexe el sitio.
  ...(indexable ? { robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const, 'max-snippet': -1 } } } : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = { themeColor: '#0B2A4E', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
