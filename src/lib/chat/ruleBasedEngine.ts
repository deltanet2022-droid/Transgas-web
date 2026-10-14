import type { ChatEngine, ChatMeta, ChatReply, ChatTurn, FaqRecord, HandoffInfo } from './types';
import { fuzzyEqual, normalize, tokenize } from './normalize';

export interface RuleBasedEngineOptions {
  /** Devuelve las FAQ activas (única fuente de respuestas). */
  getFaqs: () => Promise<FaqRecord[]>;
  emergencyPhone: string;
  /** Puntaje mínimo para considerar que una FAQ responde la consulta. */
  minScore?: number;
  /** Inyectable para tests. */
  random?: () => number;
}

const DEFAULT_MIN_SCORE = 2;

const EMERGENCY_RE =
  /(olor|huele|oler|olfate).{0,20}gas|\bgas\b.{0,20}(olor|huele)|\bfuga\b|escape de gas|perdida de gas|monoxido|intoxic|explosi|incendi|llamarada|emergencia|urgencia|urgente/;
const HUMAN_RE =
  /(hablar|comunicar|comunicarme|contactar|contactarme|pasar|pasame|derivar|derivame|atienda|atender|chatear).{0,25}(persona|humano|operador|agente|asesor|alguien|representante|empleado)|(persona|humano|operador|asesor|representante) (real|de carne)|atencion al cliente|quiero (una |un )?(persona|humano|operador|asesor)|hablar con (una |un )?(persona|humano|operador|asesor|alguien)/;
/** Marcadores de repregunta que dependen del tema anterior. */
const DEICTIC_RE = /\b(eso|esto|ese|esa|lo mismo|ahi|alli|tambien|y si|y eso|y entonces|y para|y cuanto|y cuando|y donde|y como)\b/;

const DEFAULT_SAFETY =
  'Si sentís olor a gas: salí del lugar, no accionés llaves de luz ni aparatos eléctricos, no uses fuego y llamá desde un lugar abierto.';

export const CLARIFY_TEXT = '¿Es sobre tu factura, sobre una emergencia, o sobre un trámite?';
export const CLARIFY_SUGGESTIONS = ['Mi factura', 'Una emergencia', 'Un trámite'];

interface PreparedFaq {
  faq: FaqRecord;
  keywords: { tokens: string[]; phrase: string }[];
  questionTokens: Set<string>;
  keywordTokens: Set<string>;
}

interface Scored {
  prepared: PreparedFaq;
  score: number;
  hits: number;
}

export class RuleBasedEngine implements ChatEngine {
  private readonly min: number;
  private readonly rnd: () => number;
  private cache: { key: string; prepared: PreparedFaq[] } | null = null;

  constructor(private readonly opts: RuleBasedEngineOptions) {
    this.min = opts.minScore ?? DEFAULT_MIN_SCORE;
    this.rnd = opts.random ?? Math.random;
  }

  async getResponse(history: ChatTurn[], message: string): Promise<ChatReply> {
    const faqs = await this.prepared();
    const norm = normalize(message);
    const tokens = tokenize(message);

    const lastFaqId = [...history].reverse().find((t) => t.role === 'bot' && t.meta?.faqId)?.meta?.faqId;
    const lastFaq = lastFaqId ? faqs.find((f) => f.faq.id === lastFaqId) : undefined;
    const lastBotText = [...history].reverse().find((t) => t.role === 'bot')?.text;

    // ── 1. Emergencia: el 0800 va primero, antes que cualquier otra cosa ──
    if (EMERGENCY_RE.test(norm)) {
      const best = this.best(faqs, tokens, norm);
      const related =
        best && best.score >= this.min && /emergencia|seguridad/.test(normalize(best.prepared.faq.category)) ? best.prepared.faq : null;
      const text = `${this.emergencyIntro()}\n\n${related ? this.pickVariant(related.respuestas, lastBotText) : DEFAULT_SAFETY}`;
      return {
        text,
        kind: 'emergency',
        emergency: true,
        faqId: related?.id,
        handoff: this.handoff('emergency', history, message),
      };
    }

    // ── 2. Pide hablar con una persona ──
    if (HUMAN_RE.test(norm)) {
      return {
        text: 'Por supuesto. Tocá el botón y se abre WhatsApp con tu consulta ya escrita para que una persona del equipo te atienda.',
        kind: 'handoff',
        handoff: this.handoff('human_requested', history, message),
      };
    }

    // ── 3. Mejor FAQ por puntaje ──
    let pick = this.best(faqs, tokens, norm);

    // ── 4. Repregunta corta que depende del tema anterior ("¿y eso cuánto tarda?") ──
    if (lastFaq && tokens.length <= 6 && (!pick || pick.score < this.min || DEICTIC_RE.test(norm))) {
      const ctx = this.bestWithContext(faqs, tokens, norm, lastFaq);
      if (ctx && ctx.score >= this.min && (!pick || ctx.score > pick.score)) pick = ctx;
    }

    if (pick && pick.score >= this.min) {
      const f = pick.prepared.faq;
      return { text: this.pickVariant(f.respuestas, lastBotText), kind: 'faq', faqId: f.id };
    }

    // ── 5. Sin match: repreguntar una vez; si ya se repreguntó, derivar a WhatsApp ──
    if (this.consecutiveClarifies(history) >= 1) {
      return {
        text: 'No logro encontrar una respuesta para eso. Para no hacerte perder tiempo, te paso con una persona del equipo por WhatsApp.',
        kind: 'handoff',
        handoff: this.handoff('no_match', history, message),
      };
    }
    return { text: `No estoy seguro de haber entendido. ${CLARIFY_TEXT}`, kind: 'clarify', suggestions: CLARIFY_SUGGESTIONS };
  }

