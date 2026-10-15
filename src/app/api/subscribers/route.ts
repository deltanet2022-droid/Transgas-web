import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mailConfigured } from '@/lib/mail';
import { PRIVACY_VERSION } from '@/lib/privacy';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { sendConfirmation } from '@/lib/subscribers';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * POST /api/subscribers — pedido de suscripción a avisos de vencimiento.
 * La persona recibe un mail para CONFIRMAR; hasta entonces no se le envía nada.
 * La respuesta es siempre la misma exista o no el correo (no revela quién está suscripto).
 */
export async function POST(req: Request) {
  if (!rateLimit(`subs:${clientIp(req)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Demasiados intentos. Probá de nuevo en un rato.' }, { status: 429 });
  }
  let body: { email?: unknown; clientNumber?: unknown; privacidad?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida.' }, { status: 400 });
  }
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true }); // honeypot

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const clientNumber = typeof body.clientNumber === 'string' ? body.clientNumber.trim().slice(0, 30) : '';
  if (!EMAIL_RE.test(email) || email.length > 160) return NextResponse.json({ ok: false, error: 'Ingresá un correo válido.' }, { status: 422 });
  if (body.privacidad !== true) return NextResponse.json({ ok: false, error: 'Tenés que aceptar la Política de Privacidad para suscribirte.' }, { status: 422 });
  if (!(await mailConfigured())) return NextResponse.json({ ok: false, error: 'Este servicio todavía no está disponible. Probá más adelante.' }, { status: 503 });

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing?.confirmedAt && !existing.unsubscribedAt) {
    return NextResponse.json({ ok: true }); // ya está activo: no se hace nada ni se informa
  }
  const sub = await prisma.subscriber.upsert({
    where: { email },
    create: { email, clientNumber: clientNumber || null, consentVersion: PRIVACY_VERSION },
    update: { clientNumber: clientNumber || null, confirmedAt: null, unsubscribedAt: null, consentAt: new Date(), consentVersion: PRIVACY_VERSION },
  });
  const res = await sendConfirmation(sub);
  if (!res.ok) return NextResponse.json({ ok: false, error: 'No pudimos enviar el mail de confirmación. Probá de nuevo en unos minutos.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
