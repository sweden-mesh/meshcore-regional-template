import { effectiveTheme } from "../theme.js";

// MeshMapper coverage: the compact file written at build time
// (layouts/_partials/meshmapper-coverage.html) turned into map polygons.
// A row is [latIdx, lonIdx, kind, eff10, ageDays, type, pings]; a square's south
// edge is latIdx × grid[0] and its west edge lonIdx × grid[1].

export const OLD_DAYS = 90;

// Four bands by MeshMapper's `effective` (0–3, the mean score of the square's pings),
// cut at the measured quartiles of Jönköping's working squares: < 1.0, 1.0–1.75,
// 1.75–2.25, ≥ 2.25. eff10 is effective × 10, rounded.
export function band(eff10) {
  return eff10 < 10 ? 0 : eff10 < 17.5 ? 1 : eff10 < 22.5 ? 2 : 3;
}

const r6 = (x) => Math.round(x * 1e6) / 1e6;

export function toGeoJSON(data) {
  const [dLat, dLon] = data?.grid || [];
  const features = [];
  if (!(dLat > 0 && dLon > 0)) return { type: "FeatureCollection", features };
  for (const [li, lo, kind, eff10, ageDays, type, pings] of data.squares || []) {
    const s = r6(li * dLat), n = r6((li + 1) * dLat), w = r6(lo * dLon), e = r6((lo + 1) * dLon);
    features.push({
      type: "Feature",
      properties: { kind, band: band(eff10), eff10, old: ageDays > OLD_DAYS, ageDays, type: data.types?.[type] ?? "", pings },
      geometry: { type: "Polygon", coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] },
    });
  }
  return { type: "FeatureCollection", features };
}

// Colours (Sprint 15, MMAP-7b): one violet ramp, light to dark on the light basemap and dark
// to light on the dark one, so the most reliable band always stands out most. Violet is free on
// the map: water is blue, woods green, roads and live traffic orange, links red-yellow-green.
// Squares whose newest ping is over 90 days old are drawn fainter. Dead zones (MMAP-D3) are a
// muted-red diagonal hatch with no fill, told apart by shape as well as colour.
export const RAMP = {
  light: ["#a78bfa", "#7c3aed", "#5b21b6", "#2e1065"],
  dark: ["#5b21b6", "#7c3aed", "#a78bfa", "#ddd6fe"],
};
export const HATCH = { light: [168, 72, 64], dark: [214, 120, 110] }; // muted red, RGB
export const OPACITY = { recent: 0.55, old: 0.2 };

// The hatch tile as raw RGBA: "/" lines every 8 px, 2 px wide, seamless when repeated.
export function hatchImage(rgb, ratio = 1) {
  const n = 8 * ratio, data = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x + y) % n >= 2 * ratio) continue;
    data.set([...rgb, 230], (y * n + x) * 4);
  }
  return { width: n, height: n, data };
}

// The layers sit under the region line, the links and the nodes, so the network stays on top.
// Re-run after a style switch (setStyle drops every layer and image).
const ABOVE = ["region-line", "links", "links-selected", "packet-path", "flow-glow", "node-points"];

export function addCoverageLayers(map, data, { visible = false, dead = false, theme = effectiveTheme() } = {}) {
  const ramp = RAMP[theme] || RAMP.light;
  const ratio = Math.max(1, Math.round(globalThis.devicePixelRatio || 1));
  if (!map.hasImage("coverage-hatch")) map.addImage("coverage-hatch", hatchImage(HATCH[theme] || HATCH.light, ratio), { pixelRatio: ratio });
  if (!map.getSource("coverage")) map.addSource("coverage", { type: "geojson", data });
  const before = ABOVE.find((id) => map.getLayer(id));
  if (!map.getLayer("coverage-fill")) {
    map.addLayer({ id: "coverage-fill", type: "fill", source: "coverage", filter: ["==", ["get", "kind"], "w"],
      paint: { "fill-color": ["match", ["get", "band"], 0, ramp[0], 1, ramp[1], 2, ramp[2], ramp[3]],
        "fill-opacity": ["case", ["get", "old"], OPACITY.old, OPACITY.recent], "fill-antialias": false } }, before);
  }
  if (!map.getLayer("coverage-dead")) {
    map.addLayer({ id: "coverage-dead", type: "fill", source: "coverage", filter: ["==", ["get", "kind"], "d"],
      paint: { "fill-pattern": "coverage-hatch", "fill-opacity": ["case", ["get", "old"], 0.4, 1] } }, before);
  }
  map.setLayoutProperty("coverage-fill", "visibility", visible ? "visible" : "none");
  map.setLayoutProperty("coverage-dead", "visibility", visible && dead ? "visible" : "none");
}

// Loads the data the first time the layer is switched on, keeps it, and puts the layer back
// after a style switch. A failed load leaves the toggle on with nothing drawn and is retried
// on the next switch-on.
export function coverageControl(map, url, on) {
  let fc = null, loading = null;
  const ctl = { on, dead: false };
  const draw = () => {
    if (!fc || !map.getStyle()) return;
    try { addCoverageLayers(map, fc, { visible: ctl.on, dead: ctl.dead }); } catch { map.once("idle", draw); }
  };
  ctl.set = async (value) => {
    ctl.on = value;
    if (value && !fc) {
      loading ??= fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))));
      try { fc = toGeoJSON(await loading); } catch (err) { loading = null; console.warn("Coverage not loaded", err); return; }
    }
    draw();
  };
  map.on("style.load", draw);
  if (on) ctl.set(true);
  return ctl;
}
