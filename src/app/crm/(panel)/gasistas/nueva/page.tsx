import type { Metadata } from 'next';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { InstallerForm } from '@/components/crm/InstallerForm';

export const metadata: Metadata = { title: 'Agregar gasista' };

export default function NewInstallerPage() {
  return (
    <>
      <BackLink href="/crm/gasistas">Gasistas</BackLink>
      <PageTitle title="Agregar gasista matriculado" />
      <div className="crm-card" style={{ maxWidth: 780 }}>
        <InstallerForm />
      </div>
    </>
  );
}
