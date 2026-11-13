import test from 'node:test';
import assert from 'node:assert/strict';
import { RATE, extraHeight } from '../assets/js/parallax.js';

test('the layer moves at 20 % of the scroll', () => assert.equal(RATE, 0.2));
test('extra height covers the whole scroll range at that rate', () => {
  assert.equal(extraHeight(5000, 1000), 800);
  assert.equal(extraHeight(800, 1000), 0);
});
