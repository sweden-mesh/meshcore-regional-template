import { test } from "node:test";
import assert from "node:assert/strict";
import { chainFromObservation, runs, positionAt, HOP_MS } from "../assets/js/map/flow.js";

const hop = (id, lat, lng, confidence = "high") => ({ confidence, nodes: [{ id, latitude: lat, longitude: lng }] });

test("the chain is source, path, observer; unresolved hops are null", () => {
  const obs = { resolvedSource: hop("s", 57.7, 14.1), resolvedPath: [hop("r1", 57.8, 14.2), hop("r2", 57.9, 14.3, "ambiguous")] };
  const chain = chainFromObservation(obs, { id: "o", lat: 58, lng: 14.4 });
  assert.deepEqual(chain.map((p) => p && p.id), ["s", "r1", null, "o"]);
});

test("ambiguous, multi-node or 0/0 hops never become points", () => {
  const two = { confidence: "high", nodes: [{ id: "a", latitude: 57, longitude: 14 }, { id: "b", latitude: 57, longitude: 14 }] };
  assert.deepEqual(chainFromObservation({ resolvedSource: two, resolvedPath: [hop("z", 0, 0)] }), [null, null, null]);
});

test("runs splits at gaps, needs two points, collapses repeats", () => {
  const P = (id) => ({ id, lat: 1, lng: 1 });
  assert.deepEqual(runs([P("a"), P("b"), null, P("c"), null, P("d"), P("d"), P("e")]).map((r) => r.map((p) => p.id)),
    [["a", "b"], ["d", "e"]]);
  assert.deepEqual(runs([P("a"), null, P("b")]), []);
});

test("positionAt walks HOP_MS per hop and ends on the last point", () => {
  const run = [{ id: "a", lng: 0, lat: 0 }, { id: "b", lng: 10, lat: 0 }, { id: "c", lng: 10, lat: 10 }];
  assert.deepEqual(positionAt(run, HOP_MS / 2).coords, [5, 0]);
  const end = positionAt(run, 5 * HOP_MS);
  assert.deepEqual(end.coords, [10, 10]);
  assert.equal(end.done, true);
  assert.deepEqual(end.reached, ["a", "b", "c"]);
  assert.deepEqual(positionAt(run, 1.5 * HOP_MS).trail, [[0, 0], [10, 0], [10, 5]]);
});
import { bubblePositions, BUBBLE_MS } from "../assets/js/map/flow.js";
test("bubbles start at the transmitter and arrive at each neighbour", () => {
  const from = { lng: 0, lat: 0 }, ns = [{ lng: 10, lat: 0 }, { lng: 0, lat: 4 }];
  assert.deepEqual(bubblePositions(from, ns, 0), [[0, 0], [0, 0]]);
  assert.deepEqual(bubblePositions(from, ns, BUBBLE_MS / 2), [[5, 0], [0, 2]]);
  assert.deepEqual(bubblePositions(from, ns, BUBBLE_MS * 3), [[10, 0], [0, 4]]);
});

import { linkFlash, FADE_MS } from "../assets/js/map/flow.js";

test("a transmitting node's links flash, then fade, then are gone (B-314)", () => {
  const from = { lng: 14, lat: 57 }, ns = [{ lng: 14.1, lat: 57.1 }, { lng: 13.9, lat: 57.2 }];
  assert.deepEqual(linkFlash(from, ns, -1), []);
  const at0 = linkFlash(from, ns, 0);
  assert.equal(at0.length, 2);
  assert.deepEqual(at0[0].geometry.coordinates, [[14, 57], [14.1, 57.1]]);
  assert.equal(at0[0].properties.a, 1);
  const mid = linkFlash(from, ns, BUBBLE_MS + FADE_MS / 2)[0].properties.a;
  assert.ok(mid > 0.4 && mid < 0.6);
  assert.deepEqual(linkFlash(from, ns, BUBBLE_MS + FADE_MS + 1), []);
  assert.deepEqual(linkFlash(from, [], 0), []);
});

import { flashAt } from "../assets/js/map/flow.js";

