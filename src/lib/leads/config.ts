// Fuente única de verdad de los formularios públicos: la usan el componente <LeadForm />
// (validación en el cliente) y POST /api/leads (validación en el servidor).
// No importa nada de Prisma para poder usarse desde componentes cliente.

export const LEAD_TYPES = [
  'FACTURA_ELECTRONICA',
  'INFORMAR_PAGO',
  'INFORMAR_MEDIDOR',
  'ABM_SERVICIO',
  'NUEVO_SERVICIO',
  'CONTACTO',
] as const;
export type LeadTypeKey = (typeof LEAD_TYPES)[number];

export const LEAD_TYPE_LABEL: Record<LeadTypeKey, string> = {
  FACTURA_ELECTRONICA: 'Factura electrónica',
  INFORMAR_PAGO: 'Informar pago',
  INFORMAR_MEDIDOR: 'Informar medidor',
  ABM_SERVICIO: 'ABM de servicio',
  NUEVO_SERVICIO: 'Nuevo servicio',
  CONTACTO: 'Contacto',
};

export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'date' | 'checkbox';

export interface LeadField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  full?: boolean;
  maxLength?: number;
}

export interface LeadFormConfig {
  type: LeadTypeKey;
  path: string;
  title: string;
  kicker: string;
  intro: string;
  successTitle: string;
  successText: string;
  fields: LeadField[];
}

/** Campos que van a columnas de la tabla leads; el resto se guarda en extraData (JSON). */
export const CORE_FIELDS = ['name', 'email', 'phone', 'message'] as const;

const name: LeadField = { name: 'name', label: 'Nombre y apellido', type: 'text', required: true, maxLength: 120 };
const email = (required = true): LeadField => ({ name: 'email', label: 'Correo electrónico', type: 'email', required, maxLength: 160 });
const phone = (required = false): LeadField => ({ name: 'phone', label: 'Teléfono', type: 'tel', required, placeholder: 'Ej. 3385 480021', maxLength: 30 });
const nroCliente = (required = true): LeadField => ({
  name: 'nroCliente',
  label: 'Nº de cliente / socio',
  type: 'text',
  required,
  hint: 'Lo encontrás en tu factura.',
  maxLength: 30,
});
const message = (label = 'Comentarios', required = false): LeadField => ({
  name: 'message',
  label,
  type: 'textarea',
  required,
  full: true,
  maxLength: 2000,
});

