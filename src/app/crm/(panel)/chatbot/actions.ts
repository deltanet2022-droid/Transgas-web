'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formString, refreshCrm } from '@/lib/crm/action';

/** Elimina una conversación y sus mensajes (supresión de datos). Solo administradores. */
export async function deleteConversation(fd: FormData) {
  await requireAdmin();
  const id = formString(fd, 'id');
  if (id) await prisma.chatConversation.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/chatbot');
}
