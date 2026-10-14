import type { News } from '@prisma/client';
import { ActionForm } from '@/components/crm/ActionForm';
import { RichTextEditor } from '@/components/crm/RichTextEditor';
import { TitleSlug } from '@/components/crm/TitleSlug';
import { Field } from '@/components/crm/ui';
import { saveNews } from '@/app/crm/(panel)/noticias/actions';
import { argDateTimeInput } from '@/lib/dates';

export function NewsForm({ news }: { news?: News }) {
  return (
    <ActionForm action={saveNews} submitLabel={news ? 'Guardar cambios' : 'Crear noticia'}>
      {news && <input type="hidden" name="id" value={news.id} />}
      <TitleSlug initialTitle={news?.title} initialSlug={news?.slug} />
      <Field label="Resumen (aparece en el listado)" htmlFor="excerpt">
        <textarea id="excerpt" name="excerpt" rows={2} maxLength={300} defaultValue={news?.excerpt ?? ''} />
      </Field>
      <div className="row r3">
        <Field label="Categoría" htmlFor="category" help="Ej. Institucional, Obras, Seguridad.">
          <input id="category" name="category" type="text" maxLength={60} defaultValue={news?.category ?? ''} />
        </Field>
        <Field label="Estado" htmlFor="status">
          <select id="status" name="status" defaultValue={news?.status ?? 'DRAFT'}>
            <option value="DRAFT">Borrador (no se ve en el sitio)</option>
            <option value="PUBLISHED">Publicada</option>
          </select>
        </Field>
        <Field label="Fecha de publicación" htmlFor="publishedAt" help="Vacía = se usa la fecha en que se publica.">
          <input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={argDateTimeInput(news?.publishedAt)} />
        </Field>
      </div>
      <Field label="Imagen de portada (JPG, PNG o WebP, máx. 5 MB)" htmlFor="cover">
        {news?.coverImageUrl && (
          <div style={{ marginBottom: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={news.coverImageUrl} alt="Portada actual" style={{ maxHeight: 120, borderRadius: 12, border: '1px solid var(--line)' }} />
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.8rem', marginTop: 6 }}>
              <input type="checkbox" name="removeCover" /> Quitar la portada actual
            </label>
          </div>
        )}
        <input id="cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" />
      </Field>
      <Field label="Cuerpo">
        <RichTextEditor name="body" initialHtml={news?.body ?? ''} />
      </Field>
    </ActionForm>
  );
}
