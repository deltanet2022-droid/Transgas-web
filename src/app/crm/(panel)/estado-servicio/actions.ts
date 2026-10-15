'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { parseArgDateTime } from '@/lib/dates';
import { fail, firstZodError, formString, refreshCrm, saved, type ActionState } from '@/lib/crm/action';

const schema = z.object({
  title: z.string().min(3, 'Ingresá un título.').max(140),
  description: z.string().min(3, 'Ingresá una descripción.').max(1500),
  zone: z.string().min(2, 'Ingresá la zona o localidad.').max(120),
  status: z.enum(['PROGRAMADO', 'EN_CURSO', 'RESUELTO'], { errorMap: () => ({ message: 'Elegí un estado.' }) }),
});

export async function saveServiceStatus(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = formString(fd, 'id');
  const parsed = schema.safeParse({
    title: formString(fd, 'title'),
    description: formString(fd, 'description'),
    zone: formString(fd, 'zone'),
    status: formString(fd, 'status'),
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));

  const startsAt = parseArgDateTime(formString(fd, 'startsAt'));
  if (!startsAt) return fail('Ingresá la fecha y hora de inicio.');
  const endRaw = formString(fd, 'estimatedEndAt');
  const estimatedEndAt = endRaw ? parseArgDateTime(endRaw) : null;
  if (endRaw && !estimatedEndAt) return fail('La fecha estimada de fin no es válida.');
  if (estimatedEndAt && estimatedEndAt < startsAt) return fail('El fin estimado no puede ser anterior al inicio.');

  const data = { ...parsed.data, startsAt, estimatedEndAt };
  if (id) await prisma.serviceStatus.update({ where: { id }, data });
  else await prisma.serviceStatus.create({ data });
  refreshCrm();
  return saved('/crm/estado-servicio', 'Aviso guardado.');
}

export async function deleteServiceStatus(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.serviceStatus.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/estado-servicio');
}

/** Atajo desde el listado: pasar un aviso a "resuelto". */
export async function resolveServiceStatus(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.serviceStatus.update({ where: { id }, data: { status: 'RESUELTO' } }).catch(() => null);
  refreshCrm();
  redirect('/crm/estado-servicio');
}
