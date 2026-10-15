import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HelpAside, PageBody, PageHeader, SosBar, relatedSafety, relatedUsers } from '@/components/site/PageParts';
import { getPageDef } from '@/content/pages';
import { prisma, safe } from '@/lib/db';
import { sanitizeRichText } from '@/lib/sanitize';
import { fillTokens } from '@/lib/tokens';

/** Contenido vigente de una página: lo editado en el CRM o, si nadie lo editó, el original del código. */
export async function getEffectivePage(slug: string) {
  const def = getPageDef(slug);
  if (!def) return null;
  const row = await safe(() => prisma.page.findUnique({ where: { slug } }), null);
  return {
    def,
    edited: !!row,
    title: row?.title ?? def.title,
    kicker: row?.kicker ?? def.kicker,
    sub: row?.subtitle ?? def.sub,
    html: row?.body ?? def.html,
    updatedAt: row?.updatedAt ?? null,
  };
}

export async function contentMetadata(slug: string): Promise<Metadata> {
  const page = await getEffectivePage(slug);
  if (!page) return {};
  return { title: page.title, description: page.def.description };
}

/** Página informativa editable desde el CRM → Páginas. */
export async function ContentPage({ slug }: { slug: string }) {
  const page = await getEffectivePage(slug);
  if (!page) notFound();
  const { def } = page;
  const body = await fillTokens(sanitizeRichText(page.html));
  const sos = def.sos ? <SosBar title={def.sos.title} text={def.sos.text} flush={def.sos.placement === 'header'} /> : null;

  return (
    <>
      <PageHeader kicker={page.kicker} title={page.title} sub={page.sub} crumbs={def.crumbs} topSlot={def.sos?.placement === 'header' ? sos : undefined} />
      <PageBody aside={def.aside === 'safety' ? <HelpAside links={relatedSafety} title="Más sobre seguridad" /> : <HelpAside links={relatedUsers} />}>
        {def.sos?.placement === 'body' && sos}
        <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
      </PageBody>
    </>
  );
}
