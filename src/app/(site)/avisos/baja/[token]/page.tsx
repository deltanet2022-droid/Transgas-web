import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBody, PageHeader } from '@/components/site/PageParts';
import { prisma, safe } from '@/lib/db';
import { unsubscribe } from '../../actions';

export const metadata: Metadata = { title: 'Darme de baja de los avisos', robots: { index: false, follow: false } };

export default async function UnsubscribePage({ params, searchParams }: { params: { token: string }; searchParams: { ok?: string } }) {
  const sub = await safe(() => prisma.subscriber.findUnique({ where: { token: params.token }, select: { email: true, unsubscribedAt: true } }), null);
  const gone = !!sub?.unsubscribedAt;

  return (
    <>
      <PageHeader kicker="Avisos" title="Darme de baja de los avisos" crumbs={[{ label: 'Avisos de vencimiento', href: '/avisos' }, { label: 'Baja' }]} />
      <PageBody>
        <div className="formcard success" style={{ maxWidth: 620, margin: '0 auto' }} role="status">
          {!sub ? (
            <>
              <h2>El enlace no es válido</h2>
              <p>Si querés dejar de recibir avisos, escribinos desde la página de contacto.</p>
              <p style={{ marginTop: 18 }}>
                <Link className="btn primary" href="/contacto">
                  Ir a contacto
                </Link>
              </p>
            </>
          ) : gone ? (
            <>
              <div className="big" aria-hidden>
                ✓
              </div>
              <h2>{searchParams.ok ? 'Listo, te diste de baja' : 'Ya estás dado de baja'}</h2>
              <p>No vas a recibir más avisos en {sub.email}. Si cambiás de opinión, podés volver a suscribirte cuando quieras.</p>
              <p style={{ marginTop: 18 }}>
                <Link className="btn soft" href="/avisos">
                  Volver a suscribirme
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2>¿Querés dejar de recibir los avisos?</h2>
              <p>Se va a dar de baja el correo {sub.email}.</p>
              <form action={unsubscribe} style={{ marginTop: 18 }}>
                <input type="hidden" name="token" value={params.token} />
                <button className="btn navy" type="submit">
                  Sí, darme de baja
                </button>
              </form>
            </>
          )}
        </div>
      </PageBody>
    </>
  );
}
