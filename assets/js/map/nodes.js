// The node layer: Beacon nodes as a clustered GeoJSON source with one circle
// per node, coloured by type, ringed when the node is an observer, and
// labelled from zoom 12. Pure parts are exported for tests.

export const NODE_TYPES = { 1: "companion", 2: "repeater", 3: "room", 4: "sensor" };
export const TYPE_COLOURS = { 1: "#7b61ff", 2: "#0b6bcb", 3: "#c2410c", 4: "#15803d" };

// Beacon uses 0/0 for "no position"; anything non-finite or out of range is junk too.
export function validPosition(n) {
  const lat = n?.lat, lng = n?.lng;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Companions (nodeType 1) are people's handsets; their advertised position can
// be a home. They are left out unless the site opts in (params.map.companions).
export function publicNodes(nodes, { companions = false } = {}) {
  return (nodes || []).filter((n) => companions || n.nodeType !== 1);
}

export function nodesToGeoJSON(nodes) {
  const features = [];
  for (const n of nodes || []) {
    if (!validPosition(n)) continue;
    features.push({
      type: "Feature",
      id: features.length,
      geometry: { type: "Point", coordinates: [n.lng, n.lat] },
      properties: {
        id: n.id,
        name: n.name || "",
        nodeType: n.nodeType || 0,
        observer: !!n.isObserver,
        foreign: !!n.possiblyForeign,
        stale: !!n.stale,
        lastSeen: n.lastSeen || 0,
      },
    });
  }
  return { type: "FeatureCollection", features };
}

const colourExpr = ["match", ["get", "nodeType"],
  1, TYPE_COLOURS[1], 2, TYPE_COLOURS[2], 3, TYPE_COLOURS[3], 4, TYPE_COLOURS[4], "#6b7280"];

export function addNodeLayers(map, data) {
  if (map.getSource("nodes")) { map.getSource("nodes").setData(data); return; }
  map.addSource("nodes", { type: "geojson", data, cluster: true, clusterRadius: 36, clusterMaxZoom: 11 });
  map.addLayer({ id: "node-clusters", type: "circle", source: "nodes", filter: ["has", "point_count"],
    paint: { "circle-color": TYPE_COLOURS[2], "circle-opacity": 0.85,
      "circle-radius": ["step", ["get", "point_count"], 14, 10, 18, 30, 24],
      "circle-stroke-color": "#fff", "circle-stroke-width": 2 } });
  map.addLayer({ id: "node-cluster-count", type: "symbol", source: "nodes", filter: ["has", "point_count"],
    layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12, "text-font": ["Noto Sans Bold"] },
    paint: { "text-color": "#fff" } });
  map.addLayer({ id: "node-points", type: "circle", source: "nodes", filter: ["!", ["has", "point_count"]],
    paint: { "circle-color": colourExpr, "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 4, 12, 7],
      "circle-opacity": ["case", ["get", "foreign"], 0.35, ["get", "stale"], 0.55, 1],
      "circle-stroke-color": ["case", ["get", "observer"], "#facc15", "#ffffff"],
      "circle-stroke-width": ["case", ["get", "observer"], 3, 1.5] } });
  map.addLayer({ id: "node-labels", type: "symbol", source: "nodes", minzoom: 12, filter: ["!", ["has", "point_count"]],
    layout: { "text-field": ["get", "name"], "text-size": 12, "text-offset": [0, 1.1], "text-anchor": "top",
      "text-font": ["Noto Sans Regular"], "text-optional": true },
    paint: { "text-color": "#111", "text-halo-color": "#fff", "text-halo-width": 1.5 } });
  map.on("click", "node-clusters", (e) => {
    const f = e.features[0];
    map.getSource("nodes").getClusterExpansionZoom(f.properties.cluster_id)
      .then((z) => map.easeTo({ center: f.geometry.coordinates, zoom: z }));
  });
  for (const id of ["node-clusters", "node-points"]) {
    map.on("mouseenter", id, () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", id, () => { map.getCanvas().style.cursor = ""; });
  }
}
