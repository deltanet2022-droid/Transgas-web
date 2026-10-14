import type { Metadata } from 'next';
import { LeadPage } from '@/components/forms/LeadPage';

export const metadata: Metadata = {
  title: 'Factura electrónica',
  description: 'Adherite a la factura electrónica de Transgas y recibí tu factura por correo.',
};

export default function Page() {
  return <LeadPage type="FACTURA_ELECTRONICA" />;
}
