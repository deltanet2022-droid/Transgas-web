import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import { SubscribeForm } from '@/components/forms/SubscribeForm';
import { PageBody, PageHeader } from '@/components/site/PageParts';

export const metadata: Metadata = staticMeta('/avisos');

export default function AvisosPage() {
  return (
    <>
      <PageHeader
        kicker="Avisos"
        title="Recibí un recordatorio antes de cada vencimiento"
        sub="Te avisamos por correo unos días antes de que venza tu factura. Es gratis y podés darte de baja cuando quieras."
        crumbs={[{ label: 'Avisos de vencimiento' }]}
      />
      <PageBody>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <SubscribeForm />
        </div>
      </PageBody>
    </>
  );
}
