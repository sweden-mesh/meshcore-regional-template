// "Bli nodvärd: testa din plats" (backlog B-276, operator interview 2026-11-14). Pure logic: the
// coverage blob, where a spot lies relative to it, and what the answers say about the site. The
// page (host-ui.js) only wires the DOM. The result lists strengths and tips, never a grade:
// every repeater helps.
import { distanceKm } from "./neighbours.js";

export const DEFAULT_EDGE_KM = 2;
const R = 6371;

export function kmBetween(lat1, lon1, lat2, lon2) {
  const r = Math.PI / 180, dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// The nearest repeater's distance in km, or Infinity when there is none.
export function nearestKm(lat, lon, repeaters) {
  let best = Infinity;
  for (const n of repeaters || []) best = Math.min(best, kmBetween(lat, lon, n.lat, n.lng));
  return best;
}

// A circle of radius km around (lat, lon) as a closed GeoJSON ring of `steps` points.
export function circleRing(lat, lon, km, steps = 48) {
  const dLat = (km / R) * (180 / Math.PI), dLon = dLat / Math.cos((lat * Math.PI) / 180);
  const ring = [];
  for (let i = 0; i <= steps; i++) {
    const a = (2 * Math.PI * i) / steps;
    ring.push([lon + dLon * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return ring;
}

// Today's coverage, until MeshMapper data exists: a circle of `km` around every repeater
// (operator: "a circle for each repeater 2km radius, any place outside any of those circles
// are edge"). One MultiPolygon; overlapping circles are drawn as one blob by the map's fill.
export function coverageGeoJSON(repeaters, km = DEFAULT_EDGE_KM) {
  return { type: "Feature", properties: {},
    geometry: { type: "MultiPolygon", coordinates: (repeaters || []).map((n) => [circleRing(n.lat, n.lng, km)]) } };
}

// The region's border features as MultiPolygon coordinate lists.
export function borderPolygons(borders) {
  return (borders || []).flatMap((f) =>
    f?.geometry?.type === "MultiPolygon" ? f.geometry.coordinates
      : f?.geometry?.type === "Polygon" ? [f.geometry.coordinates] : []);
}

// Where the spot lies: "outside" the region (only when a border is known), at the "edge"
// (outside every circle), or "inside" today's coverage.
export function placeKind(lat, lon, repeaters, polygons, km = DEFAULT_EDGE_KM) {
  if (polygons?.length && distanceKm(lat, lon, polygons) > 0) return "outside";
  return nearestKm(lat, lon, repeaters) > km ? "edge" : "inside";
}

// Strengths and tips from the answers: lists of text keys, in the order the questions come.
// a = { height: high|mid|low, view: open|partial|blocked, power: mains|none, wifi: yes|no,
//       shadow: yes|no|unknown, place: edge|inside|outside|null }. Unanswered keys are skipped.
export function assess(a) {
  const s = [], t = [];
  if (a.height === "high") s.push("high"); else if (a.height === "mid") s.push("mid"); else if (a.height === "low") t.push("low");
  if (a.view === "open") s.push("view"); else if (a.view === "partial") t.push("partial"); else if (a.view === "blocked") t.push("blocked");
  if (a.power === "mains") s.push("power"); else if (a.power === "none") t.push("solar");
  if (a.wifi === "yes") s.push("wifi"); else if (a.wifi === "no") t.push("nowifi");
  if (a.place === "edge") s.push("edge"); else if (a.place === "inside") s.push("inside"); else if (a.place === "outside") t.push("outside");
  if (a.shadow === "yes") s.push("shadow");
  return { strengths: s, tips: t };
}

// The position for the chat summary: 2 decimals, about 1 km, never the exact spot.
export const coarse = (x) => (Math.round(x * 100) / 100).toFixed(2);
