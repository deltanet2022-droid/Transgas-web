import type { Metadata } from 'next';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { BackLink, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Métricas del chatbot' };

const PERIODS = [7, 30, 90] as const;

export default async function ChatMetricsPage(props: { searchParams: Promise<{ d?: string }> }) {
  const searchParams = await props.searchParams;
  const days = PERIODS.find((p) => String(p) === searchParams.d) ?? 30;
  const since = new Date(Date.now() - days * 86_400_000);

  const [conversations, userMessages, kinds, topFaqs, unanswered] = await Promise.all([
    prisma.chatConversation.count({ where: { startedAt: { gte: since } } }),
    prisma.chatMessage.count({ where: { role: 'USER', createdAt: { gte: since } } }),
    prisma.$queryRaw<{ kind: string | null; n: number }[]>(Prisma.sql`
      SELECT meta->>'kind' AS kind, count(*)::int AS n
      FROM chat_messages WHERE role = 'BOT' AND "createdAt" >= ${since} GROUP BY 1`),
    prisma.$queryRaw<{ faq_id: string; n: number }[]>(Prisma.sql`
      SELECT meta->>'faqId' AS faq_id, count(*)::int AS n
      FROM chat_messages
      WHERE role = 'BOT' AND meta->>'kind' = 'faq' AND meta->>'faqId' IS NOT NULL AND "createdAt" >= ${since}
      GROUP BY 1 ORDER BY 2 DESC LIMIT 12`),
    // Mensajes del usuario cuya respuesta fue una repregunta o una derivación por no entender.
    prisma.$queryRaw<{ text: string; n: number; last: Date }[]>(Prisma.sql`
      SELECT lower(m.text) AS text, count(*)::int AS n, max(m."createdAt") AS last
      FROM chat_messages m
      JOIN LATERAL (
        SELECT b.meta FROM chat_messages b
        WHERE b."conversationId" = m."conversationId" AND b.role = 'BOT' AND b."createdAt" >= m."createdAt"
        ORDER BY b."createdAt" LIMIT 1
      ) nb ON true
      WHERE m.role = 'USER' AND m."createdAt" >= ${since}
        AND (nb.meta->>'kind' = 'clarify' OR nb.meta->>'handoff' = 'no_match')
        AND left(m.text, 1) <> '['
      GROUP BY lower(m.text) ORDER BY 2 DESC, 3 DESC LIMIT 40`),
  ]);

  const faqs = topFaqs.length ? await prisma.faq.findMany({ where: { id: { in: topFaqs.map((t) => t.faq_id) } }, select: { id: true, question: true } }) : [];
  const kindN = (k: string) => kinds.find((x) => x.kind === k)?.n ?? 0;
  const answered = kindN('faq');
  const clarify = kindN('clarify');
  const handoffs = kindN('handoff');
  const emergencies = kindN('emergency');
  const botTotal = kinds.reduce((a, k) => a + k.n, 0);
  const pct = (n: number) => (botTotal ? `${Math.round((n / botTotal) * 100)}%` : '—');
  const maxFaq = Math.max(1, ...topFaqs.map((t) => t.n));

  return (
    <>
      <BackLink href="/crm/chatbot">Historial del chatbot</BackLink>
      <PageTitle title="Métricas del chatbot" sub="Qué pregunta la gente y qué no supo responder el asistente, para ir sumando preguntas frecuentes." />

      <div className="filters">
        {PERIODS.map((p) => (
          <Link key={p} href={`/crm/chatbot/metricas?d=${p}`} className={`cbtn sm ${p === days ? 'p' : 's'}`}>
            Últimos {p} días
          </Link>
        ))}
      </div>

      <div className="crm-grid c4" style={{ marginBottom: 16 }}>
        <div className="crm-card stat">
          <small>Conversaciones</small>
          <strong>{conversations}</strong>
          <span>{userMessages} mensajes de usuarios</span>
        </div>
        <div className="crm-card stat">
          <small>Respondidas con una FAQ</small>
          <strong>{pct(answered)}</strong>
          <span>{answered} respuestas</span>
        </div>
        <div className="crm-card stat">
          <small>No entendió (repregunta)</small>
          <strong style={{ color: clarify ? 'var(--warn)' : undefined }}>{pct(clarify)}</strong>
          <span>{clarify} veces</span>
        </div>
        <div className="crm-card stat">
          <small>Derivó a WhatsApp / emergencias</small>
          <strong>{handoffs}</strong>
          <span>{emergencies} emergencias detectadas</span>
        </div>
      </div>

      <div className="crm-grid c2" style={{ alignItems: 'start' }}>
        <section className="crm-card">
          <h2>Preguntas que el asistente no supo responder</h2>
          <p className="help" style={{ marginBottom: 10 }}>
            Convertilas en preguntas frecuentes: el botón abre el formulario con la frase ya cargada como palabra clave.
          </p>
          {unanswered.length === 0 ? (
            <Empty>No hay consultas sin respuesta en este período. 🎉</Empty>
          ) : (
            <div className="tablescroll">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Lo que escribieron</th>
                    <th>Veces</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {unanswered.map((u) => (
                    <tr key={u.text}>
                      <td style={{ maxWidth: 320, overflowWrap: 'anywhere' }}>{u.text}</td>
                      <td>{u.n}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link className="cbtn p sm" href={`/crm/faq/nueva?q=${encodeURIComponent(u.text.slice(0, 80))}`}>
                          Crear FAQ
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="crm-card">
          <h2>Preguntas frecuentes más usadas</h2>
          {topFaqs.length === 0 ? (
            <Empty>Todavía no hay datos en este período.</Empty>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {topFaqs.map((t) => {
                const q = faqs.find((f) => f.id === t.faq_id)?.question ?? '(FAQ eliminada)';
                return (
                  <div key={t.faq_id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: '.82rem' }}>
                      <Link href={`/crm/faq/${t.faq_id}`} style={{ color: 'var(--n2)', fontWeight: 600 }}>
                        {q}
                      </Link>
                      <b>{t.n}</b>
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: 'var(--p2)', marginTop: 4 }}>
                      <div style={{ width: `${(t.n / maxFaq) * 100}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, var(--b), var(--c))' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
