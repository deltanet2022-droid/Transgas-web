import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

/**
 * Vuelta del enlace del mail de recuperación de contraseña: canjea el código por una sesión y sigue.
 * Solo se permite continuar a rutas internas del CRM (evita redirecciones a sitios externos).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/crm';
  const safeNext = next.startsWith('/crm') && !next.startsWith('//') ? next : '/crm';

  if (code) {
    const { error } = await createClient().auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, site.url));
  }
  return NextResponse.redirect(new URL('/crm/login?error=link', site.url));
}
