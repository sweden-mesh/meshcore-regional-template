import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, formatCount } from "../assets/js/stats/stats.js";

test("repeaters and observers are counted separately; a companion can be an observer", () => {
  const nodes = [
    { nodeType: 2, isObserver: true }, { nodeType: 2, isObserver: false }, { nodeType: 2, isObserver: true },
    { nodeType: 2, isObserver: true, possiblyForeign: true }, { nodeType: 1, isObserver: false },
    { nodeType: 1, isObserver: true }, { nodeType: 1, isObserver: true, possiblyForeign: true }, { nodeType: 4 },
  ];
  const s = summarize(nodes, [{ count: 474 }, { count: 117 }]);
  assert.deepEqual(s, { repeaters: 3, online: 3, packets: 591 });
});
test("formatCount uses Swedish decimals and k", () => {
  assert.equal(formatCount(591), "591");
  assert.equal(formatCount(2140), "2,1k");
  assert.equal(formatCount(12345), "12k");
  assert.equal(formatCount(undefined), "–");
});
