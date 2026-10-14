import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackLink, ConversationBadges, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';

export const metadata: Metadata = { title: 'Conversación del chatbot' };

const KIND_LABEL: Record<string, string> = {
  faq: 'Respuesta de FAQ',
  clarify: 'Repregunta',
  emergency: 'Emergencia (0800 primero)',
  handoff: 'Derivación a WhatsApp',
  blocked: 'Dato sensible bloqueado',
  error: 'Error del motor',
};

export default async function ChatDetailPage({ params }: { params: { id: string } }) {
  const conv = await prisma.chatConversation.findUnique({ where: { id: params.id }, include: { messages: { orderBy: { createdAt: 'asc' } } } });
  if (!conv) notFound();

  const faqIds = [...new Set(conv.messages.map((m) => (m.meta as { faqId?: string } | null)?.faqId).filter((x): x is string => !!x))];
  const faqs = faqIds.length ? await prisma.faq.findMany({ where: { id: { in: faqIds } }, select: { id: true, question: true } }) : [];

  return (
    <>
      <BackLink href="/crm/chatbot">Historial del chatbot</BackLink>
      <PageTitle title="Conversación" sub={`Iniciada el ${formatDateTime(conv.startedAt)} · última actividad ${formatDateTime(conv.lastActivityAt)}`} action={<ConversationBadges c={conv} />} />
      <section className="crm-card" style={{ maxWidth: 820 }}>
        <div className="chatlog">
          {conv.messages.map((m) => {
            const meta = m.meta as { kind?: string; faqId?: string } | null;
            const faq = meta?.faqId ? faqs.find((f) => f.id === meta.faqId) : null;
            return (
              <div key={m.id} className={`m ${m.role === 'USER' ? 'u' : 'b'}`}>
                {m.text}
                <small>
                  {m.role === 'USER' ? 'Usuario' : 'Bot'} · {formatDateTime(m.createdAt)}
                  {meta?.kind && ` · ${KIND_LABEL[meta.kind] ?? meta.kind}`}
                  {faq && ` · FAQ: ${faq.question}`}
                </small>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
