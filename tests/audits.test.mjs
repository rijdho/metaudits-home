// The cards in public/data/audits.json must be complete in every interface language.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import en from '../src/i18n/en.js';
import es from '../src/i18n/es.js';
import de from '../src/i18n/de.js';

const audits = JSON.parse(readFileSync(new URL('../public/data/audits.json', import.meta.url)));

test('every card is described in English, Spanish and German', () => {
  for (const a of audits) {
    assert.ok(a.description, `${a.id}: en`);
    for (const lang of ['es', 'de']) assert.ok(a.i18n?.[lang]?.description, `${a.id}: ${lang}`);
  }
});
test('every card has a known access level and theme', () => {
  for (const a of audits) {
    assert.ok(['open', 'protected'].includes(a.access), `${a.id}: access ${a.access}`);
    for (const cat of [en, es, de]) assert.ok(cat[`theme.${a.category}`], `${a.id}: theme ${a.category}`);
  }
});
test('every stat has a label, and text values have translations', () => {
  for (const a of audits)
    for (const [k, v] of Object.entries(a.stats)) {
      for (const cat of [en, es, de]) assert.ok(cat[`stat.${k}`], `${a.id}: stat.${k}`);
      if (typeof v === 'string' && /^[a-z ]+$/.test(v)) for (const cat of [en, es, de]) assert.ok(cat[`val.${v}`], `${a.id}: val.${v}`);
    }
});
test('no em dash in the cards', () => {
  assert.ok(!JSON.stringify(audits).includes('—'));
});
test('every card links to an absolute https URL', () => {
  // The page is served from rijdho.github.io/metaudits-home while the tools live on
  // metaudits.rijdho.org, so a relative href would point into this repository's site.
  for (const a of audits) assert.match(a.href, /^https:\/\/[a-z0-9.-]+\//, `${a.id}: ${a.href}`);
});
