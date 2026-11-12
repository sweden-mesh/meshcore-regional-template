import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { allLinks, foldNeighbours, selectedLinks } from "../assets/js/map/neighbours.js";

const rows = JSON.parse(readFileSync(new URL("./data/neighbors.json", import.meta.url)));
const A = { id: "a", lat: 57.7, lng: 14.1, neighborIds: ["b", "c"] };
const B = { id: "b", lat: 57.8, lng: 14.2, neighborIds: ["a"] };
const C = { id: "c", lat: 0, lng: 0, neighborIds: ["a"] };

test("allLinks draws each pair once and skips ends without a position", () => {
  const fc = allLinks([A, B, C]);
  assert.equal(fc.features.length, 1);
  assert.deepEqual(fc.features[0].geometry.coordinates, [[14.1, 57.7], [14.2, 57.8]]);
});

test("foldNeighbours sums counts per neighbour across IATAs", () => {
  const f = foldNeighbours([
    { id: "x", observationCount: 3, lastSeen: 10, snr: -5 },
    { id: "x", observationCount: 4, lastSeen: 20, snr: -2 },
    { id: "y", observationCount: 1, lastSeen: 5 },
  ]);
  const x = f.find((r) => r.id === "x");
  assert.equal(x.observationCount, 7);
  assert.equal(x.lastSeen, 20);
  assert.equal(x.snr, -2);
  assert.equal(f.length, 2);
});

test("selectedLinks on captured rows: one line per neighbour with a position, age in [0,1]", () => {
  const node = { id: "me", lat: 57.76, lng: 14.13 };
  const fc = selectedLinks(node, rows, Math.max(...rows.map((r) => r.lastSeen)));
  assert.equal(fc.features.length, new Set(rows.filter((r) => r.lat && r.lng).map((r) => r.id)).size);
  for (const f of fc.features) assert.ok(f.properties.age >= 0 && f.properties.age <= 1);
});
