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
