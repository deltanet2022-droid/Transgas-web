import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

/**
 * Servidor de correo (SMTP). Se carga desde el CRM → Configuración; la contraseña se guarda
 * cifrada (AES-256-GCM) y nunca vuelve al navegador. Si en el CRM no se cargó nada, se usan las
 * variables de entorno SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / MAIL_FROM (si existen).
 */
export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  /** Remitente, ej. "Transgas <no-responder@transgas.com.ar>". */
  from: string;
}

interface Stored {
  host: string;
  port: number;
  user: string;
  from: string;
  passEnc: string;
}

export interface SmtpSummary {
  configured: boolean;
  source: 'crm' | 'env' | null;
  host: string;
  port: number;
  user: string;
  from: string;
}

const KEY = 'smtp';

// ── Cifrado de la contraseña ────────────────────────────────────────────────
function secretKey(): Buffer {
  const secret = process.env.APP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!secret) throw new Error('Falta APP_SECRET (o SUPABASE_SERVICE_ROLE_KEY) para cifrar la contraseña del correo.');
  return createHash('sha256').update(`transgas-smtp:${secret}`).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', secretKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64'), cipher.getAuthTag().toString('base64'), enc.toString('base64')].join(':');
}

export function decryptSecret(payload: string): string | null {
  try {
    const [v, iv, tag, enc] = payload.split(':');
    if (v !== 'v1') return null;
    const decipher = createDecipheriv('aes-256-gcm', secretKey(), Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([decipher.update(Buffer.from(enc, 'base64')), decipher.final()]).toString('utf8');
  } catch {
    return null; // cambió la clave secreta o el dato está dañado: hay que volver a cargar la contraseña
  }
}

// ── Lectura / escritura ─────────────────────────────────────────────────────
const isSecure = (port: number) => port === 465;

async function readStored(): Promise<Stored | null> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: KEY } });
    const v = row?.value as Partial<Stored> | null | undefined;
    if (v && v.host && v.user && v.passEnc) return { host: v.host, port: Number(v.port) || 465, user: v.user, from: v.from ?? '', passEnc: v.passEnc };
  } catch (e) {
    console.error('[smtp] no se pudo leer la configuración de correo', e);
  }
  return null;
}

function fromEnv(): SmtpConfig | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  return {
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : isSecure(port),
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: process.env.MAIL_FROM || `Transgas <${SMTP_USER}>`,
  };
}

let cached: { at: number; value: SmtpConfig | null; source: 'crm' | 'env' | null } | null = null;
const TTL_MS = 15_000;

export function invalidateSmtpCache() {
  cached = null;
}

async function load() {
  if (cached && Date.now() - cached.at < TTL_MS) return cached;
  let value: SmtpConfig | null = null;
  let source: 'crm' | 'env' | null = null;
  const stored = await readStored();
  if (stored) {
    const pass = decryptSecret(stored.passEnc);
    if (pass) {
      value = { host: stored.host, port: stored.port, secure: isSecure(stored.port), user: stored.user, pass, from: stored.from || `Transgas <${stored.user}>` };
      source = 'crm';
    }
  }
  if (!value) {
    value = fromEnv();
    source = value ? 'env' : null;
  }
  cached = { at: Date.now(), value, source };
  return cached;
}

/** Configuración de correo vigente (la del CRM; si no hay, la de las variables de entorno). */
export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  return (await load()).value;
}

export async function isMailConfigured(): Promise<boolean> {
  return (await getSmtpConfig()) !== null;
}

/** Datos para mostrar en el CRM (sin la contraseña). */
export async function getSmtpSummary(): Promise<SmtpSummary> {
  const { value, source } = await load();
  const stored = await readStored();
  return {
    configured: !!value,
    source,
    host: value?.host ?? stored?.host ?? 'smtp.hostinger.com',
    port: value?.port ?? stored?.port ?? 465,
    user: value?.user ?? stored?.user ?? '',
    from: value?.from ?? stored?.from ?? '',
  };
}

export async function saveSmtp(input: { host: string; port: number; user: string; from: string; pass: string | null }): Promise<void> {
  const current = await readStored();
  let passEnc = current?.passEnc ?? '';
  if (input.pass) passEnc = encryptSecret(input.pass);
  if (!passEnc) throw new Error('Falta la contraseña de la casilla.');
  const value: Stored = { host: input.host, port: input.port, user: input.user, from: input.from, passEnc };
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: value as unknown as Prisma.InputJsonValue },
    create: { key: KEY, value: value as unknown as Prisma.InputJsonValue },
  });
  invalidateSmtpCache();
}

/** Quita la configuración del CRM (vuelve a las variables de entorno, si existen). */
export async function clearSmtp(): Promise<void> {
  await prisma.setting.delete({ where: { key: KEY } }).catch(() => null);
  invalidateSmtpCache();
}
