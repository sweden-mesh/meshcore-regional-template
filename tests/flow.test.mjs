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
