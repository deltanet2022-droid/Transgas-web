import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { TariffForm } from '@/components/crm/TariffForm';
import { prisma } from '@/lib/db';
import { deleteTariff } from '../../actions';

export const metadata: Metadata = { title: 'Editar categoría' };

export default async function EditTariffPage({ params }: { params: { id: string } }) {
  const tariff = await prisma.tariff.findUnique({ where: { id: params.id } });
  if (!tariff) notFound();
  return (
    <>
      <BackLink href="/crm/tarifas">Tarifas</BackLink>
      <PageTitle
        title={`Categoría ${tariff.code}`}
        action={
          <form action={deleteTariff}>
            <input type="hidden" name="id" value={tariff.id} />
            <ConfirmButton message={`¿Eliminar la categoría ${tariff.code}? Los vencimientos asociados quedarán como "general".`} className="cbtn d">
              Eliminar
            </ConfirmButton>
          </form>
        }
      />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <TariffForm tariff={tariff} />
      </div>
    </>
  );
}
