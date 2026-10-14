import type { Metadata } from 'next';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { FaqForm } from '@/components/crm/FaqForm';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Nueva pregunta frecuente' };

export default async function NewFaqPage() {
  const categories = (await prisma.faq.findMany({ distinct: ['category'], select: { category: true }, orderBy: { category: 'asc' } })).map((c) => c.category);
  return (
    <>
      <BackLink href="/crm/faq">Preguntas frecuentes</BackLink>
      <PageTitle title="Nueva pregunta frecuente" />
      <div className="crm-card" style={{ maxWidth: 900 }}>
        <FaqForm categories={categories} />
      </div>
    </>
  );
}
