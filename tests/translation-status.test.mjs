import { test } from "node:test";
import assert from "node:assert/strict";
import { frontMatterDates, status } from "../scripts/translation-status.mjs";

const page = (fm) => `---\ntitle: "x"\n${fm}\n---\n\nText.\n`;

test("front matter dates, quoted or not", () => {
  assert.deepEqual(frontMatterDates(page("date: 2026-11-13\nlastmod: \"2026-11-18\"")), { lastmod: "2026-11-18", date: "2026-11-13" });
  assert.deepEqual(frontMatterDates("No front matter"), {});
});

test("a translation older than its Swedish page is outdated (B-364)", () => {
  assert.equal(status(page("lastmod: 2026-11-18"), page("lastmod: 2026-11-16")), "outdated");
  assert.equal(status(page("lastmod: 2026-11-18"), page("lastmod: 2026-11-18")), "current");
  assert.equal(status(page("lastmod: 2026-11-16"), page("lastmod: 2026-11-18")), "current");
  assert.equal(status(page("date: 2026-11-18"), page("date: 2026-11-10")), "outdated");
  assert.equal(status(page("lastmod: 2026-11-18"), page("")), "outdated");
  assert.equal(status(page("lastmod: 2026-11-18"), null), "missing");
});
