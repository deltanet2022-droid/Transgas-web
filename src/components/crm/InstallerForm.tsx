import type { LicensedInstaller } from '@prisma/client';
import { ActionForm } from '@/components/crm/ActionForm';
import { Field } from '@/components/crm/ui';
import { saveInstaller } from '@/app/crm/(panel)/gasistas/actions';

export function InstallerForm({ installer }: { installer?: LicensedInstaller }) {
  return (
    <ActionForm action={saveInstaller} submitLabel={installer ? 'Guardar cambios' : 'Agregar gasista'}>
      {installer && <input type="hidden" name="id" value={installer.id} />}
      <div className="row">
        <Field label="Nombre y apellido" htmlFor="name">
          <input id="name" name="name" type="text" required maxLength={120} defaultValue={installer?.name} />
        </Field>
        <Field label="Matrícula" htmlFor="license">
          <input id="license" name="license" type="text" required maxLength={40} defaultValue={installer?.license} />
        </Field>
      </div>
      <div className="row r3">
        <Field label="Localidad" htmlFor="locality">
          <input id="locality" name="locality" type="text" required maxLength={100} defaultValue={installer?.locality} />
        </Field>
        <Field label="Teléfono" htmlFor="phone">
          <input id="phone" name="phone" type="text" maxLength={60} defaultValue={installer?.phone ?? ''} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" maxLength={160} defaultValue={installer?.email ?? ''} />
        </Field>
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.86rem' }}>
        <input type="checkbox" name="active" defaultChecked={installer?.active ?? true} /> Visible en el listado público
      </label>
    </ActionForm>
  );
}
