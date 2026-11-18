import { test } from "node:test";
import assert from "node:assert/strict";
import { unionBbox } from "../assets/js/map/region.js";

test("unionBbox covers every border", () => {
  assert.deepEqual(unionBbox([{ bbox: [13, 57, 14, 58] }, { bbox: [14.5, 56.5, 15.5, 57.5] }]), [[13, 56.5], [15.5, 58]]);
});
test("unionBbox ignores features without a usable bbox", () => {
  assert.deepEqual(unionBbox([{ bbox: [13, 57, 14, 58] }, {}, null]), [[13, 57], [14, 58]]);
  assert.equal(unionBbox([]), null);
});

import { borderStyle } from "../assets/js/map/region.js";

test("borderStyle: one border full, several dimmer and thinner (B-348)", () => {
  assert.deepEqual(borderStyle(1), { line: 0.7, width: 1.5, fill: 0.05 });
  assert.deepEqual(borderStyle(0), borderStyle(1));
  const many = borderStyle(21);
  assert.ok(many.line < borderStyle(1).line && many.width < borderStyle(1).width);
  assert.deepEqual(borderStyle(2), many);
});
