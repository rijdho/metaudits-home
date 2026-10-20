// The cards in public/data/audits.json, in English (the only interface language since 2026-10-20).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import en from '../src/i18n/en.js';

const audits = JSON.parse(readFileSync(new URL('../public/data/audits.json', import.meta.url)));

test('every card is described', () => {
  for (const a of audits) assert.ok(a.description, `${a.id}: description`);
});
test('every card has a known kind, access level and theme', () => {
  for (const a of audits) assert.ok(['tool', 'dashboard'].includes(a.kind), `${a.id}: kind ${a.kind}`);
  for (const a of audits) {
    assert.ok(['open', 'protected'].includes(a.access), `${a.id}: access ${a.access}`);
    assert.ok(en[`theme.${a.category}`], `${a.id}: theme ${a.category}`);
  }
});
test('a version, where given, is vN.N.N', () => {
  for (const a of audits) if ('version' in a) assert.match(a.version, /^v\d+\.\d+\.\d+$/, `${a.id}: ${a.version}`);
});
test('no card carries figures any more', () => {
  for (const a of audits) assert.ok(!('stats' in a), `${a.id}: stats`);
});
test('no em dash in the cards', () => {
  assert.ok(!JSON.stringify(audits).includes('—'));
});
test('every card links to an absolute https URL', () => {
  // The page is served from rijdho.github.io/metaudits-home while the tools live on
  // metaudits.rijdho.org, so a relative href would point into this repository's site.
  for (const a of audits) assert.match(a.href, /^https:\/\/[a-z0-9.-]+\//, `${a.id}: ${a.href}`);
});
test('a GitHub tag points at a rijdho repository', () => {
  for (const a of audits) if ('repo' in a) assert.match(a.repo, /^https:\/\/github\.com\/rijdho\/[\w.-]+$/, `${a.id}: ${a.repo}`);
});
test('ids are unique', () => {
  assert.equal(new Set(audits.map((a) => a.id)).size, audits.length);
});
test('the host mark matches where the card links', () => {
  const HOSTS = { 'rijdho.github.io': 'github', 'metaudits.rijdho.org': 'cloudflare' };
  for (const a of audits) assert.equal(a.host, HOSTS[new URL(a.href).host], `${a.id}: ${a.host} for ${a.href}`);
});
test('a licence line uses the short names only', () => {
  const KNOWN = ['Apache-2.0', 'AGPL-3.0', 'MIT', 'CC BY 4.0', 'CC0 1.0'];
  for (const a of audits) if ('license' in a) for (const part of a.license.split(' · ')) assert.ok(KNOWN.includes(part), `${a.id}: ${part}`);
});
