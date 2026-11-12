import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, formatCount } from "../assets/js/stats/stats.js";

test("observers are counted among the region's repeaters, from one list", () => {
  const nodes = [
    { nodeType: 2, isObserver: true }, { nodeType: 2, isObserver: false }, { nodeType: 2, isObserver: true },
    { nodeType: 2, isObserver: true, possiblyForeign: true }, { nodeType: 1, isObserver: false }, { nodeType: 4 },
  ];
  const s = summarize(nodes, [{ count: 474 }, { count: 117 }]);
  assert.deepEqual(s, { repeaters: 3, online: 2, packets: 591 });
  assert.ok(s.online <= s.repeaters);
});
test("formatCount uses Swedish decimals and k", () => {
  assert.equal(formatCount(591), "591");
  assert.equal(formatCount(2140), "2,1k");
  assert.equal(formatCount(12345), "12k");
  assert.equal(formatCount(undefined), "–");
});
