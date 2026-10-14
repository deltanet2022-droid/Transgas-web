import type { Metadata } from 'next';
import { LeadPage } from '@/components/forms/LeadPage';

export const metadata: Metadata = {
  title: 'Informar un pago',
  description: 'Informá un pago realizado para que lo acreditemos en tu cuenta.',
};

export default function Page() {
  return <LeadPage type="INFORMAR_PAGO" />;
}
