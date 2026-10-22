'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fail, formString, type ActionState } from '@/lib/crm/action';
import { clientIpFromHeaders } from '@/lib/crm/ip';
import { rateLimit } from '@/lib/rate-limit';

/** Segundo paso del ingreso: código de 6 dígitos de la app autenticadora. */
export async function verifyMfa(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const code = formString(fd, 'code').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) return fail('El código tiene 6 dígitos.');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/crm/login');
  if (!rateLimit(`mfa:${user.id}`, 8, 15 * 60_000) || !rateLimit(`mfa:ip:${await clientIpFromHeaders()}`, 30, 15 * 60_000)) {
    return fail('Demasiados intentos. Esperá unos minutos.');
  }

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp?.find((f) => f.status === 'verified');
  if (!factor) redirect('/crm');

  const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId: factor.id });
  if (cErr || !challenge) return fail('No se pudo iniciar la verificación. Probá de nuevo.');
  const { error } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: challenge.id, code });
  if (error) return fail('El código no es correcto o venció. Probá con el siguiente.');
  redirect('/crm');
}
