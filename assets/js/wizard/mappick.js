// Position picker for the wizards: the site's map in "pick" mode. Click or drag
// the pin; nearby repeaters from Beacon are shown so people see where coverage
// already is. Reads the same data attributes as the main map (layouts/_partials/
// mappick.html), and reports lat/lon rounded to 4 decimals (about 10 m).
import { createMap } from "../map/basemap.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, publicNodes } from "../map/nodes.js";
import { loadBorders, unionBbox, addBorderLayers } from "../map/region.js";
import { nodesBounds } from "../map/camera.js";

export const round4 = (x) => Math.round(x * 1e4) / 1e4;

// The picker opens on the region and cannot be zoomed or panned far outside it
// (operator, 2026-11-12): a repeater for this region stands in this region.
export function lockToRegion(map, bounds, slack = 0.15) {
  if (!bounds) return;
  const [[w, s], [e, n]] = bounds;
  const dx = (e - w) * slack, dy = (n - s) * slack;
  const cam = map.cameraForBounds(bounds, { padding: 16 });
  if (!cam) return;
  map.jumpTo(cam);
  map.setMinZoom(cam.zoom);
  map.setMaxBounds([[w - dx, s - dy], [e + dx, n + dy]]);
}

export async function createPicker(el, { onChange = () => {}, initial } = {}) {
  const { map, maplibregl } = await createMap(el);
  el.mapInstance = map;
  const marker = new maplibregl.Marker({ draggable: true, color: "#2f8a5f" });
  const set = (lngLat, notify = true) => {
    marker.setLngLat(lngLat).addTo(map);
    const pos = { lat: round4(lngLat.lat ?? lngLat[1]), lon: round4(lngLat.lng ?? lngLat[0]) };
    if (notify) onChange(pos);
    return pos;
  };
  if (initial && Number.isFinite(initial.lat) && Number.isFinite(initial.lon)) set([initial.lon, initial.lat], false);
  map.on("click", (e) => set(e.lngLat));
  marker.on("dragend", () => set(marker.getLngLat()));
  const ds = el.dataset;
  if (ds.beacon) {
    try {
      const client = createClient(ds.beacon);
      const iatas = JSON.parse(ds.iatas || "[]");
      const [all, borders] = await Promise.all([client.getAll("/nodes", { iatas, limit: 2000 }), loadBorders(client, iatas)]);
      const nodes = publicNodes(all).filter((n) => n.nodeType === 2);
      const add = () => {
        addBorderLayers(map, borders);
        map.addSource("nodes", { type: "geojson", data: nodesToGeoJSON(nodes) });
        map.addLayer({ id: "pick-nodes", type: "circle", source: "nodes",
          paint: { "circle-radius": 4, "circle-color": "#2f8a5f", "circle-stroke-color": "#fff", "circle-stroke-width": 1.5, "circle-opacity": 0.8 } });
        lockToRegion(map, unionBbox(borders) || nodesBounds(nodes));
      };
      if (map.isStyleLoaded()) add(); else map.once("load", add);
    } catch { /* the picker works without the repeaters */ }
  }
  return { map, set: (lat, lon) => set([lon, lat]), get: () => { const p = marker.getLngLat(); return p ? { lat: round4(p.lat), lon: round4(p.lng) } : null; } };
}
