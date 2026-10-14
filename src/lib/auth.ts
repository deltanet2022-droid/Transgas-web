import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { User } from '@prisma/client';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

/**
 * Usuario del CRM: sesión válida en Supabase Auth Y registro en la tabla `users`
 * (que es la que define el rol). Si falta alguno de los dos, no hay acceso.
 */
export const getCrmUser = cache(async (): Promise<User | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const email = user.email.toLowerCase();
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) return null;

  if (!dbUser.supabaseId) {
    return prisma.user.update({ where: { id: dbUser.id }, data: { supabaseId: user.id } });
  }
  return dbUser;
});

export async function requireUser(): Promise<User> {
  const user = await getCrmUser();
  if (!user) redirect('/crm/login?error=noaccess');
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/crm?forbidden=1');
  return user;
}
