import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|uptime|headless|lighthouse|curl|wget|python|axios|node-fetch/i;
const SECRET = process.env.TRACK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'transgas';
const RETENTION_DAYS = 400;

const empty = () => new NextResponse(null, { status: 204 });

function deviceOf(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/ipad|tablet|kindle|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android|windows phone/i.test(ua)) return 'mobile';
  return 'desktop';
}

/**
 * POST /api/track — cuenta una visita SIN cookies y SIN guardar la IP.
 * Solo se guarda: página, sitio de origen, tipo de dispositivo y un hash irreversible
 * (IP + navegador + secreto + día) que cambia todos los días, por lo que no permite seguir a nadie.
 * Respeta "No rastrear" (DNT) y no cuenta bots.
 */
export async function POST(req: Request) {
  if (req.headers.get('dnt') === '1' || req.headers.get('sec-gpc') === '1') return empty();
  const ua = req.headers.get('user-agent') ?? '';
  if (!ua || BOT_RE.test(ua)) return empty();
  if (!rateLimit(`track:${clientIp(req)}`, 90, 60_000)) return empty();

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await req.json();
  } catch {
    return empty();
  }

  let path = typeof body.path === 'string' ? body.path.split(/[?#]/)[0] : '';
  if (!path.startsWith('/') || path.length > 200) return empty();
  if (path.length > 1) path = path.replace(/\/+$/, '');
  // No se registran el CRM, la API ni los enlaces con token personal (confirmación y baja de avisos).
  if (path.startsWith('/crm') || path.startsWith('/api') || path.startsWith('/avisos/confirmar') || path.startsWith('/avisos/baja')) return empty();

  let referrerHost: string | null = null;
  if (typeof body.referrer === 'string' && body.referrer) {
    try {
      const host = new URL(body.referrer).host.replace(/^www\./, '');
      const own = (req.headers.get('host') ?? '').replace(/^www\./, '');
      if (host && host !== own) referrerHost = host.slice(0, 100);
    } catch {
      /* referrer inválido */
    }
  }

  const day = new Date(Date.now() - 3 * 3_600_000).toISOString().slice(0, 10); // día en Argentina
  const visitorHash = createHash('sha256').update(`${day}|${SECRET}|${clientIp(req)}|${ua}`).digest('hex').slice(0, 32);

  try {
    await prisma.pageView.create({ data: { path, referrerHost, device: deviceOf(ua), visitorHash } });
    // Limpieza ocasional de datos viejos.
    if (Math.random() < 0.01) await prisma.pageView.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_DAYS * 86_400_000) } } });
  } catch (e) {
    console.error('[api/track]', e);
  }
  return empty();
}
