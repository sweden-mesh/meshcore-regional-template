// Position picker for the wizards: the site's map in "pick" mode. Click or drag
// the pin; nearby repeaters from Beacon are shown so people see where coverage
// already is. Reads the same data attributes as the main map (layouts/_partials/
// mappick.html), and reports lat/lon rounded to 4 decimals (about 10 m).
import { createMap } from "../map/basemap.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, publicNodes } from "../map/nodes.js";

export const round4 = (x) => Math.round(x * 1e4) / 1e4;

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
      const nodes = publicNodes(await createClient(ds.beacon).getAll("/nodes", { iatas: JSON.parse(ds.iatas || "[]"), limit: 2000 }));
      const add = () => {
        map.addSource("nodes", { type: "geojson", data: nodesToGeoJSON(nodes.filter((n) => n.nodeType === 2)) });
        map.addLayer({ id: "pick-nodes", type: "circle", source: "nodes",
          paint: { "circle-radius": 4, "circle-color": "#2f8a5f", "circle-stroke-color": "#fff", "circle-stroke-width": 1.5, "circle-opacity": 0.8 } });
      };
      if (map.isStyleLoaded()) add(); else map.once("load", add);
    } catch { /* the picker works without the repeaters */ }
  }
  return { map, set: (lat, lon) => set([lon, lat]), get: () => { const p = marker.getLngLat(); return p ? { lat: round4(p.lat), lon: round4(p.lng) } : null; } };
}
