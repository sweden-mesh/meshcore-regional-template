// Send a command list through a SerialLink, one at a time, stopping at the
// first error. `reboot` is sent last and not waited for: the port drops.

import { isError } from "./serial.js";

export async function applyCommands(link, commands, onProgress = () => {}) {
  const results = [];
  for (const [i, cmd] of commands.entries()) {
    onProgress({ index: i, total: commands.length, command: cmd, state: "sending" });
    if (cmd === "reboot") {
      link.send(cmd).catch(() => {}); // no reply expected
      results.push({ command: cmd, reply: "", ok: true });
      onProgress({ index: i, total: commands.length, command: cmd, state: "done", reply: "" });
      break;
    }
    let reply;
    try {
      reply = await link.send(cmd);
    } catch (err) {
      results.push({ command: cmd, ok: false, error: err.message });
      onProgress({ index: i, total: commands.length, command: cmd, state: "error", error: err.message });
      return { ok: false, results };
    }
    const ok = !isError(reply);
    results.push({ command: cmd, reply, ok });
    onProgress({ index: i, total: commands.length, command: cmd, state: ok ? "done" : "error", reply });
    if (!ok) return { ok: false, results };
  }
  return { ok: true, results };
}
