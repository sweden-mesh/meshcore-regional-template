import test from "node:test";
import assert from "node:assert/strict";
import { parseState } from "../assets/js/map/urlstate.js";
import { shareLink } from "../assets/js/map/share.js";

test("the share link carries the switches, the view and full, and parses back to them", () => {
  const loc = { origin: "https://example.se", pathname: "/", search: "?lan=12" };
  const link = shareLink(loc, { live: true, links: false, foreign: true, focus: false, full: true, view: { zoom: 7.42, center: [13.6, 56.05] } });
  assert.equal(link, "https://example.se/?lan=12&links=0&focus=0&full=1&z=7.4&ll=56.0500%2C13.6000#map");
  const back = parseState(new URL(link).search);
  assert.deepEqual(back, { links: false, focus: false, full: true, view: { zoom: 7.4, center: [13.6, 56.05] } });
});
test("a link without full leaves the map in the page", () => {
  assert.equal(parseState("?z=6&ll=57,14").full, undefined);
});

import { shareLoc } from "../assets/js/map/share.js";
test("the share link says which region: the region's share address, else ?lan=", () => {
  const loc = { origin: "https://example.se", pathname: "/", search: "?z=5&ll=1,2" };
  const county = shareLoc(loc, { sharePage: "/sk%C3%A5ne/karta/" });
  assert.deepEqual(county, { origin: "https://example.se", pathname: "/sk%C3%A5ne/karta/", search: "?z=5&ll=1%2C2", hash: "" });
  assert.equal(shareLink(county, { live: false }), "https://example.se/sk%C3%A5ne/karta/?z=5&ll=1%2C2&live=0");
  assert.equal(shareLoc(loc, { lan: "se" }).search, "?z=5&ll=1%2C2&lan=se");
  assert.equal(shareLoc({ ...loc, pathname: "/guider/x/", search: "?lan=06" }, { lan: "12" }).search, "?lan=12");
  assert.deepEqual(shareLoc({ ...loc, search: "" }), { origin: "https://example.se", pathname: "/", search: "" });
});
