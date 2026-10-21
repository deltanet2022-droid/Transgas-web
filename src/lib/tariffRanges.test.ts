import assert from 'node:assert/strict';
import { test } from 'node:test';
import { annualRange, bimonthlyRange } from './tariffRanges';

const nbsp = (s: string | null) => s?.replace(/ /g, ' ') ?? null;

test('rangos anuales oficiales de las categorías residenciales y SGP', () => {
  assert.equal(nbsp(annualRange('R1')), 'Hasta 500 m³');
  assert.equal(nbsp(annualRange('R2-1')), 'De 501 a 650 m³');
  assert.equal(nbsp(annualRange('R3-4')), 'De 1.801 a 3.000 m³');
  assert.equal(nbsp(annualRange('R4')), 'Más de 3.000 m³');
  assert.equal(nbsp(annualRange('SGP1')), 'Hasta 12.000 m³');
  assert.equal(nbsp(annualRange('SGP3-b')), 'Más de 180.000 m³');
});

test('el código se reconoce sin importar mayúsculas ni espacios', () => {
  assert.equal(annualRange('sgp3-A'), annualRange('SGP3-a'));
  assert.equal(annualRange('r2 - 2'.replace(' - ', '-')), annualRange('R2-2'));
});

test('equivalente por bimestre = consumo anual ÷ 6', () => {
  assert.equal(nbsp(bimonthlyRange('R1')), 'Hasta 83 m³');
  assert.equal(nbsp(bimonthlyRange('R2-1')), 'De 84 a 108 m³');
  assert.equal(nbsp(bimonthlyRange('SGP1')), 'Hasta 2.000 m³');
  assert.equal(nbsp(bimonthlyRange('R3-4')), 'De 300 a 500 m³');
  assert.equal(nbsp(bimonthlyRange('R4')), 'Más de 500 m³');
});

test('el texto cargado en el CRM tiene prioridad y las categorías desconocidas devuelven null', () => {
  assert.equal(annualRange('R1', '  Hasta 480 m³/año '), 'Hasta 480 m³/año');
  assert.equal(annualRange('XYZ'), null);
  assert.equal(bimonthlyRange('XYZ'), null);
});
