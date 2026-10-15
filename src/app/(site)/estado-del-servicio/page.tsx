import type { Metadata } from 'next';
import { staticMeta } from '@/lib/seo';
import { PageBody, PageHeader, HelpAside } from '@/components/site/PageParts';
import { formatDateTime } from '@/lib/dates';
import { getServiceStatusList } from '@/lib/queries';
import { getSettings, telDigits } from '@/lib/settings';

export const metadata: Metadata = staticMeta('/estado-del-servicio');

const LABEL = { EN_CURSO: 'En curso', PROGRAMADO: 'Programado', RESUELTO: 'Resuelto' } as const;

export default async function EstadoDelServicioPage() {
  const [items, s] = await Promise.all([getServiceStatusList(), getSettings()]);
  const active = items.filter((i) => i.status === 'EN_CURSO').length;

  return (
    <>
      <PageHeader
        kicker="Estado del servicio"
        title="Cortes programados y avisos"
        sub="Consultá si hay trabajos o interrupciones en tu zona. En curso primero, luego los programados."
        crumbs={[{ label: 'Estado del servicio' }]}
      />
      <PageBody
        aside={
          <>
            <div className="card static">
              <h3>¿Te quedaste sin gas?</h3>
              <p>Si no hay un aviso para tu zona, reportá la falta de suministro.</p>
              <a className="btn primary" href={`tel:${telDigits(s.supplyPhone)}`}>
                Llamar al {s.supplyPhone}
              </a>
            </div>
            <div className="card static">
              <h3>¿Olor a gas?</h3>
              <p>Eso es una emergencia: salí del lugar y llamá desde afuera.</p>
              <a className="btn navy" href={`tel:${telDigits(s.emergencyPhone)}`}>
                {s.emergencyPhone}
              </a>
            </div>
            <HelpAside links={[{ label: 'Seguridad', href: '/seguridad' }, { label: 'Contacto', href: '/contacto' }]} title="Más información" />
          </>
        }
      >
        <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: '.9rem' }} role="status">
          {active > 0
            ? `Hay ${active} ${active === 1 ? 'aviso en curso' : 'avisos en curso'} en este momento.`
            : 'No hay avisos en curso en este momento.'}
        </p>
        {items.length === 0 ? (
          <div className="empty">
            <b>Sin avisos publicados.</b>
            <p>Cuando haya cortes programados o trabajos que afecten el servicio, los vas a ver acá.</p>
          </div>
        ) : (
          <div className="svclist">
            {items.map((i) => (
              <article key={i.id} className={`card svcitem static ${i.status}`}>
                <span className="dot" aria-hidden />
                <div>
                  <span className={`badge ${i.status}`}>{LABEL[i.status]}</span>
                  <h3 style={{ marginTop: 8 }}>{i.title}</h3>
                  <p>{i.description}</p>
                  <div className="meta">
                    <span>
                      <b>Zona:</b> {i.zone}
                    </span>
                    <span>
                      <b>Inicio:</b> {formatDateTime(i.startsAt)}
                    </span>
                    {i.estimatedEndAt && (
                      <span>
                        <b>Fin estimado:</b> {formatDateTime(i.estimatedEndAt)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
