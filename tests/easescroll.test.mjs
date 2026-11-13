import test from 'node:test';
import assert from 'node:assert/strict';
import { easeOutCubic, DURATION } from '../assets/js/easescroll.js';

test('ease-out starts at 0, ends at 1, front-loaded', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.8);
});
test('quick but not instant', () => {
  assert.ok(DURATION >= 300 && DURATION <= 400);
});
