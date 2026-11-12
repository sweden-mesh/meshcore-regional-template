import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";

// Go module zips drop every directory named vendor/, so a region pulling the
// template by version would silently miss those files. Keep none in the tree.
test("no tracked file lives under a vendor/ directory", () => {
  const files = execSync("git ls-files", { cwd: new URL("..", import.meta.url) }).toString().split("\n");
  assert.deepEqual(files.filter((f) => /(^|\/)vendor\//.test(f)), []);
});
