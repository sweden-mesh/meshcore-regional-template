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
