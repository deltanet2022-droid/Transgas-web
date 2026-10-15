import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Refresca la sesión de Supabase y protege /crm (salvo /crm/login). */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // El aviso de la librería ("usá getUser()") no aplica: acá solo miramos si hay sesión y se verifica más adelante.
  (supabase.auth as unknown as { suppressGetSessionWarning: boolean }).suppressGetSessionWarning = true;

  // Acá solo se decide si hay una sesión (se lee de la cookie y se renueva si venció, sin llamar a la red en cada
  // clic). La verificación real contra Supabase la hace `requireUser` (lib/auth.ts) en cada página y acción.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas del CRM que se pueden abrir sin sesión (ingreso, recuperación de contraseña y vuelta del mail).
  const isPublic = ['/crm/login', '/crm/recuperar', '/crm/auth/callback'].includes(request.nextUrl.pathname);
  if (!session && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/crm/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
