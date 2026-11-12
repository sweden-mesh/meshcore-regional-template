// The region's outline from Beacon (/iatas/{iata}/border, GeoJSON Feature
// with a bbox; 204 when the IATA has none) and the toggle for nodes that are
// heard here but probably located elsewhere (possiblyForeign).
import { bboxToBounds, frameRegion } from "./camera.js";

// Union of the borders' bboxes, so a multi-IATA region frames all of them.
export function unionBbox(features) {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const f of features) {
    const b = bboxToBounds(f?.bbox);
    if (!b) continue;
    w = Math.min(w, b[0][0]); s = Math.min(s, b[0][1]);
    e = Math.max(e, b[1][0]); n = Math.max(n, b[1][1]);
  }
  return Number.isFinite(w) ? [[w, s], [e, n]] : null;
}

export async function loadBorders(client, iatas) {
  const results = await Promise.allSettled(iatas.map((i) => client.get(`/iatas/${encodeURIComponent(i)}/border`)));
  return results.filter((r) => r.status === "fulfilled" && r.value?.geometry).map((r) => r.value);
}

export function addBorderLayers(map, features) {
  const data = { type: "FeatureCollection", features };
  if (map.getSource("region-border")) { map.getSource("region-border").setData(data); return; }
  const before = map.getLayer("node-points") ? "node-points" : undefined;
  map.addSource("region-border", { type: "geojson", data });
  map.addLayer({ id: "region-fill", type: "fill", source: "region-border",
    paint: { "fill-color": "#0b6bcb", "fill-opacity": 0.05 } }, before);
  map.addLayer({ id: "region-line", type: "line", source: "region-border",
    paint: { "line-color": "#0b6bcb", "line-width": 1.5, "line-dasharray": [3, 2], "line-opacity": 0.7 } }, before);
}

export function frameBorders(map, features) {
  frameRegion(map, unionBbox(features));
}

export function setForeignVisible(map, visible) {
  for (const id of ["node-points", "node-labels"]) {
    if (!map.getLayer(id)) continue;
    const base = ["!", ["has", "point_count"]];
    map.setFilter(id, visible ? base : ["all", base, ["!", ["get", "foreign"]]]);
  }
}
