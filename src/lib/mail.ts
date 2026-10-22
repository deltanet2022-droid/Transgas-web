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

export type MailResult = { ok: true } | { ok: false; reason: 'not_configured' | 'error'; message?: string; code?: string };

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
    const code = (e as { code?: string })?.code;
    console.error('[mail] no se pudo enviar:', code, message);
    return { ok: false, reason: 'error', message, code };
  }
}

/** Traduce el error técnico del servidor de correo a una explicación y un consejo en castellano. */
export function explainMailError(message = '', code = ''): string {
  const m = message.toLowerCase();
  const c = code.toUpperCase();
  let hint: string;
  if (c === 'EAUTH' || /invalid login|authentication|username and password not accepted|application-specific password|535|534|5\.7\.8|5\.7\.9/.test(m)) {
    hint =
      'El servidor rechazó el usuario o la contraseña. Si es Gmail: hay que tener activada la verificación en dos pasos y usar una «contraseña de aplicación» de 16 letras (no la contraseña normal), y el usuario es la dirección completa de Gmail.';
  } else if (c === 'ENOTFOUND' || c === 'EDNS' || /getaddrinfo/.test(m)) {
    hint = 'El nombre del servidor no existe. Revisá que esté bien escrito (por ejemplo smtp.gmail.com).';
  } else if (c === 'ETIMEDOUT' || c === 'ECONNREFUSED' || c === 'ENETUNREACH' || c === 'EHOSTUNREACH' || /timed? ?out|timeout/.test(m)) {
    hint =
      'No se pudo conectar con el servidor de correo (no respondió a tiempo). Probá con el otro puerto (465 ↔ 587). Si sigue igual, puede que el hosting esté bloqueando las conexiones de salida de correo: consultale a Hostinger si permite SMTP externo desde la app.';
  } else if (c === 'ECONNRESET' || c === 'ESOCKET' || /wrong version number|tls|ssl|socket|econnreset/.test(m)) {
    hint = 'El servidor cortó la conexión segura. Probá con el otro puerto (465 ↔ 587); si no funciona, el servidor de correo tiene mal configurado el cifrado (TLS).';
  } else if (c === 'EENVELOPE' || /relay|recipient|rejected|550|553|554/.test(m)) {
    hint = 'El servidor aceptó la conexión pero rechazó el mensaje (remitente o destinatario no permitido). Revisá que el «Remitente» coincida con la casilla del usuario.';
  } else {
    hint = 'No se pudo enviar. Revisá servidor, puerto, usuario y contraseña.';
  }
  return `${hint} (Detalle técnico: ${code ? code + ' · ' : ''}${message.slice(0, 160)})`;
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
