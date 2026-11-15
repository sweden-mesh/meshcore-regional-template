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

// The layer: one fill under the region line, the links and the nodes, so the network stays on
// top. Re-run after a style switch (setStyle drops every layer).
const ABOVE = ["region-line", "links", "links-selected", "packet-path", "flow-glow", "node-points"];

export function addCoverageLayers(map, data, visible) {
  if (!map.getSource("coverage")) map.addSource("coverage", { type: "geojson", data });
  if (!map.getLayer("coverage-fill")) {
    map.addLayer({ id: "coverage-fill", type: "fill", source: "coverage", filter: ["==", ["get", "kind"], "w"],
      paint: { "fill-color": "#2563eb", "fill-opacity": 0.45 } }, ABOVE.find((id) => map.getLayer(id)));
  }
  map.setLayoutProperty("coverage-fill", "visibility", visible ? "visible" : "none");
}

// Loads the data the first time the layer is switched on, keeps it, and puts the layer back
// after a style switch. A failed load leaves the toggle on with nothing drawn and is retried
// on the next switch-on.
export function coverageControl(map, url, on) {
  let fc = null, loading = null;
  const ctl = { on };
  const draw = () => {
    if (!fc || !map.getStyle()) return;
    try { addCoverageLayers(map, fc, ctl.on); } catch { map.once("idle", draw); }
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
