import 'server-only';
import { escapeHtml, layoutEmail, mailConfigured, sendMail, type MailResult } from '@/lib/mail';
import { extraFieldLabel, LEAD_TYPE_LABEL, type LeadTypeKey } from '@/lib/leads/config';
import { getSettings } from '@/lib/settings';
import { site } from '@/lib/site';

interface NewLead {
  id: string;
  type: LeadTypeKey;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  extraData: Record<string, unknown>;
}

/** Avisa por mail al equipo que entró un contacto nuevo (destinatarios: CRM → Configuración). */
export async function notifyNewLead(lead: NewLead): Promise<MailResult | { ok: false; reason: 'no_recipients' }> {
  const settings = await getSettings();
  if (!settings.notifyEmails.length) return { ok: false, reason: 'no_recipients' };
  if (!(await mailConfigured())) return { ok: false, reason: 'not_configured' };

  const label = LEAD_TYPE_LABEL[lead.type];
  const rows: [string, string][] = [
    ['Tipo', label],
    ['Nombre', lead.name],
    ['Correo', lead.email ?? '—'],
    ['Teléfono', lead.phone ?? '—'],
    ...Object.entries(lead.extraData)
      .filter(([k]) => !k.startsWith('privacidad'))
      .map(([k, v]): [string, string] => [extraFieldLabel(lead.type, k), typeof v === 'boolean' ? (v ? 'Sí' : 'No') : String(v)]),
  ];
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#607387;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`)
    .join('');
  const message = lead.message
    ? `<p style="margin:14px 0 4px;color:#607387">Mensaje</p><div style="background:#f4f8fb;border-radius:10px;padding:12px;white-space:pre-wrap">${escapeHtml(lead.message)}</div>`
    : '';
  const url = `${site.url}/crm/contactos/${lead.id}`;
  const html = layoutEmail(
    `Nuevo contacto: ${label}`,
    `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px">${table}</table>${message}
     <p style="margin:22px 0 0"><a href="${escapeHtml(url)}" style="background:#0b6fb8;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:999px;font-weight:bold;display:inline-block">Abrir en el CRM</a></p>`,
    'Este aviso se envía automáticamente cuando llega un contacto por el sitio. Los destinatarios se editan en CRM → Configuración.',
  );

  return sendMail({ to: settings.notifyEmails, subject: `Nuevo contacto: ${label} — ${lead.name}`, html });
}
