import 'server-only';
import { prisma } from '@/lib/db';
import { site } from '@/lib/site';
import type { ChatEngine, FaqRecord } from './types';
import { RuleBasedEngine } from './ruleBasedEngine';

let faqCache: { at: number; data: FaqRecord[] } | null = null;
const FAQ_TTL_MS = 30_000;

/** FAQ activas desde la base, con un caché corto para no consultar en cada mensaje. */
async function loadFaqs(): Promise<FaqRecord[]> {
  if (faqCache && Date.now() - faqCache.at < FAQ_TTL_MS) return faqCache.data;
  const data = await prisma.faq.findMany({
    where: { active: true },
    select: { id: true, question: true, category: true, palabrasClave: true, respuestas: true },
  });
  faqCache = { at: Date.now(), data };
  return data;
}

export function invalidateFaqCache() {
  faqCache = null;
}

/** Valores aceptados hoy para CHAT_ENGINE. */
export const SUPPORTED_ENGINES = ['rules'] as const;

let instance: ChatEngine | null = null;

/** Elige el engine según la variable de entorno CHAT_ENGINE (hoy solo "rules"). */
export function getChatEngine(): ChatEngine {
  if (instance) return instance;
  const name = (process.env.CHAT_ENGINE ?? 'rules').trim();
  switch (name) {
    case 'rules':
      instance = new RuleBasedEngine({
        getFaqs: loadFaqs,
        emergencyPhone: process.env.EMERGENCY_PHONE_DISPLAY || site.emergencyPhone,
      });
      return instance;
    default:
      throw new Error(`CHAT_ENGINE="${name}" no es válido. Valores aceptados: ${SUPPORTED_ENGINES.join(', ')}.`);
  }
}
