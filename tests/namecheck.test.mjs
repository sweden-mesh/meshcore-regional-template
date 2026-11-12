import { test } from "node:test";
import assert from "node:assert/strict";
import { utf8Bytes, verdict } from "../assets/js/namecheck.js";

test("å, ä and ö take two bytes each", () => {
  assert.equal(utf8Bytes("SE-JKP-Bråneryd"), 16);
  assert.equal(utf8Bytes("ÅÄÖ"), 6);
});
test("verdicts at the 22- and 31-byte limits", () => {
  assert.equal(verdict(22), "ok");
  assert.equal(verdict(23), "no-position");
  assert.equal(verdict(31), "no-position");
  assert.equal(verdict(32), "too-long");
  assert.equal(verdict(0), "empty");
});
