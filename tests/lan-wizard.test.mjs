import { test } from "node:test";
import assert from "node:assert/strict";
import { wizardValues, neighbourAreas, posFromText } from "../assets/js/lan/wizard-values.js";

test("a county's wizard values; none for Sverige", () => {
  assert.deepEqual(wizardValues({ scope: "se-gtl", iata: "VBY" }), { scope: "se-gtl", pattern: "SE-GTL-Plats", iata: "VBY" });
  assert.deepEqual(wizardValues({ scope: "se08", iata: "KLR" }), { scope: "se08", pattern: "SE08-Plats", iata: "KLR" });
  assert.deepEqual(wizardValues(null), { scope: "se", pattern: "", iata: "" });
});
test("neighbour areas carry the regional rule: 40 km over land, 80 over water", () => {
  const counties = [{ scb: "09", name: "Gotlands län" }, { scb: "07", name: "Kronobergs län" }];
  const a = neighbourAreas({ neighbours: [{ scb: "07", scope: "se-kro", via: "land" }, { scb: "09", scope: "se-gtl", via: "vatten" }] }, counties, { "07": [[[[1, 2]]]] });
  assert.deepEqual(a.map((x) => [x.lan, x.km, x.rings.length]), [["Kronobergs län", 40, 1], ["Gotlands län", 80, 0]]);
  assert.deepEqual(neighbourAreas(null, counties, {}), []);
});
test("the picked position is read from the wizard's status line", () => {
  assert.deepEqual(posFromText("Vald plats: 57.7812, 14.1612"), { lat: 57.7812, lon: 14.1612 });
  assert.equal(posFromText("Ingen plats vald än."), null);
});

// One point in each of the 21 counties (plan 6.6): the position's county is found, and the wizard
// values for it carry that county's scope from the region list, and its name prefix.
test("21 of 21: a position in each county gives that county's scope and prefix", async () => {
  const { readFileSync } = await import("node:fs");
  const { countyAt } = await import("../assets/js/lan/geo.js");
  const geo = JSON.parse(readFileSync(new URL("../assets/se-lan.geojson", import.meta.url), "utf8"));
  const rows = readFileSync(new URL("../assets/meshcore-se-regioner/regioner.csv", import.meta.url), "utf8").trim().split("\n").slice(1).map((l) => l.split(","));
  const POINTS = { "01": [18.07, 59.33], "03": [17.64, 59.86], "04": [16.55, 59.05], "05": [15.62, 58.41], "06": [14.16, 57.78],
    "07": [14.81, 56.88], "08": [16.36, 56.66], "09": [18.3, 57.64], "10": [15.0, 56.3], "12": [13.0, 55.61], "13": [12.86, 56.67],
    "14": [11.97, 57.71], "17": [13.5, 59.38], "18": [15.21, 59.27], "19": [16.55, 59.61], "20": [15.63, 60.61], "21": [17.14, 60.67],
    "22": [17.31, 62.39], "23": [14.64, 63.18], "24": [20.26, 63.83], "25": [19.83, 66.61] };
  assert.equal(rows.length, 21);
  for (const [scb, , scope] of rows) {
    const [lng, lat] = POINTS[scb];
    const at = countyAt(geo, lng, lat);
    assert.equal(at, scb, `position in ${scb}`);
    const v = wizardValues({ scope: rows.find((r) => r[0] === at)[2], iata: "X" });
    assert.equal(v.scope, scope);
    assert.match(v.pattern, scope.startsWith("se-") ? /^SE-[A-Z]{3}-Plats$/ : /^SE\d\d-Plats$/);
  }
});
