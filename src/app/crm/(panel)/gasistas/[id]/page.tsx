import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { InstallerForm } from '@/components/crm/InstallerForm';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { deleteInstaller } from '../actions';

export const metadata: Metadata = { title: 'Editar gasista' };

export default async function EditInstallerPage({ params }: { params: { id: string } }) {
  const installer = await prisma.licensedInstaller.findUnique({ where: { id: params.id } });
  if (!installer) notFound();
  return (
    <>
      <BackLink href="/crm/gasistas">Gasistas</BackLink>
      <PageTitle
        title={installer.name}
        action={
          <form action={deleteInstaller}>
            <input type="hidden" name="id" value={installer.id} />
            <ConfirmButton message={`¿Eliminar a ${installer.name} del listado?`} className="cbtn d">
              Eliminar
            </ConfirmButton>
          </form>
        }
      />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <InstallerForm installer={installer} />
      </div>
    </>
  );
}
