/**
 * Seed de datos de ejemplo. Es idempotente: solo CREA lo que falta, no pisa lo que ya
 * se editó desde el CRM. Uso: npm run db:seed
 */
import path from 'node:path';
import dotenv from 'dotenv';
import { PrismaClient, type TariffType } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { faqs } from './seed-data/faqs';
import { news } from './seed-data/news';
import { cooperatives, installers } from './seed-data/directories';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

const DAY = 86_400_000;
const today = () => new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Cordoba' }).format(new Date())}T00:00:00.000Z`);

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || '').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || '';
  if (!email) {
    console.log('· Admin: SEED_ADMIN_EMAIL no definido, se omite.');
    return;
  }

  let supabaseId: string | null = null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key && password) {
    const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (created.data.user) {
      supabaseId = created.data.user.id;
      console.log(`· Admin: usuario creado en Supabase Auth (${email}).`);
    } else {
      // Ya existe: buscarlo para vincular el id
      const list = await admin.auth.admin.listUsers({ perPage: 1000 });
      supabaseId = list.data.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
      console.log(`· Admin: el usuario ya existía en Supabase Auth (${created.error?.message ?? 'ok'}).`);
    }
  } else {
    console.log('· Admin: faltan credenciales de Supabase o SEED_ADMIN_PASSWORD; solo se crea el registro local.');
  }

  await prisma.user.upsert({
    where: { email },
    update: supabaseId ? { supabaseId } : {},
    create: { email, name: 'Administrador', role: 'ADMIN', supabaseId },
  });
  console.log(`· Admin: registro en tabla users listo (${email}).`);
}

async function seedTariffs() {
  const categories: { code: string; name: string; type: TariffType }[] = [
    { code: 'R1', name: 'Residencial 1', type: 'RESIDENCIAL' },
    { code: 'R2-1', name: 'Residencial 2 · Subcategoría 1', type: 'RESIDENCIAL' },
    { code: 'R2-2', name: 'Residencial 2 · Subcategoría 2', type: 'RESIDENCIAL' },
    { code: 'R2-3', name: 'Residencial 2 · Subcategoría 3', type: 'RESIDENCIAL' },
    { code: 'R3-1', name: 'Residencial 3 · Subcategoría 1', type: 'RESIDENCIAL' },
    { code: 'R3-2', name: 'Residencial 3 · Subcategoría 2', type: 'RESIDENCIAL' },
    { code: 'R3-3', name: 'Residencial 3 · Subcategoría 3', type: 'RESIDENCIAL' },
    { code: 'R3-4', name: 'Residencial 3 · Subcategoría 4', type: 'RESIDENCIAL' },
    { code: 'R4', name: 'Residencial 4', type: 'RESIDENCIAL' },
    { code: 'SGP1', name: 'Servicio General P · 1', type: 'SGP' },
    { code: 'SGP2', name: 'Servicio General P · 2', type: 'SGP' },
    { code: 'SGP3-a', name: 'Servicio General P · 3-a', type: 'SGP' },
    { code: 'SGP3-b', name: 'Servicio General P · 3-b', type: 'SGP' },
  ];
  let created = 0;
  for (const [i, c] of categories.entries()) {
    const exists = await prisma.tariff.findUnique({ where: { code: c.code } });
    if (exists) continue;
    await prisma.tariff.create({
      data: {
        ...c,
        description: c.type === 'SGP' ? 'Servicio general (comercios y pequeñas industrias), según consumo anual.' : 'Usuario residencial, según consumo anual.',
        sortOrder: i,
      },
    });
    created++;
  }
  console.log(`· Tarifas: ${created} categorías creadas.`);

  const title = 'Cuadro Tarifario Transgas — Enero 2026';
  if (!(await prisma.tariffDocument.findFirst({ where: { title } }))) {
    await prisma.tariffDocument.create({
      data: {
        title,
        fileUrl: 'https://transgas.com.ar/wp-content/uploads/2026/01/Cuadro-Tarifario-Transgas-Enero-2026.pdf',
        validFrom: new Date('2026-01-01T00:00:00.000Z'),
        isCurrent: true,
      },
    });
    console.log('· Tarifas: PDF vigente cargado (enlace al sitio actual de Transgas).');
  }
}

/**
 * Noticias iniciales. Por defecto solo crea las que faltan (no pisa ediciones del CRM).
 * Con --update-news reemplaza título, resumen, cuerpo e imagen de estas dos noticias por la versión del seed.
 */
