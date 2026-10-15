import type { MetadataRoute } from 'next';
import { absUrl } from '@/lib/seo';

// Buscadores de IA / asistentes: se permite explícitamente que lean el sitio público (GEO / AEO).
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

export default function robots(): MetadataRoute.Robots {
  // Dominio de prueba: se bloquea todo. Producción (ALLOW_INDEXING=true): se permite, salvo /crm, /api y las páginas de baja/confirmación.
  if (process.env.ALLOW_INDEXING !== 'true') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  const disallow = ['/crm', '/api', '/avisos/baja/', '/avisos/confirmar/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: AI_BOTS, allow: '/', disallow },
    ],
    sitemap: absUrl('/sitemap.xml'),
    host: absUrl('/'),
  };
}
