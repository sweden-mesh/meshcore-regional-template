// National mode: the wizards' values for a county, pure (tests/lan-wizard.test.mjs).

// The scope, the name pattern (as layouts/_partials/name-pattern.html derives it) and the map code.
export function wizardValues(c) {
  if (!c) return { scope: "se", pattern: "", iata: "" };
  return { scope: c.scope, pattern: `${c.scope.toUpperCase()}-Plats`, iata: c.iata || "" };
}

// The neighbour box's areas, as layouts/_partials/wizard-neighbours.html builds them for a
// regional site: every neighbouring county with its scope, 40 km over land and 80 over water.
export function neighbourAreas(c, counties, shapes) {
  return (c?.neighbours || []).map((n) => {
    const other = counties.find((x) => x.scb === n.scb);
    return { scope: n.scope, lan: other ? other.name : n.scb, km: n.via === "vatten" ? 80 : 40, rings: shapes[n.scb] || [] };
  });
}

// "Vald plats: 57.7812, 14.1612" → { lat, lon }; anything else → null.
export function posFromText(text) {
  const m = /(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\s*$/.exec((text || "").trim());
  if (!m) return null;
  const lat = Number(m[1]), lon = Number(m[2]);
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
}
