import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { FaqForm } from '@/components/crm/FaqForm';
import { BackLink, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { deleteFaq } from '../actions';

export const metadata: Metadata = { title: 'Editar pregunta frecuente' };

export default async function EditFaqPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [faq, cats] = await Promise.all([
    prisma.faq.findUnique({ where: { id: params.id } }),
    prisma.faq.findMany({ distinct: ['category'], select: { category: true }, orderBy: { category: 'asc' } }),
  ]);
  if (!faq) notFound();
  return (
    <>
      <BackLink href="/crm/faq">Preguntas frecuentes</BackLink>
      <PageTitle
        title="Editar pregunta frecuente"
        action={
          <form action={deleteFaq}>
            <input type="hidden" name="id" value={faq.id} />
            <ConfirmButton message="¿Eliminar esta FAQ? No se puede deshacer." className="cbtn d">
              Eliminar
            </ConfirmButton>
          </form>
        }
      />
      <div className="crm-card" style={{ maxWidth: 900 }}>
        <FaqForm faq={faq} categories={cats.map((c) => c.category)} />
      </div>
    </>
  );
}
