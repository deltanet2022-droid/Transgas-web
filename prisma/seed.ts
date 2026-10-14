/**
 * Seed de datos de ejemplo. Es idempotente: solo CREA lo que falta, no pisa lo que ya
 * se editó desde el CRM. Uso: npm run db:seed
 */
import path from 'node:path';
import dotenv from 'dotenv';
import { PrismaClient, type TariffType } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { faqs } from './seed-data/faqs';

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

async function seedNews() {
  const items = [
    {
      slug: 'bienvenidos-al-nuevo-sitio-de-transgas',
      title: 'Bienvenidos al nuevo sitio de Transgas',
      excerpt: 'Renovamos nuestra web para que gestionar tu servicio, consultar tarifas y encontrar información de seguridad sea más simple.',
      category: 'Institucional',
      body:
        '<p>Estrenamos un nuevo sitio pensado para acompañarte en cada gestión: <strong>factura, trámites, tarifas, seguridad y emergencias</strong>, todo a pocos clics.</p>' +
        '<h2>¿Qué hay de nuevo?</h2><ul><li>Formularios de autogestión para informar pagos, medidores y pedir nuevos servicios.</li><li>Un espacio de <em>Estado del servicio</em> con cortes programados y avisos por zona.</li><li>Un asistente virtual para orientarte las 24 horas.</li></ul>' +
        '<p>Si encontrás algo para mejorar, escribinos desde la sección de <a href="/contacto">contacto</a>.</p>',
      publishedAt: new Date(Date.now() - 2 * DAY),
    },
    {
      slug: 'recomendaciones-para-el-uso-seguro-del-gas-en-invierno',
      title: 'Recomendaciones para el uso seguro del gas en invierno',
      excerpt: 'Con el frío aumenta el uso de estufas y calefones. Repasá estos consejos para cuidarte a vos y a tu familia.',
      category: 'Seguridad',
      body:
        '<p>En invierno aumenta el consumo de gas y también los riesgos. Tené en cuenta:</p>' +
        '<ul><li>Ventilá siempre los ambientes donde haya artefactos encendidos.</li><li>Revisá tus instalaciones con un <a href="/profesionales/gasistas-matriculados">gasista matriculado</a>.</li><li>No uses hornallas ni el horno para calefaccionar.</li><li>Ante olor a gas, no accionés interruptores y llamá al <strong>0800-777-8427</strong>.</li></ul>' +
        '<p>Conocé más en nuestra guía de <a href="/seguridad/monoxido-de-carbono">prevención de monóxido de carbono</a>.</p>',
      publishedAt: new Date(Date.now() - 1 * DAY),
    },
  ];
  let created = 0;
  for (const n of items) {
    if (await prisma.news.findUnique({ where: { slug: n.slug } })) continue;
    await prisma.news.create({ data: { ...n, status: 'PUBLISHED' } });
    created++;
  }
  console.log(`· Noticias: ${created} creadas.`);
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
  const coops = [
    ['Ítalo', 'Cooperativa de Provisión de Electricidad y Obras y Servicios Públicos'],
    ['Jovita', 'Cooperativa Eléctrica Jovita Limitada'],
    ['La Cesira', 'Cooperativa de Electricidad, Vivienda y Anexos'],
    ['Mattaldi', 'Cooperativa de Electricidad y Servicios Públicos'],
    ['Pueblo Italiano', 'Cooperativa de Servicios Públicos'],
    ['Serrano', 'Cooperativa de Servicios Públicos y Sociales'],
    ['Viamonte', 'Cooperativa de Consumo Popular de Electricidad y Servicios Anexos'],
    ['Villa Valeria', 'Cooperativa de Electricidad Ltda.'],
  ];
  let created = 0;
  for (const [i, [name, legalName]] of coops.entries()) {
    if (await prisma.cooperative.findFirst({ where: { name } })) continue;
    // Dirección, teléfono y horario: completar desde el CRM con los datos reales.
    await prisma.cooperative.create({ data: { name, legalName, sortOrder: i } });
    created++;
  }
  console.log(`· Cooperativas: ${created} creadas (completar dirección/teléfono/horario desde el CRM).`);
}

async function seedInstallers() {
  const items = [
    { name: 'Gasista de ejemplo 1', license: 'EJ-0001', locality: 'General Levalle', phone: '3385 000001' },
    { name: 'Gasista de ejemplo 2', license: 'EJ-0002', locality: 'Mattaldi', phone: '3385 000002' },
    { name: 'Gasista de ejemplo 3', license: 'EJ-0003', locality: 'Serrano', phone: '3385 000003' },
  ];
  let created = 0;
  for (const g of items) {
    if (await prisma.licensedInstaller.findFirst({ where: { license: g.license } })) continue;
    await prisma.licensedInstaller.create({ data: g });
    created++;
  }
  console.log(`· Gasistas: ${created} de ejemplo creados (reemplazar por el listado real).`);
}

async function seedFaqs() {
  let created = 0;
  for (const f of faqs) {
    if (await prisma.faq.findFirst({ where: { question: f.question } })) continue;
    await prisma.faq.create({ data: f });
    created++;
  }
  console.log(`· FAQ: ${created} creadas (${faqs.length} en el seed).`);
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
