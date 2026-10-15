import { JsonLd } from '@/components/seo/JsonLd';
import { getCooperatives } from '@/lib/queries';
import { organizationGraph } from '@/lib/schema';
import { getSettings } from '@/lib/settings';

/** Datos de la organización (nombre, logo, dirección, horarios, teléfonos, zona de servicio) en todas las páginas del sitio. */
export async function SiteSchema() {
  const [settings, coops] = await Promise.all([getSettings(), getCooperatives()]);
  return <JsonLd data={organizationGraph(settings, coops)} />;
}
