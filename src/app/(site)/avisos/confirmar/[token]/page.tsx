import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBody, PageHeader } from '@/components/site/PageParts';
import { prisma, safe } from '@/lib/db';
import { confirmSubscription } from '../../actions';

export const metadata: Metadata = { title: 'Confirmar suscripción', robots: { index: false, follow: false } };

export default async function ConfirmPage(
  props: { params: Promise<{ token: string }>; searchParams: Promise<{ ok?: string }> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const sub = await safe(() => prisma.subscriber.findUnique({ where: { token: params.token }, select: { email: true, confirmedAt: true, unsubscribedAt: true } }), null);
  const done = !!sub?.confirmedAt && !sub.unsubscribedAt;

  return (
    <>
      <PageHeader kicker="Avisos" title="Confirmar suscripción" crumbs={[{ label: 'Avisos de vencimiento', href: '/avisos' }, { label: 'Confirmar' }]} />
      <PageBody>
        <div className="formcard success" style={{ maxWidth: 620, margin: '0 auto' }} role="status">
          {!sub ? (
            <>
              <h2>El enlace no es válido</h2>
              <p>Puede haber vencido o ya no existir. Podés volver a pedir la suscripción.</p>
              <p style={{ marginTop: 18 }}>
                <Link className="btn primary" href="/avisos">
                  Suscribirme
                </Link>
              </p>
            </>
          ) : done ? (
            <>
              <div className="big" aria-hidden>
                ✓
              </div>
              <h2>{searchParams.ok ? '¡Suscripción confirmada!' : 'Tu suscripción ya está activa'}</h2>
              <p>Vas a recibir los avisos de vencimiento en {sub.email}. Podés darte de baja desde el enlace de cualquier mail.</p>
            </>
          ) : (
            <>
              <h2>Confirmá tu correo</h2>
              <p>Tocá el botón para activar los avisos de vencimiento en {sub.email}.</p>
              <form action={confirmSubscription} style={{ marginTop: 18 }}>
                <input type="hidden" name="token" value={params.token} />
                <button className="btn primary" type="submit">
                  Confirmar suscripción
                </button>
              </form>
            </>
          )}
        </div>
      </PageBody>
    </>
  );
}
