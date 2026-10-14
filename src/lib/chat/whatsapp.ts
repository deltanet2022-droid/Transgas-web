/** https://wa.me/<numero>?text=<resumen> (solo dígitos en el número). */
export function buildWhatsAppUrl(number: string | undefined, summary: string): string | null {
  const digits = (number ?? '').replace(/\D/g, '');
  if (!digits) return null;
  const text = summary.trim()
    ? `Hola Transgas, te escribo desde la web. Mi consulta: ${summary.trim()}`
    : 'Hola Transgas, te escribo desde la web y necesito ayuda.';
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
