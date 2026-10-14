import type { ChatEngine, ChatReply, ChatTurn } from './types';

/**
 * Stub para una futura fase con IA. A propósito NO está implementado ni conectado:
 * en la Fase 1 el chatbot funciona solo con reglas (ver ruleBasedEngine.ts).
 * Cuando llegue el momento, alcanza con implementar getResponse() y sumar "claude"
 * a la fábrica de engine.ts — el endpoint /api/chat y el widget no cambian.
 */
export class ClaudeEngine implements ChatEngine {
  async getResponse(_history: ChatTurn[], _message: string): Promise<ChatReply> {
    throw new Error('not implemented');
  }
}
