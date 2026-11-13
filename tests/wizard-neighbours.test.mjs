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

// A minimal stand-in for the partial's DOM: the edge box, the hint, and one checkbox per neighbour.
function fakeRoot(scopes) {
  const listeners = new Map();
  const el = (props = {}) => ({ hidden: true, checked: false, ...props,
    addEventListener(type, fn) { listeners.set(this, fn); },
    fire() { listeners.get(this)?.(); } });
  const boxes = scopes.map((value) => {
    const why = { textContent: "" };
    return el({ value, closest: () => ({ querySelector: () => why }) });
  });
  const list = { hidden: true, querySelectorAll: () => boxes };
  const edge = el(), hint = el();
  const root = {
    dataset: { areas: JSON.stringify(scopes.map((scope, i) => ({ scope, lan: scope, km: 40,
      rings: i === 0 ? [[[[14, 57], [15, 57], [15, 58], [14, 58], [14, 57]]]] : [] }))), texts: "{}" },
    querySelector: (sel) => (sel === "input[data-edge]" ? edge : sel === ".wz-nb-list" ? list : hint),
  };
  return { root, edge, list, boxes };
}

test("edge repeater: no neighbour unless the box is ticked; then the near ones are preselected", async () => {
  const { initNeighbours } = await import("../assets/js/wizard/neighbours.js");
  const { root, edge, list } = fakeRoot(["se-ost", "se-kro"]);
  const nb = initNeighbours(root, () => {});
  nb.setPosition(57.5, 14.5);            // inside se-ost's square
  assert.deepEqual(nb.scopes(), []);     // not an edge repeater yet
  edge.checked = true; edge.fire();
  assert.equal(list.hidden, false);
  assert.deepEqual(nb.scopes(), ["se-ost"]);
  edge.checked = false; edge.fire();
  assert.deepEqual(nb.scopes(), []);
});
