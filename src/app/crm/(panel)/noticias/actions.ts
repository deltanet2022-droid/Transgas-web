'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { parseArgDateTime } from '@/lib/dates';
import { sanitizeRichText } from '@/lib/sanitize';
import { slugify } from '@/lib/slug';
import { deletePublicFile, UploadError, uploadPublicFile } from '@/lib/storage';
import { fail, firstZodError, formFile, formString, refreshCrm, saved, type ActionState } from '@/lib/crm/action';

const schema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.').max(160),
  excerpt: z.string().max(300, 'El resumen puede tener hasta 300 caracteres.'),
  category: z.string().max(60),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

/** Extrae la ruta interna del bucket a partir de la URL pública, para poder borrar portadas viejas. */
function storagePathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const m = /\/object\/public\/[^/]+\/(.+)$/.exec(url);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function saveNews(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = formString(fd, 'id');
  const parsed = schema.safeParse({
    title: formString(fd, 'title'),
    excerpt: formString(fd, 'excerpt'),
    category: formString(fd, 'category'),
    status: formString(fd, 'status'),
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const d = parsed.data;

  const bodyRaw = typeof fd.get('body') === 'string' ? (fd.get('body') as string) : '';
  const body = sanitizeRichText(bodyRaw).trim();
  if (!body) return fail('El cuerpo de la noticia no puede estar vacío.');

  const slug = slugify(formString(fd, 'slug') || d.title);
  if (!slug) return fail('No se pudo generar el slug. Escribí uno manualmente.');
  const clash = await prisma.news.findFirst({ where: { slug, NOT: id ? { id } : undefined }, select: { id: true } });
  if (clash) return fail(`Ya existe otra noticia con el slug "${slug}". Cambiá el título o el slug.`);

  const existing = id ? await prisma.news.findUnique({ where: { id }, select: { coverImageUrl: true, publishedAt: true } }) : null;

  // Fecha de publicación: la indicada, o la ya guardada, o ahora si se publica sin fecha.
  let publishedAt = parseArgDateTime(formString(fd, 'publishedAt')) ?? existing?.publishedAt ?? null;
  if (d.status === 'PUBLISHED' && !publishedAt) publishedAt = new Date();

  // Portada
  let coverImageUrl = existing?.coverImageUrl ?? null;
  const cover = formFile(fd, 'cover');
  const removeCover = fd.get('removeCover') === 'on';
  const oldPath = storagePathFromUrl(coverImageUrl);
  if (cover) {
    try {
      coverImageUrl = (await uploadPublicFile(cover, 'noticias', 'image')).url;
    } catch (e) {
      if (e instanceof UploadError) return fail(e.message);
      console.error(e);
      return fail('No se pudo subir la imagen. Revisá la configuración de Supabase Storage.');
    }
  } else if (removeCover) {
    coverImageUrl = null;
  }

  const data = { title: d.title, slug, excerpt: d.excerpt || null, category: d.category || null, status: d.status, body, publishedAt, coverImageUrl };
  if (id) await prisma.news.update({ where: { id }, data });
  else await prisma.news.create({ data });

  if (oldPath && (cover || removeCover) && coverImageUrl !== existing?.coverImageUrl) await deletePublicFile(oldPath);

  refreshCrm();
  return saved('/crm/noticias', 'Noticia guardada.');
}

export async function deleteNews(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  const n = id ? await prisma.news.findUnique({ where: { id }, select: { coverImageUrl: true } }) : null;
  if (n) {
    await prisma.news.delete({ where: { id } });
    await deletePublicFile(storagePathFromUrl(n.coverImageUrl));
  }
  refreshCrm();
  redirect('/crm/noticias');
}
