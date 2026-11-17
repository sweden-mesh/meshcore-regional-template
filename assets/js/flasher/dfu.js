// nRF52 serial DFU over Web Serial, for the Adafruit nRF52 bootloader that MeshCore's nRF52
// boards ship with (RAK4631, Heltec T114/T096, XIAO nRF52840, T-Echo and others). The same
// "legacy" protocol adafruit-nrfutil speaks with `dfu serial --touch 1200`:
//
//   1. touch: open the application's port at 1200 baud and close it; the board restarts into
//      its bootloader, which shows up as a new USB serial port (the page asks for it again);
//   2. at 115200 baud, HCI packets in SLIP frames: START (mode 4 = application, sizes),
//      INIT (the package's .dat plus two bytes of padding), DATA (512 bytes each), STOP.
//
// Only the application is written: the bootloader, settings and the node's key stay. The
// packet bytes are pinned to adafruit-nrfutil's own output in tests/data/dfu-reference.json.

import { unzip } from "./zip.js";

export const START = 3, INIT = 1, DATA = 4, STOP = 5, MODE_APP = 4;
export const PACKET_MAX = 512;
const PAGE = 4096, PAGE_ERASE_MS = 89.7, PAGE_WRITE_MS = (PAGE / 4) * 0.1;

export function crc16(bytes, crc = 0xffff) {
  for (const b of bytes) {
    crc = ((crc >> 8) & 0xff) | ((crc << 8) & 0xff00);
    crc ^= b;
    crc ^= (crc & 0xff) >> 4;
    crc ^= (crc << 12) & 0xffff;
    crc ^= ((crc & 0xff) << 5) & 0xffff;
  }
  return crc & 0xffff;
}

const le32 = (v) => [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];

// One HCI packet: header (seq, ack = seq+1, integrity and reliable bits, type 14, length),
// payload, CRC16 little-endian, SLIP-escaped between two 0xC0.
export function hciPacket(seq, payload) {
  const len = payload.length;
  const h = [seq | (((seq + 1) % 8) << 3) | (1 << 6) | (1 << 7), 14 | ((len & 0x0f) << 4), (len & 0xff0) >> 4];
  h.push((~(h[0] + h[1] + h[2]) + 1) & 0xff);
  const body = [...h, ...payload];
  const crc = crc16(body);
  body.push(crc & 0xff, crc >> 8);
  const out = [0xc0];
  for (const b of body) {
    if (b === 0xc0) out.push(0xdb, 0xdc);
    else if (b === 0xdb) out.push(0xdb, 0xdd);
    else out.push(b);
  }
  out.push(0xc0);
  return new Uint8Array(out);
}

// The whole packet stream for one application image, in order, with the pause the board
// needs after each (flash erase after START, a page write every 8 DATA packets).
export function packets(firmware, dat) {
  const list = [];
  let seq = 0;
  const add = (payload, waitMs = 0) => { seq = (seq + 1) % 8; list.push({ bytes: hciPacket(seq, payload), waitMs }); };
  const eraseMs = Math.max(500, (Math.floor(firmware.length / PAGE) + 1) * PAGE_ERASE_MS);
  add([...le32(START), ...le32(MODE_APP), ...le32(0), ...le32(0), ...le32(firmware.length)], eraseMs);
  add([...le32(INIT), ...dat, 0, 0]);
  const frames = Math.ceil(firmware.length / PACKET_MAX);
  for (let i = 0; i < frames; i++) {
    const chunk = firmware.subarray(i * PACKET_MAX, (i + 1) * PACKET_MAX);
    add([...le32(DATA), ...chunk], i % 8 === 0 ? PAGE_WRITE_MS : 0);
  }
  list[list.length - 1].waitMs += PAGE_WRITE_MS;
  add(le32(STOP));
  return list;
}

// manifest.json → { firmware, dat } for an application package; anything else is refused.
export async function readPackage(zipBytes) {
  const files = await unzip(zipBytes);
  const manifest = JSON.parse(new TextDecoder().decode(files.get("manifest.json") || new Uint8Array()) || "{}");
  const app = manifest.manifest?.application;
  if (!app) throw new Error("dfu-not-app");
  const firmware = files.get(app.bin_file), dat = files.get(app.dat_file);
  if (!firmware || !dat) throw new Error("dfu-incomplete");
  // The package names the image's CRC16; a mismatch means a damaged download.
  const want = app.init_packet_data?.firmware_crc16;
  if (want !== undefined && crc16(firmware) !== want) throw new Error("dfu-crc");
  return { firmware, dat, initData: app.init_packet_data || {} };
}

// Ask the running application to restart into its bootloader.
export async function touch(port, sleep = (ms) => new Promise((r) => setTimeout(r, ms))) {
  await port.open({ baudRate: 1200 });
  await sleep(100);
  await port.close();
}

// Read one SLIP frame (an ACK) from the bootloader; resolves with its ack number.
async function readAck(reader, timeoutMs) {
  let buf = [], delims = 0;
  const deadline = Date.now() + timeoutMs;
  while (delims < 2) {
    const left = deadline - Date.now();
    if (left <= 0) throw new Error("dfu-timeout");
    let timer;
    const r = await Promise.race([reader.read(), new Promise((res) => { timer = setTimeout(() => res({ timeout: true }), left); })]);
    clearTimeout(timer);
    if (r.timeout) throw new Error("dfu-timeout");
    if (r.done) throw new Error("dfu-closed");
    for (const b of r.value) {
      if (b === 0xc0) { delims++; if (delims === 2) break; continue; }
      if (delims === 1) buf.push(b);
    }
  }
  const out = [];
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0xdb) { out.push(buf[++i] === 0xdc ? 0xc0 : 0xdb); } else out.push(buf[i]);
  }
  return (out[0] >> 3) & 0x07;
}

// Send the package to a board already in its bootloader, on `port` (not yet open).
// progress(sentBytes, totalBytes).
export async function flash(port, { firmware, dat }, { progress = () => {}, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), ackTimeoutMs = 3000 } = {}) {
  await port.open({ baudRate: 115200 });
  const reader = port.readable.getReader(), writer = port.writable.getWriter();
  try {
    await sleep(100);
    const list = packets(firmware, dat);
    let sent = 0;
    for (const [i, p] of list.entries()) {
      await writer.write(p.bytes);
      await readAck(reader, ackTimeoutMs);
      if (p.waitMs) await sleep(p.waitMs);
      if (i >= 2 && i < list.length - 1) sent = Math.min(firmware.length, sent + PACKET_MAX);
      progress(sent, firmware.length);
    }
    // The bootloader checks the image and starts it; give it the time nrfutil gives it.
    await sleep(Math.max(500, (Math.floor(firmware.length / PAGE) + 1) * (PAGE_ERASE_MS + PAGE_WRITE_MS)));
  } finally {
    try { reader.releaseLock(); writer.releaseLock(); await port.close(); } catch { /* the board restarted */ }
  }
}
