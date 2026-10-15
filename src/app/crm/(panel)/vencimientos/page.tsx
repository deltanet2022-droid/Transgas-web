import type { Metadata } from 'next';
import { ActionForm, ConfirmButton } from '@/components/crm/ActionForm';
import { ActionButton } from '@/components/crm/ActionButton';
import { Badge, Empty, Field, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { dateOnlyInput, formatDateOnly, todayAR, addDays } from '@/lib/dates';
import { createDueDate, deleteDueDate } from './actions';
import { sendNoticeNow } from './notice-actions';

export const metadata: Metadata = { title: 'Vencimientos' };

export default async function DueDatesPage() {
  const today = todayAR();
  const [items, tariffs, delivered, activeSubs] = await Promise.all([
    prisma.dueDate.findMany({ orderBy: { dueDate: 'desc' }, include: { tariff: { select: { code: true } } } }),
    prisma.tariff.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }], select: { id: true, code: true, name: true } }),
    prisma.noticeDelivery.groupBy({ by: ['dueDateId'], _count: true }),
    prisma.subscriber.count({ where: { confirmedAt: { not: null }, unsubscribedAt: null } }),
  ]);
  const sentBy = new Map(delivered.map((d) => [d.dueDateId, d._count]));
  const upcoming = items.filter((i) => i.dueDate >= today).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const past = items.filter((i) => i.dueDate < today);

  const row = (i: (typeof items)[number]) => {
    const live = i.showFrom <= today && i.dueDate >= today;
    return (
      <tr key={i.id}>
        <td>
          <b>{formatDateOnly(i.dueDate)}</b>
        </td>
        <td>{formatDateOnly(i.showFrom, 'short')}</td>
        <td>{i.tariff ? `Categoría ${i.tariff.code}` : 'General'}</td>
        <td>{i.message}</td>
        <td style={{ minWidth: 190 }}>
          {i.dueDate >= today ? (
            <ActionButton
              className="cbtn s sm"
              action={sendNoticeNow.bind(null, i.id)}
              label={`Enviar aviso (${sentBy.get(i.id) ?? 0}/${activeSubs})`}
              pendingLabel="Enviando…"
              confirm={`¿Enviar el aviso por mail a los suscriptores que todavía no lo recibieron (${Math.max(0, activeSubs - (sentBy.get(i.id) ?? 0))})?`}
            />
          ) : (
            <span style={{ color: 'var(--muted)', fontSize: '.78rem' }}>{sentBy.get(i.id) ?? 0} enviados</span>
          )}
        </td>
        <td>{live ? <Badge tone="ok">Visible hoy</Badge> : i.dueDate < today ? <Badge>Vencido</Badge> : <Badge tone="prog">Programado</Badge>}</td>
        <td style={{ textAlign: 'right' }}>
          <form action={deleteDueDate}>
            <input type="hidden" name="id" value={i.id} />
            <ConfirmButton message="¿Eliminar este vencimiento?">Eliminar</ConfirmButton>
          </form>
        </td>
      </tr>
    );
  };
  const head = (
    <thead>
      <tr>
        <th>Vence</th>
        <th>Mostrar desde</th>
        <th>Alcance</th>
        <th>Mensaje</th>
        <th>Aviso por mail</th>
        <th>Estado</th>
        <th />
      </tr>
    </thead>
  );

  return (
    <>
      <PageTitle title="Vencimientos" sub="El banner se muestra en todo el sitio entre «Mostrar desde» y la fecha de vencimiento." />

      <section className="crm-card" style={{ marginBottom: 16 }}>
        <h2>Cargar un vencimiento</h2>
        <ActionForm action={createDueDate} submitLabel="Cargar vencimiento" resetOnSuccess>
          <div className="row r3">
            <Field label="Fecha de vencimiento" htmlFor="dueDate">
              <input id="dueDate" name="dueDate" type="date" required defaultValue={dateOnlyInput(addDays(today, 10))} />
            </Field>
            <Field label="Mostrar desde" htmlFor="showFrom" help="Vacío = 7 días antes del vencimiento.">
              <input id="showFrom" name="showFrom" type="date" />
            </Field>
            <Field label="Alcance" htmlFor="tariffId">
              <select id="tariffId" name="tariffId" defaultValue="">
                <option value="">General (todas las categorías)</option>
                {tariffs.map((t) => (
                  <option key={t.id} value={t.id}>
                    Categoría {t.code} — {t.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Mensaje del banner (máx. 200 caracteres)" htmlFor="message">
            <input id="message" name="message" type="text" required maxLength={200} placeholder="Recordá abonar tu factura antes del vencimiento." />
          </Field>
        </ActionForm>
      </section>

      <section className="crm-card" style={{ marginBottom: 16 }}>
        <h2>Vigentes y próximos</h2>
        {upcoming.length === 0 ? (
          <Empty>No hay vencimientos cargados hacia adelante.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              {head}
              <tbody>{upcoming.map(row)}</tbody>
            </table>
          </div>
        )}
      </section>

      <section className="crm-card">
        <h2>Anteriores</h2>
        {past.length === 0 ? (
          <Empty>Todavía no hay vencimientos anteriores.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              {head}
              <tbody>{past.map(row)}</tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
