import { test } from "node:test";
import assert from "node:assert/strict";
import { postedVersions, cmp } from "../scripts/news-check.mjs";

test("versions compare by number, not as text", () => {
  assert.ok(cmp("1.10.0", "1.9.0") > 0);
  assert.ok(cmp("18.1", "18") > 0);
  assert.equal(cmp("1.18", "1.18.0"), 0);
});

test("the newest posted version per product", () => {
  const have = postedVersions([
    '---\nrelease: {product: meshcore, version: "1.18.0"}\n---',
    '---\nrelease: {product: meshcore, version: "1.9.0"}\n---',
    '---\nrelease: {product: easyskymesh, version: "18"}\n---',
    "---\ntitle: no release\n---",
  ]);
  assert.deepEqual(have, { meshcore: "1.18.0", easyskymesh: "18" });
});
