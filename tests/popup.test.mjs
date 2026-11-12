import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { popupHtml, escapeHtml, ago, formatRadio } from "../assets/js/map/popup.js";

const node = JSON.parse(readFileSync(new URL("./data/node-detail.json", import.meta.url)));

test("node names are escaped", () => {
  const html = popupHtml({ name: '<img src=x onerror="alert(1)">', nodeType: 2 });
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img"));
  assert.equal(escapeHtml(`a&b"'`), "a&amp;b&quot;&#39;");
});
test("a captured repeater renders type, observer, radio and key prefix", () => {
  const html = popupHtml(node, node.lastSeen + 5 * 60e3);
  assert.match(html, /Repeater · observatör/);
  assert.match(html, /JKG 5 min sedan/);
  assert.match(html, /869,618 MHz · BW 62,5 kHz · SF8/);
  assert.match(html, /<code>0206800F<\/code>/);
});
test("ago and formatRadio", () => {
  assert.equal(ago(1000, 1000 + 30e3), "nyss");
  assert.equal(ago(0), "okänt");
  assert.equal(ago(0 + 1, 1 + 3 * 86400e3), "3 d sedan");
  assert.equal(formatRadio("garbage"), "");
});
