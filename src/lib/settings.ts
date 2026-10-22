import 'server-only';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { site } from '@/lib/site';

export interface AlertBanner {
  enabled: boolean;
  message: string;
  linkLabel: string;
  linkUrl: string;
  tone: 'info' | 'danger';
  /** Fecha (AAAA-MM-DD) hasta la que se muestra; vacío = hasta que se desactive. */
  until: string;
}

export interface SiteSettings {
  emergencyPhone: string;
  supplyPhone: string;
  attentionPhone: string;
  alertBanner: AlertBanner;
  /** Casillas que reciben el aviso de cada contacto nuevo. */
  notifyEmails: string[];
  /** Correo de contacto para ejercer derechos sobre datos personales (Ley 25.326). */
  privacyEmail: string;
  /** Cuántos días antes del vencimiento se envía el aviso automático a suscriptores. */
  noticeDaysBefore: number;
}

const KEY = 'site';

export const telDigits = (display: string) => display.replace(/[^\d+]/g, '');

function defaults(): SiteSettings {
  return {
    emergencyPhone: process.env.EMERGENCY_PHONE_DISPLAY || site.emergencyPhone,
    supplyPhone: site.supplyPhone,
    attentionPhone: site.phone,
    alertBanner: { enabled: false, message: '', linkLabel: '', linkUrl: '', tone: 'danger', until: '' },
    // Por defecto, los formularios llegan a gerencia. Se puede cambiar en el CRM → Configuración.
    notifyEmails: (process.env.NOTIFY_EMAILS || 'gerencia@transgas.com.ar')
      .split(/[,;\s]+/)
      .map((e) => e.trim())
      .filter(Boolean),
    privacyEmail: process.env.PRIVACY_EMAIL ?? '',
    noticeDaysBefore: 3,
  };
}

let cache: { at: number; value: SiteSettings } | null = null;
const TTL_MS = 15_000;

export function invalidateSettingsCache() {
  cache = null;
}

/** Configuración vigente: lo guardado en el CRM pisa los valores por defecto (variables de entorno / código). */
export async function getSettings(): Promise<SiteSettings> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  const base = defaults();
  let stored: Partial<SiteSettings> = {};
  try {
    const row = await prisma.setting.findUnique({ where: { key: KEY } });
    stored = (row?.value ?? {}) as Partial<SiteSettings>;
  } catch (e) {
    console.error('[settings] no se pudo leer la configuración, se usan los valores por defecto', e);
  }
  const value: SiteSettings = {
    ...base,
    ...stored,
    alertBanner: { ...base.alertBanner, ...(stored.alertBanner ?? {}) },
    notifyEmails: Array.isArray(stored.notifyEmails) ? stored.notifyEmails : base.notifyEmails,
  };
  cache = { at: Date.now(), value };
  return value;
}

export async function saveSettings(next: SiteSettings): Promise<void> {
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: next as unknown as Prisma.InputJsonValue },
    create: { key: KEY, value: next as unknown as Prisma.InputJsonValue },
  });
  invalidateSettingsCache();
}

/** ¿El banner de aviso está activo hoy? */
export function isBannerActive(b: AlertBanner, today = new Date()): boolean {
  if (!b.enabled || !b.message.trim()) return false;
  if (!b.until) return true;
  return today.toISOString().slice(0, 10) <= b.until;
}
