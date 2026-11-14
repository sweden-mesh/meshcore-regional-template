import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { needAt, cellsFor, panelFor, maxCells, couple, SLIDER_PANELS } from "../assets/js/wizard/solar.js";

const data = JSON.parse(readFileSync(new URL("../assets/data/solar-calc.json", import.meta.url)));
const s = (o = {}) => ({ tilt: "vertical", fw: "esm", tree: 20, margin: 0.2, cap: 3000, ...o });
const i10 = data.JKG.panels.indexOf(10);

test("at 10 W the calculator reproduces the published Jönköping table (value × 1.2, to 100)", () => {
  const published = { 0: 500, 10: 4100, 15: 5700, 20: 6800, 30: 9300 }; // vertical, EasySkyMesh
  for (const [tree, mah] of Object.entries(published)) {
    const v = data.JKG.need.vertical.esm[tree][i10][0];
    assert.equal(Math.round((v * 1.2) / 100) * 100, mah, `tree ${tree}`);
  }
  assert.equal(Math.round((data.JKG.need.vertical.official["20"][i10][0] * 1.2) / 100) * 100, 15600);
});
test("cells are sized to the pessimistic value with the margin", () => {
  const high = data.JKG.need.vertical.esm["20"][i10][2];
  assert.equal(needAt(data.JKG, s(), i10), high * 1.2);
  assert.equal(cellsFor(data.JKG, s(), i10), Math.ceil((high * 1.2) / 3000));
  assert.equal(cellsFor(data.JKG, s({ margin: 0 }), i10), Math.ceil(high / 3000));
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
  const floor = data.UME.floor.vertical.official["50"][2];
  assert.equal(panelFor(data.UME, north, 1).noPanel, floor * 1.2 > 3000);
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
