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

/**
 * Archivos que estaban en el WordPress viejo (wp-content/uploads) y ahora viven en /public/docs.
 * Si alguien (o Google) todavía tiene el enlace viejo, sigue funcionando.
 */
const LEGACY_FILES = {
  '/wp-content/uploads/2023/08/reglamento-servicio-distribucion-2021_compressed.pdf': '/docs/reglamento-servicio-distribucion-2021.pdf',
  '/wp-content/uploads/2023/08/Manual_de_Emergencias_Res_I-2796_Transgas.pdf': '/docs/manual-de-emergencias-res-i-2796.pdf',
  '/wp-content/uploads/2023/08/Instructivo_CoopOnline-comprimido.pdf': '/docs/instructivo-cooponline.pdf',
  '/wp-content/uploads/2023/08/pago-gas-transgas-convertido.pdf': '/docs/instructivo-adhesion-y-pago-de-facturas.pdf',
  '/wp-content/uploads/2026/01/Cuadro-Tarifario-Transgas-Enero-2026.pdf': '/docs/cuadro-tarifario-transgas-enero-2026.pdf',
  '/wp-content/uploads/2025/08/Cuadro-Tarifario-Transgas-01-08-2025.pdf': '/docs/cuadro-tarifario-transgas-agosto-2025.pdf',
  '/wp-content/uploads/2025/06/Cuadro-Tarifario-Res-364.pdf': '/docs/cuadro-tarifario-res-364-junio-2025.pdf',
  '/wp-content/uploads/2025/05/Cuadro-Tarifario-Res-260-25.pdf': '/docs/cuadro-tarifario-res-260-25-mayo-2025.pdf',
  // Mapas del sitio que generaba WordPress: Google los pide por costumbre; ahora el mapa es /sitemap.xml
  '/wp-sitemap.xml': '/sitemap.xml',
  '/sitemap_index.xml': '/sitemap.xml',
  '/page-sitemap.xml': '/sitemap.xml',
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
    // Compilación liviana para hostings compartidos (Hostinger): un solo proceso y sin hilos extra.
    // Con varios procesos en paralelo el servidor podía abortar la compilación (SIGABRT) por límite de recursos.
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
  },
  // Más tiempo por página al generar el sitio (el servidor compartido puede ser lento).
  staticPageGenerationTimeout: 180,
  async redirects() {
    const legacy = Object.entries({ ...LEGACY_REDIRECTS, ...LEGACY_FILES }).map(([source, destination]) => ({ source, destination, permanent: true }));
    return [
      // www.transgas.com.ar → transgas.com.ar (una sola dirección para Google; evita contenido duplicado)
      { source: '/:path*', has: [{ type: 'host', value: 'www.transgas.com.ar' }], destination: 'https://transgas.com.ar/:path*', permanent: true },
      ...legacy,
    ];
  },
  async headers() {
    const common = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()' },
      ...(allowIndexing ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] : []),
    ];
    // Fuentes, fotos y logos casi nunca cambian: el navegador los guarda y no los vuelve a pedir en cada página.
    const longCache = (value) => [{ key: 'Cache-Control', value }];
    return [
      {
        source: '/:path*',
        headers: allowIndexing ? common : [...common, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // Páginas públicas: sin "no-store" para que el botón «atrás» del navegador las recupere al instante (bfcache).
      // "no-cache" = siempre se revalida con el servidor, así que nunca se ve información vieja.
      { source: '/((?!_next/|fonts/|images/|news/|brand/|docs/|api/|crm).*)', headers: longCache('private, no-cache, max-age=0, must-revalidate') },
      { source: '/docs/:path*', headers: longCache('public, max-age=86400, stale-while-revalidate=604800') },
      { source: '/fonts/:path*', headers: longCache('public, max-age=31536000, immutable') },
      { source: '/images/:path*', headers: longCache('public, max-age=604800, stale-while-revalidate=86400') },
      { source: '/news/:path*', headers: longCache('public, max-age=604800, stale-while-revalidate=86400') },
      { source: '/brand/:path*', headers: longCache('public, max-age=86400, stale-while-revalidate=604800') },
    ];
  },
};

export default nextConfig;
