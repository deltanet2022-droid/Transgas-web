import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ActionForm, ConfirmButton } from '@/components/crm/ActionForm';
import { RichTextEditor } from '@/components/crm/RichTextEditor';
import { BackLink, Field, PageTitle } from '@/components/crm/ui';
import { getEffectivePage } from '@/components/site/ContentPage';
import { savePage, resetPage } from '../actions';

export const metadata: Metadata = { title: 'Editar página' };

export default async function EditPageCrm({ params }: { params: { slug: string } }) {
  const page = await getEffectivePage(params.slug);
  if (!page) notFound();

  return (
    <>
      <BackLink href="/crm/paginas">Páginas</BackLink>
      <PageTitle
        title={page.title}
        sub={page.edited ? 'Esta página tiene contenido editado.' : 'Esta página muestra el contenido original. Al guardar, se reemplaza por tu versión.'}
        action={
          <span style={{ display: 'inline-flex', gap: 8 }}>
            <Link className="cbtn s" href={page.def.path} target="_blank">
              Ver en el sitio ↗
            </Link>
            {page.edited && (
              <form action={resetPage}>
                <input type="hidden" name="slug" value={page.def.slug} />
                <ConfirmButton className="cbtn d" message="¿Volver al contenido original? Se pierden tus cambios.">
                  Restaurar original
                </ConfirmButton>
              </form>
            )}
          </span>
        }
      />
      <div className="crm-card" style={{ maxWidth: 900 }}>
        <ActionForm action={savePage} submitLabel="Guardar página">
          <input type="hidden" name="slug" value={page.def.slug} />
          <div className="row">
            <Field label="Título" htmlFor="title">
              <input id="title" name="title" type="text" required maxLength={160} defaultValue={page.title} />
            </Field>
            <Field label="Rótulo (texto chico arriba del título)" htmlFor="kicker">
              <input id="kicker" name="kicker" type="text" maxLength={60} defaultValue={page.kicker} />
            </Field>
          </div>
          <Field label="Bajada (texto debajo del título)" htmlFor="subtitle">
            <textarea id="subtitle" name="subtitle" rows={2} maxLength={300} defaultValue={page.sub} />
          </Field>
          <Field
            label="Contenido"
            help="Títulos (Título / Subtítulo), listas, citas (se muestran como recuadro destacado), negrita y enlaces. Marcadores que se completan solos con los datos de Configuración: {{emergencia}} {{suministro}} {{telefono}} {{horario}} {{direccion}} {{privacidad_email}}."
          >
            <RichTextEditor name="body" initialHtml={page.html} />
          </Field>
        </ActionForm>
      </div>
    </>
  );
}
