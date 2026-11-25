import { test } from "node:test";
import assert from "node:assert/strict";
import { basemapMissing } from "../assets/js/map/basemap.js";

test("the base map is missing when its style failed or four tiles failed, and none has arrived (B-389)", () => {
  assert.equal(basemapMissing({}), false);
  assert.equal(basemapMissing({ styleFailed: true }), true);
  assert.equal(basemapMissing({ tileErrors: 3 }), false);       // a few lost tiles is a slow network
  assert.equal(basemapMissing({ tileErrors: 4 }), true);
  assert.equal(basemapMissing({ tileErrors: 40, tilesLoaded: 1 }), false);
  assert.equal(basemapMissing({ styleFailed: true, tilesLoaded: 2 }), false);
});
