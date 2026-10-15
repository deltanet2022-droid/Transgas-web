import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { site } from '@/lib/site';

/**
 * Envío de mails por SMTP (por ejemplo, el correo del dominio en Hostinger).
 *
 *   SMTP_HOST, SMTP_PORT (465 = SSL, 587 = STARTTLS), SMTP_USER, SMTP_PASS
 *   MAIL_FROM  →  "Transgas <no-responder@transgas.com.ar>"
 */
export function mailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;
function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

export interface MailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
}

export type MailResult = { ok: true } | { ok: false; reason: 'not_configured' | 'error'; message?: string };

export async function sendMail(input: MailInput): Promise<MailResult> {
  if (!mailConfigured()) return { ok: false, reason: 'not_configured' };
  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || `Transgas <${process.env.SMTP_USER}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? input.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      headers: input.headers,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[mail] no se pudo enviar:', message);
    return { ok: false, reason: 'error', message };
  }
}

export const escapeHtml = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Plantilla simple y compatible con clientes de mail (estilos en línea). */
export function layoutEmail(title: string, bodyHtml: string, footerHtml = ''): string {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f4f8fb;font-family:Arial,Helvetica,sans-serif;color:#14293d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8fb;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d7e4ee">
<tr><td style="background:#0b2a4e;padding:18px 24px;color:#ffffff;font-size:18px;font-weight:bold">Transgas</td></tr>
<tr><td style="padding:24px"><h1 style="margin:0 0 14px;font-size:20px;color:#0b2a4e">${escapeHtml(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="padding:16px 24px;background:#f4f8fb;font-size:12px;color:#607387">${footerHtml || `${escapeHtml(site.legalName)}<br>${escapeHtml(site.address)}`}</td></tr>
</table></td></tr></table></body></html>`;
}
