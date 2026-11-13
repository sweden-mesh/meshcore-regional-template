import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveTheme } from "../assets/js/theme.js";

test("a saved choice wins over the system", () => {
  assert.equal(resolveTheme("dark", true), "dark");
  assert.equal(resolveTheme("light", false), "light");
});
test("no saved choice: follow the system, dark when it does not say light", () => {
  assert.equal(resolveTheme(undefined, true), "light");
  assert.equal(resolveTheme(undefined, false), "dark");
  assert.equal(resolveTheme(undefined, undefined), "dark");
  assert.equal(resolveTheme("bogus", undefined), "dark");
});
test("the console style is always dark", () => assert.equal(resolveTheme("light", true, true), "dark"));
