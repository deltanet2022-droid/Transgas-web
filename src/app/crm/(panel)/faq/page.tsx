import type { Metadata } from 'next';
import Link from 'next/link';
import { ConfirmButton } from '@/components/crm/ActionForm';
import { Badge, Empty, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { toggleFaq } from './actions';

export const metadata: Metadata = { title: 'Preguntas frecuentes' };

export default async function FaqCrmPage(props: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const q = (searchParams.q ?? '').trim();
  const category = (searchParams.category ?? '').trim();

  const [faqs, categories] = await Promise.all([
    prisma.faq.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(q ? { OR: [{ question: { contains: q, mode: 'insensitive' } }, { palabrasClave: { has: q.toLowerCase() } }] } : {}),
      },
      orderBy: [{ category: 'asc' }, { question: 'asc' }],
    }),
    prisma.faq.findMany({ distinct: ['category'], select: { category: true }, orderBy: { category: 'asc' } }),
  ]);

  return (
    <>
      <PageTitle
        title="Preguntas frecuentes"
        sub="Es la única fuente de respuestas del chatbot. Cada FAQ lleva palabras clave y 2-3 variantes de redacción."
        action={{ href: '/crm/faq/nueva', label: '+ Nueva pregunta' }}
      />
      <section className="crm-card">
        <form className="filters" method="get">
          <div className="fg">
            <label htmlFor="q">Buscar</label>
            <input id="q" name="q" defaultValue={q} placeholder="Pregunta o palabra clave" />
          </div>
          <div className="fg">
            <label htmlFor="category">Categoría</label>
            <select id="category" name="category" defaultValue={category}>
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>
          </div>
          <button className="cbtn s sm" type="submit">
            Filtrar
          </button>
          {(q || category) && (
            <Link className="cbtn s sm" href="/crm/faq">
              Limpiar
            </Link>
          )}
          <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '.8rem' }}>{faqs.length} FAQ</span>
        </form>

        {faqs.length === 0 ? (
          <Empty>No hay preguntas con ese filtro.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Pregunta</th>
                  <th>Categoría</th>
                  <th>Palabras clave</th>
                  <th>Variantes</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f.id} style={f.active ? undefined : { opacity: 0.6 }}>
                    <td>
                      <Link href={`/crm/faq/${f.id}`}>{f.question}</Link>
                    </td>
                    <td>{f.category}</td>
                    <td style={{ maxWidth: 320, color: 'var(--muted)', fontSize: '.76rem' }}>
                      {f.palabrasClave.slice(0, 6).join(', ')}
                      {f.palabrasClave.length > 6 && ` … (+${f.palabrasClave.length - 6})`}
                    </td>
                    <td>
                      <Badge tone={f.respuestas.length >= 2 ? 'ok' : 'warn'}>{f.respuestas.length}</Badge>
                    </td>
                    <td>{f.active ? <Badge tone="ok">Activa</Badge> : <Badge>Inactiva</Badge>}</td>
                    <td style={{ textAlign: 'right' }}>
                      <form action={toggleFaq}>
                        <input type="hidden" name="id" value={f.id} />
                        <ConfirmButton className="cbtn s sm" message={f.active ? '¿Desactivar esta FAQ? El chatbot dejará de usarla.' : '¿Activar esta FAQ?'}>
                          {f.active ? 'Desactivar' : 'Activar'}
                        </ConfirmButton>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
