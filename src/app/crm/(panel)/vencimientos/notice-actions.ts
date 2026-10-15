'use server';

import { requireUser } from '@/lib/auth';
import { fail, refreshCrm, success, type ActionState } from '@/lib/crm/action';
import { sendDueNotices } from '@/lib/subscribers';

const BATCH = Math.max(1, Number(process.env.NOTICE_BATCH || 100));

/** Envía (o continúa enviando) el aviso de un vencimiento a los suscriptores que todavía no lo recibieron. */
export async function sendNoticeNow(dueDateId: string): Promise<ActionState> {
  await requireUser();
  const r = await sendDueNotices(dueDateId, BATCH);
  refreshCrm();
  if (r.reason === 'not_configured') return fail('El envío de mails no está configurado en el servidor (SMTP_HOST, SMTP_USER y SMTP_PASS).');
  if (r.reason === 'not_found') return fail('Ese vencimiento ya no existe.');
  if (r.sent === 0 && r.failed === 0) return success('No hay suscriptores pendientes: todos los suscriptores activos ya recibieron este aviso.');
  const parts = [`Enviados: ${r.sent}`];
  if (r.failed) parts.push(`con error: ${r.failed}`);
  if (r.pending > 0) parts.push(`pendientes: ${r.pending} (volvé a apretar el botón para continuar)`);
  return r.failed && !r.sent ? fail(parts.join(' · ') + '. Revisá la configuración del correo.') : success(parts.join(' · '));
}