  // ───────────────────────── helpers ─────────────────────────

  /** Primera línea de toda respuesta de emergencia: el 0800, antes que cualquier otra cosa. */
  private emergencyIntro(): string {
    return `🚨 Emergencias 24 hs: llamá ahora al ${this.opts.emergencyPhone}.`;
  }

  private handoff(reason: HandoffInfo['reason'], history: ChatTurn[], message: string): HandoffInfo {
    const users = history.filter((t) => t.role === 'user').map((t) => t.text);
    const recent = [...users.slice(-3), message].filter((t) => !t.startsWith('[')).join(' | ');
    return { reason, summary: recent.slice(0, 300) };
  }

  private consecutiveClarifies(history: ChatTurn[]): number {
    let n = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      const t = history[i];
      if (t.role !== 'bot') continue;
      if ((t.meta as ChatMeta | undefined)?.kind === 'clarify') n++;
      else break;
    }
    return n;
  }

  /** Elige al azar una variante, evitando repetir literalmente la última respuesta del bot. */
  private pickVariant(variants: string[], lastBotText?: string): string {
    const pool = variants.filter((v) => v.trim());
    if (!pool.length) return 'Por ahora no tengo una respuesta cargada para eso.';
    const fresh = pool.filter((v) => v !== lastBotText);
    const from = fresh.length ? fresh : pool;
    return from[Math.floor(this.rnd() * from.length)];
  }

  private async prepared(): Promise<PreparedFaq[]> {
    const faqs = await this.opts.getFaqs();
    const key = faqs.map((f) => `${f.id}:${f.palabrasClave.join(',')}:${f.question}`).join('|');
    if (this.cache?.key === key) return this.cache.prepared;

    const prepared = faqs.map<PreparedFaq>((faq) => {
      const keywords = faq.palabrasClave
        .map((k) => {
          const tokens = tokenize(k);
          return { tokens, phrase: tokens.join(' ') };
        })
        .filter((k) => k.tokens.length);
      return {
        faq,
        keywords,
        questionTokens: new Set(tokenize(faq.question)),
        keywordTokens: new Set(keywords.flatMap((k) => k.tokens)),
      };
    });
    this.cache = { key, prepared };
    return prepared;
  }

  /** Puntaje de una FAQ contra los tokens del mensaje. */
  private score(p: PreparedFaq, tokens: string[], norm: string): Scored {
    const msg = ` ${tokens.join(' ')} `;
    const set = new Set(tokens);
    const hit = (t: string) => (set.has(t) ? 1 : tokens.some((m) => fuzzyEqual(m, t)) ? 0.7 : 0);

    const found: { s: number; full: boolean }[] = [];
    for (const kw of p.keywords) {
      const n = kw.tokens.length;
      let s = 0;
      let full = false;
      if (msg.includes(` ${kw.phrase} `)) {
        s = 2 + 1.5 * (n - 1); // frase completa y contigua
        full = true;
      } else {
        const sum = kw.tokens.reduce((a, t) => a + hit(t), 0);
        const coverage = sum / n;
        if (n >= 2 && coverage >= 0.99) {
          s = 1.6 + 1.2 * (n - 1); // todas las palabras, no contiguas
          full = true;
        } else if (n >= 2 && coverage >= 0.5) s = coverage * 0.8 * n; // parcial: sola no alcanza, con contexto sí
        else if (n === 1 && sum > 0) s = 1.2; // aproximada (typo)
      }
      if (s > 0) found.push({ s, full });
    }
    // La mejor palabra clave manda; las demás completas suman poco, para que no gane la FAQ
    // que simplemente tiene más palabras clave cargadas. Las parciales no se acumulan.
    found.sort((a, b) => b.s - a.s);
    const hits = found.length;
    let score = hits ? found[0].s + 0.35 * found.slice(1).reduce((a, k) => a + (k.full ? k.s : 0), 0) : 0;
    // Pequeño aporte por coincidir con palabras del texto de la pregunta.
    let q = 0;
    for (const t of set) if (p.questionTokens.has(t) && !p.keywordTokens.has(t)) q += 0.3;
    score += Math.min(q, 1);
    void norm;
    return { prepared: p, score, hits };
  }

  private best(faqs: PreparedFaq[], tokens: string[], norm: string): Scored | null {
    if (!tokens.length) return null;
    const scored = faqs.map((f) => this.score(f, tokens, norm)).filter((s) => s.score > 0);
    if (!scored.length) return null;
    scored.sort((a, b) => b.score - a.score || b.hits - a.hits);
    const top = scored.filter((s) => s.score === scored[0].score && s.hits === scored[0].hits);
    return top[Math.floor(this.rnd() * top.length)];
  }

  /**
   * Para repreguntas: puntúa el mensaje solo, y suma un bonus a las FAQ relacionadas con la
   * última respondida (misma categoría o palabras clave compartidas).
   */
  private bestWithContext(faqs: PreparedFaq[], tokens: string[], norm: string, last: PreparedFaq): Scored | null {
    if (!tokens.length) return null;
    const scored = faqs
      .map((f) => {
        const base = this.score(f, tokens, norm);
        if (base.score <= 0) return base;
        let bonus = f.faq.category === last.faq.category ? 1 : 0;
        let shared = 0;
        for (const t of f.keywordTokens) if (last.keywordTokens.has(t)) shared++;
        bonus += Math.min(shared * 0.5, 1.5);
        if (f.faq.id === last.faq.id) bonus += 0.5;
        return { ...base, score: base.score + bonus };
      })
      .filter((s) => s.score > 0);
    if (!scored.length) return null;
    scored.sort((a, b) => b.score - a.score || b.hits - a.hits);
    return scored[0];
  }
}
