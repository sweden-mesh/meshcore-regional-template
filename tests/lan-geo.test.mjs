import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { countyAt, markOutside, inGeometry } from "../assets/js/lan/geo.js";

const geo = JSON.parse(readFileSync(new URL("../assets/se-lan.geojson", import.meta.url), "utf8"));
// One point well inside each county (town centres), SCB → [lng, lat].
const POINTS = {
  "01": [18.07, 59.33], "03": [17.64, 59.86], "04": [16.55, 59.05], "05": [15.62, 58.41], "06": [14.16, 57.78],
  "07": [14.81, 56.88], "08": [16.36, 56.66], "09": [18.30, 57.64], "10": [15.0, 56.3], "12": [13.00, 55.61],
  "13": [12.86, 56.67], "14": [11.97, 57.71], "17": [13.50, 59.38], "18": [15.21, 59.27], "19": [16.55, 59.61],
  "20": [15.63, 60.61], "21": [17.14, 60.67], "22": [17.31, 62.39], "23": [14.64, 63.18], "24": [20.26, 63.83],
  "25": [19.83, 66.61],
};

test("a point in each of the 21 counties is found in that county", () => {
  for (const [scb, [lng, lat]] of Object.entries(POINTS)) assert.equal(countyAt(geo, lng, lat), scb, scb);
});
test("at sea or abroad: no county", () => {
  assert.equal(countyAt(geo, 19.5, 56.0), null); // the Baltic
  assert.equal(countyAt(geo, 10.75, 59.91), null); // Oslo
  assert.equal(countyAt(geo, NaN, 59), null);
});
test("nodes outside the county are marked, nodes inside and without a position are not", () => {
  const sthlm = geo.features.find((f) => f.properties.scb === "01").geometry;
  const out = markOutside([{ id: 1, lng: 18.07, lat: 59.33 }, { id: 2, lng: 17.64, lat: 59.86 }, { id: 3, lng: 0, lat: 0 }, { id: 4 }], sthlm);
  assert.deepEqual(out.map((n) => !!n.possiblyForeign), [false, true, false, false]);
  assert.ok(inGeometry(18.07, 59.33, sthlm));
});
