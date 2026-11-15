import { effectiveTheme } from "../theme.js";
import { t } from "./texts.js";
import { escapeHtml } from "./popup.js";

// Places wanted for new repeaters (params.wanted, backlog B-285): a circle of about 1 km
// across, in real metres so it grows with the zoom, and a small star at its centre. The list
// comes from the build as JSON (layouts/_partials/wanted.html): [{ name, lat, lon, note }],
// the note as plain text.

export const RADIUS_M = 500;
const R = 6371008.8; // mean Earth radius, metres

// A geodesic circle (on the sphere) of `m` metres around (lat, lon): a closed ring of `steps`
// points, each at the true distance from the centre.
export function circleRingM(lat, lon, m, steps = 64) {
  const r = Math.PI / 180, d = m / R, p1 = lat * r, l1 = lon * r, ring = [];
  for (let i = 0; i <= steps; i++) {
    const b = (2 * Math.PI * (i % steps)) / steps;
    const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
    const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
    ring.push([Math.round((l2 / r) * 1e6) / 1e6, Math.round((p2 / r) * 1e6) / 1e6]);
  }
  return ring;
}

// The places with a name and a usable position; anything else is left out.
export function validPlaces(list) {
  return (Array.isArray(list) ? list : []).filter((p) => p && typeof p.name === "string" && p.name.trim()
    && Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180);
}

// Two collections from one list: the areas (polygons) and their centres (points, for the star).
export function wantedGeoJSON(list, m = RADIUS_M) {
  const places = validPlaces(list);
  const props = (p) => ({ name: p.name, note: typeof p.note === "string" ? p.note : "" });
  return {
    areas: { type: "FeatureCollection", features: places.map((p) => ({ type: "Feature", properties: props(p),
      geometry: { type: "Polygon", coordinates: [circleRingM(p.lat, p.lon, m)] } })) },
    centres: { type: "FeatureCollection", features: places.map((p) => ({ type: "Feature", properties: props(p),
      geometry: { type: "Point", coordinates: [p.lon, p.lat] } })) },
  };
}

export function wantedPopupHtml(p) {
  const note = p.note ? `<p>${escapeHtml(p.note)}</p>` : "";
  return `<div class="node-popup"><h3>${escapeHtml(p.name)}</h3><p class="np-type">${escapeHtml(t("want_popup"))}</p>${note}</div>`;
}

export function wantedLegend() {
  return [{ swatch: "wanted", label: t("lg_wanted"), when: ["want"] }];
}

// Amber, free on the map (coverage is violet, the region and water blue, nodes green); the
// star is gold with a dark brown edge, so it reads on both basemaps.
export const COLORS = {
  light: { fill: "#d97706", fillOpacity: 0.16, line: "#b45309" },
  dark: { fill: "#fbbf24", fillOpacity: 0.14, line: "#fcd34d" },
};
export const STAR = { fill: [251, 191, 36], edge: [92, 51, 0] };
export const STAR_PX = 16;

// A five-pointed star as raw RGBA, `px` × ratio square: gold fill, a 1.5 px dark edge,
// edges smoothed by 4 × 4 samples per pixel.
export function starImage(px = STAR_PX, ratio = 1, { fill, edge } = STAR) {
  const n = Math.round(px * ratio), c = n / 2, ro = n / 2 - 0.5 * ratio, ri = ro * 0.45, w = 1.5 * ratio;
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? ri : ro;
    pts.push([c + rr * Math.cos(a), c + rr * Math.sin(a) + 0.06 * n]); // nudged down: optical centre
  }
  const inside = (x, y) => {
    let k = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) k = !k;
    }
    return k;
  };
  const edgeDist = (x, y) => {
    let best = Infinity;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [ax, ay] = pts[j], [bx, by] = pts[i], dx = bx - ax, dy = by - ay;
      const u = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
      best = Math.min(best, Math.hypot(x - ax - u * dx, y - ay - u * dy));
    }
    return best;
  };
  const data = new Uint8Array(n * n * 4), S = 4;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let f = 0, e = 0;
    for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
      const X = x + (sx + 0.5) / S, Y = y + (sy + 0.5) / S;
      if (!inside(X, Y)) continue;
      if (edgeDist(X, Y) < w) e++; else f++;
    }
    const a = (f + e) / (S * S);
    if (!a) continue;
    const mix = e / (f + e);
    const rgb = fill.map((v, i) => Math.round(v * (1 - mix) + edge[i] * mix));
    data.set([...rgb, Math.round(a * 255)], (y * n + x) * 4);
  }
  return { width: n, height: n, data };
}

