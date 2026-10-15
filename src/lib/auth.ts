import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { User } from '@prisma/client';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

/**
 * Sesiones ya verificadas contra Supabase Auth (por token de acceso), guardadas 60 segundos.
 * Verificar el token es una llamada de red a Supabase; sin este caché se repetía varias veces
 * por cada clic en el CRM (y hacía que "Guardar" tardara). Cerrar sesión o vencer el token la invalida.
 */
const VERIFIED_TTL_MS = 60_000;
const gv = globalThis as unknown as { __verifiedSessions?: Map<string, { at: number; id: string; email: string }> };
const verified = (gv.__verifiedSessions ??= new Map());

async function getVerifiedAuthUser(): Promise<{ id: string; email: string } | null> {
  const supabase = createClient();
  // Solo leemos el token de la cookie; la verificación real es el getUser(token) de más abajo.
  (supabase.auth as unknown as { suppressGetSessionWarning: boolean }).suppressGetSessionWarning = true;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return null;

  const hit = verified.get(token);
  if (hit && Date.now() - hit.at < VERIFIED_TTL_MS) return { id: hit.id, email: hit.email };

  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  if (!user?.email) return null;
  if (verified.size > 200) verified.clear();
  verified.set(token, { at: Date.now(), id: user.id, email: user.email });
  return { id: user.id, email: user.email };
}

/** Olvida las sesiones verificadas (al cerrar sesión o cambiar la contraseña). */
export function forgetVerifiedSessions() {
  verified.clear();
}

/**
 * Usuario del CRM: sesión válida en Supabase Auth Y registro en la tabla `users`
 * (que es la que define el rol). Si falta alguno de los dos, no hay acceso.
 */
export const getCrmUser = cache(async (): Promise<User | null> => {
  const user = await getVerifiedAuthUser();
  if (!user) return null;

  const email = user.email.toLowerCase();
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) return null;

  if (!dbUser.supabaseId) {
    return prisma.user.update({ where: { id: dbUser.id }, data: { supabaseId: user.id } });
  }
  return dbUser;
});

/** Nivel de verificación de la sesión: aal1 = contraseña; aal2 = contraseña + código de la app autenticadora. */
export const getAssurance = cache(async () => {
  const { data } = await createClient().auth.mfa.getAuthenticatorAssuranceLevel();
  return { current: data?.currentLevel ?? null, next: data?.nextLevel ?? null };
});

/** Si la persona activó la doble verificación y todavía no ingresó el código en esta sesión. */
export async function needsSecondFactor(): Promise<boolean> {
  const a = await getAssurance();
  return a.next === 'aal2' && a.current !== 'aal2';
}

export async function requireUser(): Promise<User> {
  const user = await getCrmUser();
  if (!user) redirect('/crm/login?error=noaccess');
  if (await needsSecondFactor()) redirect('/crm/verificar');
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/crm?forbidden=1');
  return user;
}
