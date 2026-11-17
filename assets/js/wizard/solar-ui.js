// The solar calculator page (wizard-solar.html). DOM only; the arithmetic is in solar.js.
import { TREES, DEFAULT_PANEL, MIN_CELLS, cellsFor, needAt, expectedAt, maxCells, couple, sliderPanels } from "./solar.js";

// The board and firmware chosen → { load, ma, low } from data/solar_boards.toml, or null when the
// board has no figure for that firmware (B-291). Pure, for tests.
export function boardLoad(board, fw) {
  const e = board?.any || board?.[fw];
  return e ? { load: e.grid, ma: e.ma, low: !!e.low } : null;
}

const form = globalThis.document?.getElementById("solar-calc");
if (form) init(form);

async function init(form) {
  const t = JSON.parse(document.getElementById("sol-texts").dataset.texts);
  const notes = JSON.parse(form.dataset.notes || "{}");
  const q = (sel) => form.querySelector(sel);
  const fmt = (n) => Math.round(n).toLocaleString("sv-SE");
  // Enter in the one text field would submit the form and reload the page.
  form.addEventListener("submit", (e) => e.preventDefault());
  const urls = JSON.parse(form.dataset.calc);
  const boards = JSON.parse(form.dataset.boards || "[]");
  const code = urls[form.dataset.own] ? form.dataset.own : "JKG";
  const all = { [code]: await fetch(urls[code]).then((r) => r.json()) };

  const st = { code, lock: "panel" };
  const panel = q("#sol-panel"), cells = q("#sol-cells"), margin = q("#sol-margin"), tree = q("#sol-tree");
  const brush = q("#sol-brush"), cap = q("#sol-cap"), exposed = q("#sol-exposed");
  panel.value = sliderPanels(all[code], "4.5").indexOf(DEFAULT_PANEL);
  let lastBig = false;

  // The board's load; a firmware the board has no figure for is greyed out and the other chosen.
  const chosen = () => {
    const b = boards.find((x) => x.key === form.querySelector('input[name="sol-board"]:checked')?.value) || boards[0];
    for (const r of form.querySelectorAll('input[name="sol-fw"]')) {
      r.disabled = !b?.any && !b?.[r.value];
      r.closest("label").title = r.disabled ? t.fwNone : "";
    }
    const fwOk = form.querySelector('input[name="sol-fw"]:checked:not(:disabled)') || form.querySelector('input[name="sol-fw"]:not(:disabled)');
    if (fwOk) fwOk.checked = true;
    q("[data-fwq]").hidden = !!b?.any;
    q('[data-out="hint"]').textContent = b?.hint || "";
    return { b, ...(boardLoad(b, fwOk?.value) || { load: "4.5", ma: 4.5, low: false }) };
  };

  const settings = () => ({
    tilt: brush.checked ? form.querySelector('input[name="sol-tilt"]:checked').value : "vertical",
    load: chosen().load,
    tree: TREES[Number(tree.value)],
    margin: Number(margin.value) / 100,
    cap: Math.max(100, Number(String(cap.value).replace(/\s/g, "")) || 3000),
    exposed: exposed.checked,
  });

  const warn = (on, text) => {
    for (const k of ["panel", "cells"]) {
      const el = q(`[data-warn="${k}"]`);
      // Kept in the page, empty when quiet: a live region that is shown is not announced reliably.
      if (k !== on) el.textContent = "";
      else el.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3 2 21h20L12 3z" fill="currentColor"/><path d="M12 10v5M12 17.5v.5" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/></svg> ${text}`;
    }
  };

  const showPlace = () => {
    const n = notes[st.code];
    q('[data-out="where"]').textContent = n
      ? `${t.where} ${n.place} (${String(n.lat.toFixed(1)).replace(".", ",")}° N)${n.source && n.source !== "PVGIS-SARAH3" ? ` · ${t.era5}` : ""}`
      : "";
    q('[data-out="note"]').innerHTML = n?.note ? `<div class="alert alert-warning" role="note"><p class="alert-title"><svg class="alert-icon alert-icon-warning" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.5 1.5 21h21L12 2.5z" fill="currentColor"/><path d="M12 9.5v5M12 17.5v.5" stroke="var(--bg)" stroke-width="2.2" stroke-linecap="round"/></svg>${t.north}</p><p>${n.note}</p></div>` : "";
  };

  const update = () => {
    const d = all[st.code];
    const s = settings();
    const c = chosen();
    const sizes = sliderPanels(d, s.load), big = sizes !== sliderPanels(d, "4.5");
    // The Pi Zero's limits (B-291): the panel slider reaches 300 W only while it is chosen, and
    // keeps the same watts across the switch where it can.
    if (big !== lastBig) {
      const W = (lastBig ? sliderPanels(d, "190") : sliderPanels(d, "4.5"))[Number(panel.value)];
      panel.max = sizes.length - 1;
      panel.value = Math.max(0, sizes.indexOf(W) >= 0 ? sizes.indexOf(W) : Math.min(Number(panel.value), sizes.length - 1));
      lastBig = big;
    }
    q("[data-pi]").hidden = !big;
    q('[data-out="load"]').textContent = (c.low ? t.loadLow : t.load).replace("{MA}", String(c.ma).replace(".", ","));
    q("[data-tilt]").hidden = !brush.checked;
    q("[data-tilt-off]").hidden = brush.checked;
    if (!brush.checked) form.querySelector('input[name="sol-tilt"][value="vertical"]').checked = true;
    const max = maxCells(d, s.cap, s.load);
    cells.max = max;
    const r = couple(d, s, { lock: st.lock, panelIdx: Number(panel.value), cells: Math.min(Number(cells.value), max), max });
    panel.value = r.panelIdx;
    cells.value = r.cells;
    const W = sizes[r.panelIdx];
    q('[data-out="tree"]').textContent = t.trees[Number(tree.value)];
    q('[data-out="panel"]').textContent = `${String(W).replace(".", ",")} ${t.w}`;
    q('[data-out="cells"]').textContent = `${r.cells} ${t.cellsUnit} (${fmt(r.cells * s.cap)} mAh)`;
    q('[data-out="margin"]').textContent = `${margin.value} %`;
    tree.setAttribute("aria-valuetext", t.trees[Number(tree.value)]);
    panel.setAttribute("aria-valuetext", `${String(W).replace(".", ",")} ${t.w}`);
    cells.setAttribute("aria-valuetext", `${r.cells} ${t.cellsUnit} (${fmt(r.cells * s.cap)} mAh)`);
    margin.setAttribute("aria-valuetext", `${margin.value} %`);
    for (const k of ["panel", "cells"]) q(`[data-lock="${k}"]`).hidden = st.lock !== k;
    q("[data-bigpanel]").hidden = W < 20;
    if (!r.warn) warn(null);
    else if (r.warn.kind === "summer") warn("panel", t.summer);
    else if (r.warn.kind === "panel") warn("panel", t.panelNeed.replace("{W}", r.warn.value));
    else if (r.warn.kind === "beyond") warn("panel", t.beyond.replace("{W}", r.warn.value));
    else if (r.warn.kind === "nopanel") warn("panel", t.nopanel);
    else warn("cells", t.cellsNeed.replace("{N}", r.warn.value));
    const exp = expectedAt(d, s, r.panelIdx), need = cellsFor(d, s, r.panelIdx);
    const text = need == null || exp == null ? "" : t.result
      .replace("{W}", String(W).replace(".", ",")).replace("{N}", need).replace("{MAH}", fmt(need * s.cap))
      .replace("{EXP}", fmt(exp)).replace("{M}", margin.value)
      + ` ${t.snow.replace("{D}", s.exposed ? d.snow_allowance.days.exposed : d.snow_allowance.days.sheltered)}`
      + (Math.ceil(needAt(d, s, r.panelIdx) / s.cap) < MIN_CELLS ? ` ${t.min}` : "")
      + (d.lat >= 63 ? ` ${t.buried}` : "");
    // The result is a live region: written once the slider rests, not on every step.
    clearTimeout(resultTimer);
    resultTimer = setTimeout(() => { q('[data-out="result"]').textContent = text; }, 400);
  };
  let resultTimer;

  panel.addEventListener("input", () => { st.lock = "panel"; update(); });
  cells.addEventListener("input", () => { st.lock = "cells"; update(); });
  for (const el of [margin, tree, cap]) el.addEventListener("input", update);
  for (const el of form.querySelectorAll('input[type="radio"], #sol-brush, #sol-exposed')) el.addEventListener("change", update);

  showPlace();
  update();
}
