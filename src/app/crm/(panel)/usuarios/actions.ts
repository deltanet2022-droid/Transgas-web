'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { passwordSchema } from '@/lib/crm/password';
import { fail, firstZodError, formString, refreshCrm, success, type ActionState } from '@/lib/crm/action';

const createSchema = z.object({
  email: z.string().email('Ingresá un email válido.').max(160).transform((v) => v.toLowerCase()),
  name: z.string().max(120),
  role: z.enum(['ADMIN', 'EDITOR'], { errorMap: () => ({ message: 'Elegí un rol.' }) }),
  password: passwordSchema,
});

/** Alta: crea el usuario en Supabase Auth y su registro (con rol) en la tabla users. Solo admin. */
export async function createCrmUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = createSchema.safeParse({
    email: formString(fd, 'email'),
    name: formString(fd, 'name'),
    role: formString(fd, 'role'),
    password: typeof fd.get('password') === 'string' ? (fd.get('password') as string) : '',
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const { email, name, role, password } = parsed.data;

  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) return fail('Ya existe un usuario del CRM con ese email.');

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return fail('Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.');
  }

  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
  if (error || !data.user) {
    return fail(/already|registered|exists/i.test(error?.message ?? '') ? 'Ese email ya está registrado en Supabase Auth.' : `No se pudo crear el usuario: ${error?.message ?? 'error desconocido'}`);
  }

  try {
    await prisma.user.create({ data: { email, name: name || null, role, supabaseId: data.user.id } });
  } catch (e) {
    console.error(e);
    await supabase.auth.admin.deleteUser(data.user.id); // no dejar un usuario de Auth huérfano
    return fail('No se pudo guardar el usuario.');
  }
  refreshCrm();
  return success(`Usuario ${email} creado. Compartile la contraseña temporal por un canal seguro.`);
}

export async function changeUserRole(fd: FormData) {
  const me = await requireAdmin();
  const id = formString(fd, 'id');
  const role = formString(fd, 'role');
  if (role !== 'ADMIN' && role !== 'EDITOR') return;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return;
  if (target.role === 'ADMIN' && role !== 'ADMIN') {
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (admins <= 1 || target.id === me.id) redirect('/crm/usuarios?error=lastadmin');
  }
  await prisma.user.update({ where: { id }, data: { role } });
  refreshCrm();
  redirect('/crm/usuarios');
}

/** Baja: elimina el registro y el usuario de Supabase Auth. No se puede dar de baja a uno mismo ni al último admin. */
export async function deleteCrmUser(fd: FormData) {
  const me = await requireAdmin();
  const id = formString(fd, 'id');
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) redirect('/crm/usuarios');
  if (target.id === me.id) redirect('/crm/usuarios?error=self');
  if (target.role === 'ADMIN' && (await prisma.user.count({ where: { role: 'ADMIN' } })) <= 1) redirect('/crm/usuarios?error=lastadmin');

  await prisma.user.delete({ where: { id } });
  if (target.supabaseId) {
    try {
      await createAdminClient().auth.admin.deleteUser(target.supabaseId);
    } catch (e) {
      console.error('[usuarios] no se pudo borrar el usuario de Supabase Auth', e);
    }
  }
  refreshCrm();
  redirect('/crm/usuarios');
}

/** El administrador define una contraseña temporal nueva para otro usuario (por ejemplo, si la olvidó). */
export async function adminSetPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = formString(fd, 'id');
  const password = typeof fd.get('password') === 'string' ? (fd.get('password') as string) : '';
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Contraseña inválida.');
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target?.supabaseId) return fail('Ese usuario todavía no ingresó nunca, no tiene cuenta de acceso creada.');
  try {
    const { error } = await createAdminClient().auth.admin.updateUserById(target.supabaseId, { password });
    if (error) return fail(`No se pudo cambiar la contraseña: ${error.message}`);
  } catch {
    return fail('Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.');
  }
  return success(`Contraseña de ${target.email} actualizada. Compartísela por un canal seguro.`);
}

/** Si alguien perdió el celular: se quita su verificación en dos pasos para que pueda volver a configurarla. */
export async function adminResetMfa(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const target = await prisma.user.findUnique({ where: { id: formString(fd, 'id') } });
  if (!target?.supabaseId) return fail('Ese usuario no tiene cuenta de acceso.');
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.mfa.listFactors({ userId: target.supabaseId });
    if (error) return fail(`No se pudo consultar: ${error.message}`);
    for (const f of data?.factors ?? []) {
      const r = await admin.auth.admin.mfa.deleteFactor({ id: f.id, userId: target.supabaseId });
      if (r.error) return fail(`No se pudo quitar: ${r.error.message}`);
    }
  } catch {
    return fail('Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.');
  }
  return success(`Se quitó la verificación en dos pasos de ${target.email}.`);
}
