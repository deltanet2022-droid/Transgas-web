'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { validateLead, type LeadErrors, type LeadField, type LeadFormConfig, type LeadValues } from '@/lib/leads/config';

type Status = 'idle' | 'sending' | 'success';

function initialValues(config: LeadFormConfig): LeadValues {
  return Object.fromEntries(config.fields.map((f) => [f.name, f.type === 'checkbox' ? false : '']));
}

export function LeadForm({ config }: { config: LeadFormConfig }) {
  const [values, setValues] = useState<LeadValues>(() => initialValues(config));
  const [errors, setErrors] = useState<LeadErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [ref, setRef] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // El envío se habilita recién cuando React tomó el control del formulario.
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function setValue(name: string, value: string | boolean) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (submitted) {
      const res = validateLead(config, next);
      setErrors(res.ok ? {} : res.errors);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setSubmitted(true);
    setServerError('');

    const res = validateLead(config, values);
    if (!res.ok) {
      setErrors(res.errors);
      const first = config.fields.find((f) => res.errors[f.name]);
      if (first) document.getElementById(`f-${first.name}`)?.focus();
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: config.type, values: res.values, website: honeypot.current?.value ?? '' }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setRef(data.ref ?? '');
        setStatus('success');
        return;
      }
      if (r.status === 422 && data.errors) setErrors(data.errors);
      setServerError(data.error || 'No pudimos enviar tu solicitud. Intentá de nuevo en unos minutos.');
    } catch {
      setServerError('No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.');
    }
    setStatus('idle');
  }

  if (status === 'success') {
    return (
      <div className="formcard success" role="status" ref={successRef} tabIndex={-1}>
        <div className="big" aria-hidden>
          ✓
        </div>
        <h2>{config.successTitle}</h2>
        <p>{config.successText}</p>
        {ref && <span className="ref">Nº de consulta: {ref}</span>}
        <div className="actions" style={{ justifyContent: 'center' }}>
          <Link className="btn primary" href="/">
            Volver al inicio
          </Link>
          <Link className="btn soft" href="/autogestion">
            Otras gestiones
          </Link>
        </div>
      </div>
    );
  }

  return (
    // method="post": aunque el JS no haya cargado, los datos personales nunca viajan en la URL.
    <form className="formcard" method="post" onSubmit={onSubmit} noValidate aria-label={config.title}>
      {serverError && (
        <div className="alert error" role="alert">
          {serverError}
        </div>
      )}
      <div className="formgrid">
        {config.fields.map((f) => (
          <Field key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => setValue(f.name, v)} />
        ))}
      </div>

      {/* Honeypot anti-spam: invisible para personas */}
      <div className="hp" aria-hidden="true">
        <label>
          No completar este campo
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="formfoot">
        <button className="btn primary" type="submit" disabled={status === 'sending' || !hydrated}>
          {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
        </button>
        <small>No pedimos contraseñas, datos de tarjeta ni CBU. Usamos tus datos solo para gestionar esta solicitud.</small>
      </div>
    </form>
  );
}

function Field({
  field: f,
  value,
  error,
  onChange,
}: {
  field: LeadField;
  value: string | boolean;
  error?: string;
  onChange: (v: string | boolean) => void;
}) {
  const id = `f-${f.name}`;
  const describedBy = [error ? `${id}-err` : '', f.hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  const common = { id, name: f.name, 'aria-invalid': !!error, 'aria-describedby': describedBy, 'aria-required': f.required };

  if (f.type === 'checkbox') {
    return (
      <div className={`field full${error ? ' err' : ''}`}>
        <label className="check" htmlFor={id}>
          <input {...common} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          <span>
            {f.label} {f.required && <i>*</i>}
          </span>
        </label>
        {error && (
          <span className="errmsg" id={`${id}-err`}>
            {error}
          </span>
        )}
      </div>
    );
  }

  const str = typeof value === 'string' ? value : '';
  return (
    <div className={`field${f.full || f.type === 'textarea' ? ' full' : ''}${error ? ' err' : ''}`}>
      <label htmlFor={id}>
        {f.label} {f.required && <i aria-hidden>*</i>}
      </label>
      {f.type === 'textarea' ? (
        <textarea {...common} value={str} maxLength={f.maxLength ?? 2000} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === 'select' ? (
        <select {...common} value={str} onChange={(e) => onChange(e.target.value)}>
          <option value="">Elegí una opción</option>
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={f.type === 'number' ? 'text' : f.type}
          inputMode={f.type === 'number' ? 'decimal' : f.type === 'tel' ? 'tel' : undefined}
          value={str}
          maxLength={f.maxLength}
          placeholder={f.placeholder}
          autoComplete={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : f.name === 'name' ? 'name' : 'off'}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {f.hint && !error && (
        <span className="hint" id={`${id}-hint`}>
          {f.hint}
        </span>
      )}
      {error && (
        <span className="errmsg" id={`${id}-err`}>
          {error}
        </span>
      )}
    </div>
  );
}
