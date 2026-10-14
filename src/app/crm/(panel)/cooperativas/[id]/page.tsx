import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { CooperativeForm } from '@/components/crm/CooperativeForm';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { deleteCooperative } from '../actions';

export const metadata: Metadata = { title: 'Editar cooperativa' };

export default async function EditCooperativePage({ params }: { params: { id: string } }) {
  const coop = await prisma.cooperative.findUnique({ where: { id: params.id } });
  if (!coop) notFound();
  return (
    <>
      <BackLink href="/crm/cooperativas">Cooperativas</BackLink>
      <PageTitle
        title={coop.name}
        action={
          <form action={deleteCooperative}>
            <input type="hidden" name="id" value={coop.id} />
            <ConfirmButton message={`¿Eliminar la cooperativa ${coop.name}?`} className="cbtn d">
              Eliminar
            </ConfirmButton>
          </form>
        }
      />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <CooperativeForm coop={coop} />
      </div>
    </>
  );
}
