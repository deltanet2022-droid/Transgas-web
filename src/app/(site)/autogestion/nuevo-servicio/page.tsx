import type { Metadata } from 'next';
import { LeadPage } from '@/components/forms/LeadPage';

export const metadata: Metadata = {
  title: 'Nuevo servicio',
  description: 'Solicitá un nuevo servicio de gas natural.',
};

export default function Page() {
  return <LeadPage type="NUEVO_SERVICIO" />;
}
