import { test } from "node:test";
import assert from "node:assert/strict";
import { matches } from "../assets/js/entries-match.js";

test("matches: every word, any order, any case", () => {
  assert.equal(matches("Radion startar om hela tiden efter flashningen", "STARTAR flash"), true);
  assert.equal(matches("Radion startar om hela tiden", "startar repeater"), false);
  assert.equal(matches("Ingen port hittas", ""), true);
  assert.equal(matches("Ingen port hittas", "  "), true);
});

test("matches: å, ä and ö are letters of their own", () => {
  assert.equal(matches("Strömsparläge", "ström"), true);
  assert.equal(matches("Strömsparläge", "strom"), false);
});
