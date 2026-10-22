import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionForm } from '@/components/crm/ActionForm';
import { createClient } from '@/lib/supabase/server';
import { setNewPassword } from './actions';

export const metadata: Metadata = { title: 'Nueva contraseña', robots: { index: false, follow: false } };

export default async function ResetPage() {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();

  return (
    <div className="loginwrap">
      <div className="logincard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="loginlogo" src="/brand/logo-transgas.png" alt="Grupo Transgas" width={182} height={52} />
        <h1>Elegí tu nueva contraseña</h1>
        {user ? (
          <>
            <p>Mínimo 10 caracteres, con letras y números.</p>
            <ActionForm action={setNewPassword} submitLabel="Guardar contraseña">
              <div>
                <label className="l" htmlFor="password">
                  Nueva contraseña
                </label>
                <input id="password" name="password" type="password" required minLength={10} autoComplete="new-password" />
              </div>
              <div>
                <label className="l" htmlFor="confirm">
                  Repetí la contraseña
                </label>
                <input id="confirm" name="confirm" type="password" required minLength={10} autoComplete="new-password" />
              </div>
            </ActionForm>
          </>
        ) : (
          <>
            <div className="cmsg err" style={{ margin: '12px 0' }}>
              El enlace venció, ya se usó, o lo abriste en otro navegador distinto del que usaste para pedirlo.
            </div>
            <Link className="cbtn p" href="/crm/recuperar">
              Pedir un enlace nuevo
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
