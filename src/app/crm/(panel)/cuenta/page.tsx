import type { Metadata } from 'next';
import { ActionForm } from '@/components/crm/ActionForm';
import { MfaSetup } from '@/components/crm/MfaSetup';
import { Badge, Field, PageTitle } from '@/components/crm/ui';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { changePassword } from './actions';

export const metadata: Metadata = { title: 'Mi cuenta' };

export default async function AccountPage() {
  const user = await requireUser();
  const { data } = await createClient().auth.mfa.listFactors();
  const mfaEnabled = !!data?.totp?.some((f) => f.status === 'verified');

  return (
    <>
      <PageTitle title="Mi cuenta" sub={`${user.name || user.email} · ${user.role === 'ADMIN' ? 'Administrador' : 'Editor'}`} />
      <div className="crm-grid c2" style={{ alignItems: 'start' }}>
        <section className="crm-card">
          <h2>Cambiar contraseña</h2>
          <ActionForm action={changePassword} submitLabel="Cambiar contraseña" resetOnSuccess>
            <Field label="Contraseña actual" htmlFor="current">
              <input id="current" name="current" type="password" required autoComplete="current-password" />
            </Field>
            <Field label="Contraseña nueva" htmlFor="password" help="Mínimo 10 caracteres, con letras y números.">
              <input id="password" name="password" type="password" required minLength={10} autoComplete="new-password" />
            </Field>
            <Field label="Repetí la contraseña nueva" htmlFor="confirm">
              <input id="confirm" name="confirm" type="password" required minLength={10} autoComplete="new-password" />
            </Field>
          </ActionForm>
        </section>

        <section className="crm-card">
          <h2>
            Verificación en dos pasos {mfaEnabled ? <Badge tone="ok">Activada</Badge> : <Badge tone="warn">Desactivada</Badge>}
          </h2>
          <MfaSetup enabled={mfaEnabled} />
        </section>
      </div>
    </>
  );
}
