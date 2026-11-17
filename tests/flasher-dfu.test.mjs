import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { crc16, hciPacket, packets, readPackage, flash } from "../assets/js/flasher/dfu.js";
import { unzip } from "../assets/js/flasher/zip.js";

const ref = JSON.parse(readFileSync(new URL("./data/dfu-reference.json", import.meta.url)));
const hex = (u) => Buffer.from(u).toString("hex");
const fromHex = (h) => new Uint8Array(Buffer.from(h, "hex"));

test("crc16 is CRC-16/CCITT-FALSE", () => {
  assert.equal(crc16(new TextEncoder().encode("123456789")), 0x29b1);
});

test("the packet stream matches adafruit-nrfutil byte for byte", () => {
  const list = packets(fromHex(ref.firmware), fromHex(ref.dat));
  assert.deepEqual(list.map((p) => hex(p.bytes)), ref.packets);
  assert.ok(ref.packets.some((p) => p.slice(2, -2).includes("dbdc")), "the fixture exercises escaping");
});

test("the erase wait follows the image size", () => {
  const big = packets(new Uint8Array(400_000), new Uint8Array(14));
  assert.ok(big[0].waitMs > 8000 && big[0].waitMs < 9500);
  assert.equal(packets(new Uint8Array(100), new Uint8Array(14))[0].waitMs, 500);
});

test("SLIP escapes 0xC0 and 0xDB", () => {
  const p = hciPacket(1, [0xc0, 0xdb]);
  assert.equal(p[0], 0xc0); assert.equal(p.at(-1), 0xc0);
  assert.ok(!p.subarray(1, -1).includes(0xc0));
});

// A minimal zip: one stored and one deflated entry, built here so no binary fixture is kept.
async function makeZip(entries) {
  const enc = new TextEncoder(), parts = [], central = [];
  let off = 0;
  const u16 = (v) => [v & 0xff, v >> 8], u32 = (v) => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
  for (const [name, data, deflate] of entries) {
    const n = enc.encode(name);
    const body = deflate ? new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer()) : data;
    const head = [...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(deflate ? 8 : 0), 0, 0, 0, 0, ...u32(0), ...u32(body.length), ...u32(data.length), ...u16(n.length), ...u16(0)];
    central.push([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(deflate ? 8 : 0), 0, 0, 0, 0, ...u32(0), ...u32(body.length), ...u32(data.length), ...u16(n.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...u32(off), ...n]);
    parts.push(new Uint8Array(head), n, body);
    off += head.length + n.length + body.length;
  }
  const cd = new Uint8Array(central.flat());
  const end = new Uint8Array([...u32(0x06054b50), 0, 0, 0, 0, ...u16(entries.length), ...u16(entries.length), ...u32(cd.length), ...u32(off), 0, 0]);
  return new Uint8Array(await new Blob([...parts, cd, end]).arrayBuffer());
}

test("readPackage reads an application package, stored and deflated", async () => {
  const manifest = JSON.stringify({ manifest: { application: { bin_file: "firmware.bin", dat_file: "firmware.dat", init_packet_data: { device_type: 82, firmware_crc16: crc16(fromHex(ref.firmware)) } }, dfu_version: 0.5 } });
  const zip = await makeZip([["firmware.bin", fromHex(ref.firmware), true], ["manifest.json", new TextEncoder().encode(manifest), false], ["firmware.dat", fromHex(ref.dat), false]]);
  const files = await unzip(zip);
  assert.deepEqual([...files.keys()], ["firmware.bin", "manifest.json", "firmware.dat"]);
  const pkg = await readPackage(zip);
  assert.equal(hex(pkg.firmware), ref.firmware);
  assert.equal(pkg.initData.device_type, 82);
  const bad = await makeZip([["firmware.bin", new Uint8Array(10), false], ["manifest.json", new TextEncoder().encode(manifest), false], ["firmware.dat", fromHex(ref.dat), false]]);
  await assert.rejects(readPackage(bad), /dfu-crc/);
  const bl = await makeZip([["manifest.json", new TextEncoder().encode('{"manifest":{"bootloader":{}}}'), false]]);
  await assert.rejects(readPackage(bl), /dfu-not-app/);
});

// A fake bootloader: checks each frame's CRC, answers with an ACK frame.
function fakePort({ failAt = -1 } = {}) {
  const got = [];
  let pending = [];
  const port = {
    opened: [], closed: 0,
    async open(o) { this.opened.push(o.baudRate); },
    async close() { this.closed++; },
    readable: { getReader: () => ({ read: async () => { await null; const v = pending.shift(); return v ? { value: v, done: false } : { value: new Uint8Array(), done: false }; }, releaseLock() {} }) },
    writable: { getWriter: () => ({ write: async (b) => {
      got.push(hex(b));
      if (got.length - 1 === failAt) return;
      const seq = b[1] & 7;
      pending.push(new Uint8Array([0xc0, ((seq + 1) % 8) << 3, 0, 0, 0, 0xc0]));
    }, releaseLock() {} }) },
  };
  return { port, got };
}

test("flash sends every packet, waits for each ACK and reports progress", async () => {
  const { port, got } = fakePort();
  const seen = [];
  await flash(port, { firmware: fromHex(ref.firmware), dat: fromHex(ref.dat) }, { sleep: async () => {}, progress: (s, t) => seen.push([s, t]) });
  assert.deepEqual(got, ref.packets);
  assert.deepEqual(port.opened, [115200]);
  assert.deepEqual(seen.at(-1), [1100, 1100]);
});

test("flash stops on a missing ACK", async () => {
  const { port } = fakePort({ failAt: 1 });
  await assert.rejects(flash(port, { firmware: fromHex(ref.firmware), dat: fromHex(ref.dat) }, { sleep: async () => {}, ackTimeoutMs: 50 }), /dfu-timeout/);
});
