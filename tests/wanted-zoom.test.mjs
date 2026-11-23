// B-382: the wanted places' layers follow the switch and the zoom rule (the Sverige map shows them
// only from a zoom and closer), and keep both through a redraw.
import test from "node:test";
import assert from "node:assert/strict";
import { wantedControl, wantedGeoJSON, LAYERS } from "../assets/js/map/wanted.js";

function fakeMap() {
  const layers = new Map(), handlers = {};
  return { layers, handlers,
    getStyle: () => ({}), hasImage: () => true, addImage() {}, getSource: () => true, addSource() {},
    getLayer: (id) => layers.get(id), addLayer: (l) => layers.set(l.id, { visibility: "visible", min: 0, max: 24 }),
    setLayoutProperty: (id, k, v) => { layers.get(id)[k] = v; }, setLayerZoomRange: (id, min, max) => Object.assign(layers.get(id), { min, max }),
    on: (name, a, b) => { (handlers[name] ||= []).push(b || a); }, once() {}, getCanvas: () => ({ style: {} }) };
}
const places = [{ name: "Gränna", lat: 58.02, lon: 14.46, note: "x" }];

test("a region's map: shown from the start at every zoom; switched off hides them", () => {
  const map = fakeMap();
  const ctl = wantedControl(map, {}, places, { on: true, popups: false });
  for (const id of LAYERS) assert.deepEqual(map.layers.get(id), { visibility: "visible", min: 0, max: 24 }, id);
  ctl.set(false);
  for (const id of LAYERS) assert.equal(map.layers.get(id).visibility, "none");
});

test("the Sverige map: off from the start, and when on only from zoom 7 and closer", () => {
  const map = fakeMap();
  const ctl = wantedControl(map, {}, places, { on: false, popups: false, minZoom: 7 });
  for (const id of LAYERS) assert.deepEqual(map.layers.get(id), { visibility: "none", min: 7, max: 24 }, id);
  ctl.set(true);
  for (const id of LAYERS) assert.deepEqual(map.layers.get(id), { visibility: "visible", min: 7, max: 24 }, id);
});

test("a county's map switched to the whole country and back changes the zoom rule, and a redraw keeps it", () => {
  const map = fakeMap();
  const ctl = wantedControl(map, {}, places, { on: true, popups: false });
  ctl.setMinZoom(7);
  assert.equal(map.layers.get("wanted-star").min, 7);
  for (const fn of map.handlers["style.load"]) fn();
  assert.equal(map.layers.get("wanted-area").min, 7);
  ctl.setMinZoom(0);
  assert.equal(map.layers.get("wanted-line").min, 0);
  assert.equal(wantedGeoJSON(places).centres.features.length, 1);
});
