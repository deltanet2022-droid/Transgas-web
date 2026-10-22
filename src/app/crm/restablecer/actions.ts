'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fail, type ActionState } from '@/lib/crm/action';
import { passwordSchema } from '@/lib/crm/password';

/** Elegir una contraseña nueva después de abrir el enlace del mail de recuperación (la sesión viene del enlace). */
export async function setNewPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const password = typeof fd.get('password') === 'string' ? (fd.get('password') as string) : '';
  const confirm = typeof fd.get('confirm') === 'string' ? (fd.get('confirm') as string) : '';
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Contraseña inválida.');
  if (password !== confirm) return fail('Las contraseñas no coinciden.');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail('El enlace venció o ya se usó. Pedí uno nuevo desde «¿Olvidaste tu contraseña?».');

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return fail(`No se pudo cambiar la contraseña: ${error.message}`);
  redirect('/crm');
}
