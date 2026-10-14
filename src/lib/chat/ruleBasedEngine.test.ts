import test from 'node:test';
import assert from 'node:assert/strict';
import { faqs as seedFaqs } from '../../../prisma/seed-data/faqs';
import { RuleBasedEngine } from './ruleBasedEngine';
import { containsSensitiveData } from './guards';
import { normalize, tokenize } from './normalize';
import type { ChatTurn, FaqRecord } from './types';

const records: FaqRecord[] = seedFaqs.map((f, i) => ({ id: `faq${i}`, ...f }));
const byQuestion = (q: string) => records.find((r) => r.question === q)!;
const engine = (random = () => 0) =>
  new RuleBasedEngine({ getFaqs: async () => records, emergencyPhone: '0800-777-8427', random });

/** Simula una conversación completa, devolviendo el historial como lo reconstruye /api/chat. */
async function chat(e: RuleBasedEngine, messages: string[]) {
  const history: ChatTurn[] = [];
  const replies = [];
  for (const m of messages) {
    const r = await e.getResponse(history, m);
    replies.push(r);
    history.push({ role: 'user', text: m });
    history.push({ role: 'bot', text: r.text, meta: { kind: r.kind, faqId: r.faqId } });
  }
  return replies;
}

test('normalize: minúsculas, sin tildes ni signos', () => {
  assert.equal(normalize('¿Cuánto TARDA el Alta?!'), 'cuanto tarda el alta');
  assert.deepEqual(tokenize('Quiero pagar mis facturas'), ['pago', 'factura']);
});

test('quick replies del widget responden la FAQ correcta', async () => {
  const e = engine();
  const cases: [string, string][] = [
    ['Quiero ver mi factura', '¿Cómo veo y pago mi factura?'],
    ['Tengo falta de suministro', 'Me quedé sin gas / falta de suministro'],
    ['Quiero consultar tarifas', '¿Dónde veo las tarifas?'],
    ['Quiero consultar obras y redes', 'Obras y redes de gas'],
    ['Mi factura', '¿Cómo veo y pago mi factura?'],
    ['Un trámite', '¿Qué trámites puedo hacer online?'],
  ];
  for (const [msg, q] of cases) {
    const [r] = await chat(e, [msg]);
    assert.equal(r.kind, 'faq', msg);
    assert.equal(r.faqId, byQuestion(q).id, msg);
  }
});

test('tolera tildes, mayúsculas, plurales, sinónimos y errores de tipeo', async () => {
  const e = engine();
  const [a] = await chat(e, ['donde puedo pagar mi BOLETA']);
  assert.equal(a.faqId, byQuestion('¿Cómo veo y pago mi factura?').id);
  const [b] = await chat(e, ['quiero ahorrar gas en inivierno']); // typo + sinónimo
  assert.equal(b.faqId, byQuestion('Uso eficiente del gas').id);
  const [c] = await chat(e, ['necesito un gasista matriculado']);
  assert.equal(c.faqId, byQuestion('¿Cómo encuentro un gasista matriculado?').id);
});

test('frases específicas ganan a palabras sueltas', async () => {
  const e = engine();
  const [a] = await chat(e, ['quiero adherirme a la factura electrónica']);
  assert.equal(a.faqId, byQuestion('¿Cómo me adhiero a la factura electrónica?').id);
  const [b] = await chat(e, ['pagué y no figura mi factura']);
  assert.equal(b.faqId, byQuestion('Pagué y no se ve reflejado').id);
  const [c] = await chat(e, ['cuanto cuesta conectarme al gas']);
  assert.equal(c.faqId, byQuestion('¿Cuánto cuesta conectarme a la red?').id);
});

test('emergencia: el 0800 va PRIMERO y se ofrece WhatsApp', async () => {
  const e = engine();
  for (const msg of ['siento olor a gas', 'tengo una fuga de gas en la cocina', 'creo que tengo monóxido', 'Tengo una emergencia']) {
    const [r] = await chat(e, [msg]);
    assert.equal(r.kind, 'emergency', msg);
    assert.equal(r.emergency, true);
    assert.ok(r.text.startsWith('🚨 Emergencias 24 hs: llamá ahora al 0800-777-8427'), `${msg} → ${r.text}`);
    assert.equal(r.handoff?.reason, 'emergency');
  }
});

