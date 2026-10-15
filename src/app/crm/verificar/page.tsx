import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionForm } from '@/components/crm/ActionForm';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '../login/actions';
import { verifyMfa } from './actions';

export const metadata: Metadata = { title: 'Verificación en dos pasos', robots: { index: false, follow: false } };

export default async function VerifyPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/crm/login');

  return (
    <div className="loginwrap">
      <div className="logincard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="loginlogo" src="/brand/logo-transgas.png" alt="Grupo Transgas" width={182} height={52} />
        <h1>Verificación en dos pasos</h1>
        <p>Ingresá el código de 6 dígitos que muestra tu app autenticadora (Google Authenticator, Microsoft Authenticator, Authy…).</p>
        <ActionForm action={verifyMfa} submitLabel="Verificar">
          <div>
            <label className="l" htmlFor="code">
              Código
            </label>
            <input id="code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} required autoFocus />
          </div>
        </ActionForm>
        <form action={signOut} style={{ marginTop: 14 }}>
          <button className="cbtn s sm" type="submit">
            Cancelar e ingresar con otra cuenta
          </button>
        </form>
      </div>
    </div>
  );
}
