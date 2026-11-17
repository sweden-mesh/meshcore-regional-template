import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { allLinks, mergeLinkCounts, mergePairCounts, linkRole, rampColour, linkStyle, linkCountLoader, linkKey, linksFile } from "../assets/js/map/neighbours.js";
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
  t = 11 * 60e3; await l.sweep(nodes);
  assert.equal(calls.length, 6); // within 30 minutes and unchanged: nothing again
  t = 31 * 60e3; await l.sweep(nodes);
  assert.equal(calls.length, 12);
});

test("linkCountLoader: only the nodes `want` asks for; a changed neighbour list is due after 10 minutes", async () => {
  const calls = [];
  const client = { get: async (path) => { calls.push(path); return []; } };
  let t = 0;
  const l = linkCountLoader(client, { staggerMs: 0, clock: () => t, sleep: async () => {} });
  const nodes = [{ id: "in", lat: 57, lng: 14, neighborIds: ["x"] }, { id: "out", lat: 57, lng: 14, neighborIds: ["x"], possiblyForeign: true }];
  const want = (n) => !n.possiblyForeign;
  await l.sweep(nodes, { want });
  assert.deepEqual(calls, ["/nodes/in/neighbors"]);
  const changed = [{ ...nodes[0], neighborIds: ["x", "y"] }, nodes[1]];
  t = 5 * 60e3; await l.sweep(changed, { want });
  assert.equal(calls.length, 1); // changed, but within 10 minutes
  t = 11 * 60e3; await l.sweep(changed, { want });
  assert.equal(calls.length, 2);
  t = 12 * 60e3; await l.sweep(changed); // "Utanför regionen" switched on: the other one now
  assert.deepEqual(calls.slice(2), ["/nodes/out/neighbors"]);
});

test("linkCountLoader: stop() ends a sweep early, the skipped nodes stay due; a sweep asked for while one runs follows it", async () => {
  const calls = [];
  let hidden = false;
  const client = { get: async (path) => { calls.push(path); if (calls.length === 2) hidden = true; return []; } };
  const l = linkCountLoader(client, { concurrency: 1, staggerMs: 0, clock: () => 0, stop: () => hidden, sleep: async () => {} });
  const nodes = ["a", "b", "c", "d"].map((id) => ({ id, lat: 57, lng: 14, neighborIds: ["z"] }));
  await l.sweep(nodes);
  assert.equal(calls.length, 2);
  hidden = false;
  const first = l.sweep(nodes.slice(0, 3));
  l.sweep(nodes); // queued behind the first
  await first; await l.idle();
  assert.deepEqual(calls.slice(2).sort(), ["/nodes/c/neighbors", "/nodes/d/neighbors"]);
});

const PAIRS = { generatedAt: 1, pairs: [
  { nodeId: "a", neighborId: "b", iata: "JKG", observationCount: 203, snr: null, firstSeen: 1, lastSeen: 1000 },
  { nodeId: "b", neighborId: "a", iata: "JKG", observationCount: 5, snr: 3, firstSeen: 1, lastSeen: 2000 },
  { nodeId: "a", neighborId: "c", iata: "HAD", observationCount: 7, snr: 1, firstSeen: 1, lastSeen: 3000 },
  { nodeId: "a", neighborId: "a", iata: "JKG", observationCount: 9, lastSeen: 1 },
] };

test("mergePairCounts: directed pairs summed per link like mergeLinkCounts, filtered by IATA", () => {
  const all = mergePairCounts(PAIRS.pairs);
  assert.deepEqual(all.get(linkKey("a", "b")), { count: 208, lastSeen: 2000 });
  assert.equal(all.size, 2);
  const jkg = mergePairCounts(PAIRS.pairs, ["JKG"]);
  assert.equal(jkg.size, 1);
  // The same as the per-node rows would give.
  const rows = new Map([["a", [{ id: "b", observationCount: 203, lastSeen: 1000 }]], ["b", [{ id: "a", observationCount: 5, lastSeen: 2000 }]]]);
  assert.deepEqual(mergeLinkCounts(rows).get(linkKey("a", "b")), jkg.get(linkKey("a", "b")));
});

test("linkCountLoader with a bulk file: one request per sweep and no per-node requests; a failed file falls back", async () => {
  const calls = [];
  const client = { get: async (path) => { calls.push(path); return [{ id: "z", observationCount: 1 }]; } };
  let t = 0, fail = false, files = 0;
  const bulk = async () => { files++; if (fail) throw new Error("404"); return PAIRS.pairs; };
  const l = linkCountLoader(client, { bulk, iatas: ["JKG"], staggerMs: 0, clock: () => t, sleep: async () => {} });
  const nodes = ["a", "b", "c"].map((id) => ({ id, lat: 57, lng: 14, neighborIds: ["z"] }));
  await l.sweep(nodes);
  assert.equal(files, 1);
  assert.equal(calls.length, 0);
  assert.equal(l.counts().get(linkKey("a", "b")).count, 208);
  assert.equal(l.counts().has(linkKey("a", "c")), false); // another IATA
  t = 5 * 60e3; await l.sweep(nodes);
  assert.equal(files, 1); // within 10 minutes
  fail = true; t = 11 * 60e3; await l.sweep(nodes);
  assert.equal(files, 2);
  assert.equal(calls.length, 3); // the file failed: per node this time
  assert.equal(l.counts().get(linkKey("a", "b")).count, 208); // the last good file still counts
});

test("linksFile: one file per IATA, a 404 is no links, other failures read the national file", async () => {
  const asked = [];
  const answers = { "/n/JKG.json": { status: 200, body: { iata: "JKG", pairs: [PAIRS.pairs[0]] } }, "/n/GVX.json": { status: 404 },
    "/n.json": { status: 200, body: PAIRS }, "/n/BAD.json": { status: 500 } };
  const fetch = async (u) => { asked.push(u); const a = answers[u] || { status: 404 };
    return { ok: a.status === 200, status: a.status, json: async () => a.body }; };
  assert.equal((await linksFile({ links: "/n/{iata}.json", all: "/n.json", iatas: ["JKG", "GVX"], fetch })()).length, 1);
  assert.deepEqual(asked, ["/n/JKG.json", "/n/GVX.json"]);
  asked.length = 0;
  assert.equal((await linksFile({ links: "/n/{iata}.json", all: "/n.json", iatas: ["JKG", "BAD"], fetch })()).length, 4);
  assert.ok(asked.includes("/n.json"));
  await assert.rejects(linksFile({ links: "/n/{iata}.json", iatas: ["BAD"], fetch })());
  await assert.rejects(linksFile({ links: "/missing.json", fetch })()); // a plain file's 404 is a failure
  assert.equal((await linksFile({ links: "/n.json", fetch })()).length, 4);
});
