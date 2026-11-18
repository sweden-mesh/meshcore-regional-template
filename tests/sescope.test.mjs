import { test } from "node:test";
import assert from "node:assert/strict";
import { seIatasOf, scopeIatas, switchFeed } from "../assets/js/map/sescope.js";
import { parseState, writeState } from "../assets/js/map/urlstate.js";

const ALL = ["BLE", "GOT", "JKG", "SFT"];

test("SE applies only where the national map areas differ from the map's own (B-370)", () => {
  assert.deepEqual(seIatasOf({ seIatas: JSON.stringify(ALL) }, ["JKG"]), ALL);
  assert.deepEqual(seIatasOf({ seIatas: JSON.stringify(ALL) }, ["SFT", "JKG", "GOT", "BLE"]), [], "the Sverige map itself");
  assert.deepEqual(seIatasOf({}, ["JKG"]), []);
  assert.deepEqual(seIatasOf({ seIatas: "not json" }, ["JKG"]), []);
});

test("SE on reads every map area, off the county's (B-370)", () => {
  assert.deepEqual(scopeIatas(true, ["JKG"], ALL), ALL);
  assert.deepEqual(scopeIatas(false, ["JKG"], ALL), ["JKG"]);
  assert.deepEqual(scopeIatas(true, ["JKG"], []), ["JKG"]);
});

test("switching the feed closes the old socket before opening the new, and only while live (B-370)", () => {
  const log = [];
  const fake = (name) => ({ start: () => log.push(`start ${name}`), stop: () => log.push(`stop ${name}`) });
  let feed = fake("county");
  feed = switchFeed(feed, () => (log.push("make se"), fake("se")), true);
  feed = switchFeed(feed, () => (log.push("make county"), fake("county2")), false);
  assert.deepEqual(log, ["stop county", "make se", "start se", "stop se", "make county"]);
});

test("se=1 in the map's URL state, off by default (B-370)", () => {
  assert.equal(parseState("?se=1").se, true);
  assert.equal(parseState("").se, undefined);
  assert.equal(writeState("", { se: true }), "?se=1");
  assert.equal(writeState("?se=1", { se: false }), "");
});
