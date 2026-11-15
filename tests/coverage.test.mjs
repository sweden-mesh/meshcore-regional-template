import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { band, toGeoJSON, hatchImage, RAMP } from "../assets/js/map/coverage.js";

// The example site's fixture: a real MeshMapper answer (32 squares). The compact rows are built
// here the way the Hugo partial builds them.
const raw = JSON.parse(readFileSync(new URL("../exampleSite/assets/meshmapper-fixture.json", import.meta.url)));
const types = ["BIDIR", "DISC", "TX", "RX", "DEAD", "DROP"];
const day = (t) => Math.floor(t / 86400);
const data = {
  v: 1, grid: [raw.grid_size.lat, raw.grid_size.lon], at: raw.generated_at, types,
  squares: raw.grid_squares.map((s) => {
    const [li, lo] = s.grid_id.split("_").map(Number);
    const ti = types.indexOf(s.coverage_type);
    return [li, lo, ti >= 4 ? "d" : "w", Math.round(s.effective * 10), day(raw.generated_at) - day(s.timestamp), ti, s.count];
  }),
};

test("every square's polygon is the response's bounds", () => {
  const fc = toGeoJSON(data);
  assert.equal(fc.features.length, raw.grid_squares.length);
  fc.features.forEach((f, i) => {
    const b = raw.grid_squares[i].bounds;
    assert.deepEqual(f.geometry.coordinates[0], [[b.west, b.south], [b.east, b.south], [b.east, b.north], [b.west, b.north], [b.west, b.south]]);
  });
});

test("bands follow the quartile cuts, dead and old squares are flagged", () => {
  assert.deepEqual([0, 9, 10, 17, 18, 22, 23, 30].map(band), [0, 0, 1, 1, 2, 2, 3, 3]);
  const fc = toGeoJSON(data);
  const at = (id) => fc.features[raw.grid_squares.findIndex((s) => s.grid_id === id)].properties;
  assert.deepEqual(at("21400_3688"), { kind: "w", band: 2, eff10: 19, old: false, ageDays: 4, type: "BIDIR", pings: 294 }); // 1.93, 4 days
  assert.equal(at("21397_3681").band, 3);  // effective 3
  assert.equal(at("21397_3681").old, true); // 98 days
  assert.equal(at("21400_3685").band, 0);   // 0.86
  assert.equal(at("21416_3674").kind, "d"); // DEAD
  assert.equal(at("21416_3674").old, false); // 65 days
  assert.equal(fc.features.filter((f) => f.properties.old).length, raw.grid_squares.filter((s) => day(raw.generated_at) - day(s.timestamp) > 90).length);
});

test("no grid, no squares", () => {
  assert.equal(toGeoJSON(null).features.length, 0);
  assert.equal(toGeoJSON({ grid: [0, 0], squares: [[1, 1, "w", 10, 0, 0, 1]] }).features.length, 0);
});

test("the dead-zone hatch tile repeats seamlessly and is mostly transparent", () => {
  for (const ratio of [1, 2]) {
    const { width, height, data } = hatchImage([168, 72, 64], ratio);
    assert.equal(width, 8 * ratio); assert.equal(data.length, width * height * 4);
    const on = (x, y) => data[((y % height) * width + (x % width)) * 4 + 3] > 0;
    let n = 0;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (on(x, y)) n++;
      assert.equal(on(x, y), on(x + 1, y + height - 1)); // "/" diagonal continues across the tile edge
    }
    assert.equal(n, 2 * ratio * width);
  }
});

test("each theme's ramp gets lighter or darker in one direction", () => {
  const lum = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16)).reduce((a, b) => a + b);
  const l = RAMP.light.map(lum), d = RAMP.dark.map(lum);
  assert.ok(l.every((v, i) => i === 0 || v < l[i - 1]), "light: light to dark");
  assert.ok(d.every((v, i) => i === 0 || v > d[i - 1]), "dark: dark to light");
});
