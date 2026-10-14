import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { LEAD_FORMS, isLeadType, splitLeadValues, validateLead } from '@/lib/leads/config';

export const runtime = 'nodejs';

/**
 * POST /api/leads
 * Body: { type: LeadType, values: { campo: valor }, website?: string (honeypot) }
 * El tipo lo fija cada página; los campos se validan con la misma config que el formulario.
 */
export async function POST(req: Request) {
  if (!rateLimit(`leads:${clientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Demasiados envíos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }

  let body: { type?: unknown; values?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida.' }, { status: 400 });
  }

  // Honeypot: los bots completan este campo oculto. Respondemos "ok" sin guardar nada.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true, ref: 'XXXXXX' });
  }

  if (!isLeadType(body.type)) {
    return NextResponse.json({ ok: false, error: 'Tipo de formulario inválido.' }, { status: 400 });
  }
  if (typeof body.values !== 'object' || body.values === null) {
    return NextResponse.json({ ok: false, error: 'Faltan datos.' }, { status: 400 });
  }

  const config = LEAD_FORMS[body.type];
  const result = validateLead(config, body.values as Record<string, unknown>);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: 'Revisá los campos marcados.', errors: result.errors }, { status: 422 });
  }

  const { core, extraData } = splitLeadValues(result.values);
  try {
    const lead = await prisma.lead.create({
      data: { type: config.type, name: core.name, email: core.email, phone: core.phone, message: core.message, extraData },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, ref: lead.id.slice(-6).toUpperCase() }, { status: 201 });
  } catch (e) {
    console.error('[api/leads] error al guardar', e);
    return NextResponse.json({ ok: false, error: 'No pudimos guardar tu solicitud. Intentá de nuevo en unos minutos.' }, { status: 500 });
  }
}
