import type { MetadataRoute } from 'next';
import { getPublishedNews } from '@/lib/queries';
import { absUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

// Prioridad y frecuencia de cambio orientativas para cada tipo de página.
const PAGES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, freq: 'weekly' },
  { path: '/tarifas', priority: 0.9, freq: 'monthly' },
  { path: '/tarifas/categorias', priority: 0.8, freq: 'monthly' },
  { path: '/tarifas/tarifa-social', priority: 0.7, freq: 'monthly' },
  { path: '/tarifas/zona-fria', priority: 0.6, freq: 'yearly' },
  { path: '/preguntas-frecuentes', priority: 0.9, freq: 'monthly' },
  { path: '/documentos', priority: 0.7, freq: 'monthly' },
  { path: '/ayuda/entender-tu-factura', priority: 0.8, freq: 'yearly' },
  { path: '/ayuda/inquilinos', priority: 0.6, freq: 'yearly' },
  { path: '/seguridad', priority: 0.9, freq: 'monthly' },
  { path: '/seguridad/monoxido-de-carbono', priority: 0.8, freq: 'yearly' },
  { path: '/seguridad/uso-eficiente', priority: 0.6, freq: 'yearly' },
  { path: '/seguridad/prevencion-de-danos', priority: 0.6, freq: 'yearly' },
  { path: '/usuarios/derechos', priority: 0.6, freq: 'yearly' },
  { path: '/profesionales/gasistas-matriculados', priority: 0.7, freq: 'monthly' },
  { path: '/cooperativas', priority: 0.8, freq: 'monthly' },
  { path: '/autogestion', priority: 0.8, freq: 'monthly' },
  { path: '/autogestion/factura-electronica', priority: 0.6, freq: 'yearly' },
  { path: '/autogestion/informar-pago', priority: 0.6, freq: 'yearly' },
  { path: '/autogestion/informar-medidor', priority: 0.6, freq: 'yearly' },
  { path: '/autogestion/abm-servicio', priority: 0.6, freq: 'yearly' },
  { path: '/autogestion/nuevo-servicio', priority: 0.6, freq: 'yearly' },
  { path: '/contacto', priority: 0.8, freq: 'yearly' },
  { path: '/estado-del-servicio', priority: 0.7, freq: 'daily' },
  { path: '/blog', priority: 0.7, freq: 'weekly' },
  { path: '/avisos', priority: 0.5, freq: 'yearly' },
  { path: '/privacidad', priority: 0.3, freq: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getPublishedNews();
  const newest = news.reduce<Date | undefined>((acc, n) => (!acc || n.updatedAt > acc ? n.updatedAt : acc), undefined);
  return [
    ...PAGES.map((p) => ({
      url: absUrl(p.path),
      changeFrequency: p.freq,
      priority: p.priority,
      ...(p.path === '/blog' && newest ? { lastModified: newest } : {}),
    })),
    ...news.map((n) => ({
      url: absUrl(`/blog/${n.slug}`),
      lastModified: n.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(n.coverImageUrl ? { images: [n.coverImageUrl.startsWith('http') ? n.coverImageUrl : absUrl(n.coverImageUrl)] } : {}),
    })),
  ];
}
