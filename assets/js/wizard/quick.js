// The quick repeater wizard: place, name, region, password, then apply over
// Web Serial (or copy the commands). Command building, the serial link and the
// map pick are their own tested modules.
import { createPicker } from "./mappick.js";
import { repeaterCommands } from "./commands.js";
import { buildName, namePrefix, wantsKeySuffix } from "./naming.js";
import { SerialLink } from "./serial.js";
import { applyCommands } from "./apply.js";
import { readBack } from "./readback.js";

const form = document.getElementById("wizard-quick");
if (form) init(form);

function init(form) {
  const t = JSON.parse(document.getElementById("wz-texts").dataset.texts);
  const ds = form.dataset;
  const radio = JSON.parse(ds.radio || "{}");
  const $ = (id) => document.getElementById(id);
  const state = { pos: null, publicKey: null, link: null };
  const bytes = (s) => new TextEncoder().encode(s).length;
  $("wz-prefix").textContent = namePrefix(ds.pattern);

  const settings = () => {
    const extra = $("wz-edge").checked ? [$("wz-neighbour").value.trim().toLowerCase()].filter(Boolean) : [];
    return { name: buildName(ds.pattern, $("wz-place").value, state.publicKey), lat: state.pos?.lat, lon: state.pos?.lon,
      password: $("wz-pass").value, radio, scope: ds.scope, extraScopes: extra };
  };

  const update = () => {
    const s = settings();
    const b = bytes(s.name);
    let msg = s.name ? `${s.name} · ${b} ${t.bytes}` : "";
    if (b > 31) msg += ` · ${t.tooLong}`; else if (b > 22) msg += ` · ${t.noPos}`;
    if (s.name && wantsKeySuffix(ds.pattern) && !state.publicKey) msg += ` · ${t.suffix}`;
    $("wz-name").textContent = msg;
    const { commands, errors } = repeaterCommands(s);
    $("wz-cmds").textContent = errors.length ? `${t.fix}: ${[...new Set(errors.map((e) => e.field))].join(", ")}` : commands.join("\n");
    $("wz-send").disabled = !state.link || errors.length > 0;
    return { commands, errors };
  };

  createPicker(form.querySelector(".map-pick"), { onChange: (p) => {
    state.pos = p; $("wz-pos").textContent = `${t.posSet} ${p.lat}, ${p.lon}`; update();
  } }).catch(() => {});

  for (const id of ["wz-place", "wz-pass", "wz-neighbour"]) $(id).addEventListener("input", update);
  $("wz-edge").addEventListener("change", () => { $("wz-edge-row").hidden = !$("wz-edge").checked; update(); });

  if (!("serial" in navigator)) {
    $("wz-connect").disabled = true;
    $("wz-serial-help").textContent = t.noSerial;
    form.querySelector(".wz-commands").open = true;
  }

  $("wz-connect").addEventListener("click", async () => {
    try {
      state.link = await SerialLink.request();
      await state.link.open();
      const rb = await readBack(state.link);
      state.publicKey = rb.publicKey;
      if (rb.position && !state.pos) state.pos = { lat: rb.position.lat, lon: rb.position.lon };
      $("wz-device").textContent = `${t.connected} ${rb.name || "?"}`;
      update();
    } catch (err) {
      $("wz-device").textContent = String(err.message || err);
    }
  });

  $("wz-send").addEventListener("click", async () => {
    const { commands, errors } = update();
    if (errors.length || !state.link) return;
    const log = $("wz-log");
    log.textContent = "";
    $("wz-send").disabled = true;
    const r = await applyCommands(state.link, commands, (p) => {
      if (p.state === "sending") return;
      const li = document.createElement("li");
      li.textContent = `${p.command}${p.reply ? " → " + p.reply : ""}${p.error ? " → " + p.error : ""}`;
      li.className = p.state;
      log.append(li);
    });
    $("wz-device").textContent = r.ok ? t.done : t.failed;
  });

  $("wz-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("wz-cmds").textContent); $("wz-copy").textContent = t.copied; } catch { /* select manually */ }
  });

  update();
}
