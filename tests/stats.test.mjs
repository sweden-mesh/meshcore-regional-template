import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, formatCount, lastHeard } from "../assets/js/stats/stats.js";

test("repeaters and observers are counted separately; a companion can be an observer", () => {
  const nodes = [
    { nodeType: 2, isObserver: true }, { nodeType: 2, isObserver: false }, { nodeType: 2, isObserver: true },
    { nodeType: 2, isObserver: true, possiblyForeign: true }, { nodeType: 1, isObserver: false },
    { nodeType: 1, isObserver: true }, { nodeType: 1, isObserver: true, possiblyForeign: true }, { nodeType: 4 },
  ];
  const s = summarize(nodes, [{ count: 474 }, { count: 117 }]);
  assert.deepEqual(s, { repeaters: 3, online: 3, packets: 591, repeatersOut: 0, onlineOut: 0 });
});
test("formatCount uses Swedish decimals and k", () => {
  assert.equal(formatCount(591), "591");
  assert.equal(formatCount(2140), "2,1k");
  assert.equal(formatCount(12345), "12k");
  assert.equal(formatCount(undefined), "–");
});
test("a county page counts nodes outside the county apart (B-330)", () => {
  const isOutside = (n) => n.lng > 10;
  const nodes = [
    { nodeType: 2, lat: 57, lng: 9 }, { nodeType: 2, lat: 57, lng: 11, isObserver: true }, { nodeType: 2, lat: 57, lng: 12 },
    { nodeType: 2 }, { nodeType: 1, isObserver: true, lat: 57, lng: 9 }, { nodeType: 2, lat: 57, lng: 11, possiblyForeign: true },
  ];
  const s = summarize(nodes, [], isOutside);
  assert.deepEqual(s, { repeaters: 2, online: 1, packets: 0, repeatersOut: 2, onlineOut: 1 });
});
test("lastHeard: the newest lastSeen in the area, leaving out foreign and outside nodes (CONTENT-SV-30)", () => {
  const isOutside = (n) => n.lng > 10;
  const nodes = [
    { lastSeen: 100, lat: 57, lng: 9 }, { lastSeen: 500, lat: 57, lng: 11 }, { lastSeen: 400, possiblyForeign: true },
    { lastSeen: 300 }, { lat: 57, lng: 9 },
  ];
  assert.equal(lastHeard(nodes, isOutside), 300);
  assert.equal(lastHeard(nodes), 500);
  assert.equal(lastHeard([]), 0);
});

test("formatCount: a decimal point on an English page (B-337)", () => {
  assert.equal(formatCount(1234, "en"), "1.2k");
  assert.equal(formatCount(1234, "sv"), "1,2k");
});
