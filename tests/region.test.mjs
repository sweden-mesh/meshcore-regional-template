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
