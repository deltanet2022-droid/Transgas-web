import { z } from 'zod';

/** Política de contraseñas del CRM: mínimo 10 caracteres, con letras y números. */
export const passwordSchema = z
  .string()
  .min(10, 'La contraseña debe tener al menos 10 caracteres.')
  .max(72, 'La contraseña es demasiado larga (máx. 72).')
  .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), 'La contraseña debe incluir letras y números.');
