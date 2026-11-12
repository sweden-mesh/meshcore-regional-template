import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { repeaterCommands, validateRepeater, companionSettings } from "../assets/js/wizard/commands.js";

const radio = { preset: "EU/UK (Narrow)", freq: 869.618, bw: 62.5, sf: 8, cr: 8 };
const base = { name: "SE-JKP-Braneryd-FD70", lat: 57.76162, lon: "14,13347", password: "hemligt123", tx: 22, radio, scope: "se-jkp" };

test("a full repeater setup in order, reboot last", () => {
  const { commands, errors } = repeaterCommands(base);
  assert.deepEqual(errors, []);
  assert.deepEqual(commands, [
    "set radio 869.618,62.5,8,8", "set tx 22", "set name SE-JKP-Braneryd-FD70",
    "set lat 57.7616", "set lon 14.1335", "region def se se-jkp", "region allowf *", "region save",
    "set dutycycle 10", "password hemligt123", "advert", "reboot"]);
});

test("every command verb exists in the firmware's CLI docs", () => {
  const docs = readFileSync(new URL("./data/cli_commands_verbs.txt", import.meta.url), "utf8");
  for (const cmd of repeaterCommands(base).commands) {
    const verb = cmd.startsWith("set ") || cmd.startsWith("region ") ? cmd.split(" ").slice(0, 2).join(" ") : cmd.split(" ")[0];
    assert.ok(docs.includes(`\`${verb}`), `${verb} not in cli_commands.md`);
  }
});

test("validation: name limits, ranges, password", () => {
  const codes = (s) => validateRepeater({ ...base, ...s }).errors.map((e) => `${e.field}:${e.code}`);
  assert.deepEqual(codes({ name: "" }), ["name:required"]);
  assert.deepEqual(codes({ name: "x".repeat(32) }), ["name:too-long"]);
  assert.deepEqual(codes({ lat: 91 }), ["lat:range"]);
  assert.deepEqual(codes({ password: "x".repeat(16) }), ["password:too-long"]);
  assert.deepEqual(codes({ password: "två ord" }), ["password:whitespace"]);
  assert.deepEqual(codes({ tx: 40 }), ["tx:range"]);
  assert.deepEqual(codes({ scope: "SE JKP" }), ["scope:invalid"]);
  const w = validateRepeater({ ...base, name: "SE-JKP-Bråneryd-Lång-FD70" }).warnings;
  assert.deepEqual(w.map((x) => x.code), ["no-room-for-position"]);
});

test("no position, no password, no tx: those commands are left out", () => {
  const { commands } = repeaterCommands({ name: "SE-X", radio, scope: "se-x" });
  assert.ok(!commands.some((c) => /^set (lat|lon|tx)|^password/.test(c)));
});

test("an invalid setup yields no commands", () => {
  assert.deepEqual(repeaterCommands({ ...base, name: "" }).commands, []);
});

test("companion settings are values for the app", () => {
  assert.deepEqual(companionSettings({ name: " Lou ", radio, scope: "se-jkp" }).map((x) => x.value),
    ["EU/UK (Narrow)", "869,618 MHz · BW 62,5 kHz · SF8 · CR8", "Lou", "se-jkp"]);
});

import { regionDef } from "../assets/js/wizard/commands.js";
test("region def: own scope, and neighbours all under se", () => {
  assert.equal(regionDef("se-jkp"), "region def se se-jkp");
  assert.equal(regionDef("se-jkp", ["se-ost"]), "region def se se-jkp|se se-ost");
  assert.equal(regionDef("se-jkp", ["se-ost", "se-kro"]), "region def se se-jkp|se se-ost|se se-kro");
  assert.equal(regionDef("se"), "region def se");
});
