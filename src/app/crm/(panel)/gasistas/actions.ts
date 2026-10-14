'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { fail, firstZodError, formString, refreshCrm, type ActionState } from '@/lib/crm/action';

const schema = z.object({
  name: z.string().min(2, 'Ingresá el nombre del profesional.').max(120),
  license: z.string().min(1, 'Ingresá la matrícula.').max(40),
  address: z.string().max(160),
  locality: z.string().min(2, 'Ingresá la localidad.').max(100),
  phone: z.string().max(80),
  email: z.union([z.literal(''), z.string().email('El email no es válido.').max(160)]),
});

export async function saveInstaller(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = formString(fd, 'id');
  const parsed = schema.safeParse({
    name: formString(fd, 'name'),
    license: formString(fd, 'license'),
    address: formString(fd, 'address'),
    locality: formString(fd, 'locality'),
    phone: formString(fd, 'phone'),
    email: formString(fd, 'email'),
  });
  if (!parsed.success) return fail(firstZodError(parsed.error));
  const d = parsed.data;
  const data = { name: d.name, license: d.license, locality: d.locality, address: d.address || null, phone: d.phone || null, email: d.email || null, active: fd.get('active') === 'on' };
  if (id) await prisma.licensedInstaller.update({ where: { id }, data });
  else await prisma.licensedInstaller.create({ data });
  refreshCrm();
  redirect('/crm/gasistas');
}

export async function deleteInstaller(fd: FormData) {
  await requireUser();
  const id = formString(fd, 'id');
  if (id) await prisma.licensedInstaller.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  redirect('/crm/gasistas');
}
