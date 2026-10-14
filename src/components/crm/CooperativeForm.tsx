import type { Cooperative } from '@prisma/client';
import { ActionForm } from '@/components/crm/ActionForm';
import { Field } from '@/components/crm/ui';
import { saveCooperative } from '@/app/crm/(panel)/cooperativas/actions';

export function CooperativeForm({ coop }: { coop?: Cooperative }) {
  return (
    <ActionForm action={saveCooperative} submitLabel={coop ? 'Guardar cambios' : 'Crear cooperativa'}>
      {coop && <input type="hidden" name="id" value={coop.id} />}
      <div className="row">
        <Field label="Nombre / localidad" htmlFor="name">
          <input id="name" name="name" type="text" required maxLength={100} defaultValue={coop?.name} />
        </Field>
        <Field label="Razón social" htmlFor="legalName">
          <input id="legalName" name="legalName" type="text" maxLength={200} defaultValue={coop?.legalName ?? ''} />
        </Field>
      </div>
      <Field label="Dirección" htmlFor="address">
        <input id="address" name="address" type="text" maxLength={200} defaultValue={coop?.address ?? ''} />
      </Field>
      <div className="row r3">
        <Field label="Teléfono" htmlFor="phone">
          <input id="phone" name="phone" type="text" maxLength={80} defaultValue={coop?.phone ?? ''} />
        </Field>
        <Field label="Horario de atención" htmlFor="schedule">
          <input id="schedule" name="schedule" type="text" maxLength={160} defaultValue={coop?.schedule ?? ''} placeholder="Lunes a viernes de 8 a 13 hs" />
        </Field>
        <Field label="Orden" htmlFor="sortOrder" help="Menor número = primero.">
          <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={coop?.sortOrder ?? 0} />
        </Field>
      </div>
    </ActionForm>
  );
}
