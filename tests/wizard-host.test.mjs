import { test } from "node:test";
import assert from "node:assert/strict";
import { kmBetween, nearestKm, circleRing, coverageGeoJSON, placeKind, assess, coarse, borderPolygons } from "../assets/js/wizard/host.js";

const jkg = { lat: 57.78, lng: 14.16 };
const box = borderPolygons([{ geometry: { type: "Polygon", coordinates: [[[13, 57], [15.5, 57], [15.5, 58.5], [13, 58.5], [13, 57]]] } }]);

test("distances are great-circle km", () => {
  assert.ok(Math.abs(kmBetween(57, 14, 58, 14) - 111.2) < 0.1);
  assert.equal(nearestKm(57, 14, []), Infinity);
});
test("a circle ring is closed and lies at the radius", () => {
  const r = circleRing(jkg.lat, jkg.lng, 2);
  assert.deepEqual(r[0], r.at(-1));
  for (const [lon, lat] of r) assert.ok(Math.abs(kmBetween(jkg.lat, jkg.lng, lat, lon) - 2) < 0.02);
  assert.equal(coverageGeoJSON([jkg, jkg], 2).geometry.coordinates.length, 2);
});
test("outside every 2 km circle is the edge; inside one is covered; outside the border says so", () => {
  assert.equal(placeKind(57.78, 14.19, [jkg], box, 2), "inside");   // ~1.8 km east
  assert.equal(placeKind(57.78, 14.20, [jkg], box, 2), "edge");     // ~2.4 km east
  assert.equal(placeKind(57.78, 14.20, [jkg], box, 3), "inside");   // the radius is a parameter
  assert.equal(placeKind(59.5, 14.16, [jkg], box, 2), "outside");
  assert.equal(placeKind(59.5, 14.16, [jkg], [], 2), "edge");       // no border known: never "outside"
  assert.equal(placeKind(57.5, 14, [], box, 2), "edge");            // no repeaters: all edge
});
test("the result lists strengths and tips, never a grade, and a weak site still gets a strength", () => {
  const best = assess({ height: "high", view: "open", power: "mains", wifi: "yes", shadow: "yes", place: "edge" });
  assert.deepEqual(best, { strengths: ["high", "view", "power", "wifi", "edge", "shadow"], tips: [] });
  const weak = assess({ height: "low", view: "blocked", power: "none", wifi: "no", shadow: "no", place: "inside" });
  assert.deepEqual(weak.strengths, ["inside"]);
  assert.deepEqual(weak.tips, ["low", "blocked", "solar", "nowifi"]);
  assert.deepEqual(assess({}), { strengths: [], tips: [] });
  assert.deepEqual(assess({ place: "outside" }).tips, ["outside"]);
});
test("the summary position is coarse: two decimals, about 1 km", () => {
  assert.equal(coarse(57.78264), "57.78");
  assert.equal(coarse(14.1549), "14.15");
});
