'use client';

import { useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { confirmMfaEnroll, disableMfa, startMfaEnroll, type EnrollResult } from '@/app/crm/(panel)/cuenta/actions';
import { SubmitButton } from '@/components/crm/ActionForm';
import { ActionButton } from '@/components/crm/ActionButton';
import type { ActionState } from '@/lib/crm/action';

/** Activar o desactivar la verificación en dos pasos (app autenticadora). */
export function MfaSetup({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [enroll, setEnroll] = useState<EnrollResult | null>(null);
  const [pending, start] = useTransition();
  const [state, formAction] = useFormState(async (prev: ActionState, fd: FormData) => {
    const res = await confirmMfaEnroll(prev, fd);
    if (res?.ok) {
      setEnroll(null);
      router.refresh();
    }
    return res;
  }, null as ActionState);

  if (enabled) {
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <div className="cmsg ok">La verificación en dos pasos está <b>activada</b>: al ingresar se pide también un código de tu app autenticadora.</div>
        <ActionButton
          className="cbtn d sm"
          action={async () => {
            const r = await disableMfa();
            if (r?.ok) router.refresh();
            return r;
          }}
          label="Desactivar verificación en dos pasos"
          confirm="¿Desactivar la verificación en dos pasos? Tu cuenta quedará protegida solo por la contraseña."
        />
      </div>
    );
  }

  if (!enroll?.ok) {
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <p className="help">Suma una capa de seguridad: además de la contraseña, se pide un código que cambia cada 30 segundos y solo vos tenés en el celular. Recomendado para administradores.</p>
        <button className="cbtn p" type="button" disabled={pending} onClick={() => start(async () => setEnroll(await startMfaEnroll()))}>
          {pending ? 'Preparando…' : 'Activar verificación en dos pasos'}
        </button>
        {enroll && !enroll.ok && <div className="cmsg err">{enroll.error}</div>}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: '.86rem', display: 'grid', gap: 6 }}>
        <li>Instalá una app autenticadora en tu celular (Google Authenticator, Microsoft Authenticator o Authy).</li>
        <li>Escaneá este código QR con la app.</li>
        <li>Escribí abajo el código de 6 dígitos que te muestra.</li>
      </ol>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={enroll.qr} alt="Código QR para la app autenticadora" width={180} height={180} style={{ background: '#fff', padding: 8, borderRadius: 12, border: '1px solid var(--line)' }} />
      <p className="help">
        ¿No podés escanear? Ingresá esta clave a mano: <code style={{ background: 'var(--p2)', padding: '2px 6px', borderRadius: 6, wordBreak: 'break-all' }}>{enroll.secret}</code>
      </p>
      <form action={formAction} className="cform" style={{ maxWidth: 320 }}>
        <input type="hidden" name="factorId" value={enroll.factorId} />
        <div>
          <label className="l" htmlFor="code">
            Código de 6 dígitos
          </label>
          <input id="code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={7} required />
        </div>
        {state?.error && <div className="cmsg err">{state.error}</div>}
        <div className="acts">
          <SubmitButton>Confirmar y activar</SubmitButton>
          <button className="cbtn s" type="button" onClick={() => setEnroll(null)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
