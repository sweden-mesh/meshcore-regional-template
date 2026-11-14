import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { needAt, cellsFor, panelFor, maxCells, couple, SLIDER_PANELS, MIN_CELLS } from "../assets/js/wizard/solar.js";

const data = JSON.parse(readFileSync(new URL("../assets/data/solar-calc.json", import.meta.url)));
const s = (o = {}) => ({ tilt: "vertical", fw: "esm", tree: 20, margin: 0.2, cap: 3000, ...o });
const i10 = data.JKG.panels.indexOf(10);

test("at 10 W the data reproduce the solar session's Jönköping preview (value × 1.5, rounded up to 100)", () => {
  const up = (x) => Math.ceil((x * 1.5) / 100) * 100;
  const preview = { 0: [800, 600, 1300], 10: [6200, 4100, 9600], 20: [10400, 6400, 22100], 30: [14700, 9500, 29800] };
  for (const [tree, row] of Object.entries(preview))
    assert.deepEqual(data.JKG.need.vertical.esm[tree][i10].map(up), row, `tree ${tree}`);
  assert.equal(up(data.JKG.need.vertical.official["20"][i10][0]), 23200);
  assert.equal(data.JKG.setpoint_V, 5.0);
});
test("the snow allowance is added before the margin; exposed sites get more days", () => {
  const e = data.JKG.need.vertical.esm["20"][i10];
  const high = Math.max(e[0], e[2]);
  const sheltered = 2 * 153.5, exposed = 4 * 153.5;
  assert.ok(Math.abs(needAt(data.JKG, s(), i10) - (high + sheltered) * 1.2) < 1e-6);
  assert.ok(Math.abs(needAt(data.JKG, s({ exposed: true }), i10) - (high + exposed) * 1.2) < 1e-6);
  assert.ok(needAt(data.BLE, s({ exposed: true }), i10) - needAt(data.BLE, s(), i10) > 0);
});
test("cells are sized to the pessimistic value with the margin", () => {
  const e = data.JKG.need.vertical.esm["20"][i10];
  const high = Math.max(e[0], e[2]) + 2 * 153.5;
  assert.ok(Math.abs(needAt(data.JKG, s(), i10) - high * 1.2) < 1e-6);
  assert.equal(cellsFor(data.JKG, s(), i10), Math.ceil((high * 1.2) / 3000));
  assert.equal(cellsFor(data.JKG, s({ margin: 0 }), i10), Math.max(2, Math.ceil(high / 3000)));
  assert.ok(cellsFor(data.JKG, s({ cap: 1500 }), i10) > cellsFor(data.JKG, s(), i10));
});
test("a panel that cannot refill even in summer gives no cell count", () => {
  const i1 = data.LLA.panels.indexOf(1);
  assert.equal(cellsFor(data.LLA, s({ fw: "official", tree: 50 }), i1), null);
  const r = couple(data.LLA, s({ fw: "official", tree: 50 }), { lock: "panel", panelIdx: i1, cells: 3, max: 30 });
  assert.equal(r.warn.kind, "summer");
});
test("the panel that follows a cell count is the smallest one that is enough", () => {
  const cells = cellsFor(data.JKG, s(), i10);
  const r = panelFor(data.JKG, s(), cells);
  assert.ok(r.i <= i10);
  assert.ok(needAt(data.JKG, s(), r.i) <= cells * 3000);
  if (r.i > 0) assert.ok(needAt(data.JKG, s(), r.i - 1) == null || needAt(data.JKG, s(), r.i - 1) > cells * 3000);
});
test("past the slider's end: a panel beyond 100 W is named; past 300 W the floor decides", () => {
  const north = s({ fw: "official", tree: 50 });
  const r = couple(data.UME, north, { lock: "cells", panelIdx: 2, cells: 1, max: 30 });
  assert.equal(r.panelIdx, SLIDER_PANELS.length - 1);
  assert.ok(["panel", "nopanel", "beyond"].includes(r.warn.kind));
  const floor = (data.UME.floor.vertical.official["50"][2] + 5 * 242.1) * 1.2;
  assert.equal(panelFor(data.UME, north, 2).noPanel, floor > 6000);
});
test("too many cells for the slider: the slider stops at max and says how many", () => {
  const r = couple(data.JKG, s({ fw: "official", tree: 50 }), { lock: "panel", panelIdx: i10, cells: 3, max: 5 });
  assert.equal(r.cells, 5);
  assert.equal(r.warn.kind, "cells");
  assert.ok(r.warn.value > 5);
});
test("the cell slider reaches higher in the north", () => {
  assert.ok(maxCells(data.UME) > maxCells(data.MMX));
  assert.ok(maxCells(data.MMX) >= 10);
});

test("never fewer than two cells, even where the model needs less than one", () => {
  const i5 = data.JKG.panels.indexOf(5);
  assert.ok(needAt(data.JKG, s({ tree: 0 }), i5) < 3000);
  assert.equal(cellsFor(data.JKG, s({ tree: 0 }), i5), MIN_CELLS);
  assert.equal(MIN_CELLS, 2);
});

test("the smallest panels: 0.15 W never keeps up, the slider starts there and holds 10 W by default", () => {
  assert.deepEqual(SLIDER_PANELS.slice(0, 5), [0.15, 0.5, 1, 1.5, 3]);
  for (const [code, d] of Object.entries(data)) {
    const i = d.panels.indexOf(0.15);
    for (const tilt of ["vertical", "tilt60", "tilt40"]) for (const fw of ["esm", "official"])
      for (const tree of [0, 10, 15, 20, 30, 50])
        assert.equal(cellsFor(d, s({ tilt, fw, tree }), i), null, `${code} ${tilt} ${fw} ${tree}`);
  }
  const r = couple(data.JKG, s({ tree: 0 }), { lock: "panel", panelIdx: data.JKG.panels.indexOf(0.15), cells: 3, max: 19 });
  assert.equal(r.warn.kind, "summer");
  assert.equal(SLIDER_PANELS.indexOf(10), 6);
});

test("sized to the larger of central and high; null when either is null (solar-013 note 1)", () => {
  let checked = 0;
  for (const d of Object.values(data)) for (const tilt of Object.keys(d.need)) for (const fw of Object.keys(d.need[tilt]))
    for (const tree of Object.keys(d.need[tilt][fw])) d.need[tilt][fw][tree].forEach((e, i) => {
      const n = needAt(d, s({ tilt, fw, tree: Number(tree), margin: 0 }), i);
      if (!e || e[0] == null || e[2] == null) { assert.equal(n, null); return; }
      assert.ok(n >= Math.max(e[0], e[2]));
      checked++;
    });
  assert.ok(checked > 1000);
  // the one case with central null but high finite: Halland, vertical, official, 10°, 0.5 W
  const i05 = data.HAD.panels.indexOf(0.5);
  assert.equal(needAt(data.HAD, s({ fw: "official", tree: 10 }), i05), null);
});
