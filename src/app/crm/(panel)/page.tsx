import Link from 'next/link';
import { Badge, ConversationBadges, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateOnly, formatDateTime, formatDateLong, todayAR } from '@/lib/dates';
import { LEAD_TYPE_LABEL, type LeadTypeKey } from '@/lib/leads/config';

export default async function CrmDashboard(props: { searchParams: Promise<{ forbidden?: string }> }) {
  const searchParams = await props.searchParams;
  const today = todayAR();
  const now = new Date();

  const week = new Date(Date.now() - 7 * 86_400_000);
  const [newLeads, nextDue, activeAlert, nextScheduled, news, conversations, latestLeads, weekViews] = await Promise.all([
    prisma.lead.count({ where: { status: 'NUEVO' } }),
    prisma.dueDate.findFirst({ where: { dueDate: { gte: today } }, orderBy: { dueDate: 'asc' }, include: { tariff: { select: { code: true } } } }),
    prisma.serviceStatus.findFirst({ where: { status: 'EN_CURSO' }, orderBy: { startsAt: 'desc' } }),
    prisma.serviceStatus.findFirst({ where: { status: 'PROGRAMADO', startsAt: { gte: now } }, orderBy: { startsAt: 'asc' } }),
    prisma.news.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, status: true, publishedAt: true, createdAt: true } }),
    prisma.chatConversation.findMany({
      orderBy: { lastActivityAt: 'desc' },
      take: 5,
      include: { messages: { where: { role: 'USER' }, orderBy: { createdAt: 'asc' }, take: 1, select: { text: true } }, _count: { select: { messages: true } } },
    }),
    prisma.lead.findMany({ where: { status: 'NUEVO' }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, type: true, name: true, createdAt: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: week } } }),
  ]);
  const service = activeAlert ?? nextScheduled;

  return (
    <>
      <PageTitle title="Inicio" sub="Resumen de lo que necesita tu atención." />
      {searchParams.forbidden && <div className="cmsg err" style={{ marginBottom: 16 }}>No tenés permiso para acceder a esa sección.</div>}

      <div className="crm-grid c4" style={{ marginBottom: 16 }}>
        <Link href="/crm/contactos?status=NUEVO" className="crm-card stat" style={{ textDecoration: 'none' }}>
          <small>Contactos nuevos sin atender</small>
          <strong style={{ color: newLeads ? 'var(--b)' : undefined }}>{newLeads}</strong>
          <span>{newLeads === 1 ? 'consulta esperando respuesta' : 'consultas esperando respuesta'}</span>
        </Link>
        <Link href="/crm/vencimientos" className="crm-card stat" style={{ textDecoration: 'none' }}>
          <small>Próximo vencimiento</small>
          {nextDue ? (
            <>
              <strong style={{ fontSize: '1.4rem' }}>{formatDateOnly(nextDue.dueDate)}</strong>
              <span>
                {nextDue.tariff ? `Categoría ${nextDue.tariff.code} · ` : 'General · '}
                {nextDue.message}
              </span>
            </>
          ) : (
            <>
              <strong style={{ fontSize: '1.4rem' }}>—</strong>
              <span>No hay vencimientos cargados.</span>
            </>
          )}
        </Link>
        <Link href="/crm/estado-servicio" className="crm-card stat" style={{ textDecoration: 'none' }}>
          <small>{activeAlert ? 'Aviso de servicio en curso' : 'Próximo corte / aviso'}</small>
          {service ? (
            <>
              <strong style={{ fontSize: '1.2rem', lineHeight: 1.25 }}>{service.title}</strong>
              <span>
                {service.zone} · {formatDateTime(service.startsAt)}
              </span>
            </>
          ) : (
            <>
              <strong style={{ fontSize: '1.4rem' }}>—</strong>
              <span>Sin cortes ni avisos vigentes.</span>
            </>
          )}
        </Link>
        <Link href="/crm/estadisticas" className="crm-card stat" style={{ textDecoration: 'none' }}>
          <small>Visitas al sitio (7 días)</small>
          <strong>{weekViews}</strong>
          <span>páginas vistas · ver estadísticas</span>
        </Link>
      </div>

      <div className="crm-grid c2">
        <section className="crm-card">
          <h2>Contactos nuevos</h2>
          {latestLeads.length === 0 ? (
            <Empty>No hay contactos sin atender. 🎉</Empty>
          ) : (
            <table className="crm-table">
              <tbody>
                {latestLeads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/crm/contactos/${l.id}`}>{l.name}</Link>
                    </td>
                    <td>{LEAD_TYPE_LABEL[l.type as LeadTypeKey]}</td>
                    <td style={{ textAlign: 'right', color: 'var(--muted)' }}>{formatDateTime(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="crm-card">
          <h2>Últimas 5 noticias</h2>
          {news.length === 0 ? (
            <Empty>Todavía no hay noticias.</Empty>
          ) : (
            <table className="crm-table">
              <tbody>
                {news.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <Link href={`/crm/noticias/${n.id}`}>{n.title}</Link>
                    </td>
                    <td>{n.status === 'PUBLISHED' ? <Badge tone="pub">Publicada</Badge> : <Badge tone="draft">Borrador</Badge>}</td>
                    <td style={{ textAlign: 'right', color: 'var(--muted)' }}>{formatDateLong(n.publishedAt ?? n.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="crm-card" style={{ gridColumn: '1 / -1' }}>
          <h2>Últimas 5 conversaciones del chatbot</h2>
          {conversations.length === 0 ? (
            <Empty>Todavía no hubo conversaciones.</Empty>
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
                  {conversations.map((c) => (
                    <tr key={c.id}>
                      <td>{formatDateTime(c.lastActivityAt)}</td>
                      <td>
                        <Link href={`/crm/chatbot/${c.id}`}>{c.messages[0]?.text.slice(0, 80) ?? '(sin mensajes)'}</Link>
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
        </section>
      </div>
    </>
  );
}
