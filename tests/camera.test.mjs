import { test } from "node:test";
import assert from "node:assert/strict";
import { startCamera, bboxToBounds } from "../assets/js/map/camera.js";

test("startCamera swaps [lat, lng] to [lng, lat]", () => {
  assert.deepEqual(startCamera({ center: "[57.78,14.16]", zoom: "9" }), { center: [14.16, 57.78], zoom: 9 });
});
test("startCamera falls back on junk", () => {
  assert.deepEqual(startCamera({ center: "oops", zoom: "x" }), { center: [16, 62], zoom: 5 });
  assert.deepEqual(startCamera({ center: "[1]" }), { center: [16, 62], zoom: 5 });
});
test("bboxToBounds takes 2D and 3D bboxes", () => {
  assert.deepEqual(bboxToBounds([13, 57, 15, 58]), [[13, 57], [15, 58]]);
  assert.deepEqual(bboxToBounds([13, 57, 0, 15, 58, 0]), [[13, 57], [15, 58]]);
});
test("bboxToBounds rejects inverted or missing boxes", () => {
  assert.equal(bboxToBounds([15, 57, 13, 58]), null);
  assert.equal(bboxToBounds(undefined), null);
});
test("bboxToBounds rejects zero-area boxes", () => {
  assert.equal(bboxToBounds([14, 57, 14, 58]), null);
  assert.equal(bboxToBounds([13, 57, 15, 57]), null);
});
