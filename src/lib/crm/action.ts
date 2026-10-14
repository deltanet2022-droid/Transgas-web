import type { ZodError } from 'zod';
import { revalidatePath } from 'next/cache';

/** Resultado que devuelven las Server Actions de formularios del CRM. */
export type ActionState = { ok?: boolean; error?: string; message?: string } | null;

export const fail = (error: string): ActionState => ({ error });
export const success = (message = 'Cambios guardados.'): ActionState => ({ ok: true, message });

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

/** Limpia el caché del router para que listados y dashboard muestren los cambios. */
export function refreshCrm() {
  revalidatePath('/crm', 'layout');
}
