import test from 'node:test';
import assert from 'node:assert/strict';
import { PAGE_DEFS } from './pages';
import { sanitizeRichText } from '../lib/sanitize';
import { splitPhones } from '../lib/phones';
import { PRIVACY_LEGEND, PRIVACY_VERSION } from '../lib/privacy';

const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

test('páginas editables: slugs y rutas únicos', () => {
  assert.equal(new Set(PAGE_DEFS.map((p) => p.slug)).size, PAGE_DEFS.length);
  assert.equal(new Set(PAGE_DEFS.map((p) => p.path)).size, PAGE_DEFS.length);
});

test('el contenido original sobrevive al sanitizador (editor) sin perder texto ni enlaces', () => {
  for (const p of PAGE_DEFS) {
    const clean = sanitizeRichText(p.html);
    assert.ok(!/<script|onerror|javascript:/i.test(clean), p.slug);
    assert.ok(text(clean).length >= text(p.html).length * 0.99, `${p.slug}: el sanitizador recortó texto`);
    // enlaces internos sin target=_blank, externos con rel seguro
    assert.ok(!/href="\/[^"]*"[^>]*target=/.test(clean), `${p.slug}: enlace interno con target`);
    for (const m of clean.matchAll(/<a [^>]*href="https?:[^"]*"[^>]*>/g)) assert.match(m[0], /rel="noopener noreferrer"/);
  }
});

test('el sanitizador elimina HTML peligroso que pegue un editor', () => {
  const dirty = '<p onclick="x()">Hola<script>alert(1)</script></p><img src=x onerror=alert(1)><a href="javascript:alert(1)">malo</a><iframe src="//evil"></iframe>';
  const clean = sanitizeRichText(dirty);
  assert.ok(!/script|onclick|onerror|javascript:|iframe|<img/i.test(clean), clean);
});

test('los marcadores usados en las páginas son los soportados', () => {
  const ok = ['emergencia', 'suministro', 'telefono', 'horario', 'direccion', 'privacidad_email'];
  for (const p of PAGE_DEFS) for (const m of p.html.matchAll(/\{\{\s*([a-z_]+)\s*\}\}/gi)) assert.ok(ok.includes(m[1]), `${p.slug}: {{${m[1]}}}`);
});

test('la política de privacidad contiene lo que exige la Ley 25.326', () => {
  const p = PAGE_DEFS.find((x) => x.slug === 'privacidad')!;
  const t = text(p.html);
  for (const must of ['Responsable', 'finalidad|Para qué usamos', 'consentimiento', 'acceso', 'rectificación', 'supresión', 'diez días|10 días', '5 días hábiles', 'Agencia de Acceso a la Información Pública', 'transferencia internacional|Transferencia internacional']) {
    assert.match(t, new RegExp(must, 'i'), must);
  }
  assert.match(PRIVACY_LEGEND, /25\.326/);
  assert.match(PRIVACY_VERSION, /^\d{4}-\d{2}$/);
});

test('splitPhones separa varios teléfonos y completa el código de área', () => {
  assert.deepEqual(
    splitPhones('03385-498420 / 498165').map((p) => p.label),
    ['03385-498420', '03385-498165'],
  );
  assert.deepEqual(
    splitPhones('03463-497233 / 03463-497079').map((p) => p.tel),
    ['03463497233', '03463497079'],
  );
  assert.equal(splitPhones('03583-497227 / 03583-15647719').length, 2);
  assert.equal(splitPhones(null).length, 0);
});
