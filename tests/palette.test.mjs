import { test } from "node:test";
import assert from "node:assert/strict";
import { palette } from "../assets/js/map/palette.js";

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hsl = (h) => {
  const [r, g, b] = rgb(h).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  const l = (mx + mn) / 2, s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  let hue = 0;
  if (d) hue = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  return [(hue + 360) % 360, s, l];
};
// Deuteranopia (Machado et al. 2009, severity 1), on linear RGB.
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const M = [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 1.968881]];
const deut = (h) => { const c = rgb(h).map(lin); return M.map((row) => row.reduce((a, k, i) => a + k * c[i], 0)); };
const dist = (a, b) => Math.hypot(...deut(a).map((v, i) => v - deut(b)[i]));
const chroma = (h) => { const c = deut(h); return Math.max(...c) - Math.min(...c); };
const signals = (p) => [...p.linkRamp, p.nodeActive, p.observer, p.pick, p.hostCover, ...p.routes.filter((c) => c !== "#64748b")];

test("default mode keeps the map's colours, in both themes", () => {
  for (const th of ["light", "dark"]) {
    const p = palette(th, false);
    assert.deepEqual(p.linkRamp, ["#dc2626", "#eab308", "#16a34a"]);
    assert.equal(p.nodeActive, "#2f8a5f");
    assert.equal(p.observer, "#1f5d82");
  }
  assert.deepEqual(palette("light", false).hatch, [168, 72, 64]);
  assert.deepEqual(palette("dark", false).hatch, [214, 120, 110]);
});
test("colour-blind mode has no red or green signal colour", () => {
  for (const th of ["light", "dark"]) {
    for (const c of signals(palette(th, true))) {
      const [h, s] = hsl(c);
      assert.ok(!(s > 0.4 && (h < 15 || h > 345)), `${th} ${c} is red`);
      assert.ok(!(s > 0.3 && h > 75 && h < 165), `${th} ${c} is green`);
    }
    const [h] = hsl("#" + palette(th, true).hatch.map((v) => v.toString(16).padStart(2, "0")).join(""));
    assert.ok(h >= 15 && h <= 60, `${th} dead-zone hatch is orange, not red`);
  }
});
test("colour-blind link ramp: rare and often stay apart under deuteranopia, unlike red/green", () => {
  const before = dist("#dc2626", "#16a34a");
  for (const th of ["light", "dark"]) {
    const [rare, mid, often] = palette(th, true).linkRamp;
    assert.ok(dist(rare, often) > 2 * before, `${th}: ${dist(rare, often).toFixed(3)} vs red/green ${before.toFixed(3)}`);
    assert.ok(dist(rare, mid) > before && dist(mid, often) > before);
  }
});
test("colour-blind mode: active nodes and the observer ring differ from stale grey and each other", () => {
  for (const th of ["light", "dark"]) {
    const p = palette(th, true);
    // Green looks grey-yellow to a deuteranope, so "heard" barely differs in hue from stale grey;
    // the colour-blind active colour keeps its chroma.
    assert.ok(chroma(p.nodeActive) > 2 * chroma("#2f8a5f"), `${th}: ${chroma(p.nodeActive).toFixed(3)}`);
    assert.ok(dist(p.nodeActive, p.observer) > 0.15);
  }
});
test("the theme picks the colour-blind ramp", () => {
  assert.notDeepEqual(palette("light", true).linkRamp, palette("dark", true).linkRamp);
  assert.deepEqual(palette("console-ish", true).linkRamp, palette("light", true).linkRamp);
});
test("the faint grey for other nodes' links follows the theme, not the mode", () => {
  assert.equal(palette("dark", true).linkMuted, palette("dark", false).linkMuted);
  assert.notEqual(palette("dark", false).linkMuted, palette("light", false).linkMuted);
});
