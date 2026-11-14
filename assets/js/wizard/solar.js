// The solar calculator's arithmetic (operator 2026-11-14, backlog B-259/B-260). Pure: takes one
// county's entry from assets/data/solar-calc.json (the solar session's model v2, charger at 5.0 V,
// sha256 6d7b57f2…9b2d) and
// the visitor's settings. Never scales across counties and never extrapolates past the model's
// panel sizes. Battery needs are mAh WITHOUT margin as [value, low, high]; null = no battery is
// enough with that panel (it cannot refill even in summer). Cells are sized to the HIGH value.

export const SLIDER_PANELS = [1, 5, 10, 15, 20, 25, 30, 40, 50, 100]; // W, real output in full sun
export const TREES = [0, 10, 15, 20, 30, 50];                          // degrees; 0 = terrain only
export const DEFAULT_PANEL = 10;                                         // the Clas Ohlson panel
// Never fewer than 2 cells (operator 2026-11-14): the guide's charger gives up to 2 A and a Biltema
// cell takes 1.5 A, so one cell alone is charged beyond its rating.
export const MIN_CELLS = 2;

// s = { tilt: "vertical"|"tilt60"|"tilt40", fw: "esm"|"official", tree: 0..50, margin: 0..1,
//       cap: mAh per cell, exposed: true for an exposed hilltop (more snow and rime days) }
const entry = (d, s, i) => d?.need?.[s.tilt]?.[s.fw]?.[String(s.tree)]?.[i] ?? null;

// Snow and frost on the panel: days of zero harvest × the daily load through the derates (the
// solar session's allowance, added before the margin). Sheltered unless the visitor says exposed.
export function snowAllowance(d, s) {
  const a = d?.snow_allowance;
  if (!a) return 0;
  return (s.exposed ? a.days.exposed : a.days.sheltered) * (a.per_day_mAh[s.fw] ?? 0);
}
const withMargin = (d, s, x) => (x == null ? null : (x + snowAllowance(d, s)) * (1 + s.margin));

// The pessimistic need for panel index i, snow and margin included; null if no battery is enough.
export function needAt(d, s, i) {
  const e = entry(d, s, i);
  return withMargin(d, s, e ? e[2] : null);
}
// The expected need (the model's middle value), snow and margin included, for the summary line.
export function expectedAt(d, s, i) {
  const e = entry(d, s, i);
  return withMargin(d, s, e ? e[0] : null);
}

// Cells needed with panel index i: a whole number ≥ MIN_CELLS, or null (no battery is enough).
export function cellsFor(d, s, i) {
  const n = needAt(d, s, i);
  return n == null ? null : Math.max(MIN_CELLS, Math.ceil(n / s.cap));
}

// The smallest panel that is enough for `cells` cells. Returns { i } (an index into d.panels; it
// may lie beyond the slider, which only covers the first SLIDER_PANELS.length sizes), or
// { i: null, noPanel } where noPanel = even an unlimited panel is not enough (the floor).
export function panelFor(d, s, cells) {
  const have = cells * s.cap;
  for (let i = 0; i < d.panels.length; i++) {
    const n = needAt(d, s, i);
    if (n != null && n <= have) return { i };
  }
  const f = d?.floor?.[s.tilt]?.[s.fw]?.[String(s.tree)];
  const floor = withMargin(d, s, f ? f[2] : null);
  return { i: null, noPanel: floor != null && floor > have };
}

// The cell slider's maximum for a county (operator: "for the northern parts, make the sliders max
// higher"): enough cells for its worst case with the 10 W panel and tree lines up to 30°, at the
// pessimistic value, an exposed site's snow days and the default 50 % margin; never below 10.
// Cases beyond (50° trees, official firmware behind high trees) get the red "kräver N celler".
export function maxCells(d, cap = 3000) {
  const i = d.panels.indexOf(DEFAULT_PANEL);
  let worst = 0;
  for (const tilt of Object.keys(d.need)) for (const fw of Object.keys(d.need[tilt]))
    for (const tree of Object.keys(d.need[tilt][fw])) {
      if (Number(tree) > 30) continue;
      const e = d.need[tilt][fw][tree][i];
      if (e && e[2] != null) worst = Math.max(worst, e[2] + snowAllowance(d, { fw, exposed: true }));
    }
  return Math.max(10, Math.ceil((worst * 1.5) / cap));
}

// Coupling: the slider touched last stays; the other follows. Returns the new slider values and a
// warning for the one that could not follow ({ on: "panel"|"cells", kind, value }).
export function couple(d, s, { lock, panelIdx, cells, max }) {
  if (lock === "cells") {
    const r = panelFor(d, s, cells);
    if (r.i != null && r.i < SLIDER_PANELS.length) return { panelIdx: r.i, cells, warn: null };
    const last = SLIDER_PANELS.length - 1;
    if (r.i != null) return { panelIdx: last, cells, warn: { on: "panel", kind: "panel", value: d.panels[r.i] } };
    return { panelIdx: last, cells, warn: { on: "panel", kind: r.noPanel ? "nopanel" : "beyond", value: d.panels[d.panels.length - 1] } };
  }
  const c = cellsFor(d, s, panelIdx);
  if (c == null) return { panelIdx, cells, warn: { on: "panel", kind: "summer", value: null } };
  if (c > max) return { panelIdx, cells: max, warn: { on: "cells", kind: "cells", value: c } };
  return { panelIdx, cells: c, warn: null };
}
