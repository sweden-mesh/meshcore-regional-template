import { test } from "node:test";
import assert from "node:assert/strict";
import { SerialLink, extractReply, isError } from "../assets/js/wizard/serial.js";
import { applyCommands } from "../assets/js/wizard/apply.js";
import { readBack, parseRadio } from "../assets/js/wizard/readback.js";

// A fake repeater console that behaves like examples/simple_repeater/main.cpp:
// echoes the line, then prints "  -> reply" if the reply is not empty.
function fakePort(answer) {
  let ctrl;
  const enc = new TextEncoder(), dec = new TextDecoder();
  const readable = new ReadableStream({ start(c) { ctrl = c; } });
  const writable = new WritableStream({
    write(chunk) {
      const cmd = dec.decode(chunk).replace(/\r$/, "");
      const reply = answer(cmd);
      setTimeout(() => {
        ctrl.enqueue(enc.encode(cmd + "\n"));
        if (reply) setTimeout(() => ctrl.enqueue(enc.encode("  -> " + reply + "\r\n")), 5);
      }, 5);
    },
  });
  return { open: async () => {}, close: async () => {}, readable, writable, sent: [] };
}
const fast = { quietMs: 60, timeoutMs: 500, sleep: (ms) => new Promise((r) => setTimeout(r, Math.min(ms, 5))) };

test("extractReply: reply line, empty after a quiet line, undefined while waiting", () => {
  assert.equal(extractReply("set name X\n  -> OK\n", false), "OK");
  assert.equal(extractReply("advert\n", true), "");
  assert.equal(extractReply("adv", true), undefined);
  assert.equal(isError("Err - unknown region"), true);
  assert.equal(isError("OK"), false);
});

test("a command gets its reply; a quiet command an empty reply", async () => {
  const link = new SerialLink(fakePort((c) => (c === "advert" ? "" : "OK")), fast);
  await link.open();
  assert.equal(await link.send("set name SE-X"), "OK");
  assert.equal(await link.send("advert"), "");
});

test("apply stops at the first error and reboot is not waited for", async () => {
  const sent = [];
  const link = new SerialLink(fakePort((c) => { sent.push(c); return c.startsWith("region allowf") ? "Err - unknown region" : "OK"; }), fast);
  await link.open();
  const r = await applyCommands(link, ["set name X", "region allowf *", "region save", "reboot"]);
  assert.equal(r.ok, false);
  assert.deepEqual(sent, ["set name X", "region allowf *"]);
  const link2 = new SerialLink(fakePort(() => "OK"), fast);
  await link2.open();
  const r2 = await applyCommands(link2, ["set name X", "reboot"]);
  assert.equal(r2.ok, true);
  assert.equal(r2.results.at(-1).command, "reboot");
});

test("readBack parses get replies", async () => {
  const answers = { "get name": "> SE-JKP-Test", "get radio": "> 869.618,62.5,8,8", "get lat": "> 57.78", "get lon": "> 14.16", "region": "* se se-jkp" };
  const link = new SerialLink(fakePort((c) => answers[c] || ""), fast);
  await link.open();
  const rb = await readBack(link);
  assert.deepEqual(rb, { name: "SE-JKP-Test", radio: { freq: 869.618, bw: 62.5, sf: 8, cr: 8 }, position: { lat: 57.78, lon: 14.16 }, regions: "* se se-jkp" });
  assert.equal(parseRadio("> junk"), null);
});
