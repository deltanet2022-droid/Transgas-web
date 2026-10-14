import type { Metadata } from 'next';
import { LeadPage } from '@/components/forms/LeadPage';

export const metadata: Metadata = {
  title: 'Altas, bajas y modificaciones',
  description: 'Gestioná bajas, modificaciones de datos y cambios de titularidad de tu servicio.',
};

export default function Page() {
  return <LeadPage type="ABM_SERVICIO" />;
}