// Above the coverage and the region fill, under the links, the routes and the nodes.
const ABOVE = ["links", "links-selected", "packet-path", "flow-glow", "node-points", "pick-nodes"];
export const LAYERS = ["wanted-area", "wanted-line", "wanted-star"];

export function addWantedLayers(map, gj, { visible = false, theme = effectiveTheme() } = {}) {
  const c = COLORS[theme] || COLORS.light;
  const ratio = Math.max(1, Math.round(globalThis.devicePixelRatio || 1));
  if (!map.hasImage("wanted-star")) map.addImage("wanted-star", starImage(STAR_PX, ratio), { pixelRatio: ratio });
  if (!map.getSource("wanted-area")) map.addSource("wanted-area", { type: "geojson", data: gj.areas });
  if (!map.getSource("wanted-centre")) map.addSource("wanted-centre", { type: "geojson", data: gj.centres });
  const before = ABOVE.find((id) => map.getLayer(id));
  if (!map.getLayer("wanted-area")) {
    map.addLayer({ id: "wanted-area", type: "fill", source: "wanted-area",
      paint: { "fill-color": c.fill, "fill-opacity": c.fillOpacity } }, before);
  }
  if (!map.getLayer("wanted-line")) {
    map.addLayer({ id: "wanted-line", type: "line", source: "wanted-area",
      paint: { "line-color": c.line, "line-width": 1.5, "line-opacity": 0.9 } }, before);
  }
  if (!map.getLayer("wanted-star")) {
    map.addLayer({ id: "wanted-star", type: "symbol", source: "wanted-centre",
      layout: { "icon-image": "wanted-star", "icon-allow-overlap": true, "icon-ignore-placement": true } }, before);
  }
  for (const id of LAYERS) map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
}

// Draws the places, keeps them through a style switch (dark mode drops every layer and image)
// and, with popups, opens one naming the place on a click, unless a node is under the pointer.
const NODE_LAYERS = ["node-points", "node-pills"];

export function wantedControl(map, maplibregl, list, { on = false, popups = true, onChange = () => {} } = {}) {
  const gj = wantedGeoJSON(list);
  const ctl = { on, count: gj.centres.features.length };
  const draw = () => {
    try { if (map.getStyle()) addWantedLayers(map, gj, { visible: ctl.on }); } catch { map.once("idle", draw); }
  };
  ctl.set = (value) => { ctl.on = value; onChange(ctl); draw(); };
  if (popups) {
    let popup = null;
    map.on("click", (e) => {
      if (!ctl.on || !map.getLayer("wanted-area")) return;
      const nodes = NODE_LAYERS.filter((l) => map.getLayer(l));
      if (nodes.length && map.queryRenderedFeatures(e.point, { layers: nodes }).length) return;
      const f = map.queryRenderedFeatures(e.point, { layers: ["wanted-star", "wanted-area"] })[0];
      if (!f) return;
      popup?.remove();
      popup = new maplibregl.Popup({ maxWidth: "18rem", closeButton: true })
        .setLngLat(f.geometry.type === "Point" ? f.geometry.coordinates : e.lngLat).setHTML(wantedPopupHtml(f.properties)).addTo(map);
    });
    for (const id of ["wanted-area", "wanted-star"]) {
      map.on("mouseenter", id, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", id, () => { map.getCanvas().style.cursor = ""; });
    }
  }
  map.on("style.load", draw);
  draw();
  return ctl;
}
