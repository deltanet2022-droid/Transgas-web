import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionForm } from '@/components/crm/ActionForm';
import { requestPasswordReset } from '../login/actions';

export const metadata: Metadata = { title: 'Recuperar contraseña', robots: { index: false, follow: false } };

export default function RecoverPage() {
  return (
    <div className="loginwrap">
      <div className="logincard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="loginlogo" src="/brand/logo-transgas.png" alt="Grupo Transgas" width={182} height={52} />
        <h1>Recuperar contraseña</h1>
        <p>Ingresá tu correo y te enviamos un enlace para elegir una contraseña nueva.</p>
        <ActionForm action={requestPasswordReset} submitLabel="Enviar enlace">
          <div>
            <label className="l" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="username" />
          </div>
        </ActionForm>
        <p style={{ marginTop: 16, fontSize: '.82rem' }}>
          <Link href="/crm/login" style={{ color: 'var(--b)', fontWeight: 700 }}>
            ← Volver a ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
