import { test } from "node:test";
import assert from "node:assert/strict";
import { visibleOnly, observerPoint, neighbourPoints, hiddenBy } from "../assets/js/map/visible.js";

// B-313: with "Utanför regionen" off, live-traffic effects must not draw hidden nodes.
const nodes = [
  { id: "a", lat: 57.7, lng: 14.1, publicKey: "AA", neighborIds: ["b", "f", "o"] },
  { id: "b", lat: 57.8, lng: 14.2, publicKey: "BB", neighborIds: ["a"] },
  { id: "f", lat: 59.3, lng: 18.0, publicKey: "FF", possiblyForeign: true, neighborIds: ["a"] },
  { id: "o", lat: 58.4, lng: 15.6, publicKey: "OO", neighborIds: ["a"] },   // outside the county
];
const isOutside = (n) => n.id === "o";
const pt = (n) => ({ id: n.id, lat: n.lat, lng: n.lng });

test("foreign nodes are gaps, glow-less and bubble-less while the toggle is off", () => {
  const state = { showForeign: false };
  const hidden = hiddenBy(state);
  assert.deepEqual(visibleOnly(nodes, nodes.slice(0, 3).map(pt), hidden).map((p) => p?.id ?? null), ["a", "b", null]);
  assert.equal(observerPoint(nodes, "ff", hidden), null);
  assert.deepEqual(neighbourPoints(nodes, "a", hidden).length, 2); // b and o (no county test here)
  state.showForeign = true; // back on: everything draws again
  assert.deepEqual(visibleOnly(nodes, nodes.slice(0, 3).map(pt), hidden).map((p) => p?.id ?? null), ["a", "b", "f"]);
  assert.equal(observerPoint(nodes, "FF", hidden)?.id, "f");
  assert.equal(neighbourPoints(nodes, "a", hidden).length, 3);
});

test("on a county page, nodes outside the county are hidden too", () => {
  const state = { showForeign: false };
  const hidden = hiddenBy(state, isOutside);
  assert.deepEqual(neighbourPoints(nodes, "a", hidden).map((p) => p.lat), [57.8]);
  assert.equal(observerPoint(nodes, "OO", hidden), null);
  state.showForeign = true;
  assert.equal(observerPoint(nodes, "OO", hidden)?.id, "o");
});

test("without a predicate nothing is hidden; unknown nodes stay gaps", () => {
  assert.deepEqual(visibleOnly(nodes, [pt(nodes[2]), { id: "zz", lat: 1, lng: 1 }]).map((p) => p?.id ?? null), ["f", null]);
});
