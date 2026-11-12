// Web Serial link to a MeshCore repeater's console (115200 baud). The firmware
// (examples/simple_repeater/main.cpp) echoes each character, ends the line,
// and prints "  -> <reply>" only when the reply is not empty, so: send one
// command, wait for the reply line, or treat a quiet line as an empty reply.
// One command at a time; `reboot` drops the port by design.

export const REPLY_PREFIX = "  -> ";

// The reply for the command just sent, from the console text received since:
// undefined while still waiting, "" for a command that printed nothing.
export function extractReply(text, quiet) {
  const lines = text.split(/\r?\n/);
  for (const l of lines) if (l.startsWith(REPLY_PREFIX)) return l.slice(REPLY_PREFIX.length).trim();
  return quiet && text.includes("\n") ? "" : undefined;
}

export function isError(reply) {
  return /^(err|error|unknown|invalid)/i.test(reply || "");
}

export class SerialLink {
  constructor(port, { timeoutMs = 5000, quietMs = 1200, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
    Object.assign(this, { port, timeoutMs, quietMs, sleep, buf: "", busy: false });
  }

  static async request(serial = navigator.serial) {
    if (!serial) throw new Error("no-web-serial");
    return new SerialLink(await serial.requestPort());
  }

  async open(baudRate = 115200) {
    await this.port.open({ baudRate });
    this.reader = this.port.readable.getReader();
    this.writer = this.port.writable.getWriter();
    const dec = new TextDecoder();
    this.loop = (async () => {
      try {
        for (;;) {
          const { value, done } = await this.reader.read();
          if (done) break;
          this.buf += dec.decode(value, { stream: true });
        }
      } catch { /* port closed or lost (reboot) */ }
    })();
  }

  async send(command) {
    if (this.busy) throw new Error("busy");
    this.busy = true;
    try {
      this.buf = "";
      await this.writer.write(new TextEncoder().encode(command + "\r"));
      const start = Date.now();
      let lastLen = -1, quietSince = Date.now();
      for (;;) {
        if (this.buf.length !== lastLen) { lastLen = this.buf.length; quietSince = Date.now(); }
        const quiet = Date.now() - quietSince >= this.quietMs;
        const reply = extractReply(this.buf, quiet);
        if (reply !== undefined) return reply;
        if (Date.now() - start > this.timeoutMs) throw new Error("timeout");
        await this.sleep(50);
      }
    } finally {
      this.busy = false;
    }
  }

  async close() {
    try { await this.reader?.cancel(); } catch { /* already gone */ }
    try { this.writer?.releaseLock(); } catch { /* ignore */ }
    try { await this.port.close(); } catch { /* ignore */ }
  }
}
