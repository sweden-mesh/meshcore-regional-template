import { test } from "node:test";
import assert from "node:assert/strict";
import { allowedScopes, regionFor } from "../assets/js/search.js";

test("a regional site searches common, national and its own region (B-321)", () => {
  assert.deepEqual(allowedScopes({ region: "region:se-jkp" }), ["common", "national", "region:se-jkp"]);
  assert.equal(regionFor({ national: "false", region: "region:se-jkp" }, null), "region:se-jkp");
});

test("the national site: the chosen county, or Sverige (common + national only)", () => {
  const ds = { national: "true", counties: JSON.stringify({ "08": "se08", "12": "se-sk" }) };
  assert.equal(regionFor(ds, "08"), "region:se08");
  assert.equal(regionFor(ds, "se"), null);
  assert.equal(regionFor(ds, null), null);
  assert.deepEqual(allowedScopes({ region: null }), ["common", "national"]);
});

test("a paired page shows only where the region has no version of its own", () => {
  const pairs = { "region:se08": ["ingen-svar-pa-test"] };
  const all = ["ingen-svar-pa-test", "kom-igang"];
  assert.deepEqual(allowedScopes({ region: "region:se08", pairs, allPairs: all }), ["common", "national", "region:se08", "paired:kom-igang"]);
  assert.deepEqual(allowedScopes({ region: null, pairs, allPairs: all }), ["common", "national", "paired:ingen-svar-pa-test", "paired:kom-igang"]);
});
