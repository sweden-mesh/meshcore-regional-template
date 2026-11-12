import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, formatCount } from "../assets/js/stats/stats.js";

test("summarize counts repeaters, online observers and packets", () => {
  const s = summarize(
    [{ nodeType: 2, count: 17 }, { nodeType: 1, count: 2 }],
    [{ status: "online" }, { status: "offline" }, { status: "online" }],
    [{ count: 474 }, { count: 117 }]);
  assert.deepEqual(s, { repeaters: 17, online: 2, packets: 591 });
});
test("formatCount uses Swedish decimals and k", () => {
  assert.equal(formatCount(591), "591");
  assert.equal(formatCount(2140), "2,1k");
  assert.equal(formatCount(12345), "12k");
  assert.equal(formatCount(undefined), "–");
});
