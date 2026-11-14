import { test } from "node:test";
import assert from "node:assert/strict";
import { namePrefix, wantsKeySuffix, buildName, cleanPlace } from "../assets/js/wizard/naming.js";

test("the rule's prefix and key suffix", () => {
  assert.equal(namePrefix("SE-JKP-Plats-ABCD"), "SE-JKP-");
  assert.equal(wantsKeySuffix("SE-JKP-Plats-ABCD"), true);
  assert.equal(wantsKeySuffix("SE-XXX-Plats"), false);
  assert.equal(namePrefix(""), "");
});
test("names are built from the place and the key", () => {
  assert.equal(buildName("SE-JKP-Plats-ABCD", " Bråneryd  Norra ", "fd70aa"), "SE-JKP-BrånerydNorra-FD70");
  assert.equal(buildName("SE-JKP-Plats-ABCD", "Bråneryd", null), "SE-JKP-Bråneryd");
  assert.equal(buildName("", "Taberg", "fd70"), "Taberg");
  assert.equal(cleanPlace("Taberg!? 2"), "Taberg2");
  assert.equal(buildName("SE-JKP-Plats-ABCD", "", "fd70"), "");
});
test("the key suffix is opt-in: only when the owner ticks it", () => {
  assert.equal(buildName("SE-JKP-Plats", "Taberg", "fd70aa"), "SE-JKP-Taberg");
  assert.equal(buildName("SE-JKP-Plats", "Taberg", "fd70aa", true), "SE-JKP-Taberg-FD70");
  assert.equal(buildName("SE-JKP-Plats-ABCD", "Taberg", "fd70aa", false), "SE-JKP-Taberg");
});
