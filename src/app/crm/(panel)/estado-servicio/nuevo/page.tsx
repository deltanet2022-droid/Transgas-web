import type { Metadata } from 'next';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { ServiceStatusForm } from '@/components/crm/ServiceStatusForm';

export const metadata: Metadata = { title: 'Nuevo aviso' };

export default function NewServiceStatusPage() {
  return (
    <>
      <BackLink href="/crm/estado-servicio">Estado del servicio</BackLink>
      <PageTitle title="Nuevo corte o aviso" />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <ServiceStatusForm />
      </div>
    </>
  );
}
