'use client';

import { sendTestEmail } from '@/app/crm/(panel)/configuracion/actions';
import { ActionButton } from '@/components/crm/ActionButton';

export function TestEmailButton() {
  return <ActionButton action={sendTestEmail} label="Enviar mail de prueba" pendingLabel="Enviando…" />;
}
