'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { sanitizeRichText } from '@/lib/sanitize';
import { getPageDef } from '@/content/pages';
import { fail, firstZodError, formString, refreshCrm, success, type ActionState } from '@/lib/crm/action';

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(3, 'Escribí un título (mín. 3 caracteres).').max(160),
  kicker: z.string().max(60),
  subtitle: z.string().max(300, 'La bajada puede tener hasta 300 caracteres.'),
});

export async function savePage(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = schema.safeParse({ slug: formString(fd, 'slug'), title: formString(fd, 'title'), kicker: formString(fd, 'kicker'), subtitle: formString(fd, 'subtitle') });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const d = parsed.data;
  if (!getPageDef(d.slug)) return fail('Esa página no existe.');

  const body = sanitizeRichText(typeof fd.get('body') === 'string' ? (fd.get('body') as string) : '').trim();
  if (!body) return fail('El contenido no puede quedar vacío.');

  const data = { title: d.title, kicker: d.kicker || null, subtitle: d.subtitle || null, body, updatedBy: user.email };
  await prisma.page.upsert({ where: { slug: d.slug }, update: data, create: { slug: d.slug, ...data } });
  refreshCrm();
  return success('Página guardada. Ya se ve en el sitio.');
}

/** Vuelve al contenido original (el que viene en el código). */
export async function resetPage(fd: FormData) {
  await requireUser();
  const slug = formString(fd, 'slug');
  if (slug) await prisma.page.delete({ where: { slug } }).catch(() => null);
  refreshCrm();
  redirect('/crm/paginas');
}
