import type { Cooperative, LicensedInstaller, News, ServiceStatus, Tariff, TariffDocument } from '@prisma/client';
import { prisma, safe } from '@/lib/db';

// Consultas del sitio público. Todas devuelven un valor vacío si la base no responde.

export const getCurrentTariffDocument = (): Promise<TariffDocument | null> =>
  safe(() => prisma.tariffDocument.findFirst({ where: { isCurrent: true }, orderBy: { validFrom: 'desc' } }), null);

export const getActiveTariffs = (): Promise<Tariff[]> =>
  safe(() => prisma.tariff.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }] }), []);

export const getCooperatives = (): Promise<Cooperative[]> =>
  safe(() => prisma.cooperative.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }), []);

export const getActiveInstallers = (): Promise<LicensedInstaller[]> =>
  safe(() => prisma.licensedInstaller.findMany({ where: { active: true }, orderBy: [{ locality: 'asc' }, { name: 'asc' }] }), []);

/** Estado del servicio: en curso primero, luego programados, luego resueltos; dentro de cada estado, por fecha. */
export async function getServiceStatusList(): Promise<ServiceStatus[]> {
  const rows = await safe(() => prisma.serviceStatus.findMany({ orderBy: { startsAt: 'desc' } }), [] as ServiceStatus[]);
  const rank = { EN_CURSO: 0, PROGRAMADO: 1, RESUELTO: 2 } as const;
  return rows.sort((a, b) => {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    // Próximos avisos: el más cercano primero. Resueltos: el más reciente primero.
    return a.status === 'RESUELTO' ? b.startsAt.getTime() - a.startsAt.getTime() : a.startsAt.getTime() - b.startsAt.getTime();
  });
}

export const hasActiveServiceAlert = async (): Promise<boolean> =>
  (await safe(() => prisma.serviceStatus.count({ where: { status: 'EN_CURSO' } }), 0)) > 0;

export const getPublishedNews = (take?: number): Promise<News[]> =>
  safe(
    () =>
      prisma.news.findMany({
        where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
        orderBy: { publishedAt: 'desc' },
        take,
      }),
    [],
  );

export const getPublishedNewsBySlug = (slug: string): Promise<News | null> =>
  safe(
    () => prisma.news.findFirst({ where: { slug, status: 'PUBLISHED', publishedAt: { lte: new Date() } } }),
    null,
  );

/** Filas del cuadro resumido de la home: agrupa subcategorías como en el diseño de referencia. */
export function groupTariffsForHome(tariffs: Tariff[]): { type: string; codes: string }[] {
  const groups: { key: string; type: string; codes: string[] }[] = [];
  for (const t of tariffs) {
    const key = t.type === 'SGP' ? 'SGP' : /^R[12]/.test(t.code) ? 'R12' : 'R3';
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, type: t.type === 'SGP' ? 'SG-P' : 'Residencial', codes: [] };
      groups.push(g);
    }
    g.codes.push(t.code);
  }
  return groups.map((g) => ({ type: g.type, codes: g.codes.join(' · ') }));
}
