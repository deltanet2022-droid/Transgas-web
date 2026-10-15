'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { PRIVACY_VERSION } from '@/lib/privacy';

/** Confirma la suscripción. Se hace con un botón (POST) y no solo abriendo el enlace, para que un antivirus o un
 *  previsualizador de mails no confirme por la persona. */
export async function confirmSubscription(fd: FormData) {
  const token = String(fd.get('token') ?? '');
  const sub = token ? await prisma.subscriber.findUnique({ where: { token } }) : null;
  if (!sub) redirect('/avisos');
  await prisma.subscriber.update({
    where: { id: sub.id },
    data: { confirmedAt: new Date(), unsubscribedAt: null, consentVersion: sub.consentVersion || PRIVACY_VERSION },
  });
  redirect(`/avisos/confirmar/${token}?ok=1`);
}

export async function unsubscribe(fd: FormData) {
  const token = String(fd.get('token') ?? '');
  const sub = token ? await prisma.subscriber.findUnique({ where: { token } }) : null;
  if (sub) await prisma.subscriber.update({ where: { id: sub.id }, data: { unsubscribedAt: new Date() } });
  redirect(`/avisos/baja/${token}?ok=1`);
}
