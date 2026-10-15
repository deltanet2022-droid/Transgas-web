'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import type { ActionState } from '@/lib/crm/action';

export function SubmitButton({
  children = 'Guardar',
  className = 'cbtn p',
  leaving = false,
}: {
  children?: React.ReactNode;
  className?: string;
  /** Ya se guardó y se está volviendo al listado. */
  leaving?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending || leaving}>
      {leaving ? 'Guardado ✓' : pending ? 'Guardando…' : children}
    </button>
  );
}

/** Formulario ligado a una Server Action con estado (errores / éxito) y botón con "pending". */
export function ActionForm({
  action,
  children,
  submitLabel,
  resetOnSuccess,
  extraActions,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  extraActions?: React.ReactNode;
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(async (prev: ActionState, fd: FormData) => {
    const res = await action(prev, fd);
    if (res?.ok && resetOnSuccess) formRef.current?.reset();
    // Guardó bien y hay que volver al listado: navegamos desde acá, sin esperar a que el servidor arme la otra página.
    if (res?.ok && res.redirectTo) router.push(res.redirectTo);
    return res;
  }, null as ActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const leaving = !!state?.ok && !!state.redirectTo;

  return (
    <form action={formAction} ref={formRef} className="cform">
      {children}
      {state?.error && (
        <div className="cmsg err" role="alert">
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="cmsg ok" role="status">
          {state.message ?? 'Listo.'}
        </div>
      )}
      <div className="acts">
        <SubmitButton leaving={leaving}>{submitLabel ?? 'Guardar'}</SubmitButton>
        {extraActions}
      </div>
    </form>
  );
}

/** Botón de envío que pide confirmación (para borrar). Va dentro de un <form action={serverAction}>. */
export function ConfirmButton({ children, message, className = 'cbtn d sm' }: { children: React.ReactNode; message: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? '…' : children}
    </button>
  );
}
