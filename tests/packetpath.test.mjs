import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { packetRoutes, routesToGeoJSON, RecentPackets, recentListHtml, packetFacts, packetObservations, involved, channelName, pickPaint, SOFT_UNTIL } from "../assets/js/map/packetpath.js";
import { webcrypto } from "node:crypto";

const detail = JSON.parse(readFileSync(new URL("./data/packet-detail.json", import.meta.url)));

test("routes are one per observation, fastest first", () => {
  const routes = packetRoutes(detail, () => null);
  assert.equal(routes.length, detail.observations.length);
  for (let i = 1; i < routes.length; i++) assert.ok(routes[i - 1].ms <= routes[i].ms);
});

test("with the observer located, a resolved last hop becomes a drawable line", () => {
  const routes = packetRoutes(detail, () => ({ id: "obs", lat: 57.7, lng: 14.1 }));
  const drawable = routes.filter((r) => r.runs.length);
  assert.ok(drawable.length > 0);
  const fc = routesToGeoJSON(routes);
  assert.equal(fc.features.length, routes.reduce((n, r) => n + r.runs.length, 0));
  assert.equal(fc.features[0].properties.rank, routes.findIndex((r) => r.runs.length));
});

test("RecentPackets dedups by hash, newest first, capped", () => {
  const r = new RecentPackets(2);
  assert.equal(r.add({ packetHash: "a", packet: { payloadTypeName: "ADVERT" } }), true);
  assert.equal(r.add({ packetHash: "a", packet: {} }), false);
  r.add({ packetHash: "b", packet: {} }); r.add({ packetHash: "c", packet: {} });
  assert.deepEqual(r.items.map((p) => p.hash), ["c", "b"]);
  assert.equal(r.items.find((p) => p.hash === "b").count, 1);
});

test("the recent list escapes summaries from the air", () => {
  const html = recentListHtml([{ hash: "x", type: "ADVERT", summary: "<b>evil</b>", count: 1 }]);
  assert.ok(html.includes("&lt;b&gt;evil"));
  assert.ok(!html.includes("<b>evil"));
});

const live = JSON.parse(readFileSync(new URL("./data/live-observations.json", import.meta.url))).map((m) => m.data);

test("facts: hop count, relays by name where resolved and by byte where not, the last hop's signal", () => {
  const f = packetFacts(live[4]); // 4a0770: Gisebo, unresolved 07, Norrängen
  assert.equal(f.hops, 3);
  assert.deepEqual(f.relays, ["SE-JKP-Gisebo-4AC6", "07", "SE-JKP-Norrängen-7016"]);
  assert.deepEqual(f.signal, { snr: -10.8, rssi: -113 });
  assert.equal(f.origin, null);
});

test("facts: a resolved source gives the origin's name and first 3 bytes; 0/0 is no signal", () => {
  const f = packetFacts({ observation: { snr: 0, rssi: 0, pathBytes: "", pathLength: { hashSize: 1, hopCount: 0 },
    resolvedSource: { confidence: "high", nodes: [{ name: "SE-JKG-Lekeryd-4D38 ", publicKey: "4d387d7b16" }] } } });
  assert.deepEqual(f.origin, { name: "SE-JKG-Lekeryd-4D38", short: "4D387D" });
  assert.equal(f.signal, null);
  assert.equal(f.hops, 0);
  const amb = packetFacts({ observation: { resolvedSource: { confidence: "ambiguous", nodes: [{ name: "x" }, { name: "y" }] } } });
  assert.equal(amb.origin, null, "an ambiguous source is never named");
});

test("RecentPackets keeps every observation and the observers' keys", () => {
  const r = new RecentPackets(5);
  for (const d of live) r.add({ ...d, observation: { ...d.observation, observerPublicKey: "k-" + d.observation.observerId } });
  assert.equal(r.items.length, 1);
  assert.equal(r.items[0].obs.length, live.length);
  assert.equal(r.observerKeys.get(live[0].observation.observerId), "k-" + live[0].observation.observerId);
});

test("the list: type, relays, signal; selected packet pressed; values escaped", () => {
  const r = new RecentPackets(5);
  r.add(live[4]);
  const html = recentListHtml(r.items, { selected: r.items[0].hash, now: r.items[0].last + 5 * 60e3 });
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /3 hopp: SE-JKP-Gisebo-4AC6 › 07 › SE-JKP-Norrängen-7016/);
  assert.match(html, /SNR −10,8 dB, RSSI −113 dBm/);
  assert.match(html, /5 min sedan/);
  const evil = recentListHtml([{ hash: "x", type: "ADVERT", count: 1, facts: { origin: { name: "<i>x</i>", short: "AB" }, relays: [] }, channel: "<b>" }]);
  assert.ok(!evil.includes("<i>x") && !evil.includes("<b>"));
});

test("detail observations get the live keys and source; involved nodes are the routes' and observers'", () => {
  const item = { obs: [{ observerId: "o1", observerPublicKey: "k1", resolvedSource: { confidence: "high", nodes: [] } }] };
  const obs = packetObservations(item, { observations: [{ observerId: "o1" }, { observerId: "o2" }] });
  assert.equal(obs[0].observerPublicKey, "k1");
  assert.equal(obs.length, 2);
  assert.deepEqual(packetObservations(item, null).map((o) => o.observerId), ["o1"]);
  const a = { id: "a", lng: 14, lat: 57 }, b = { id: "b", lng: 14.2, lat: 57.1 }, c = { id: "c", lng: 14.4, lat: 57.3 };
  const inv = involved([{ runs: [[a, b]] }], [b, c, null]);
  assert.deepEqual(inv.ids.sort(), ["a", "b", "c"]);
  assert.equal(inv.points.length, 3);
});

test("channel names from the one-byte channel hash", async () => {
  assert.equal(await channelName("11", ["JKG"], webcrypto.subtle), "Public");
  assert.equal(await channelName("98", ["JKG"], webcrypto.subtle), "#test-jkg");
  assert.equal(await channelName("81", [], webcrypto.subtle), "#wardriving");
  assert.equal(await channelName("a6", [], webcrypto.subtle), null);
});

test("dimming wraps the layer's own value, and nothing picked gives it back", () => {
  assert.equal(pickPaint(1, null, 0.1), 1);
  assert.deepEqual(pickPaint(1, ["a"], 0.1), ["case", ["in", ["get", "id"], ["literal", ["a"]]], 1, 0.1]);
});

test("pickPaint soft: the national overview dimmed zoomed out, the base zoomed in; a pick wins (B-347)", () => {
  assert.deepEqual(pickPaint(1, null, 0.12, "id", true), ["step", ["zoom"], 0.12, SOFT_UNTIL, 1]);
  assert.equal(pickPaint(1, null, 0.12, "id", false), 1);
  assert.deepEqual(pickPaint(1, ["a"], 0.12, "id", true), ["case", ["in", ["get", "id"], ["literal", ["a"]]], 1, 0.12]);
});
