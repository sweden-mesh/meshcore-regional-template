import { test } from "node:test";
import assert from "node:assert/strict";
import { circleRingM, wantedGeoJSON, validPlaces, wantedPopupHtml, wantedLegend, starImage, RADIUS_M } from "../assets/js/map/wanted.js";
import { kmBetween } from "../assets/js/wizard/host.js";
import { parseState, writeState } from "../assets/js/map/urlstate.js";

const places = [
  { name: "Utsikten", lat: 57.7012, lon: 14.2471, note: "högt läge" },
  { name: "Västra höjden", lat: 57.8031, lon: 13.9822 },
];

test("the circle is about 1 km across, every point 500 m from the centre", () => {
  const ring = circleRingM(57.7012, 14.2471, RADIUS_M);
  assert.equal(RADIUS_M, 500);
  assert.deepEqual(ring[0], ring[ring.length - 1]);
  for (const [lon, lat] of ring) assert.ok(Math.abs(kmBetween(57.7012, 14.2471, lat, lon) * 1000 - 500) < 0.5, `${lat},${lon}`);
  const lons = ring.map((p) => p[0]), lats = ring.map((p) => p[1]);
  // East-west and north-south extents in metres: both 1 km within 1 m.
  const ew = kmBetween(57.7012, Math.min(...lons), 57.7012, Math.max(...lons)) * 1000;
  const ns = kmBetween(Math.min(...lats), 14.2471, Math.max(...lats), 14.2471) * 1000;
  assert.ok(Math.abs(ew - 1000) < 1, `ew ${ew}`);
  assert.ok(Math.abs(ns - 1000) < 1, `ns ${ns}`);
});

test("GeoJSON from the params: one area and one centre per valid place", () => {
  const { areas, centres } = wantedGeoJSON(places);
  assert.equal(areas.features.length, 2);
  assert.deepEqual(centres.features.map((f) => f.geometry.coordinates), [[14.2471, 57.7012], [13.9822, 57.8031]]);
  assert.deepEqual(centres.features.map((f) => f.properties), [{ name: "Utsikten", note: "högt läge" }, { name: "Västra höjden", note: "" }]);
  assert.equal(areas.features[1].geometry.type, "Polygon");
  assert.equal(areas.features[1].geometry.coordinates[0].length, 65);
});

test("places without a name or a usable position are left out; no list is no places", () => {
  assert.deepEqual(validPlaces([{ name: "", lat: 1, lon: 1 }, { name: "x", lat: "57", lon: 14 }, { name: "y", lat: 95, lon: 14 },
    { name: "z", lat: 57, lon: NaN }, null, { name: "ok", lat: 0, lon: 0 }]).map((p) => p.name), ["ok"]);
  assert.deepEqual(wantedGeoJSON(undefined).centres.features, []);
  assert.deepEqual(wantedGeoJSON({}).areas.features, []);
});

test("the popup names the place and escapes what the config says", () => {
  const html = wantedPopupHtml({ name: "<b>Berg & dal</b>", note: "\"högt\" <script>" });
  assert.ok(html.includes("<h3>&lt;b&gt;Berg &amp; dal&lt;/b&gt;</h3>"), html);
  assert.ok(html.includes("&quot;högt&quot; &lt;script&gt;"), html);
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("Här vill regionen gärna ha en ny repeater."));
  assert.equal(wantedPopupHtml({ name: "A", note: "" }).match(/<p/g).length, 1);
});

test("the legend entry shows only while the toggle is on", () => {
  assert.deepEqual(wantedLegend(), [{ swatch: "wanted", label: "önskad plats för en ny repeater (cirka 1 km)", when: ["want"] }]);
});

test("wanted places are off by default and written only when on", () => {
  assert.equal(writeState("", { want: true }), "?want=1");
  assert.equal(writeState("?want=1&z=9.0", { want: false }), "?z=9.0");
  assert.deepEqual(parseState("?want=1"), { want: true });
  assert.deepEqual(parseState("?want=0"), { want: false });
  assert.deepEqual(parseState(writeState("?cov=1", { want: true })), { cov: true, want: true });
});

test("the star: gold inside, a dark edge, transparent corners, doubled on a 2× screen", () => {
  const img = starImage(16, 1);
  assert.equal(img.width, 16);
  assert.equal(img.data.length, 16 * 16 * 4);
  const px = (im, x, y) => Array.from(im.data.slice((y * im.width + x) * 4, (y * im.width + x) * 4 + 4));
  assert.deepEqual(px(img, 8, 9), [251, 191, 36, 255]); // centre: gold, opaque
  assert.equal(px(img, 0, 0)[3], 0);
  assert.equal(px(img, 15, 15)[3], 0);
  // The top tip is the edge colour (dark), not gold.
  const tip = px(img, 8, 2);
  assert.ok(tip[3] > 0 && tip[0] < 200, String(tip));
  const filled = (im) => { let n = 0; for (let i = 3; i < im.data.length; i += 4) if (im.data[i] > 127) n++; return n; };
  const n1 = filled(img), n2 = filled(starImage(16, 2));
  assert.ok(n1 > 40 && n1 < 160, `${n1} px`); // a star, not a square or a dot
  assert.ok(Math.abs(n2 / n1 - 4) < 0.6, `${n2} vs ${n1}`);
});
