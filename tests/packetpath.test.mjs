import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { packetRoutes, routesToGeoJSON, RecentPackets, recentListHtml } from "../assets/js/map/packetpath.js";

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
  assert.ok(!html.includes("<b>evil"));
});
