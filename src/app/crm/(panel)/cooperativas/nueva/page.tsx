import type { Metadata } from 'next';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { CooperativeForm } from '@/components/crm/CooperativeForm';

export const metadata: Metadata = { title: 'Nueva cooperativa' };

export default function NewCooperativePage() {
  return (
    <>
      <BackLink href="/crm/cooperativas">Cooperativas</BackLink>
      <PageTitle title="Nueva cooperativa" />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <CooperativeForm />
      </div>
    </>
  );
}
