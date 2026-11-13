import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { distanceKm, nearNeighbours } from "../assets/js/wizard/neighbours.js";

const lan = JSON.parse(readFileSync(new URL("../assets/se-lan.geojson", import.meta.url)));
const shape = (scb) => lan.features.find((f) => f.properties.scb === scb).geometry.coordinates;

test("all 21 counties are in the borders file", () => assert.equal(lan.features.length, 21));
test("a point inside a county is 0 km from it", () => {
  assert.equal(distanceKm(57.78, 14.16, shape("06")), 0); // Jönköping city
});
test("distances to a neighbouring county are plausible", () => {
  // Mullsjö (in Jönköpings län) is a few km from Västra Götaland.
  assert.ok(distanceKm(57.917, 13.878, shape("14")) < 15);
  // Värnamo is far from Östergötland.
  assert.ok(distanceKm(57.186, 14.04, shape("05")) > 60);
});
test("near uses each neighbour's own limit", () => {
  const areas = [
    { scope: "se-a", lan: "A", km: 40, rings: shape("14") },
    { scope: "se-b", lan: "B", km: 40, rings: shape("05") },
  ];
  const r = Object.fromEntries(nearNeighbours(57.917, 13.878, areas).map((x) => [x.scope, x.near]));
  assert.deepEqual(r, { "se-a": true, "se-b": false });
});
