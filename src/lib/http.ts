/**
 * Lee el JSON de un pedido con un tope de tamaño. Sin tope, cualquiera podría mandar un cuerpo enorme a una ruta
 * pública y agotar la memoria del servidor.
 */
export class BodyTooLargeError extends Error {}

export async function readJsonLimited(req: Request, maxBytes = 64 * 1024): Promise<unknown> {
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > maxBytes) throw new BodyTooLargeError('Pedido demasiado grande');
  if (!req.body) throw new Error('Pedido vacío');

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => null);
      throw new BodyTooLargeError('Pedido demasiado grande');
    }
    chunks.push(value);
  }
  return JSON.parse(new TextDecoder().decode(Buffer.concat(chunks)));
}
