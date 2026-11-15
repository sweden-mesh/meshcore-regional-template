import { test } from "node:test";
import assert from "node:assert/strict";
import { controlCommands, validateControl, repeaterCommands, repeaterReview } from "../assets/js/wizard/commands.js";

// RB-3: the region's command broker (params.backend). The template's own default is the shared
// broker, which lou-17's compiled `mccontrol` preset names.
const SHARED = "mqtt-meshcore.louie.se";
const KEY = "ab".repeat(32);
const shared = { host: SHARED, preset: SHARED, slot: 3 };
const own = { host: "mqtt.meshcore-vgr.se", preset: SHARED, slot: 3 };

test("the shared broker: the bare line, the preset picks the slot", () => {
  assert.deepEqual(controlCommands(shared), ["set mqtt.cmd on"]);
  assert.deepEqual(controlCommands({ ...shared, key: KEY }), [`set mqtt.cmd.pubkey ${KEY}`, "set mqtt.cmd on"]);
});

test("a region's own broker: a custom slot with server, audience and packets, then the plane", () => {
  assert.deepEqual(controlCommands({ ...own, key: KEY.toUpperCase() }), [
    `set mqtt.cmd.pubkey ${KEY}`,
    "set mqtt3.preset custom", "set mqtt3.server mqtts://mqtt.meshcore-vgr.se:8883",
    "set mqtt3.audience mqtt.meshcore-vgr.se", "set mqtt3.filter all", "set mqtt.cmd.slot 3",
    "set mqtt.cmd on"]);
  assert.equal(controlCommands({ ...own, slot: 5 })[0], "set mqtt5.preset custom");
});

test("host, slot and key are checked", () => {
  const codes = (c) => validateControl(c).map((e) => e.code);
  assert.deepEqual(codes(shared), []);
  assert.deepEqual(codes(own), []);
  assert.deepEqual(codes({ ...own, host: "mqtts://x.se" }), ["host"]);
  assert.deepEqual(codes({ ...own, host: "localhost" }), ["host"]);
  assert.deepEqual(codes({ ...own, host: `${"a".repeat(40)}.example.se` }), ["host"]);  // server over 63
  assert.deepEqual(codes({ ...own, slot: 1 }), ["slot"]);   // the observer's
  assert.deepEqual(codes({ ...own, slot: 7 }), ["slot"]);
  assert.deepEqual(codes({ ...shared, slot: 1 }), []);      // the preset's slot is the firmware's pick
  assert.deepEqual(codes({ ...own, key: "ab".repeat(31) }), ["key"]);
  assert.deepEqual(codes({ ...own, key: "zz".repeat(32) }), ["key"]);
});

const radio = { freq: 869.618, bw: 62.5, sf: 8, cr: 8 };
const base = { name: "SE-JKP-Taberg", password: "hemligt123", radio, scope: "se-jkp",
  observer: { ssid: "nät", pwd: "", iata: "JKG", preset: "meshat.se" } };

test("in a repeater setup the plane comes after the Observer and the regional slot, before advert", () => {
  const mqtt = { slot: 6, server: "wss://mqtt.example.se", port: 443, audience: "mqtt.example.se", iata: "JKG" };
  const c = repeaterCommands({ ...base, mqtt, control: own }).commands;
  assert.ok(c.indexOf("set mqtt6.preset custom") < c.indexOf("set mqtt3.preset custom"));
  assert.deepEqual(c.slice(-3), ["set mqtt.cmd on", "advert", "reboot"]);
  assert.deepEqual(repeaterCommands({ ...base, control: shared }).commands.slice(-3), ["set mqtt.cmd on", "advert", "reboot"]);
  assert.ok(!repeaterCommands(base).commands.some((x) => x.includes("mqtt.cmd")));
  assert.deepEqual(repeaterReview({ ...base, control: own }).at(-1), { key: "control", value: "mqtt.meshcore-vgr.se" });
});

test("an own broker's command slot may not be the regional slot", () => {
  const mqtt = { slot: 3, server: "wss://mqtt.example.se", port: 443, audience: "mqtt.example.se", iata: "JKG" };
  assert.deepEqual(repeaterCommands({ ...base, mqtt, control: own }).errors.map((e) => `${e.field}:${e.code}`), ["control:slot"]);
  assert.deepEqual(repeaterCommands({ ...base, mqtt, control: shared }).errors, []);
});

test("the template's default is the shared broker, and the preset names it", async () => {
  const { readFileSync } = await import("node:fs");
  const toml = readFileSync(new URL("../hugo.toml", import.meta.url), "utf8");
  const sect = toml.slice(toml.indexOf("[params.backend]"));
  assert.match(sect, /^\s*host = "mqtt-meshcore\.louie\.se"/m);
  assert.match(sect, /^\s*preset = "mqtt-meshcore\.louie\.se"/m);
  assert.doesNotMatch(toml.slice(toml.indexOf("[params.observer.mqtt]"), toml.indexOf("[params.backend]")), /^\s*slot = 3\b/m);
});
