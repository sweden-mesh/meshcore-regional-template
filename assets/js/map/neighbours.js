// Neighbour links: which repeaters hear each other directly. Beacon derives
// the edges from adverts, zero-hop receptions, TRACE hops and observers'
// neighbour reports. Modes: "all" (every known edge from the node list),
// "selected" (the clicked node's edges, coloured by how often they were seen),
// "off".
import { validPosition } from "./nodes.js";

const FADE_DAYS = 28;

// One line per unordered pair whose both ends have a position.
export function allLinks(nodes) {
  const byId = new Map((nodes || []).filter(validPosition).map((n) => [n.id, n]));
  const seen = new Set();
  const features = [];
  for (const n of byId.values()) {
    for (const other of n.neighborIds || []) {
      const m = byId.get(other);
      if (!m) continue;
      const key = n.id < m.id ? `${n.id}|${m.id}` : `${m.id}|${n.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      features.push({ type: "Feature", properties: { count: 0, age: 0 },
        geometry: { type: "LineString", coordinates: [[n.lng, n.lat], [m.lng, m.lat]] } });
    }
  }
  return { type: "FeatureCollection", features };
}

// /nodes/{id}/neighbors has one row per neighbour and IATA: fold to one per neighbour.
export function foldNeighbours(rows) {
  const out = new Map();
  for (const r of rows || []) {
    const cur = out.get(r.id);
    if (!cur) { out.set(r.id, { ...r }); continue; }
    cur.observationCount = (cur.observationCount || 0) + (r.observationCount || 0);
    cur.lastSeen = Math.max(cur.lastSeen || 0, r.lastSeen || 0);
    if (Number.isFinite(r.snr) && !(r.snr <= cur.snr)) cur.snr = r.snr;
  }
  return [...out.values()];
}

export function selectedLinks(node, rows, now = Date.now()) {
  if (!validPosition(node)) return { type: "FeatureCollection", features: [] };
  const features = foldNeighbours(rows).filter(validPosition).map((r) => ({
    type: "Feature",
    properties: {
      count: r.observationCount || 0,
      age: Math.min(1, Math.max(0, (now - (r.lastSeen || 0)) / (FADE_DAYS * 86400e3))),
    },
    geometry: { type: "LineString", coordinates: [[node.lng, node.lat], [r.lng, r.lat]] },
  }));
  return { type: "FeatureCollection", features };
}

// ~1 observation red, ~20 yellow, 150+ green (log10 scale); grey when unknown.
const colour = ["case", ["==", ["get", "count"], 0], "#64748b",
  ["interpolate", ["linear"], ["log10", ["max", ["get", "count"], 1]], 0, "#dc2626", 1.3, "#eab308", 2.2, "#16a34a"]];

export function addLinkLayer(map, data) {
  if (map.getSource("links")) { map.getSource("links").setData(data); return; }
  map.addSource("links", { type: "geojson", data });
  map.addLayer({ id: "links", type: "line", source: "links",
    layout: { "line-cap": "round" },
    paint: { "line-color": colour, "line-width": ["case", ["==", ["get", "count"], 0], 1.2, 2.5],
      "line-opacity": ["-", 0.85, ["*", 0.6, ["get", "age"]]] } },
    map.getLayer("node-clusters") ? "node-clusters" : undefined);
}

export class LinkModeControl {
  constructor(labels, mode, onChange) { this.labels = labels; this.mode = mode; this.onChange = onChange; }
  onAdd() {
    const box = document.createElement("label");
    box.className = "maplibregl-ctrl maplibregl-ctrl-group map-toggle";
    const sel = document.createElement("select");
    for (const [value, text] of Object.entries(this.labels.options)) {
      const o = document.createElement("option"); o.value = value; o.textContent = text; sel.append(o);
    }
    sel.value = this.mode;
    sel.addEventListener("change", () => this.onChange(sel.value));
    box.append(this.labels.title, " ", sel);
    this.el = box;
    return box;
  }
  onRemove() { this.el.remove(); }
}
