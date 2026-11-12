import { test } from "node:test";
import assert from "node:assert/strict";

test("round4 keeps four decimals (about 10 m)", async () => {
  // mappick.js imports browser-only modules at load; test the rounding rule on its own.
  const round4 = (x) => Math.round(x * 1e4) / 1e4;
  const src = (await import("node:fs")).readFileSync(new URL("../assets/js/wizard/mappick.js", import.meta.url), "utf8");
  assert.ok(src.includes("export const round4 = (x) => Math.round(x * 1e4) / 1e4;"));
  assert.equal(round4(57.761628), 57.7616);
  assert.equal(round4(14.133466), 14.1335);
});
