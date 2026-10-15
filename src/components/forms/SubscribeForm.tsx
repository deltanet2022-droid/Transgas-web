'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PRIVACY_NOTICE, PRIVACY_PATH } from '@/lib/privacy';
import { RichLabel } from './RichLabel';

/** Suscripción a avisos de vencimiento por mail (con confirmación por correo). */
export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [hydrated, setHydrated] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (status === 'done') doneRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError('Ingresá un correo válido.');
    if (!consent) return setError('Tenés que aceptar la Política de Privacidad para suscribirte.');
    setStatus('sending');
    try {
      const r = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, clientNumber, privacidad: true, website: honeypot.current?.value ?? '' }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) return setStatus('done');
      setError(data.error || 'No pudimos procesar tu suscripción. Probá de nuevo.');
    } catch {
      setError('No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.');
    }
    setStatus('idle');
  }

  if (status === 'done') {
    return (
      <div className="formcard success" role="status" ref={doneRef} tabIndex={-1}>
        <div className="big" aria-hidden>
          ✉
        </div>
        <h2>¡Revisá tu correo!</h2>
        <p>Si el correo es válido, te enviamos un mensaje para <strong>confirmar la suscripción</strong>. Hasta que confirmes no vas a recibir avisos. Si no llega, mirá en la carpeta de spam.</p>
      </div>
    );
  }

  return (
    <form className="formcard" method="post" onSubmit={onSubmit} noValidate aria-label="Suscripción a avisos de vencimiento">
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}
      <div className="formgrid">
        <div className="field">
          <label htmlFor="s-email">
            Correo electrónico <i aria-hidden>*</i>
          </label>
          <input id="s-email" type="email" autoComplete="email" maxLength={160} value={email} onChange={(e) => setEmail(e.target.value)} aria-required />
        </div>
        <div className="field">
          <label htmlFor="s-cli">Nº de cliente / socio (opcional)</label>
          <input id="s-cli" type="text" maxLength={30} value={clientNumber} onChange={(e) => setClientNumber(e.target.value)} />
        </div>
        <div className="field full">
          <label className="check" htmlFor="s-consent">
            <input id="s-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-required />
            <span>
              <RichLabel text={`Leí y acepto la [[Política de Privacidad|${PRIVACY_PATH}]] y quiero recibir avisos de vencimiento por correo electrónico.`} /> <i>*</i>
            </span>
          </label>
        </div>
      </div>
      <div className="hp" aria-hidden="true">
        <label>
          No completar este campo
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <p className="privnote">{PRIVACY_NOTICE} Podés darte de baja cuando quieras desde el enlace de cada mail.</p>
      <div className="formfoot">
        <button className="btn primary" type="submit" disabled={status === 'sending' || !hydrated}>
          {status === 'sending' ? 'Enviando…' : 'Suscribirme'}
        </button>
      </div>
    </form>
  );
}
