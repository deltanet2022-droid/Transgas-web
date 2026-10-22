// Rate limit en memoria (por proceso). Alcanza para una Node.js App de Hostinger con
// una sola instancia; si se escala a varias instancias, mover a Redis/Upstash.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
    }
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/**
 * IP del visitante. Detrás de Cloudflare se usa `cf-connecting-ip`, que Cloudflare siempre pisa con la IP real
 * (el primer valor de X-Forwarded-For lo puede inventar cualquiera y permitiría saltear los límites de intentos).
 */
export function ipFromHeaders(h: { get(name: string): string | null }): string {
  const ip = h.get('cf-connecting-ip') || h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return ip.slice(0, 64);
}

export function clientIp(req: Request): string {
  return ipFromHeaders(req.headers);
}
