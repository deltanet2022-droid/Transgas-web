import type { Metadata } from 'next';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { ConversationBadges, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';

export const metadata: Metadata = { title: 'Historial del chatbot' };

const PAGE_SIZE = 25;
const FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'faq', label: 'Respondió FAQ' },
  { value: 'whatsapp', label: 'Derivó a WhatsApp' },
  { value: 'emergency', label: 'Emergencias' },
  { value: 'none', label: 'Sin respuesta' },
];

export default async function ChatHistoryPage(props: { searchParams: Promise<{ f?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const f = searchParams.f ?? '';
  const where: Prisma.ChatConversationWhereInput =
    f === 'faq' ? { matchedFaq: true } : f === 'whatsapp' ? { whatsappHandoff: true } : f === 'emergency' ? { emergency: true } : f === 'none' ? { matchedFaq: false, whatsappHandoff: false, emergency: false } : {};
  const page = Math.max(1, Number.parseInt(searchParams.page ?? '1', 10) || 1);

  const [total, items, stats] = await Promise.all([
    prisma.chatConversation.count({ where }),
    prisma.chatConversation.findMany({
      where,
      orderBy: { lastActivityAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { messages: { where: { role: 'USER' }, orderBy: { createdAt: 'asc' }, take: 1, select: { text: true } }, _count: { select: { messages: true } } },
    }),
    Promise.all([
      prisma.chatConversation.count(),
      prisma.chatConversation.count({ where: { matchedFaq: true } }),
      prisma.chatConversation.count({ where: { whatsappHandoff: true } }),
    ]),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const link = (over: Record<string, string>) => {
    const p = new URLSearchParams({ ...(f ? { f } : {}), ...over });
    return `/crm/chatbot?${p.toString()}`;
  };

  return (
    <>
      <PageTitle title="Historial del chatbot" sub="Conversaciones del asistente: si se respondió con una FAQ o se derivó a WhatsApp." action={{ href: '/crm/chatbot/metricas', label: 'Ver métricas' }} />

      <div className="crm-grid c3" style={{ marginBottom: 16 }}>
        <div className="crm-card stat" style={{ padding: 16 }}>
          <small>Conversaciones</small>
          <strong style={{ fontSize: '1.6rem' }}>{stats[0]}</strong>
        </div>
        <div className="crm-card stat" style={{ padding: 16 }}>
          <small>Respondidas con FAQ</small>
          <strong style={{ fontSize: '1.6rem' }}>{stats[1]}</strong>
        </div>
        <div className="crm-card stat" style={{ padding: 16 }}>
          <small>Derivadas a WhatsApp</small>
          <strong style={{ fontSize: '1.6rem' }}>{stats[2]}</strong>
        </div>
      </div>

      <section className="crm-card">
        <div className="filters">
          {FILTERS.map((x) => (
            <Link key={x.label} href={x.value ? `/crm/chatbot?f=${x.value}` : '/crm/chatbot'} className={`cbtn sm ${f === x.value ? 'p' : 's'}`}>
              {x.label}
            </Link>
          ))}
        </div>
        {items.length === 0 ? (
          <Empty>No hay conversaciones para mostrar.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Primera consulta</th>
                  <th>Mensajes</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(c.lastActivityAt)}</td>
                    <td>
                      <Link href={`/crm/chatbot/${c.id}`}>{c.messages[0]?.text.slice(0, 90) ?? '(sin mensajes)'}</Link>
                    </td>
                    <td>{c._count.messages}</td>
                    <td>
                      <ConversationBadges c={c} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, alignItems: 'center' }}>
            {page > 1 && (
              <Link className="cbtn s sm" href={link({ page: String(page - 1) })}>
                ← Anterior
              </Link>
            )}
            <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
              Página {page} de {pages}
            </span>
            {page < pages && (
              <Link className="cbtn s sm" href={link({ page: String(page + 1) })}>
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
