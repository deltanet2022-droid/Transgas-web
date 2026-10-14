import test from 'node:test';
import assert from 'node:assert/strict';
import { LEAD_FORMS, LEAD_TYPES, splitLeadValues, validateLead } from './config';
import { toCsv } from '../crm/leads';

test('hay una configuración para cada uno de los 6 tipos de formulario', () => {
  assert.equal(LEAD_TYPES.length, 6);
  for (const t of LEAD_TYPES) assert.equal(LEAD_FORMS[t].type, t);
});

test('valida obligatorios, email, teléfono, números, fechas y selects', () => {
  const cfg = LEAD_FORMS.INFORMAR_PAGO;
  const bad = validateLead(cfg, { name: 'Ana', email: 'no-es-mail', monto: 'abc', fechaPago: '10/10/2026', medioPago: 'Bitcoin' });
  assert.equal(bad.ok, false);
  if (!bad.ok) {
    assert.ok(bad.errors.email && bad.errors.monto && bad.errors.fechaPago && bad.errors.medioPago && bad.errors.nroCliente);
  }
  const ok = validateLead(cfg, {
    name: ' Ana Pérez ',
    email: 'ana@example.com',
    nroCliente: '123',
    fechaPago: '2026-10-10',
    monto: '15200,50',
    medioPago: 'Transferencia bancaria',
  });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.values.name, 'Ana Pérez');
});

test('el checkbox obligatorio de factura electrónica exige aceptación', () => {
  const cfg = LEAD_FORMS.FACTURA_ELECTRONICA;
  const base = { name: 'Ana', email: 'a@b.co', nroCliente: '1', dni: '30111222' };
  assert.equal(validateLead(cfg, { ...base, aceptaFacturaMail: false }).ok, false);
  assert.equal(validateLead(cfg, { ...base, aceptaFacturaMail: true }).ok, true);
});

test('ignora campos desconocidos y separa columnas de extraData', () => {
  const cfg = LEAD_FORMS.NUEVO_SERVICIO;
  const res = validateLead(cfg, {
    name: 'Luis',
    email: 'l@x.com',
    phone: '3385 480021',
    dni: '30111222',
    localidad: 'Mattaldi',
    tipoUsuario: 'Residencial',
    domicilio: 'Calle 1',
    redEnCalle: 'Sí',
    isAdmin: true,
  });
  assert.equal(res.ok, true);
  if (res.ok) {
    const { core, extraData } = splitLeadValues(res.values);
    assert.equal(core.name, 'Luis');
    assert.equal(core.phone, '3385 480021');
    assert.equal(core.message, null);
    assert.equal(extraData.localidad, 'Mattaldi');
    assert.equal('isAdmin' in extraData, false);
  }
});

test('el CSV escapa comillas y neutraliza fórmulas de Excel', () => {
  const csv = toCsv([['a', 'dice "hola"'], ['=HYPERLINK("x")', '+5493385']]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"dice ""hola"""'));
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`));
  assert.ok(csv.includes(`"'+5493385"`));
});
