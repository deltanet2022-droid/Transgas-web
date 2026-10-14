import { headers } from 'next/headers';

/** IP del request actual dentro de una Server Action o Server Component. */
export function clientIpFromHeaders(): string {
  const h = headers();
  const fwd = h.get('x-forwarded-for');
  return (fwd?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown').slice(0, 64);
}
