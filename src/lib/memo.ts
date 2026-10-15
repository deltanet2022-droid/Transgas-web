import 'server-only';

/**
 * Caché en memoria de consultas del sitio público.
 * Evita ir a la base en cada visita (las páginas se arman casi instantáneamente) y se vacía
 * apenas alguien guarda algo desde el CRM, así los cambios se ven al instante. Si la app corre
 * en más de un proceso, cada uno lo renueva solo a los pocos segundos (TTL).
 */
type Entry = { at: number; value: Promise<unknown> };

const g = globalThis as unknown as { __transgasMemo?: Map<string, Entry> };
const store: Map<string, Entry> = (g.__transgasMemo ??= new Map());

export const MEMO_TTL_MS = 30_000;

export function memo<T>(key: string, fn: () => Promise<T>, ttlMs = MEMO_TTL_MS): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as Promise<T>;
  const value = fn();
  if (store.size >= 300) store.clear(); // tope: URLs inventadas (/blog/xyz) no pueden llenar la memoria
  store.set(key, { at: Date.now(), value });
  // Si falla, no dejamos el error guardado: el próximo pedido reintenta.
  value.catch(() => {
    if (store.get(key)?.value === value) store.delete(key);
  });
  return value;
}

export function clearMemo() {
  store.clear();
}
