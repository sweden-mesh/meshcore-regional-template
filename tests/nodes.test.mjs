import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validPosition, nodesToGeoJSON } from "../assets/js/map/nodes.js";

const page = JSON.parse(readFileSync(new URL("./data/nodes-page.json", import.meta.url)));

test("validPosition drops 0/0, non-finite and out-of-range", () => {
  assert.equal(validPosition({ lat: 57.7, lng: 14.1 }), true);
  assert.equal(validPosition({ lat: 0, lng: 0 }), false);
  assert.equal(validPosition({ lat: null, lng: 14 }), false);
  assert.equal(validPosition({ lat: 91, lng: 14 }), false);
  assert.equal(validPosition({ lat: 57, lng: -181 }), false);
  assert.equal(validPosition({ lat: 0, lng: 14 }), true);
});

test("nodesToGeoJSON maps Beacon nodes to [lng, lat] points with flags", () => {
  const fc = nodesToGeoJSON(page.items);
  assert.equal(fc.features.length, page.items.filter(validPosition).length);
  const first = page.items[0], f = fc.features[0];
  assert.deepEqual(f.geometry.coordinates, [first.lng, first.lat]);
  assert.equal(f.properties.foreign, first.possiblyForeign);
  assert.equal(f.properties.nodeType, first.nodeType);
});

test("nodesToGeoJSON skips nodes without a position", () => {
  assert.equal(nodesToGeoJSON([{ id: "a", lat: 0, lng: 0 }, { id: "b" }]).features.length, 0);
});
