import type { Metadata } from 'next';
import { ActionForm, ConfirmButton } from '@/components/crm/ActionForm';
import { Badge, Field, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formatDateLong } from '@/lib/dates';
import { changeUserRole, createCrmUser, deleteCrmUser } from './actions';

export const metadata: Metadata = { title: 'Usuarios del CRM' };

const ERRORS: Record<string, string> = {
  self: 'No podés darte de baja a vos mismo.',
  lastadmin: 'Tiene que quedar al menos un administrador.',
};

export default async function UsersPage({ searchParams }: { searchParams: { error?: string } }) {
  const me = await requireAdmin(); // solo visible para rol admin
  const users = await prisma.user.findMany({ orderBy: [{ role: 'asc' }, { email: 'asc' }] });

  return (
    <>
      <PageTitle title="Usuarios del CRM" sub="Administradores (todo) y editores (todo menos gestión de usuarios)." />
      {searchParams.error && ERRORS[searchParams.error] && <div className="cmsg err" style={{ marginBottom: 16 }}>{ERRORS[searchParams.error]}</div>}

      <section className="crm-card" style={{ marginBottom: 16 }}>
        <h2>Usuarios</h2>
        <div className="tablescroll">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Alta</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b>{u.name || u.email}</b>
                    {u.name && <div style={{ color: 'var(--muted)', fontSize: '.76rem' }}>{u.email}</div>}
                    {u.id === me.id && <Badge tone="gest">Vos</Badge>}
                  </td>
                  <td>
                    <form action={changeUserRole} style={{ display: 'inline-flex', gap: 6 }}>
                      <input type="hidden" name="id" value={u.id} />
                      <select name="role" defaultValue={u.role} aria-label={`Rol de ${u.email}`} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '6px 8px', fontSize: '.8rem' }}>
                        <option value="ADMIN">Administrador</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                      <button className="cbtn s sm" type="submit">
                        Cambiar
                      </button>
                    </form>
                  </td>
                  <td>{formatDateLong(u.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {u.id !== me.id && (
                      <form action={deleteCrmUser}>
                        <input type="hidden" name="id" value={u.id} />
                        <ConfirmButton message={`¿Dar de baja a ${u.email}? Ya no va a poder ingresar al CRM.`}>Dar de baja</ConfirmButton>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="crm-card" style={{ maxWidth: 780 }}>
        <h2>Dar de alta un usuario</h2>
        <ActionForm action={createCrmUser} submitLabel="Crear usuario" resetOnSuccess>
          <div className="row">
            <Field label="Email" htmlFor="email">
              <input id="email" name="email" type="email" required autoComplete="off" />
            </Field>
            <Field label="Nombre" htmlFor="name">
              <input id="name" name="name" type="text" maxLength={120} autoComplete="off" />
            </Field>
          </div>
          <div className="row">
            <Field label="Rol" htmlFor="role">
              <select id="role" name="role" defaultValue="EDITOR">
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </Field>
            <Field label="Contraseña temporal" htmlFor="password" help="Mínimo 10 caracteres. Compartila por un canal seguro; la persona puede cambiarla después.">
              <input id="password" name="password" type="password" required minLength={10} autoComplete="new-password" />
            </Field>
          </div>
        </ActionForm>
      </section>
    </>
  );
}
