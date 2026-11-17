import { test } from "node:test";
import assert from "node:assert/strict";
import { nodePoints, pointsBounds, expandBounds, needsWiden, widenToFit, togglesWiden } from "../assets/js/map/camera.js";
import { wantedBounds } from "../assets/js/map/wanted.js";

const view = [[14.0, 57.7], [14.3, 57.85]]; // zoomed in on Jönköping

test("nodePoints leaves out unpositioned nodes, and foreign ones unless shown", () => {
  const ns = [{ lat: 57.7, lng: 14.1 }, { lat: 59.3, lng: 18.0, possiblyForeign: true }, { lat: 0, lng: 0 }, { lat: null, lng: 14 }];
  assert.deepEqual(nodePoints(ns, false), [[14.1, 57.7]]);
  assert.deepEqual(nodePoints(ns, true), [[14.1, 57.7], [18.0, 59.3]]);
});
test("pointsBounds spans the points, null for none", () => {
  assert.deepEqual(pointsBounds([[14, 58], [13, 57.5], [15, 57]]), [[13, 57], [15, 58]]);
  assert.equal(pointsBounds([]), null);
});
test("expandBounds is the union and skips nulls", () => {
  assert.deepEqual(expandBounds(view, null, [[14.4, 58.0], [14.5, 58.05]]), [[14.0, 57.7], [14.5, 58.05]]);
  assert.deepEqual(expandBounds(null, view), view);
  assert.equal(expandBounds(null, null), null);
});
test("needsWiden only when an item reaches past an edge", () => {
  assert.equal(needsWiden(view, [[14.1, 57.75], [14.2, 57.8]]), false);
  assert.equal(needsWiden(view, view), false);
  assert.equal(needsWiden(view, [[14.1, 57.75], [14.46, 57.8]]), true);  // east
  assert.equal(needsWiden(view, [[13.9, 57.75], [14.2, 57.8]]), true);   // west
  assert.equal(needsWiden(view, [[14.1, 57.6], [14.2, 57.8]]), true);    // south
  assert.equal(needsWiden(view, [[14.1, 57.75], [14.2, 58.02]]), true);  // north (Gränna)
  assert.equal(needsWiden(view, null), false);
});
test("wantedBounds covers the whole circle, not only the centre", () => {
  const b = wantedBounds([{ name: "Gränna", lat: 58.02, lon: 14.46 }]);
  assert.ok(b[0][1] < 58.02 - 0.004 && b[1][1] > 58.02 + 0.004);
  assert.ok(b[0][0] < 14.46 - 0.007 && b[1][0] > 14.46 + 0.007);
  assert.equal(wantedBounds([]), null);
});

// A flat fake map: 1 px = 0.001 degrees, 400 × 300 px.
function fakeMap(w, s, zoom = 11) {
  const calls = [];
  return {
    calls,
    getContainer: () => ({ clientWidth: 400, clientHeight: 300 }),
    unproject: ([x, y]) => ({ lng: w + x * 0.001, lat: s + (300 - y) * 0.001 }),
    getZoom: () => zoom,
    fitBounds: (b, o) => calls.push([b, o]),
  };
}
test("widenToFit keeps the camera when everything fits inside the padding", () => {
  const m = fakeMap(14.0, 57.6);
  assert.equal(widenToFit(m, [[14.1, 57.7], [14.3, 57.8]]), false);
  assert.equal(m.calls.length, 0);
});
test("widenToFit widens from the current view, never zooming in", () => {
  const m = fakeMap(14.0, 57.6);
  assert.equal(widenToFit(m, [[14.1, 57.7], [14.46, 58.02]], { animate: false }), true);
  const [b, o] = m.calls[0];
  // What was inside the padding stays inside it: no extra zoom-out for the margin.
  assert.ok(Math.abs(b[0][0] - 14.048) < 1e-9 && Math.abs(b[0][1] - 57.648) < 1e-9);
  assert.deepEqual(b[1], [14.46, 58.02]);
  assert.equal(o.maxZoom, 11);
  assert.equal(o.duration, 0);
  assert.equal(o.padding, 48);
});
test("widenToFit leaves a view it fitted alone (slack at the padding edge)", () => {
  const m = fakeMap(14.0, 57.6);
  assert.equal(widenToFit(m, [[14.0475, 57.6475], [14.3525, 57.8525]]), false); // 0.5 px into the padding
});
test("widenToFit counts the padding as outside", () => {
  const m = fakeMap(14.0, 57.6);
  assert.equal(widenToFit(m, [[14.01, 57.7], [14.2, 57.8]]), true); // 10 px from the west edge
});

