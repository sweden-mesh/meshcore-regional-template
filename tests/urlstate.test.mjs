import { test } from "node:test";
import assert from "node:assert/strict";
import { parseState, writeState } from "../assets/js/map/urlstate.js";

test("toggles and view round-trip through the query string", () => {
  const q = writeState("", { live: false, links: true, view: { zoom: 11.23, center: [14.16, 57.78] } });
  assert.equal(q, "?live=0&z=11.2&ll=57.7800%2C14.1600");
  assert.deepEqual(parseState(q), { live: false, view: { zoom: 11.2, center: [14.16, 57.78] } });
});
test("junk is ignored; other params are kept", () => {
  assert.deepEqual(parseState("?z=99&ll=1,2"), {});
  assert.deepEqual(parseState("?ll=abc"), {});
  assert.equal(writeState("?utm=x", { foreign: false }), "?utm=x&foreign=0");
});

test("traffic focus is off by default and written only when on", () => {
  assert.equal(writeState("", { focus: true }), "?focus=1");
  assert.equal(writeState("?focus=1", { focus: false }), "");
  assert.deepEqual(parseState("?focus=1"), { focus: true });
});