async function seedNews() {
  const update = process.argv.includes('--update-news');
  let created = 0;
  let updated = 0;
  for (const { daysAgo, ...n } of news) {
    const existing = await prisma.news.findUnique({ where: { slug: n.slug } });
    if (!existing) {
      await prisma.news.create({ data: { ...n, status: 'PUBLISHED', publishedAt: new Date(Date.now() - daysAgo * DAY) } });
      created++;
    } else if (update) {
      await prisma.news.update({ where: { id: existing.id }, data: n });
      updated++;
    }
  }
  console.log(`· Noticias: ${created} creadas, ${updated} actualizadas.${update ? '' : ' Para actualizar las existentes: npm run db:seed:news'}`);
}

async function seedDueDate() {
  if ((await prisma.dueDate.count()) > 0) return;
  const t = today();
  await prisma.dueDate.create({
    data: {
      dueDate: new Date(t.getTime() + 10 * DAY),
      showFrom: t,
      message: 'Está vigente el vencimiento de tu factura. Recordá abonarla antes de la fecha indicada.',
    },
  });
  console.log('· Vencimientos: 1 creado (vigente desde hoy, 10 días).');
}

async function seedServiceStatus() {
  if ((await prisma.serviceStatus.count()) > 0) return;
  const start = new Date(Date.now() + 3 * DAY);
  start.setUTCHours(11, 0, 0, 0); // 08:00 hs Argentina
  await prisma.serviceStatus.create({
    data: {
      title: 'Corte programado por tareas de mantenimiento',
      description: 'Aviso de ejemplo: se realizarán tareas de mantenimiento sobre la red. Se puede interrumpir el suministro durante el trabajo. Editá o eliminá este aviso desde el CRM.',
      zone: 'General Levalle',
      startsAt: start,
      estimatedEndAt: new Date(start.getTime() + 6 * 3_600_000),
      status: 'PROGRAMADO',
    },
  });
  console.log('· Estado del servicio: 1 aviso de ejemplo creado.');
}

async function seedCooperatives() {
  let created = 0;
  let filled = 0;
  for (const [i, c] of cooperatives.entries()) {
    const existing = await prisma.cooperative.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.cooperative.create({
        data: { name: c.name, legalName: c.legalName, address: c.address, phone: c.phone, email: c.email, schedule: c.schedule, sortOrder: i },
      });
      created++;
      continue;
    }
    // Ya existe: solo se completan campos vacíos (no se pisa lo editado desde el CRM).
    const patch: Record<string, string> = {};
    if (!existing.address) patch.address = c.address;
    if (!existing.phone) patch.phone = c.phone;
    if (!existing.email) patch.email = c.email;
    if (!existing.schedule) patch.schedule = c.schedule;
    if (!existing.legalName || existing.legalName === c.oldLegalName) patch.legalName = c.legalName;
    if (Object.keys(patch).length) {
      await prisma.cooperative.update({ where: { id: existing.id }, data: patch });
      filled++;
    }
  }
  console.log(`· Cooperativas: ${created} creadas, ${filled} completadas con datos reales (editables desde el CRM).`);
}

async function seedInstallers() {
  // Los gasistas "de ejemplo" del seed anterior se reemplazan por el listado real.
  const removed = await prisma.licensedInstaller.deleteMany({ where: { license: { startsWith: 'EJ-' } } });
  let created = 0;
  for (const g of installers) {
    if (await prisma.licensedInstaller.findFirst({ where: { license: g.license } })) continue;
    await prisma.licensedInstaller.create({ data: { name: g.name, license: g.license, address: g.address ?? null, phone: g.phone ?? null, locality: g.locality } });
    created++;
  }
  console.log(`· Gasistas: ${created} cargados del listado real (${removed.count} de ejemplo eliminados).`);
}

/**
 * FAQ del chatbot. Por defecto solo crea las que faltan (no pisa ediciones del CRM).
 * Con --update-faqs actualiza también las existentes con el contenido del seed (por pregunta).
 */
async function seedFaqs() {
  const update = process.argv.includes('--update-faqs');
  let created = 0;
  let updated = 0;
  for (const f of faqs) {
    const data = { question: f.question, category: f.category, palabrasClave: f.palabrasClave, respuestas: f.respuestas, followUps: f.followUps ?? [] };
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data });
      created++;
    } else if (update) {
      await prisma.faq.update({ where: { id: existing.id }, data });
      updated++;
    }
  }
  console.log(`· FAQ: ${created} creadas, ${updated} actualizadas (${faqs.length} en el seed).${update ? '' : ' Para actualizar las existentes: npm run db:seed:faqs'}`);
}

async function main() {
  console.log('Sembrando datos de ejemplo…');
  await seedTariffs();
  await seedNews();
  await seedDueDate();
  await seedServiceStatus();
  await seedCooperatives();
  await seedInstallers();
  await seedFaqs();
  await seedAdmin();
  console.log('Listo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
