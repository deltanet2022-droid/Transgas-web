export interface PhoneLink {
  label: string;
  tel: string;
}

/**
 * Separa un campo con varios teléfonos ("03385-498420 / 498165", "03463-497233 ó 03463-497079")
 * en enlaces `tel:`. Los números abreviados heredan el código de área del primero.
 */
export function splitPhones(raw: string | null | undefined): PhoneLink[] {
  if (!raw) return [];
  const parts = raw
    .split(/\s*(?:\/|,|;|\bó\b|\bo\b|\by\b)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
  const area = /^(\d{2,5})-/.exec(parts[0] ?? '')?.[1];
  return parts
    .map((p) => {
      const label = area && /^\d{5,7}$/.test(p) ? `${area}-${p}` : p;
      return { label, tel: label.replace(/[^\d+]/g, '') };
    })
    .filter((p) => p.tel.length >= 6);
}
