import type { Metadata } from 'next';
import { ActionForm } from '@/components/crm/ActionForm';
import { FlameIcon } from '@/components/ui/Icons';
import { signIn } from './actions';

export const metadata: Metadata = { title: 'Ingresar al CRM', robots: { index: false, follow: false } };

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="loginwrap">
      <div className="logincard">
        <span className="mark" style={{ background: 'var(--n2)', color: '#fff', width: 48, height: 48, borderRadius: 14, display: 'grid', placeItems: 'center' }}>
          <FlameIcon width={28} />
        </span>
        <h1>Panel de administración</h1>
        <p>Ingresá con tu usuario de Transgas.</p>
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
      </div>
    </div>
  );
}
