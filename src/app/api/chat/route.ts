import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { getChatEngine } from '@/lib/chat/engine';
import { SENSITIVE_PLACEHOLDER, SENSITIVE_REPLY, containsSensitiveData } from '@/lib/chat/guards';
import { buildWhatsAppUrl } from '@/lib/chat/whatsapp';
import type { ChatReply, ChatTurn, ReplyKind } from '@/lib/chat/types';

export const runtime = 'nodejs';

const MAX_MESSAGE = 450;
const HISTORY_LIMIT = 30;

/**
 * POST /api/chat
 * Body: { conversationId?: string, message: string }
 *
 * El historial es la fuente de verdad en la base (ChatMessage), no el que mande el navegador:
 * así nadie puede inyectar turnos falsos del bot ni alterar la "memoria" de la conversación.
 * El endpoint delega la respuesta en ChatEngine.getResponse(historial, mensaje).
 */
export async function POST(req: Request) {
  if (!rateLimit(`chat:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ ok: false, error: 'Estás escribiendo muy rápido. Esperá unos segundos.' }, { status: 429 });
  }

  let body: { conversationId?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida.' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ ok: false, error: `El mensaje debe tener entre 1 y ${MAX_MESSAGE} caracteres.` }, { status: 400 });
  }

  // Conversación existente (solo si el id es válido) o nueva
  let conversationId = typeof body.conversationId === 'string' ? body.conversationId : null;
  let history: ChatTurn[] = [];
  if (conversationId) {
    const existing = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
      select: { messages: { orderBy: { createdAt: 'desc' }, take: HISTORY_LIMIT, select: { role: true, text: true, meta: true } } },
    });
    if (existing) {
      history = existing.messages
        .reverse()
        .map((m) => ({ role: m.role === 'USER' ? 'user' : 'bot', text: m.text, meta: (m.meta ?? undefined) as ChatTurn['meta'] }));
    } else {
      conversationId = null;
    }
  }

  const sensitive = containsSensitiveData(message);
  let reply: ChatReply;
  if (sensitive) {
    reply = { text: SENSITIVE_REPLY, kind: 'blocked' };
  } else {
    try {
      reply = await getChatEngine().getResponse(history, message);
    } catch (e) {
      console.error('[api/chat] el motor falló', e);
      reply = {
        text: 'Tuve un problema para procesar tu consulta. Si es urgente, comunicate con Transgas por WhatsApp o por teléfono.',
        kind: 'error' as ReplyKind,
        handoff: { reason: 'no_match', summary: message.slice(0, 300) },
      };
    }
  }

  const whatsappUrl = reply.handoff ? buildWhatsAppUrl(process.env.WHATSAPP_NUMBER, reply.handoff.summary) : null;
  const meta = { kind: reply.kind, ...(reply.faqId ? { faqId: reply.faqId } : {}), ...(reply.handoff ? { handoff: reply.handoff.reason } : {}) };

  try {
    if (!conversationId) {
      conversationId = (await prisma.chatConversation.create({ data: {}, select: { id: true } })).id;
    }
    await prisma.$transaction([
      prisma.chatMessage.create({
        // Nunca se guardan contraseñas, tarjetas ni CBU, aunque la persona las escriba.
        data: { conversationId, role: 'USER', text: sensitive ? SENSITIVE_PLACEHOLDER : message },
      }),
      prisma.chatMessage.create({
        data: { conversationId, role: 'BOT', text: reply.text, meta: meta as Prisma.InputJsonValue },
      }),
      prisma.chatConversation.update({
        where: { id: conversationId },
        data: {
          lastActivityAt: new Date(),
          ...(reply.kind === 'faq' || reply.faqId ? { matchedFaq: true } : {}),
          ...(reply.handoff ? { whatsappHandoff: true } : {}),
          ...(reply.emergency ? { emergency: true } : {}),
        },
      }),
    ]);
  } catch (e) {
    // Si falla la persistencia igual respondemos: el chat no debe romperse por el registro.
    console.error('[api/chat] no se pudo guardar la conversación', e);
  }

  return NextResponse.json({
    ok: true,
    conversationId,
    reply: {
      text: reply.text,
      kind: reply.kind,
      emergency: !!reply.emergency,
      handoff: !!reply.handoff,
      whatsappUrl,
      suggestions: reply.suggestions ?? [],
    },
  });
}
