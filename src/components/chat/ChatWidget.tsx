'use client';

import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { BotIcon } from '@/components/ui/Icons';
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

const QUICK = [
  { label: 'Factura', q: 'Quiero ver mi factura' },
  { label: 'Suministro', q: 'Tengo falta de suministro' },
  { label: 'Tarifas', q: 'Quiero consultar tarifas' },
  { label: 'Emergencia', q: 'Tengo una emergencia' },
  { label: 'Obras', q: 'Quiero consultar obras y redes' },
];

const GREETING =
  'Hola. Puedo orientarte sobre facturas, trámites, tarifas, seguridad, emergencias y obras. ¿Qué necesitás?';
const STORAGE_KEY = 'transgas-chat-conversation';

const URL_RE = /^https?:\/\/\S+$/i;
const PATH_RE = /^\/[a-z0-9#][\w\-/#]*$/i; // rutas internas: /autogestion/informar-pago, /#infraestructura
const PHONE_RE = /^(0800-\d{3}-\d{4}|3385-\d{6})$/; // teléfonos del sitio

/** Convierte URLs, rutas internas y teléfonos del texto del bot en enlaces (sin regex con lookbehind: compatible con iOS viejos). */
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let key = 0;
  for (const part of text.split(/(\s+)/)) {
    if (!part || /^\s+$/.test(part)) {
      out.push(part);
      continue;
    }
    // separa signos que rodean al enlace: "(…)", "…," "…."
    const [, lead = '', core = part, trail = ''] = /^([(¿¡"']*)(.*?)([.,;:!?)"']*)$/.exec(part) ?? [];
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
    } else if (PHONE_RE.test(core)) {
      node = (
        <a key={key++} href={`tel:${core.replace(/\D/g, '')}`}>
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
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, role: 'bot', text: GREETING }]);
  const [chips, setChips] = useState<{ label: string; q: string }[]>(QUICK);
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

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    setBadge(false);
    const t = setTimeout(() => inputRef.current?.focus(), 80);
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
        const r = data.reply;
        setMessages((m) =>
          m.map((x) =>
            x.id === botId
              ? { id: botId, role: 'bot', text: r.text, emergency: r.emergency, handoff: r.handoff, whatsappUrl: r.whatsappUrl }
              : x,
          ),
        );
        setChips((r.suggestions ?? []).map((s: string) => ({ label: s, q: s })));
      } catch (e) {
        const msg =
          e instanceof Error && e.message !== 'error' && e.message !== 'Failed to fetch'
            ? e.message
            : `No pude conectarme en este momento. Podés intentar de nuevo o llamar al ${site.phone}.`;
        setMessages((m) => m.map((x) => (x.id === botId ? { id: botId, role: 'bot', text: msg } : x)));
      } finally {
        setBusy(false);
      }
    },
    [busy],
  );

  return (
    <>
      <button
        className="chatfab"
        aria-expanded={open}
        aria-controls="chatpanel"
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        onClick={() => setOpen((o) => !o)}
      >
        {badge && <span className="chatbadge">1</span>}
        <BotIcon width={36} light />
      </button>

      <section className={`chatpanel${open ? ' open' : ''}`} id="chatpanel" role="dialog" aria-label="Asistente Transgas" aria-hidden={!open}>
        <div className="chathead">
          <div className="avatar">
            <BotIcon width={28} />
          </div>
          <div>
            <b>Asistente Transgas</b>
            <small>
              <span className="online" />
              Orientación automática
            </small>
          </div>
          <button className="chatclose" onClick={() => setOpen(false)} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="chatbody" ref={bodyRef} aria-live="polite">
          {messages.map((m) => (
            <Fragment key={m.id}>
              <div className={`bubble ${m.role}${m.emergency ? ' alert' : ''}`}>
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
            </Fragment>
          ))}
        </div>

        {chips.length > 0 && (
          <div className="quickqs">
            {chips.map((c) => (
              <button key={c.label} className="qq" onClick={() => send(c.q)} disabled={busy}>
                {c.label}
              </button>
            ))}
          </div>
        )}

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
        <div className="chatnote">Asistente orientativo. No solicita contraseñas ni datos bancarios: no los escribas acá.</div>
      </section>
    </>
  );
}
