import test from 'node:test';
import assert from 'node:assert/strict';
import { formatStat } from '../src/format.js';

const nb = (s) => s.replace(/ | /g, ' ');

test('percentages follow the locale', () => {
  assert.equal(formatStat('46.9%', 'en-GB'), '46.9%');
  assert.match(nb(formatStat('46.9%', 'de-AT')), /^46,9 ?%$/);
  assert.match(nb(formatStat('46.9%', 'es-CL')), /^46,9 ?%$/);
});
test('scaled numbers keep their precision and their plus', () => {
  assert.equal(formatStat('1.32M', 'en-GB'), '1.32M');
  assert.match(nb(formatStat('1.32M', 'de-AT')), /^1,32 Mio\.$/);
  assert.equal(formatStat('835K+', 'en-GB'), '835K+');
  assert.equal(formatStat('3+', 'de-AT'), '3+');
});
test('plain numbers are grouped for the locale', () => {
  assert.equal(formatStat(60921, 'en-GB'), '60,921');
  assert.equal(nb(formatStat(60921, 'de-AT')), '60 921');
});
test('anything else is left alone', () => {
  for (const v of ['2015-2025', 'v1.7.1', 'Chile', 'per record']) assert.equal(formatStat(v, 'de-AT'), v);
});
