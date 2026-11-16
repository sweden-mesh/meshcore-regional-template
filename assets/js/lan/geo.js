// National mode: which county a position lies in, from se-lan.geojson ([lon, lat] rings). Used by
// the county map (outside-county marks) and the wizards (the picked position's county).

// Ray casting over one ring.
function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// A geometry (Polygon or MultiPolygon) holds the point when its outer ring does and no hole does.
export function inGeometry(lng, lat, g) {
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  return polys.some(([outer, ...holes]) => inRing(lng, lat, outer) && !holes.some((h) => inRing(lng, lat, h)));
}

// The SCB code of the county a position lies in, or null (at sea, abroad).
export function countyAt(geo, lng, lat) {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const f = geo.features.find((x) => inGeometry(lng, lat, x.geometry));
  return f ? f.properties.scb : null;
}

// Nodes with a position outside the county's geometry are marked possiblyForeign, as Beacon marks
// nodes outside an IATA's border, so the map's "outside the region" toggle and dimming apply.
// Nodes without a position are left as they are.
export function markOutside(nodes, geometry) {
  if (!geometry) return nodes;
  return (nodes || []).map((n) => {
    if (!Number.isFinite(n.lat) || !Number.isFinite(n.lng) || (n.lat === 0 && n.lng === 0)) return n;
    return inGeometry(n.lng, n.lat, geometry) ? n : { ...n, possiblyForeign: true };
  });
}