test("the transmitter's flash: full strength while the bubbles travel, a ring that spreads and fades (B-347)", () => {
  assert.equal(flashAt(-1), null);
  assert.deepEqual(flashAt(0), { a: 1, t: 0, r: 0, ra: 1 });
  const mid = flashAt(BUBBLE_MS / 2);
  assert.equal(mid.a, 1);
  assert.equal(mid.t, 0.5);
  assert.ok(mid.r > 0 && mid.ra < 1);
  const end = flashAt(BUBBLE_MS + FADE_MS / 2);
  assert.ok(end.a > 0.4 && end.a < 0.6);
  assert.equal(end.r, 1);
  assert.equal(end.ra, 0);
  assert.equal(flashAt(BUBBLE_MS + FADE_MS + 1), null);
});

import { FlowLayer, needsRaise, FLASH_TOP } from "../assets/js/map/flow.js";

// A map that keeps only what the flow layer touches: sources and the layer order.
function fakeMap(initial = []) {
  const order = [...initial], sources = new Map();
  return {
    order,
    addSource: (id) => sources.set(id, { setData() {} }),
    getSource: (id) => sources.get(id),
    getLayer: (id) => (order.includes(id) ? { id } : undefined),
    addLayer: (l, before) => { const i = before ? order.indexOf(before) : -1; i >= 0 ? order.splice(i, 0, l.id) : order.push(l.id); },
    moveLayer: (id, before) => { order.splice(order.indexOf(id), 1); const i = before ? order.indexOf(before) : -1; i >= 0 ? order.splice(i, 0, id) : order.push(id); },
    getLayersOrder: () => [...order],
  };
}

test("needsRaise: only when the white centre exists and is not on top (B-349)", () => {
  assert.equal(needsRaise(["a", FLASH_TOP]), false);
  assert.equal(needsRaise([FLASH_TOP, "node-points"]), true);
  assert.equal(needsRaise(["a", "b"]), false);
  assert.equal(needsRaise(undefined), false);
});

test("the white centre is drawn above the node layers, also when they are added after it (B-349)", () => {
  const map = fakeMap(["links", "node-points", "node-obs-dot", "node-pills"]);
  let T = 0;
  const fl = new FlowLayer(map, { now: () => T });
  fl.kick = () => {};
  fl.install();
  assert.equal(map.order.at(-1), FLASH_TOP);
  assert.ok(map.order.indexOf("flow-flash-halo") > map.order.indexOf("node-points"));
  // a theme switch or redraw puts the node layers back on top
  map.order.push("node-points-2", "node-pills-2");
  fl.transmit({ id: "a", lng: 14, lat: 57 }, [{ lng: 14.1, lat: 57.1 }]);
  T = 300;
  fl.render();
  assert.equal(map.order.at(-1), FLASH_TOP);
});

import { brighten } from "../assets/js/map/flow.js";

test("a link flashes in its own colour brightened toward white, else white (B-350)", () => {
  assert.equal(brighten("#000000", 0.5), "#808080");
  assert.equal(brighten("#22c55e", 0), "#22c55e");
  assert.equal(brighten("#22c55e", 1), "#ffffff");
  assert.equal(brighten(undefined), "#ffffff");
  const from = { lng: 14, lat: 57 };
  const [green, plain] = linkFlash(from, [{ lng: 14.1, lat: 57.1, colour: "#000000" }, { lng: 14.2, lat: 57.2 }], 0);
  assert.equal(green.properties.c, brighten("#000000"));
  assert.notEqual(green.properties.c, "#ffffff");
  assert.equal(plain.properties.c, "#ffffff");
});

test("an active repeater's aura is never more than twice the marker (operator 2026-11-22)", async () => {
  const { NODE_MARKER_R, FLASH_AURA_R, FLASH_AURA_OPACITY } = await import("../assets/js/map/flow.js");
  assert.ok(FLASH_AURA_R <= 2 * NODE_MARKER_R);
  assert.ok(FLASH_AURA_OPACITY <= 0.5);
  const { FLASH_FAR_ZOOM, FLASH_NEAR_ZOOM } = await import("../assets/js/map/flow.js");
  assert.ok(FLASH_FAR_ZOOM < FLASH_NEAR_ZOOM);
});
