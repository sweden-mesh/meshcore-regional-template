import { test } from "node:test";
import assert from "node:assert/strict";
import { toGeoJSON } from "../assets/js/map/newmap.js";

test("the new-repeaters map draws placed nodes only, with short id, first day and observer (B-362)", () => {
  const g = toGeoJSON([
    { publicKey: "aa11bb22", name: "A", lat: 57, lng: 14, first: "2026-11-18", isObserver: true },
    { publicKey: "cc33", name: "B", lat: null, lng: null },
  ]);
  assert.equal(g.features.length, 1);
  assert.deepEqual(g.features[0].geometry.coordinates, [14, 57]);
  assert.deepEqual(g.features[0].properties, { name: "A", short: "AA11BB", first: "2026-11-18", observer: true });
});