test('emergencia agrega la FAQ de seguridad relacionada después del 0800', async () => {
  const [r] = await chat(engine(), ['hay olor a gas']);
  assert.match(r.text, /No accionés llaves de luz/);
  assert.ok(r.text.indexOf('0800') < r.text.indexOf('No accionés'));
});

test('pedido de hablar con una persona deriva a WhatsApp', async () => {
  const e = engine();
  for (const msg of ['quiero hablar con una persona', 'necesito hablar con alguien', 'pasame con un operador', 'atención al cliente']) {
    const [r] = await chat(e, [msg]);
    assert.equal(r.kind, 'handoff', msg);
    assert.equal(r.handoff?.reason, 'human_requested');
  }
});

test('sin match: repregunta una vez y a la segunda deriva a WhatsApp', async () => {
  const e = engine();
  const [r1, r2] = await chat(e, ['blablabla xyz', 'qwerty asdf']);
  assert.equal(r1.kind, 'clarify');
  assert.match(r1.text, /¿Es sobre tu factura, sobre una emergencia, o sobre un trámite\?/);
  assert.equal(r1.handoff, undefined);
  assert.equal(r2.kind, 'handoff');
  assert.equal(r2.handoff?.reason, 'no_match');
  assert.match(r2.handoff!.summary, /blablabla xyz/);
});

test('responder la repregunta con algo útil resetea el conteo de intentos', async () => {
  const e = engine();
  const rs = await chat(e, ['asdf qwer', 'mi factura', 'zzzz yyyy']);
  assert.equal(rs[0].kind, 'clarify');
  assert.equal(rs[1].kind, 'faq');
  assert.equal(rs[2].kind, 'clarify'); // vuelve a repreguntar, no deriva
});

test('recuerda la última FAQ: "¿y eso cuánto tarda?"', async () => {
  const e = engine();
  const rs = await chat(e, ['quiero un nuevo servicio de gas', '¿y eso cuánto tarda?']);
  assert.equal(rs[0].faqId, byQuestion('¿Cómo solicito un nuevo servicio de gas?').id);
  assert.equal(rs[1].kind, 'faq');
  assert.equal(rs[1].faqId, byQuestion('¿Cuánto tarda el alta de un servicio?').id);
});

test('repregunta corta de costo también se resuelve por contexto', async () => {
  const rs = await chat(engine(), ['quiero conectar gas natural', 'y cuánto cuesta eso?']);
  assert.equal(rs[1].faqId, byQuestion('¿Cuánto cuesta conectarme a la red?').id);
});

test('sin contexto, "¿y eso cuánto tarda?" no inventa una respuesta', async () => {
  const [r] = await chat(engine(), ['¿y eso cuánto tarda?']);
  assert.equal(r.kind, 'clarify');
});

test('elige entre variantes sin repetir literalmente la anterior', async () => {
  const seen = new Set<string>();
  for (let i = 0; i < 12; i++) {
    const e = engine(() => i / 12);
    const [r] = await chat(e, ['hola']);
    seen.add(r.text);
  }
  assert.ok(seen.size >= 2, 'debería usar más de una variante');

  const e = engine(() => 0);
  const [a, b] = await chat(e, ['hola', 'hola']);
  assert.notEqual(a.text, b.text);
});

test('detecta datos sensibles (tarjeta, CBU, contraseña)', () => {
  assert.equal(containsSensitiveData('mi tarjeta es 4111 1111 1111 1111'), true);
  assert.equal(containsSensitiveData('4111111111111111'), true);
  assert.equal(containsSensitiveData('mi cbu es 0170099220000067797370'), true);
  assert.equal(containsSensitiveData('mi contraseña es hola1234'), true);
  assert.equal(containsSensitiveData('mi clave es 123456'), true);
  assert.equal(containsSensitiveData('llamo al 3385480200'), false);
  assert.equal(containsSensitiveData('no puedo ingresar con mi contraseña'), false);
  assert.equal(containsSensitiveData('quiero ver mi factura'), false);
});
