import type { Metadata } from 'next';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { NewsForm } from '@/components/crm/NewsForm';

export const metadata: Metadata = { title: 'Nueva noticia' };

export default function NewNewsPage() {
  return (
    <>
      <BackLink href="/crm/noticias">Noticias</BackLink>
      <PageTitle title="Nueva noticia" />
      <div className="crm-card" style={{ maxWidth: 900 }}>
        <NewsForm />
      </div>
    </>
  );
}
