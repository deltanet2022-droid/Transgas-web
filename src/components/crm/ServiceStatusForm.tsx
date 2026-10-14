import type { ServiceStatus } from '@prisma/client';
import { ActionForm } from '@/components/crm/ActionForm';
import { Field } from '@/components/crm/ui';
import { saveServiceStatus } from '@/app/crm/(panel)/estado-servicio/actions';
import { argDateTimeInput } from '@/lib/dates';

export function ServiceStatusForm({ item }: { item?: ServiceStatus }) {
  return (
    <ActionForm action={saveServiceStatus} submitLabel={item ? 'Guardar cambios' : 'Publicar aviso'}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <Field label="Título" htmlFor="title">
        <input id="title" name="title" type="text" required maxLength={140} defaultValue={item?.title} placeholder="Corte programado por mantenimiento de red" />
      </Field>
      <Field label="Descripción" htmlFor="description" help="Qué pasa, a quién afecta y qué tiene que hacer la persona.">
        <textarea id="description" name="description" rows={4} required maxLength={1500} defaultValue={item?.description} />
      </Field>
      <div className="row">
        <Field label="Zona o localidad" htmlFor="zone">
          <input id="zone" name="zone" type="text" required maxLength={120} defaultValue={item?.zone} placeholder="General Levalle — barrio Centro" />
        </Field>
        <Field label="Estado" htmlFor="status">
          <select id="status" name="status" defaultValue={item?.status ?? 'PROGRAMADO'}>
            <option value="PROGRAMADO">Programado</option>
            <option value="EN_CURSO">En curso (se muestra el banner en todo el sitio)</option>
            <option value="RESUELTO">Resuelto</option>
          </select>
        </Field>
      </div>
      <div className="row">
        <Field label="Inicio (hora de Argentina)" htmlFor="startsAt">
          <input id="startsAt" name="startsAt" type="datetime-local" required defaultValue={argDateTimeInput(item?.startsAt)} />
        </Field>
        <Field label="Fin estimado (opcional)" htmlFor="estimatedEndAt">
          <input id="estimatedEndAt" name="estimatedEndAt" type="datetime-local" defaultValue={argDateTimeInput(item?.estimatedEndAt)} />
        </Field>
      </div>
    </ActionForm>
  );
}
