import type { ZodError } from 'zod';
import { revalidatePath } from 'next/cache';
import { clearMemo } from '@/lib/memo';
import { invalidateSettingsCache } from '@/lib/settings';

/**
 * Resultado que devuelven las Server Actions de formularios del CRM.
 * `redirectTo`: después de guardar, el formulario navega a esa ruta desde el navegador (más rápido que
 * un redirect() del servidor, que tendría que armar la página de destino antes de contestar).
 */
export type ActionState = { ok?: boolean; error?: string; message?: string; redirectTo?: string } | null;

export const fail = (error: string): ActionState => ({ error });
export const success = (message = 'Cambios guardados.'): ActionState => ({ ok: true, message });
/** Guardado correcto y vuelta al listado. */
export const saved = (redirectTo: string, message = 'Guardado.'): ActionState => ({ ok: true, message, redirectTo });

export function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

export function formList(fd: FormData, key: string): string[] {
  return fd
    .getAll(key)
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function formFile(fd: FormData, key: string): File | null {
  const v = fd.get(key);
  return v instanceof File && v.size > 0 ? v : null;
}

export function firstZodError(e: ZodError): string {
  return e.issues[0]?.message ?? 'Datos inválidos.';
}

/**
 * Después de guardar algo: limpia el caché del router del CRM (listados y dashboard) y el caché en
 * memoria del sitio público, para que los cambios se vean al instante en ambos.
 */
export function refreshCrm() {
  clearMemo();
  invalidateSettingsCache();
  revalidatePath('/crm', 'layout');
}
