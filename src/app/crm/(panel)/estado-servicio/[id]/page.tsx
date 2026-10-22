import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { ServiceStatusForm } from '@/components/crm/ServiceStatusForm';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { deleteServiceStatus } from '../actions';

export const metadata: Metadata = { title: 'Editar aviso' };

export default async function EditServiceStatusPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const item = await prisma.serviceStatus.findUnique({ where: { id: params.id } });
  if (!item) notFound();
  return (
    <>
      <BackLink href="/crm/estado-servicio">Estado del servicio</BackLink>
      <PageTitle
        title="Editar aviso"
        action={
          <form action={deleteServiceStatus}>
            <input type="hidden" name="id" value={item.id} />
            <ConfirmButton message="¿Eliminar este aviso?" className="cbtn d">
              Eliminar
            </ConfirmButton>
          </form>
        }
      />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <ServiceStatusForm item={item} />
      </div>
    </>
  );
}
