import { test } from "node:test";
import assert from "node:assert/strict";
import { changesContent, lastContentDate, setFrontMatter } from "../scripts/lastmod.mjs";

const diff = (...lines) => ["diff --git a/x.md b/x.md", "--- a/x.md", "+++ b/x.md", "@@ -1,3 +1,3 @@", ...lines].join("\n");

test("changesContent: a change to the text counts", () => {
  assert.equal(changesContent(diff("-Gammal mening.", "+Ny mening.")), true);
  assert.equal(changesContent(diff("+description: \"ny\"")), true);
});
test("changesContent: a change to only the date lines does not count", () => {
  assert.equal(changesContent(diff("-lastmod: 2026-01-01", "+lastmod: 2026-02-01", "+date: 2025-12-01", " title: \"x\"")), false);
  assert.equal(changesContent(""), false);
});
test("changesContent: a Markdown list item starting with --- or +++ text is content", () => {
  assert.equal(changesContent(diff("+--- en avdelare")), true);
});

test("lastContentDate skips commits that only moved the dates", () => {
  const log = [
    "@@C2026-11-16", "", diff("-lastmod: 2026-10-01", "+lastmod: 2026-11-01"),
    "@@C2026-11-01", "", diff("-Gammal.", "+Ny."),
    "@@C2026-10-01", "", diff("+Först."),
  ].join("\n");
  assert.equal(lastContentDate(log), "2026-11-01");
});
test("lastContentDate is empty when no commit changed the text", () => {
  assert.equal(lastContentDate(""), "");
  assert.equal(lastContentDate(["@@C2026-11-16", "", diff("+lastmod: 2026-11-01")].join("\n")), "");
});

test("setFrontMatter adds, replaces, and keeps a value when asked", () => {
  const md = "---\ntitle: \"x\"\n---\n\nText.\n";
  const added = setFrontMatter(md, "lastmod", "2026-11-16");
  assert.equal(added, "---\ntitle: \"x\"\nlastmod: 2026-11-16\n---\n\nText.\n");
  assert.equal(setFrontMatter(added, "lastmod", "2026-12-01"), "---\ntitle: \"x\"\nlastmod: 2026-12-01\n---\n\nText.\n");
  assert.equal(setFrontMatter(added, "lastmod", "2026-12-01", true), added);
  assert.equal(setFrontMatter("Ingen front matter.\n", "lastmod", "2026-11-16"), "Ingen front matter.\n");
});
test("setFrontMatter does not touch a key that only ends the same way", () => {
  const md = "---\nmylastmod: a\n---\n";
  assert.equal(setFrontMatter(md, "lastmod", "b"), "---\nmylastmod: a\nlastmod: b\n---\n");
});
