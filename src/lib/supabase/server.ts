import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Cliente de Supabase ligado a la sesión (cookies) del usuario que hace el request. */
export async function createClient() {
  const cookieStore = await cookies();
  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el middleware refresca la sesión.
        }
      },
    },
  });
  // La librería avisa "usá getUser()" cada vez que se lee la sesión. Acá la sesión solo se lee de la cookie para
  // decidir la pantalla (el acceso real se verifica con getUser en lib/auth.ts), así que el aviso solo llena los logs.
  (client.auth as unknown as { suppressGetSessionWarning: boolean }).suppressGetSessionWarning = true;
  return client;
}
