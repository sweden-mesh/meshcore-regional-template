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

export function frameNodes(map, bounds) {
  if (!bounds || map.__userMoved) return false;
  map.fitBounds(bounds, { padding: 48, maxZoom: 12, duration: 0 });
  return true;
}
