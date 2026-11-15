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

test("traffic focus is on by default and written only when off", () => {
  assert.equal(writeState("", { focus: false }), "?focus=0");
  assert.equal(writeState("?focus=0", { focus: true }), "");
  assert.deepEqual(parseState("?focus=0"), { focus: false });
  assert.deepEqual(parseState("?focus=1"), { focus: true }); // links shared before v0.12.4
});

test("coverage is off by default and written only when on", () => {
  assert.equal(writeState("", { cov: true }), "?cov=1");
  assert.equal(writeState("?cov=1&z=9.0", { cov: false }), "?z=9.0");
  assert.deepEqual(parseState("?cov=1"), { cov: true });
  assert.deepEqual(parseState("?cov=0"), { cov: false });
  assert.deepEqual(parseState(writeState("?live=0", { cov: true })), { live: false, cov: true });
});

test("dead zones, like coverage, are written only when on", () => {
  assert.equal(writeState("", { cov: true, dead: true }), "?cov=1&dead=1");
  assert.equal(writeState("?cov=1&dead=1", { dead: false }), "?cov=1");
  assert.deepEqual(parseState("?dead=1"), { dead: true });
});
