import type { Tariff } from '@prisma/client';
import { ActionForm } from '@/components/crm/ActionForm';
import { Field } from '@/components/crm/ui';
import { saveTariff } from '@/app/crm/(panel)/tarifas/actions';

export function TariffForm({ tariff }: { tariff?: Tariff }) {
  return (
    <ActionForm action={saveTariff} submitLabel={tariff ? 'Guardar cambios' : 'Crear categoría'}>
      {tariff && <input type="hidden" name="id" value={tariff.id} />}
      <div className="row">
        <Field label="Código" htmlFor="code" help="Como figura en el cuadro tarifario: R1, R2-1, SGP3-a…">
          <input id="code" name="code" type="text" required maxLength={20} defaultValue={tariff?.code} />
        </Field>
        <Field label="Tipo" htmlFor="type">
          <select id="type" name="type" defaultValue={tariff?.type ?? 'RESIDENCIAL'}>
            <option value="RESIDENCIAL">Residencial</option>
            <option value="SGP">SGP (servicio general)</option>
          </select>
        </Field>
      </div>
      <Field label="Nombre" htmlFor="name">
        <input id="name" name="name" type="text" required maxLength={120} defaultValue={tariff?.name} />
      </Field>
      <Field label="Descripción" htmlFor="description">
        <textarea id="description" name="description" rows={2} maxLength={300} defaultValue={tariff?.description ?? ''} />
      </Field>
      <div className="row r3">
        <Field label="Rango de consumo (opcional)" htmlFor="consumptionRange" help="Ej. «Hasta 500 m³/año». Si queda vacío, el sitio muestra el rango oficial de la categoría.">
          <input id="consumptionRange" name="consumptionRange" type="text" maxLength={120} defaultValue={tariff?.consumptionRange ?? ''} />
        </Field>
        <Field label="Orden" htmlFor="sortOrder" help="Menor número = aparece primero.">
          <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={tariff?.sortOrder ?? 0} />
        </Field>
        <Field label="Estado">
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 10 }}>
            <input type="checkbox" name="active" defaultChecked={tariff?.active ?? true} /> Visible en el sitio
          </label>
        </Field>
      </div>
    </ActionForm>
  );
}