// The fit button (B-286): the nodes shown and the wanted places while on, never the border.
import { fitItems, fitTo, expandBounds as union } from "../assets/js/map/camera.js";
import { unionBbox } from "../assets/js/map/region.js";
const nodes = [{ lat: 57.70, lng: 14.10 }, { lat: 57.85, lng: 14.30 }, { lat: 59.3, lng: 18.0, possiblyForeign: true }, { lat: 0, lng: 0 }];
const border = [{ bbox: [13.0, 57.1, 15.6, 58.2] }]; // Jönköping county, far wider than the nodes
const want = [[14.45, 58.01], [14.47, 58.03]];
test("fitItems frames the nodes shown, not the region's border", () => {
  const b = fitItems(nodes, false, null);
  assert.deepEqual(b, [[14.10, 57.70], [14.30, 57.85]]);
  assert.notDeepEqual(b, union(b, unionBbox(border))); // the border would have widened it
});
test("fitItems takes in foreign nodes only while shown", () => {
  assert.deepEqual(fitItems(nodes, true, null), [[14.10, 57.70], [18.0, 59.3]]);
});
test("fitItems takes in the wanted places while on, and works without nodes (no Beacon)", () => {
  assert.deepEqual(fitItems(nodes, false, want), [[14.10, 57.70], [14.47, 58.03]]);
  assert.deepEqual(fitItems([], false, want), want);
  assert.equal(fitItems([], false, null), null);
  assert.equal(fitItems(undefined, true, null), null);
});
test("fitTo frames the items themselves, so it can zoom in", () => {
  const m = fakeMap(13.0, 57.0, 8); // zoomed far out
  assert.equal(fitTo(m, [[14.1, 57.7], [14.3, 57.85]], { animate: false }), true);
  const [b, o] = m.calls[0];
  assert.deepEqual(b, [[14.1, 57.7], [14.3, 57.85]]); // not widened from the current view
  assert.equal(o.maxZoom, 12);                         // above the current zoom 8
  assert.equal(o.padding, 48);
  assert.equal(o.duration, 0);
});
test("fitTo does nothing when nothing is shown", () => {
  const m = fakeMap(13.0, 57.0);
  assert.equal(fitTo(m, null), false);
  assert.equal(m.calls.length, 0);
});

// B-289: zoomed in, switching "Önskade platser" on widens to the objects (nodes, circles), not the
// border; and only ever widens.
test("the toggle widening takes in the objects shown, not the region's border", () => {
  const m = fakeMap(14.0, 57.6); // 400 × 300 px over [14.0, 57.6]–[14.4, 57.9]
  assert.equal(widenToFit(m, fitItems(nodes, false, want), { animate: false }), true);
  const [b, o] = m.calls[0];
  assert.ok(b[1][1] >= 58.03 && b[1][0] >= 14.47);           // the circles fit
  assert.ok(b[0][0] > 13.5 && b[0][1] > 57.5 && b[1][1] < 58.1); // the border (13.0–15.6, 57.1–58.2) does not
  assert.equal(o.maxZoom, 11);                                // never zooms in
});
test("the toggle widening does nothing when the objects already fit", () => {
  const m = fakeMap(14.0, 57.6);
  assert.equal(widenToFit(m, fitItems(nodes, false, null)), false);
  assert.equal(m.calls.length, 0);
});

// B-304: "Utanför regionen" never moves the camera; only "Önskade platser" widens when switched on.
test("only the wanted-places toggle widens, and only when switched on", () => {
  assert.equal(togglesWiden("want", true), true);
  assert.equal(togglesWiden("want", false), false);
  assert.equal(togglesWiden("foreign", true), false);
  assert.equal(togglesWiden("foreign", false), false);
  assert.equal(togglesWiden("links", true), false);
});
