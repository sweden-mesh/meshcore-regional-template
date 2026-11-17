import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { allLinks, mergeLinkCounts, linkRole, rampColour, linkStyle, linkCountLoader, linkKey } from "../assets/js/map/neighbours.js";
import { palette } from "../assets/js/map/palette.js";

const rows = JSON.parse(readFileSync(new URL("./data/neighbors.json", import.meta.url)));
const A = { id: "a", lat: 57.7, lng: 14.1, neighborIds: ["b", "c"] };
const B = { id: "b", lat: 57.8, lng: 14.2, neighborIds: ["a"] };
const C = { id: "c", lat: 0, lng: 0, neighborIds: ["a"] };
const D = { id: "d", lat: 57.9, lng: 14.3, neighborIds: [] };
const P = palette("light", false);

test("allLinks draws each pair once and skips ends without a position", () => {
  const fc = allLinks([A, B, C], new Map(), { p: P });
  assert.equal(fc.features.length, 1);
  assert.deepEqual(fc.features[0].geometry.coordinates, [[14.1, 57.7], [14.2, 57.8]]);
  assert.equal(fc.features[0].properties.colour, P.linkNone); // no count yet: neutral
});

test("allLinks leaves out links to out-of-region nodes while those are hidden", () => {
  const F = { id: "f", lat: 58.1, lng: 14.6, neighborIds: ["a"], possiblyForeign: true };
  const A2 = { ...A, neighborIds: ["b", "f"] };
  const counts = new Map([[linkKey("a", "f"), { count: 9, lastSeen: Date.now() }]]);
  const pairs = (fc) => fc.features.map((f) => [f.properties.a, f.properties.b].sort().join("|")).sort();
  assert.deepEqual(pairs(allLinks([A2, B, F], counts, { p: P })), ["a|b", "a|f"]);
  assert.deepEqual(pairs(allLinks([A2, B, F], counts, { p: P, foreign: false })), ["a|b"]);
  const cb = palette("light", true);
  assert.deepEqual(pairs(allLinks([A2, B, F], counts, { p: cb, foreign: false })), ["a|b"]);
});

test("mergeLinkCounts sums the two directions and the IATAs into one value per link", () => {
  const m = mergeLinkCounts(new Map([
    ["a", [{ id: "b", observationCount: 203, lastSeen: 10 }, { id: "b", observationCount: 7, lastSeen: 30 }]],
    ["b", [{ id: "a", observationCount: 5, lastSeen: 20 }, { id: "d", observationCount: 1 }]],
  ]));
  assert.deepEqual(m.get(linkKey("a", "b")), { count: 215, lastSeen: 30 });
  assert.equal(m.get(linkKey("b", "a")).count, 215);
  assert.equal(m.get(linkKey("b", "d")).count, 1);
  assert.equal(m.size, 2);
});

test("mergeLinkCounts on captured rows: one link per neighbour", () => {
  const m = mergeLinkCounts(new Map([["me", rows]]));
  assert.equal(m.size, new Set(rows.map((r) => r.id)).size);
});

test("links found only in the counts are drawn too", () => {
  const counts = mergeLinkCounts(new Map([["b", [{ id: "d", observationCount: 50 }]]]));
  const fc = allLinks([A, B, D], counts, { p: P });
  assert.equal(fc.features.length, 2);
});

test("linkRole: all without a selection, own for the selected node's links, background otherwise", () => {
  assert.equal(linkRole("a", "b", null), "all");
  assert.equal(linkRole("a", "b", "a"), "own");
  assert.equal(linkRole("a", "b", "b"), "own");
  assert.equal(linkRole("a", "b", "d"), "background");
});

test("rampColour: absolute log10 stops, ends clamped, null without a count", () => {
  const r = ["#000000", "#808080", "#ffffff"];
  assert.equal(rampColour(0, r), null);
  assert.equal(rampColour(1, r), "#000000");
  assert.equal(rampColour(20, r), "#808080");      // log10(20) = 1.30
  assert.equal(rampColour(10000, r), "#ffffff");
  assert.equal(rampColour(Math.sqrt(20), r), "#404040"); // halfway to the middle stop
});

test("a link has the same colour with and without a selection, others turn faint grey", () => {
  const counts = mergeLinkCounts(new Map([["a", [{ id: "b", observationCount: 40 }]], ["b", [{ id: "d", observationCount: 3 }]]]));
  const col = (sel) => Object.fromEntries(allLinks([A, B, D], counts, { selected: sel, p: P }).features
    .map((f) => [linkKey(f.properties.a, f.properties.b), f.properties]));
  const none = col(null), selA = col("a");
  assert.equal(selA[linkKey("a", "b")].colour, none[linkKey("a", "b")].colour);
  assert.notEqual(none[linkKey("b", "d")].colour, P.linkMuted);
  assert.equal(selA[linkKey("b", "d")].colour, P.linkMuted);
  assert.ok(selA[linkKey("b", "d")].opacity < 0.5);
});

test("linkStyle: neutral without a count, focus thinner, colour-blind ramp in colour-blind mode", () => {
  assert.equal(linkStyle({ count: 0 }, { p: P }).colour, P.linkNone);
  assert.equal(linkStyle({ count: 500 }, { p: P }).width, 2.5);
  assert.equal(linkStyle({ count: 500 }, { p: P, focus: true }).width, 2.2);
  assert.equal(linkStyle({ count: 500 }, { p: palette("dark", true) }).colour, palette("dark", true).linkRamp[2]);
  assert.equal(linkStyle({ count: 1 }, { p: P }).colour, "#dc2626");
});

test("linkCountLoader: at most `concurrency` at once, one request per node with neighbours, cached", async () => {
  let open = 0, peak = 0, calls = [];
  const client = { get: async (path) => {
    calls.push(path); open++; peak = Math.max(peak, open);
    await new Promise((r) => setTimeout(r, 5)); open--;
    if (path.includes("bad")) throw new Error("x");
    return [{ id: "z", observationCount: 2 }];
  } };
  let t = 0;
  const nodes = ["n1", "n2", "n3", "n4", "n5", "bad"].map((id, i) => ({ id, lat: 57 + i / 10, lng: 14, neighborIds: ["z"] }))
    .concat([{ id: "lonely", lat: 57, lng: 14, neighborIds: [] }]);
  const l = linkCountLoader(client, { concurrency: 3, staggerMs: 0, clock: () => t, sleep: async () => {} });
  await l.sweep(nodes);
  assert.equal(calls.length, 6);
  assert.ok(peak <= 3);
  assert.equal(l.rows.size, 5); // the failed one stays out
  t = 5 * 60e3; await l.sweep(nodes);
  assert.equal(calls.length, 6); // within 10 minutes: nothing again
  t = 11 * 60e3; await l.sweep(nodes);
  assert.equal(calls.length, 12);
});
