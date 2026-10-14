'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { fail, firstZodError, formString, refreshCrm, type ActionState } from '@/lib/crm/action';

const schema = z.object({
  name: z.string().min(2, 'Ingresá el nombre de la cooperativa o localidad.').max(100),
  legalName: z.string().max(200),
  address: z.string().max(200),
  phone: z.string().max(80),
  schedule: z.string().max(160),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export async function saveCooperative(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = formString(fd, 'id');
  const parsed = schema.safeParse({
    name: formString(fd, 'name'),
    legalName: formString(fd, 'legalName'),
    address: formString(fd, 'address'),
    phone: formString(fd, 'phone'),
    schedule: formString(fd, 'schedule'),
    sortOrder: formString(fd, 'sortOrder') || '0',
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const d = parsed.data;
  const data = {
    name: d.name,
    legalName: d.legalName || null,
    address: d.address || null,
    phone: d.phone || null,
    schedule: d.schedule || null,
    sortOrder: d.sortOrder,
  };
  if (id) await prisma.cooperative.update({ where: { id }, data });
  else await prisma.cooperative.create({ data });
  refreshCrm();
  redirect('/crm/cooperativas');
}

export async function deleteCooperative(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.cooperative.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/cooperativas');
}
