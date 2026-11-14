// The solar calculator page (wizard-solar.html). DOM only; the arithmetic is in solar.js.
import { createPicker } from "./mappick.js";
import { iataFor } from "./observer.js";
import { SLIDER_PANELS, TREES, DEFAULT_PANEL, MIN_CELLS, cellsFor, needAt, expectedAt, maxCells, couple } from "./solar.js";

const form = document.getElementById("solar-calc");
if (form) init(form);

async function init(form) {
  const t = JSON.parse(document.getElementById("sol-texts").dataset.texts);
  const areas = JSON.parse(form.dataset.areas || "[]");
  const notes = JSON.parse(form.dataset.notes || "{}");
  const q = (sel) => form.querySelector(sel);
  const fmt = (n) => Math.round(n).toLocaleString("sv-SE");
  const all = await fetch(form.dataset.calc).then((r) => r.json());

  const st = { code: all[form.dataset.own] ? form.dataset.own : "JKG", lock: "panel" };
  const panel = q("#sol-panel"), cells = q("#sol-cells"), margin = q("#sol-margin"), tree = q("#sol-tree");
  const brush = q("#sol-brush"), cap = q("#sol-cap"), exposed = q("#sol-exposed");
  panel.value = SLIDER_PANELS.indexOf(DEFAULT_PANEL);

  const settings = () => ({
    tilt: brush.checked ? form.querySelector('input[name="sol-tilt"]:checked').value : "vertical",
    fw: form.querySelector('input[name="sol-fw"]:checked').value,
    tree: TREES[Number(tree.value)],
    margin: Number(margin.value) / 100,
    cap: Math.max(100, Number(String(cap.value).replace(/\s/g, "")) || 3000),
    exposed: exposed.checked,
  });

  const warn = (on, text) => {
    for (const k of ["panel", "cells"]) {
      const el = q(`[data-warn="${k}"]`);
      el.hidden = k !== on;
      if (k === on) el.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3 2 21h20L12 3z" fill="currentColor"/><path d="M12 10v5M12 17.5v.5" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/></svg> ${text}`;
    }
  };

  const showPlace = () => {
    const n = notes[st.code];
    q('[data-out="where"]').textContent = n
      ? `${t.where} ${n.place} (${String(n.lat.toFixed(1)).replace(".", ",")}° N)${n.source && n.source !== "PVGIS-SARAH3" ? ` · ${t.era5}` : ""}`
      : t.outside.replace("{PLACE}", st.code);
    q('[data-out="note"]').innerHTML = n?.note ? `<div class="alert alert-warning" role="note"><p class="alert-title"><svg class="alert-icon alert-icon-warning" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.5 1.5 21h21L12 2.5z" fill="currentColor"/><path d="M12 9.5v5M12 17.5v.5" stroke="var(--bg)" stroke-width="2.2" stroke-linecap="round"/></svg>${t.north}</p><p>${n.note}</p></div>` : "";
  };

  const update = () => {
    const d = all[st.code];
    const s = settings();
    q("[data-tilt]").hidden = !brush.checked;
    q("[data-tilt-off]").hidden = brush.checked;
    if (!brush.checked) form.querySelector('input[name="sol-tilt"][value="vertical"]').checked = true;
    const max = maxCells(d, s.cap);
    cells.max = max;
    const r = couple(d, s, { lock: st.lock, panelIdx: Number(panel.value), cells: Math.min(Number(cells.value), max), max });
    panel.value = r.panelIdx;
    cells.value = r.cells;
    const W = SLIDER_PANELS[r.panelIdx];
    q('[data-out="tree"]').textContent = t.trees[Number(tree.value)];
    q('[data-out="panel"]').textContent = `${W} ${t.w}`;
    q('[data-out="cells"]').textContent = `${r.cells} ${t.cellsUnit} (${fmt(r.cells * s.cap)} mAh)`;
    q('[data-out="margin"]').textContent = `${margin.value} %`;
    for (const k of ["panel", "cells"]) q(`[data-lock="${k}"]`).hidden = st.lock !== k;
    q("[data-bigpanel]").hidden = W < 20;
    if (!r.warn) warn(null);
    else if (r.warn.kind === "summer") warn("panel", t.summer);
    else if (r.warn.kind === "panel") warn("panel", t.panelNeed.replace("{W}", r.warn.value));
    else if (r.warn.kind === "beyond") warn("panel", t.beyond.replace("{W}", r.warn.value));
    else if (r.warn.kind === "nopanel") warn("panel", t.nopanel);
    else warn("cells", t.cellsNeed.replace("{N}", r.warn.value));
    const exp = expectedAt(d, s, r.panelIdx), need = cellsFor(d, s, r.panelIdx);
    q('[data-out="result"]').textContent = need == null || exp == null ? "" : t.result
      .replace("{W}", W).replace("{N}", need).replace("{MAH}", fmt(need * s.cap))
      .replace("{EXP}", fmt(exp)).replace("{M}", margin.value)
      + ` ${t.snow.replace("{D}", s.exposed ? d.snow_allowance.days.exposed : d.snow_allowance.days.sheltered)}`
      + (Math.ceil(needAt(d, s, r.panelIdx) / s.cap) < MIN_CELLS ? ` ${t.min}` : "")
      + (d.lat >= 63 ? ` ${t.buried}` : "");
  };

  panel.addEventListener("input", () => { st.lock = "panel"; update(); });
  cells.addEventListener("input", () => { st.lock = "cells"; update(); });
  for (const el of [margin, tree, cap]) el.addEventListener("input", update);
  for (const el of form.querySelectorAll('input[type="radio"], #sol-brush, #sol-exposed')) el.addEventListener("change", update);

  showPlace();
  update();
  createPicker(q(".map-pick"), { onChange: (p) => {
    const hit = iataFor(p.lat, p.lon, areas);
    if (hit && all[hit.iata]) { st.code = hit.iata; showPlace(); update(); }
    else q('[data-out="where"]').textContent = t.outside.replace("{PLACE}", notes[st.code]?.place || st.code);
  } }).catch(() => {});
}
