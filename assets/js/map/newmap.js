// The new-repeaters page's map (B-362): the nodes in data-nodes (the build's list) on the site's
// basemap, one dot each, an observer ringed as on the main map; a click shows its name and the day it
// was first heard. No Beacon calls: the list is the build's.
import { createMap } from "./basemap.js";
import { nodesBounds } from "./camera.js";
import { palette } from "./palette.js";

export function toGeoJSON(nodes) {
  return {
    type: "FeatureCollection",
    features: (nodes || []).filter((n) => Number.isFinite(n.lat) && Number.isFinite(n.lng)).map((n, i) => ({
      type: "Feature", id: i, geometry: { type: "Point", coordinates: [n.lng, n.lat] },
      properties: { name: n.name || "", short: (n.publicKey || "").slice(0, 6).toUpperCase(), first: n.first || "", observer: !!n.isObserver },
    })),
  };
}

async function start(el) {
  const ds = el.dataset;
  const nodes = JSON.parse(ds.nodes || "[]");
  const { map, maplibregl } = await createMap(el);
  const add = () => {
    if (map.getSource("new")) return;
    const p = palette();
    map.addSource("new", { type: "geojson", data: toGeoJSON(nodes) });
    map.addLayer({ id: "new-nodes", type: "circle", source: "new", paint: {
      "circle-radius": 6, "circle-color": p.nodeActive,
      "circle-stroke-color": ["case", ["get", "observer"], p.observer, "#ffffff"],
      "circle-stroke-width": ["case", ["get", "observer"], 3, 1.5] } });
  };
  map.on("style.load", add);
  if (map.isStyleLoaded()) add();
  const b = nodesBounds(nodes);
  if (b) map.fitBounds(b, { padding: 40, maxZoom: 11, duration: 0 });
  else if (nodes[0]) map.jumpTo({ center: [nodes[0].lng, nodes[0].lat], zoom: 9 });
  map.on("click", "new-nodes", (e) => {
    const f = e.features[0].properties;
    const div = document.createElement("div");
    const b = document.createElement("strong"); b.textContent = f.name || f.short;
    const s = document.createElement("span"); s.textContent = ` ${f.short}`; s.className = "node-short";
    const p = document.createElement("p"); p.textContent = `${ds.first}: ${f.first}${f.observer ? ` · ${ds.observer}` : ""}`;
    div.append(b, s, p);
    new maplibregl.Popup({ closeButton: true }).setLngLat(e.lngLat).setDOMContent(div).addTo(map);
  });
  map.on("mouseenter", "new-nodes", () => { map.getCanvas().style.cursor = "pointer"; });
  map.on("mouseleave", "new-nodes", () => { map.getCanvas().style.cursor = ""; });
}

const el = typeof document !== "undefined" && document.querySelector(".map-new");
if (el) start(el).catch((e) => console.warn("map unavailable", e));
