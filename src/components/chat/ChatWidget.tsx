'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ASSISTANT_NAME, Avatar } from '@/components/chat/Avatar';
import { site } from '@/lib/site';

interface Msg {
  id: number;
  role: 'user' | 'bot';
  text: string;
  emergency?: boolean;
  handoff?: boolean;
  whatsappUrl?: string | null;
  loading?: boolean;
}

interface Chip {
  label: string;
  q: string;
}

/** Menú de inicio (coincide con el «Menú principal» de las FAQ). */
const MENU: Chip[] = [
  'Mi factura',
  'Trámites',
  'Tarifas',
  'Me quedé sin gas',
  'Seguridad',
  'Cooperativas y gasistas',
  'Contacto y horarios',
  'Emergencia',
  'Hablar con una persona',
].map((l) => ({ label: l, q: l }));

const GREETING = `¡Hola! 👋 Soy ${ASSISTANT_NAME}, la asistente virtual de Transgas. Estoy para ayudarte con tu factura, trámites, tarifas, cortes de servicio, seguridad y emergencias, las 24 horas.\n\n¿Sobre qué querés hablar?`;
const STORAGE_KEY = 'transgas-chat-conversation';
const TEASER_KEY = 'transgas-chat-teaser';
/** Demora mínima antes de mostrar la respuesta, para que la charla se sienta natural. */
const MIN_TYPING_MS = 700;

