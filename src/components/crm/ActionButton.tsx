'use client';

import { useState, useTransition } from 'react';
import type { ActionState } from '@/lib/crm/action';

/** Botón que ejecuta una Server Action (sin formulario) y muestra el resultado. */
export function ActionButton({
  action,
  label,
  pendingLabel = 'Procesando…',
  confirm,
  className = 'cbtn s',
}: {
  action: () => Promise<ActionState>;
  label: string;
  pendingLabel?: string;
  confirm?: string;
  className?: string;
}) {
  const [state, setState] = useState<ActionState>(null);
  const [pending, start] = useTransition();
  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <button
        type="button"
        className={className}
        disabled={pending}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          start(async () => setState(await action()));
        }}
      >
        {pending ? pendingLabel : label}
      </button>
      {state?.error && <div className="cmsg err">{state.error}</div>}
      {state?.ok && <div className="cmsg ok">{state.message}</div>}
    </div>
  );
}
