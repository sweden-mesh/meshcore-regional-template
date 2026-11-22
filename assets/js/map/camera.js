// Where the map starts and how it frames the region. Pure functions, tested
// with node --test (tests/).

// params.region.center is [lat, lng]; MapLibre wants [lng, lat].
export function startCamera(ds) {
  let center = [16, 62];
  try {
    const c = JSON.parse(ds.center || "null");
    if (Array.isArray(c) && c.length === 2 && c.every(Number.isFinite)) center = [c[1], c[0]];
  } catch { /* keep the default */ }
  const zoom = Number(ds.zoom);
  return { center, zoom: Number.isFinite(zoom) ? zoom : 5 };
}

// A GeoJSON bbox [w, s, e, n] (2D) as MapLibre bounds, or null if unusable.
export function bboxToBounds(bbox) {
  if (!Array.isArray(bbox) || bbox.length < 4) return null;
  const [w, s, e, n] = bbox.length === 6 ? [bbox[0], bbox[1], bbox[3], bbox[4]] : bbox;
  if (![w, s, e, n].every(Number.isFinite) || w >= e || s >= n) return null;
  return [[w, s], [e, n]];
}

// Frame the map on the region once its outline is known; keeps the user's
// view if they have already moved the map.
export function frameRegion(map, bounds) {
  if (!bounds || map.__userMoved) return;
  map.fitBounds(bounds, { padding: 24, duration: 0 });
}

export function trackUserMoves(map) {
  const mark = (e) => { if (e.originalEvent) map.__userMoved = true; };
  map.on("movestart", mark);
}

// Bounds of the nodes worth framing: positioned, not possiblyForeign. Null when
// fewer than two, so the caller falls back to the region's border.
export function nodesBounds(nodes) {
  const pts = (nodes || []).filter((n) => !n.possiblyForeign && Number.isFinite(n.lat) && Number.isFinite(n.lng) && !(n.lat === 0 && n.lng === 0));
  if (pts.length < 2) return null;
  const lngs = pts.map((n) => n.lng), lats = pts.map((n) => n.lat);
  return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
}

export const FIT_MAX_ZOOM = 12;
export function frameNodes(map, bounds) {
  if (!bounds || map.__userMoved) return false;
  map.fitBounds(bounds, { padding: 48, maxZoom: FIT_MAX_ZOOM, duration: 0 });
  return true;
}

// Widening the view to what a toggle switches on (operator 2026-11-15): switching on
// "Utanför regionen" or "Önskade platser" can show items past the map's edge. The view only
// ever grows to take them in; switching off does not zoom back. Bounds are [[w, s], [e, n]].
export const FIT_PADDING = 48; // as frameNodes

// [lng, lat] of the nodes on the map: positioned, and possiblyForeign only while shown.
export function nodePoints(nodes, foreign) {
  return (nodes || []).filter((n) => (foreign || !n.possiblyForeign) && Number.isFinite(n.lat) && Number.isFinite(n.lng)
    && !(n.lat === 0 && n.lng === 0)).map((n) => [n.lng, n.lat]);
}

// Bounds of [lng, lat] points, or null when there are none.
export function pointsBounds(points) {
  const ps = (points || []).filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]));
  if (!ps.length) return null;
  const lngs = ps.map((p) => p[0]), lats = ps.map((p) => p[1]);
  return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
}

// The smallest bounds holding all the given ones; nulls are skipped, null when none is left.
export function expandBounds(...list) {
  const bs = list.filter(Boolean);
  if (!bs.length) return null;
  return pointsBounds(bs.flatMap((b) => [b[0], b[1]]));
}

// True when `items` reach outside `view`; nothing to show never needs a wider view.
export function needsWiden(view, items) {
  if (!items) return false;
  if (!view) return true;
  return items[0][0] < view[0][0] || items[0][1] < view[0][1] || items[1][0] > view[1][0] || items[1][1] > view[1][1];
}

// Widen the map, once, so `items` fit inside the padding: from the current view, so it only
// zooms out or pans, never in. Animated briefly unless the visitor asks for reduced motion.
// The padding, at most a quarter of a small map's width or height.
function fitPad(map, padding) {
  const c = map.getContainer();
  return Math.min(padding, c.clientWidth / 4, c.clientHeight / 4);
}
const calm = () => typeof document !== "undefined" && document.documentElement.dataset.motion === "off";

// Which map toggles widen the view when switched on (B-304): only "Önskade platser". "Utanför
// regionen" shows or hides nodes and leaves the camera alone; the fit button frames what is shown.
export function togglesWiden(key, on) {
  return key === "want" && !!on;
}
export function widenToFit(map, items, { padding = FIT_PADDING, animate = true } = {}) {
  if (!items) return false;
  const c = map.getContainer();
  const pad = fitPad(map, padding);
  // The view inside the padding; 2 px of slack, so a view this function fitted fits again.
  const inner = (k) => {
    const sw = map.unproject([k, c.clientHeight - k]), ne = map.unproject([c.clientWidth - k, k]);
    return [[sw.lng, sw.lat], [ne.lng, ne.lat]];
  };
  if (!needsWiden(inner(Math.max(0, pad - 2)), items)) return false;
  map.fitBounds(expandBounds(inner(pad), items),
    { padding: pad, maxZoom: map.getZoom(), duration: animate && !calm() ? 500 : 0 });
  return true;
}

// The fit button under the zoom buttons (B-286): what it frames is what is shown, the nodes
// (foreign ones while "Utanför regionen" is on) and the wanted places' circles while on; never the
// region's border. Null when nothing is shown.
export function fitItems(nodes, foreign, wantBox) {
  return expandBounds(pointsBounds(nodePoints(nodes, foreign)), wantBox);
}

// Frame `items` exactly, padded as widenToFit: unlike it, this zooms in as well as out (up to the
// zoom the first framing stops at).
export function fitTo(map, items, { padding = FIT_PADDING, animate = true } = {}) {
  if (!items) return false;
  map.fitBounds(items, { padding: fitPad(map, padding), maxZoom: FIT_MAX_ZOOM, duration: animate && !calm() ? 500 : 0 });
  return true;
}
