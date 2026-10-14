import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionForm, ConfirmButton } from '@/components/crm/ActionForm';
import { Badge, Empty, Field, PageTitle } from '@/components/crm/ui';
import { prisma } from '@/lib/db';
import { dateOnlyInput, formatDateOnly, todayAR } from '@/lib/dates';
import { deleteTariffDocument, setCurrentTariffDocument, uploadTariffDocument } from './actions';

export const metadata: Metadata = { title: 'Tarifas' };

export default async function TarifasCrmPage() {
  const [tariffs, docs] = await Promise.all([
    prisma.tariff.findMany({ orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }] }),
    prisma.tariffDocument.findMany({ orderBy: { validFrom: 'desc' } }),
  ]);

  return (
    <>
      <PageTitle title="Tarifas" sub="Categorías tarifarias y cuadro tarifario (PDF) vigente." action={{ href: '/crm/tarifas/categorias/nueva', label: '+ Nueva categoría' }} />

      <section className="crm-card" style={{ marginBottom: 16 }}>
        <h2>Cuadro tarifario (PDF)</h2>
        <div className="tablescroll">
          {docs.length === 0 ? (
            <Empty>Todavía no cargaste ningún cuadro tarifario.</Empty>
          ) : (
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Vigente desde</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <a href={d.fileUrl} target="_blank" rel="noopener">
                        {d.title} ↗
                      </a>
                    </td>
                    <td>{formatDateOnly(d.validFrom)}</td>
                    <td>{d.isCurrent ? <Badge tone="ok">Vigente (se muestra en el sitio)</Badge> : <Badge>Histórico</Badge>}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ display: 'inline-flex', gap: 6 }}>
                        {!d.isCurrent && (
                          <form action={setCurrentTariffDocument}>
                            <input type="hidden" name="id" value={d.id} />
                            <ConfirmButton className="cbtn s sm" message="¿Marcar este cuadro como el vigente?">
                              Marcar vigente
                            </ConfirmButton>
                          </form>
                        )}
                        <form action={deleteTariffDocument}>
                          <input type="hidden" name="id" value={d.id} />
                          <ConfirmButton message="¿Eliminar este cuadro del histórico? También se borra el archivo.">Eliminar</ConfirmButton>
                        </form>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <h2 style={{ marginTop: 26 }}>Subir un nuevo cuadro</h2>
        <ActionForm action={uploadTariffDocument} submitLabel="Subir cuadro tarifario">
          <div className="row">
            <Field label="Título" htmlFor="title">
              <input id="title" name="title" type="text" required maxLength={140} placeholder="Cuadro tarifario — Marzo 2026" />
            </Field>
            <Field label="Rige desde" htmlFor="validFrom">
              <input id="validFrom" name="validFrom" type="date" required defaultValue={dateOnlyInput(todayAR())} />
            </Field>
          </div>
          <div className="row">
            <Field label="Archivo PDF (máx. 10 MB)" htmlFor="file">
              <input id="file" name="file" type="file" accept="application/pdf" />
            </Field>
            <Field label="…o dirección de un PDF ya publicado" htmlFor="fileUrl" help="Solo si no subís un archivo.">
              <input id="fileUrl" name="fileUrl" type="url" placeholder="https://…" />
            </Field>
          </div>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.86rem' }}>
            <input type="checkbox" name="makeCurrent" defaultChecked /> Marcar como el cuadro vigente (el anterior pasa al histórico)
          </label>
        </ActionForm>
      </section>

      <section className="crm-card">
        <h2>Categorías</h2>
        {tariffs.length === 0 ? (
          <Empty>No hay categorías cargadas.</Empty>
        ) : (
          <div className="tablescroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Orden</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link href={`/crm/tarifas/categorias/${t.id}`}>{t.code}</Link>
                    </td>
                    <td>{t.name}</td>
                    <td>{t.type === 'SGP' ? 'SGP' : 'Residencial'}</td>
                    <td>{t.sortOrder}</td>
                    <td>{t.active ? <Badge tone="ok">Visible</Badge> : <Badge>Oculta</Badge>}</td>
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
