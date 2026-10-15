'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { formString, refreshCrm } from '@/lib/crm/action';

/** Derecho de supresión: elimina por completo al suscriptor y su historial de envíos. */
export async function deleteSubscriber(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.subscriber.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/suscriptores');
}
