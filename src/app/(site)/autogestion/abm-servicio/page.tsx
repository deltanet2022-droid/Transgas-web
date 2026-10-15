import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import { LeadPage } from '@/components/forms/LeadPage';

export const metadata: Metadata = staticMeta('/autogestion/abm-servicio');

export default function Page() {
  return <LeadPage type="ABM_SERVICIO" />;
}
