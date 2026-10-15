import 'server-only';
import { getSettings } from '@/lib/settings';
import { site } from '@/lib/site';

/**
 * Marcadores simples que se reemplazan por datos vigentes (editables desde el CRM → Configuración).
 * Sirven en el texto de las FAQ, en las páginas editables y en los mails.
 *
 *   {{emergencia}}  teléfono de emergencias      {{suministro}}  falta de suministro
 *   {{telefono}}    atención al cliente          {{horario}}     horario de atención
 *   {{direccion}}   domicilio de Transgas        {{privacidad_email}}  correo para ejercer derechos
 */
export async function fillTokens(text: string): Promise<string> {
  if (!text.includes('{{')) return text;
  const s = await getSettings();
  const map: Record<string, string> = {
    emergencia: s.emergencyPhone,
    suministro: s.supplyPhone,
    telefono: s.attentionPhone,
    horario: site.schedule,
    direccion: site.address,
    privacidad_email: s.privacyEmail || 'el correo de contacto de Transgas',
  };
  return text.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (whole, key: string) => map[key.toLowerCase()] ?? whole);
}