export const LEAD_FORMS: Record<LeadTypeKey, LeadFormConfig> = {
  FACTURA_ELECTRONICA: {
    type: 'FACTURA_ELECTRONICA',
    path: '/autogestion/factura-electronica',
    title: 'Adherí a la factura electrónica',
    kicker: 'Autogestión',
    intro: 'Recibí tu factura por correo, sin papel y sin demoras. Completá estos datos y te confirmamos la adhesión.',
    successTitle: '¡Recibimos tu solicitud!',
    successText: 'Vamos a validar tus datos y a confirmar la adhesión a la factura electrónica en el correo que nos indicaste.',
    fields: [
      name,
      email(),
      phone(),
      nroCliente(),
      { name: 'dni', label: 'DNI o CUIT del titular', type: 'text', required: true, maxLength: 15 },
      {
        name: 'aceptaFacturaMail',
        label: 'Acepto recibir mis facturas por correo electrónico en lugar de en papel.',
        type: 'checkbox',
        required: true,
        full: true,
      },
    ],
  },
  INFORMAR_PAGO: {
    type: 'INFORMAR_PAGO',
    path: '/autogestion/informar-pago',
    title: 'Informá un pago',
    kicker: 'Autogestión',
    intro: '¿Pagaste y todavía no se ve reflejado? Cargá los datos del pago para que podamos acreditarlo.',
    successTitle: '¡Pago informado!',
    successText: 'Registramos los datos de tu pago. Lo verificamos y lo acreditamos en tu cuenta.',
    fields: [
      name,
      email(),
      phone(),
      nroCliente(),
      { name: 'fechaPago', label: 'Fecha del pago', type: 'date', required: true },
      { name: 'monto', label: 'Monto abonado ($)', type: 'number', required: true, placeholder: '0,00' },
      {
        name: 'medioPago',
        label: 'Medio de pago',
        type: 'select',
        required: true,
        options: ['Transferencia bancaria', 'Efectivo en la cooperativa', 'Débito automático', 'Pago online', 'Otro'],
      },
      { name: 'nroComprobante', label: 'Nº de comprobante', type: 'text', hint: 'Opcional, si lo tenés.', maxLength: 40 },
      message('Observaciones'),
    ],
  },
  INFORMAR_MEDIDOR: {
    type: 'INFORMAR_MEDIDOR',
    path: '/autogestion/informar-medidor',
    title: 'Informá el estado de tu medidor',
    kicker: 'Autogestión',
    intro: 'Cargá la lectura de tu medidor o avisanos si notás alguna anomalía.',
    successTitle: '¡Gracias por informar!',
    successText: 'Registramos tu aviso. Si hace falta, el equipo técnico se va a comunicar con vos.',
    fields: [
      name,
      email(false),
      phone(true),
      nroCliente(),
      { name: 'nroMedidor', label: 'Nº de medidor', type: 'text', maxLength: 30 },
      { name: 'tipoAviso', label: 'Motivo', type: 'select', required: true, options: ['Lectura de consumo', 'Anomalía o problema con el medidor'] },
      { name: 'lectura', label: 'Lectura (m³)', type: 'number', hint: 'Solo si informás una lectura.', placeholder: '0' },
      { name: 'fechaLectura', label: 'Fecha de la lectura', type: 'date' },
      message('Detalle de la anomalía'),
    ],
  },
  ABM_SERVICIO: {
    type: 'ABM_SERVICIO',
    path: '/autogestion/abm-servicio',
    title: 'Altas, bajas y modificaciones',
    kicker: 'Autogestión',
    intro: 'Gestioná cambios sobre un servicio existente: baja, modificación de datos o cambio de titularidad.',
    successTitle: '¡Solicitud recibida!',
    successText: 'Tomamos tu pedido. Un representante te va a contactar para confirmar la gestión y la documentación necesaria.',
    fields: [
      name,
      email(),
      phone(true),
      nroCliente(),
      { name: 'tipoGestion', label: 'Tipo de gestión', type: 'select', required: true, options: ['Baja del servicio', 'Modificación de datos', 'Cambio de titularidad', 'Alta de servicio existente'] },
      { name: 'localidad', label: 'Localidad', type: 'text', required: true, maxLength: 80 },
      { name: 'domicilio', label: 'Domicilio del servicio', type: 'text', required: true, full: true, maxLength: 160 },
      message('Detalle de la gestión'),
    ],
  },
  NUEVO_SERVICIO: {
    type: 'NUEVO_SERVICIO',
    path: '/autogestion/nuevo-servicio',
    title: 'Solicitá un nuevo servicio',
    kicker: 'Autogestión',
    intro: 'Contanos dónde necesitás el servicio de gas natural y nos ponemos en contacto para guiarte en el trámite.',
    successTitle: '¡Solicitud enviada!',
    successText: 'Recibimos tu pedido de nuevo servicio. Vamos a revisar la factibilidad y a contactarte para los próximos pasos.',
    fields: [
      name,
      email(),
      phone(true),
      { name: 'dni', label: 'DNI del solicitante', type: 'text', required: true, maxLength: 15 },
      { name: 'localidad', label: 'Localidad', type: 'text', required: true, maxLength: 80 },
      { name: 'tipoUsuario', label: 'Tipo de usuario', type: 'select', required: true, options: ['Residencial', 'Comercial', 'Industrial', 'Otro'] },
      { name: 'domicilio', label: 'Domicilio donde se necesita el servicio', type: 'text', required: true, full: true, maxLength: 160 },
      { name: 'redEnCalle', label: '¿Hay red de gas en tu calle?', type: 'select', required: true, options: ['Sí', 'No', 'No lo sé'] },
      message('Comentarios adicionales'),
    ],
  },
  CONTACTO: {
    type: 'CONTACTO',
    path: '/contacto',
    title: 'Escribinos',
    kicker: 'Contacto',
    intro: 'Dejanos tu consulta y te respondemos a la brevedad. Si es una emergencia, llamá al 0800-777-8427.',
    successTitle: '¡Mensaje enviado!',
    successText: 'Recibimos tu consulta. Te vamos a responder por el medio de contacto que nos dejaste.',
    fields: [
      name,
      email(),
      phone(),
      { name: 'asunto', label: 'Asunto', type: 'select', required: true, options: ['Consulta general', 'Facturación', 'Servicio y conexiones', 'Obras y redes', 'Otro'] },
      message('Tu consulta', true),
    ],
  },
};

