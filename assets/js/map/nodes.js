// The node layer: Beacon nodes as a GeoJSON source (no clustering) with one circle
// per node, coloured by type, ringed when the node is an observer, and
// labelled from zoom 12. Pure parts are exported for tests.

export const NODE_TYPES = { 1: "companion", 2: "repeater", 3: "room", 4: "sensor" };

// A live nodeUpdate (Beacon WebSocket) merged into the node list. Per the API
// contract: lat/lng omitted = keep the old position, null = cleared; iatas
// holds only the IATA that heard this advert, so it is merged, not replaced.
export function mergeNodeUpdate(nodes, u) {
  const list = nodes.slice();
  const i = list.findIndex((n) => n.id === u.nodeId);
  const old = i >= 0 ? list[i] : { id: u.nodeId, iatas: [] };
  const next = { ...old, publicKey: u.publicKey ?? old.publicKey, name: u.name ?? old.name,
    nodeType: u.nodeType ?? old.nodeType, isObserver: u.isObserver ?? old.isObserver,
    radio: u.radio ?? old.radio, stale: false, lastSeen: Date.now() };
  if ("possiblyForeign" in u) next.possiblyForeign = u.possiblyForeign;
  if ("lat" in u) next.lat = u.lat;
  if ("lng" in u) next.lng = u.lng;
  const iatas = (old.iatas || []).filter((x) => !(u.iatas || []).some((y) => y.iata === x.iata));
  next.iatas = [...iatas, ...(u.iatas || [])];
  if (i >= 0) list[i] = next; else list.push(next);
  return list;
}

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

// The label every map in the MeshCore world uses: the key's first 3 bytes.
export function shortId(publicKey) {
  return String(publicKey || "").slice(0, 6).toUpperCase();
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
        short: shortId(n.publicKey),
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


// A stretchable rounded pill drawn on a canvas, so the map needs no sprite sheet.
function pillImage(fill, stroke, ratio) {
  const w = 24, h = 20, r = 10, c = document.createElement("canvas");
  c.width = w * ratio; c.height = h * ratio;
  const g = c.getContext("2d");
  g.scale(ratio, ratio);
  g.beginPath(); g.roundRect(1, 1, w - 2, h - 2, r - 1);
  g.fillStyle = fill; g.fill(); g.lineWidth = 1.5; g.strokeStyle = stroke; g.stroke();
  return { width: c.width, height: c.height, data: g.getImageData(0, 0, c.width, c.height).data };
}

const PILLS = {
  "pill-active": ["#ffffff", "#2f8a5f"],
  "pill-stale": ["#eef1f3", "#9aa7b0"],
  "pill-observer": ["#ffffff", "#1f5d82"],
};

function addPillImages(map) {
  const ratio = Math.max(1, Math.round(window.devicePixelRatio || 1));
  for (const [name, [fill, stroke]] of Object.entries(PILLS)) {
    if (map.hasImage(name)) continue;
    const img = pillImage(fill, stroke, ratio);
    map.addImage(name, img, { pixelRatio: ratio, stretchX: [[10 * ratio, 14 * ratio]], stretchY: [[9 * ratio, 11 * ratio]],
      content: [6 * ratio, 3 * ratio, 18 * ratio, 17 * ratio] });
  }
}

// Two layers per node (operator's review, 2026-11-12):
// - node-points: a circle at the node's true position, always drawn. Green =
//   heard recently, grey = stale, blue ring and a centre dot = observer. At or
//   below the zoom where the region fills the map's width ("mini mode", set by
//   setMiniZoom) the circles are all you see.
// - node-pills: the MeshMapper-style pill with the short id, from the mini zoom
//   up. Pills are nudged to a free spot around their dot (variable anchors);
//   one that cannot be placed without overlapping is left out, the dot stays.
export const NODE_LAYERS = ["node-points", "node-obs-dot", "node-pills", "node-labels"];
const COLOR = ["case", ["get", "stale"], "#9aa7b0", "#2f8a5f"];

export function addNodeLayers(map, data) {
  addPillImages(map);
  if (map.getSource("nodes")) { map.getSource("nodes").setData(data); return; }
  map.addSource("nodes", { type: "geojson", data });
  const base = ["!", ["has", "point_count"]];
  map.addLayer({ id: "node-points", type: "circle", source: "nodes", filter: base,
    paint: { "circle-radius": 6, "circle-color": COLOR,
      "circle-stroke-color": ["case", ["get", "observer"], "#1f5d82", "#ffffff"],
      "circle-stroke-width": ["case", ["get", "observer"], 2.5, 1.5],
      "circle-opacity": ["case", ["get", "foreign"], 0.4, 1], "circle-stroke-opacity": ["case", ["get", "foreign"], 0.4, 1] } });
  map.addLayer({ id: "node-obs-dot", type: "circle", source: "nodes", filter: ["all", base, ["get", "observer"]],
    paint: { "circle-radius": 2.2, "circle-color": "#ffffff", "circle-opacity": ["case", ["get", "foreign"], 0.4, 1] } });
  map.addLayer({ id: "node-pills", type: "symbol", source: "nodes", filter: base, minzoom: 9,
    layout: {
      "icon-image": ["case", ["get", "stale"], "pill-stale", ["get", "observer"], "pill-observer", "pill-active"],
      "icon-text-fit": "both", "icon-text-fit-padding": [2, 6, 2, 6],
      "text-field": ["concat", ["case", ["get", "observer"], "◉ ", ""], ["get", "short"]],
      "text-font": ["Noto Sans Bold"], "text-size": 11,
      "text-variable-anchor": ["bottom", "top", "left", "right", "bottom-left", "bottom-right", "top-left", "top-right"],
      "text-radial-offset": 1.1, "text-justify": "auto",
      "icon-allow-overlap": false, "text-allow-overlap": false,
      "symbol-sort-key": ["case", ["get", "observer"], 0, ["get", "stale"], 2, 1],
    },
    paint: { "text-color": ["case", ["get", "stale"], "#5b6a74", "#0f1d26"],
      "icon-opacity": ["case", ["get", "foreign"], 0.45, 1], "text-opacity": ["case", ["get", "foreign"], 0.45, 1] } });
  map.addLayer({ id: "node-labels", type: "symbol", source: "nodes", minzoom: 12, filter: base,
    layout: { "text-field": ["get", "name"], "text-size": 11, "text-offset": [0, 1.4], "text-anchor": "top",
      "text-font": ["Noto Sans Regular"], "text-optional": true },
    paint: { "text-color": "#0f1d26", "text-halo-color": "#fff", "text-halo-width": 1.5 } });
  for (const id of ["node-points", "node-pills"]) {
    map.on("mouseenter", id, () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", id, () => { map.getCanvas().style.cursor = ""; });
  }
}

// Mini mode below the zoom at which the region fills the map's width.
export function setMiniZoom(map, bounds) {
  if (!bounds || !map.getLayer("node-pills")) return null;
  const cam = map.cameraForBounds(bounds, { padding: 0 });
  if (!cam || !Number.isFinite(cam.zoom)) return null;
  const z = cam.zoom + 0.25;
  map.setLayerZoomRange("node-pills", z, 24);
  map.setPaintProperty("node-points", "circle-radius", ["step", ["zoom"], 6, z, 3.5]);
  map.setPaintProperty("node-obs-dot", "circle-radius", ["step", ["zoom"], 2.2, z, 1.2]);
  return z;
}
