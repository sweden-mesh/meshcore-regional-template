import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SPEC, missingFields } from "../scripts/beacon-contract.mjs";

const load = (f) => JSON.parse(readFileSync(new URL(`./data/${f}.json`, import.meta.url)));

// The captured responses the unit tests use must satisfy the contract.
for (const [name, file] of [["nodes", "nodes-page"], ["node", "node-detail"], ["neighbors", "neighbors"],
  ["observers", "observers-page"], ["packet", "packet-detail"]]) {
  test(`captured ${file} satisfies the ${name} contract`, () => assert.deepEqual(missingFields(load(file), SPEC[name]), []));
}
test("a missing field is reported", () => {
  const n = load("node-detail"); delete n.publicKey;
  assert.deepEqual(missingFields(n, SPEC.node), ["publicKey"]);
});
test("a field missing on one array element is reported", () => {
  const p = load("nodes-page"); delete p.items[1].name;
  assert.deepEqual(missingFields(p, SPEC.nodes), ["items[].name"]);
});
