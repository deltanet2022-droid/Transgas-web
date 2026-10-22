import { getCooperatives } from '@/lib/queries';
import { absUrl, GEO, SEO } from '@/lib/seo';
import { getSettings } from '@/lib/settings';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

/**
 * /llms.txt: resumen del sitio pensado para asistentes de IA (ChatGPT, Claude, Perplexity, Gemini…).
 * Les da, en un solo archivo, quién es Transgas, qué datos son oficiales y dónde está cada tema.
 */
export async function GET() {
  const [s, coops] = await Promise.all([getSettings(), getCooperatives()]);
  const localities = ['General Levalle', ...coops.map((c) => c.name)].join(', ');
  const link = (path: string) => `- [${SEO[path]?.title ?? path}](${absUrl(path)}): ${SEO[path]?.description ?? ''}`;

  const body = `# Transgas

> Transgas (${site.legalName}) distribuye gas natural en el ${GEO.areaLabel} (Argentina) y trabaja junto a una red de cooperativas asociadas. Este sitio es su portal oficial: información para usuarios, tarifas, autogestión de trámites, seguridad y emergencias.

## Datos oficiales
- Nombre: Transgas (Grupo Transgas)
- Dirección: ${site.address}
- Horario de atención: ${site.schedule}
- Teléfono de atención al cliente: ${s.attentionPhone}
- Falta de suministro: ${s.supplyPhone}
- Emergencias (olor a gas, 24 horas): ${s.emergencyPhone}
- Localidades de la red: ${localities}
- Idioma: español (Argentina)
- Gestión de cuenta y facturas: ${site.coopOnlineUrl}

## Ante una emergencia
Si hay olor a gas: no encender fuego ni accionar interruptores, ventilar, cerrar la llave de paso, salir y llamar al ${s.emergencyPhone}.

## Páginas principales
${[
  '/preguntas-frecuentes',
  '/documentos',
  '/tarifas',
  '/tarifas/categorias',
  '/tarifas/tarifa-social',
  '/ayuda/entender-tu-factura',
  '/autogestion',
  '/seguridad',
  '/seguridad/monoxido-de-carbono',
  '/profesionales/gasistas-matriculados',
  '/cooperativas',
  '/estado-del-servicio',
  '/contacto',
  '/blog',
]
  .map(link)
  .join('\n')}

## Más
- [Mapa del sitio](${absUrl('/sitemap.xml')})
- [Política de Privacidad](${absUrl('/privacidad')})
`;

  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
