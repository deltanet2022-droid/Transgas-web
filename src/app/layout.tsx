import type { Metadata, Viewport } from 'next';
import './globals.css';
import './motion.css';
import { site } from '@/lib/site';

const indexable = process.env.ALLOW_INDEXING === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Transgas | Gas natural, infraestructura y redes', template: '%s | Transgas' },
  description:
    'Portal institucional de Transgas: gas natural, autogestión, infraestructura y redes, seguridad, tarifas, cooperativas asociadas e información para usuarios.',
  applicationName: 'Transgas',
  openGraph: { siteName: 'Transgas', locale: 'es_AR', type: 'website', title: 'Transgas | Gas natural, infraestructura y redes' },
  twitter: { card: 'summary_large_image' },
  // Sin ALLOW_INDEXING=true (dominio de prueba) se pide a Google que no indexe el sitio.
  ...(indexable ? {} : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = { themeColor: '#0B2A4E' };

// Datos estructurados: ayudan a Google a mostrar el nombre, el logo y los datos de contacto de la organización.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: 'Transgas',
      legalName: site.legalName,
      url: site.url,
      logo: { '@type': 'ImageObject', url: `${site.url}/brand/logo-transgas.png`, width: 350, height: 100 },
      image: `${site.url}/opengraph-image.png`,
      telephone: '+543385480021',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Ruta Nacional Nº 7 km 541',
        addressLocality: 'General Levalle',
        addressRegion: 'Córdoba',
        addressCountry: 'AR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lng },
      contactPoint: [
        { '@type': 'ContactPoint', contactType: 'customer service', telephone: '+543385480021', areaServed: 'AR', availableLanguage: 'es' },
        { '@type': 'ContactPoint', contactType: 'emergency', telephone: '+54-800-777-8427', areaServed: 'AR', availableLanguage: 'es' },
      ],
    },
    { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: 'Transgas', inLanguage: 'es-AR', publisher: { '@id': `${site.url}/#organization` } },
  ],
};

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
        {indexable && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />}
      </head>
      <body>{children}</body>
    </html>
  );
}
