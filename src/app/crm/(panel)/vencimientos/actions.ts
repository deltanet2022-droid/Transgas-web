'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { addDays, parseDateOnly } from '@/lib/dates';
import { fail, formString, refreshCrm, success, type ActionState } from '@/lib/crm/action';

export async function createDueDate(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const dueDate = parseDateOnly(formString(fd, 'dueDate'));
  const message = formString(fd, 'message');
  const tariffId = formString(fd, 'tariffId') || null;
  if (!dueDate) return fail('Ingresá la fecha de vencimiento.');
  const showFrom = parseDateOnly(formString(fd, 'showFrom')) ?? addDays(dueDate, -7);
  if (showFrom > dueDate) return fail('"Mostrar desde" no puede ser posterior al vencimiento.');
  if (message.length < 5) return fail('Escribí un mensaje corto para el banner (mín. 5 caracteres).');
  if (message.length > 200) return fail('El mensaje puede tener hasta 200 caracteres.');
  if (tariffId && !(await prisma.tariff.findUnique({ where: { id: tariffId }, select: { id: true } }))) return fail('La categoría elegida no existe.');

  await prisma.dueDate.create({ data: { dueDate, showFrom, message, tariffId } });
  refreshCrm();
  return success('Vencimiento cargado. Se mostrará en el sitio desde la fecha indicada.');
}

export async function deleteDueDate(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.dueDate.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/vencimientos');
}
