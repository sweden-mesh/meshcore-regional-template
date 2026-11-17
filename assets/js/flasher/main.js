// The site flasher (B-298): flashes lou firmware from this site over Web Serial. ESP32 boards
// through esptool-js (esp32.js, a pinned copy of the firmware page's flasher.js), nRF52 boards
// through the Adafruit bootloader's serial DFU (dfu.js). Images and their sha256 come from
// <flashIndex>fw/hosted.json; nothing is written unless the file matches its checksum.
// Rendered only on a site with params.firmware.flash = true (layouts/_partials/flasher.html).

import { flash as flashEsp32, setEsptool, sha256 } from "./esp32.js";
import { readPackage, touch, flash as flashDfu } from "./dfu.js";

// Pure parts, for tests -----------------------------------------------------------------------

export const familyOf = (mcu) => (/^esp32/.test(mcu) ? "esp32" : /^nrf52/.test(mcu) ? "nrf52" : null);

// The boards in the index: [{ hw, family, label }], ESP32 first, then nRF52, by label.
export function boards(index) {
  const seen = new Map();
  for (const i of index.images || []) {
    const family = familyOf(i.mcu);
    if (family && !seen.has(i.hw)) seen.set(i.hw, { hw: i.hw, family, label: i.hw.replace(/_/g, " ") });
  }
  return [...seen.values()].sort((a, b) => (a.family === b.family ? a.label.localeCompare(b.label, "sv") : a.family === "esp32" ? -1 : 1));
}

// The variants a board has: [{ key: "core-ar" | "observer-ar" | ..., base, features }], auto-reply
// alone first (the default), then with the Observer, then remote control.
const ORDER = ["core-ar", "observer-ar", "observer-arrc", "observer-rc"];
export function variants(index, hw) {
  const keys = new Set((index.images || []).filter((i) => i.hw === hw).map((i) => `${i.base}-${i.features}`));
  return ORDER.filter((k) => keys.has(k)).map((k) => { const [base, features] = k.split("-"); return { key: k, base, features }; });
}

// The image for a choice: ESP32 update → the app .bin, new install → -merged.bin; nRF52 → .zip.
export function pick(index, hw, key, fresh) {
  const [base, features] = key.split("-");
  const rows = (index.images || []).filter((i) => i.hw === hw && i.base === base && i.features === features);
  const family = rows[0] && familyOf(rows[0].mcu);
  const form = family === "nrf52" ? "zip" : fresh ? "merged" : "bin";
  return rows.find((i) => i.form === form) || null;
}

export const imageUrl = (flashIndex, index, img) => new URL(index.base + img.file, flashIndex).href;

// The page ---------------------------------------------------------------------------------------

const root = globalThis.document?.getElementById("flasher");
if (root) start(root);

