'use server';

import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { parseDateOnly } from '@/lib/dates';
import { deletePublicFile, UploadError, uploadPublicFile } from '@/lib/storage';
import { fail, firstZodError, formFile, formString, refreshCrm, type ActionState } from '@/lib/crm/action';

const tariffSchema = z.object({
  code: z.string().min(1, 'Ingresá el código de la categoría (ej. R1, SGP2).').max(20, 'El código es demasiado largo.'),
  name: z.string().min(1, 'Ingresá el nombre.').max(120),
  type: z.enum(['RESIDENCIAL', 'SGP'], { errorMap: () => ({ message: 'Elegí un tipo.' }) }),
  description: z.string().max(300, 'La descripción es demasiado larga.'),
  consumptionRange: z.string().max(120),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export async function saveTariff(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = formString(fd, 'id');
  const parsed = tariffSchema.safeParse({
    code: formString(fd, 'code'),
    name: formString(fd, 'name'),
    type: formString(fd, 'type'),
    description: formString(fd, 'description'),
    consumptionRange: formString(fd, 'consumptionRange'),
    sortOrder: formString(fd, 'sortOrder') || '0',
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const d = parsed.data;
  const data = {
    code: d.code,
    name: d.name,
    type: d.type,
    description: d.description || null,
    consumptionRange: d.consumptionRange || null,
    sortOrder: d.sortOrder,
    active: fd.get('active') === 'on',
  };

  try {
    if (id) await prisma.tariff.update({ where: { id }, data });
    else await prisma.tariff.create({ data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') return fail(`Ya existe una categoría con el código "${d.code}".`);
    console.error(e);
    return fail('No se pudo guardar la categoría.');
  }
  refreshCrm();
  redirect('/crm/tarifas');
}

export async function deleteTariff(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.tariff.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/tarifas');
}

export async function uploadTariffDocument(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const title = formString(fd, 'title');
  const validFrom = parseDateOnly(formString(fd, 'validFrom'));
  const file = formFile(fd, 'file');
  const externalUrl = formString(fd, 'fileUrl');
  const makeCurrent = fd.get('makeCurrent') === 'on';

  if (!title) return fail('Ingresá un título (ej. "Cuadro tarifario — Marzo 2026").');
  if (!validFrom) return fail('Ingresá la fecha desde la que rige el cuadro.');
  if (!file && !externalUrl) return fail('Subí un PDF o pegá la dirección de uno ya publicado.');
  if (!file && !/^https?:\/\//i.test(externalUrl)) return fail('La dirección debe empezar con http:// o https://');

  let fileUrl = externalUrl;
  let storagePath: string | null = null;
  if (file) {
    try {
      const up = await uploadPublicFile(file, 'tarifas', 'pdf');
      fileUrl = up.url;
      storagePath = up.path;
    } catch (e) {
      if (e instanceof UploadError) return fail(e.message);
      console.error(e);
      return fail('No se pudo subir el archivo. Revisá la configuración de Supabase Storage.');
    }
  }

  await prisma.$transaction(async (tx) => {
    if (makeCurrent) await tx.tariffDocument.updateMany({ data: { isCurrent: false } });
    await tx.tariffDocument.create({ data: { title, fileUrl, storagePath, validFrom, isCurrent: makeCurrent } });
  });
  refreshCrm();
  redirect('/crm/tarifas');
}

export async function setCurrentTariffDocument(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) {
    await prisma.$transaction([
      prisma.tariffDocument.updateMany({ data: { isCurrent: false } }),
      prisma.tariffDocument.update({ where: { id }, data: { isCurrent: true } }),
    ]);
  }
  refreshCrm();
  redirect('/crm/tarifas');
}

export async function deleteTariffDocument(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  const doc = id ? await prisma.tariffDocument.findUnique({ where: { id } }) : null;
  if (doc) {
    await prisma.tariffDocument.delete({ where: { id } });
    await deletePublicFile(doc.storagePath);
  }
  refreshCrm();
  redirect('/crm/tarifas');
}
