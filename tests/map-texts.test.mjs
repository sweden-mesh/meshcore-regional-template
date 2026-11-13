import { test } from "node:test";
import assert from "node:assert/strict";
import { setTexts, t } from "../assets/js/map/texts.js";
import { popupHtml, ago } from "../assets/js/map/popup.js";

test("Swedish by default, English when the page passes English", () => {
  setTexts({});
  assert.equal(t("legend"), "Teckenförklaring");
  setTexts({ legend: "Legend", min_ago: "{n} min ago", unnamed: "Unnamed node", decimal: "." });
  assert.equal(t("legend"), "Legend");
  assert.equal(ago(Date.now() - 10 * 60e3), "10 min ago");
  assert.match(popupHtml({ nodeType: 2, radio: "869.618,62.5,8" }), /Unnamed node.*869\.618 MHz/s);
  setTexts({});
});
test("a missing text falls back to Swedish, then to the key", () => {
  setTexts({ legend: "Legend" });
  assert.equal(t("hops", { n: 3 }), "3 hopp");
  assert.equal(t("no_such_key"), "no_such_key");
  setTexts({});
});
