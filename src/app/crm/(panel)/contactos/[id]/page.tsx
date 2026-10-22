import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActionForm, ConfirmButton } from '@/components/crm/ActionForm';
import { getCrmUser } from '@/lib/auth';
import { BackLink, Badge, Field, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/dates';
import { LEAD_TYPE_LABEL, extraFieldLabel, type LeadTypeKey } from '@/lib/leads/config';
import { LEAD_STATUSES, LEAD_STATUS_LABEL } from '@/lib/crm/leads';
import { deleteLead, updateLead } from '../actions';

export const metadata: Metadata = { title: 'Detalle de contacto' };

export default async function LeadDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [lead, me] = await Promise.all([prisma.lead.findUnique({ where: { id: params.id } }), getCrmUser()]);
  if (!lead) notFound();
  const type = lead.type as LeadTypeKey;
  const extra = Object.entries((lead.extraData ?? {}) as Record<string, unknown>);

  const row = (label: string, value: React.ReactNode) => (
    <tr>
      <th style={{ width: 190, textTransform: 'none', letterSpacing: 0, fontSize: '.78rem' }}>{label}</th>
      <td>{value || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
    </tr>
  );

  return (
    <>
      <BackLink href="/crm/contactos">Contactos</BackLink>
      <PageTitle title={lead.name} sub={`${LEAD_TYPE_LABEL[type]} · recibido el ${formatDateTime(lead.createdAt)} · Nº ${lead.id.slice(-6).toUpperCase()}`} />

      <div className="crm-grid c2" style={{ alignItems: 'start' }}>
        <section className="crm-card">
          <h2>Datos del formulario</h2>
          <table className="crm-table">
            <tbody>
              {row('Nombre', lead.name)}
              {row('Email', lead.email && <a href={`mailto:${lead.email}`}>{lead.email}</a>)}
              {row('Teléfono', lead.phone && <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}>{lead.phone}</a>)}
              {row('Mensaje', lead.message && <span style={{ whiteSpace: 'pre-wrap' }}>{lead.message}</span>)}
              {extra.map(([k, v]) => row(extraFieldLabel(type, k), typeof v === 'boolean' ? (v ? 'Sí' : 'No') : String(v)))}
            </tbody>
          </table>
        </section>

        <section className="crm-card">
          <h2>
            Gestión <Badge tone={lead.status === 'NUEVO' ? 'nuevo' : lead.status === 'EN_GESTION' ? 'gest' : 'ok'}>{LEAD_STATUS_LABEL[lead.status]}</Badge>
          </h2>
          <ActionForm action={updateLead} submitLabel="Guardar">
            <input type="hidden" name="id" value={lead.id} />
            <Field label="Estado" htmlFor="status">
              <select id="status" name="status" defaultValue={lead.status}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {LEAD_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notas internas" htmlFor="internalNotes" help="Solo las ve el equipo; no se muestran al usuario.">
              <textarea id="internalNotes" name="internalNotes" rows={6} maxLength={4000} defaultValue={lead.internalNotes ?? ''} />
            </Field>
          </ActionForm>
          {me?.role === 'ADMIN' && (
            <form action={deleteLead} style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmButton message="¿Eliminar este contacto de forma definitiva? Es el «derecho de supresión» (Ley 25.326) y no se puede deshacer.">Eliminar contacto (derecho de supresión)</ConfirmButton>
            </form>
          )}
        </section>
      </div>
    </>
  );
}
