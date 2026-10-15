import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Una sola instancia (y un solo pool de conexiones) por proceso, también en producción:
// Next puede cargar este módulo desde varias rutas y cada copia abriría conexiones propias.
globalForPrisma.prisma = prisma;

/**
 * Ejecuta una consulta pública y devuelve `fallback` si la base no responde,
 * para que una caída de la DB no tire abajo todo el sitio. El error queda en logs.
 */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('[db] consulta fallida:', error);
    return fallback;
  }
}
