'use server';

import { createClient as createJsClient } from '@supabase/supabase-js';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { fail, formString, refreshCrm, success, type ActionState } from '@/lib/crm/action';
import { passwordSchema } from '@/lib/crm/password';
import { rateLimit } from '@/lib/rate-limit';

/** Cambio de contraseña: se pide la actual (se verifica con un cliente aparte para no tocar la sesión). */
export async function changePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const current = typeof fd.get('current') === 'string' ? (fd.get('current') as string) : '';
  const password = typeof fd.get('password') === 'string' ? (fd.get('password') as string) : '';
  const confirm = typeof fd.get('confirm') === 'string' ? (fd.get('confirm') as string) : '';

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Contraseña inválida.');
  if (password !== confirm) return fail('Las contraseñas nuevas no coinciden.');
  if (password === current) return fail('La contraseña nueva tiene que ser distinta de la actual.');
  if (!rateLimit(`chgpwd:${user.id}`, 6, 15 * 60_000)) return fail('Demasiados intentos. Esperá unos minutos.');

  const probe = createJsClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: bad } = await probe.auth.signInWithPassword({ email: user.email, password: current });
  if (bad) return fail('La contraseña actual no es correcta.');

  const { error } = await createClient().auth.updateUser({ password });
  if (error) return fail(`No se pudo cambiar la contraseña: ${error.message}`);
  return success('Contraseña actualizada.');
}

export interface EnrollResult {
  ok: boolean;
  error?: string;
  factorId?: string;
  qr?: string;
  secret?: string;
}

/** Paso 1 del alta de 2FA: genera el QR y el código secreto. */
export async function startMfaEnroll(): Promise<EnrollResult> {
  const user = await requireUser();
  const supabase = createClient();
  // Si quedó un intento a medias, se descarta para poder empezar de nuevo.
  const { data: existing } = await supabase.auth.mfa.listFactors();
  for (const f of existing?.all ?? []) if (f.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: f.id });

  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Transgas CRM · ${user.email}`.slice(0, 60), issuer: 'Transgas CRM' });
  if (error || !data) return { ok: false, error: error?.message ?? 'No se pudo iniciar la activación. ¿Está habilitada la verificación en dos pasos (TOTP) en Supabase?' };
  return { ok: true, factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
}

/** Paso 2: confirma con el primer código de la app. */
export async function confirmMfaEnroll(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const factorId = formString(fd, 'factorId');
  const code = formString(fd, 'code').replace(/\s/g, '');
  if (!factorId || !/^\d{6}$/.test(code)) return fail('Ingresá el código de 6 dígitos.');
  if (!rateLimit(`mfaenroll:${user.id}`, 8, 15 * 60_000)) return fail('Demasiados intentos. Esperá unos minutos.');

  const supabase = createClient();
  const { data: ch, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
  if (cErr || !ch) return fail('No se pudo verificar. Empezá de nuevo.');
  const { error } = await supabase.auth.mfa.verify({ factorId, challengeId: ch.id, code });
  if (error) return fail('El código no es correcto. Revisá que la hora del celular esté en automático e intentá con el código siguiente.');
  refreshCrm();
  return success('¡Listo! La verificación en dos pasos quedó activada.');
}

export async function disableMfa(): Promise<ActionState> {
  await requireUser(); // la sesión ya está en nivel aal2 (se pidió el código al ingresar)
  const supabase = createClient();
  const { data } = await supabase.auth.mfa.listFactors();
  for (const f of data?.all ?? []) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: f.id });
    if (error) return fail(`No se pudo desactivar: ${error.message}`);
  }
  refreshCrm();
  return success('Verificación en dos pasos desactivada.');
}
