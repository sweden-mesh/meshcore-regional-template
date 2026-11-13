import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const keys = (f) => [...readFileSync(new URL(`../i18n/${f}`, import.meta.url), "utf8").matchAll(/^\[([a-z0-9_]+)\]$/gm)].map((m) => m[1]).sort();
const vars = (f) => {
  const s = readFileSync(new URL(`../i18n/${f}`, import.meta.url), "utf8");
  const out = {};
  for (const block of s.split(/^(?=\[)/m)) {
    const k = block.match(/^\[([a-z0-9_]+)\]/)?.[1];
    if (k) out[k] = [...block.matchAll(/\{\{ *\.([A-Za-z]+) *\}\}|\{([a-z]+)\}/g)].map((m) => m[1] || m[2]).sort().join(",");
  }
  return out;
};

test("sv and en have the same keys", () => assert.deepEqual(keys("en.toml"), keys("sv.toml")));
test("sv and en use the same placeholders", () => assert.deepEqual(vars("en.toml"), vars("sv.toml")));
