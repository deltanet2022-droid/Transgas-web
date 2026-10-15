import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { site } from '@/lib/site';
import { getSmtpConfig, isMailConfigured, type SmtpConfig } from '@/lib/smtp';

/**
 * Envío de mails por SMTP (por ejemplo, el correo del dominio en Hostinger).
 * El servidor se configura desde el CRM → Configuración (ver lib/smtp.ts); como alternativa
 * se pueden usar las variables SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y MAIL_FROM.
 */
export const mailConfigured = isMailConfigured;

let transporter: { sig: string; t: Transporter } | null = null;
function getTransporter(c: SmtpConfig): Transporter {
  const sig = `${c.host}|${c.port}|${c.secure}|${c.user}|${c.pass}`;
  if (!transporter || transporter.sig !== sig) {
    transporter = {
      sig,
      t: nodemailer.createTransport({
        host: c.host,
        port: c.port,
        secure: c.secure,
        auth: { user: c.user, pass: c.pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      }),
    };
  }
  return transporter.t;
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
  const config = await getSmtpConfig();
  if (!config) return { ok: false, reason: 'not_configured' };
  try {
    await getTransporter(config).sendMail({
      from: config.from,
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
