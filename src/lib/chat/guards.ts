import { normalize } from './normalize';

/**
 * Detecta si la persona está compartiendo datos que el chat NUNCA debe recibir
 * (tarjetas, CBU, contraseñas). Corre ANTES del motor y es independiente de él,
 * así que sigue protegiendo aunque más adelante se cambie el engine.
 */
export function containsSensitiveData(message: string): boolean {
  const norm = normalize(message);
  const digitsOnly = message.replace(/[\s.-]/g, '');

  if (/\d{13,19}/.test(digitsOnly) && !/[a-z]/i.test(digitsOnly.replace(/\d/g, ''))) return true; // nº de tarjeta
  if (/\b\d{22}\b/.test(digitsOnly)) return true; // CBU
  if (/(?:\d[\s.-]?){13,19}/.test(message) && /(tarjeta|visa|master|cvv|vencimiento)/.test(norm)) return true;
  if (/(contrasena|clave|password|pin|cvv|cbu|tarjeta)/.test(norm) && /\d{4,}/.test(norm.replace(/\s/g, ''))) return true;
  if (/(mi|la|su) (contrasena|clave|password|pin) (es|:)/.test(norm)) return true;
  return false;
}

export const SENSITIVE_REPLY =
  'Por tu seguridad, no compartas por acá contraseñas, datos de tarjeta ni CBU: el asistente nunca los pide ni los guarda. ' +
  'Si necesitás gestionar tu cuenta o un pago, hacelo desde CoopOnline o comunicate con atención al cliente.';

export const SENSITIVE_PLACEHOLDER = '[Mensaje omitido: contenía datos sensibles]';
