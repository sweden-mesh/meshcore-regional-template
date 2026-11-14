import { test } from "node:test";
import assert from "node:assert/strict";
import { repeaterCommands } from "../assets/js/wizard/commands.js";
import { iataFor } from "../assets/js/wizard/observer.js";

const radio = { freq: 869.618, bw: 62.5, sf: 8, cr: 8 };
const base = { name: "SE-JKP-Taberg", lat: 57.67, lon: 14.08, password: "hemligt123", radio, scope: "se-jkp" };
const obs = { ssid: "Mitt nät 5G", pwd: "wifi pass", iata: "JKG", preset: "meshat.se" };

test("an Observer gets wifi, map code and the map's server before advert and reboot", () => {
  const { commands, errors } = repeaterCommands({ ...base, observer: obs });
  assert.deepEqual(errors, []);
  const i = commands.indexOf("set wifi.ssid Mitt nät 5G");
  assert.ok(i > 0);
  assert.deepEqual(commands.slice(i, i + 4), ["set wifi.ssid Mitt nät 5G", "set wifi.pwd wifi pass", "set mqtt.iata JKG", "set mqtt1.preset meshat.se"]);
  assert.deepEqual(commands.slice(-2), ["advert", "reboot"]);
});
test("no Observer, no wifi commands; an open network sends no password", () => {
  assert.ok(!repeaterCommands(base).commands.some((c) => c.startsWith("set wifi.") || c.startsWith("set mqtt")));
  const c = repeaterCommands({ ...base, observer: { ...obs, pwd: "" } }).commands;
  assert.ok(c.includes("set wifi.ssid Mitt nät 5G") && !c.some((x) => x.startsWith("set wifi.pwd")));
});
test("the Observer's fields are checked against the firmware's limits", () => {
  const fields = (o) => repeaterCommands({ ...base, observer: { ...obs, ...o } }).errors.map((e) => e.field);
  assert.deepEqual(fields({ ssid: " " }), ["wifi"]);
  assert.deepEqual(fields({ ssid: "x".repeat(32) }), ["wifi"]);
  assert.deepEqual(fields({ pwd: "x".repeat(64) }), ["wifiPwd"]);
  assert.deepEqual(fields({ iata: "JKGJKGJK" }), ["iata"]);
  assert.deepEqual(fields({ iata: "" }), ["iata"]);
});
test("with the regional slot too, mqtt.iata is sent once", () => {
  const mqtt = { slot: 3, server: "wss://mqtt.example.se", port: 443, audience: "mqtt.example.se", iata: "JKG" };
  const c = repeaterCommands({ ...base, observer: obs, mqtt }).commands;
  assert.equal(c.filter((x) => x.startsWith("set mqtt.iata ")).length, 1);
  assert.ok(c.includes("set mqtt3.preset custom"));
});

const square = (lon, lat) => [[[[lon, lat], [lon + 1, lat], [lon + 1, lat + 1], [lon, lat + 1], [lon, lat]]]];
const areas = [{ iata: "JKG", lan: "Jönköpings län", rings: square(14, 57) }, { iata: "LPI", lan: "Östergötlands län", rings: square(15, 57) }];
test("the map code follows the county the position lies in", () => {
  assert.deepEqual(iataFor(57.5, 14.5, areas), { iata: "JKG", lan: "Jönköpings län" });
  assert.deepEqual(iataFor(57.5, 15.5, areas), { iata: "LPI", lan: "Östergötlands län" });
  assert.deepEqual(iataFor(57.5, 13.9, areas), { iata: "JKG", lan: "Jönköpings län" }); // ~7 km outside
  assert.equal(iataFor(57.5, 12, areas), null);
});

test("an optional guest password is set after the admin password, and checked", () => {
  const c = repeaterCommands({ ...base, guest: "gast1" }).commands;
  assert.equal(c[c.indexOf("password hemligt123") + 1], "set guest.password gast1");
  assert.ok(!repeaterCommands(base).commands.some((x) => x.startsWith("set guest.password")));
  assert.deepEqual(repeaterCommands({ ...base, guest: "x".repeat(16) }).errors.map((e) => e.field), ["guest"]);
});
