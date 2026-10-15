'use server';

import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { escapeHtml, layoutEmail, mailConfigured, sendMail } from '@/lib/mail';
import { getSettings, invalidateSettingsCache, saveSettings, type SiteSettings } from '@/lib/settings';
import { parseDateOnly } from '@/lib/dates';
import { fail, firstZodError, formString, refreshCrm, success, type ActionState } from '@/lib/crm/action';

const emailList = (raw: string) =>
  raw
    .split(/[\n,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const schema = z.object({
  emergencyPhone: z.string().min(6, 'Ingresá el teléfono de emergencias.').max(40),
  supplyPhone: z.string().min(6, 'Ingresá el teléfono de falta de suministro.').max(40),
  attentionPhone: z.string().min(6, 'Ingresá el teléfono de atención.').max(40),
  bannerMessage: z.string().max(240, 'El mensaje del aviso puede tener hasta 240 caracteres.'),
  bannerLinkLabel: z.string().max(40),
  bannerLinkUrl: z
    .string()
    .max(300)
    .refine((v) => v === '' || /^(\/|https?:\/\/)/i.test(v), 'El enlace debe empezar con / (página del sitio) o con https://'),
  bannerTone: z.enum(['danger', 'info']),
  bannerUntil: z.string(),
  notifyEmails: z.array(z.string().email('Hay un correo de aviso con formato inválido.')).max(10, 'Máximo 10 correos.'),
  privacyEmail: z.union([z.literal(''), z.string().email('El correo de privacidad no es válido.')]),
  noticeDaysBefore: z.coerce.number().int().min(0).max(30),
});

export async function saveSiteSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    emergencyPhone: formString(fd, 'emergencyPhone'),
    supplyPhone: formString(fd, 'supplyPhone'),
    attentionPhone: formString(fd, 'attentionPhone'),
    bannerMessage: formString(fd, 'bannerMessage'),
    bannerLinkLabel: formString(fd, 'bannerLinkLabel'),
    bannerLinkUrl: formString(fd, 'bannerLinkUrl'),
    bannerTone: formString(fd, 'bannerTone') || 'danger',
    bannerUntil: formString(fd, 'bannerUntil'),
    notifyEmails: emailList(formString(fd, 'notifyEmails')),
    privacyEmail: formString(fd, 'privacyEmail').toLowerCase(),
    noticeDaysBefore: formString(fd, 'noticeDaysBefore') || '3',
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const d = parsed.data;
  if (d.bannerUntil && !parseDateOnly(d.bannerUntil)) return fail('La fecha "mostrar hasta" no es válida.');
  const enabled = fd.get('bannerEnabled') === 'on';
  if (enabled && !d.bannerMessage.trim()) return fail('Para activar el aviso escribí el mensaje.');
  if ((d.bannerLinkLabel && !d.bannerLinkUrl) || (!d.bannerLinkLabel && d.bannerLinkUrl)) return fail('Para agregar un enlace al aviso completá el texto y la dirección.');

  const next: SiteSettings = {
    emergencyPhone: d.emergencyPhone,
    supplyPhone: d.supplyPhone,
    attentionPhone: d.attentionPhone,
    alertBanner: { enabled, message: d.bannerMessage, linkLabel: d.bannerLinkLabel, linkUrl: d.bannerLinkUrl, tone: d.bannerTone, until: d.bannerUntil },
    notifyEmails: d.notifyEmails,
    privacyEmail: d.privacyEmail,
    noticeDaysBefore: d.noticeDaysBefore,
  };
  await saveSettings(next);
  refreshCrm();
  return success('Configuración guardada. Ya se aplica en el sitio y en el chat.');
}

/** Envía un mail de prueba a los destinatarios guardados (verifica que el SMTP funcione). */
export async function sendTestEmail(): Promise<ActionState> {
  await requireAdmin();
  invalidateSettingsCache();
  const s = await getSettings();
  if (!mailConfigured()) return fail('El envío de mails no está configurado en el servidor (variables SMTP_HOST, SMTP_USER y SMTP_PASS).');
  if (!s.notifyEmails.length) return fail('Primero guardá al menos un correo de aviso.');
  const res = await sendMail({
    to: s.notifyEmails,
    subject: 'Prueba de avisos — Transgas',
    html: layoutEmail('Prueba de avisos', `<p>Si recibiste este mensaje, los avisos por mail del sitio de Transgas funcionan.</p><p style="color:#607387;font-size:13px">Destinatarios configurados: ${escapeHtml(s.notifyEmails.join(', '))}</p>`),
  });
  return res.ok ? success(`Mail de prueba enviado a ${s.notifyEmails.join(', ')}.`) : fail(`No se pudo enviar: ${res.reason === 'error' ? res.message : 'servidor de correo sin configurar'}`);
}
