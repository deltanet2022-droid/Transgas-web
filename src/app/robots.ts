import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Dominio de prueba: se bloquea todo. Producción (ALLOW_INDEXING=true): se permite, salvo /crm y /api.
  if (process.env.ALLOW_INDEXING !== 'true') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/crm', '/api'] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
