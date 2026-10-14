import type { Metadata } from 'next';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { TariffForm } from '@/components/crm/TariffForm';

export const metadata: Metadata = { title: 'Nueva categoría' };

export default function NewTariffPage() {
  return (
    <>
      <BackLink href="/crm/tarifas">Tarifas</BackLink>
      <PageTitle title="Nueva categoría tarifaria" />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <TariffForm />
      </div>
    </>
  );
}
