// The node layer: Beacon nodes as a clustered GeoJSON source with one circle
// per node, coloured by type, ringed when the node is an observer, and
// labelled from zoom 12. Pure parts are exported for tests.

export const NODE_TYPES = { 1: "companion", 2: "repeater", 3: "room", 4: "sensor" };

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

// MeshMapper-style: every node is a pill with its short id, no clustering
// (operator, 2026-11-12). Green ring = heard recently, grey = stale, blue =
// observer. Names appear under the pill from zoom 12.
export function addNodeLayers(map, data) {
  addPillImages(map);
  if (map.getSource("nodes")) { map.getSource("nodes").setData(data); return; }
  map.addSource("nodes", { type: "geojson", data });
  const base = ["!", ["has", "point_count"]];
  map.addLayer({ id: "node-points", type: "symbol", source: "nodes", filter: base,
    layout: {
      "icon-image": ["case", ["get", "stale"], "pill-stale", ["get", "observer"], "pill-observer", "pill-active"],
      "icon-text-fit": "both", "icon-text-fit-padding": [2, 6, 2, 6],
      "text-field": ["concat", ["case", ["get", "observer"], "◉ ", ""], ["get", "short"]],
      "text-font": ["Noto Sans Bold"], "text-size": 11,
      "icon-allow-overlap": true, "text-allow-overlap": true,
      "symbol-sort-key": ["case", ["get", "stale"], 2, ["get", "observer"], 0, 1],
    },
    paint: { "text-color": ["case", ["get", "stale"], "#5b6a74", "#0f1d26"],
      "icon-opacity": ["case", ["get", "foreign"], 0.45, 1], "text-opacity": ["case", ["get", "foreign"], 0.45, 1] } });
  map.addLayer({ id: "node-labels", type: "symbol", source: "nodes", minzoom: 12, filter: base,
    layout: { "text-field": ["get", "name"], "text-size": 11, "text-offset": [0, 1.4], "text-anchor": "top",
      "text-font": ["Noto Sans Regular"], "text-optional": true },
    paint: { "text-color": "#0f1d26", "text-halo-color": "#fff", "text-halo-width": 1.5 } });
  map.on("mouseenter", "node-points", () => { map.getCanvas().style.cursor = "pointer"; });
  map.on("mouseleave", "node-points", () => { map.getCanvas().style.cursor = ""; });
}
