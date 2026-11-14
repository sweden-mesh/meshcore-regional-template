// The guided repeater wizard: the same settings as the quick one, one step at
// a time with the reason for each value, a review of what changes on the
// device, and a test before mounting. Shares the tested modules.
import { createPicker } from "./mappick.js";
import { repeaterCommands } from "./commands.js";
import { initNeighbours } from "./neighbours.js";
import { initMqtt } from "./mqtt.js";
import { initObserver } from "./observer.js";
import { buildName, namePrefix, wantsKeySuffix } from "./naming.js";
import { SerialLink } from "./serial.js";
import { applyCommands } from "./apply.js";
import { readBack } from "./readback.js";

const form = document.getElementById("wizard-guided");
if (form) init(form);

function init(form) {
  const t = JSON.parse(document.getElementById("wzg-texts").dataset.texts);
  const ds = form.dataset;
  const radio = JSON.parse(ds.radio || "{}");
  const q = (sel) => form.querySelector(sel);
  const steps = [...form.querySelectorAll(".wz-step")];
  const state = { pos: null, publicKey: null, link: null, device: null, step: 0 };
  const bytes = (s) => new TextEncoder().encode(s).length;
  q("[data-prefix]").textContent = namePrefix(ds.pattern);

  // Step navigation (the page shows all steps without JavaScript).
  const progress = q(".wz-progress");
  steps.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = s.querySelector("legend").textContent.replace(/^\s*\d+\s*/, "");
    li.addEventListener("click", () => show(i));
    progress.append(li);
  });
  const nav = q(".wz-nav");
  nav.hidden = false;
  const show = (i) => {
    state.step = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => { s.hidden = k !== state.step; });
    [...progress.children].forEach((li, k) => li.toggleAttribute("aria-current", k === state.step));
    q("[data-prev]").disabled = state.step === 0;
    q("[data-next]").hidden = state.step === steps.length - 1;
    if (steps[state.step].dataset.step === "place") picker?.map.resize();
  };
  q("[data-prev]").addEventListener("click", () => show(state.step - 1));
  q("[data-next]").addEventListener("click", () => show(state.step + 1));

  const nb = initNeighbours(q(".wz-neighbours"), () => update());
  const mqtt = initMqtt(q(".wz-mqtt"), () => update());
  const obs = initObserver(q(".wz-observer"), () => update());
  // The regional slot is an Observer's; it reports under the Observer's map code.
  const regional = (o) => { const m = o && mqtt(); return m && { ...m, iata: o.iata || m.iata }; };
  const settings = () => {
    const extra = nb.scopes();
    return { name: buildName(ds.pattern, q("#wzg-place").value, state.publicKey, q("#wzg-key").checked), lat: state.pos?.lat, lon: state.pos?.lon,
      tx: q("#wzg-tx").value.trim(), password: q("#wzg-pass").value, offgrid: q("#wzg-offgrid").checked, radio, scope: ds.scope, extraScopes: extra, observer: obs.get(), mqtt: regional(obs.get()) };
  };

  const update = () => {
    const s = settings();
    const b = bytes(s.name);
    let msg = s.name ? `${s.name} · ${b} ${t.bytes}` : "";
    if (b > 31) msg += ` · ${t.tooLong}`; else if (b > 22) msg += ` · ${t.noPos}`;
    if (s.name && q("#wzg-key").checked && !state.publicKey) msg += ` · ${t.suffix}`;
    q('[data-out="name"]').textContent = msg;
    const { commands, errors } = repeaterCommands(s);
    q("[data-cmds]").textContent = errors.length ? `${t.fix}: ${[...new Set(errors.map((e) => t.fields?.[e.field] || e.field))].join(", ")}` : commands.join("\n");
    q("[data-send]").disabled = !state.link || errors.length > 0;
    renderDiff(s);
    return { commands, errors };
  };

  // What changes on the device: current values (read back) against the new ones.
  const renderDiff = (s) => {
    const table = q("[data-diff]");
    if (!state.device) { table.hidden = true; return; }
    const d = state.device;
    const rows = [
      [t.name, d.name || "–", s.name || "–"],
      [t.radio, d.radio ? `${d.radio.freq},${d.radio.bw},${d.radio.sf},${d.radio.cr}` : "–", `${radio.freq},${radio.bw},${radio.sf},${radio.cr}`],
      [t.position, d.position ? `${d.position.lat}, ${d.position.lon}` : "–", s.lat != null ? `${s.lat}, ${s.lon}` : "–"],
      [t.regions, d.regions || "–", ["eu", "europe", "se", s.scope, ...s.extraScopes].join(" ")],
    ];
    const tbody = table.querySelector("tbody");
    tbody.textContent = "";
    for (const [label, now, next] of rows) {
      const tr = document.createElement("tr");
      for (const v of [label, now, next]) { const td = document.createElement("td"); td.textContent = v; tr.append(td); }
      if (String(now) !== String(next)) tr.className = "changed";
      tbody.append(tr);
    }
    table.hidden = false;
  };

  let picker = null;
  createPicker(q(".map-pick"), { onChange: (p) => {
    state.pos = p; q('[data-out="pos"]').textContent = `${t.posSet} ${p.lat}, ${p.lon}`; nb.setPosition(p.lat, p.lon); obs.setPosition(p.lat, p.lon);
  } }).then((pk) => { picker = pk; }).catch(() => {});

  for (const id of ["#wzg-place", "#wzg-pass", "#wzg-tx"]) q(id).addEventListener("input", update);
  q("#wzg-key").checked = wantsKeySuffix(ds.pattern);
  for (const id of ["#wzg-offgrid", "#wzg-key"]) q(id).addEventListener("change", update);

  if (!("serial" in navigator)) {
    q("[data-connect]").disabled = true;
    q("[data-serial-help]").textContent = t.noSerial;
    q(".wz-commands").open = true;
  }

  q("[data-connect]").addEventListener("click", async () => {
    try {
      state.link = await SerialLink.request();
      await state.link.open();
      state.device = await readBack(state.link);
      state.publicKey = state.device.publicKey;
      if (state.device.position && !state.pos) {
        state.pos = state.device.position;
        picker?.set(state.pos.lat, state.pos.lon);
      }
      q('[data-out="device"]').textContent = `${t.connected} ${state.device.name || "?"}`;
      update();
    } catch (err) {
      q('[data-out="device"]').textContent = String(err.message || err);
    }
  });

  q("[data-send]").addEventListener("click", async () => {
    const { commands, errors } = update();
    if (errors.length || !state.link) return;
    const log = q("[data-log]");
    log.textContent = "";
    q("[data-send]").disabled = true;
    const r = await applyCommands(state.link, commands, (p) => {
      if (p.state === "sending") return;
      const li = document.createElement("li");
      li.textContent = `${p.command}${p.reply ? " → " + p.reply : ""}${p.error ? " → " + p.error : ""}`;
      li.className = p.state;
      log.append(li);
    });
    q('[data-out="device"]').textContent = r.ok ? t.done : t.failed;
    if (r.ok) show(steps.length - 1);
  });

  q("[data-copy]").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(q("[data-cmds]").textContent); q("[data-copy]").textContent = t.copied; } catch { /* select manually */ }
  });

  show(0);
  update();
}
