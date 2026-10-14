import type { Metadata } from 'next';
import { LeadPage } from '@/components/forms/LeadPage';

export const metadata: Metadata = {
  title: 'Informar estado de medidor',
  description: 'Informá la lectura de tu medidor o una anomalía.',
};

export default function Page() {
  return <LeadPage type="INFORMAR_MEDIDOR" />;
}
