/**
 * URLs del sitio viejo (WordPress) → páginas nuevas. Redirección permanente (308) para que
 * los enlaces guardados y el posicionamiento en Google pasen al sitio nuevo.
 * Fuente: sitemap.txt del sitio original.
 */
const LEGACY_REDIRECTS = {
  '/tarifa-social': '/tarifas/tarifa-social',
  '/entender-tu-factura': '/ayuda/entender-tu-factura',
  '/adherir-a-factura-electronica': '/autogestion/factura-electronica',
  '/informar-un-pago': '/autogestion/informar-pago',
  '/informar-estado-de-medidor': '/autogestion/informar-medidor',
  '/uso-eficiente-del-gas-natural': '/seguridad/uso-eficiente',
  '/el-monoxido-de-carbono-mata': '/seguridad/monoxido-de-carbono',
  '/inquilinos': '/ayuda/inquilinos',
  '/ley-regimen-zona-fria': '/tarifas/zona-fria',
  '/plan-prevencion-de-danos': '/seguridad/prevencion-de-danos',
  '/derechos-de-usuarios': '/usuarios/derechos',
  '/gasistas-matriculados': '/profesionales/gasistas-matriculados',
  '/coop-asociadas': '/cooperativas',
  '/categorias-de-usuarios': '/tarifas/categorias',
  '/abm-de-servicio': '/autogestion/abm-servicio',
  '/nuevo-servicio': '/autogestion/nuevo-servicio',
};

// Solo se indexa en Google si ALLOW_INDEXING=true (producción). Por defecto (dominio de prueba,
// desarrollo) el sitio se pide a los buscadores que NO lo indexen.
const allowIndexing = process.env.ALLOW_INDEXING === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Subida de PDF / imágenes desde el CRM mediante Server Actions
    serverActions: { bodySizeLimit: '10mb' },
  },
  async redirects() {
    return Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    const common = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ];
    // Fuentes, fotos y logos casi nunca cambian: el navegador los guarda y no los vuelve a pedir en cada página.
    const longCache = (value) => [{ key: 'Cache-Control', value }];
    return [
      {
        source: '/:path*',
        headers: allowIndexing ? common : [...common, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      { source: '/fonts/:path*', headers: longCache('public, max-age=31536000, immutable') },
      { source: '/images/:path*', headers: longCache('public, max-age=604800, stale-while-revalidate=86400') },
      { source: '/news/:path*', headers: longCache('public, max-age=604800, stale-while-revalidate=86400') },
      { source: '/brand/:path*', headers: longCache('public, max-age=86400, stale-while-revalidate=604800') },
    ];
  },
};

export default nextConfig;
