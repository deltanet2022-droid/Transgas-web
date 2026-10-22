'use server';

import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { escapeHtml, explainMailError, layoutEmail, mailConfigured, sendMail } from '@/lib/mail';
import { getSettings, invalidateSettingsCache, saveSettings, type SiteSettings } from '@/lib/settings';
import { getSmtpSummary, saveSmtp } from '@/lib/smtp';
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

const smtpSchema = z.object({
  host: z
    .string()
    .min(3, 'Ingresá el servidor de salida (ej. mail.transgas.com.ar).')
    .max(120)
    .regex(/^[a-z0-9.-]+$/i, 'El servidor solo puede tener letras, números, puntos y guiones (sin https://).'),
  port: z.coerce.number().int().refine((p) => p === 465 || p === 587, 'El puerto tiene que ser 465 (SSL) o 587.'),
  // Casilla de correo (correo completo) o, en servicios de envío como Brevo/Resend, el usuario que indique el servicio.
  user: z.string().min(3, 'Ingresá el usuario del servidor de correo.').max(160).regex(/^\S+$/, 'El usuario no puede tener espacios.'),
  from: z.string().max(200),
  pass: z.string().max(200),
});

/** Guarda el servidor de correo (la contraseña se cifra). Con la contraseña vacía conserva la ya guardada. */
export async function saveSmtpSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = smtpSchema.safeParse({
    host: formString(fd, 'smtpHost').toLowerCase(),
    port: formString(fd, 'smtpPort') || '465',
    user: formString(fd, 'smtpUser').toLowerCase(),
    from: formString(fd, 'smtpFrom'),
    pass: typeof fd.get('smtpPass') === 'string' ? (fd.get('smtpPass') as string) : '',
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const d = parsed.data;
  if (!d.from && !d.user.includes('@')) return fail('Completá el campo «Remitente» (por ejemplo: Transgas <no-responder@transgas.com.ar>): el usuario de este servicio no es un correo.');
  const previous = await getSmtpSummary();
  const hasStoredPass = previous.source === 'crm';
  if (!d.pass && !hasStoredPass) return fail('Ingresá la contraseña de la casilla de correo.');
  try {
    await saveSmtp({ host: d.host, port: d.port, user: d.user, from: d.from || `Transgas <${d.user}>`, pass: d.pass || null });
  } catch (e) {
    console.error(e);
    return fail('No se pudo guardar el servidor de correo. Revisá que el servidor tenga configurada la clave secreta (SUPABASE_SERVICE_ROLE_KEY o APP_SECRET).');
  }
  refreshCrm();
  return success('Servidor de correo guardado. Probalo con el botón "Enviar mail de prueba".');
}

/** Envía un mail de prueba a los destinatarios guardados (verifica que el SMTP funcione). */
export async function sendTestEmail(): Promise<ActionState> {
  await requireAdmin();
  invalidateSettingsCache();
  const s = await getSettings();
  if (!(await mailConfigured())) return fail('Todavía no se configuró el servidor de correo. Completá y guardá el formulario "Servidor de correo" de esta página.');
  if (!s.notifyEmails.length) return fail('Primero guardá al menos un correo de aviso.');
  // Tope de 30 segundos: si el servidor de correo no contesta, se muestra el motivo en vez de quedar colgado.
  const timeout = new Promise<{ ok: false; reason: 'error'; code: string; message: string }>((resolve) =>
    setTimeout(() => resolve({ ok: false, reason: 'error', code: 'ETIMEDOUT', message: 'timeout: el servidor de correo no respondió en 30 segundos' }), 30_000),
  );
  const res = await Promise.race([timeout, sendMail({
    to: s.notifyEmails,
    subject: 'Prueba de avisos — Transgas',
    html: layoutEmail('Prueba de avisos', `<p>Si recibiste este mensaje, los avisos por mail del sitio de Transgas funcionan.</p><p style="color:#607387;font-size:13px">Destinatarios configurados: ${escapeHtml(s.notifyEmails.join(', '))}</p>`),
  })]);
  return res.ok
    ? success(`Mail de prueba enviado a ${s.notifyEmails.join(', ')}. Si no lo ves en unos minutos, revisá la carpeta de spam.`)
    : fail(res.reason === 'error' ? `No se pudo enviar. ${explainMailError(res.message, res.code)}` : 'Todavía no se configuró el servidor de correo.');
}
