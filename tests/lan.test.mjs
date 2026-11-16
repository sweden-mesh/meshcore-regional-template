import { test } from "node:test";
import assert from "node:assert/strict";
import { countyFor, valuesFor, titleFor, cookieLine, VALID } from "../assets/js/lan/lan.js";

const data = {
  sweden: { name: "Sverige", short: "Sverige" },
  texts: { proposal: "förslag" },
  counties: [
    { scb: "08", name: "Kalmar län", short: "Kalmar", scope: "se08", decision: "uppmatt", test: "#test-se08", prefix: "SE08", iata: "KLR", channels: ["#kalmar"], place: "Berget", url: "/kalmar/", site: "" },
    { scb: "09", name: "Gotlands län", short: "Gotland", scope: "se-gtl", decision: "forslag", test: "#test-se-gtl", prefix: "SE-GTL", iata: "VBY", channels: [], url: "/gotland/", site: "" },
  ],
};

test("a choice maps to its county; se and unknown codes to none", () => {
  assert.equal(countyFor(data, "08").short, "Kalmar");
  assert.equal(countyFor(data, "se"), null);
  assert.equal(countyFor(data, "11"), null);
  assert.equal(countyFor(data, null), null);
});
test("the spans' values for a county, with the proposal mark only for a proposed scope", () => {
  const k = valuesFor(data, countyFor(data, "08"));
  assert.equal(k.scope, "se08"); assert.equal(k.test, "#test-se08"); assert.equal(k.proposal, "");
  assert.equal(k.channels, "#kalmar, #test-se08"); assert.equal(k.place, "Berget");
  const g = valuesFor(data, countyFor(data, "09"));
  assert.equal(g.proposal, "förslag"); assert.equal(g.channels, "#test-se-gtl");
  assert.ok(!("place" in g), "no place: the page's own example stays");
});
test("Sverige keeps every neutral text the page was built with", () => {
  assert.deepEqual(valuesFor(data, null), {});
});
test("only the national title suffix turns to the county", () => {
  const c = countyFor(data, "08");
  assert.equal(titleFor("Regioner (scope) – MeshCore Sverige", "Sverige", c), "Regioner (scope) – MeshCore Kalmar");
  assert.equal(titleFor("MeshCore i Kalmar – karta, guider och kanaler", "Sverige", c), "MeshCore i Kalmar – karta, guider och kanaler");
  assert.equal(titleFor("Regioner (scope) – MeshCore Sverige", "Sverige", null), "Regioner (scope) – MeshCore Sverige");
});
test("the cookie and the accepted codes", () => {
  assert.equal(cookieLine("08"), "lan=08; Path=/; Max-Age=31536000; SameSite=Lax; Secure");
  assert.ok(VALID.test("se") && VALID.test("25") && !VALID.test("xx") && !VALID.test("123"));
});
