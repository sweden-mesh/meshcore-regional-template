import { test } from "node:test";
import assert from "node:assert/strict";
import { countyFor, valuesFor, titleFor, cookieLine, VALID, groupsFor, channelRows, modalModel, fillTemplate, geoToPaths } from "../assets/js/lan/lan.js";

const data = {
  sweden: { name: "Sverige", short: "Sverige" },
  texts: { proposal: "förslag", sweden: "Sverige (hela landet)" },
  counties: [
    { scb: "08", name: "Kalmar län", short: "Kalmar", scope: "se08", decision: "uppmatt", test: "#test-se08", prefix: "SE08", iata: "KLR", channels: [{ name: "#kalmar", purpose: "Chatt" }], groups: [{ name: "Grupp", url: "https://g.example/" }, { name: "Dålig", url: "javascript:alert(1)" }], place: "Berget", url: "/kalmar/", site: "" },
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
test("groups are https links only; channel rows carry the county's scope", () => {
  const c = countyFor(data, "08");
  assert.deepEqual(groupsFor(c), [{ name: "Grupp", url: "https://g.example/" }]);
  assert.deepEqual(groupsFor(null), []);
  assert.deepEqual(channelRows(c), [{ name: "#kalmar", scope: "se08", purpose: "Chatt" }]);
  assert.deepEqual(channelRows(countyFor(data, "09")), []);
});
test("the modal lists every county and Sverige, an own site marked by its domain", () => {
  const d = { ...data, counties: [...data.counties, { scb: "06", name: "Jönköpings län", site: "https://meshcore-jkp.se/" }] };
  const m = modalModel(d, "09");
  assert.deepEqual(m.items.map((i) => i.v), ["08", "09", "06", "se"]);
  assert.deepEqual(m.items.find((i) => i.v === "06"), { v: "06", name: "Jönköpings län", own: true, site: "https://meshcore-jkp.se/", domain: "meshcore-jkp.se", current: false });
  assert.equal(m.items.find((i) => i.v === "09").current, true);
  assert.equal(m.items.at(-1).name, "Sverige (hela landet)");
  assert.equal(fillTemplate("{name} har en egen sida ({x})", { name: "Jönköpings län" }), "Jönköpings län har en egen sida ({x})");
});
test("the modal map: one path per county, inside the view box", async () => {
  const { readFileSync } = await import("node:fs");
  const geo = JSON.parse(readFileSync(new URL("../assets/se-lan.geojson", import.meta.url), "utf8"));
  const m = geoToPaths(geo, 300);
  assert.equal(m.paths.length, 21);
  const [, , vw, vh] = m.viewBox.split(" ").map(Number);
  assert.equal(vw, 300); assert.ok(vh > 500 && vh < 900, `height ${vh}`);
  for (const p of m.paths) {
    assert.match(p.d, /^M[\d.,LMZ]+Z$/);
    for (const [x, y] of p.d.match(/[\d.]+,[\d.]+/g).map((c) => c.split(",").map(Number))) assert.ok(x >= 0 && x <= vw + 0.01 && y >= 0 && y <= vh + 0.5);
  }
  const skane = m.paths.find((p) => p.scb === "12"), norrbotten = m.paths.find((p) => p.scb === "25");
  const maxY = (d) => Math.max(...d.match(/,[\d.]+/g).map((c) => +c.slice(1)));
  assert.ok(maxY(skane.d) > maxY(norrbotten.d), "Skåne is south of Norrbotten");
});