const URL_RE = /^https?:\/\/\S+$/i;
const PATH_RE = /^\/[a-z0-9#][\w\-/#]*$/i; // rutas internas: /autogestion/informar-pago, /#infraestructura
const PHONE_RE = /^\+?\d[\d-]{6,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Convierte URLs, rutas internas, teléfonos y correos del texto del bot en enlaces (sin regex con lookbehind: compatible con iOS viejos). */
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let key = 0;
  for (const part of text.split(/(\s+)/)) {
    if (!part || /^\s+$/.test(part)) {
      out.push(part);
      continue;
    }
    // separa signos que rodean al enlace: "(…)", "…," "…."
    const [, lead = '', core = part, trail = ''] = /^([(¿¡"'«]*)(.*?)([.,;:!?)"'»]*)$/.exec(part) ?? [];
    let node: ReactNode = null;
    if (URL_RE.test(core)) {
      node = (
        <a key={key++} href={core} target="_blank" rel="noopener noreferrer">
          {core}
        </a>
      );
    } else if (PATH_RE.test(core)) {
      node = (
        <Link key={key++} href={core}>
          {core}
        </Link>
      );
    } else if (EMAIL_RE.test(core)) {
      node = (
        <a key={key++} href={`mailto:${core}`}>
          {core}
        </a>
      );
    } else if (PHONE_RE.test(core) && !DATE_RE.test(core)) {
      node = (
        <a key={key++} href={`tel:${core.replace(/[^\d+]/g, '')}`}>
          {core}
        </a>
      );
    }
    if (node) out.push(lead, node, trail);
    else out.push(part);
  }
  return out;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState(true);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, role: 'bot', text: GREETING }]);
  const [chips, setChips] = useState<Chip[]>(MENU);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const conversationId = useRef<string | null>(null);
  const nextId = useRef(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      conversationId.current = sessionStorage.getItem(STORAGE_KEY);
    } catch {
      /* sessionStorage no disponible */
    }
  }, []);

  // Globo de bienvenida, una sola vez por sesión
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(TEASER_KEY);
    } catch {
      /* ignore */
    }
    if (seen) return;
    const show = setTimeout(() => setTeaser(true), 4500);
    const hide = setTimeout(() => setTeaser(false), 17000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, chips]);

  useEffect(() => {
    if (!open) return;
    setBadge(false);
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, '1');
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      const userId = nextId.current++;
      const botId = nextId.current++;
      setInput('');
      setChips([]);
      setBusy(true);
      setMessages((m) => [...m, { id: userId, role: 'user', text }, { id: botId, role: 'bot', text: '', loading: true }]);

      const started = Date.now();
      let result: { text: string; emergency?: boolean; handoff?: boolean; whatsappUrl?: string | null; suggestions?: string[] };
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: conversationId.current, message: text }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'error');
        conversationId.current = data.conversationId ?? conversationId.current;
        try {
          if (conversationId.current) sessionStorage.setItem(STORAGE_KEY, conversationId.current);
        } catch {
          /* ignore */
        }
        result = data.reply;
      } catch (e) {
        result = {
          text:
            e instanceof Error && e.message !== 'error' && e.message !== 'Failed to fetch'
              ? e.message
              : `No pude conectarme en este momento 😕 Podés intentar de nuevo o llamar al ${site.phone}.`,
        };
      }

      const wait = MIN_TYPING_MS - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));

      setMessages((m) =>
        m.map((x) =>
          x.id === botId ? { id: botId, role: 'bot', text: result.text, emergency: result.emergency, handoff: result.handoff, whatsappUrl: result.whatsappUrl } : x,
        ),
      );
      setChips((result.suggestions ?? []).map((s) => ({ label: s, q: s })));
      setBusy(false);
    },
    [busy],
  );

  return (
    <>
      {teaser && !open && (
        <div className="chatteaser" role="status">
          <button className="teaserx" aria-label="Cerrar" onClick={() => setTeaser(false)}>
            ×
          </button>
          <button className="teasertxt" onClick={() => setOpen(true)}>
            <b>¡Hola! Soy {ASSISTANT_NAME} 👋</b>
            <span>¿Te ayudo con tu factura, un trámite o un corte?</span>
          </button>
        </div>
      )}

      <button
        className={`chatfab${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls="chatpanel"
        aria-label={open ? 'Cerrar asistente' : `Abrir asistente virtual ${ASSISTANT_NAME}`}
        onClick={() => setOpen((o) => !o)}
      >
        {badge && <span className="chatbadge" aria-hidden />}
        {open ? <span className="fabx">×</span> : <Avatar size={66} decorative />}
      </button>

      <section className={`chatpanel${open ? ' open' : ''}`} id="chatpanel" role="dialog" aria-label={`Asistente virtual ${ASSISTANT_NAME}`} aria-hidden={!open}>
        <div className="chathead">
          <div className="avatar">
            <Avatar size={46} talking={busy} decorative />
          </div>
          <div>
            <b>{ASSISTANT_NAME} · Asistente de Transgas</b>
            <small>
              <span className="online" />
              En línea ·{' '}
              <Link href="/privacidad">Privacidad</Link>
            </small>
          </div>
          <button className="chatclose" onClick={() => setOpen(false)} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="chatbody" ref={bodyRef} aria-live="polite">
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="msg user">
                <div className="bubble user">{m.text}</div>
              </div>
            ) : (
              <div key={m.id} className="msg">
                <span className="mini-av" aria-hidden>
                  <Avatar size={30} animated={false} talking={!!m.loading} />
                </span>
                <div className="msgcol">
                  <div className={`bubble bot${m.emergency ? ' alert' : ''}`}>
                    {m.loading ? (
                      <span className="typing" aria-label="Escribiendo">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : (
                      linkify(m.text)
                    )}
                  </div>
                  {m.handoff &&
                    (m.whatsappUrl ? (
                      <a className="wabtn" href={m.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <span aria-hidden>💬</span> Continuar por WhatsApp
                      </a>
                    ) : (
                      <div className="bubble bot">
                        Comunicate con nosotros al <a href={`tel:${site.phoneTel}`}>{site.phone}</a> (lunes a viernes, 07:00 a 14:00).
                      </div>
                    ))}
                </div>
              </div>
            ),
          )}
          {chips.length > 0 && (
            <div className="chips" role="group" aria-label="Opciones sugeridas">
              {chips.map((c, i) => (
                <button key={c.label} className="qq" style={{ animationDelay: `${i * 45}ms` }} onClick={() => send(c.q)} disabled={busy}>
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="chatform"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={450}
            placeholder="Escribí tu consulta…"
            aria-label="Escribí tu consulta"
            autoComplete="off"
          />
          <button type="submit" aria-label="Enviar" disabled={busy}>
            →
          </button>
        </form>
      </section>
    </>
  );
}
