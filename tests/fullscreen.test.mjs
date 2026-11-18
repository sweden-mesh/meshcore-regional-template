import { test } from "node:test";
import assert from "node:assert/strict";
import { fullscreenMode } from "../assets/js/map/fullscreen.js";

test("fullscreenMode: the API, the prefixed API, else the fixed full-viewport fallback (B-346)", () => {
  const el = { requestFullscreen() {}, webkitRequestFullscreen() {} };
  assert.equal(fullscreenMode({ fullscreenEnabled: true }, el), "api");
  assert.equal(fullscreenMode({ fullscreenEnabled: false, webkitFullscreenEnabled: true }, el), "webkit");
  // An iPhone: no element fullscreen at all.
  assert.equal(fullscreenMode({}, {}), "pseudo");
  assert.equal(fullscreenMode({ fullscreenEnabled: true }, {}), "pseudo");
});
