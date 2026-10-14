'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { fail, formString, type ActionState } from '@/lib/crm/action';
import { clientIpFromHeaders } from '@/lib/crm/ip';
import { rateLimit } from '@/lib/rate-limit';

export async function signIn(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = formString(fd, 'email').toLowerCase();
  const password = typeof fd.get('password') === 'string' ? (fd.get('password') as string) : '';
  if (!email || !password) return fail('Ingresá tu email y tu contraseña.');

  // Freno básico a la fuerza bruta (por IP y por email).
  const ip = clientIpFromHeaders();
  if (!rateLimit(`login:ip:${ip}`, 20, 15 * 60_000) || !rateLimit(`login:email:${email}`, 8, 15 * 60_000)) {
    return fail('Demasiados intentos. Esperá unos minutos y volvé a probar.');
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail('Email o contraseña incorrectos.');

  const crmUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!crmUser) {
    await supabase.auth.signOut();
    return fail('Tu usuario no tiene acceso al CRM. Pedile al administrador que te dé de alta.');
  }
  redirect('/crm');
}

export async function signOut() {
  await createClient().auth.signOut();
  redirect('/crm/login');
}
