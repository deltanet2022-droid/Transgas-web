import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionForm } from '@/components/crm/ActionForm';
import { signIn } from './actions';

export const metadata: Metadata = { title: 'Ingresar al CRM', robots: { index: false, follow: false } };

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="loginwrap">
      <div className="logincard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="loginlogo" src="/brand/logo-transgas.png" alt="Grupo Transgas" width={182} height={52} />
        <h1>Panel de administración</h1>
        <p>Ingresá con tu usuario de Transgas.</p>
        {searchParams.error === 'link' && (
          <div className="cmsg err" style={{ marginBottom: 14 }}>
            El enlace venció o ya se usó. Pedí uno nuevo desde «¿Olvidaste tu contraseña?».
          </div>
        )}
        {searchParams.error === 'noaccess' && (
          <div className="cmsg err" style={{ marginBottom: 14 }}>
            Tu sesión no tiene acceso al CRM. Ingresá con otra cuenta o pedí el alta al administrador.
          </div>
        )}
        <ActionForm action={signIn} submitLabel="Ingresar">
          <div>
            <label className="l" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div>
            <label className="l" htmlFor="password">
              Contraseña
            </label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
        </ActionForm>
        <p style={{ marginTop: 16, fontSize: '.82rem' }}>
          <Link href="/crm/recuperar" style={{ color: 'var(--b)', fontWeight: 700 }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  );
}
