import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import { LeadForm } from '@/components/forms/LeadForm';
import { ContactCards } from '@/components/site/ContactCards';
import { PageBody, PageHeader } from '@/components/site/PageParts';
import { LEAD_FORMS } from '@/lib/leads/config';

export const metadata: Metadata = staticMeta('/contacto');

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        kicker="Contacto"
        title="Estamos para ayudarte"
        sub="Escribinos, llamanos o visitanos. Si es una emergencia, usá el teléfono de emergencias."
        crumbs={[{ label: 'Contacto' }]}
      />
      <PageBody>
        <div style={{ maxWidth: 860, margin: '0 auto 56px' }}>
          <LeadForm config={LEAD_FORMS.CONTACTO} />
        </div>
        <ContactCards />
      </PageBody>
    </>
  );
}
