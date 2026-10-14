import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { getPublishedNews } from '@/lib/queries';

export const dynamic = 'force-dynamic';

const PATHS = [
  '/',
  '/tarifas',
  '/tarifas/categorias',
  '/tarifas/tarifa-social',
  '/tarifas/zona-fria',
  '/ayuda/entender-tu-factura',
  '/ayuda/inquilinos',
  '/seguridad',
  '/seguridad/uso-eficiente',
  '/seguridad/monoxido-de-carbono',
  '/seguridad/prevencion-de-danos',
  '/usuarios/derechos',
  '/profesionales/gasistas-matriculados',
  '/cooperativas',
  '/autogestion',
  '/autogestion/factura-electronica',
  '/autogestion/informar-pago',
  '/autogestion/informar-medidor',
  '/autogestion/abm-servicio',
  '/autogestion/nuevo-servicio',
  '/contacto',
  '/estado-del-servicio',
  '/blog',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getPublishedNews();
  return [
    ...PATHS.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.7 })),
    ...news.map((n) => ({ url: `${site.url}/blog/${n.slug}`, lastModified: n.updatedAt, priority: 0.6 })),
  ];
}
