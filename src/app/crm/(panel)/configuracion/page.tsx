import type { Metadata } from 'next';
import { ActionForm } from '@/components/crm/ActionForm';
import { TestEmailButton } from '@/components/crm/TestEmailButton';
import { Badge, Field, PageTitle } from '@/components/crm/ui';
import { requireAdmin } from '@/lib/auth';
import { mailConfigured } from '@/lib/mail';
import { getSettings } from '@/lib/settings';
import { saveSiteSettings } from './actions';

export const metadata: Metadata = { title: 'Configuración' };

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();
  const b = s.alertBanner;
  const smtp = mailConfigured();

  return (
    <>
      <PageTitle title="Configuración" sub="Datos que se usan en todo el sitio, en el chat y en los mails automáticos." />
      <div className="crm-card" style={{ maxWidth: 900 }}>
        <ActionForm action={saveSiteSettings} submitLabel="Guardar configuración">
          <h2 style={{ marginBottom: 0 }}>Teléfonos</h2>
          <p className="help" style={{ marginTop: -8 }}>
            Se actualizan solos en la barra superior, la home, el pie, las páginas de seguridad, el chat y el texto de las preguntas frecuentes.
          </p>
          <div className="row r3">
            <Field label="Emergencias" htmlFor="emergencyPhone">
              <input id="emergencyPhone" name="emergencyPhone" type="text" required maxLength={40} defaultValue={s.emergencyPhone} />
            </Field>
            <Field label="Falta de suministro" htmlFor="supplyPhone">
              <input id="supplyPhone" name="supplyPhone" type="text" required maxLength={40} defaultValue={s.supplyPhone} />
            </Field>
            <Field label="Atención al cliente" htmlFor="attentionPhone">
              <input id="attentionPhone" name="attentionPhone" type="text" required maxLength={40} defaultValue={s.attentionPhone} />
            </Field>
          </div>

          <h2 style={{ margin: '14px 0 0' }}>Aviso importante (banner)</h2>
          <p className="help" style={{ marginTop: -8 }}>Una franja destacada arriba de todo el sitio, para comunicar algo urgente (por ejemplo, una emergencia zonal).</p>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.88rem', fontWeight: 600 }}>
            <input type="checkbox" name="bannerEnabled" defaultChecked={b.enabled} /> Mostrar el aviso en el sitio
          </label>
          <Field label="Mensaje (máx. 240 caracteres)" htmlFor="bannerMessage">
            <textarea id="bannerMessage" name="bannerMessage" rows={2} maxLength={240} defaultValue={b.message} placeholder="Ej.: Corte de gas por una rotura de cañería en el barrio Centro. Personal técnico trabajando en el lugar." />
          </Field>
          <div className="row r3">
            <Field label="Texto del enlace (opcional)" htmlFor="bannerLinkLabel">
              <input id="bannerLinkLabel" name="bannerLinkLabel" type="text" maxLength={40} defaultValue={b.linkLabel} placeholder="Ver detalles" />
            </Field>
            <Field label="Dirección del enlace" htmlFor="bannerLinkUrl" help="/estado-del-servicio o https://…">
              <input id="bannerLinkUrl" name="bannerLinkUrl" type="text" maxLength={300} defaultValue={b.linkUrl} />
            </Field>
            <Field label="Color" htmlFor="bannerTone">
              <select id="bannerTone" name="bannerTone" defaultValue={b.tone}>
                <option value="danger">Rojo (urgente)</option>
                <option value="info">Azul (informativo)</option>
              </select>
            </Field>
          </div>
          <Field label="Mostrar hasta (opcional)" htmlFor="bannerUntil" help="Vacío = hasta que lo desactives.">
            <input id="bannerUntil" name="bannerUntil" type="date" defaultValue={b.until} style={{ maxWidth: 220 }} />
          </Field>

          <h2 style={{ margin: '14px 0 0' }}>
            Avisos por mail al equipo{' '}
            {smtp ? <Badge tone="ok">Servidor de correo configurado</Badge> : <Badge tone="warn">Falta configurar el servidor de correo</Badge>}
          </h2>
          <Field
            label="Correos que reciben el aviso de cada contacto nuevo"
            htmlFor="notifyEmails"
            help="Uno por línea o separados por comas. Cada formulario que llega al CRM genera un mail a estas casillas."
          >
            <textarea id="notifyEmails" name="notifyEmails" rows={3} defaultValue={s.notifyEmails.join('\n')} placeholder="atencion@transgas.com.ar" />
          </Field>

          <h2 style={{ margin: '14px 0 0' }}>Privacidad y avisos de vencimiento</h2>
          <div className="row">
            <Field label="Correo para ejercer derechos sobre datos personales" htmlFor="privacyEmail" help="Se muestra en la Política de Privacidad (Ley 25.326). Tiene que ser una casilla que alguien revise.">
              <input id="privacyEmail" name="privacyEmail" type="email" maxLength={160} defaultValue={s.privacyEmail} />
            </Field>
            <Field label="Aviso automático de vencimiento: días de anticipación" htmlFor="noticeDaysBefore" help="A los suscriptores, N días antes de cada vencimiento (0 = el mismo día).">
              <input id="noticeDaysBefore" name="noticeDaysBefore" type="number" min={0} max={30} defaultValue={s.noticeDaysBefore} />
            </Field>
          </div>
        </ActionForm>
      </div>

      <div className="crm-card" style={{ maxWidth: 900, marginTop: 16 }}>
        <h2>Probar el envío de mails</h2>
        <p className="help" style={{ marginBottom: 12 }}>Guardá primero los correos de aviso y después probá. Te llega un mail de prueba.</p>
        <TestEmailButton />
      </div>
    </>
  );
}
