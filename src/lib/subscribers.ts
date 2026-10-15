import 'server-only';
import type { DueDate, Subscriber } from '@prisma/client';
import { prisma } from '@/lib/db';
import { formatDateOnly, todayAR, addDays } from '@/lib/dates';
import { escapeHtml, layoutEmail, mailConfigured, sendMail } from '@/lib/mail';
import { getSettings } from '@/lib/settings';
import { site } from '@/lib/site';

export const confirmUrl = (token: string) => `${site.url}/avisos/confirmar/${token}`;
export const unsubscribeUrl = (token: string) => `${site.url}/avisos/baja/${token}`;

/** Mail de confirmación (doble confirmación: sin este paso la persona NO recibe avisos). */
export async function sendConfirmation(sub: Pick<Subscriber, 'email' | 'token'>) {
  const url = confirmUrl(sub.token);
  return sendMail({
    to: sub.email,
    subject: 'Confirmá tu suscripción a los avisos de vencimiento — Transgas',
    html: layoutEmail(
      'Confirmá tu suscripción',
      `<p style="font-size:15px;line-height:1.5">Pediste recibir por mail los <strong>avisos de vencimiento</strong> de tus facturas de gas. Para activarlos, confirmá tu correo:</p>
       <p style="margin:22px 0"><a href="${escapeHtml(url)}" style="background:#0b6fb8;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;display:inline-block">Confirmar suscripción</a></p>
       <p style="font-size:13px;color:#607387">Si no fuiste vos, ignorá este mensaje: no vas a recibir nada. Tus datos se tratan según nuestra <a href="${escapeHtml(site.url)}/privacidad" style="color:#0b6fb8">Política de Privacidad</a>.</p>`,
    ),
  });
}

type DueWithTariff = DueDate & { tariff: { code: string } | null };

async function sendNotice(sub: Pick<Subscriber, 'email' | 'token'>, due: DueWithTariff) {
  const settings = await getSettings();
  const date = formatDateOnly(due.dueDate);
  const unsub = unsubscribeUrl(sub.token);
  return sendMail({
    to: sub.email,
    subject: `Recordatorio: tu factura de gas vence el ${formatDateOnly(due.dueDate, 'short')}`,
    headers: { 'List-Unsubscribe': `<${unsub}>` },
    html: layoutEmail(
      `Vencimiento: ${date}`,
      `${due.tariff ? `<p style="margin:0 0 8px;color:#607387">Categoría ${escapeHtml(due.tariff.code)}</p>` : ''}
       <p style="font-size:15px;line-height:1.5">${escapeHtml(due.message)}</p>
       <p style="margin:22px 0"><a href="${escapeHtml(site.coopOnlineUrl)}" style="background:#0b6fb8;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;display:inline-block">Ver y pagar mi factura</a></p>
       <p style="font-size:13px;color:#607387">¿Ya pagaste? Si no se ve reflejado, <a href="${escapeHtml(site.url)}/autogestion/informar-pago" style="color:#0b6fb8">informá tu pago</a>. Consultas: ${escapeHtml(settings.attentionPhone)}.</p>`,
      `Recibís este mail porque te suscribiste a los avisos de vencimiento de Transgas.<br><a href="${escapeHtml(unsub)}" style="color:#607387">Darme de baja</a> · <a href="${escapeHtml(site.url)}/privacidad" style="color:#607387">Política de Privacidad</a>`,
    ),
  });
}

export interface NoticeRunResult {
  ok: boolean;
  sent: number;
  failed: number;
  pending: number;
  reason?: 'not_configured' | 'not_found';
}

/** Suscriptores activos (confirmados y no dados de baja). */
export const activeSubscribers = () => prisma.subscriber.findMany({ where: { confirmedAt: { not: null }, unsubscribedAt: null }, orderBy: { createdAt: 'asc' } });

/**
 * Envía el aviso de un vencimiento a los suscriptores que todavía no lo recibieron.
 * Es reanudable: cada envío queda registrado, así que correrlo de nuevo nunca duplica.
 */
export async function sendDueNotices(dueDateId: string, limit = 100): Promise<NoticeRunResult> {
  if (!mailConfigured()) return { ok: false, sent: 0, failed: 0, pending: 0, reason: 'not_configured' };
  const due = await prisma.dueDate.findUnique({ where: { id: dueDateId }, include: { tariff: { select: { code: true } } } });
  if (!due) return { ok: false, sent: 0, failed: 0, pending: 0, reason: 'not_found' };

  const already = new Set((await prisma.noticeDelivery.findMany({ where: { dueDateId }, select: { subscriberId: true } })).map((d) => d.subscriberId));
  const todo = (await activeSubscribers()).filter((s) => !already.has(s.id));
  const batch = todo.slice(0, limit);

  let sent = 0;
  let failed = 0;
  for (const sub of batch) {
    const res = await sendNotice(sub, due);
    if (res.ok) {
      await prisma.noticeDelivery.create({ data: { dueDateId, subscriberId: sub.id } }).catch(() => null);
      sent++;
    } else {
      failed++;
    }
    await new Promise((r) => setTimeout(r, 120)); // no saturar el servidor de correo
  }
  return { ok: true, sent, failed, pending: todo.length - sent };
}

/** Vencimientos que hoy están dentro de la ventana de aviso automático (N días antes). */
export async function dueDatesToNotify(): Promise<DueDate[]> {
  const { noticeDaysBefore } = await getSettings();
  const today = todayAR();
  return prisma.dueDate.findMany({ where: { dueDate: { gte: today, lte: addDays(today, noticeDaysBefore) } }, orderBy: { dueDate: 'asc' } });
}
