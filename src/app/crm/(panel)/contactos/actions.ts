'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin, requireUser } from '@/lib/auth';
import { fail, firstZodError, formString, refreshCrm, success, type ActionState } from '@/lib/crm/action';

const schema = z.object({
  id: z.string().min(1),
  status: z.enum(['NUEVO', 'EN_GESTION', 'RESUELTO'], { errorMap: () => ({ message: 'Estado inválido.' }) }),
  internalNotes: z.string().max(4000, 'Las notas pueden tener hasta 4.000 caracteres.'),
});

export async function updateLead(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = schema.safeParse({ id: formString(fd, 'id'), status: formString(fd, 'status'), internalNotes: formString(fd, 'internalNotes') });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const { id, status, internalNotes } = parsed.data;
  try {
    await prisma.lead.update({ where: { id }, data: { status, internalNotes: internalNotes || null } });
  } catch {
    return fail('No se encontró el contacto.');
  }
  refreshCrm();
  return success('Contacto actualizado.');
}

/** Derecho de supresión (Ley 25.326): elimina el contacto de forma definitiva. Solo administradores. */
export async function deleteLead(fd: FormData) {
  await requireAdmin();
  const id = formString(fd, 'id');
  if (id) await prisma.lead.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/contactos');
}
