import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { popupHtml, siteHtml, revealShift, escapeHtml, ago, formatRadio } from "../assets/js/map/popup.js";

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

// MeshMapper site details (B-181).
test("site details: antenna, height and power source, escaped, with the credit", () => {
  const html = popupHtml(node, node.lastSeen, { a: "Omni <3 dBi>", h: "12.5", p: "mains" });
  assert.match(html, /Antenn: Omni &lt;3 dBi&gt;/);
  assert.match(html, /Höjd över marken: 12,5 m/);
  assert.match(html, /Ström: elnät/);
  assert.match(html, /Platsuppgifter: MeshMapper/);
  assert.ok(html.indexOf("np-site") < html.indexOf("np-key"));
});
test("site details: none, or an entry without fields, add nothing", () => {
  for (const s of [undefined, null, {}]) {
    const html = popupHtml(node, node.lastSeen, s);
    assert.ok(!html.includes("np-site") && !html.includes("MeshMapper"));
  }
  assert.equal(siteHtml({ p: "wind" }).includes("Ström: wind"), true);
  assert.equal(siteHtml({ h: "25" }).includes("Antenn"), false);
});

test("revealShift: a popup under the corner controls moves down, one beside them does not", () => {
  const map = { top: 0, bottom: 700, left: 0, right: 390 };
  const legend = { top: 130, bottom: 170, left: 10, right: 280 };
  assert.equal(revealShift({ top: 130, bottom: 370, left: 46, right: 316 }, [legend], map), 48);
  assert.equal(revealShift({ top: 130, bottom: 370, left: 300, right: 380 }, [legend], map), 0);
  assert.equal(revealShift({ top: 200, bottom: 440, left: 46, right: 316 }, [legend], map), 0);
  // never past the bottom of the map
  assert.equal(revealShift({ top: 100, bottom: 680, left: 46, right: 316 }, [legend], map), 12);
});

test("the neighbour count is the larger of the node's own and the map's links (B-386)", () => {
  assert.match(popupHtml({ name: "n", knownNeighborCount: 0 }, 0, null, 4), /: 4<\/p>/);
  assert.match(popupHtml({ name: "n", knownNeighborCount: 7 }, 0, null, 4), /: 7<\/p>/);
  assert.match(popupHtml({ name: "n", knownNeighborCount: 2 }), /: 2<\/p>/);
  assert.match(popupHtml({ name: "n" }, 0, null, 3), /: 3<\/p>/);
});
