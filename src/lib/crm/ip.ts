import { headers } from 'next/headers';
import { ipFromHeaders } from '@/lib/rate-limit';

/** IP del request actual dentro de una Server Action o Server Component. */
export async function clientIpFromHeaders(): Promise<string> {
  return ipFromHeaders(await headers());
}
