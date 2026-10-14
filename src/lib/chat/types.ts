/** Tipo de respuesta del bot; se guarda en ChatMessage.meta y alimenta la memoria de la conversación. */
export type ReplyKind = 'faq' | 'clarify' | 'emergency' | 'handoff' | 'blocked' | 'error';

export interface ChatMeta {
  kind?: ReplyKind;
  /** FAQ que se respondió (para interpretar repreguntas cortas). */
  faqId?: string;
}

export interface ChatTurn {
  role: 'user' | 'bot';
  text: string;
  meta?: ChatMeta;
}

export type HandoffReason = 'human_requested' | 'emergency' | 'no_match';

export interface HandoffInfo {
  reason: HandoffReason;
  /** Resumen de la consulta para pre-llenar el mensaje de WhatsApp. */
  summary: string;
}

export interface ChatReply {
  text: string;
  kind: ReplyKind;
  faqId?: string;
  emergency?: boolean;
  handoff?: HandoffInfo;
  /** Botones de respuesta rápida sugeridos. */
  suggestions?: string[];
}

/**
 * Contrato del motor de chat. Hoy hay una sola implementación (RuleBasedEngine);
 * un motor con IA (ver claudeEngine.ts) solo tiene que cumplir esta interfaz.
 */
export interface ChatEngine {
  getResponse(history: ChatTurn[], message: string): Promise<ChatReply>;
}

export interface FaqRecord {
  id: string;
  question: string;
  category: string;
  palabrasClave: string[];
  respuestas: string[];
}
