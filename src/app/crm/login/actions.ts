'use server';

import { redirect } from 'next/navigation';
import { forgetVerifiedSessions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { fail, formString, success, type ActionState } from '@/lib/crm/action';
import { clientIpFromHeaders } from '@/lib/crm/ip';
import { rateLimit } from '@/lib/rate-limit';
import { site } from '@/lib/site';

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

  // Si activó la doble verificación, falta el código de la app autenticadora.
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (data && data.nextLevel === 'aal2' && data.currentLevel !== 'aal2') redirect('/crm/verificar');
  redirect('/crm');
}

export async function signOut() {
  await createClient().auth.signOut();
  forgetVerifiedSessions();
  redirect('/crm/login');
}

/** Pide el mail de recuperación. La respuesta es siempre la misma, exista o no la cuenta (no revela usuarios). */
export async function requestPasswordReset(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = formString(fd, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail('Ingresá un correo válido.');
  if (!rateLimit(`reset:ip:${clientIpFromHeaders()}`, 5, 60 * 60_000) || !rateLimit(`reset:email:${email}`, 3, 60 * 60_000)) {
    return fail('Demasiados pedidos. Probá de nuevo en un rato.');
  }

  // Solo se manda el mail si es un usuario del CRM (evita usar el servicio para mandar mails a cualquiera).
  const crmUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (crmUser) {
    const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${site.url}/crm/auth/callback?next=/crm/restablecer` });
    if (error) console.error('[auth] resetPasswordForEmail:', error.message);
  }
  return success('Si el correo corresponde a un usuario del CRM, te enviamos un mensaje con el enlace para elegir una contraseña nueva. Abrilo desde este mismo navegador.');
}
