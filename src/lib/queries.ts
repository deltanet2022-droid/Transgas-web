import 'server-only';
import type { Cooperative, LicensedInstaller, News, ServiceStatus, Tariff, TariffDocument } from '@prisma/client';
import { prisma, safe } from '@/lib/db';
import { memo } from '@/lib/memo';

// Consultas del sitio público. Todas devuelven un valor vacío si la base no responde y se guardan
// unos segundos en memoria (ver lib/memo.ts): el CRM vacía ese caché apenas se guarda un cambio.

export const getCurrentTariffDocument = (): Promise<TariffDocument | null> =>
  memo('tariffDoc', () => safe(() => prisma.tariffDocument.findFirst({ where: { isCurrent: true }, orderBy: { validFrom: 'desc' } }), null));

export const getActiveTariffs = (): Promise<Tariff[]> =>
  memo('tariffs', () => safe(() => prisma.tariff.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }] }), []));

export const getCooperatives = (): Promise<Cooperative[]> =>
  memo('coops', () => safe(() => prisma.cooperative.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }), []));

export const getActiveInstallers = (): Promise<LicensedInstaller[]> =>
  memo('installers', () =>
    safe(() => prisma.licensedInstaller.findMany({ where: { active: true }, orderBy: [{ locality: 'asc' }, { name: 'asc' }] }), []),
  );

/** Estado del servicio: en curso primero, luego programados, luego resueltos; dentro de cada estado, por fecha. */
export const getServiceStatusList = (): Promise<ServiceStatus[]> =>
  memo('serviceStatusList', async () => {
    const rows = await safe(() => prisma.serviceStatus.findMany({ orderBy: { startsAt: 'desc' } }), [] as ServiceStatus[]);
    const rank = { EN_CURSO: 0, PROGRAMADO: 1, RESUELTO: 2 } as const;
    return rows.sort((a, b) => {
      if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
      // Próximos avisos: el más cercano primero. Resueltos: el más reciente primero.
      return a.status === 'RESUELTO' ? b.startsAt.getTime() - a.startsAt.getTime() : a.startsAt.getTime() - b.startsAt.getTime();
    });
  });

export const hasActiveServiceAlert = (): Promise<boolean> =>
  memo('serviceAlert', async () => (await safe(() => prisma.serviceStatus.count({ where: { status: 'EN_CURSO' } }), 0)) > 0);

export const getPublishedNews = (take?: number): Promise<News[]> =>
  memo(`news:${take ?? 'all'}`, () =>
    safe(
      () =>
        prisma.news.findMany({
          where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
          orderBy: { publishedAt: 'desc' },
          take,
        }),
      [],
    ),
  );

export const getPublishedNewsBySlug = (slug: string): Promise<News | null> =>
  memo(`news-slug:${slug}`, () =>
    safe(() => prisma.news.findFirst({ where: { slug, status: 'PUBLISHED', publishedAt: { lte: new Date() } } }), null),
  );