export function isLeadType(value: unknown): value is LeadTypeKey {
  return typeof value === 'string' && (LEAD_TYPES as readonly string[]).includes(value);
}

export type LeadValues = Record<string, string | boolean>;
export type LeadErrors = Record<string, string>;

const PHONE_RE = /^[0-9+()\-\s.]{6,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const NUMBER_RE = /^\d+([.,]\d{1,3})?$/;

/** Validación compartida cliente/servidor. Devuelve los valores ya normalizados. */
export function validateLead(
  config: LeadFormConfig,
  raw: Record<string, unknown>,
): { ok: true; values: LeadValues } | { ok: false; errors: LeadErrors } {
  const errors: LeadErrors = {};
  const values: LeadValues = {};

  for (const f of config.fields) {
    const input = raw[f.name];

    if (f.type === 'checkbox') {
      const v = input === true || input === 'true';
      if (f.required && !v) errors[f.name] = 'Tenés que aceptar para continuar.';
      values[f.name] = v;
      continue;
    }

    const v = (typeof input === 'string' ? input : '').trim();
    if (!v) {
      if (f.required) errors[f.name] = 'Este campo es obligatorio.';
      values[f.name] = '';
      continue;
    }

    const max = f.maxLength ?? (f.type === 'textarea' ? 2000 : 200);
    if (v.length > max) {
      errors[f.name] = `Máximo ${max} caracteres.`;
      continue;
    }
    if (f.type === 'email' && !EMAIL_RE.test(v)) errors[f.name] = 'Ingresá un correo válido.';
    else if (f.type === 'tel' && !PHONE_RE.test(v)) errors[f.name] = 'Ingresá un teléfono válido.';
    else if (f.type === 'date' && (!DATE_RE.test(v) || Number.isNaN(Date.parse(v)))) errors[f.name] = 'Fecha inválida.';
    else if (f.type === 'number' && !NUMBER_RE.test(v)) errors[f.name] = 'Ingresá solo números.';
    else if (f.type === 'select' && !f.options?.includes(v)) errors[f.name] = 'Elegí una opción de la lista.';
    values[f.name] = v;
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values };
}

/** Separa valores en columnas del Lead y extraData. */
export function splitLeadValues(values: LeadValues) {
  const core: Record<string, string | null> = { name: '', email: null, phone: null, message: null };
  const extraData: Record<string, string | boolean> = {};
  for (const [k, v] of Object.entries(values)) {
    if ((CORE_FIELDS as readonly string[]).includes(k)) core[k] = typeof v === 'string' && v ? v : k === 'name' ? '' : null;
    else if (v !== '') extraData[k] = v;
  }
  return { core: core as { name: string; email: string | null; phone: string | null; message: string | null }, extraData };
}

/** Etiquetas legibles para mostrar extraData en el CRM. */
export function extraFieldLabel(type: LeadTypeKey, key: string): string {
  return LEAD_FORMS[type]?.fields.find((f) => f.name === key)?.label ?? key;
}
