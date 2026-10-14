'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { invalidateFaqCache } from '@/lib/chat/engine';
import { fail, firstZodError, formList, formString, refreshCrm, type ActionState } from '@/lib/crm/action';

const schema = z.object({
  question: z.string().min(3, 'Escribí la pregunta.').max(200, 'La pregunta es demasiado larga (máx. 200).'),
  category: z.string().min(2, 'Elegí o escribí una categoría.').max(60),
  palabrasClave: z
    .array(z.string().max(80, 'Cada palabra clave puede tener hasta 80 caracteres.'))
    .min(1, 'Cargá al menos una palabra clave.')
    .max(60, 'Máximo 60 palabras clave.'),
  followUps: z.array(z.string().max(60, 'Cada botón puede tener hasta 60 caracteres.')).max(9, 'Máximo 9 botones de seguimiento.'),
  respuestas: z
    .array(z.string().max(1200, 'Cada variante puede tener hasta 1.200 caracteres.'))
    .min(1, 'Cargá al menos una respuesta.')
    .max(6, 'Máximo 6 variantes.'),
});

export async function saveFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = formString(fd, 'id');
  const parsed = schema.safeParse({
    question: formString(fd, 'question'),
    category: formString(fd, 'category'),
    palabrasClave: formList(fd, 'palabrasClave'),
    respuestas: formList(fd, 'respuestas'),
    followUps: formList(fd, 'followUps'),
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const data = { ...parsed.data, active: fd.get('active') === 'on' };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  invalidateFaqCache();
  refreshCrm();
  redirect('/crm/faq');
}

export async function deleteFaq(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.faq.delete({ where: { id } }).catch(() => null);
  invalidateFaqCache();
  refreshCrm();
  redirect('/crm/faq');
}

export async function toggleFaq(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  const faq = id ? await prisma.faq.findUnique({ where: { id }, select: { active: true } }) : null;
  if (faq) await prisma.faq.update({ where: { id }, data: { active: !faq.active } });
  invalidateFaqCache();
  refreshCrm();
  redirect('/crm/faq');
}