function start(root) {
  const T = JSON.parse(root.dataset.t);
  const t = (key, vars = {}) => (T[key] || key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const q = (s) => root.querySelector(s);
  const flashIndex = root.dataset.index;
  setEsptool(root.dataset.esptool);
  const hasSerial = "serial" in navigator;
  q("[data-noserial]").hidden = hasSerial;

  let index = null;
  const board = q("#fl-board"), variant = q("[data-variants]"), modeBox = q("[data-mode]"), go = q("#fl-go");
  const status = q("[data-status]"), bar = q("progress"), log = q("[data-log]"), dl = q("[data-download]");
  const step = (text) => { status.textContent = text; log.textContent += text + "\n"; };

  const load = async (retry = true) => {
    const r = await fetch(new URL("fw/hosted.json", flashIndex), { cache: "no-cache" });
    if (!r.ok) { if (retry) return load(false); throw new Error(t("fl_index_fail", { status: r.status })); }
    return r.json();
  };

  const current = () => {
    const hw = board.value;
    const key = variant.querySelector("input:checked")?.value;
    const fresh = q('input[name="fl-mode"]:checked')?.value === "new";
    const img = hw && key ? pick(index, hw, key, fresh) : null;
    return { hw, key, fresh, img };
  };

  const render = () => {
    const { hw } = current();
    const vs = hw ? variants(index, hw) : [];
    if (![...variant.querySelectorAll("input")].some((i) => i.checked && vs.some((v) => v.key === i.value))) {
      variant.innerHTML = vs.map((v, n) => `<label class="fl-choice"><input type="radio" name="fl-variant" value="${v.key}"${n === 0 ? " checked" : ""}> <span><strong>${t("fl_v_" + v.key)}</strong><br><small>${t("fl_v_" + v.key + "_d")}</small></span></label>`).join("");
    }
    const fam = hw && boards(index).find((b) => b.hw === hw)?.family;
    modeBox.hidden = fam !== "esp32";
    q("[data-nrf]").hidden = fam !== "nrf52";
    q("[data-newwarn]").hidden = !(fam === "esp32" && current().fresh);
    const now = current().img;
    go.disabled = !now || !hasSerial;
    dl.hidden = !now;
    if (now) { dl.href = imageUrl(flashIndex, index, now); dl.textContent = t("fl_download", { file: now.file }); }
  };

  board.addEventListener("change", render);
  variant.addEventListener("change", render);
  modeBox.addEventListener("change", render);

  load().then((data) => {
    index = data;
    const list = boards(index);
    const group = (fam) => list.filter((b) => b.family === fam).map((b) => `<option value="${b.hw}">${b.label}</option>`).join("");
    board.innerHTML = `<option value="">${t("fl_board_pick")}</option><optgroup label="ESP32">${group("esp32")}</optgroup><optgroup label="nRF52">${group("nrf52")}</optgroup>`;
    q("[data-release]").textContent = t("fl_release", { tag: index.tag });
    board.disabled = false;
    render();
  }).catch((e) => { status.textContent = e.message; });

  go.addEventListener("click", async () => {
    const { img, fresh } = current();
    if (!img) return;
    if (fresh && !confirm(t("fl_new_confirm"))) return;
    go.disabled = true; log.textContent = ""; bar.value = 0; bar.hidden = false;
    q("[data-done]").hidden = true;
    try {
      const url = imageUrl(flashIndex, index, img);
      if (familyOf(img.mcu) === "esp32") {
        const port = await navigator.serial.requestPort();
        await flashEsp32({ port, img, url, fresh, t: (k, v) => t(k.replace(/\./g, "_"), v), onStep: step, onProgress: (f) => { bar.value = f; }, onLog: (l) => { log.textContent += l; } });
      } else {
        step(t("fl_fetch"));
        const r = await fetch(url, { cache: "no-cache" });
        if (!r.ok) throw new Error(t("fl_fetch_fail", { status: r.status }));
        const bytes = new Uint8Array(await r.arrayBuffer());
        step(t("fl_check"));
        if (await sha256(bytes) !== img.sha256) throw new Error(t("fl_sha"));
        const pkg = await readPackage(bytes);
        if (!q("#fl-inboot").checked) {
          const app = await navigator.serial.requestPort();
          step(t("fl_touch"));
          await touch(app);
          await new Promise((res) => setTimeout(res, 1500));
        }
        step(t("fl_pick_boot"));
        const again = q("[data-again]");
        again.hidden = false;
        const port = await new Promise((res, rej) => {
          again.onclick = () => navigator.serial.requestPort().then(res, rej);
        });
        again.hidden = true;
        step(t("fl_write"));
        await flashDfu(port, pkg, { progress: (s, n) => { bar.value = n ? s / n : 0; } });
      }
      bar.value = 1;
      step(t("fl_done"));
      q("[data-done]").hidden = false;
    } catch (e) {
      const k = String(e?.message || "").replace(/-/g, "_");
      step(e?.name === "NotFoundError" ? t("fl_noport") : T[k] ? t(k) : String(e?.message || e));
    } finally {
      go.disabled = false;
    }
  });
}
