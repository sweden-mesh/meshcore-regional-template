import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validPosition, nodesToGeoJSON } from "../assets/js/map/nodes.js";

const page = JSON.parse(readFileSync(new URL("./data/nodes-page.json", import.meta.url)));

test("validPosition drops 0/0, non-finite and out-of-range", () => {
  assert.equal(validPosition({ lat: 57.7, lng: 14.1 }), true);
  assert.equal(validPosition({ lat: 0, lng: 0 }), false);
  assert.equal(validPosition({ lat: null, lng: 14 }), false);
  assert.equal(validPosition({ lat: 91, lng: 14 }), false);
  assert.equal(validPosition({ lat: 57, lng: -181 }), false);
  assert.equal(validPosition({ lat: 0, lng: 14 }), true);
});

test("nodesToGeoJSON maps Beacon nodes to [lng, lat] points with flags", () => {
  const fc = nodesToGeoJSON(page.items);
  assert.equal(fc.features.length, page.items.filter(validPosition).length);
  const first = page.items[0], f = fc.features[0];
  assert.deepEqual(f.geometry.coordinates, [first.lng, first.lat]);
  assert.equal(f.properties.foreign, first.possiblyForeign);
  assert.equal(f.properties.nodeType, first.nodeType);
});

test("nodesToGeoJSON skips nodes without a position", () => {
  assert.equal(nodesToGeoJSON([{ id: "a", lat: 0, lng: 0 }, { id: "b" }]).features.length, 0);
});

import { publicNodes } from "../assets/js/map/nodes.js";
test("companions are left out unless the site opts in", () => {
  const ns = [{ id: "c", nodeType: 1 }, { id: "r", nodeType: 2 }, { id: "s", nodeType: 3 }];
  assert.deepEqual(publicNodes(ns).map((n) => n.id), ["r", "s"]);
  assert.equal(publicNodes(ns, { companions: true }).length, 3);
});
import { shortId } from "../assets/js/map/nodes.js";
test("shortId is the key's first 3 bytes in upper case", () => {
  assert.equal(shortId("0206800f16dc"), "020680");
  assert.equal(shortId(undefined), "");
});

import { mergeNodeUpdate } from "../assets/js/map/nodes.js";
test("nodeUpdate: omitted position kept, null cleared, iatas merged, new node added", () => {
  const nodes = [{ id: "a", name: "A", lat: 57.7, lng: 14.1, iatas: [{ iata: "JKG", lastHeard: 1 }, { iata: "GOT", lastHeard: 1 }] }];
  let out = mergeNodeUpdate(nodes, { nodeId: "a", name: "A2", iatas: [{ iata: "JKG", lastHeard: 9 }] });
  assert.equal(out[0].name, "A2");
  assert.equal(out[0].lat, 57.7);
  assert.deepEqual(out[0].iatas.map((x) => [x.iata, x.lastHeard]), [["GOT", 1], ["JKG", 9]]);
  out = mergeNodeUpdate(out, { nodeId: "a", lat: null, lng: null });
  assert.equal(out[0].lat, null);
  out = mergeNodeUpdate(out, { nodeId: "b", name: "B", lat: 57.8, lng: 14.2, nodeType: 2 });
  assert.equal(out.length, 2);
  assert.equal(nodes[0].name, "A");
});

test("nodesToGeoJSON: traffic is known neighbours plus relays seen since load", () => {
  const nodes = [
    { id: "a", lat: 57.7, lng: 14.1, knownNeighborCount: 3 },
    { id: "b", lat: 57.8, lng: 14.2 },
  ];
  const fc = nodesToGeoJSON(nodes, new Map([["a", 2], ["b", 5]]));
  assert.deepEqual(fc.features.map((f) => f.properties.traffic), [5, 5]);
  assert.deepEqual(nodesToGeoJSON(nodes).features.map((f) => f.properties.traffic), [3, 0]);
});

test("withSeeded adds the snapshot's seeded nodes the live list lacks", async () => {
  const { withSeeded } = await import("../assets/js/map/nodes.js");
  const square = [{ geometry: { type: "Polygon", coordinates: [[[14, 57], [15, 57], [15, 58], [14, 58], [14, 57]]] } }];
  const live = [{ id: "a", publicKey: "aa", lat: 57.5, lng: 14.5 }];
  const snap = [
    { id: "x", publicKey: "aa", seeded: true, lat: 57.5, lng: 14.5 },   // already live
    { id: "b", publicKey: "bb", seeded: true, lat: 57.6, lng: 14.6 },   // inside: added
    { id: "f", publicKey: "ff", seeded: true, lat: 59.3, lng: 18.0 },   // far away: left out
    { id: "c", publicKey: "cc", lat: 57.7, lng: 14.7 },                 // not seeded
  ];
  assert.deepEqual(withSeeded(live, snap, square).map((n) => n.id), ["a", "b"]);
  assert.deepEqual(withSeeded(live, null, square).map((n) => n.id), ["a"]);
});
