import 'server-only';
import { prisma } from '@/lib/db';
import { formatDateOnly, todayAR } from '@/lib/dates';
import { site } from '@/lib/site';
import { fillTokens } from '@/lib/tokens';
import { getSettings } from '@/lib/settings';
import { normalize } from './normalize';

/**
 * Bloques dinámicos para las respuestas del chatbot: la FAQ guarda un marcador y el dato real
 * se lee del CRM al responder, así nunca queda desactualizado.
 *
 *   {{localidad:Jovita}}  → datos de la cooperativa de esa localidad + gasistas matriculados de la zona
 *   {{vencimiento}}       → próximo vencimiento cargado en el CRM
 */
const DYNAMIC = new Set(['localidad', 'vencimiento']);
const TOKEN_RE = /\{\{\s*([a-z]+)\s*(?::\s*([^}]+?))?\s*\}\}/gi;

export async function expandDynamic(text: string): Promise<string> {
  if (!text.includes('{{')) return text;
  const matches = [...text.matchAll(TOKEN_RE)];
  let out = text;
  for (const m of matches) {
    if (!DYNAMIC.has(m[1].toLowerCase())) continue; // {{emergencia}}, {{telefono}}… los resuelve fillTokens
    let replacement = '';
    try {
      replacement = await resolveToken(m[1].toLowerCase(), (m[2] ?? '').trim());
    } catch (e) {
      console.error('[chat] no se pudo resolver', m[0], e);
    }
    out = out.replace(m[0], replacement);
  }
  return (await fillTokens(out)).replace(/\n{3,}/g, '\n\n').trim();
}

async function resolveToken(name: string, arg: string): Promise<string> {
  if (name === 'localidad') return locality(arg);
  if (name === 'vencimiento') return nextDueDate();
  return '';
}

async function locality(name: string): Promise<string> {
  const key = normalize(name);
  const [coops, installers] = await Promise.all([
    prisma.cooperative.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.licensedInstaller.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
  ]);
  const coop = coops.filter((c) => normalize(c.name) === key);
  const pros = installers.filter((i) => normalize(i.locality) === key);

  const blocks: string[] = [];
  for (const c of coop) {
    const lines = [`🏢 ${c.legalName ?? c.name}`];
    if (c.address) lines.push(`📍 ${c.address}`);
    if (c.phone) lines.push(`📞 ${c.phone}`);
    if (c.email) lines.push(`✉️ ${c.email}`);
    if (c.schedule) lines.push(`🕒 ${c.schedule}`);
    blocks.push(lines.join('\n'));
  }
  if (pros.length) {
    const rows = pros.map((p) => {
      const extra = [p.address, p.phone].filter(Boolean).join(' · ');
      return `• ${p.name} (Mat. ${p.license})${extra ? ` — ${extra}` : ''}`;
    });
    blocks.push(`🔧 Gasistas matriculados en ${name}:\n${rows.join('\n')}`);
  }
  if (!blocks.length) return `Todavía no tengo datos cargados para ${name}. Podés consultar en ${(await getSettings()).attentionPhone} (${site.schedule.toLowerCase()}).`;
  return blocks.join('\n\n');
}

async function nextDueDate(): Promise<string> {
  const due = await prisma.dueDate.findFirst({
    where: { dueDate: { gte: todayAR() } },
    orderBy: { dueDate: 'asc' },
    include: { tariff: { select: { code: true } } },
  });
  if (!due) return 'La fecha de vencimiento figura en tu factura.';
  return `El próximo vencimiento cargado es el ${formatDateOnly(due.dueDate)}${due.tariff ? ` (categoría ${due.tariff.code})` : ''}. La fecha exacta de tu factura figura en el comprobante.`;
}
