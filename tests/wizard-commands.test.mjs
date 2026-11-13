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
    "set lat 57.7616", "set lon 14.1335", "set flood.max.unscoped 16", "region allowf *",
    "region def eu|* europe|eu se se-jkp", "region home se-jkp", "region default se", "region save",
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
  assert.equal(regionDef("se-jkp"), "region def eu|* europe|eu se se-jkp");
  assert.equal(regionDef("se-jkp", ["se-ost"]), "region def eu|* europe|eu se se-jkp|se se-ost");
  assert.equal(regionDef("se-jkp", ["se-ost", "se-kro"]), "region def eu|* europe|eu se se-jkp|se se-ost|se se-kro");
  assert.equal(regionDef("se"), "region def eu|* europe|eu se");
});

import { repeaterReview } from "../assets/js/wizard/commands.js";
test("review summary matches the commands and masks the password", () => {
  const s = { name: "SE-JKP-Test-ABCD", lat: 57.78123, lon: 14.16, password: "hemligt", scope: "se-jkp",
    extraScopes: ["se-ost"], radio: { freq: 869.618, bw: 62.5, sf: 8, cr: 8 } };
  const r = Object.fromEntries(repeaterReview(s).map((x) => [x.key, x.value]));
  assert.equal(r.name, "SE-JKP-Test-ABCD");
  assert.equal(r.position, "57.7812, 14.1600");
  assert.equal(r.radio, "869,618 MHz · BW 62,5 kHz · SF8 · CR8");
  assert.equal(r.regions, "eu, europe, se, se-jkp, se-ost");
  assert.equal(r.dutycycle, "10 %");
  assert.equal(r.password, "•••••••");
  assert.ok(!JSON.stringify(r).includes("hemligt"));
  const cmds = repeaterCommands(s).commands.join("\n");
  assert.match(cmds, /set lat 57\.7812/);
  assert.match(cmds, /region def eu\|\* europe\|eu se se-jkp\|se se-ost/);
});
test("review summary leaves missing values empty", () => {
  const r = Object.fromEntries(repeaterReview({ radio: {} }).map((x) => [x.key, x.value]));
  assert.equal(r.name, ""); assert.equal(r.position, ""); assert.equal(r.password, ""); assert.equal(r.radio, "");
});

import { mqttCommands, validateMqtt } from "../assets/js/wizard/commands.js";
const MQ = { slot: 3, server: "wss://mqtt.example.se", port: 443, audience: "mqtt.example.se", iata: "JKG" };
test("region MQTT: custom slot commands, audience always sent", () => {
  assert.deepEqual(mqttCommands(MQ), ["set mqtt3.preset custom", "set mqtt3.server wss://mqtt.example.se",
    "set mqtt3.port 443", "set mqtt3.audience mqtt.example.se", "set mqtt.iata JKG"]);
  const up = mqttCommands({ ...MQ, audience: "", username: "u", password: "p" });
  assert.equal(up[3], "set mqtt3.audience");       // clears an old preset's audience
  assert.deepEqual(up.slice(4, 6), ["set mqtt3.username u", "set mqtt3.password p"]);
});
test("region MQTT: validated, and part of the repeater commands before advert/reboot", () => {
  assert.deepEqual(validateMqtt(MQ), []);
  assert.deepEqual(validateMqtt({ ...MQ, slot: 7 }).map((e) => e.code), ["slot"]);
  assert.deepEqual(validateMqtt({ ...MQ, server: "x".repeat(64) }).map((e) => e.code), ["server"]);
  assert.deepEqual(validateMqtt({ ...MQ, audience: "" }).map((e) => e.code), ["auth"]);
  assert.deepEqual(validateMqtt({ ...MQ, iata: "jkg" }).map((e) => e.code), ["iata"]);
  const s = { name: "SE-JKP-Test", radio: { freq: 869.618, bw: 62.5, sf: 8, cr: 8 }, scope: "se-jkp", mqtt: MQ };
  const c = repeaterCommands(s).commands;
  assert.ok(c.indexOf("set mqtt3.preset custom") < c.indexOf("advert"));
  assert.equal(c.at(-1), "reboot");
  assert.ok(!repeaterCommands(s).commands.includes(undefined));
  assert.ok(!repeaterCommands({ ...s, mqtt: undefined }).commands.some((x) => x.includes("mqtt")));
});
