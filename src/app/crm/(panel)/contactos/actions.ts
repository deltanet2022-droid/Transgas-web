'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
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
