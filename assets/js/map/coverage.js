// MeshMapper coverage: the compact file written at build time
// (layouts/_partials/meshmapper-coverage.html) turned into map polygons.
// A row is [latIdx, lonIdx, kind, eff10, ageDays, type, pings]; a square's south
// edge is latIdx × grid[0] and its west edge lonIdx × grid[1].

export const OLD_DAYS = 90;

// Four bands by MeshMapper's `effective` (0–3, the mean score of the square's pings),
// cut at the measured quartiles of Jönköping's working squares: < 1.0, 1.0–1.75,
// 1.75–2.25, ≥ 2.25. eff10 is effective × 10, rounded.
export function band(eff10) {
  return eff10 < 10 ? 0 : eff10 < 17.5 ? 1 : eff10 < 22.5 ? 2 : 3;
}

const r6 = (x) => Math.round(x * 1e6) / 1e6;

export function toGeoJSON(data) {
  const [dLat, dLon] = data?.grid || [];
  const features = [];
  if (!(dLat > 0 && dLon > 0)) return { type: "FeatureCollection", features };
  for (const [li, lo, kind, eff10, ageDays, type, pings] of data.squares || []) {
    const s = r6(li * dLat), n = r6((li + 1) * dLat), w = r6(lo * dLon), e = r6((lo + 1) * dLon);
    features.push({
      type: "Feature",
      properties: { kind, band: band(eff10), eff10, old: ageDays > OLD_DAYS, ageDays, type: data.types?.[type] ?? "", pings },
      geometry: { type: "Polygon", coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] },
    });
  }
  return { type: "FeatureCollection", features };
}
