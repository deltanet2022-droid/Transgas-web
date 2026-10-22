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
          setState(null);
          start(async () => {
            try {
              setState(await action());
            } catch {
              // Si el servidor falla o tarda demasiado, igual se avisa en pantalla (antes no se veía nada).
              setState({ error: 'No se pudo completar la acción: el servidor no respondió o devolvió un error. Probá de nuevo en unos minutos.' });
            }
          });
        }}
      >
        {pending ? pendingLabel : label}
      </button>
      {state?.error && (
        <div className="cmsg err" role="alert">
          ✖ {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="cmsg ok" role="status">
          ✔ {state.message}
        </div>
      )}
    </div>
  );
}
